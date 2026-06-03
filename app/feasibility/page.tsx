"use client"
import { useState } from "react"
import {
  TYPOLOGIES, TENURE_MIXES, STATE_LABELS,
  SOCIAL_RENT_WEEKLY, MARKET_RENT_WEEKLY, AFFORDABLE_RENT_RATIO,
  NHFIC_RATE, LOAN_TERM_YEARS, DEBT_SERVICE_FACTOR, DSCR, OPEX_RATIO,
  STATE_LAND_CONTRIBUTION, COUNCIL_CONTRIBUTIONS, STATUTORY_CHARGES,
  STATE_COST_MULTIPLIER, SQM_COST,
  HAFF_GRANT_OPTIONS,
  computeFeasibility, computeStateComparison,
} from "@/lib/data/feasibility"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LabelList,
} from "recharts"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Analysis({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "#111827", border: "1px solid #1e2d40",
      borderRadius: 8, padding: "14px 18px", marginTop: 14,
      fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.85,
    }}>
      <span style={{
        fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e",
        letterSpacing: "1.5px", textTransform: "uppercase", display: "block", marginBottom: 8,
      }}>🐝 HIVE Analysis</span>
      {children}
    </div>
  )
}

function Narrative({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: "0.79rem", color: "#94a3b8", lineHeight: 1.7,
      margin: "0 0 16px 0",
    }}>{children}</p>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: "0.82rem", fontWeight: 700, color: "#c8d8e8",
      letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 10,
    }}>{children}</div>
  )
}

