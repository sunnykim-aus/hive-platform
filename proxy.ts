// Next.js 16 Proxy (formerly "middleware"). Runs before each matched route to:
//   1. refresh the Supabase auth session (cookie rotation)
//   2. gate routes by tier using lib/entitlements
//
// Free routes stay open to anonymous visitors. Paid routes require a session;
// insufficient tier is redirected to /locked. Server Functions and API routes
// must ALSO enforce their own checks (see lib/auth.ts) — proxy is not the only
// line of defence.
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { routeMinTier, meetsTier, type Tier } from "@/lib/entitlements"

export async function proxy(request: NextRequest) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Fail open: if auth isn't configured yet, leave the site fully open exactly
  // as before. Gating only activates once the Supabase env vars are set.
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return NextResponse.next({ request })
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // IMPORTANT: getUser() refreshes the session; do not run code between
  // createServerClient and getUser.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const required = routeMinTier(path)

  // Free / public routes — always allowed (anonymous OK).
  if (required === "free") return response

  // Gated route but no session → send to login, remember where they were going.
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", path)
    return carryCookies(NextResponse.redirect(url), response)
  }

  // Logged in → look up tier and enforce.
  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .single()
  const tier = (profile?.tier ?? "free") as Tier

  if (!meetsTier(tier, required)) {
    const url = request.nextUrl.clone()
    url.pathname = "/locked"
    url.searchParams.set("needs", required)
    url.searchParams.set("from", path)
    return carryCookies(NextResponse.redirect(url), response)
  }

  return response
}

/** Copy any refreshed auth cookies from the working response onto a redirect. */
function carryCookies(redirect: NextResponse, from: NextResponse) {
  from.cookies.getAll().forEach((c) => redirect.cookies.set(c))
  return redirect
}

export const config = {
  // Run on everything except API routes, Next internals, and static files.
  // API routes enforce their own auth via lib/auth.ts.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.\\w+$).*)"],
}
