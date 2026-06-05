"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

const TIER_COLORS: Record<string, string> = {
  free: "#6b8aa0",
  pro: "#5aad8a",
  enterprise: "#5aad8a",
  government: "#f6c90e",
}

export default function NavAuth() {
  const [loaded, setLoaded] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [tier, setTier] = useState<string>("free")

  useEffect(() => {
    // Auth not configured (e.g. preview without env) → render nothing.
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setLoaded(true)
      return
    }
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setEmail(user.email ?? null)
        const { data: profile } = await supabase
          .from("profiles")
          .select("organisations(tier)")
          .eq("id", user.id)
          .single()
        const org = profile?.organisations as { tier?: string } | null
        setTier(org?.tier ?? "free")
      }
      setLoaded(true)
    })
  }, [])

  if (!loaded) return null

  const chip: React.CSSProperties = {
    fontSize: "0.67rem",
    fontWeight: 700,
    letterSpacing: "0.3px",
    borderRadius: 4,
    padding: "3px 10px",
    textDecoration: "none",
  }

  if (!email) {
    return (
      <a
        href="/login"
        style={{ ...chip, background: "rgba(246,201,14,0.12)", border: "1px solid rgba(246,201,14,0.35)", color: "#f6c90e" }}
      >
        Log in
      </a>
    )
  }

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.assign("/")
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span
        title={email}
        style={{
          fontSize: "0.67rem",
          color: "#6b8aa0",
          maxWidth: 160,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {email}
      </span>
      <span style={{ ...chip, color: TIER_COLORS[tier] ?? "#6b8aa0", border: `1px solid ${(TIER_COLORS[tier] ?? "#6b8aa0")}40`, textTransform: "uppercase" }}>
        {tier}
      </span>
      <button
        onClick={signOut}
        style={{
          fontSize: "0.67rem",
          fontWeight: 600,
          color: "#c8d8e8",
          background: "transparent",
          border: "1px solid #1e2d40",
          borderRadius: 4,
          padding: "3px 9px",
          cursor: "pointer",
        }}
      >
        Sign out
      </button>
    </div>
  )
}
