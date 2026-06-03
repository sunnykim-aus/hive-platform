// Server-side auth + tier helpers. Use from Server Components, Route Handlers,
// and Server Functions to enforce entitlements (defence in depth beyond proxy).
import { createClient } from "@/lib/supabase/server"
import type { Tier } from "@/lib/entitlements"
import { meetsTier, hasFeature, type Feature } from "@/lib/entitlements"

export type Session = {
  userId: string | null
  email: string | null
  tier: Tier
}

/** Resolve the current user and their tier. Anonymous users are `free`. */
export async function getSession(): Promise<Session> {
  // Auth not configured yet → everyone is anonymous `free` (site stays open).
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return { userId: null, email: null, tier: "free" }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { userId: null, email: null, tier: "free" }

  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .single()

  return {
    userId: user.id,
    email: user.email ?? null,
    tier: (profile?.tier ?? "free") as Tier,
  }
}

/** Throwable guard for Route Handlers / Server Functions. */
export async function requireTier(required: Tier): Promise<Session> {
  const session = await getSession()
  if (!meetsTier(session.tier, required)) {
    throw new Error(`Forbidden: requires ${required} tier`)
  }
  return session
}

export async function requireFeature(feature: Feature): Promise<Session> {
  const session = await getSession()
  if (!hasFeature(session.tier, feature)) {
    throw new Error(`Forbidden: requires the ${feature} feature`)
  }
  return session
}
