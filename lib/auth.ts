// Server-side auth + tier helpers. Use from Server Components, Route Handlers,
// and Server Functions to enforce entitlements (defence in depth beyond proxy).
import { createClient } from "@/lib/supabase/server"
import type { Tier } from "@/lib/entitlements"
import { meetsTier, hasFeature, type Feature } from "@/lib/entitlements"

export type Session = {
  userId: string | null
  email: string | null
  tier: Tier
  orgId: string | null
  orgName: string | null
}

/** Resolve the current user and their tier. Anonymous users are `free`. */
export async function getSession(): Promise<Session> {
  // Auth not configured yet → everyone is anonymous `free` (site stays open).
  const anon: Session = {
    userId: null,
    email: null,
    tier: "free",
    orgId: null,
    orgName: null,
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return anon
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return anon

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id, organisations(tier, name)")
    .eq("id", user.id)
    .single()

  const org = profile?.organisations as { tier?: Tier; name?: string } | null

  return {
    userId: user.id,
    email: user.email ?? null,
    tier: (org?.tier ?? "free") as Tier,
    orgId: profile?.org_id ?? null,
    orgName: org?.name ?? null,
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
