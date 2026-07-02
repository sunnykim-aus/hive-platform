"use client"
import { useState } from "react"

// ── Data imports ──────────────────────────────────────────────────────────────

import {
  FUNDING_MECHANISMS, RECOMMENDED_STACKS, getFundingSummary, FundingType,
} from "@/lib/data/funding"
import { HAFF_OVERVIEW, HAFF_ROUNDS, getHaffSummary, getStateTotals } from "@/lib/data/haff"
import {
  SECTOR_OVERVIEW, TOP_CHPS, STATE_DISTRIBUTION,
  SECTOR_TRENDS,
} from "@/lib/data/chp-sector"
import { getScoredRegions, OPPORTUNITY_COLORS, COVERAGE_COLORS } from "@/lib/data/sa4-opportunity"
import {
  COST_INDEX, GLOBAL_EVENTS, COST_PER_DWELLING, BILLION_DOLLAR_YIELD,
  STOCK_CONDITION, STATE_CONDITION, GOVERNMENT_RESPONSES, getCostImpactSummary,
} from "@/lib/data/construction"

import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line, ReferenceLine, ReferenceArea,
} from "recharts"

// ── Shared helpers ────────────────────────────────────────────────────────────

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

function formatCurrency(amount_m: number): string {
  if (amount_m >= 1000) return `$${(amount_m / 1000).toFixed(1)}B`
  return `$${amount_m}M`
}

// ── Funding Navigator constants ───────────────────────────────────────────────

const FUNDING_TYPE_COLORS: Record<FundingType, string> = {
  grant:     "#5aad8a",
  loan:      "#4d7fb5",
  equity:    "#6b8aa0",
  tax:       "#1abc9c",
  guarantee: "#6b8aa0",
}

const FUNDING_TYPE_LABELS: Record<FundingType, string> = {
  grant:     "Grant",
  loan:      "Loan",
  equity:    "Equity",
  tax:       "Tax concession",
  guarantee: "Guarantee",
}

const PROG_STATUS_COLORS: Record<string, string> = {
  "active":              "#5aad8a",
  "next-round-q3-2025":  "#f6c90e",
  "ongoing":             "#4d7fb5",
  "state-specific":      "#6b8aa0",
  "announced":           "#6b8aa0",
}

const PROG_STATUS_LABELS: Record<string, string> = {
  "active":             "Active",
  "next-round-q3-2025": "Round 4 — Q3 2025",
  "ongoing":            "Ongoing",
  "state-specific":     "State-specific",
  "announced":          "Announced",
}

const HAFF_TABS = ["Overview", "Round 1", "Round 2", "Round 3", "All Rounds"]

const PIPELINE_STATUS_COLORS: Record<string, string> = {
  complete:   "#5aad8a",
  "on track": "#4d7fb5",
  underway:   "#c49a3a",
  projected:  "#666",
}

const PIE_COLORS = ["#f6c90e", "#4d7fb5", "#5aad8a", "#c0614a", "#6b8aa0", "#1abc9c", "#c49a3a"]

// ── Jump section configs ──────────────────────────────────────────────────────

const CHP_JUMP_SECTIONS = [
  { id: "chp-overview",      label: "Sector Overview" },
  { id: "chp-top",           label: "Top 20 CHPs" },
  { id: "chp-state",         label: "State Distribution" },
  { id: "chp-trends",        label: "Growth Trends" },
  { id: "chp-consolidation", label: "Consolidation" },
  { id: "chp-opportunity",   label: "Opportunity Map" },
]

const COST_JUMP_SECTIONS = [
  { id: "cost-index",     label: "Cost Index" },
  { id: "cost-events",    label: "Global Events" },
  { id: "cost-billion",   label: "$1B Comparison" },
  { id: "cost-flow",      label: "Flow-on Effects" },
  { id: "cost-stock",     label: "Stock Condition" },
  { id: "cost-responses", label: "Gov. Responses" },
]

// ── HAFF RoundPanel ───────────────────────────────────────────────────────────

