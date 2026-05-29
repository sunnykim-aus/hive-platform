"use client"
import { useState } from "react"
import { POLICY_TIMELINE, TYPE_LABELS, TYPE_COLORS } from "@/lib/data/policy-timeline"

interface PolicyImpactResult {
  answer: string
  sources: { index: number; title: string; agency: string; year: string; url: string; score: number }[]
}

export default function PolicyImpactPage() {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PolicyImpactResult | null>(null)
  const [error, setError] = useState("")

  const policy = POLICY_TIMELINE[selectedIdx]

  async function analyseImpact() {
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const res = await fetch("/api/policy-impact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          policyName: policy.event,
          fundingAmount: policy.amount_bn,
          year: policy.year,
        }),
      })
      if (!res.ok) throw new Error("Analysis failed")
      const data = await res.json()
      setResult(data)
    } catch {
      setError("Analysis failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: "#0f0f1a", minHeight: "100vh" }}>
      <div className="page-container">

        <div className="page-header">
          <h1 className="page-title">Policy Impact Analysis</h1>
          <p className="page-subtitle">
            Select a major Australian housing policy and analyse its impact using the indexed research base. Evidence synthesised from 681 reports across AHURI, AIHW, government evaluations, and academic literature.
          </p>
        </div>

        {/* Policy selector */}
        <div className="hive-card" style={{ marginBottom: 24 }}>
          <div className="section-label">Select Policy</div>
          <select
            value={selectedIdx}
            onChange={(e) => { setSelectedIdx(Number(e.target.value)); setResult(null) }}
            style={{
              width: "100%",
              background: "#0f0f1a",
              border: "1.5px solid #2a2a4e",
              borderRadius: 10,
              color: "#fff",
              padding: "10px 14px",
              fontSize: "0.88rem",
              marginBottom: 16,
              cursor: "pointer",
            }}
          >
            {POLICY_TIMELINE.map((p, i) => (
              <option key={i} value={i} style={{ background: "#1a1a2e" }}>
                {p.year} — {p.event}
              </option>
            ))}
          </select>

          {/* Policy metrics */}
          <div className="grid-3" style={{ marginBottom: 16 }}>
            <div className="kpi-card">
              <div className="kpi-label">Year Announced</div>
              <div className="kpi-value" style={{ fontSize: "1.6rem", color: "#f6c90e" }}>{policy.year}</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Investment</div>
              <div className="kpi-value" style={{ fontSize: "1.6rem", color: "#27ae60" }}>${policy.amount_bn}B</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Policy Type</div>
              <div style={{ marginTop: 8 }}>
                <span className="badge" style={{ background: `${TYPE_COLORS[policy.type]}22`, color: TYPE_COLORS[policy.type], border: `1px solid ${TYPE_COLORS[policy.type]}44` }}>
                  {TYPE_LABELS[policy.type]}
                </span>
              </div>
            </div>
          </div>

          <button
            className="hive-btn"
            onClick={analyseImpact}
            disabled={loading}
            style={{ padding: "12px 28px", fontSize: "0.88rem", borderRadius: 10 }}
          >
            {loading ? "Analysing..." : "Analyse Impact"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="callout-red" style={{ marginBottom: 20, fontSize: "0.85rem", color: "#e74c3c" }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="hive-card" style={{ textAlign: "center", padding: 40, color: "#666" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: 12 }}>Searching evidence base...</div>
            <div style={{ fontSize: "0.82rem" }}>Querying 681 reports for &quot;{policy.event}&quot;</div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div>
            <div className="hive-card" style={{ marginBottom: 20 }}>
              <div className="section-label">Evidence Synthesis</div>
              <div style={{ fontSize: "0.88rem", color: "#ccc", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                {result.answer}
              </div>
            </div>

            {result.sources.length > 0 && (
              <div>
                <div className="section-label">Sources Referenced</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.sources.map((s) => (
                    <div key={s.index} className="source-card">
                      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ color: "#f6c90e", fontWeight: 700, minWidth: 24 }}>[{s.index}]</span>
                        <div>
                          <div style={{ color: "#fff", fontWeight: 600, marginBottom: 2 }}>{s.title}</div>
                          <div style={{ color: "#888", fontSize: "0.75rem" }}>
                            {s.agency}{s.year ? ` · ${s.year}` : ""}
                            {s.url && (
                              <> · <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: "#3498db" }}>source</a></>
                            )}
                          </div>
                        </div>
                        <div style={{ marginLeft: "auto", fontSize: "0.68rem", color: "#555" }}>
                          score: {(s.score * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Policy list */}
        {!result && !loading && (
          <div>
            <div className="section-label">All Policies Available for Analysis</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {POLICY_TIMELINE.map((p, i) => (
                <div
                  key={i}
                  className="hive-card hive-card-hover"
                  style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 16 }}
                  onClick={() => { setSelectedIdx(i); setResult(null) }}
                >
                  <div style={{ width: 50, textAlign: "center" }}>
                    <span style={{ fontWeight: 800, color: "#f6c90e", fontSize: "1rem" }}>{p.year}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: "#fff", fontSize: "0.88rem", marginBottom: 2 }}>{p.event}</div>
                    <div style={{ fontSize: "0.75rem", color: "#666" }}>${p.amount_bn}B investment</div>
                  </div>
                  <span className="badge" style={{ background: `${TYPE_COLORS[p.type]}22`, color: TYPE_COLORS[p.type], border: `1px solid ${TYPE_COLORS[p.type]}44`, fontSize: "0.65rem" }}>
                    {TYPE_LABELS[p.type]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
