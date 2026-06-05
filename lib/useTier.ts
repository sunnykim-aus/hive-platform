"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { type Tier } from "@/lib/entitlements"

/**
 * Client-side tier resolution for in-page gating.
 * - `loaded`: false until we know the user's tier
 * - `gatingActive`: false when Supabase env is absent (fail open → show all)
 */
export function useTier(): { tier: Tier; loaded: boolean; gatingActive: boolean } {
  const [tier, setTier] = useState<Tier>("free")
  const [loaded, setLoaded] = useState(false)

  const gatingActive = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )

  useEffect(() => {
    if (!gatingActive) {
      setLoaded(true)
      return
    }
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("organisations(tier)")
          .eq("id", user.id)
          .single()
        const org = data?.organisations as { tier?: Tier } | null
        setTier((org?.tier ?? "free") as Tier)
      }
      setLoaded(true)
    })
  }, [gatingActive])

  return { tier, loaded, gatingActive }
}
