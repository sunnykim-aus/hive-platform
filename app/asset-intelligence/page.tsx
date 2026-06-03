"use client"
import { useState, useMemo, useEffect } from "react"
import {
  getAllCompoundRisks, getCompoundStats, getCompoundByState,
  COMPOUND_RISK_COLORS, type CompoundRiskResult, type CompoundRiskBand,
} from "@/lib/data/asset-intelligence"
import { ALL_STATES } from "@/lib/data/climate-risk"
import { RISK_COLORS as CLIMATE_COLORS } from "@/lib/data/climate-risk"
import { usePortfolio } from "@/lib/usePortfolio"

const BAND_ORDER: CompoundRiskBand[] = ["Extreme", "Critical", "High", "Moderate", "Low"]

function BandBadge({ band, small }: { band: CompoundRiskBand; small?: boolean }) {
  const color = COMPOUND_RISK_COLORS[band]
  return (
    <span style={{
      display: "inline-block", padding: small ? "1px 7px" : "2px 10px", borderRadius: 4,
      fontSize: small ? "0.58rem" : "0.65rem", fontWeight: 700,
      background: `${color}18`, color, border: `1px solid ${color}33`,
    }}>{band}</span>
  )
}

function MiniBar({ score, color, max = 100 }: { score: number; color: string; max?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ flex: 1, background: "#1e2d40", borderRadius: 3, height: 5, overflow: "hidden" }}>
        <div style={{ width: `${Math.min(100, (score/max)*100)}%`, height: "100%", background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: "0.7rem", fontWeight: 700, color, minWidth: 28 }}>{score}</span>
    </div>
  )
}