function SelectorPills<T extends string>({
  label, options, selected, onSelect, columns,
}: {
  label: string
  options: { key: T; label: string; sub?: string }[]
  selected: T
  onSelect: (k: T) => void
  columns?: number
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: "0.68rem", fontWeight: 700, color: "#7a8fa8",
        letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8,
      }}>{label}</div>
      <div style={columns
        ? { display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 6 }
        : { display: "flex", gap: 6, flexWrap: "wrap" }
      }>
        {options.map(({ key, label: lbl, sub }) => {
          const active = selected === key
          return (
            <button key={key} onClick={() => onSelect(key)} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "5px 12px",
              fontSize: "0.78rem", fontWeight: active ? 700 : 500,
              color: active ? "#0b1220" : "#94a3b8",
              border: `1px solid ${active ? "#f6c90e" : "#2a3d52"}`,
              borderRadius: 6,
              background: active ? "#f6c90e" : "rgba(255,255,255,0.03)",
              cursor: "pointer", transition: "all 0.15s",
            }}>
              {lbl}
              {sub && (
                <span style={{
                  fontSize: "0.68rem", fontWeight: 700,
                  color: active ? "rgba(0,0,0,0.55)" : "#f6c90e",
                  background: active ? "rgba(0,0,0,0.12)" : "rgba(246,201,14,0.1)",
                  borderRadius: 4, padding: "1px 5px",
                }}>
                  {sub}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const fmt  = (n: number) => "$" + n.toLocaleString()
const fmtK = (n: number) => "$" + Math.round(n / 1000).toLocaleString() + "k"

function gapColor(gap: number) {
  if (gap === 0)          return "#5aad8a"
  if (gap < 80_000)       return "#5aad8a"
  if (gap < 150_000)      return "#c49a3a"
  return "#c0614a"
}
function gapLabel(gap: number) {
  if (gap === 0)          return "Viable — no gap"
  if (gap < 80_000)       return "Small gap — equity possible"
  if (gap < 150_000)      return "Moderate gap"
  return "Significant gap"
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FeasibilityPage() {
  // ── Project Modeller state ──────────────────────────────────────────────────
  const [pageTab,    setPageTab]    = useState<"project" | "program">("project")
  const [state,      setState]      = useState("NSW")
  const [typology,   setTypology]   = useState("2bed-apt")
  const [tenure,     setTenure]     = useState("50mix")
  const [haff,       setHaff]       = useState("r1-3-avg")
  const [dwellings,  setDwellings]  = useState(20)

  // ── Program Design (Scenario Modeller) state ────────────────────────────────
  const [grantA,       setGrantA]       = useState(55451)    // R1-3 avg
  const [grantB,       setGrantB]       = useState(95000)    // R4 estimate
  const [scenTypology, setScenTypology] = useState("2bed-apt")
  const [scenTenure,   setScenTenure]   = useState("50mix")
  const [targetHomes,  setTargetHomes]  = useState(40000)

  // ── Computed: Project Modeller ──────────────────────────────────────────────
  const r = computeFeasibility(state, typology, tenure, haff)
  const comparison = computeStateComparison(typology, tenure, haff)

  // ── Computed: Scenario Modeller ─────────────────────────────────────────────
  const STATES = Object.keys(STATE_LABELS)
  const scenarioResults = STATES.map(s => {
    const base = computeFeasibility(s, scenTypology, scenTenure, "r1-3-avg")
    const tdc  = base.tdc_ex_land
    const debt = base.nhfic_debt
    const land = STATE_LAND_CONTRIBUTION[s]
    const gapA = Math.max(0, tdc - grantA - debt - land)
    const gapB = Math.max(0, tdc - grantB - debt - land)
    return {
      state: s,
      label: STATE_LABELS[s],
      tdc,
      debt,
      land,
      gapA,
      gapB,
      delta: gapA - gapB,       // positive = Scenario B reduces gap
      viableA: gapA === 0,
      viableB: gapB === 0,
    }
  })
  const avgGapA      = Math.round(scenarioResults.reduce((s, r) => s + r.gapA, 0) / scenarioResults.length)
  const avgGapB      = Math.round(scenarioResults.reduce((s, r) => s + r.gapB, 0) / scenarioResults.length)
  const avgDelta     = avgGapA - avgGapB
  const totalCostA   = grantA * targetHomes
  const totalCostB   = grantB * targetHomes
  const additionalCost = Math.abs(totalCostB - totalCostA)
  const bestStateA   = scenarioResults.reduce((best, r) => r.gapA < best.gapA ? r : best)
  const bestStateB   = scenarioResults.reduce((best, r) => r.gapB < best.gapB ? r : best)
  const viableCountA = scenarioResults.filter(r => r.viableA).length
  const viableCountB = scenarioResults.filter(r => r.viableB).length

  const gc     = gapColor(r.funding_gap)
  const gl     = gapLabel(r.funding_gap)
  const total  = (n: number) => Math.round(n * dwellings)

  const stackData = [{ name: "Funding", haff: r.haff_grant, nhfic: r.nhfic_debt, land: r.state_land, gap: r.funding_gap }]

  const costItems = [
    { name: "Hard construction",          value: r.hard_cost,              color: "#4d7fb5", pct: r.hard_cost / r.tdc_ex_land },
    { name: "Professional fees (8%)",     value: r.professional_fees,      color: "#7aaad4", pct: r.professional_fees / r.tdc_ex_land },
    { name: "Contingency (12%)",          value: r.contingency,            color: "#a8bcc8", pct: r.contingency / r.tdc_ex_land },
    { name: "Construction finance (6%)",  value: r.finance_cost,           color: "#c49a3a", pct: r.finance_cost / r.tdc_ex_land },
    { name: "Council contributions",      value: r.council_contributions,  color: "#a8bcc8", pct: r.council_contributions / r.tdc_ex_land },
    { name: "Statutory charges",          value: r.statutory_charges,      color: "#c8d4df", pct: r.statutory_charges / r.tdc_ex_land },
  ]

  const be = r.breakeven_aff_pct
  const beText = be === null || be === 0
    ? "Already viable — no tenure shift needed."
    : be <= 1.0
      ? `Shift to ${Math.ceil(be * 100)}%+ affordable to close the gap.`
      : "Gap cannot close via tenure mix alone — needs higher grant or equity."

  return (
    <div style={{ background: "#0b1220", minHeight: "100vh" }}>
      <div className="page-container">

        {/* ── Header ── */}
        <div className="page-header">
          <h1 className="page-title">Development Viability</h1>
          <p className="page-subtitle">
            A $588k 2-bed apartment in NSW. $55k HAFF grant. $195k Housing Australia loan. Still $137k short — and that&apos;s before land.
            This tool models the exact funding gap for any state, typology, and HAFF scenario.
            It&apos;s the same calculation used in real HAFF submissions.
          </p>
          <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: 8 }}>
            Sources: Rawlinsons 2025 (construction $/m² + state indices) · Housing Australia lending guidelines 2024 ·
            PropTrack Q1 2025 (market rents) · ABS Household Income 2023-24 (social rents) ·
            HAFF program data · State HA reports 2023-24
          </div>
        </div>

        {/* ── Page tab nav ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {([["project", "Project Modeller"], ["program", "Program Design"]] as const).map(([key, label]) => (
            <button
              key={key}
              className={`tab-pill ${pageTab === key ? "active" : ""}`}
              onClick={() => setPageTab(key)}
              style={{ padding: "8px 20px", fontSize: "0.82rem" }}
            >
              {label}
            </button>
          ))}
          <span style={{ marginLeft: "auto", fontSize: "0.68rem", color: "#4a5a6a", alignSelf: "center" }}>
            {pageTab === "project" ? "Per-dwelling funding waterfall for a single project" : "Portfolio-level grant rate vs viability — for policy and program design"}
          </span>
        </div>

        {pageTab === "project" && (
          <div style={{
            borderTop: "1px solid #1e2d40", borderBottom: "1px solid #1e2d40",
            background: "#070d18", marginBottom: 20,
            overflowX: "auto", scrollbarWidth: "none",
            margin: "0 -24px 24px",
          }}>
            <div style={{ display: "flex", gap: 4, padding: "7px 24px", whiteSpace: "nowrap", alignItems: "center" }}>
              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#4a5a6a", marginRight: 8, letterSpacing: "1px", textTransform: "uppercase", flexShrink: 0 }}>JUMP TO</span>
              {[
                { id: "feas-params",      label: "Parameters" },
                { id: "feas-per-dwelling",label: "Per Dwelling" },
                { id: "feas-project",     label: "Project Total" },
                { id: "feas-levers",      label: "Gap Levers" },
                { id: "feas-states",      label: "State Comparison" },
                { id: "feas-sensitivity", label: "Cost Sensitivity" },
                { id: "feas-methodology", label: "Methodology" },
              ].map(sec => (
                <a key={sec.id} href={`#${sec.id}`} style={{
                  display: "inline-block", padding: "4px 12px",
                  fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8",
                  background: "rgba(255,255,255,0.04)", border: "1px solid #1e2d40",
                  borderRadius: 4, textDecoration: "none",
                }}>
                  {sec.label}
                </a>
              ))}
            </div>
          </div>
        )}

        {pageTab === "project" && (<>

        {/* ── How to Read This Tool ── */}
        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 10, marginBottom: 20, overflow: "hidden" }}>
          <div style={{ padding: "14px 22px 0", borderBottom: "1px solid #1e2d40" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 14 }}>
              🐝 How to Use This Tool
            </div>
          </div>
          <div>
            <div style={{ padding: "18px 22px 22px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 18 }}>

                {/* Block 1: The problem */}
                <div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 8 }}>The Problem This Solves</div>
                  <p style={{ fontSize: "0.79rem", color: "#94a3b8", lineHeight: 1.8, margin: 0 }}>
                    Building social and affordable housing costs more than you can make back from rents alone.
                    This tool calculates exactly how large that gap is — and what combination of grants, loans,
                    and equity is needed to close it. It's the same model housing developers and CHPs use in
                    funding submissions to Housing Australia.
                  </p>
                </div>

                {/* Block 2: The four numbers */}
                <div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 8 }}>The Four Numbers That Matter</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: "0.79rem", color: "#94a3b8", lineHeight: 1.7 }}>
                    <div><span style={{ color: "#fff", fontWeight: 600 }}>1. Build cost (TDC)</span> — what it actually costs to construct, not including land.</div>
                    <div><span style={{ color: "#f6c90e", fontWeight: 600 }}>2. HAFF grant</span> — the federal government's per-dwelling contribution.</div>
                    <div><span style={{ color: "#4d7fb5", fontWeight: 600 }}>3. HA loan</span> — how much Housing Australia will lend based on rental income.</div>
                    <div><span style={{ color: "#c0614a", fontWeight: 600 }}>4. The gap</span> — what's still missing after 1+2+3. This must come from CHP equity, state grants, or cross-subsidy.</div>
                  </div>
                </div>

                {/* Block 3: The selectors */}
                <div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 8 }}>What the Controls Do</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "0.79rem", color: "#94a3b8", lineHeight: 1.7 }}>
                    <div><span style={{ color: "#cbd5e1", fontWeight: 600 }}>State</span> — changes construction costs AND local rental income at the same time. Each multiplier (×0.96 etc.) is from Rawlinsons 2025.</div>
                    <div><span style={{ color: "#cbd5e1", fontWeight: 600 }}>Typology</span> — the type and size of home being built.</div>
                    <div><span style={{ color: "#cbd5e1", fontWeight: 600 }}>Tenure mix</span> — more affordable units = higher rent = more loan. But it reduces social impact.</div>
                    <div><span style={{ color: "#cbd5e1", fontWeight: 600 }}>HAFF scenario</span> — model what Round 4 grants could do for the gap.</div>
                    <div><span style={{ color: "#cbd5e1", fontWeight: 600 }}>Project scale</span> — multiplies everything by number of dwellings.</div>
                  </div>
                </div>

              </div>

              {/* Key caveats */}
              <div style={{ marginTop: 18, padding: "12px 16px", background: "#0b1220", borderRadius: 8, borderLeft: "3px solid #c49a3a" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#c49a3a", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Important: What This Tool Doesn't Include</div>
                <div style={{ display: "flex", gap: 32, fontSize: "0.76rem", color: "#777", lineHeight: 1.7 }}>
                  <div>• <strong style={{ color: "#94a3b8" }}>Land is excluded</strong> — cost varies enormously by site. Add $300k–$700k per dwelling in metro NSW/VIC and the real gap is much larger.</div>
                  <div>• <strong style={{ color: "#94a3b8" }}>R4 grant is estimated</strong> — the $95k figure is extrapolated from R3 trends, not confirmed by Housing Australia.</div>
                  <div>• <strong style={{ color: "#94a3b8" }}>Construction cost is an average</strong> — difficult sites, heritage constraints, or tight access will cost more.</div>
                  <div>• <strong style={{ color: "#94a3b8" }}>No developer margin</strong> — this assumes CHP (not-for-profit) delivery. A private developer would require additional return.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Selectors ── */}
        <div id="feas-params" style={{ scrollMarginTop: 130 }} />
        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 10, marginBottom: 24, overflow: "hidden" }}>
          <div style={{ padding: "12px 24px", borderBottom: "1px solid #1e2d40", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "2px", textTransform: "uppercase" }}>
              🐝 Modelling Parameters
            </span>
            <span style={{ fontSize: "0.72rem", color: "#4a5a6a" }}>Select inputs — results update instantly</span>
          </div>
          <div style={{ padding: "20px 24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", gap: "0 32px" }}>
              {/* Left: property inputs */}
              <div>
                <SelectorPills
                  label="State"
                  options={Object.entries(STATE_LABELS).map(([k]) => ({ key: k, label: k, sub: `×${STATE_COST_MULTIPLIER[k]}` }))}
                  selected={state}
                  onSelect={setState}
                  columns={4}
                />
                <SelectorPills
                  label="Typology"
                  options={Object.entries(TYPOLOGIES).map(([k, v]) => ({ key: k, label: v.label }))}
                  selected={typology}
                  onSelect={setTypology}
                  columns={3}
                />
              </div>
              {/* Divider */}
              <div style={{ background: "#1e2d40" }} />
              {/* Right: financial inputs */}
              <div>
                <SelectorPills
                  label="Tenure Mix"
                  options={Object.entries(TENURE_MIXES).map(([k, v]) => ({ key: k, label: v.label }))}
                  selected={tenure}
                  onSelect={setTenure}
                  columns={3}
                />
                <SelectorPills
                  label="HAFF Grant Scenario"
                  options={Object.entries(HAFF_GRANT_OPTIONS).map(([k, v]) => ({ key: k, label: v.label, sub: fmtK(v.grant) }))}
                  selected={haff}
                  onSelect={setHaff}
                />
                <div style={{ marginBottom: 4 }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#7a8fa8", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>
                    Project Scale
                  </div>
                  {/* Quick presets */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 10 }}>
                    {[10, 20, 50, 100].map(n => (
                      <button key={n} onClick={() => setDwellings(n)} style={{
                        padding: "5px 0", fontSize: "0.78rem", fontWeight: dwellings === n ? 700 : 500,
                        color: dwellings === n ? "#0b1220" : "#94a3b8",
                        background: dwellings === n ? "#f6c90e" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${dwellings === n ? "#f6c90e" : "#2a3d52"}`,
                        borderRadius: 6, cursor: "pointer", textAlign: "center",
                      }}>
                        {n}
                      </button>
                    ))}
                  </div>
                  {/* Custom number input */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontSize: "0.72rem", color: "#6b8aa0", flexShrink: 0 }}>Custom:</div>
                    <input
                      type="number" min={1} max={5000} step={1}
                      value={dwellings}
                      onChange={e => {
                        const v = parseInt(e.target.value)
                        if (!isNaN(v) && v > 0) setDwellings(v)
                      }}
                      style={{
                        flex: 1, background: "#1f2937", border: "1px solid #2a3d52",
                        borderRadius: 6, padding: "5px 10px", color: "#e2e8f0",
                        fontSize: "0.82rem", fontWeight: 700, textAlign: "right",
                        outline: "none", width: "100%",
                      }}
                    />
                    <div style={{ fontSize: "0.72rem", color: "#6b8aa0", flexShrink: 0 }}>dwellings</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #1e2d40", fontSize: "0.75rem", color: "#7a8fa8", lineHeight: 1.7 }}>
              {TYPOLOGIES[typology].note}
              <span style={{ color: "#2a3d52", margin: "0 6px" }}>·</span>
              {TENURE_MIXES[tenure].note}
              <span style={{ color: "#2a3d52", margin: "0 6px" }}>·</span>
              {HAFF_GRANT_OPTIONS[haff].note}
            </div>
          </div>
        </div>

        {/* ── KPI row — per dwelling ── */}
        <div id="feas-per-dwelling" style={{ scrollMarginTop: 130 }} />
        <SectionLabel>Per Dwelling</SectionLabel>
        <Narrative>
          These four numbers tell the complete funding story for a single home. Start here — the gap (last card) is
          the amount your team must source from equity, state grants, or cross-subsidy <em>before</em> the project can proceed.
          Numbers update instantly as you change state, typology, tenure, or HAFF scenario above.
        </Narrative>
        <div className="grid-4" style={{ marginBottom: 16 }}>
          <div className="kpi-card">
            <div className="kpi-label">Total Dev. Cost (ex-land)</div>
            <div className="kpi-value" style={{ fontSize: "1.5rem" }}>{fmtK(r.tdc_ex_land)}</div>
            <div className="kpi-delta">{r.gross_area_m2}m² gross · {r.net_area_m2}m² net · {fmt(r.sqm_rate)}/m²</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">HAFF Grant</div>
            <div className="kpi-value" style={{ fontSize: "1.5rem", color: "#f6c90e" }}>{fmtK(r.haff_grant)}</div>
            <div className="kpi-delta">{r.haff_coverage_pct}% of TDC · {HAFF_GRANT_OPTIONS[haff].label}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">HA Debt Capacity</div>
            <div className="kpi-value" style={{ fontSize: "1.5rem", color: "#4d7fb5" }}>{fmtK(r.nhfic_debt)}</div>
            <div className="kpi-delta">{fmt(r.blended_rent_weekly)}/wk blended · {r.nhfic_rate_pct}% rate · {DSCR}× DSCR</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">{gl}</div>
            <div className="kpi-value" style={{ fontSize: "1.5rem", color: gc }}>
              {r.funding_gap === 0 ? "✓" : fmtK(r.funding_gap)}
            </div>
            <div className="kpi-delta" style={{ color: gc }}>
              {r.funding_gap > 0 ? fmt(r.gap_per_m2) + "/m² net area" : "Fully funded incl. state land"}
            </div>
          </div>
        </div>

        {/* ── Project-scale KPI row ── */}
        <div id="feas-project" style={{ scrollMarginTop: 130 }} />
        <SectionLabel>Project Total — {dwellings} Dwellings</SectionLabel>
        <Narrative>
          Your per-dwelling numbers scaled to the full project. Use the project scale input above to change project size.
          The total gap ({fmtK(total(r.funding_gap))}) is the capital raising target for your development team —
          this must be secured before you can achieve financial close.
        </Narrative>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
          {[
            { label: "Total Project TDC",   value: fmtK(total(r.tdc_ex_land)),                                  color: "#fff",    sub: "ex-land" },
            { label: "Total HAFF Grant",     value: fmtK(total(r.haff_grant)),                                   color: "#f6c90e", sub: "grant required" },
            { label: "Total HA Debt",        value: fmtK(total(r.nhfic_debt)),                                   color: "#4d7fb5", sub: "@ blended rent" },
            { label: "Total Gap / Equity",   value: r.funding_gap > 0 ? fmtK(total(r.funding_gap)) : "None",   color: gc,        sub: r.funding_gap > 0 ? "to source / CHP equity" : "Fully covered" },
          ].map(({ label, value, color, sub }) => (
            <div key={label} style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 8, padding: "12px 16px" }}>
              <div style={{ fontSize: "0.78rem", color: "#7a8fa8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 900, color }}>{value}</div>
              <div style={{ fontSize: "0.80rem", color: "#7a8fa8", marginTop: 2 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── Export buttons ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 20, marginTop: -8 }}>
          <button
            onClick={() => {
              const brief = [
                `HIVE DEVELOPMENT FEASIBILITY BRIEF`,
                `Generated: ${new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}`,
                ``,
                `PROJECT PARAMETERS`,
                `  State:       ${r.state_label}`,
                `  Typology:    ${r.typology_label}`,
                `  Tenure mix:  ${tenure}`,
                `  HAFF round:  ${HAFF_GRANT_OPTIONS[haff].label}`,
                `  Project size: ${dwellings} dwellings`,
                ``,
                `PER-DWELLING ECONOMICS (ex-land)`,
                `  Total Dev. Cost (TDC):  ${fmtK(r.tdc_ex_land)}`,
                `  HAFF Grant:             ${fmtK(r.haff_grant)} (${r.haff_coverage_pct}% of TDC)`,
                `  HA Debt Capacity:       ${fmtK(r.nhfic_debt)} @ ${fmt(r.blended_rent_weekly)}/wk blended rent`,
                `  Funding Gap:            ${r.funding_gap > 0 ? fmtK(r.funding_gap) : "None — fully funded"}`,
                ``,
                `PROJECT TOTALS (${dwellings} dwellings)`,
                `  Total TDC:    ${fmtK(total(r.tdc_ex_land))}`,
                `  Total Grant:  ${fmtK(total(r.haff_grant))}`,
                `  Total Debt:   ${fmtK(total(r.nhfic_debt))}`,
                `  Total Gap:    ${r.funding_gap > 0 ? fmtK(total(r.funding_gap)) : "None"}`,
                ``,
                `NOTES`,
                `  Land cost excluded — add $300k–$700k/dwelling (metro) or $80k–$180k (state contribution).`,
                `  R4 grant rate ($95k) is an estimate extrapolated from R3 trends.`,
                `  Construction costs from Rawlinsons 2025. Social rents from ABS Household Income 2023-24.`,
                ``,
                `Source: HIVE — Housing Intelligence & Evidence (hive.housinganalytics.com.au)`,
              ].join("\n")
              navigator.clipboard.writeText(brief).then(() => {
                alert("Brief copied to clipboard!")
              })
            }}
            style={{
              background: "rgba(246,201,14,0.08)", border: "1px solid rgba(246,201,14,0.3)",
              borderRadius: 8, padding: "9px 18px", color: "#f6c90e", fontSize: "0.76rem",
              fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
              letterSpacing: "0.3px",
            }}
          >
            📋 Copy Feasibility Brief
          </button>
          <button
            onClick={() => {
              const html = `<!DOCTYPE html><html><head><title>HIVE Feasibility Brief — ${r.state_label}</title>
<style>
  body{font-family:Arial,sans-serif;background:#fff;color:#111;margin:40px;max-width:720px}
  h1{font-size:18px;margin-bottom:4px}
  .sub{font-size:12px;color:#666;margin-bottom:24px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
  .kpi{background:#f8f9fa;border:1px solid #e0e0e0;border-radius:6px;padding:12px 16px}
  .kpi-label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:4px}
  .kpi-value{font-size:22px;font-weight:900;color:#111}
  .kpi-delta{font-size:11px;color:#666;margin-top:2px}
  .section{font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#888;margin:20px 0 10px;border-top:1px solid #e0e0e0;padding-top:12px}
  .row{display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-bottom:1px solid #f0f0f0}
  .row b{color:#333}
  .footer{margin-top:30px;font-size:10px;color:#aaa;border-top:1px solid #e0e0e0;padding-top:12px}
  @media print{body{margin:20px}}
</style></head><body>
<h1>Development Feasibility Brief</h1>
<div class="sub">Generated by HIVE — ${new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}</div>
<div class="section">Project Parameters</div>
<div class="row"><span>State</span><b>${r.state_label}</b></div>
<div class="row"><span>Typology</span><b>${r.typology_label}</b></div>
<div class="row"><span>Tenure mix</span><b>${tenure}</b></div>
<div class="row"><span>HAFF scenario</span><b>${HAFF_GRANT_OPTIONS[haff].label}</b></div>
<div class="row"><span>Project scale</span><b>${dwellings} dwellings</b></div>
<div class="section">Per-Dwelling Economics (ex-land)</div>
<div class="grid">
  <div class="kpi"><div class="kpi-label">Total Dev. Cost</div><div class="kpi-value">${fmtK(r.tdc_ex_land)}</div><div class="kpi-delta">${r.gross_area_m2}m² gross · ${fmt(r.sqm_rate)}/m²</div></div>
  <div class="kpi"><div class="kpi-label">HAFF Grant</div><div class="kpi-value">${fmtK(r.haff_grant)}</div><div class="kpi-delta">${r.haff_coverage_pct}% of TDC</div></div>
  <div class="kpi"><div class="kpi-label">HA Debt Capacity</div><div class="kpi-value">${fmtK(r.nhfic_debt)}</div><div class="kpi-delta">${fmt(r.blended_rent_weekly)}/wk blended</div></div>
  <div class="kpi" style="border-color:${r.funding_gap > 0 ? '#c0614a' : '#5aad8a'}"><div class="kpi-label">${r.funding_gap > 0 ? "Funding Gap" : "Result"}</div><div class="kpi-value" style="color:${r.funding_gap > 0 ? '#c0614a' : '#5aad8a'}">${r.funding_gap > 0 ? fmtK(r.funding_gap) : "Viable"}</div><div class="kpi-delta">${r.funding_gap > 0 ? "Must source from equity or state grant" : "Fully covered"}</div></div>
</div>
<div class="section">Project Totals — ${dwellings} Dwellings</div>
<div class="row"><span>Total TDC</span><b>${fmtK(total(r.tdc_ex_land))}</b></div>
<div class="row"><span>Total HAFF Grant</span><b>${fmtK(total(r.haff_grant))}</b></div>
<div class="row"><span>Total HA Debt</span><b>${fmtK(total(r.nhfic_debt))}</b></div>
<div class="row"><span>Total Gap / Equity Required</span><b>${r.funding_gap > 0 ? fmtK(total(r.funding_gap)) : "None"}</b></div>
<div class="footer">
  Land cost excluded — add $300k–$700k/dwelling (metro). R4 grant is an estimate extrapolated from R3 trends.<br>
  Construction costs: Rawlinsons 2025. Social rents: ABS Household Income 2023-24.<br>
  Source: HIVE — Housing Intelligence &amp; Evidence
</div>
<script>window.onload=()=>{window.print()}</script>
</body></html>`
              const w = window.open("", "_blank")
              if (w) { w.document.write(html); w.document.close() }
            }}
            style={{
              background: "rgba(77,127,181,0.08)", border: "1px solid rgba(77,127,181,0.3)",
              borderRadius: 8, padding: "9px 18px", color: "#4d7fb5", fontSize: "0.76rem",
              fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
            }}
          >
            🖨️ Export PDF
          </button>
        </div>

        {/* ── Main 2-col: waterfall + cost breakdown ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>

          {/* Funding waterfall */}
          <div className="chart-container">
            <div className="chart-title">Funding Stack vs Total Development Cost</div>
            <Narrative>
              This bar shows every funding source stacked against the total build cost.
              In an ideal world, the bar reaches {fmtK(r.tdc_ex_land)} and there is no gap.
              The orange portion on the right is what remains unfunded — the equity your project must source.
            </Narrative>
            <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginBottom: 12 }}>
              Single dwelling · {r.state_label} · {r.typology_label}
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stackData} layout="vertical" margin={{ top: 0, right: 50, bottom: 0, left: 55 }}>
                <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={v => `$${Math.round((v as number)/1000)}k`} tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} />
                <YAxis type="category" dataKey="name" hide />
                <Tooltip
                  contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                  formatter={(v: unknown, name: unknown) => [fmt(v as number), name as string]}
                />
                <Bar dataKey="haff"  name="HAFF grant"      stackId="a" fill="#f6c90e">
                  <LabelList dataKey="haff"  position="inside" style={{ fill: "#0b1220", fontSize: 12, fontWeight: 700 }} formatter={(v: unknown) => (v as number) > 20000 ? fmtK(v as number) : ""} />
                </Bar>
                <Bar dataKey="nhfic" name="HA loan (debt)"  stackId="a" fill="#4d7fb5">
                  <LabelList dataKey="nhfic" position="inside" style={{ fill: "#fff", fontSize: 12, fontWeight: 700 }} formatter={(v: unknown) => (v as number) > 20000 ? fmtK(v as number) : ""} />
                </Bar>
                <Bar dataKey="land"  name="State land"      stackId="a" fill="#6b8aa0">
                  <LabelList dataKey="land"  position="inside" style={{ fill: "#fff", fontSize: 12, fontWeight: 700 }} formatter={(v: unknown) => (v as number) > 20000 ? fmtK(v as number) : ""} />
                </Bar>
                <Bar dataKey="gap"   name="Funding gap"     stackId="a" fill={gc} radius={[0,4,4,0]}>
                  <LabelList dataKey="gap"   position="right" style={{ fill: gc, fontSize: 12, fontWeight: 700 }} formatter={(v: unknown) => (v as number) > 0 ? fmtK(v as number) + " gap" : ""} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 10 }}>
              {[
                { color: "#f6c90e", label: "HAFF grant" },
                { color: "#4d7fb5", label: "HA loan" },
                { color: "#6b8aa0", label: "State land" },
                { color: gc,        label: gl },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.72rem", color: "#94a3b8" }}>
                  <div style={{ width: 10, height: 10, background: color, borderRadius: 2 }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Cost breakdown */}
          <div className="chart-container">
            <div className="chart-title">Cost Breakdown</div>
            <Narrative>
              Every dollar of the {fmtK(r.tdc_ex_land)} build cost, broken into six components.
              Construction finance and statutory charges are often missing from older feasibility models —
              their omission understates the real cost and overstates project viability.
            </Narrative>
            <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginBottom: 12 }}>
              {r.gross_area_m2}m² gross · {fmt(r.sqm_rate)}/m² ({state} state-adjusted)
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {costItems.map(item => (
                <div key={item.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{item.name}</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#fff" }}>{fmt(item.value)}</span>
                  </div>
                  <div style={{ background: "#0b1220", borderRadius: 3, height: 5, overflow: "hidden" }}>
                    <div style={{ width: `${Math.round(item.pct * 100)}%`, height: "100%", background: item.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
              <div style={{ borderTop: "1px solid #1e2d40", paddingTop: 10, display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#fff" }}>Total Development Cost (ex-land)</span>
                <span style={{ fontSize: "0.92rem", fontWeight: 900, color: "#f6c90e" }}>{fmt(r.tdc_ex_land)}</span>
              </div>
            </div>

            {/* Rental income panel */}
            <div style={{ marginTop: 18, borderTop: "1px solid #1e2d40", paddingTop: 14 }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 }}>Rental Income → Debt Capacity</div>
              <p style={{ fontSize: "0.74rem", color: "#94a3b8", lineHeight: 1.7, margin: "0 0 10px 0" }}>
                The loan amount is determined by what tenants can <em>afford to pay</em> — not what the building costs.
                This step-by-step shows how weekly rent translates into maximum loan size.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {[
                  ["Social rent (25% × VLI)",      fmt(r.social_rent_weekly) + "/wk",   "#888"],
                  ["Affordable rent (74.9% mkt)",   fmt(r.affordable_rent_weekly) + "/wk", "#888"],
                  ["Blended (" + r.tenure_label + ")", fmt(r.blended_rent_weekly) + "/wk", "#f6c90e"],
                  ["OpEx deducted (30%)",           "−" + fmt(Math.round(r.blended_rent_weekly * 52 * OPEX_RATIO / 52)) + "/wk", "#666"],
                  ["NOI",                           fmt(Math.round(r.blended_rent_weekly * 52 * (1 - OPEX_RATIO))) + "/yr", "#888"],
                  ["Rate · term · DSCR",            r.nhfic_rate_pct + "% · " + LOAN_TERM_YEARS + "yr · " + DSCR + "×", "#666"],
                  ["Max HA loan",                   fmt(r.nhfic_debt), "#4d7fb5"],
                ].map(([label, val, color]) => (
                  <div key={label as string} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                    <span style={{ color: "#94a3b8" }}>{label}</span>
                    <span style={{ color: color as string, fontWeight: ["Blended (" + r.tenure_label + ")", "Max HA loan"].includes(label as string) ? 700 : 400 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Break-even & levers ── */}
        <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 10, padding: "18px 22px", marginBottom: 24 }}>
          <div id="feas-levers" style={{ scrollMarginTop: 130 }} />
          <SectionLabel>Closing the Gap — Key Levers</SectionLabel>
          <Narrative>
            Three things a development team can actually do to reduce the funding gap.
            No single lever closes it entirely — which is exactly why government capital grants remain essential.
            Use these to frame your funding strategy and board presentation.
          </Narrative>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>

            {/* Lever 1: Tenure */}
            <div style={{ background: "#0b1220", borderRadius: 8, padding: "14px 16px" }}>
              <div style={{ fontSize: "0.80rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Lever 1: Tenure Mix</div>
              <p style={{ fontSize: "0.73rem", color: "#94a3b8", lineHeight: 1.7, margin: "0 0 8px 0" }}>
                Shifting from social to affordable tenants means higher rents, which means a bigger loan — but at the
                cost of housing people in deeper need. This shows how far tenure can take you.
              </p>
              <div style={{ fontSize: "0.8rem", color: be !== null && be <= 1.0 ? "#c49a3a" : "#c0614a", fontWeight: 700, marginBottom: 6 }}>
                {beText}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", lineHeight: 1.6 }}>
                100% affordable → gap reduces to{" "}
                <strong style={{ color: r.gap_at_100pct_affordable === 0 ? "#5aad8a" : "#c49a3a" }}>
                  {r.gap_at_100pct_affordable === 0 ? "zero" : fmtK(r.gap_at_100pct_affordable)}
                </strong>
                {" "}(vs {fmtK(r.funding_gap)} at {r.tenure_label})
              </div>
            </div>

            {/* Lever 2: HAFF round */}
            <div style={{ background: "#0b1220", borderRadius: 8, padding: "14px 16px" }}>
              <div style={{ fontSize: "0.80rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Lever 2: HAFF Round</div>
              <p style={{ fontSize: "0.73rem", color: "#94a3b8", lineHeight: 1.7, margin: "0 0 8px 0" }}>
                Each successive HAFF round has offered higher grants. Selecting R3 or R4 shows
                how much the gap shrinks as the program matures — and helps you assess which round to target.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {Object.entries(HAFF_GRANT_OPTIONS).map(([key, opt]) => {
                  const r2 = computeFeasibility(state, typology, tenure, key)
                  return (
                    <div key={key} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                      <span style={{ color: key === haff ? "#f6c90e" : "#666" }}>{opt.label}</span>
                      <span style={{ color: r2.funding_gap === 0 ? "#5aad8a" : r2.funding_gap < 100000 ? "#c49a3a" : "#c0614a", fontWeight: 600 }}>
                        {r2.funding_gap === 0 ? "Viable" : fmtK(r2.funding_gap) + " gap"}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Lever 3: Equity needed */}
            <div style={{ background: "#0b1220", borderRadius: 8, padding: "14px 16px" }}>
              <div style={{ fontSize: "0.80rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Lever 3: Equity / Top-up Required</div>
              <p style={{ fontSize: "0.73rem", color: "#94a3b8", lineHeight: 1.7, margin: "0 0 8px 0" }}>
                After all grants and loans, this is the remaining capital your organisation must bring to the table.
                Common sources include state capital grants, CHP balance sheet equity, market cross-subsidy, or philanthropic capital.
              </p>
              {r.funding_gap > 0 ? (
                <>
                  <div style={{ fontSize: "1.2rem", fontWeight: 900, color: gc, marginBottom: 4 }}>{fmtK(r.funding_gap)}</div>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8", lineHeight: 1.6 }}>
                    per dwelling · {fmtK(total(r.funding_gap))} for {dwellings}-dwelling project.<br />
                    Sources: CHP equity, state capital grant, cross-subsidy from market sales, philanthropic capital.
                  </div>
                </>
              ) : (
                <div style={{ fontSize: "0.82rem", color: "#5aad8a", fontWeight: 700 }}>✓ Fully funded — no equity required.</div>
              )}
            </div>
          </div>
        </div>

        {/* ── State comparison strip ── */}
        <div style={{ marginBottom: 24 }}>
          <div id="feas-states" style={{ scrollMarginTop: 130 }} />
          <SectionLabel>State Comparison — {TYPOLOGIES[typology].label} · {TENURE_MIXES[tenure].label} · {HAFF_GRANT_OPTIONS[haff].label}</SectionLabel>
          <Narrative>
            How the funding gap varies across all 8 states and territories for your selected scenario.
            Click any state to switch the calculator to that state.
            Gap differences are driven by both construction cost (×multiplier) and state land contributions —
            a lower-cost state can still have a larger gap if its land program is smaller.
          </Narrative>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {comparison.map(c => {
              const gc2 = gapColor(c.gap)
              const isSelected = c.state === state
              const fundedPct = Math.round(c.funded / c.tdc * 100)
              return (
                <div
                  key={c.state}
                  onClick={() => setState(c.state)}
                  style={{
                    background: isSelected ? "#1f2937" : "#111827",
                    border: `1px solid ${isSelected ? "#f6c90e55" : "#1e2d40"}`,
                    borderTop: `3px solid ${gc2}`,
                    borderRadius: 8, padding: "14px 16px", cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: "0.88rem", fontWeight: 800, color: isSelected ? "#f6c90e" : "#fff" }}>{c.state}</div>
                    <div style={{ fontSize: "0.6rem", fontWeight: 700, padding: "2px 6px", borderRadius: 3, background: `${gc2}18`, color: gc2, border: `1px solid ${gc2}33` }}>
                      {fundedPct}%
                    </div>
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "#4a5a6a", marginBottom: 1, textTransform: "uppercase", letterSpacing: "0.5px" }}>TDC (ex-land)</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", marginBottom: 8 }}>{fmtK(c.tdc)}</div>
                  <div style={{ fontSize: "0.65rem", color: "#4a5a6a", marginBottom: 1, textTransform: "uppercase", letterSpacing: "0.5px" }}>State land</div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6b8aa0", marginBottom: 8 }}>{fmtK(c.funded - (HAFF_GRANT_OPTIONS[haff]?.grant ?? 0) - c.debt)}</div>
                  <div style={{ fontSize: "0.65rem", color: "#4a5a6a", marginBottom: 1, textTransform: "uppercase", letterSpacing: "0.5px" }}>Gap</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 900, color: gc2, marginBottom: 6 }}>
                    {c.gap === 0 ? "✓ Viable" : fmtK(c.gap)}
                  </div>
                  <div className="progress-bar" style={{ height: 5 }}>
                    <div className="progress-fill" style={{ width: `${Math.min(100, fundedPct)}%`, background: gc2 }} />
                  </div>
                  <div style={{ fontSize: "0.62rem", color: "#4a5a6a", marginTop: 3 }}>
                    {fundedPct}% of TDC funded
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Sensitivity table ── */}
        <div style={{ marginBottom: 24 }}>
          <div id="feas-sensitivity" style={{ scrollMarginTop: 130 }} />
          <SectionLabel>Construction Cost Sensitivity</SectionLabel>
          <Narrative>
            Build costs are the biggest uncertainty in any feasibility assessment.
            This table shows how the gap moves across a ±15% range — useful for stress-testing
            your business case in board presentations or funding submissions.
            A project should remain fundable even at the +15% scenario.
          </Narrative>
          <table className="hive-table">
            <thead>
              <tr>
                <th>Scenario</th>
                <th>TDC (ex-land)</th>
                <th>Funded</th>
                <th>Gap/dwelling</th>
                <th>Gap ({dwellings} dwgs)</th>
                <th>Gap/m²</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {r.sensitivity.map(s => {
                const perM2 = s.gap > 0 ? Math.round(s.gap / TYPOLOGIES[typology].net_area_m2) : 0
                const viable = s.gap <= 50_000
                return (
                  <tr key={s.label}>
                    <td style={{ color: s.color, fontWeight: 600 }}>{s.label}</td>
                    <td>{fmt(s.tdc)}</td>
                    <td style={{ color: "#94a3b8" }}>{fmt(r.total_funded)}</td>
                    <td style={{ color: s.gap === 0 ? "#5aad8a" : s.color, fontWeight: 700 }}>
                      {s.gap === 0 ? "None" : fmt(s.gap)}
                    </td>
                    <td style={{ color: "#94a3b8" }}>{s.gap === 0 ? "—" : fmtK(total(s.gap))}</td>
                    <td style={{ color: "#94a3b8" }}>{perM2 > 0 ? fmt(perM2) : "—"}</td>
                    <td>
                      <span className="badge" style={{
                        background: viable ? "rgba(39,174,96,0.12)" : "rgba(231,76,60,0.12)",
                        color: viable ? "#5aad8a" : "#c0614a",
                        border: `1px solid ${viable ? "rgba(39,174,96,0.3)" : "rgba(231,76,60,0.3)"}`,
                        fontSize: "0.78rem",
                      }}>
                        {viable ? "Viable with equity" : "Requires top-up"}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ── Methodology ── */}
        <div style={{ marginBottom: 24 }}>
          <div id="feas-methodology" style={{ scrollMarginTop: 130 }} />
          <SectionLabel>How the Numbers Are Calculated</SectionLabel>
          <Narrative>
            Every figure in this tool is derived from published industry data and Housing Australia's own lending guidelines.
            Below is a plain-English explanation of each calculation — and why the specific values were chosen.
            These are the same assumptions used in actual HAFF funding submissions.
          </Narrative>

          {/* Row 1: What goes in */}
          <div style={{ fontSize: "0.66rem", fontWeight: 700, color: "#444", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 8 }}>
            What goes into the build cost
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
            <div className="hive-card">
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Construction Cost ($/m²)</div>
              <p style={{ fontSize: "0.78rem", color: "#cbd5e1", lineHeight: 1.75, margin: "0 0 8px 0" }}>
                <strong>What it is:</strong> The labour and materials cost to build one square metre of floor space.
                Different building types (apartment vs house) and states have different rates.
              </p>
              <p style={{ fontSize: "0.74rem", color: "#777", lineHeight: 1.7, margin: "0 0 8px 0" }}>
                <strong style={{ color: "#94a3b8" }}>Source:</strong> Rawlinsons Australian Construction Handbook 2025 — the industry standard used by every quantity surveyor in Australia.
                State multipliers (e.g. WA ×1.13) reflect regional cost differences published in the same guide.
              </p>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", lineHeight: 1.6, borderTop: "1px solid #1e2d40", paddingTop: 8 }}>
                Formula: gross area × $/m² × state multiplier = hard cost.<br />
                Current: {r.gross_area_m2}m² × {fmt(SQM_COST[TYPOLOGIES[typology].sqm_type])}/m² × {STATE_COST_MULTIPLIER[state]} = {fmt(r.hard_cost)}
              </div>
            </div>

            <div className="hive-card">
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>On-costs & Soft Costs</div>
              <p style={{ fontSize: "0.78rem", color: "#cbd5e1", lineHeight: 1.75, margin: "0 0 8px 0" }}>
                <strong>What they are:</strong> The additional costs on top of raw construction — professional fees
                (architect, engineers, project manager), contingency for unforeseen issues, and the cost of
                borrowing money during the build itself.
              </p>
              <p style={{ fontSize: "0.74rem", color: "#777", lineHeight: 1.7, margin: "0 0 8px 0" }}>
                <strong style={{ color: "#94a3b8" }}>Why these rates:</strong> 8% professional fees and 12% contingency
                are standard industry practice for social housing. Construction finance at 6% reflects an 18-month
                build at 7%pa on 60% average utilisation — this is often omitted from basic models.
              </p>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", lineHeight: 1.6, borderTop: "1px solid #1e2d40", paddingTop: 8 }}>
                Fees {fmt(r.professional_fees)} · Contingency {fmt(r.contingency)} · Finance {fmt(r.finance_cost)}<br />
                Council contributions {fmt(r.council_contributions)} · Statutory charges {fmt(r.statutory_charges)}
              </div>
            </div>

            <div className="hive-card">
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Social & Affordable Rent</div>
              <p style={{ fontSize: "0.78rem", color: "#cbd5e1", lineHeight: 1.75, margin: "0 0 8px 0" }}>
                <strong>What it is:</strong> Social rent is capped at 25% of a very low income (VLI) household's
                income. Affordable rent is capped at 74.9% of market rent. Both are hard limits set by national
                housing policy — tenants pay whatever is lower.
              </p>
              <p style={{ fontSize: "0.74rem", color: "#777", lineHeight: 1.7, margin: "0 0 8px 0" }}>
                <strong style={{ color: "#94a3b8" }}>Source:</strong> ABS Household Income 2023-24 (median income by state);
                HAFF program guidelines for the 74.9% affordable rent cap.
              </p>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", lineHeight: 1.6, borderTop: "1px solid #1e2d40", paddingTop: 8 }}>
                {state} social rent: {fmt(r.social_rent_weekly)}/wk (25% × VLI)<br />
                Affordable rent: {fmt(r.affordable_rent_weekly)}/wk (74.9% × {fmt(MARKET_RENT_WEEKLY[state])} market)
              </div>
            </div>
          </div>

          {/* Row 2: Why these settings */}
          <div style={{ fontSize: "0.66rem", fontWeight: 700, color: "#444", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 8 }}>
            Why these specific settings (credibility notes)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <div className="hive-card">
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#4d7fb5", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Why 30% Operating Costs?</div>
              <p style={{ fontSize: "0.78rem", color: "#cbd5e1", lineHeight: 1.75, margin: "0 0 8px 0" }}>
                <strong>What it represents:</strong> The cost to manage, maintain, and run a social housing property —
                repairs, property management, insurance, compliance. 30% of gross rent is deducted before we
                calculate what's available for loan repayments.
              </p>
              <p style={{ fontSize: "0.74rem", color: "#777", lineHeight: 1.7, margin: 0 }}>
                <strong style={{ color: "#c49a3a" }}>Why not 26%?</strong> Older models used 26%, which was optimistic.
                Housing Australia's own operating benchmarks for CHPs are 30–35%. Using 30% is conservative but
                credible — any lender or funder reviewing this model will accept it.
              </p>
            </div>

            <div className="hive-card">
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#4d7fb5", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Why 1.10 DSCR?</div>
              <p style={{ fontSize: "0.78rem", color: "#cbd5e1", lineHeight: 1.75, margin: "0 0 8px 0" }}>
                <strong>What it means:</strong> The Debt Service Coverage Ratio (DSCR) is a buffer Housing Australia
                requires to ensure you can always make loan repayments even if some income is lost.
                A 1.10× DSCR means your net income must be 10% higher than your annual loan repayment.
              </p>
              <p style={{ fontSize: "0.74rem", color: "#777", lineHeight: 1.7, margin: 0 }}>
                <strong style={{ color: "#c49a3a" }}>Why not 1.05?</strong> 1.05 was used in earlier models.
                Housing Australia's actual minimum lending standard is 1.10×. Using the correct figure
                reduces maximum loan size by ~5% — which is why this model shows a larger gap than older versions.
              </p>
            </div>

            <div className="hive-card">
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#4d7fb5", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>How the Debt Capacity Formula Works</div>
              <p style={{ fontSize: "0.78rem", color: "#cbd5e1", lineHeight: 1.75, margin: "0 0 8px 0" }}>
                <strong>Step by step:</strong> Blended weekly rent → annual income → minus 30% OpEx = NOI →
                divide by 1.10 DSCR = available for debt service → divide by loan constant (5.5% / 30yr) = max loan.
              </p>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", lineHeight: 1.6, borderTop: "1px solid #1e2d40", paddingTop: 8, marginTop: 8 }}>
                {fmt(r.blended_rent_weekly)}/wk × 52 = {fmt(r.blended_rent_weekly * 52)}/yr<br />
                × (1 − 30%) = {fmt(Math.round(r.blended_rent_weekly * 52 * 0.7))} NOI<br />
                ÷ 1.10 DSCR ÷ {DEBT_SERVICE_FACTOR.toFixed(4)} DS factor<br />
                = <strong style={{ color: "#4d7fb5" }}>{fmt(r.nhfic_debt)}</strong> max HA loan
              </div>
            </div>
          </div>
        </div>

        {/* ── HIVE Analysis ── */}
        <Analysis>
          <strong style={{ color: "#fff" }}>{r.typology_label}</strong> in{" "}
          <strong style={{ color: "#fff" }}>{r.state_label}</strong>,{" "}
          <strong style={{ color: "#fff" }}>{r.tenure_label}</strong> tenure,{" "}
          {HAFF_GRANT_OPTIONS[haff].label} HAFF grant:
          TDC is <strong style={{ color: "#fff" }}>{fmt(r.tdc_ex_land)}</strong> ex-land (incl. {fmtK(r.finance_cost)} construction finance
          and {fmtK(r.statutory_charges)} statutory charges — both absent from older feasibility models).{" "}
          {r.funding_gap > 0 ? (
            <>
              The funding gap is <strong style={{ color: gc }}>{fmt(r.funding_gap)}</strong> per dwelling
              ({fmtK(total(r.funding_gap))} for a {dwellings}-dwelling project).{" "}
              {be !== null && be <= 1.0 && be > 0 && (
                <>Shifting to {Math.ceil(be * 100)}%+ affordable tenure would close the gap, but reduces social housing impact. </>
              )}
              {be !== null && be > 1.0 && (
                <>Even at 100% affordable, a {fmtK(r.gap_at_100pct_affordable)} gap remains — tenure mix alone is insufficient.
                The project needs <strong style={{ color: "#fff" }}>R{r.haff_scenario === "r1-3-avg" ? "3/4 grant rates" : "additional state capital"}</strong>,
                direct equity, or cross-subsidy from market components. </>
              )}
            </>
          ) : (
            <>The combination is fully funded — achievable only with strong land contributions and affordable-led tenure.</>
          )}
          {" "}Key model corrections vs prior version: OPEX lifted from 26% → 30% (HA benchmark);
          DSCR from 1.05 → 1.10 (HA minimum);{" "}
          {state === "WA" && "WA market rent corrected $670 → $750 (Perth rental surge); "}
          state construction multiplier applied ({state} ×{STATE_COST_MULTIPLIER[state]});
          construction finance and statutory charges added. Combined effect:{" "}
          <strong style={{ color: "#c0614a" }}>gaps are materially larger than legacy models suggest.</strong>
        </Analysis>

        </>)}

        {/* ══ PROGRAM DESIGN — Policy Scenario Modeller ════════════════════════ */}
        {pageTab === "program" && (
          <div>

            {/* Intro */}
            <div className="callout-blue" style={{ marginBottom: 24, fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.7 }}>
              <strong style={{ color: "#7aaad4" }}>Policy Scenario Modeller.</strong>{" "}
              Compare two HAFF grant rates across all 8 states and territories for a given typology and tenure mix.
              Understand the programme cost difference and the viability impact before announcing a new round.
              Numbers update live — adjust the inputs and selectors below.
            </div>

            {/* Controls */}
            <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 10, marginBottom: 24, overflow: "hidden" }}>
              <div style={{ padding: "12px 24px", borderBottom: "1px solid #1e2d40", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "2px", textTransform: "uppercase" }}>🐝 Scenario Parameters</span>
                <span style={{ fontSize: "0.72rem", color: "#4a5a6a" }}>Results update instantly</span>
              </div>
              <div style={{ padding: "20px 24px" }}>

                {/* Grant rate selectors — A vs B */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", gap: "0 32px", marginBottom: 20 }}>
                  {/* Scenario A */}
                  <div>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#6b8aa0", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>
                      Scenario A — Baseline
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                      {[
                        { label: "R1–3 Avg", value: 55451 },
                        { label: "R3 Rate", value: 78531 },
                        { label: "R4 Est.", value: 95000 },
                      ].map(({ label, value }) => (
                        <button key={label} onClick={() => setGrantA(value)}
                          style={{
                            padding: "5px 12px", fontSize: "0.76rem", fontWeight: grantA === value ? 700 : 500,
                            color: grantA === value ? "#0b1220" : "#94a3b8",
                            border: `1px solid ${grantA === value ? "#4d7fb5" : "#2a3d52"}`,
                            borderRadius: 6,
                            background: grantA === value ? "#4d7fb5" : "rgba(255,255,255,0.03)",
                            cursor: "pointer",
                          }}>
                          {label} · {fmtK(value)}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      <span style={{ fontSize: "0.72rem", color: "#6b8aa0", flexShrink: 0 }}>Custom:</span>
                      <input type="number" min={10000} max={200000} step={1000}
                        value={grantA}
                        onChange={e => { const v = parseInt(e.target.value); if (!isNaN(v) && v > 0) setGrantA(v) }}
                        style={{ flex: 1, background: "#1f2937", border: "1px solid #2a3d52", borderRadius: 6, padding: "4px 8px", color: "#e2e8f0", fontSize: "0.82rem", fontWeight: 700, textAlign: "right", outline: "none" }}
                      />
                      <span style={{ fontSize: "0.72rem", color: "#4d7fb5", fontWeight: 700, flexShrink: 0 }}>{fmtK(grantA)}</span>
                    </div>
                  </div>

                  <div style={{ background: "#1e2d40" }} />

                  {/* Scenario B */}
                  <div>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#5aad8a", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>
                      Scenario B — Proposed
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                      {[
                        { label: "R1–3 Avg", value: 55451 },
                        { label: "R3 Rate", value: 78531 },
                        { label: "R4 Est.", value: 95000 },
                      ].map(({ label, value }) => (
                        <button key={label} onClick={() => setGrantB(value)}
                          style={{
                            padding: "5px 12px", fontSize: "0.76rem", fontWeight: grantB === value ? 700 : 500,
                            color: grantB === value ? "#0b1220" : "#94a3b8",
                            border: `1px solid ${grantB === value ? "#5aad8a" : "#2a3d52"}`,
                            borderRadius: 6,
                            background: grantB === value ? "#5aad8a" : "rgba(255,255,255,0.03)",
                            cursor: "pointer",
                          }}>
                          {label} · {fmtK(value)}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      <span style={{ fontSize: "0.72rem", color: "#6b8aa0", flexShrink: 0 }}>Custom:</span>
                      <input type="number" min={10000} max={200000} step={1000}
                        value={grantB}
                        onChange={e => { const v = parseInt(e.target.value); if (!isNaN(v) && v > 0) setGrantB(v) }}
                        style={{ flex: 1, background: "#1f2937", border: "1px solid #2a3d52", borderRadius: 6, padding: "4px 8px", color: "#e2e8f0", fontSize: "0.82rem", fontWeight: 700, textAlign: "right", outline: "none" }}
                      />
                      <span style={{ fontSize: "0.72rem", color: "#5aad8a", fontWeight: 700, flexShrink: 0 }}>{fmtK(grantB)}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom row: typology, tenure, target homes */}
                <div style={{ display: "flex", gap: 32, flexWrap: "wrap", paddingTop: 16, borderTop: "1px solid #1e2d40" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#7a8fa8", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8 }}>Typology</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                      {Object.entries(TYPOLOGIES).map(([k, v]) => (
                        <button key={k} onClick={() => setScenTypology(k)}
                          style={{
                            padding: "5px 10px", fontSize: "0.74rem", fontWeight: scenTypology === k ? 700 : 500,
                            color: scenTypology === k ? "#0b1220" : "#94a3b8",
                            border: `1px solid ${scenTypology === k ? "#f6c90e" : "#2a3d52"}`,
                            borderRadius: 6,
                            background: scenTypology === k ? "#f6c90e" : "rgba(255,255,255,0.03)",
                            cursor: "pointer",
                          }}>{v.label}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#7a8fa8", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8 }}>Tenure Mix</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {Object.entries(TENURE_MIXES).map(([k, v]) => (
                        <button key={k} onClick={() => setScenTenure(k)}
                          style={{
                            padding: "5px 10px", fontSize: "0.74rem", fontWeight: scenTenure === k ? 700 : 500,
                            color: scenTenure === k ? "#0b1220" : "#94a3b8",
                            border: `1px solid ${scenTenure === k ? "#f6c90e" : "#2a3d52"}`,
                            borderRadius: 6,
                            background: scenTenure === k ? "#f6c90e" : "rgba(255,255,255,0.03)",
                            cursor: "pointer",
                          }}>{v.label}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ minWidth: 180 }}>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#7a8fa8", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8 }}>Target Homes</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 8 }}>
                      {[10000, 20000, 40000, 60000].map(n => (
                        <button key={n} onClick={() => setTargetHomes(n)}
                          style={{
                            padding: "5px 6px", fontSize: "0.72rem", fontWeight: targetHomes === n ? 700 : 500,
                            color: targetHomes === n ? "#0b1220" : "#94a3b8",
                            border: `1px solid ${targetHomes === n ? "#f6c90e" : "#2a3d52"}`,
                            borderRadius: 6,
                            background: targetHomes === n ? "#f6c90e" : "rgba(255,255,255,0.03)",
                            cursor: "pointer", textAlign: "center",
                          }}>{(n / 1000).toFixed(0)}k</button>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <input type="number" min={1000} max={500000} step={1000}
                        value={targetHomes}
                        onChange={e => { const v = parseInt(e.target.value); if (!isNaN(v) && v > 0) setTargetHomes(v) }}
                        style={{ flex: 1, background: "#1f2937", border: "1px solid #2a3d52", borderRadius: 6, padding: "4px 8px", color: "#e2e8f0", fontSize: "0.78rem", fontWeight: 700, textAlign: "right", outline: "none" }}
                      />
                      <span style={{ fontSize: "0.68rem", color: "#6b8aa0", flexShrink: 0 }}>homes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Scenario A programme cost",  value: `$${(totalCostA / 1e9).toFixed(2)}B`, color: "#4d7fb5", sub: `${fmtK(grantA)}/home × ${targetHomes.toLocaleString()} homes` },
                { label: "Scenario B programme cost",  value: `$${(totalCostB / 1e9).toFixed(2)}B`, color: "#5aad8a", sub: `${fmtK(grantB)}/home × ${targetHomes.toLocaleString()} homes` },
                { label: "Additional investment (B−A)", value: `${totalCostB > totalCostA ? "+" : ""}$${(Math.abs(additionalCost) / 1e9).toFixed(2)}B`, color: totalCostB > totalCostA ? "#c49a3a" : "#5aad8a", sub: `Per-home: ${totalCostB > totalCostA ? "+" : ""}${fmtK(Math.abs(grantB - grantA))}` },
                { label: "Average gap reduction",       value: `−${fmtK(avgDelta)}`, color: "#5aad8a", sub: `${fmtK(avgGapA)} → ${fmtK(avgGapB)} avg across all states` },
              ].map(({ label, value, color, sub }) => (
                <div key={label} className="kpi-card">
                  <div className="kpi-label">{label}</div>
                  <div className="kpi-value" style={{ fontSize: "1.4rem", color }}>{value}</div>
                  <div className="kpi-delta">{sub}</div>
                </div>
              ))}
            </div>

            {/* State viability matrix */}
            <div style={{ marginBottom: 24 }}>
              <div className="section-label">State Viability Matrix — {TYPOLOGIES[scenTypology]?.label} · {TENURE_MIXES[scenTenure]?.label}</div>
              <div style={{ overflowX: "auto" }}>
                <table className="hive-table">
                  <thead>
                    <tr>
                      <th>State</th>
                      <th>TDC (ex-land)</th>
                      <th>HA Debt</th>
                      <th>State Land</th>
                      <th style={{ color: "#4d7fb5" }}>Gap — A ({fmtK(grantA)})</th>
                      <th style={{ color: "#5aad8a" }}>Gap — B ({fmtK(grantB)})</th>
                      <th>Reduction</th>
                      <th>Verdict</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenarioResults.map(row => {
                      const verdictColor = row.viableB ? "#5aad8a" : row.gapB < 60000 ? "#c49a3a" : "#c0614a"
                      const verdict = row.viableB
                        ? "Viable at B"
                        : row.gapB < 60000
                        ? "Close — state supplement"
                        : row.gapB < 120000
                        ? "Moderate gap"
                        : "Significant gap"
                      return (
                        <tr key={row.state}>
                          <td style={{ fontWeight: 700, color: "#fff" }}>{row.state}</td>
                          <td>{fmtK(row.tdc)}</td>
                          <td style={{ color: "#4d7fb5" }}>{fmtK(row.debt)}</td>
                          <td style={{ color: "#6b8aa0" }}>{fmtK(row.land)}</td>
                          <td style={{ color: row.viableA ? "#5aad8a" : "#c0614a", fontWeight: 600 }}>
                            {row.viableA ? "✓ Viable" : fmtK(row.gapA)}
                          </td>
                          <td style={{ color: row.viableB ? "#5aad8a" : "#7aaad4", fontWeight: 600 }}>
                            {row.viableB ? "✓ Viable" : fmtK(row.gapB)}
                          </td>
                          <td style={{ color: "#5aad8a", fontWeight: 600 }}>
                            {row.delta > 0 ? `−${fmtK(row.delta)}` : row.delta === 0 ? "—" : `+${fmtK(-row.delta)}`}
                          </td>
                          <td>
                            <span style={{
                              fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                              background: `${verdictColor}18`, color: verdictColor, border: `1px solid ${verdictColor}33`,
                            }}>{verdict}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: "2px solid #1e2d40" }}>
                      <td style={{ fontWeight: 700, color: "#c8d8e8" }}>Average</td>
                      <td style={{ color: "#c8d8e8" }}>{fmtK(Math.round(scenarioResults.reduce((s, r) => s + r.tdc, 0) / scenarioResults.length))}</td>
                      <td style={{ color: "#4d7fb5" }}>{fmtK(Math.round(scenarioResults.reduce((s, r) => s + r.debt, 0) / scenarioResults.length))}</td>
                      <td style={{ color: "#6b8aa0" }}>{fmtK(Math.round(scenarioResults.reduce((s, r) => s + r.land, 0) / scenarioResults.length))}</td>
                      <td style={{ color: "#c0614a", fontWeight: 700 }}>{fmtK(avgGapA)}</td>
                      <td style={{ color: "#7aaad4", fontWeight: 700 }}>{fmtK(avgGapB)}</td>
                      <td style={{ color: "#5aad8a", fontWeight: 700 }}>−{fmtK(avgDelta)}</td>
                      <td><span style={{ fontSize: "0.65rem", color: "#4a5a6a" }}>{viableCountB}/{STATES.length} viable at B</span></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Policy implication analysis */}
            <Analysis>
              At <strong style={{ color: "#fff" }}>{fmtK(grantA)} (Scenario A)</strong>, the average gap across
              {" "}{TYPOLOGIES[scenTypology]?.label} projects is <strong style={{ color: "#c0614a" }}>{fmtK(avgGapA)}/dwelling</strong> —
              this equity must come from CHP capital, state government grants, or cross-subsidy from market components.
              Raising to <strong style={{ color: "#5aad8a" }}>{fmtK(grantB)} (Scenario B)</strong> reduces the average gap
              to <strong style={{ color: "#5aad8a" }}>{fmtK(avgGapB)}/dwelling</strong> — a reduction of {fmtK(avgDelta)}.
              {" "}For {targetHomes.toLocaleString()} homes, Scenario B requires{" "}
              <strong style={{ color: "#fff" }}>${(totalCostB / 1e9).toFixed(2)}B</strong> vs Scenario A's{" "}
              <strong style={{ color: "#4d7fb5" }}>${(totalCostA / 1e9).toFixed(2)}B</strong>{" "}
              — an additional <strong style={{ color: "#c49a3a" }}>${(additionalCost / 1e9).toFixed(2)}B</strong> in programme investment.
              {bestStateB.viableB ? (
                <>{" "}{bestStateB.label} is viable at Scenario B ({fmtK(grantB)} grant) with land contributions included.</>
              ) : (
                <>{" "}{bestStateB.label} is closest to viability at {fmtK(grantB)} with a residual gap of only {fmtK(bestStateB.gapB)}/dwelling — addressable through state supplements or cross-subsidy.</>
              )}
              {" "}The case for higher grant rates is not just cost-per-home — it is the equity burden reduction across {targetHomes.toLocaleString()} projects
              that the CHP sector would otherwise need to raise from thin operating margins.
            </Analysis>

            {/* Methodology note */}
            <div style={{ marginTop: 16, borderTop: "1px solid #1e2d40", paddingTop: 14 }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#4a5a6a", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8 }}>Model Notes</div>
              <div style={{ fontSize: "0.72rem", color: "#4a5a6a", lineHeight: 1.6 }}>
                TDC uses Rawlinsons 2025 state-adjusted rates. HA debt capacity calculated from blended rental income at selected tenure mix using HA lending guidelines (DSCR 1.1, 30yr, 5.5%, 30% OPEX).
                State land contributions are metro benchmarks — project-specific land values will materially vary.
                This tool models a single dwelling typology uniformly across states; real portfolios mix typologies and locations.
                <strong style={{ color: "#6b8aa0" }}> Use for directional policy analysis, not project-level investment decisions.</strong>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
