import Link from "next/link"
import { Suspense } from "react"
import { TIER_LABEL, type Tier } from "@/lib/entitlements"

const UPGRADE_BLURB: Record<Tier, string> = {
  free: "",
  pro: "Full platform for mid-size CHPs, consultants, and grant writers — Development Viability, Sustainability suite, Asset Intelligence, full RAG search, and exports.",
  enterprise:
    "For Tier 1 CHPs and housing authorities with active development pipelines — multi-user teams, branded reports, HAFF submission pack, and priority data.",
  government:
    "For state and territory housing authorities — policy scenario modelling, state briefing documents, custom data feeds, and unlimited users.",
}

function LockedContent({
  searchParams,
}: {
  searchParams: { needs?: string; from?: string }
}) {
  const needs = (searchParams.needs ?? "pro") as Tier
  const label = TIER_LABEL[needs] ?? "a higher tier"

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070d18",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 440, textAlign: "center" }}>
        <div style={{ fontSize: "2.4rem", marginBottom: 14 }}>🔒</div>
        <p
          style={{
            color: "#f6c90e",
            fontWeight: 800,
            letterSpacing: "0.5px",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          {label} required
        </p>
        <h1
          style={{
            color: "#fff",
            fontSize: "1.5rem",
            fontWeight: 800,
            marginBottom: 12,
          }}
        >
          This module is part of {label}
        </h1>
        <p
          style={{
            color: "#6b8aa0",
            fontSize: "0.92rem",
            lineHeight: 1.6,
            marginBottom: 26,
          }}
        >
          {UPGRADE_BLURB[needs]}
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href="https://impactanalyticsaustralia.com.au/#contact"
            style={{
              background: "#f6c90e",
              color: "#0b1220",
              fontWeight: 800,
              borderRadius: 8,
              padding: "11px 20px",
              fontSize: "0.88rem",
              textDecoration: "none",
            }}
          >
            Upgrade to {label}
          </a>
          <Link
            href="/"
            style={{
              border: "1px solid #1e2d40",
              color: "#c8d8e8",
              fontWeight: 600,
              borderRadius: 8,
              padding: "11px 20px",
              fontSize: "0.88rem",
              textDecoration: "none",
            }}
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default async function LockedPage({
  searchParams,
}: {
  searchParams: Promise<{ needs?: string; from?: string }>
}) {
  const sp = await searchParams
  return (
    <Suspense fallback={null}>
      <LockedContent searchParams={sp} />
    </Suspense>
  )
}
