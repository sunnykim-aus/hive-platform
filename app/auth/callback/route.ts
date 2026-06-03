// Magic-link landing route. Supports both flows:
//   - PKCE:       ?code=...            → exchangeCodeForSession
//   - token_hash: ?token_hash=&type=  → verifyOtp (resilient to email
//                                        scanners and cross-device clicks)
import { type EmailOtpType } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const next = searchParams.get("next") ?? "/"

  const supabase = await createClient()

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    })
    if (!error) return NextResponse.redirect(`${origin}${next}`)
    console.error("[auth/callback] verifyOtp failed:", error.message)
    return NextResponse.redirect(`${origin}/login?error=link`)
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
    console.error("[auth/callback] exchangeCodeForSession failed:", error.message)
    return NextResponse.redirect(`${origin}/login?error=link`)
  }

  console.error("[auth/callback] no code or token_hash in request")
  return NextResponse.redirect(`${origin}/login?error=link`)
}
