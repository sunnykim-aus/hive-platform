"use client"
import { useState } from "react"

interface DigestResult {
  digest: string
  generated_at: string
}

export default function DigestPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DigestResult | null>(null)
  const [error, setError] = useState("")

  async function generateDigest() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/digest", { method: "POST" })
      if (!res.ok) throw new Error("Digest generation failed")
      const data = await res.json()
      setResult(data)
    } catch {
      setError("Digest generation failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: "#0b1220", minHeight: "100vh" }}>
      <div className="page-container">

        <div className="page-header">
          <h1 className="page-title">HIVE Digest</h1>
          <p className="page-subtitle">
            Weekly intelligence summary for Australian housing sector professionals. Synthesises the latest building approvals, SHS data, HAFF updates, and policy movements into a concise briefing.
          </p>
        </div>

        {/* What is HIVE Digest */}
        <div className="hive-card" style={{ marginBottom: 28 }}>
          <div className="section-label">What is HIVE Digest?</div>
          <div className="grid-3" style={{ marginBottom: 16 }}>
            {[
              { label: "Weekly Summary", desc: "A concise briefing on housing sector indicators, updated from live data sources." },
              { label: "AI Synthesis", desc: "Claude synthesises key data points into plain-language narrative with context." },
              { label: "For Practitioners", desc: "Designed for housing professionals, policy analysts, and sector advocates." },
            ].map(({ label, desc }) => (
              <div key={label}>
                <div style={{ fontWeight: 700, color: "#f6c90e", marginBottom: 6, fontSize: "0.88rem" }}>{label}</div>
                <div style={{ fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #1e2d40", paddingTop: 16 }}>
            <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: 16, lineHeight: 1.6 }}>
              The digest includes: building approvals run rate vs Accord target, SHS unmet demand update, HAFF delivery progress, key state waitlist movements, and sector context.
            </div>
            <button
              className="hive-btn"
              onClick={generateDigest}
              disabled={loading}
              style={{ padding: "12px 28px", fontSize: "0.88rem", borderRadius: 10 }}
            >
              {loading ? "Generating Digest..." : "Generate Weekly Digest"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="callout-red" style={{ marginBottom: 20, fontSize: "0.85rem", color: "#c0614a" }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="hive-card" style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: 12 }}>Compiling weekly digest...</div>
            <div style={{ fontSize: "0.82rem" }}>Gathering live indicators, synthesising with AI...</div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="hive-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div className="section-label" style={{ marginBottom: 0 }}>Weekly Intelligence Digest</div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Generated {new Date(result.generated_at).toLocaleDateString("en-AU", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
            </div>
            <div style={{ fontSize: "0.88rem", color: "#cbd5e1", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
              {result.digest}
            </div>
          </div>
        )}

        {/* Sample indicators */}
        {!result && !loading && (
          <div>
            <div className="section-label">Digest Covers These Indicators</div>
            <div className="grid-2">
              {[
                { title: "Building Approvals", desc: "Monthly ABS data vs 20,000/month Accord pace. Annual run rate and trend direction." },
                { title: "SHS Demand", desc: "Unmet requests, total clients, housing success rate. Year-on-year change." },
                { title: "HAFF Delivery", desc: "Progress toward 30,000-home target. Round status and construction milestones." },
                { title: "State Waitlists", desc: "Current waitlist totals for NSW, VIC, QLD, WA, SA. Quarterly change." },
                { title: "Construction Costs", desc: "Current cost index relative to 2019 baseline. What $1B buys now vs then." },
                { title: "Policy Updates", desc: "Recent government announcements, program changes, and policy developments." },
              ].map(({ title, desc }) => (
                <div key={title} className="hive-card">
                  <div style={{ fontWeight: 700, color: "#fff", marginBottom: 6, fontSize: "0.88rem" }}>{title}</div>
                  <div style={{ fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.6 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
