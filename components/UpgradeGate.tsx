// Wraps a premium in-page section. When `locked` is true the children are
// blurred and a small upsell overlay is shown. Presentational only — the page
// decides `locked` from the user's tier (see lib/auth.ts getSession + lib
// /entitlements canSeeSection).
import type { ReactNode } from "react"
import { TIER_LABEL, type Tier } from "@/lib/entitlements"

export default function UpgradeGate({
  locked,
  needs = "pro",
  label,
  children,
}: {
  locked: boolean
  needs?: Tier
  label?: string
  children: ReactNode
}) {
  if (!locked) return <>{children}</>

  const tierLabel = TIER_LABEL[needs]

  return (
    <div style={{ position: "relative" }}>
      <div
        aria-hidden
        style={{
          filter: "blur(6px)",
          pointerEvents: "none",
          userSelect: "none",
          opacity: 0.5,
        }}
      >
        {children}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 12,
          padding: 24,
          background:
            "linear-gradient(180deg, rgba(7,13,24,0.55), rgba(7,13,24,0.85))",
          borderRadius: 12,
        }}
      >
        <span style={{ fontSize: "1.6rem" }}>🔒</span>
        <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>
          {label ?? `Unlock with ${tierLabel}`}
        </p>
        <a
          href="https://impactanalyticsaustralia.com.au/#contact"
          style={{
            background: "#f6c90e",
            color: "#0b1220",
            fontWeight: 800,
            borderRadius: 8,
            padding: "9px 18px",
            fontSize: "0.82rem",
            textDecoration: "none",
          }}
        >
          Upgrade to {tierLabel}
        </a>
      </div>
    </div>
  )
}