export default function AssetIntelligencePage() {
  const [stateFilter, setStateFilter] = useState("All")
  const [bandFilter, setBandFilter]   = useState("All")
  const [suburbSearch, setSuburbSearch] = useState("")
  const [expandedId, setExpandedId]   = useState<string | null>(null)
  const [numDwellings, setNumDwellings] = useState(50)
  const { portfolio } = usePortfolio()

  // Pre-filter to portfolio state on mount
  useEffect(() => {
    if (portfolio?.primary_state && portfolio.primary_state !== "All" && ALL_STATES.includes(portfolio.primary_state)) {
      setStateFilter(portfolio.primary_state)
    }
  }, [portfolio?.primary_state])

  const allResults = useMemo(() => getAllCompoundRisks(), [])
  const stats      = useMemo(() => getCompoundStats(), [])

  const filtered = useMemo(() =>
    allResults
      .filter(r => stateFilter === "All" || r.suburb.state === stateFilter)
      .filter(r => bandFilter === "All" || r.compound_band === bandFilter)
      .filter(r => !suburbSearch || r.suburb.suburb_name.toLowerCase().includes(suburbSearch.toLowerCase()) || r.suburb.lga_name.toLowerCase().includes(suburbSearch.toLowerCase())),
    [allResults, stateFilter, bandFilter, suburbSearch]
  )

  return (
    <div style={{ background: "#0b1220", minHeight: "100vh" }}>
      <div className="page-container">

        {/* Header */}
        {/* ── Breadcrumb ── */}
        <div style={{ marginBottom: 8, marginTop: 4 }}>
          <a href="/sustainability" style={{ fontSize: "0.72rem", color: "#1abc9c", textDecoration: "none", fontWeight: 600 }}>← Sustainability</a>
        </div>

        <div className="page-header" style={{ borderLeft: "3px solid #c0614a" }}>
          <h1 className="page-title">Asset Intelligence</h1>
          <p className="page-subtitle">
            Compound vulnerability assessment combining{" "}
            <strong style={{ color: "#c0614a" }}>climate risk</strong>,{" "}
            <strong style={{ color: "#c49a3a" }}>building energy performance</strong>, and{" "}
            <strong style={{ color: "#8899aa" }}>livable housing compliance</strong>{" "}
            into a single score per suburb. Identifies the social housing stock experiencing simultaneous failure
            across all three dimensions — the "triple failure" that creates Australia's most urgent housing welfare crisis.
          </p>
          <div style={{ fontSize: "0.72rem", color: "#4a5a6a", marginTop: 8 }}>
            Sources: HIVE Climate Risk (152 suburbs) · CSIRO NatHERS 2023 · AHURI Accessible Housing 2022 · Housing Australia HAFF Design Guidelines
          </div>
        </div>

        {/* National KPIs */}
        <div className="grid-4" style={{ marginBottom: 20 }}>
          {[
            { label: "Extreme Risk Suburbs", value: stats.extreme, color: COMPOUND_RISK_COLORS.Extreme, delta: "Score ≥80 — triple failure across all three dimensions" },
            { label: "Critical Risk Suburbs", value: stats.critical, color: COMPOUND_RISK_COLORS.Critical, delta: "Score 65–79 — severe compound vulnerability" },
            { label: "High+ Risk Suburbs", value: stats.total_high_plus, color: COMPOUND_RISK_COLORS.High, delta: "Requiring urgent cross-domain intervention" },
            { label: "Not HAFF Round 4 Ready", value: stats.haff_not_ready, color: "#c49a3a", delta: "Climate, energy or LHD gaps block Round 4 compliance" },
          ].map(({ label, value, color, delta }) => (
            <div key={label} className="kpi-card" style={{ borderTop: `3px solid ${color}` }}>
              <div className="kpi-label">{label}</div>
              <div className="kpi-value" style={{ color }}>{value}</div>
              <div className="kpi-delta">{delta}</div>
            </div>
          ))}
        </div>

        {/* Worst suburb highlight */}
        {stats.worst && (() => {
          const w = stats.worst
          const color = w.compound_color
          return (
            <div style={{
              background: "#111827", border: `1px solid ${color}44`, borderLeft: `4px solid ${color}`,
              borderRadius: "0 10px 10px 0", padding: "16px 22px", marginBottom: 24,
            }}>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>
                ⚠ Worst compound risk nationally
              </div>
              <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: "2.4rem", fontWeight: 900, color, lineHeight: 1 }}>{w.compound_score}</div>
                  <div style={{ fontSize: "0.6rem", color: "#4a5a6a" }}>/100 compound</div>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 800, color: "#e8edf2", fontSize: "0.9rem", marginBottom: 4 }}>
                    {w.suburb.suburb_name} <BandBadge band={w.compound_band} small />
                    <span style={{ fontSize: "0.68rem", color: "#4a5a6a", marginLeft: 8 }}>{w.suburb.state} · {w.suburb.lga_name}</span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#7a8fa8", lineHeight: 1.6 }}>{w.compound_narrative}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, minWidth: 320 }}>
                  {[
                    { label: "Climate", score: w.climate_score, color: CLIMATE_COLORS[w.suburb.overall_level] },
                    { label: "Energy gap", score: w.energy_gap_score, color: "#c49a3a" },
                    { label: "LHD gap", score: w.lhd_gap_score, color: "#8899aa" },
                  ].map(({ label, score, color: c }) => (
                    <div key={label}>
                      <div style={{ fontSize: "0.6rem", color: "#4a5a6a", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                      <MiniBar score={score} color={c} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })()}

        {/* Programme cost calculator */}
        <div className="hive-card" style={{ padding: "14px 20px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#7a8fa8", textTransform: "uppercase", letterSpacing: "1px" }}>
              Portfolio fix calculator
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Your portfolio dwellings in Extreme/Critical suburbs:</span>
              <input type="number" min={1} max={50000} value={numDwellings}
                onChange={e => setNumDwellings(Math.max(1, parseInt(e.target.value) || 1))}
                className="hive-input" style={{ width: 80, padding: "5px 10px", fontSize: "0.85rem", textAlign: "center" }} />
              <span style={{ fontSize: "0.75rem", color: "#6b8aa0" }}>dwellings</span>
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[
                { label: "Energy upgrades (2★→5★)", cost: stats.avg_fix_cost_k - 8, color: "#c49a3a" },
                { label: "LHD to Silver", cost: 8, color: "#8899aa" },
                { label: "Total per programme", cost: stats.avg_fix_cost_k, color: "#c0614a" },
              ].map(({ label, cost, color }) => (
                <div key={label}>
                  <div style={{ fontSize: "0.6rem", color: "#4a5a6a", textTransform: "uppercase" }}>{label}</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 800, color }}>
                    ${(cost * numDwellings / 1000).toFixed(1)}M
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export PDF button */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <button
            onClick={() => {
              const filtered = allResults
                .filter(r => stateFilter === "All" || r.suburb.state === stateFilter)
                .filter(r => bandFilter === "All" || r.compound_band === bandFilter)
                .slice(0, 25)
              const rows = filtered.map(r =>
                `<tr><td>${r.suburb.suburb_name}, ${r.suburb.state}</td><td style="text-align:center;font-weight:700;color:${r.compound_band === "Extreme" ? "#c0614a" : r.compound_band === "Critical" ? "#c49a3a" : "#4d7fb5"}">${r.compound_score}</td><td>${r.compound_band}</td><td>${r.climate_score}</td><td>${r.energy_gap_score}</td><td>${r.lhd_gap_score}</td><td>${r.haff_round4_ready ? "✓" : "⚠ Gap"}</td></tr>`
              ).join("")
              const html = `<!DOCTYPE html><html><head><title>HIVE Asset Intelligence Report</title>
<style>
  body{font-family:Arial,sans-serif;background:#fff;color:#111;margin:40px;max-width:900px}
  h1{font-size:18px;margin-bottom:4px}
  .sub{font-size:12px;color:#666;margin-bottom:20px}
  table{width:100%;border-collapse:collapse;font-size:11px}
  th{background:#f0f0f0;padding:7px 10px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.8px;color:#555}
  td{padding:7px 10px;border-bottom:1px solid #f0f0f0}
  .footer{margin-top:20px;font-size:10px;color:#aaa}
  @media print{body{margin:20px}}
</style></head><body>
<h1>Asset Intelligence — Compound Risk Report</h1>
<div class="sub">Generated by HIVE · ${new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })} · Filter: ${stateFilter} · Band: ${bandFilter}</div>
<table><thead><tr><th>Suburb</th><th>Score</th><th>Band</th><th>Climate</th><th>Energy Gap</th><th>LHD Gap</th><th>HAFF R4</th></tr></thead>
<tbody>${rows}</tbody></table>
<div class="footer">Climate × Energy × LHD compound risk. Source: HIVE — Housing Intelligence &amp; Evidence</div>
<script>window.onload=()=>{window.print()}</script>
</body></html>`
              const w = window.open("", "_blank")
              if (w) { w.document.write(html); w.document.close() }
            }}
            style={{
              background: "rgba(77,127,181,0.08)", border: "1px solid rgba(77,127,181,0.3)",
              borderRadius: 8, padding: "8px 16px", color: "#4d7fb5", fontSize: "0.74rem",
              fontWeight: 700, cursor: "pointer",
            }}
          >
            🖨️ Export PDF Report
          </button>
        </div>

        {/* Callout */}
        <div className="callout-red" style={{ marginBottom: 24 }}>
          <strong style={{ color: "#c0614a" }}>The triple failure.</strong>{" "}
          When a suburb scores high on all three dimensions — climate exposure, poor energy performance, low livability compliance —
          the compounding effect is not additive, it's multiplicative.
          A tenant in a 2-star home in a Critical heat zone faces indoor temperatures of 43°C+ on extreme heat days,
          pays $2,200+ more per year in energy costs than a 7-star neighbour, and may not be able to move through their
          own home independently. This is not a comfort issue — it is a documented welfare and mortality crisis.
          <strong style={{ color: "#fff" }}> HAFF Round 4 applications from these suburbs should be scored as urgent priority.</strong>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "0.65rem", color: "#4a5a6a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", marginRight: 8 }}>State</span>
            {["All", ...ALL_STATES].map(s => (
              <button key={s} onClick={() => setStateFilter(s)}
                className={`tab-pill ${stateFilter === s ? "active" : ""}`}
                style={{ padding: "4px 10px", fontSize: "0.7rem", marginRight: 4 }}>{s}</button>
            ))}
          </div>
          <div>
            <span style={{ fontSize: "0.65rem", color: "#4a5a6a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", marginRight: 8 }}>Risk</span>
            {["All", ...BAND_ORDER].map(b => (
              <button key={b} onClick={() => setBandFilter(b)}
                className={`tab-pill ${bandFilter === b ? "active" : ""}`}
                style={{ padding: "4px 10px", fontSize: "0.7rem", marginRight: 4 }}>{b}</button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search suburb or LGA..."
            value={suburbSearch}
            onChange={e => { setSuburbSearch(e.target.value); }}
            style={{
              marginLeft: "auto", background: "#111827", border: "1px solid #2a3d52",
              borderRadius: 6, padding: "5px 12px", color: "#e2e8f0", fontSize: "0.78rem",
              outline: "none", width: 220,
            }}
          />
          <span style={{ fontSize: "0.7rem", color: "#4a5a6a", flexShrink: 0 }}>{filtered.length} suburbs</span>
        </div>

        {/* Results table */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(result => {
            const { suburb, compound_score, compound_band, compound_color } = result
            const isExpanded = expandedId === suburb.id

            return (
              <div key={suburb.id} className="hive-card"
                style={{ borderLeft: `3px solid ${compound_color}`, padding: 0, overflow: "hidden" }}>

                {/* Header row */}
                <div style={{ padding: "13px 18px", cursor: "pointer", display: "flex", gap: 14, alignItems: "center" }}
                  onClick={() => setExpandedId(isExpanded ? null : suburb.id)}>

                  {/* Compound score */}
                  <div style={{ flexShrink: 0, textAlign: "center", minWidth: 50 }}>
                    <div style={{ fontSize: "1.4rem", fontWeight: 900, color: compound_color, lineHeight: 1 }}>{compound_score}</div>
                    <div style={{ fontSize: "0.55rem", color: "#4a5a6a" }}>compound</div>
                  </div>

                  {/* Suburb info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 3, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, color: "#e8edf2", fontSize: "0.88rem" }}>{suburb.suburb_name}</span>
                      <span className="badge badge-grey" style={{ fontSize: "0.58rem" }}>{suburb.state}</span>
                      <BandBadge band={compound_band} small />
                      {!result.haff_round4_ready && (
                        <span style={{ fontSize: "0.58rem", fontWeight: 700, color: "#c49a3a", background: "rgba(196,154,58,0.1)", border: "1px solid rgba(196,154,58,0.3)", padding: "1px 6px", borderRadius: 3 }}>⚠ HAFF R4 gap</span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.67rem", color: "#4a5a6a" }}>
                      {suburb.lga_name} · {suburb.est_social_dwellings.toLocaleString()} dwellings · {result.primary_failure} is dominant risk
                    </div>
                  </div>

                  {/* Component scores */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 80px)", gap: 10, flexShrink: 0 }}>
                    {[
                      { label: "🌡 Climate", score: result.climate_score, color: CLIMATE_COLORS[suburb.overall_level] },
                      { label: "⚡ Energy gap", score: result.energy_gap_score, color: "#c49a3a" },
                      { label: "♿ LHD gap", score: result.lhd_gap_score, color: "#8899aa" },
                    ].map(({ label, score, color }) => (
                      <div key={label}>
                        <div style={{ fontSize: "0.6rem", color: "#4a5a6a", marginBottom: 3 }}>{label}</div>
                        <MiniBar score={score} color={color} />
                      </div>
                    ))}
                  </div>

                  {/* Fix cost */}
                  <div style={{ flexShrink: 0, textAlign: "right", minWidth: 90 }}>
                    <div style={{ fontSize: "0.6rem", color: "#4a5a6a", textTransform: "uppercase", letterSpacing: "0.5px" }}>Fix cost</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 800, color: compound_color }}>${result.total_fix_cost_k}k/dwg</div>
                  </div>

                  <div style={{ fontSize: "0.65rem", color: "#4a5a6a", flexShrink: 0 }}>{isExpanded ? "▲" : "▼"}</div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{ borderTop: "1px solid #1e2d40", padding: "16px 18px", background: "#0d1825" }}>
                    <div className="grid-2" style={{ gap: 24, marginBottom: 14 }}>

                      {/* Three pillars */}
                      <div>
                        <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#c0614a", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 10 }}>Compound Risk Breakdown</div>
                        {[
                          { icon: "🌡", label: "Climate Risk", score: result.climate_score, band: suburb.overall_level, detail: `${suburb.primary_hazard} is primary hazard · ${suburb.lga_name}`, color: CLIMATE_COLORS[suburb.overall_level] },
                          { icon: "⚡", label: "Energy Performance Gap", score: result.energy_gap_score, band: result.energy_gap_score >= 65 ? "Critical" : result.energy_gap_score >= 50 ? "High" : "Moderate", detail: `${suburb.state} avg ${result.state_energy.avg_nathers_stars}★ NatHERS vs 7★ target · ${result.state_energy.pct_below_3star}% below 3-star · avg bill $${result.state_energy.avg_annual_energy_bill.toLocaleString()}/yr`, color: "#c49a3a" },
                          { icon: "♿", label: "Livable Housing Compliance Gap", score: result.lhd_gap_score, band: result.lhd_gap_score >= 90 ? "Critical" : result.lhd_gap_score >= 80 ? "High" : "Moderate", detail: `Only ${100 - result.lhd_gap_score}% of ${suburb.state} social stock meets Silver standard · ${result.state_lhd.dwellings_needing_silver_upgrade.toLocaleString()} dwellings need upgrade`, color: "#8899aa" },
                        ].map(({ icon, label, score, band, detail, color }) => (
                          <div key={label} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #1a2535" }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                              <span>{icon}</span>
                              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#c8d8e8" }}>{label}</span>
                              <span style={{ fontSize: "0.62rem", fontWeight: 700, padding: "1px 6px", borderRadius: 3, background: `${color}18`, color, border: `1px solid ${color}33` }}>{score}/100</span>
                            </div>
                            <div style={{ fontSize: "0.7rem", color: "#6b8aa0", lineHeight: 1.55 }}>{detail}</div>
                          </div>
                        ))}
                      </div>

                      {/* Actions + costs */}
                      <div>
                        <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#4d7fb5", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 10 }}>Remediation + HAFF Readiness</div>
                        <div style={{ fontSize: "0.75rem", color: "#7a8fa8", lineHeight: 1.7, marginBottom: 12 }}>{result.compound_narrative}</div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px", marginBottom: 12 }}>
                          {[
                            ["Energy upgrade (2→5★)", `$${result.upgrade_to_5star_energy_cost_k}k/dwelling`],
                            ["LHD to Silver", `$${result.upgrade_to_silver_cost_k}k/dwelling`],
                            ["Total per dwelling", `$${result.total_fix_cost_k}k`],
                            ["Tenant energy saving", `$${Math.min(result.annual_tenant_extra_energy_cost, 2200).toLocaleString()}/yr`],
                          ].map(([l, v]) => (
                            <div key={l}>
                              <div style={{ fontSize: "0.62rem", color: "#4a5a6a", textTransform: "uppercase" }}>{l}</div>
                              <div style={{ fontSize: "0.82rem", color: "#c8d8e8", fontWeight: 700 }}>{v}</div>
                            </div>
                          ))}
                        </div>

                        {result.haff_gaps.length > 0 ? (
                          <div style={{ background: "rgba(196,154,58,0.05)", border: "1px solid rgba(196,154,58,0.2)", borderRadius: 6, padding: "10px 14px" }}>
                            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#c49a3a", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>HAFF Round 4 gaps to address</div>
                            {result.haff_gaps.map((g, i) => (
                              <div key={i} style={{ fontSize: "0.7rem", color: "#c49a3a", marginBottom: 3, display: "flex", gap: 6 }}>
                                <span>·</span>{g}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ background: "rgba(90,173,138,0.05)", border: "1px solid rgba(90,173,138,0.2)", borderRadius: 6, padding: "10px 14px", fontSize: "0.72rem", color: "#5aad8a" }}>
                            ✓ No critical HAFF Round 4 compliance gaps identified for this suburb's state
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Methodology */}
        <div style={{ marginTop: 32, borderTop: "1px solid #1e2d40", paddingTop: 14 }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#4a5a6a", letterSpacing: "1.8px", textTransform: "uppercase", marginBottom: 6 }}>Compound Risk Methodology</div>
          <div style={{ fontSize: "0.7rem", color: "#4a5a6a", lineHeight: 1.6 }}>
            Compound Score = Climate Risk (40%) + Energy Gap Score (35%) + LHD Gap Score (25%).
            Climate scores are suburb-specific from HIVE Climate Risk Intelligence.
            Energy and LHD gap scores use state-level averages as the best available proxy for suburb-level performance.
            Individual property assessment requires on-site NatHERS and LHA certified assessor.
          </div>
        </div>

      </div>
    </div>
  )
}