function RoundPanel({ roundName }: { roundName: string }) {
  const r = HAFF_ROUNDS[roundName]
  if (!r) return null

  // Round not yet contracted — show application-phase view
  if (r.projects === 0) {
    return (
      <div>
        <div className="callout-gold" style={{ marginBottom: 20, fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.7 }}>
          <strong style={{ color: "#f6c90e" }}>{roundName} — {r.announced}</strong><br />
          {r.notes}
        </div>
        <div className="grid-4" style={{ marginBottom: 20 }}>
          {[
            { label: "Target Homes",      value: "21,350",       color: "#f6c90e", delta: "Social & affordable combined" },
            { label: "First Nations Pool", value: "$600M",        color: "#5aad8a", delta: "Ringfenced dedicated stream" },
            { label: "Applications Open",  value: "30 Jan 2026",  color: "#4d7fb5", delta: "Two-stage EOI process" },
            { label: "Status",             value: "In Progress",  color: "#c49a3a", delta: "Contracts expected late 2026" },
          ].map(({ label, value, color, delta }) => (
            <div key={label} className="kpi-card">
              <div className="kpi-label">{label}</div>
              <div className="kpi-value" style={{ fontSize: "1.4rem", color }}>{value}</div>
              <div className="kpi-delta">{delta}</div>
            </div>
          ))}
        </div>
        <div className="callout-blue" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#7aaad4", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8 }}>What to expect</div>
          <div style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.7 }}>
            Round 3 is the largest HAFF round yet. Applications received are under assessment — Housing Australia is expected to announce contracts in late 2026. The state-by-state breakdown, project count, social/affordable split, and grant amounts will be published on contract execution. Indicative proportions based on Rounds 1–2 distribution are shown in the data above.
          </div>
        </div>
        <div className="hive-card">
          <div className="section-label">Delivery Pipeline</div>
          <div style={{ display: "flex", gap: 0, alignItems: "flex-start", flexWrap: "wrap" }}>
            {r.delivery_pipeline.map((m, i) => (
              <div key={m.milestone} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ textAlign: "center", minWidth: 140 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", margin: "0 auto 8px",
                    background: PIPELINE_STATUS_COLORS[m.status] ?? "#666",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.8rem", fontWeight: 700, color: "#fff",
                  }}>{i + 1}</div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#cbd5e1", marginBottom: 2 }}>{m.milestone}</div>
                  <div style={{ fontSize: "0.80rem", color: "#94a3b8" }}>{m.date}</div>
                  <div>
                    <span className="badge" style={{
                      background: `${PIPELINE_STATUS_COLORS[m.status] ?? "#666"}22`,
                      color: PIPELINE_STATUS_COLORS[m.status] ?? "#666",
                      border: `1px solid ${PIPELINE_STATUS_COLORS[m.status] ?? "#666"}44`,
                      fontSize: "0.6rem", marginTop: 4,
                    }}>{m.status}</span>
                  </div>
                </div>
                {i < r.delivery_pipeline.length - 1 && (
                  <div style={{ width: 24, height: 1, background: "#2a3d52", flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="callout-gold" style={{ marginBottom: 20, fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.7 }}>
        <strong style={{ color: "#f6c90e" }}>{roundName} — {r.announced}</strong><br />
        {r.notes}
      </div>
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: "Total Homes",      value: r.total_homes.toLocaleString(),     color: "#f6c90e" },
          { label: "Social Homes",     value: r.social_homes.toLocaleString(),     color: "#5aad8a" },
          { label: "Affordable Homes", value: r.affordable_homes.toLocaleString(), color: "#4d7fb5" },
          { label: "Grant Component (est.)", value: `$${r.grants_total_m.toFixed(0)}M`,  color: "#fff"    },
        ].map(({ label, value, color }) => (
          <div key={label} className="kpi-card">
            <div className="kpi-label">{label}</div>
            <div className="kpi-value" style={{ fontSize: "1.6rem", color }}>{value}</div>
          </div>
        ))}
      </div>
      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="chart-container">
          <div className="chart-title">By State — Homes</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={r.by_state} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 10 }}>
              <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 13 }} tickLine={false} />
              <YAxis type="category" dataKey="state" tick={{ fill: "#ccc", fontSize: 12 }} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 13, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                formatter={(v: unknown) => [(v as number).toLocaleString(), ""]} />
              <Bar dataKey="social"     fill="#5aad8a" name="Social"     stackId="a" />
              <Bar dataKey="affordable" fill="#4d7fb5" name="Affordable" stackId="a" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-container">
          <div className="chart-title">By Sector</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={r.by_sector} cx="50%" cy="50%" outerRadius={80} dataKey="homes" nameKey="sector">
                {r.by_sector.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 13, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                formatter={(v: unknown, n: unknown) => [(v as number).toLocaleString(), n as string]} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-container">
          <div className="chart-title">Bedroom Mix</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={r.by_bedrooms} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
              <XAxis dataKey="bedrooms" tick={{ fill: "#94a3b8", fontSize: 13 }} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 13 }} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 13, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                formatter={(v: unknown) => [(v as number).toLocaleString(), ""]} />
              <Bar dataKey="homes" radius={[3, 3, 0, 0]}>
                {r.by_bedrooms.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-container">
          <div className="chart-title">Dwelling Types</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={r.by_dwelling_type} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                dataKey="homes" nameKey="type" paddingAngle={2}>
                {r.by_dwelling_type.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 13, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                formatter={(v: unknown) => [(v as number).toLocaleString(), ""]} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="hive-card">
        <div className="section-label">Delivery Pipeline</div>
        <div style={{ display: "flex", gap: 0, alignItems: "flex-start", flexWrap: "wrap" }}>
          {r.delivery_pipeline.map((m, i) => (
            <div key={m.milestone} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ textAlign: "center", minWidth: 140 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", margin: "0 auto 8px",
                  background: PIPELINE_STATUS_COLORS[m.status] ?? "#666",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.8rem", fontWeight: 700, color: "#fff",
                }}>{i + 1}</div>
                <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#cbd5e1", marginBottom: 2 }}>{m.milestone}</div>
                <div style={{ fontSize: "0.80rem", color: "#94a3b8" }}>{m.date}</div>
                <div>
                  <span className="badge" style={{
                    background: `${PIPELINE_STATUS_COLORS[m.status] ?? "#666"}22`,
                    color: PIPELINE_STATUS_COLORS[m.status] ?? "#666",
                    border: `1px solid ${PIPELINE_STATUS_COLORS[m.status] ?? "#666"}44`,
                    fontSize: "0.6rem", marginTop: 4,
                  }}>{m.status}</span>
                </div>
              </div>
              {i < r.delivery_pipeline.length - 1 && (
                <div style={{ width: 32, height: 2, background: "#1e2d40", marginBottom: 24 }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

const TOP_TABS = ["Funding Stacks", "CHP Sector", "Construction Costs"]

export default function FundingAndSectorPage() {
  const [activeTab,   setActiveTab]   = useState("Funding Stacks")
  const [activeFilter, setActiveFilter] = useState<"all" | FundingType>("all")

  // Opportunity Map state
  const [oppStateFilter, setOppStateFilter] = useState("All")
  const [oppBandFilter,  setOppBandFilter]  = useState("All")
  const [haffTab,     setHaffTab]     = useState("Overview")

  const summary     = getFundingSummary()
  const haffSummary = getHaffSummary()
  const stateTotals = getStateTotals()
  const haffPct     = Math.min(100, haffSummary.pct_of_5yr_target)
  const impact      = getCostImpactSummary()

  // CHP
  const top5Total  = TOP_CHPS.slice(0, 5).reduce((s, c) => s + c.dwellings, 0)
  const top20Total = TOP_CHPS.reduce((s, c) => s + c.dwellings, 0)
  const top20Data  = TOP_CHPS.map((c) => ({ name: c.short_name, dwellings: c.dwellings, color: c.color, state: c.state, national: c.national }))
  const stateChpData = STATE_DISTRIBUTION.map((s) => ({ state: s.state, dwellings: s.chp_dwellings, color: s.color }))
  const trendData  = SECTOR_TRENDS.map((t) => ({ year: t.year, community: t.chp_dwellings_k, public: t.public_housing_k, share: t.chp_share_pct }))

  // Opportunity Map computed data
  const allScoredRegions = getScoredRegions()
  const oppFiltered = allScoredRegions
    .filter(r => oppStateFilter === "All" || r.state === oppStateFilter)
    .filter(r => oppBandFilter === "All" || r.opportunity_band === oppBandFilter)
  const criticalCount  = allScoredRegions.filter(r => r.opportunity_band === "Critical").length
  const noCoverageCount = allScoredRegions.filter(r => r.tier1_chps.length === 0).length
  const avgOppScore    = Math.round(allScoredRegions.reduce((s, r) => s + r.opportunity_score, 0) / allScoredRegions.length)

  // Conditions
  const yieldDrop    = Math.round((1 - BILLION_DOLLAR_YIELD[2025] / BILLION_DOLLAR_YIELD[2019]) * 100)
  const costRisePct  = impact.cost_rise_pct
  const costIncrease = Math.round(impact.cost_increase_abs / 1000)
  const costData     = COST_INDEX.map((d) => ({ period: `${d.year} Q${d.q}`, index: d.index, hasLabel: !!d.label }))

  const filters: { key: "all" | FundingType; label: string; count: number }[] = [
    { key: "all",   label: "All Programs", count: summary.total_programs },
    { key: "grant", label: "Grants",       count: summary.grant_programs },
    { key: "loan",  label: "Loans",        count: summary.loan_programs },
    { key: "tax",   label: "Tax / Other",  count: summary.tax_programs },
  ]

  const filtered = activeFilter === "all"
    ? FUNDING_MECHANISMS
    : FUNDING_MECHANISMS.filter(m => m.type === activeFilter)

  return (
    <div style={{ background: "#0b1220", minHeight: "100vh" }}>
      <div className="page-container">

        <div className="page-header">
          <h1 className="page-title">Funding &amp; Programs</h1>
          <p className="page-subtitle">
            $39.7B in program capacity across 8 active programs — yet only 47% of the HAFF 40,000-home target is contracted (53% remains), construction costs have risen 58.5% since 2019, and the same $1B now builds 45% fewer homes. This is the complete funding intelligence layer: what&apos;s available, what it pays, and what it still can&apos;t close.
          </p>
        </div>

        {/* Top-level tab navigation */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {TOP_TABS.map((tab) => (
            <button
              key={tab}
              className={`tab-pill ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
              style={{ padding: "8px 22px", fontSize: "0.84rem" }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Jump nav — context-sensitive per tab ── */}
        <div style={{
          borderTop: "1px solid #1e2d40", borderBottom: "1px solid #1e2d40",
          background: "#070d18", overflowX: "auto", scrollbarWidth: "none",
          margin: "0 -24px 28px",
        }}>
          <div style={{ display: "flex", gap: 4, padding: "7px 24px", whiteSpace: "nowrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#4a5a6a", marginRight: 8, letterSpacing: "1px", textTransform: "uppercase", flexShrink: 0 }}>JUMP TO</span>
            {activeTab === "Funding Stacks" && [
              { id: "fund-featured", label: "HAFF" },
              { id: "fund-all", label: "All Programs" },
              { id: "fund-stacks", label: "Funding Stacks" },
            ].map(s => <a key={s.id} href={`#${s.id}`} style={{ display: "inline-block", padding: "4px 12px", fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8", background: "rgba(255,255,255,0.04)", border: "1px solid #1e2d40", borderRadius: 4, textDecoration: "none" }}>{s.label}</a>)}
            {activeTab === "CHP Sector" && [
              { id: "chp-overview", label: "Sector Overview" },
              { id: "chp-top20", label: "Top 20 CHPs" },
              { id: "chp-distribution", label: "State Distribution" },
              { id: "chp-growth", label: "Growth Trends" },
              { id: "chp-opportunity", label: "Opportunity Map" },
            ].map(s => <a key={s.id} href={`#${s.id}`} style={{ display: "inline-block", padding: "4px 12px", fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8", background: "rgba(255,255,255,0.04)", border: "1px solid #1e2d40", borderRadius: 4, textDecoration: "none" }}>{s.label}</a>)}
            {activeTab === "Construction Costs" && [
              { id: "cost-index", label: "Cost Index" },
              { id: "cost-events", label: "Global Events" },
              { id: "cost-impact", label: "$1B Impact" },
              { id: "cost-stock", label: "Stock Condition" },
              { id: "cost-responses", label: "Gov. Responses" },
            ].map(s => <a key={s.id} href={`#${s.id}`} style={{ display: "inline-block", padding: "4px 12px", fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8", background: "rgba(255,255,255,0.04)", border: "1px solid #1e2d40", borderRadius: 4, textDecoration: "none" }}>{s.label}</a>)}
          </div>
        </div>

        {/* ══ TAB 1: FUNDING STACKS ═════════════════════════════════════════ */}
        {activeTab === "Funding Stacks" && (
          <div>
            <div className="grid-4" style={{ marginBottom: 28 }}>
              <div className="kpi-card">
                <div className="kpi-label">Total Programs</div>
                <div className="kpi-value">{summary.total_programs}</div>
                <div className="kpi-delta">Active federal + state mechanisms</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Combined Program Capacity</div>
                <div className="kpi-value" style={{ fontSize: "1.5rem", color: "#f6c90e" }}>${summary.total_committed_bn}B</div>
                <div className="kpi-delta">Federal + state program sizes (incl. loan facilities)</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Grant Programs</div>
                <div className="kpi-value" style={{ color: "#5aad8a" }}>{summary.grant_programs}</div>
                <div className="kpi-delta">Direct non-repayable funding</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Loan / Finance Programs</div>
                <div className="kpi-value" style={{ color: "#4d7fb5" }}>{summary.loan_programs}</div>
                <div className="kpi-delta">Concessional debt facilities</div>
              </div>
            </div>

            {/* HAFF featured program */}
            <div id="fund-featured" style={{ scrollMarginTop: 130 }} />
            <div style={{ borderTop: "2px solid #f6c90e22", marginBottom: 32, paddingTop: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <span style={{
                  background: "#f6c90e22", border: "1px solid #f6c90e44", borderRadius: 6,
                  padding: "3px 10px", fontSize: "0.80rem", fontWeight: 700, color: "#f6c90e",
                  letterSpacing: "1.5px", textTransform: "uppercase",
                }}>Featured Program</span>
                <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Housing Australia Act 2023 · Off-budget fund</span>
              </div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fff", margin: "0 0 4px" }}>
                Housing Australia Future Fund (HAFF)
              </h2>
              <p style={{ fontSize: "0.82rem", color: "#94a3b8", margin: "0 0 20px", lineHeight: 1.6 }}>
                The ${HAFF_OVERVIEW.fund_size_bn}B off-budget endowment fund — the single largest federal commitment to social and
                affordable housing in a generation. Returns fund grant rounds for CHP delivery against a
                {" "}{HAFF_OVERVIEW.target_period} target of {HAFF_OVERVIEW.five_year_target_homes.toLocaleString()} homes.
              </p>

              <div className="grid-4" style={{ marginBottom: 16 }}>
                {[
                  { label: "Fund Size",          value: `$${HAFF_OVERVIEW.fund_size_bn}B`,           color: "#f6c90e", delta: "Off-budget · returns fund grants",                                                                                      border: "#f6c90e" },
                  { label: "Homes Announced",    value: haffSummary.total_homes.toLocaleString(),      color: "#5aad8a", delta: `${haffSummary.total_social.toLocaleString()} social · ${haffSummary.total_affordable.toLocaleString()} affordable`,     border: "#5aad8a" },
                  { label: "% of 5-Year Target", value: `${haffSummary.pct_of_5yr_target}%`,          color: "#4d7fb5", delta: `of ${HAFF_OVERVIEW.five_year_target_homes.toLocaleString()} home target`,                                               border: "#4d7fb5" },
                  { label: "Total Projects",     value: haffSummary.total_projects.toLocaleString(),   color: "#fff",    delta: "Across 3 rounds, all states",                                                                                          border: "#6b8aa0" },
                ].map(({ label, value, color, delta, border }) => (
                  <div key={label} className="kpi-card" style={{ borderTop: `3px solid ${border}` }}>
                    <div className="kpi-label">{label}</div>
                    <div className="kpi-value" style={{ color }}>{value}</div>
                    <div className="kpi-delta">{delta}</div>
                  </div>
                ))}
              </div>

              <div className="hive-card" style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.82rem", color: "#94a3b8" }}>
                  <span>Progress: {haffSummary.total_homes.toLocaleString()} homes announced</span>
                  <span>Target: {HAFF_OVERVIEW.five_year_target_homes.toLocaleString()} homes by {HAFF_OVERVIEW.target_period}</span>
                </div>
                <div className="progress-bar" style={{ height: 16 }}>
                  <div className="progress-fill" style={{ width: `${haffPct}%`, background: "linear-gradient(90deg, #5aad8a, #f6c90e)" }} />
                </div>
                <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#94a3b8" }}>
                  <span style={{ color: "#f6c90e", fontWeight: 600 }}>{haffPct}% of 5-year target</span>
                  <span>Remaining: {haffSummary.remaining_to_target.toLocaleString()} homes</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                {HAFF_TABS.map((tab) => (
                  <button key={tab} className={`tab-pill ${haffTab === tab ? "active" : ""}`} onClick={() => setHaffTab(tab)}>
                    {tab}
                  </button>
                ))}
              </div>

              {haffTab === "Overview" && (
                <div className="hive-card">
                  <div className="section-label">Fund Structure</div>
                  <div className="grid-2">
                    <div>
                      {[
                        ["Administrator", HAFF_OVERVIEW.administrator],
                        ["Established",   HAFF_OVERVIEW.established],
                        ["Legislation",   HAFF_OVERVIEW.legislation],
                        ["Structure",     HAFF_OVERVIEW.structure],
                      ].map(([k, v]) => (
                        <div key={k} style={{ display: "flex", gap: 12, marginBottom: 10, fontSize: "0.82rem" }}>
                          <span style={{ color: "#94a3b8", minWidth: 100, textTransform: "uppercase", letterSpacing: 1, fontSize: "0.80rem" }}>{k}</span>
                          <span style={{ color: "#cbd5e1" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      {[
                        ["5-Year Target",     `${HAFF_OVERVIEW.five_year_target_homes.toLocaleString()} homes (${HAFF_OVERVIEW.social_target.toLocaleString()} social, ${HAFF_OVERVIEW.affordable_target.toLocaleString()} affordable)`],
                        ["Committed R1–2 (25-yr, all instruments)", `$${(HAFF_OVERVIEW.total_committed_to_date_m / 1000).toFixed(1)}B`],
                        ["Homes Announced",   HAFF_OVERVIEW.total_homes_announced.toLocaleString()],
                      ].map(([k, v]) => (
                        <div key={k} style={{ display: "flex", gap: 12, marginBottom: 10, fontSize: "0.82rem" }}>
                          <span style={{ color: "#94a3b8", minWidth: 140, textTransform: "uppercase", letterSpacing: 1, fontSize: "0.80rem" }}>{k}</span>
                          <span style={{ color: "#f6c90e", fontWeight: 600 }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {(haffTab === "Round 1" || haffTab === "Round 2" || haffTab === "Round 3") && (
                <RoundPanel roundName={haffTab} />
              )}

              {haffTab === "All Rounds" && (
                <div>
                  <div className="chart-container" style={{ marginBottom: 24 }}>
                    <div className="chart-title">Total Homes by State — All 3 Rounds</div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stateTotals} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 10 }}>
                        <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
                        <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} />
                        <YAxis type="category" dataKey="state" tick={{ fill: "#ccc", fontSize: 13 }} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                          formatter={(v: unknown) => [(v as number).toLocaleString(), ""]} />
                        <Legend wrapperStyle={{ fontSize: 13, color: "#94a3b8" }} />
                        <Bar dataKey="social"     fill="#5aad8a" name="Social"     stackId="a" />
                        <Bar dataKey="affordable" fill="#4d7fb5" name="Affordable" stackId="a" radius={[0, 3, 3, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="hive-card">
                    <div className="section-label">All Rounds Summary</div>
                    <table className="hive-table">
                      <thead>
                        <tr><th>State</th><th>Projects</th><th>Total Homes</th><th>Social</th><th>Affordable</th><th>Grant ($M)</th></tr>
                      </thead>
                      <tbody>
                        {stateTotals.map((s) => (
                          <tr key={s.state}>
                            <td style={{ color: "#fff", fontWeight: 700 }}>{s.state}</td>
                            <td>{s.projects}</td>
                            <td style={{ color: "#f6c90e", fontWeight: 600 }}>{s.homes.toLocaleString()}</td>
                            <td style={{ color: "#5aad8a" }}>{s.social.toLocaleString()}</td>
                            <td style={{ color: "#4d7fb5" }}>{s.affordable.toLocaleString()}</td>
                            <td>${s.grant_m.toFixed(1)}M</td>
                          </tr>
                        ))}
                        <tr style={{ fontWeight: 700, borderTop: "2px solid #1e2d40" }}>
                          <td style={{ color: "#fff" }}>TOTAL</td>
                          <td>{stateTotals.reduce((s, r) => s + r.projects, 0)}</td>
                          <td style={{ color: "#f6c90e" }}>{stateTotals.reduce((s, r) => s + r.homes, 0).toLocaleString()}</td>
                          <td style={{ color: "#5aad8a" }}>{stateTotals.reduce((s, r) => s + r.social, 0).toLocaleString()}</td>
                          <td style={{ color: "#4d7fb5" }}>{stateTotals.reduce((s, r) => s + r.affordable, 0).toLocaleString()}</td>
                          <td>${stateTotals.reduce((s, r) => s + r.grant_m, 0).toFixed(1)}M</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {/* ── Sources & Methodology ──────────────────────────────── */}
              <div style={{ marginTop: 28, borderTop: "1px solid #1e2d40", paddingTop: 20 }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#4a5a6a", letterSpacing: "1.8px", textTransform: "uppercase", marginBottom: 14 }}>
                  Sources &amp; Methodology
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 48px" }}>
                  {/* Left: Data sources */}
                  <div>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#6b8aa0", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 8 }}>Data Sources</div>
                    {[
                      { ref: "1", text: "Housing Australia — HAFF Round 1: 185 projects selected Sep 2024; 13,649 contracted. Annual Report 2024–25." },
                      { ref: "2", text: "Housing Australia — HAFF Round 2: 5,001 social homes, ~100 projects, contracts signed 3 Jul 2025. Media release 3 Jul 2025 + PS News." },
                      { ref: "3", text: "Albanese Government media release 23 Nov 2025 — Round 3 launched; 21,350 homes targeted. Applications opened 30 Jan 2026." },
                      { ref: "4", text: "Housing Australia Future Fund Act 2023 — 40,000 home target (20,000 social + 20,000 affordable), 2024–2029." },
                      { ref: "5", text: "Senate Estimates; Budget Papers 2023–24 to 2025–26 — fund structure, grant quantum, annual availability." },
                    ].map(({ ref, text }) => (
                      <div key={ref} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#4d7fb5", minWidth: 16, paddingTop: 1 }}>[{ref}]</span>
                        <span style={{ fontSize: "0.72rem", color: "#4a5a6a", lineHeight: 1.6 }}>{text}</span>
                      </div>
                    ))}
                  </div>
                  {/* Right: Calculation methodology */}
                  <div>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#6b8aa0", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 8 }}>Calculation Methodology</div>
                    {[
                      { label: "% of 5-yr target", calc: "Contracted homes (R1: 13,649 + R2: 5,001 = 18,650) ÷ 40,000 target × 100 = 46.6%, shown as 47%." },
                      { label: "Social / affordable split", calc: "R1 social (4,283) + R2 social (5,001) = 9,284 social. R1 affordable (9,366) + R2 affordable (0) = 9,366 affordable." },
                      { label: "R1 grant per home", calc: "$561.8M ÷ 13,649 contracted homes = ~$41k. Note: cash grant only; total 25-yr funding commitment = ~$10.2B." },
                      { label: "R2 grant per home", calc: "~$1,100M ÷ 5,001 homes = ~$220k. Reflects 55–60% construction cost escalation since R1 and quality uplift." },
                      { label: "Remaining to target", calc: "40,000 − 18,650 = 21,350 — equal to Round 3's stated target. Full R3 delivery = program complete." },
                    ].map(({ label, calc }) => (
                      <div key={label} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#c49a3a", minWidth: 140, flexShrink: 0, paddingTop: 1 }}>{label}</span>
                        <span style={{ fontSize: "0.72rem", color: "#4a5a6a", lineHeight: 1.6 }}>{calc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* All Programs */}
            <div style={{ borderTop: "1px solid #1f2937", paddingTop: 28, marginBottom: 28 }}>
              <div style={{ marginBottom: 18 }}>
                <div id="fund-all" style={{ scrollMarginTop: 130 }} />
                <div className="section-label" style={{ marginBottom: 4 }}>All Funding Programs</div>
                <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: 0 }}>
                  Complete catalogue of federal and state mechanisms — HAFF grants, concessional loans, tax concessions, guarantees, and state-specific programs.
                </p>
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
                {filters.map(({ key, label, count }) => {
                  const active = activeFilter === key
                  return (
                    <button key={key} onClick={() => setActiveFilter(key)} style={{
                      padding: "6px 16px", fontSize: "0.8rem", fontWeight: active ? 700 : 500,
                      color: active ? "#0b1220" : "#b0b0c8",
                      border: `1px solid ${active ? "#f6c90e" : "#1e2d40"}`,
                      borderRadius: 20, background: active ? "#f6c90e" : "rgba(255,255,255,0.04)",
                      cursor: "pointer", transition: "all 0.15s",
                    }}>
                      {label} ({count})
                    </button>
                  )
                })}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
                {filtered.map((m) => (
                  <div key={m.id} className="hive-card" style={{ borderLeft: `4px solid ${m.color}` }}>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-start", marginBottom: 10 }}>
                      <div style={{ flex: "1 1 340px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 800, color: "#fff", fontSize: "0.92rem" }}>{m.name}</span>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                          <span className="badge" style={{ background: `${FUNDING_TYPE_COLORS[m.type]}22`, color: FUNDING_TYPE_COLORS[m.type], border: `1px solid ${FUNDING_TYPE_COLORS[m.type]}44`, fontSize: "0.78rem" }}>{FUNDING_TYPE_LABELS[m.type]}</span>
                          <span className="badge" style={{ background: `${PROG_STATUS_COLORS[m.status]}22`, color: PROG_STATUS_COLORS[m.status], border: `1px solid ${PROG_STATUS_COLORS[m.status]}44`, fontSize: "0.78rem" }}>{PROG_STATUS_LABELS[m.status]}</span>
                          <span className="badge" style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "1px solid #1e2d40", fontSize: "0.78rem" }}>{m.funder}</span>
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.6 }}>{m.best_for}</div>
                      </div>
                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", flexShrink: 0 }}>
                        {m.program_size_m > 0 && (
                          <div style={{ background: "#0b1220", borderRadius: 8, padding: "10px 14px", textAlign: "center", minWidth: 90 }}>
                            <div style={{ fontSize: "0.62rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Program Size</div>
                            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f6c90e" }}>
                              ${m.program_size_m >= 1000 ? (m.program_size_m / 1000).toFixed(1) + "B" : m.program_size_m + "M"}
                            </div>
                          </div>
                        )}
                        {m.typical_per_dwelling_k > 0 && (
                          <div style={{ background: "#0b1220", borderRadius: 8, padding: "10px 14px", textAlign: "center", minWidth: 90 }}>
                            <div style={{ fontSize: "0.62rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Typical / Home</div>
                            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: m.color }}>${m.typical_per_dwelling_k}k</div>
                          </div>
                        )}
                        {m.rate_pct !== null && (
                          <div style={{ background: "#0b1220", borderRadius: 8, padding: "10px 14px", textAlign: "center", minWidth: 90 }}>
                            <div style={{ fontSize: "0.62rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>
                              {m.type === "tax" ? "Tax Rate" : "Interest Rate"}
                            </div>
                            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: m.color }}>{m.rate_pct}%</div>
                          </div>
                        )}
                        {m.loan_term_years !== null && (
                          <div style={{ background: "#0b1220", borderRadius: 8, padding: "10px 14px", textAlign: "center", minWidth: 80 }}>
                            <div style={{ fontSize: "0.62rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Loan Term</div>
                            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#94a3b8" }}>{m.loan_term_years}yr</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 10 }}>
                      <div style={{ background: "#0b1220", borderRadius: 6, padding: "10px 12px" }}>
                        <div style={{ fontSize: "0.62rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Who can access</div>
                        <ul style={{ margin: 0, padding: "0 0 0 14px", listStyle: "disc" }}>
                          {m.eligible_borrowers.slice(0, 3).map((e, i) => (
                            <li key={i} style={{ fontSize: "0.72rem", color: "#94a3b8", lineHeight: 1.6 }}>{e}</li>
                          ))}
                        </ul>
                      </div>
                      <div style={{ background: "#0b1220", borderRadius: 6, padding: "10px 12px" }}>
                        <div style={{ fontSize: "0.62rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Key conditions</div>
                        <ul style={{ margin: 0, padding: "0 0 0 14px", listStyle: "disc" }}>
                          {m.key_conditions.slice(0, 3).map((c, i) => (
                            <li key={i} style={{ fontSize: "0.72rem", color: "#94a3b8", lineHeight: 1.6 }}>{c}</li>
                          ))}
                        </ul>
                      </div>
                      <div style={{ background: "#0b1220", borderRadius: 6, padding: "10px 12px" }}>
                        <div style={{ fontSize: "0.62rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Timing &amp; contact</div>
                        <div style={{ fontSize: "0.72rem", color: "#94a3b8", lineHeight: 1.6, marginBottom: 6 }}>{m.application_window}</div>
                        <div style={{ fontSize: "0.80rem", color: "#94a3b8" }}>{m.contact}</div>
                        {m.stackable_with.length > 0 && (
                          <div style={{ marginTop: 8 }}>
                            <span style={{ fontSize: "0.62rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>Stacks with: </span>
                            <span style={{ fontSize: "0.80rem", color: "#4d7fb5" }}>
                              {m.stackable_with.map(id => FUNDING_MECHANISMS.find(x => x.id === id)?.short_name ?? id).join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended stacks */}
            <div style={{ marginBottom: 28 }}>
              <div id="fund-stacks" style={{ scrollMarginTop: 130 }} />
              <div className="section-label">Recommended Funding Stacks</div>
              <div className="grid-2">
                {RECOMMENDED_STACKS.map((stack) => (
                  <div key={stack.label} className="hive-card" style={{ borderTop: `3px solid ${stack.color}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <span style={{ fontWeight: 800, color: "#fff", fontSize: "0.9rem" }}>{stack.label}</span>
                      <span className="badge" style={{
                        background: stack.complexity === "high" ? "rgba(231,76,60,0.12)" : stack.complexity === "medium" ? "rgba(246,201,14,0.12)" : "rgba(39,174,96,0.12)",
                        color: stack.complexity === "high" ? "#c0614a" : stack.complexity === "medium" ? "#f6c90e" : "#5aad8a",
                        border: "none", fontSize: "0.62rem",
                      }}>{stack.complexity.toUpperCase()} complexity</span>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.6, marginBottom: 10 }}>{stack.description}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                      {stack.mechanisms.map((id) => {
                        const m = FUNDING_MECHANISMS.find(x => x.id === id)
                        if (!m) return null
                        return <span key={id} className="badge" style={{ background: `${m.color}22`, color: m.color, border: `1px solid ${m.color}44`, fontSize: "0.78rem" }}>{m.short_name}</span>
                      })}
                    </div>
                    <div style={{ display: "flex", gap: 16 }}>
                      <div>
                        <div style={{ fontSize: "0.62rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>Typical residual gap</div>
                        <div style={{ fontSize: "1rem", fontWeight: 800, color: stack.typical_gap_k < 80 ? "#5aad8a" : "#c0614a" }}>${stack.typical_gap_k}k/dwelling</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.62rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Best for</div>
                        <div style={{ fontSize: "0.73rem", color: "#94a3b8", lineHeight: 1.5 }}>{stack.best_for}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Analysis>
              The Australian social housing funding landscape requires stacking — no single mechanism covers full development cost.
              The <strong style={{ color: "#fff" }}>Gold Standard Stack</strong> (HAFF + Housing Australia loan + state program) is the most common approach
              for established Tier 1 CHPs and typically leaves a residual gap of $40–80k/dwelling, filled through CHP equity or state top-up.
              The critical insight is that <strong style={{ color: "#fff" }}>tenure mix is the primary viability lever</strong> —
              not grant quantum. Shifting from 100% social to 50/50 increases Housing Australia debt capacity by $70–150k per dwelling
              (depending on state market rents), often closing the gap entirely without additional grant funding.
              BTR partnerships represent an emerging pathway: institutional investors absorb construction risk and the CHP operates
              the affordable component — no CHP equity required, though governance complexity is high.
              HAFF Round 4 (anticipated Q3 2025) will be the largest round yet — CHPs with a pipeline pre-approved through state
              housing authorities will have a material advantage in the competitive assessment process.
            </Analysis>
          </div>
        )}

        {/* ══ TAB 2: CHP SECTOR ════════════════════════════════════════════ */}
        {activeTab === "CHP Sector" && (
          <div>
            <p className="page-subtitle" style={{ marginBottom: 8 }}>
              {SECTOR_OVERVIEW.total_registered_chps.toLocaleString()} registered community housing providers
              managing {(SECTOR_OVERVIEW.community_housing / 1000).toFixed(0)}k dwellings —{" "}
              {SECTOR_OVERVIEW.chp_share_pct}% of Australia&apos;s social housing stock, growing at{" "}
              {SECTOR_OVERVIEW.sector_growth_rate_pct}% per year. Top {TOP_CHPS.length} providers manage{" "}
              {Math.round(top20Total / SECTOR_OVERVIEW.community_housing * 100)}% of all community housing.
            </p>
            <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginBottom: 20 }}>
              Sources: AIHW Housing Assistance in Australia 2023; National Housing Register 2024; CHIA Sector Data Report 2023; Individual CHP annual reports 2022-23
            </div>

            {/* Jump nav */}
            <div style={{ position: "sticky", top: 76, zIndex: 50, background: "#0b1220", borderBottom: "1px solid #1f2937", marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 6, padding: "8px 0", overflowX: "auto", scrollbarWidth: "none" }}>
                {CHP_JUMP_SECTIONS.map((s) => (
                  <a key={s.id} href={`#${s.id}`} className="jump-pill">{s.label}</a>
                ))}
              </div>
            </div>

            {/* Sector Overview KPIs */}
            <div id="chp-overview" style={{ scrollMarginTop: 130, marginBottom: 28 }}>
              <div id="chp-overview" style={{ scrollMarginTop: 130 }} />
              <div className="section-label">Sector Overview</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
                <div className="kpi-card">
                  <div className="kpi-label">Total Social Dwellings</div>
                  <div className="kpi-value">{(SECTOR_OVERVIEW.total_social_dwellings / 1000).toFixed(0)}k</div>
                  <div className="kpi-delta">All social housing (public + CHP + Indigenous)</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Community Housing Stock</div>
                  <div className="kpi-value" style={{ color: "#f6c90e" }}>{(SECTOR_OVERVIEW.community_housing / 1000).toFixed(0)}k</div>
                  <div className="kpi-delta">{SECTOR_OVERVIEW.chp_share_pct}% of total social housing</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Registered Providers</div>
                  <div className="kpi-value">{SECTOR_OVERVIEW.total_registered_chps.toLocaleString()}</div>
                  <div className="kpi-delta">T1: {SECTOR_OVERVIEW.tier1_count} · T2: {SECTOR_OVERVIEW.tier2_count} · T3: {SECTOR_OVERVIEW.tier3_count}</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">HAFF Pipeline</div>
                  <div className="kpi-value" style={{ color: "#5aad8a" }}>{SECTOR_OVERVIEW.development_pipeline_homes.toLocaleString()}</div>
                  <div className="kpi-delta">Homes across HAFF Rounds 1–3</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { label: "Public Housing",             value: SECTOR_OVERVIEW.public_housing,             pct: Math.round(SECTOR_OVERVIEW.public_housing / SECTOR_OVERVIEW.total_social_dwellings * 100),             color: "#4d7fb5", note: "State/territory housing authorities" },
                  { label: "Community Housing",          value: SECTOR_OVERVIEW.community_housing,          pct: SECTOR_OVERVIEW.chp_share_pct,                                                                          color: "#f6c90e", note: "Registered CHPs (NHR)" },
                  { label: "Indigenous Community Housing", value: SECTOR_OVERVIEW.indigenous_community_housing, pct: Math.round(SECTOR_OVERVIEW.indigenous_community_housing / SECTOR_OVERVIEW.total_social_dwellings * 100), color: "#c0614a", note: "ICH organisations; significantly underfunded" },
                ].map(({ label, value, pct, color, note }) => (
                  <div key={label} className="hive-card">
                    <div className="kpi-label" style={{ marginBottom: 6 }}>{label}</div>
                    <div style={{ fontSize: "1.8rem", fontWeight: 900, color, lineHeight: 1, marginBottom: 4 }}>{(value / 1000).toFixed(0)}k</div>
                    <div style={{ marginBottom: 8 }}>
                      <div className="progress-bar" style={{ height: 6 }}>
                        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{note}</span>
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color }}>{pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: "0.80rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 10 }}>NHR Registration Tiers</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  {[
                    { tier: "Tier 1", count: SECTOR_OVERVIEW.tier1_count, color: "#f6c90e", desc: "Manage >2,000 homes or assets >$100M. Eligible for all federal programs including HAFF. Primary NHFIC borrowers." },
                    { tier: "Tier 2", count: SECTOR_OVERVIEW.tier2_count, color: "#4d7fb5", desc: "Mid-size operations. Eligible for HAFF (with evidence of capacity). Some NHFIC access. Growing development pipelines." },
                    { tier: "Tier 3", count: SECTOR_OVERVIEW.tier3_count, color: "#6b8aa0", desc: "Small local providers, often specialist. Limited access to federal programs directly. Typically state-funded or subleasing from T1/T2." },
                  ].map(({ tier, count, color, desc }) => (
                    <div key={tier} className="hive-card" style={{ borderTop: `3px solid ${color}` }}>
                      <div style={{ fontSize: "0.72rem", color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>National Housing Register</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: "1.5rem", fontWeight: 900, color }}>{count}</span>
                        <span style={{ fontSize: "0.88rem", color: "#94a3b8", fontWeight: 700 }}>providers · {tier}</span>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8", lineHeight: 1.6 }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top 20 CHPs */}
            <div id="chp-top" style={{ scrollMarginTop: 130, marginBottom: 8 }}>
              <div id="chp-top20" style={{ scrollMarginTop: 130 }} />
              <div className="section-label">Top 20 CHPs by Managed Portfolio</div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginBottom: 12 }}>
                Estimated dwellings managed (owned + leased + managed). Source: AIHW 2023 + CHP annual reports.
                Top 5: {top5Total.toLocaleString()} dwellings · Top 20: {top20Total.toLocaleString()} ({Math.round(top20Total / SECTOR_OVERVIEW.community_housing * 100)}% of all CHP stock).
              </div>
            </div>
            <div className="chart-container" style={{ marginBottom: 8 }}>
              <ResponsiveContainer width="100%" height={560}>
                <BarChart data={top20Data} layout="vertical" margin={{ top: 4, right: 80, bottom: 0, left: 120 }}>
                  <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
                  <YAxis type="category" dataKey="name" width={110} tick={{ fill: "#aaa", fontSize: 13 }} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                    formatter={(v: unknown) => [`${(v as number).toLocaleString()} dwellings`, "Portfolio"]} />
                  <Bar dataKey="dwellings" radius={[0, 4, 4, 0]}
                    label={{ position: "right", fill: "#94a3b8", fontSize: 12, formatter: (v: unknown) => `${((v as number)/1000).toFixed(1)}k` }}>
                    {top20Data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginBottom: 28 }}>
              <table className="hive-table">
                <thead>
                  <tr><th>#</th><th>Provider</th><th>HQ</th><th>Scope</th><th>Managed</th><th>Tier</th><th>Focus</th><th>Trend</th></tr>
                </thead>
                <tbody>
                  {TOP_CHPS.map((c) => (
                    <tr key={c.rank}>
                      <td style={{ color: "#94a3b8", fontWeight: 700 }}>{c.rank}</td>
                      <td style={{ color: "#fff", fontWeight: 600 }}>{c.short_name}</td>
                      <td style={{ color: c.color, fontWeight: 600 }}>{c.state}</td>
                      <td style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{c.national ? "National" : "State"}</td>
                      <td style={{ color: "#f6c90e", fontWeight: 700 }}>{c.dwellings.toLocaleString()}</td>
                      <td>
                        <span className="badge" style={{
                          background: c.nhr_tier === 1 ? "rgba(246,201,14,0.12)" : "rgba(74,144,217,0.12)",
                          color: c.nhr_tier === 1 ? "#f6c90e" : "#4d7fb5", border: "none", fontSize: "0.62rem",
                        }}>T{c.nhr_tier}</span>
                      </td>
                      <td style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{c.focus.slice(0, 40)}{c.focus.length > 40 ? "…" : ""}</td>
                      <td>
                        <span style={{ fontSize: "0.72rem", color: c.growth_trend === "growing" ? "#5aad8a" : c.growth_trend === "stable" ? "#888" : "#c0614a" }}>
                          {c.growth_trend === "growing" ? "↑ Growing" : c.growth_trend === "stable" ? "→ Stable" : "⟳ Consolidating"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* State distribution */}
            <div id="chp-state" style={{ scrollMarginTop: 130, marginBottom: 28 }}>
              <div id="chp-distribution" style={{ scrollMarginTop: 130 }} />
              <div className="section-label">State Distribution of Community Housing</div>
              <div className="chart-container" style={{ marginBottom: 16 }}>
                <div className="chart-title">CHP Dwellings by State</div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={stateChpData} margin={{ top: 10, right: 20, bottom: 0, left: 55 }}>
                    <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
                    <XAxis dataKey="state" tick={{ fill: "#aaa", fontSize: 13 }} tickLine={false} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                      formatter={(v: unknown) => [`${(v as number).toLocaleString()} dwellings`, "CHP Stock"]} />
                    <Bar dataKey="dwellings" radius={[4, 4, 0, 0]}>
                      {stateChpData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {STATE_DISTRIBUTION.map((s) => (
                  <div key={s.state} className="kpi-card" style={{ borderTop: `3px solid ${s.color}` }}>
                    <div className="kpi-label">{s.state} — {s.label}</div>
                    <div className="kpi-value" style={{ color: s.color, fontSize: "1.5rem" }}>{(s.chp_dwellings / 1000).toFixed(1)}k</div>
                    <div className="kpi-delta">{s.chp_providers} registered providers</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sector trends */}
            <div id="chp-trends" style={{ scrollMarginTop: 130, marginBottom: 28 }}>
              <div id="chp-growth" style={{ scrollMarginTop: 130 }} />
              <div className="section-label">Sector Growth — Community vs Public Housing (2013–2023)</div>
              <div className="chart-container" style={{ marginBottom: 8 }}>
                <div className="chart-title">Managed Dwellings (000s) — CHP vs Public Housing</div>
                <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginBottom: 12 }}>
                  CHP sector growing at ~{SECTOR_OVERVIEW.sector_growth_rate_pct}% p.a. as public housing stock declines. Source: AIHW 2013–2023.
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={trendData} margin={{ top: 10, right: 60, bottom: 0, left: 55 }}>
                    <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 13 }} tickLine={false} />
                    <YAxis yAxisId="stock" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} tickFormatter={(v) => `${v}k`}
                      label={{ value: "Dwellings (000s)", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 13, dx: -28 }} />
                    <YAxis yAxisId="share" orientation="right" domain={[0, 40]} tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false}
                      tickFormatter={(v) => `${v}%`}
                      label={{ value: "CHP share %", angle: 90, position: "insideRight", fill: "#94a3b8", fontSize: 13, dx: 28 }} />
                    <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                      formatter={(v: unknown, name: unknown) => [(name as string) === "CHP share %" ? `${v}%` : `${v}k dwellings`, name as string]} />
                    <Legend wrapperStyle={{ fontSize: 13, color: "#94a3b8" }} />
                    <Line yAxisId="stock" type="monotone" dataKey="community" name="Community housing (000s)" stroke="#f6c90e" strokeWidth={2.5} dot={{ r: 5, fill: "#f6c90e", stroke: "#0b1220", strokeWidth: 2 }} />
                    <Line yAxisId="stock" type="monotone" dataKey="public"    name="Public housing (000s)"    stroke="#4d7fb5" strokeWidth={2.5} dot={{ r: 5, fill: "#4d7fb5", stroke: "#0b1220", strokeWidth: 2 }} />
                    <Line yAxisId="share" type="monotone" dataKey="share"     name="CHP share %"              stroke="#6b8aa0" strokeWidth={1.5} strokeDasharray="5 3" dot={{ r: 4, fill: "#6b8aa0", stroke: "#0b1220", strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <Analysis>
                The decade from 2013 to 2023 shows a structural shift in social housing delivery:
                public housing stock fell from ~328k to ~297k dwellings (−10%) while community housing grew from 67k to 118k units (+76%).
                CHP share of total social housing rose from 16% to 25% — and with HAFF delivering homes primarily through CHPs,
                the sector&apos;s share is projected to reach <strong style={{ color: "#fff" }}>32% by 2029</strong>.
                This structural shift has policy implications: CHPs increasingly hold the sector&apos;s development capacity
                but also carry concentrated balance sheet risk from construction cost inflation.
              </Analysis>
            </div>

            {/* ── Opportunity Map ── */}
            <div id="chp-opportunity" style={{ scrollMarginTop: 130, marginBottom: 28 }}>
              <div id="chp-opportunity" style={{ scrollMarginTop: 130 }} />
              <div className="section-label">Opportunity Map — SA4 Coverage vs Need</div>
              <div className="callout-blue" style={{ marginBottom: 20, fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.7 }}>
                <strong style={{ color: "#7aaad4" }}>What is an SA4?</strong>{" "}
                SA4 (Statistical Area Level 4) is the ABS geographic unit used for labour force and housing analysis —
                broadly equivalent to a major urban district or large regional zone, containing 100,000–500,000 people.
                Each SA4 groups multiple LGAs (Local Government Areas). The key LGAs for each region are listed below each name.
                Full SA4 boundaries (107 nationally) require ABS GeoJSON integration — this dataset covers the 34 highest housing-pressure SA4s across all states and territories.
              </div>
              <p className="page-subtitle" style={{ marginBottom: 20 }}>
                Where is housing need concentrated and where does the sector currently lack Tier 1 delivery capacity?
                Ranked by HIVE&apos;s Opportunity Score — a HIVE composite of rental stress, social housing demand, Tier 1 CHP coverage, and population scale (weights: need 50% · coverage gap 30% · population 20%).
                High scores = <strong style={{ color: "#c0614a" }}>high need, low coverage</strong> — these regions need the most attention.
              </p>

              {/* KPI summary */}
              <div className="grid-4" style={{ marginBottom: 20 }}>
                <div className="kpi-card">
                  <div className="kpi-label">SA4 Regions Analysed</div>
                  <div className="kpi-value">{allScoredRegions.length}</div>
                  <div className="kpi-delta">Top housing pressure regions nationally</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Critical Gap Regions</div>
                  <div className="kpi-value" style={{ color: "#c0614a" }}>{criticalCount}</div>
                  <div className="kpi-delta">Score ≥ 75 — urgent intervention needed</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">No Tier 1 CHP</div>
                  <div className="kpi-value" style={{ color: "#c49a3a" }}>{noCoverageCount}</div>
                  <div className="kpi-delta">Regions with zero Tier 1 delivery vehicle</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Average Opportunity Score</div>
                  <div className="kpi-value">{avgOppScore}<span style={{ fontSize: "0.9rem", color: "#4a5a6a" }}>/100</span></div>
                  <div className="kpi-delta">Across all analysed SA4 regions</div>
                </div>
              </div>

              {/* Score band legend with requirements */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 20 }}>
                {([
                  {
                    band: "Critical" as const, score: "75–100",
                    requires: "New Tier 1 entrant or CHP consolidation needed. HAFF Round 4 geographic weighting bonus recommended.",
                  },
                  {
                    band: "High" as const, score: "58–74",
                    requires: "Existing CHP pipeline expansion or second Tier 1 encouraged. Priority consideration in HAFF allocations.",
                  },
                  {
                    band: "Moderate" as const, score: "42–57",
                    requires: "Adequate sector presence. Standard HAFF participation — monitor for capacity constraints as demand grows.",
                  },
                  {
                    band: "Well-served" as const, score: "<42",
                    requires: "Strong Tier 1 coverage. No special geographic incentives needed — maintain pipeline quality and delivery accountability.",
                  },
                ]).map(({ band, score, requires }) => (
                  <div key={band} style={{
                    padding: "10px 14px", borderRadius: 8,
                    background: `${OPPORTUNITY_COLORS[band]}08`,
                    border: `1px solid ${OPPORTUNITY_COLORS[band]}22`,
                    borderLeft: `3px solid ${OPPORTUNITY_COLORS[band]}`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: "0.68rem", fontWeight: 800, color: OPPORTUNITY_COLORS[band], letterSpacing: "0.5px" }}>{band}</span>
                      <span style={{ fontSize: "0.62rem", color: "#4a5a6a", fontWeight: 600 }}>{score}</span>
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#6b8aa0", lineHeight: 1.55 }}>{requires}</div>
                  </div>
                ))}
              </div>

              {/* Band filter (below toggle row) */}
              <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: "0.65rem", color: "#4a5a6a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", marginRight: 4 }}>Band</span>
                {["All", "Critical", "High", "Moderate", "Well-served"].map(b => (
                  <button key={b} onClick={() => setOppBandFilter(b)}
                    className={`tab-pill ${oppBandFilter === b ? "active" : ""}`}
                    style={{ padding: "4px 10px", fontSize: "0.72rem" }}>{b}</button>
                ))}
              </div>

              {/* State filter */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.65rem", color: "#4a5a6a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px" }}>State</span>
                {["All", "NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"].map(s => (
                  <button key={s} onClick={() => setOppStateFilter(s)}
                    className={`tab-pill ${oppStateFilter === s ? "active" : ""}`}
                    style={{ padding: "4px 10px", fontSize: "0.72rem" }}>{s}</button>
                ))}
                <span style={{ fontSize: "0.7rem", color: "#4a5a6a", marginLeft: "auto" }}>{oppFiltered.length} regions</span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table className="hive-table">
                  <thead>
                    <tr>
                      <th>SA4 Region</th>
                      <th>State</th>
                      <th>Population</th>
                      <th>Rental Stress</th>
                      <th>Tier 1 CHPs</th>
                      <th>Coverage</th>
                      <th>Need</th>
                      <th style={{ minWidth: 120 }}>Opportunity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {oppFiltered.map(r => (
                      <tr key={r.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: "#e8edf2", fontSize: "0.82rem", marginBottom: 4 }}>{r.name}</div>
                          {r.key_lgas.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 4 }}>
                              {r.key_lgas.slice(0, 4).map(lga => (
                                <span key={lga} style={{ fontSize: "0.58rem", padding: "1px 5px", borderRadius: 3, background: "rgba(255,255,255,0.04)", color: "#4a5a6a", border: "1px solid #1e2d40", whiteSpace: "nowrap" }}>{lga}</span>
                              ))}
                              {r.key_lgas.length > 4 && <span style={{ fontSize: "0.58rem", color: "#4a5a6a" }}>+{r.key_lgas.length - 4} more</span>}
                            </div>
                          )}
                          {r.notes && <div style={{ fontSize: "0.65rem", color: "#4a5a6a", lineHeight: 1.4, maxWidth: 280 }}>{r.notes.slice(0, 75)}{r.notes.length > 75 ? "…" : ""}</div>}
                        </td>
                        <td>
                          <span className="badge badge-grey" style={{ fontSize: "0.6rem" }}>{r.state}</span>
                        </td>
                        <td style={{ color: "#94a3b8", fontWeight: 600 }}>{(r.population / 1000).toFixed(0)}k</td>
                        <td>
                          <span style={{ color: r.rental_stress_pct >= 45 ? "#c0614a" : r.rental_stress_pct >= 38 ? "#c49a3a" : "#5aad8a", fontWeight: 700 }}>
                            {r.rental_stress_pct}%
                          </span>
                        </td>
                        <td>
                          {r.tier1_chps.length === 0
                            ? <span style={{ color: "#c0614a", fontSize: "0.72rem", fontWeight: 700 }}>None</span>
                            : <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                {r.tier1_chps.slice(0, 3).map(chp => (
                                  <span key={chp} style={{ fontSize: "0.6rem", padding: "1px 5px", borderRadius: 3, background: "rgba(77,127,181,0.12)", color: "#7aaad4", border: "1px solid rgba(77,127,181,0.2)", whiteSpace: "nowrap" }}>{chp}</span>
                                ))}
                                {r.tier1_chps.length > 3 && <span style={{ fontSize: "0.6rem", color: "#4a5a6a" }}>+{r.tier1_chps.length - 3}</span>}
                              </div>
                          }
                        </td>
                        <td>
                          <span style={{
                            fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: 3,
                            background: `${COVERAGE_COLORS[r.coverage_rating]}18`,
                            color: COVERAGE_COLORS[r.coverage_rating],
                            border: `1px solid ${COVERAGE_COLORS[r.coverage_rating]}33`,
                          }}>{r.coverage_rating}</span>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 48, background: "#1e2d40", borderRadius: 3, height: 5, overflow: "hidden" }}>
                              <div style={{ width: `${r.need_score}%`, height: "100%", background: r.need_score >= 75 ? "#c0614a" : r.need_score >= 55 ? "#c49a3a" : "#4d7fb5", borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: "0.72rem", color: "#6b8aa0" }}>{r.need_score}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: "1.2rem", fontWeight: 900, color: OPPORTUNITY_COLORS[r.opportunity_band], lineHeight: 1 }}>
                              {r.opportunity_score}
                            </span>
                            <span style={{
                              fontSize: "0.6rem", fontWeight: 700, padding: "2px 6px", borderRadius: 3,
                              background: `${OPPORTUNITY_COLORS[r.opportunity_band]}18`,
                              color: OPPORTUNITY_COLORS[r.opportunity_band],
                              border: `1px solid ${OPPORTUNITY_COLORS[r.opportunity_band]}33`,
                            }}>{r.opportunity_band}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Analysis>
                The highest-opportunity regions — those scoring Critical (75+) — are characterised by
                <strong style={{ color: "#fff" }}> high rental stress, minimal Tier 1 CHP presence, and large populations</strong>.
                Remote Queensland and WA outback score highest due to zero Tier 1 coverage combined with severe Indigenous housing need.
                Sydney South West and Blacktown are notable: enormous populations with significant need but only 2–3 Tier 1 CHPs each —
                well below what the scale of need warrants.
                The data makes a clear case: <strong style={{ color: "#fff" }}>Round 4 HAFF funding should explicitly weight geographic coverage gaps</strong>,
                not just CHP track record and development pipeline.
                A Tier 1 CHP entering an underserved SA4 should receive preferential scoring over another project in a well-covered metro area.
              </Analysis>

              <div style={{ marginTop: 16, borderTop: "1px solid #1e2d40", paddingTop: 12 }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#4a5a6a", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6 }}>Methodology</div>
                <div style={{ fontSize: "0.7rem", color: "#4a5a6a", lineHeight: 1.6 }}>
                  Opportunity Score = Housing Need (50%) + Coverage Gap (30%) + Population Scale (20%).
                  Housing need derived from rental stress rate (National Shelter RAI 2023) and social housing demand index (AIHW 2023 + state HA estimates).
                  Coverage gap is inverse of Tier 1 CHP count. CHP presence based on NHR + annual reports (May 2026).
                  30 highest-priority SA4 regions shown. Full 107-SA4 dataset requires ABS boundary integration (Phase 2).
                </div>
              </div>
            </div>

            {/* Consolidation */}
            <div id="chp-consolidation" style={{ scrollMarginTop: 130, marginBottom: 24 }}>
              <div className="section-label">Sector Consolidation</div>
              <Analysis>
                Consolidation is structural, not cyclical. The primary mechanism is <strong style={{ color: "#fff" }}>NHR Tier 1 threshold pressure</strong>:
                Housing Australia and state governments systematically favour larger, more capitalised providers for major delivery programs.
                A Tier 2 CHP managing 800 dwellings has materially lower program access than a Tier 1 managing 3,000+ — creating a structural incentive to merge or absorb smaller providers.
                The 2020 Link Wentworth merger is the clearest example: the combined entity immediately unlocked NSW Government contracting
                relationships and delivery programs that neither Link Housing nor Wentworth Community Housing could access independently.
                Housing Choices Australia&apos;s expansion into WA (via Access Housing, ~2021) and its dominant SA position reflect the same logic — national scale unlocks national programs.
                The 2025 merger of PowerHousing Australia and CHIA National into Australian Community Housing consolidates sector advocacy behind a single voice, reducing friction for pro-consolidation policy settings.
                Expect further provider consolidation: smaller CHPs face compounding disadvantage as HAFF Round 3 and future rounds intensify competition among Tier 1 providers for a fixed pool of federal grant funding.
              </Analysis>
            </div>
          </div>
        )}

        {/* ══ TAB 3: CONSTRUCTION COSTS ════════════════════════════════════ */}
        {activeTab === "Construction Costs" && (
          <div>
            <p className="page-subtitle" style={{ marginBottom: 8 }}>
              Two forces squeezing the social housing system: existing stock averaging {STOCK_CONDITION.avg_age_years} years old
              with a ${STOCK_CONDITION.estimated_maintenance_backlog_bn}B maintenance backlog, while construction costs have risen{" "}
              {costRisePct}% since 2019 — meaning $1B now builds {BILLION_DOLLAR_YIELD[2025].toLocaleString()} homes
              instead of {BILLION_DOLLAR_YIELD[2019].toLocaleString()}.
            </p>
            <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginBottom: 20 }}>
              Sources: ABS Cat. 6427.0 (construction PPI), Rawlinsons Construction Cost Guide, AIHW Housing Assistance in Australia (2023), UNSW City Futures (2023)
            </div>

            {/* Jump nav */}
            <div style={{ position: "sticky", top: 76, zIndex: 50, background: "#0b1220", borderBottom: "1px solid #1f2937", marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 6, padding: "8px 0", overflowX: "auto", scrollbarWidth: "none" }}>
                {COST_JUMP_SECTIONS.map((s) => (
                  <a key={s.id} href={`#${s.id}`} className="jump-pill">{s.label}</a>
                ))}
              </div>
            </div>

            <div className="grid-4" style={{ marginBottom: 28 }}>
              <div className="kpi-card">
                <div className="kpi-label">Cost Rise Since 2019</div>
                <div className="kpi-value" style={{ color: "#c0614a" }}>+{costRisePct}%</div>
                <div className="kpi-delta">ABS PPI House Construction</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Avg Social Home — 2019</div>
                <div className="kpi-value" style={{ fontSize: "1.5rem", color: "#5aad8a" }}>${(impact.avg_cost_2019 / 1000).toFixed(0)}k</div>
                <div className="kpi-delta">Pre-COVID baseline</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Avg Social Home — 2025</div>
                <div className="kpi-value" style={{ fontSize: "1.5rem", color: "#c0614a" }}>${(impact.avg_cost_2025 / 1000).toFixed(0)}k</div>
                <div className="kpi-delta">+${costIncrease}k per dwelling</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Maintenance Backlog</div>
                <div className="kpi-value" style={{ color: "#c0614a" }}>${impact.maintenance_backlog_bn}B</div>
                <div className="kpi-delta">{impact.pct_stock_major_repair}% of stock needs major repair</div>
              </div>
            </div>

            <div id="cost-index" className="chart-container" style={{ marginBottom: 8, scrollMarginTop: 130 }}>
              <div className="chart-title">Construction Cost Index — 2019 to 2025 (Q4 2019 = 100)</div>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={costData} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
                  <XAxis dataKey="period" tick={{ fill: "#94a3b8", fontSize: 13 }} tickLine={false} angle={-45} textAnchor="end" interval={3} />
                  <YAxis domain={[95, 170]} tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                    formatter={(v: unknown) => [`${(v as number).toFixed(1)}`, "Index"]} />
                  <ReferenceArea x1="2020 Q1" x2="2021 Q4" fill="rgba(231,76,60,0.08)" label={{ value: "COVID", position: "insideTopLeft", fill: "#c0614a", fontSize: 13 }} />
                  <ReferenceArea x1="2022 Q1" x2="2022 Q4" fill="rgba(246,201,14,0.06)" label={{ value: "Ukraine + Rate hikes", position: "insideTopLeft", fill: "#f6c90e", fontSize: 13 }} />
                  <ReferenceLine y={100} stroke="#555" strokeDasharray="4 2" label={{ value: "2019 baseline (100)", fill: "#94a3b8", fontSize: 13, position: "right" }} />
                  <Line type="monotone" dataKey="index" stroke="#f6c90e" strokeWidth={2.5}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    dot={(props: any) =>
                      props.payload?.hasLabel
                        ? <circle key={`dot-${props.cx}`} cx={props.cx ?? 0} cy={props.cy ?? 0} r={5} fill="#c0614a" stroke="#0b1220" strokeWidth={2} />
                        : <g key={`dot-empty-${props.cx}`} />
                    }
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <Analysis>
              The index measures the producer price index for house construction (ABS Cat. 6427.0), rebased to Q4 2019 = 100.
              Three distinct shock waves: the HomeBuilder demand surge through 2020–21, the Ukraine materials spike in early 2022,
              and the labour-driven plateau that has kept costs <strong style={{ color: "#fff" }}>above 155 since mid-2023</strong>.
              Cost growth has slowed — but costs have not fallen. The sector is operating on a permanently higher cost floor,
              which means every government announcement of "$X billion for Y homes" made before 2023 is now worth fewer homes than stated.
            </Analysis>

            <div id="cost-events" style={{ marginBottom: 28, marginTop: 28, scrollMarginTop: 130 }}>
              <div className="section-label">Global Events Driving the Cost Rise</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {GLOBAL_EVENTS.map((ev, idx) => (
                  <div key={ev.event} className="hive-card" style={{ borderLeft: `4px solid ${ev.color}`, padding: "14px 18px" }}>
                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{
                        flexShrink: 0, width: 28, height: 28, borderRadius: 4,
                        background: `${ev.color}22`, border: `1px solid ${ev.color}44`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.7rem", fontWeight: 800, color: ev.color, marginTop: 1,
                        fontVariantNumeric: "tabular-nums", letterSpacing: 0,
                      }}>
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 700, color: "#fff", fontSize: "0.88rem" }}>{ev.event}</span>
                          <span className="badge" style={{ background: `${ev.color}22`, color: ev.color, border: `1px solid ${ev.color}44`, fontSize: "0.78rem" }}>{ev.date}</span>
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.7, marginBottom: 4 }}>{ev.impact}</div>
                        <div style={{ fontSize: "0.78rem", color: "#f6c90e", fontWeight: 600 }}>Cost impact: {ev.cost_impact}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div id="cost-billion" style={{ marginBottom: 28, scrollMarginTop: 130 }}>
              <div id="cost-impact" style={{ scrollMarginTop: 130 }} />
              <div className="section-label">What $1 Billion Buys — 2019 vs 2025</div>
              <div className="grid-3">
                <div className="hive-card" style={{ textAlign: "center" }}>
                  <div className="kpi-label">$1B in 2019</div>
                  <div style={{ fontSize: "3rem", fontWeight: 900, color: "#5aad8a", lineHeight: 1 }}>{BILLION_DOLLAR_YIELD[2019].toLocaleString()}</div>
                  <div style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: 6 }}>social homes</div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 4 }}>Avg. ${(COST_PER_DWELLING["2019"].avg_social_total / 1000).toFixed(0)}k per dwelling</div>
                </div>
                <div className="hive-card" style={{ textAlign: "center" }}>
                  <div className="kpi-label">$1B in 2025</div>
                  <div style={{ fontSize: "3rem", fontWeight: 900, color: "#c0614a", lineHeight: 1 }}>{BILLION_DOLLAR_YIELD[2025].toLocaleString()}</div>
                  <div style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: 6 }}>social homes</div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 4 }}>Avg. ${(COST_PER_DWELLING["2025"].avg_social_total / 1000).toFixed(0)}k per dwelling</div>
                </div>
                <div className="hive-card" style={{ textAlign: "center", background: "linear-gradient(135deg, #1f2937, #2a1a1a)" }}>
                  <div className="kpi-label">Homes lost per $1B</div>
                  <div style={{ fontSize: "3rem", fontWeight: 900, color: "#c0614a", lineHeight: 1 }}>
                    -{(BILLION_DOLLAR_YIELD[2019] - BILLION_DOLLAR_YIELD[2025]).toLocaleString()}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: 6 }}>social homes not built</div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 4 }}>Due to cost escalation alone</div>
                </div>
              </div>
            </div>

            <div id="cost-flow" style={{ marginBottom: 8, scrollMarginTop: 130 }}>
              <div className="section-label">Flow-on Effects — Property Market &amp; Rental Crisis</div>
              <div className="grid-3">
                <div className="hive-card">
                  <div className="kpi-label">Private Rental Market</div>
                  <div style={{ fontSize: "2.4rem", fontWeight: 900, color: "#c0614a", lineHeight: 1, marginBottom: 4 }}>+32%</div>
                  <div className="kpi-delta" style={{ marginBottom: 12 }}>Median rent rise 2020–2025</div>
                  <div style={{ fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.65 }}>Construction cost inflation fed directly into new build costs. Vacancy rates fell to historic lows — 1.0–1.2% nationally in 2023.</div>
                </div>
                <div className="hive-card">
                  <div className="kpi-label">Owner-Occupied Market</div>
                  <div style={{ fontSize: "2.4rem", fontWeight: 900, color: "#c0614a", lineHeight: 1, marginBottom: 4 }}>+{costRisePct}%</div>
                  <div className="kpi-delta" style={{ marginBottom: 12 }}>New build cost rise since 2019</div>
                  <div style={{ fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.65 }}>New home builds are now ${costIncrease}k–${costIncrease + 30}k more expensive than 2019. 13 RBA rate hikes pushed more buyers into rentals.</div>
                </div>
                <div className="hive-card">
                  <div className="kpi-label">Public Sector Capacity</div>
                  <div style={{ fontSize: "2.4rem", fontWeight: 900, color: "#c0614a", lineHeight: 1, marginBottom: 4 }}>−{yieldDrop}%</div>
                  <div className="kpi-delta" style={{ marginBottom: 12 }}>Homes per $1B vs 2019</div>
                  <div style={{ fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.65 }}>Government programs announced at 2022 cost assumptions now face significant funding gaps. HAFF grants cover only 70–85% of current build costs.</div>
                </div>
              </div>
            </div>

            <Analysis>
              These three cards tell the same story from three angles: costs went up, which pushed private renters out of ownership,
              which flooded the rental market, which raised rents, which increased demand for social housing —
              while simultaneously making each social home{" "}
              <strong style={{ color: "#fff" }}>${costIncrease}k more expensive to build</strong>.
              The {yieldDrop}% drop in public sector delivery capacity is not a budgeting failure —
              it is a direct mathematical consequence of the cost index rising from 100 to {COST_INDEX[COST_INDEX.length - 1].index}.
              Every $10B social housing package announced in 2022 has the effective delivery capacity of a $6.1B package today.
            </Analysis>

            <div id="cost-stock" style={{ marginBottom: 28, marginTop: 28, scrollMarginTop: 130 }}>
              <div id="cost-stock" style={{ scrollMarginTop: 130 }} />
              <div className="section-label">National Social Housing Stock Condition</div>
              <div className="grid-4" style={{ marginBottom: 16 }}>
                <div className="kpi-card">
                  <div className="kpi-label">Total Social Dwellings</div>
                  <div className="kpi-value" style={{ fontSize: "1.5rem" }}>{(STOCK_CONDITION.national_social_dwellings / 1000).toFixed(0)}k</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Average Age</div>
                  <div className="kpi-value" style={{ fontSize: "1.5rem" }}>{STOCK_CONDITION.avg_age_years} yrs</div>
                  <div className="kpi-delta">{STOCK_CONDITION.pct_built_before_1980}% built before 1980</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Maintenance Backlog</div>
                  <div className="kpi-value" style={{ color: "#c0614a" }}>${STOCK_CONDITION.estimated_maintenance_backlog_bn}B</div>
                  <div className="kpi-delta">At current spend: {STOCK_CONDITION.years_to_clear_backlog_at_current_rate} yrs to clear</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Net Stock Loss / Year</div>
                  <div className="kpi-value" style={{ color: "#c0614a" }}>-{STOCK_CONDITION.net_stock_loss_per_year}</div>
                  <div className="kpi-delta">Demolitions outpace replacements</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                {Object.entries(STATE_CONDITION).map(([state, cond], i, arr) => (
                  <div key={state} className="hive-card"
                    style={i === arr.length - 1 && arr.length % 2 !== 0 ? { gridColumn: "span 2" } : {}}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, color: "#fff", fontSize: "0.88rem" }}>{state}</span>
                      <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{cond.dwellings.toLocaleString()} dwellings · avg {cond.avg_age} yrs</span>
                    </div>
                    <div style={{ marginBottom: 6 }}>
                      <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginBottom: 4 }}>
                        Backlog: <span style={{ color: "#c0614a", fontWeight: 600 }}>${(cond.backlog_m / 1000).toFixed(1)}B</span>
                      </div>
                      <div className="progress-bar" style={{ height: 6 }}>
                        <div className="progress-fill" style={{ width: `${Math.min(100, cond.backlog_m / 80)}%`, background: "#c0614a" }} />
                      </div>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8", lineHeight: 1.5 }}>{cond.program}</div>
                  </div>
                ))}
              </div>
              <Analysis>
                The eight-jurisdiction backlog totals ${(Object.values(STATE_CONDITION).reduce((sum, c) => sum + c.backlog_m, 0) / 1000).toFixed(1)}B —
                against a national figure of ${STOCK_CONDITION.estimated_maintenance_backlog_bn}B, with the remaining $
                {(STOCK_CONDITION.estimated_maintenance_backlog_bn - Object.values(STATE_CONDITION).reduce((sum, c) => sum + c.backlog_m, 0) / 1000).toFixed(1)}B
                concentrated in remote Aboriginal community housing not captured by state registers.
                At current annual spend of ${STOCK_CONDITION.annual_maintenance_spend_bn}B/year, it would take{" "}
                <strong style={{ color: "#fff" }}>{STOCK_CONDITION.years_to_clear_backlog_at_current_rate} years</strong> to clear —
                while {STOCK_CONDITION.net_stock_loss_per_year} dwellings are demolished in excess of replacements every year.
                The system is not standing still: it is actively shrinking while its backlog grows.
              </Analysis>
            </div>

            <div id="cost-responses" style={{ marginBottom: 24, scrollMarginTop: 130 }}>
              <div className="section-label">Government Responses to Cost Crisis</div>
              <table className="hive-table">
                <thead>
                  <tr><th>Program</th><th>Year</th><th>Funding</th><th>Type</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {GOVERNMENT_RESPONSES.map((r) => (
                    <tr key={r.program}>
                      <td style={{ color: "#fff", fontWeight: 600 }}>{r.program}</td>
                      <td>{r.year}</td>
                      <td style={{ color: "#f6c90e", fontWeight: 600 }}>{formatCurrency(r.amount_m)}</td>
                      <td style={{ color: "#94a3b8", fontSize: "0.78rem" }}>{r.type}</td>
                      <td><span className="badge" style={{ background: `${r.color}22`, color: r.color, border: `1px solid ${r.color}44`, fontSize: "0.78rem" }}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Analysis>
                The combined federal and state response totals approximately{" "}
                <strong style={{ color: "#fff" }}>
                  {formatCurrency(GOVERNMENT_RESPONSES.reduce((sum, r) => sum + r.amount_m, 0))}
                </strong>{" "}
                across active programs — but the timing mismatch is the critical problem.
                Most of this was announced at 2021–2022 cost assumptions. Every dollar now buys {yieldDrop}% fewer homes than when it was announced.
                The state maintenance budgets ({formatCurrency(GOVERNMENT_RESPONSES.find(r => r.program.includes("Maintenance"))?.amount_m ?? 0)}/year combined)
                represent under 5% of the ${STOCK_CONDITION.estimated_maintenance_backlog_bn}B national backlog —
                a structural underfunding that compounds year on year.
              </Analysis>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
