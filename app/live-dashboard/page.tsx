"use client"
import { getSHSSummary, SHS_DATA, WAITLIST_DATA } from "@/lib/data/shs"
import { getBuildingApprovalsSummary, BUILDING_APPROVALS } from "@/lib/data/building-approvals"
import { RENTAL_STRESS_BY_QUINTILE, STRESS_SUMMARY } from "@/lib/data/housing-need"
import { getHaffSummary, getStateTotals, HAFF_OVERVIEW } from "@/lib/data/haff"
import { COST_INDEX, getCostImpactSummary } from "@/lib/data/construction"
import { SECTOR_OVERVIEW, SECTOR_TRENDS } from "@/lib/data/chp-sector"
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend, Cell, LabelList, AreaChart, Area
} from "recharts"

// 2024-25 AIHW Unassisted Requests figure — published Feb 2026
// Different methodology to historical client series — see HIVE Analysis below
const AIHW_UNASSISTED_REQUESTS_2425 = 129000

// ── Reusable analysis block ─────────────────────────────────
function Analysis({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "#111827",
      border: "1px solid #1e2d40",
      borderRadius: 8,
      padding: "14px 18px",
      marginTop: 14,
      fontSize: "0.82rem",
      color: "#94a3b8",
      lineHeight: 1.85,
    }}>
      <span style={{
        fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e",
        letterSpacing: "1.5px", textTransform: "uppercase",
        display: "block", marginBottom: 8,
      }}>
        🐝 HIVE Analysis
      </span>
      {children}
    </div>
  )
}

// ── Radial gauge (SVG) ──────────────────────────────────────
function RadialGauge({ value, target, pct }: { value: number; target: number; pct: number }) {
  const r = 75, cx = 120, cy = 100
  const bgX1 = cx - r, bgY1 = cy
  const bgX2 = cx + r, bgY2 = cy
  const fillDeg = (pct / 100) * 180
  const fillRad = (Math.PI) - (fillDeg * Math.PI / 180)
  const valX = cx + r * Math.cos(fillRad)
  const valY = cy - r * Math.sin(fillRad)
  const largeArc = fillDeg > 180 ? 1 : 0
  const gaugeColor = pct < 80 ? "#c0614a" : "#5aad8a"
  const gap = target - value
  const isBelow = gap > 0

  return (
    <svg viewBox="0 0 240 155" style={{ width: "100%", maxWidth: 340, display: "block", margin: "0 auto" }}>
      {[0, 25, 50, 75, 100].map((tick) => {
        const tickRad = Math.PI - (tick / 100) * Math.PI
        const x1 = cx + (r - 10) * Math.cos(tickRad)
        const y1 = cy - (r - 10) * Math.sin(tickRad)
        const x2 = cx + (r + 2) * Math.cos(tickRad)
        const y2 = cy - (r + 2) * Math.sin(tickRad)
        return <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2a3d52" strokeWidth="1.5" />
      })}
      <path d={`M ${bgX1} ${bgY1} A ${r} ${r} 0 0 1 ${bgX2} ${bgY2}`}
        fill="none" stroke="#1e2d40" strokeWidth="20" strokeLinecap="round" />
      <path d={`M ${bgX1} ${bgY1} A ${r} ${r} 0 ${largeArc} 1 ${valX} ${valY}`}
        fill="none" stroke={gaugeColor} strokeWidth="20" strokeLinecap="round" />
      <circle cx={valX} cy={valY} r="5" fill={gaugeColor} opacity="0.6" />
      <text x={bgX1 - 2} y={cy + 16} textAnchor="middle" fill="#94a3b8" fontSize="10">0</text>
      <text x={bgX2 + 2} y={cy + 16} textAnchor="middle" fill="#94a3b8" fontSize="10">240k</text>
      <text x={cx} y={cy - 18} textAnchor="middle" fill="#fff" fontSize="26" fontWeight="900" fontFamily="system-ui">
        {(value / 1000).toFixed(0)}k
      </text>
      <text x={cx} y={cy - 4} textAnchor="middle" fill="#94a3b8" fontSize="10">dwellings/year</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill={gaugeColor} fontSize="11" fontWeight="700">
        {isBelow ? "▼" : "▲"} {(Math.abs(gap) / 1000).toFixed(0)}k {isBelow ? "below" : "above"} target
      </text>
      <text x={cx} y={cy + 30} textAnchor="middle" fill="#94a3b8" fontSize="10">
        {pct}% of 240,000 Accord target
      </text>
    </svg>
  )
}

const sectionHeader = {
  fontSize: "1.1rem",
  fontWeight: 800,
  color: "#fff",
  letterSpacing: "-0.3px",
  marginBottom: 8,
} as const

const JUMP_SECTIONS = [
  { id: "affordability",   label: "Affordability" },
  { id: "homelessness",    label: "Homelessness" },
  { id: "supply",          label: "Supply" },
  { id: "waitlists",       label: "Waitlists" },
  { id: "haff",            label: "HAFF Pipeline" },
  { id: "costs",           label: "Construction Costs" },
  { id: "chp",             label: "CHP Capacity" },
  { id: "gap",             label: "The Gap" },
]

export default function LiveDashboardPage() {
  const shs = getSHSSummary()
  const approvals = getBuildingApprovalsSummary()

  const approvalsWithMA = BUILDING_APPROVALS.map((d, i) => {
    const start = Math.max(0, i - 11)
    const slice = BUILDING_APPROVALS.slice(start, i + 1)
    const avg = Math.round(slice.reduce((s, r) => s + r.total_aus, 0) / slice.length)
    return { date: d.date.slice(0, 7), total: d.total_aus, ma12: avg }
  })
  const recentApprovals = approvalsWithMA.slice(-36)

  // 5-year Accord projection (dynamic, based on current annual run rate)
  const fiveYearProjection = Math.round(approvals.annual_run_rate * 5 / 10000) * 10000
  const fiveYearShortfall = 1200000 - fiveYearProjection

  const shsBarData = SHS_DATA.slice(-6).map((d) => ({
    year: d.year,
    "Sought help":    d.clients,
    "Needed housing": d.needing_housing,
    "Got housing":    d.got_housing,
  }))

  const latestSHS = SHS_DATA[SHS_DATA.length - 1]
  const funnelData = [
    { label: "Sought help",    value: latestSHS.clients,         pct: 100,  color: "#4d7fb5" },
    { label: "Needed housing", value: latestSHS.needing_housing, pct: Math.round(latestSHS.needing_housing / latestSHS.clients * 100), color: "#f0a30a" },
    { label: "Got housing",    value: latestSHS.got_housing,     pct: Math.round(latestSHS.got_housing / latestSHS.clients * 100),     color: "#5aad8a" },
  ]

  const majorStates = ["NSW", "VIC", "QLD", "WA", "SA"]
  const minorStates = ["TAS", "NT", "ACT"]
  const states = [...majorStates, ...minorStates]
  const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025]
  const waitlistChartData = years.map((yr) => {
    const row: Record<string, number | string> = { year: yr }
    states.forEach((st) => {
      const rec = WAITLIST_DATA.find((d) => d.state === st && d.year === yr)
      if (rec) row[st] = rec.applicants
    })
    return row
  })

  const stateColors: Record<string, string> = {
    NSW: "#4d7fb5", VIC: "#c0614a", QLD: "#f0a30a", WA: "#5aad8a", SA: "#6b8aa0",
    TAS: "#1abc9c", NT: "#e67e22", ACT: "#c0614a",
  }

  // ── New section data ────────────────────────────────────────
  // Rental stress
  const rentalStressData = RENTAL_STRESS_BY_QUINTILE.map(r => ({
    label: r.label,
    stress_pct: r.stress_pct,
    severe_pct: r.severe_stress_pct,
    color: r.stress_pct >= 70 ? "#c0614a" : r.stress_pct >= 40 ? "#c49a3a" : "#4d7fb5",
  }))

  // HAFF
  const haffSummary = getHaffSummary()
  const haffStates = getStateTotals().sort((a, b) => b.homes - a.homes)
  const avgGrantPerHome = Math.round(haffSummary.total_grants_m * 1000 / haffSummary.total_homes)

  // Construction cost
  const costData = COST_INDEX.slice(-24).map(r => ({
    period: `${r.year} Q${r.q}`,
    index: r.index,
  }))
  const costImpact = getCostImpactSummary()

  // CHP sector
  const sectorTrendData = SECTOR_TRENDS.map(r => ({
    year: r.year,
    "Community Housing": r.chp_dwellings_k,
    "Public Housing": r.public_housing_k,
  }))

  // National public-housing waitlist, households at 30 June 2025 (RoGS 2026 Table 18A.29)
  const waitlistTotal = WAITLIST_DATA.filter(d => d.year === 2025).reduce((s, r) => s + r.applicants, 0)

  return (
    <div style={{ background: "#0b1220", minHeight: "100vh" }}>
      <div className="page-container">

        {/* ── Header ── */}
        <div className="page-header">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 className="page-title">Housing Data</h1>
              <p className="page-subtitle">
                Australia is building at {approvals.pct_of_target}% of the pace the National Housing Accord requires.
                {" "}{waitlistTotal.toLocaleString()} households have been assessed, found eligible, and are still waiting.
                The same $1B that built 3,226 social homes in 2019 builds only 1,786 today.
                These are the numbers that cut through the announcements — the real-time state of supply, demand, costs, and sector capacity. All sourced from primary data.
              </p>
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "rgba(39,174,96,0.1)", border: "1px solid rgba(39,174,96,0.25)",
              borderRadius: 20, padding: "6px 14px", whiteSpace: "nowrap", flexShrink: 0,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#5aad8a", display: "inline-block", boxShadow: "0 0 6px #5aad8a" }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#5aad8a", letterSpacing: "1px" }}>
                Last updated: May 2026
              </span>
            </div>
          </div>
        </div>

        {/* ── Jump navigation ── */}
        <div style={{
          borderTop: "1px solid #1e2d40", borderBottom: "1px solid #1e2d40",
          background: "#070d18", marginBottom: 28,
          overflowX: "auto", scrollbarWidth: "none",
          position: "sticky", top: 76, zIndex: 50,
          margin: "0 -24px 28px",
        }}>
          <div style={{ display: "flex", gap: 4, padding: "7px 24px", whiteSpace: "nowrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#4a5a6a", marginRight: 8, letterSpacing: "1px", textTransform: "uppercase", flexShrink: 0 }}>JUMP TO</span>
            {JUMP_SECTIONS.map((sec) => (
              <a key={sec.id} href={`#${sec.id}`} style={{
                display: "inline-block", padding: "4px 12px",
                fontSize: "0.72rem", fontWeight: 500, color: "#94a3b8",
                background: "rgba(255,255,255,0.04)", border: "1px solid #1e2d40",
                borderRadius: 4, textDecoration: "none",
              }}>
                {sec.label}
              </a>
            ))}
          </div>
        </div>

        {/* ── KPI row — need first, then supply failure ── */}
        <div className="grid-4" style={{ marginBottom: 32 }}>
          <div className="kpi-card">
            <div className="kpi-label">On Social Housing Waitlists</div>
            <div className="kpi-value" style={{ fontSize: "1.8rem", color: "#c0614a" }}>{waitlistTotal.toLocaleString()}</div>
            <div className="kpi-delta">Households on public housing waitlists, all states (RoGS, Jun 2025)</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Households in Rental Stress</div>
            <div className="kpi-value" style={{ fontSize: "1.8rem", color: "#c0614a" }}>1.31M</div>
            <div className="kpi-delta">{Math.round(STRESS_SUMMARY.in_rental_stress / STRESS_SUMMARY.total_renter_households * 100)}% of all renters paying &gt;30% of income on rent</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Unmet Housing Requests 2024–25</div>
            <div className="kpi-value" style={{ fontSize: "1.8rem", color: "#c49a3a" }}>{AIHW_UNASSISTED_REQUESTS_2425.toLocaleString()}</div>
            <div className="kpi-delta" style={{ color: "#c0614a" }}>~350 people turned away every day · +17% vs 2023–24</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Annual Dwelling Approvals</div>
            <div className="kpi-value" style={{ fontSize: "1.8rem", color: "#c0614a" }}>{approvals.annual_run_rate.toLocaleString()}</div>
            <div className="kpi-delta">
              <span style={{ color: "#c0614a" }}>{approvals.pct_of_target}% of 240,000 Accord target · {approvals.gap_to_target.toLocaleString()} short</span>
              <span style={{ display: "block", marginTop: 4, color: "#94a3b8" }}>
                ~12,000 of these (~6%) are social or affordable — varies by state (NSW 3.8%, VIC 9.8%, QLD 3.5%)
              </span>
            </div>
          </div>
        </div>

        {/* ══ SECTION 1: WHO NEEDS HOUSING ══════════════════════ */}
        <div id="affordability" style={{ marginBottom: 8, scrollMarginTop: 130 }}>
          <div style={sectionHeader}>Who Needs Housing — The Affordability Crisis</div>
          <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginBottom: 16, lineHeight: 1.6 }}>
            Rental stress = paying more than 30% of household income on rent. The chart shows it concentrates overwhelmingly at the bottom of the income scale — and the market cannot fix this.
          </p>
        </div>
        <div className="grid-3" style={{ marginBottom: 20 }}>
          <div className="kpi-card">
            <div className="kpi-label">Households in Rental Stress</div>
            <div className="kpi-value" style={{ color: "#c0614a" }}>{(STRESS_SUMMARY.in_rental_stress / 1000000).toFixed(2)}M</div>
            <div className="kpi-delta">{Math.round(STRESS_SUMMARY.in_rental_stress / STRESS_SUMMARY.total_renter_households * 100)}% of all renter households nationally</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">In Severe Stress (&gt;50% income on rent)</div>
            <div className="kpi-value" style={{ color: "#c0614a" }}>{(STRESS_SUMMARY.in_severe_rental_stress / 1000).toFixed(0)}k</div>
            <div className="kpi-delta">{Math.round(STRESS_SUMMARY.in_severe_rental_stress / STRESS_SUMMARY.total_renter_households * 100)}% of all renters — no buffer for any other expense</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Core Housing Need (AHURI 2023)</div>
            <div className="kpi-value" style={{ color: "#c49a3a" }}>{(STRESS_SUMMARY.core_housing_need_ahuri / 1000).toFixed(0)}k</div>
            <div className="kpi-delta">Cannot afford adequate housing without assistance</div>
          </div>
        </div>
        <div className="chart-container" style={{ marginBottom: 32 }}>
          <div className="chart-title">Rental Stress % by Household Income Quintile — ABS Survey of Income &amp; Housing 2021–22</div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={rentalStressData} layout="vertical" margin={{ top: 8, right: 70, bottom: 8, left: 90 }}>
              <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} width={85} />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }} formatter={(v) => [`${v}%`, "In rental stress"]} />
              <Bar dataKey="stress_pct" radius={[0, 4, 4, 0]} name="In rental stress">
                {rentalStressData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
                <LabelList dataKey="stress_pct" position="right" formatter={(v: unknown) => `${v}%`} style={{ fill: "#94a3b8", fontSize: 12 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <Analysis>
            The chart tells a story of concentrated crisis at the bottom.{" "}
            <strong style={{ color: "#c0614a" }}>83% of Q1 households</strong> — those earning under $25k/year — are in rental stress, paying a median rent of $600/week against an affordable threshold of $144/week.{" "}
            This isn&apos;t marginal stress; it&apos;s structural. Even Q2 households (20th–40th percentile) face a 55% stress rate.{" "}
            <strong style={{ color: "#fff" }}>Only the top 40% of earners have broadly escaped rental stress</strong> — which means the 1.31 million households in stress represent the unambiguous case for social and affordable housing investment.{" "}
            The market cannot solve this: no private developer builds housing affordable enough for Q1–Q2 incomes at a $600/week market rent vs a $144/week affordable threshold.
          </Analysis>
        </div>

        {/* ── SHS / Homelessness ── */}
        <div id="homelessness" style={{ marginBottom: 8, marginTop: 32, scrollMarginTop: 130 }}>
          <div style={sectionHeader}>Homelessness &amp; Housing Demand — The Human Cost</div>
          <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginBottom: 16, lineHeight: 1.6 }}>
            How many people sought help each year, how many went unassisted, and — crucially — <strong style={{ color: "#fff" }}>how few of those who needed long-term housing actually received it.</strong>
          </p>
        </div>
        <div className="chart-container" style={{ marginBottom: 16 }}>
          <div className="chart-title">Specialist Homelessness Services — Annual Trend (AIHW)</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={shsBarData} margin={{ top: 10, right: 20, bottom: 0, left: 55 }} barCategoryGap="20%">
              <CartesianGrid stroke="#1e1e36" strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} label={{ value: "Number of people", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 13, dx: -28 }} />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }} formatter={(value: unknown) => [(value as number).toLocaleString(), ""]} />
              <Legend wrapperStyle={{ fontSize: 13, color: "#94a3b8", paddingTop: 8 }} />
              <Bar dataKey="Sought help"    fill="#4d7fb5" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Needed housing" fill="#f0a30a" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Got housing"    fill="#5aad8a" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 8, padding: "14px 18px", marginTop: 14 }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "1.5px", textTransform: "uppercase", display: "block", marginBottom: 14 }}>
              🐝 HIVE Analysis — Two Ways to Count Unmet Need
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "#0b1220", borderRadius: 6, border: "1px solid #1e2d40", padding: "12px 14px" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#4d7fb5", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>
                  Client-based series · AIHW SHS Collection
                </div>
                <div style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.8 }}>
                  Tracks <strong style={{ color: "#fff" }}>unique clients</strong> each year — one person counted once regardless of how many times they sought help. Used for the historical trend 2016–2024-25.<br /><br />
                  In 2024–25: <strong style={{ color: "#4d7fb5" }}>289,000 clients</strong> served · <strong style={{ color: "#f0a30a" }}>160,000 needed housing</strong> · <strong style={{ color: "#5aad8a" }}>46,500 received it</strong>
                </div>
              </div>
              <div style={{ background: "#0b1220", borderRadius: 6, border: "1px solid #1e2d40", padding: "12px 14px" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#c0614a", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>
                  Requests-based measure · AIHW Unassisted Requests
                </div>
                <div style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.8 }}>
                  Counts every <strong style={{ color: "#fff" }}>service request</strong> that couldn&apos;t be met — including multiple attempts by the same person. Captures the <strong style={{ color: "#fff" }}>volume of pressure</strong> on the system.<br /><br />
                  In 2024–25: <strong style={{ color: "#c0614a" }}>129,000 unmet requests</strong> — around <strong style={{ color: "#c0614a" }}>350 unassisted requests every single day</strong>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #1e2d40", fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.7 }}>
              <strong style={{ color: "#f6c90e" }}>Which number we use:</strong>{" "}
              The bar chart uses the <strong style={{ color: "#fff" }}>client-based series</strong> for year-on-year consistency. The KPI card uses <strong style={{ color: "#fff" }}>129,000 (AIHW Requests)</strong> — the most current measure and the number AIHW leads with.
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 40 }}>
          <div className="chart-container">
            <div className="chart-title">2024–25 Outcomes — The Unmet Housing Gap</div>
            <div style={{ marginTop: 12 }}>
              {funnelData.map((row, i) => (
                <div key={row.label} style={{ marginBottom: i < funnelData.length - 1 ? 20 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.8rem" }}>
                    <span style={{ color: "#cbd5e1" }}>{row.label}</span>
                    <span style={{ color: row.color, fontWeight: 700 }}>{row.value.toLocaleString()} · {row.pct}%</span>
                  </div>
                  <div style={{ height: 28, background: "#1e1e36", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${row.pct}%`, height: "100%", background: row.color, borderRadius: 4, display: "flex", alignItems: "center", paddingLeft: 10, fontSize: "0.75rem", fontWeight: 700, color: "#0b1220" }}>
                      {row.pct > 15 ? row.value.toLocaleString() : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Analysis>
              Of everyone who came to an SHS agency, <strong style={{ color: "#f0a30a" }}>{funnelData[1].pct}% needed long-term housing</strong> — not just a referral.
              Of those, only <strong style={{ color: "#5aad8a" }}>{funnelData[2].pct}% received it</strong> — roughly <strong style={{ color: "#fff" }}>3 in 10</strong>.
              The gap between orange and green is people who were assessed, found eligible, and still sent away. That is the supply shortage, measured directly.
            </Analysis>
          </div>
          <div className="callout-red" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignSelf: "start" }}>
            <div style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.8 }}>
              <strong style={{ color: "#c49a3a" }}>The unmet housing gap:</strong><br /><br />
              In 2024–25, <strong style={{ color: "#fff" }}>{latestSHS.needing_housing.toLocaleString()} people</strong> came to SHS agencies specifically needing long-term housing.<br /><br />
              Only <strong style={{ color: "#5aad8a" }}>{latestSHS.got_housing.toLocaleString()} received it.</strong> That means{" "}
              <strong style={{ color: "#c0614a" }}>{(latestSHS.needing_housing - latestSHS.got_housing).toLocaleString()} people</strong>{" "}
              left without housing — a <strong style={{ color: "#c0614a" }}>{Math.round((latestSHS.needing_housing - latestSHS.got_housing) / latestSHS.needing_housing * 100)}% unmet rate</strong> driven directly by insufficient social and community housing stock.
            </div>
          </div>
        </div>

        {/* ══ SECTION 2: SUPPLY FAILURE ══════════════════════════ */}
        <div id="supply" style={{ marginBottom: 8, scrollMarginTop: 130 }}>
          <div style={sectionHeader}>Housing Supply — Are We Building Enough?</div>
          <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginBottom: 16, lineHeight: 1.6 }}>
            The <strong style={{ color: "#f6c90e" }}>gold line</strong> is the 12-month rolling average — the real trend. The <strong style={{ color: "#4d7fb5" }}>blue line</strong> is monthly approvals. The <strong style={{ color: "#c0614a" }}>red dashed line</strong> is the 20,000/month pace needed to hit the Accord target.{" "}
            <strong style={{ color: "#fff" }}>Important:</strong> these are total approvals across all tenure types — private, investor, social, and affordable. Social and affordable housing represents approximately 6% of this total (~12,000/yr nationally), but ranges from 3.5% in QLD to 9.8% in VIC (elevated by the Big Housing Build program).
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 16, marginBottom: 8 }}>
          <div className="chart-container">
            <div className="chart-title">Monthly Dwelling Approvals — ABS 8731.0</div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={recentApprovals} margin={{ top: 16, right: 20, bottom: 0, left: 55 }}>
                <CartesianGrid stroke="#1e1e36" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} interval={5} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} label={{ value: "Dwellings approved", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 13, dx: -28 }} />
                <Tooltip
                  contentStyle={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }}
                  labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                  formatter={(value: unknown, name: unknown) => [(value as number).toLocaleString(), (name as string) === "total" ? "Monthly approvals" : "12-mo average"]}
                />
                <ReferenceLine y={20000} stroke="#c0614a" strokeDasharray="6 3" label={{ value: "Accord target (20,000/mth)", fill: "#c0614a", fontSize: 13, position: "insideTopRight" }} />
                <Line type="monotone" dataKey="total" stroke="#4d7fb5" strokeWidth={2} dot={false} name="total" opacity={0.8} />
                <Line type="monotone" dataKey="ma12" stroke="#f6c90e" strokeWidth={3} dot={false} name="ma12" />
                <Legend wrapperStyle={{ fontSize: 13, color: "#94a3b8", paddingTop: 8 }} formatter={(val) => val === "total" ? "Monthly approvals" : "12-month average"} />
              </LineChart>
            </ResponsiveContainer>
            <Analysis>
              The gold trend line tells the real story: Australia&apos;s rolling 12-month average has been{" "}
              <strong style={{ color: "#fff" }}>stuck well below the 20,000/month Accord target</strong>{" "}
              for years, with no meaningful upward trajectory. The blue line&apos;s volatility — spikes and dips — reflects
              how sensitive private construction is to RBA interest rate decisions, but rate cycles don&apos;t change
              the underlying capacity constraint. Despite a {approvals.yoy_change_pct}% year-on-year uptick,
              at this pace Australia will deliver roughly{" "}
              <strong style={{ color: "#fff" }}>{(fiveYearProjection / 1000).toFixed(0)}k homes</strong>{" "}
              over the 5-year Accord period — against a target of 1.2 million. The cumulative shortfall:{" "}
              <strong style={{ color: "#c0614a" }}>~{(fiveYearShortfall / 1000).toFixed(0)}k dwellings</strong>{" "}
              that won&apos;t be built.{" "}
              Critically, <strong style={{ color: "#fff" }}>the Accord target counts all housing — private, investor, social, and affordable.</strong>{" "}
              Of the ~198k annual approvals, approximately{" "}
              <strong style={{ color: "#c0614a" }}>12,000 (~6%) are social or affordable</strong>{" "}
              — a figure that varies sharply by state (NSW 3.8%, VIC 9.8% inflated by Big Housing Build, QLD 3.5%).
              The remaining 94% will never be accessible to the 640,000 households in core housing need, regardless of how many are built.
            </Analysis>
          </div>

          <div className="chart-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div className="chart-title" style={{ textAlign: "center" }}>Supply Gap at a Glance</div>
            <RadialGauge value={approvals.annual_run_rate} target={240000} pct={approvals.pct_of_target} />
            <div style={{ marginTop: 12, fontSize: "0.78rem", color: "#94a3b8", textAlign: "center", lineHeight: 1.6 }}>
              <strong style={{ color: "#c0614a" }}>What this means:</strong><br />
              At current pace, Australia will deliver roughly{" "}
              <strong style={{ color: "#fff" }}>{(fiveYearProjection / 1000).toFixed(0)}k homes</strong> over 5 years — against a target of 1.2 million.
            </div>
          </div>
        </div>

        {/* ── Social Housing Waitlists ── */}
        <div id="waitlists" style={{ marginBottom: 8, scrollMarginTop: 130 }}>
          <div style={sectionHeader}>Social Housing Waitlists — The Queue Getting Longer</div>
          <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginBottom: 16, lineHeight: 1.6 }}>
            Each line is approved applicants waiting for social housing in each state. A rising line means the sector is losing ground.{" "}
            <strong style={{ color: "#fff" }}>NSW alone has over 61,000 households on the register.</strong>
          </p>
        </div>

        <div className="chart-container" style={{ marginBottom: 32 }}>
          <div className="chart-title">Public Housing Waitlist by State (2019–2025)</div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={waitlistChartData} margin={{ top: 10, right: 20, bottom: 0, left: 55 }}>
              <CartesianGrid stroke="#1e1e36" strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} label={{ value: "Households on waitlist", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 13, dx: -28 }} />
              <Tooltip
                contentStyle={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                formatter={(value: unknown) => [(value as number).toLocaleString(), ""]}
              />
              <Legend wrapperStyle={{ fontSize: 13, color: "#94a3b8", paddingTop: 8 }} />
              {majorStates.map((st) => (
                <Line key={st} type="monotone" dataKey={st} stroke={stateColors[st]} strokeWidth={2.5}
                  dot={{ r: 5, fill: stateColors[st], strokeWidth: 2, stroke: "#0b1220" }}
                  activeDot={{ r: 7 }}
                />
              ))}
              {minorStates.map((st) => (
                <Line key={st} type="monotone" dataKey={st} stroke={stateColors[st]} strokeWidth={1.5}
                  strokeDasharray="4 3"
                  dot={{ r: 3, fill: stateColors[st], strokeWidth: 1, stroke: "#0b1220" }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <Analysis>
            The national public-housing waitlist hit a decade high of <strong style={{ color: "#c0614a" }}>189,536 households at June 2025</strong> — up from 168,552 a year earlier (+12%) and 140,578 in 2018.{" "}
            <strong style={{ color: "#4d7fb5" }}>NSW carries the largest absolute burden</strong> (59,077), with{" "}
            <strong style={{ color: "#c0614a" }}>VIC close behind (56,230) and QLD jumping 28% in a single year</strong> (18,818 → 24,112).{" "}
            These are <strong style={{ color: "#fff" }}>households formally assessed as eligible</strong> — not rough estimates of need. And average wait times have grown from 4 years to 8+ years in some states.{" "}
            For community housing providers, every upward-sloping line is a confirmed tenant pipeline.{" "}
            <em style={{ color: "#94a3b8" }}>Measure notes: RoGS 2026 Table 18A.29, public housing program, households at 30 June. SOMIH waitlists are separate (17,478 households nationally, Table 18A.31). Community housing has no national waitlist aggregate — integrated registers mean program lists can&apos;t be added without double-counting. QLD&apos;s register is ~99.6% &quot;greatest need&quot; because its eligibility rules restrict entry to priority households — not directly comparable to other states. Pre-2024 history shown for NSW only (AIHW-verified); other states&apos; earlier years await source verification.</em>
          </Analysis>
        </div>

        {/* ── HAFF Pipeline Tracker ── */}
        <div id="haff" style={{ marginBottom: 8, marginTop: 40, scrollMarginTop: 130 }}>
          <div style={sectionHeader}>HAFF Pipeline — Is the Government&apos;s Housing Program Delivering?</div>
          <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginBottom: 16, lineHeight: 1.6 }}>
            The Housing Australia Future Fund committed ${HAFF_OVERVIEW.fund_size_bn}B. Grants fund both social and affordable homes built by CHPs.
            Target: {HAFF_OVERVIEW.five_year_target_homes.toLocaleString()} homes by {HAFF_OVERVIEW.target_period}.
          </p>
        </div>
        <div className="grid-3" style={{ marginBottom: 20 }}>
          <div className="kpi-card">
            <div className="kpi-label">Homes Announced (Rounds 1–3)</div>
            <div className="kpi-value" style={{ color: "#f6c90e" }}>{haffSummary.total_homes.toLocaleString()}</div>
            <div className="kpi-delta">{haffSummary.pct_of_5yr_target}% of the 40,000 five-year target · {haffSummary.remaining_to_target.toLocaleString()} remaining</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Social vs Affordable Split</div>
            <div className="kpi-value" style={{ color: "#4d7fb5" }}>{Math.round(haffSummary.total_social / haffSummary.total_homes * 100)}% social</div>
            <div className="kpi-delta">{haffSummary.total_social.toLocaleString()} social · {haffSummary.total_affordable.toLocaleString()} affordable</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Average Grant per Home</div>
            <div className="kpi-value" style={{ color: "#5aad8a" }}>${avgGrantPerHome}k</div>
            <div className="kpi-delta">Across {haffSummary.total_projects} projects · ${haffSummary.total_grants_m.toFixed(0)}M committed</div>
          </div>
        </div>
        <div className="chart-container" style={{ marginBottom: 32 }}>
          <div className="chart-title">HAFF Homes by State — Social vs Affordable (Rounds 1–3 combined)</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={haffStates} margin={{ top: 10, right: 20, bottom: 0, left: 20 }}>
              <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
              <XAxis dataKey="state" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(1)}k`} />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }} formatter={(v: unknown) => [(v as number).toLocaleString(), ""]} />
              <Legend wrapperStyle={{ fontSize: 13, color: "#94a3b8", paddingTop: 8 }} />
              <Bar dataKey="social" name="Social homes" stackId="a" fill="#4d7fb5" radius={[0, 0, 0, 0]} />
              <Bar dataKey="affordable" name="Affordable homes" stackId="a" fill="#7aaad4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <Analysis>
            Three rounds have announced <strong style={{ color: "#f6c90e" }}>{haffSummary.total_homes.toLocaleString()} homes</strong> — {haffSummary.pct_of_5yr_target}% of the 40,000-home five-year target.
            But the critical distinction: <strong style={{ color: "#c0614a" }}>only ~1,100 homes have been completed to date (est. May 2026).</strong>{" "}
            Around 9,000 are under construction; the rest are in planning, procurement, or pre-contract.
            HAFF is designed as <strong style={{ color: "#fff" }}>gap funding, not full project finance</strong> — the ${avgGrantPerHome}k average grant covers roughly 15–40% of total development cost.
            CHPs must stack Housing Australia concessional loans, state government contributions, land, and rental cross-subsidy to make each project viable.{" "}
            <strong style={{ color: "#fff" }}>NSW and VIC dominate</strong> by volume — reflecting both population scale and CHP sector maturity.
            Against 640,000 households in core housing need, 18,650 contracted homes represents{" "}
            <strong style={{ color: "#c0614a" }}>2.9% of evidenced need</strong> — essential momentum, but Rounds 4 and 5 are needed just to reach the 40,000 target, and the target itself barely scratches the surface of the structural deficit.
          </Analysis>
        </div>

        {/* ── Construction Cost Impact ── */}
        <div id="costs" style={{ marginBottom: 8, marginTop: 40, scrollMarginTop: 130 }}>
          <div style={sectionHeader}>Construction Cost Impact — What the Same Dollar Builds Now vs 2019</div>
          <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginBottom: 16, lineHeight: 1.6 }}>
            Since COVID, construction costs have risen 58%. The same $1B that built {costImpact.homes_per_bn_2019} homes in 2019 now builds only {costImpact.homes_per_bn_2025} — a loss of {costImpact.homes_lost_per_bn} homes per billion invested.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 16, marginBottom: 32 }}>
          <div className="chart-container">
            <div className="chart-title">PPI Construction Cost Index — ABS Cat. 6427.0 (2019 Q1 = 100)</div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={costData} margin={{ top: 10, right: 20, bottom: 0, left: 20 }}>
                <defs>
                  <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c0614a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#c0614a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
                <XAxis dataKey="period" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} interval={3} angle={-30} textAnchor="end" height={40} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} domain={[90, 180]} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }} formatter={(v) => [`${v}`, "Cost index"]} />
                <ReferenceLine y={100} stroke="#4d7fb5" strokeDasharray="4 2" label={{ value: "2019 baseline (100)", fill: "#4d7fb5", fontSize: 11, position: "insideTopLeft" }} />
                <Area type="monotone" dataKey="index" stroke="#c0614a" strokeWidth={2.5} fill="url(#costGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="kpi-card" style={{ flex: 1 }}>
              <div className="kpi-label">Homes per $1B in 2019</div>
              <div className="kpi-value" style={{ color: "#5aad8a" }}>{costImpact.homes_per_bn_2019.toLocaleString()}</div>
              <div className="kpi-delta">At $310k/dwelling (social apartment)</div>
            </div>
            <div className="kpi-card" style={{ flex: 1 }}>
              <div className="kpi-label">Homes per $1B in 2025</div>
              <div className="kpi-value" style={{ color: "#c0614a" }}>{costImpact.homes_per_bn_2025.toLocaleString()}</div>
              <div className="kpi-delta">At $560k/dwelling — 58% higher cost</div>
            </div>
            <div className="kpi-card" style={{ flex: 1 }}>
              <div className="kpi-label">Homes Lost per $1B</div>
              <div className="kpi-value" style={{ color: "#c0614a" }}>−{costImpact.homes_lost_per_bn.toLocaleString()}</div>
              <div className="kpi-delta">Every billion invested buys {costImpact.homes_lost_per_bn} fewer homes than pre-COVID</div>
            </div>
          </div>
        </div>
        <Analysis>
          The cost index reached 158.5 by early 2025 — 58% above the 2019 baseline — meaning it costs nearly 60% more to build the same home as pre-COVID.{" "}
          <strong style={{ color: "#fff" }}>For CHPs, this is a direct viability threat</strong>: construction budget assumptions from 2021–22 feasibility studies are systematically understating costs by 30–40%.{" "}
          The peak was driven by three compounding shocks: COVID supply chain disruptions, the global materials shortage, and the simultaneous HomeBuilder-induced construction surge that exhausted trade capacity across Australia.{" "}
          <strong style={{ color: "#c49a3a" }}>Costs have stabilised but not retreated</strong> — the new floor is ~$550–580k per social apartment. Any government program that sets grant levels based on 2019–2020 cost assumptions is underfunded before it starts.
        </Analysis>

        {/* ── CHP Sector Capacity ── */}
        <div id="chp" style={{ marginBottom: 8, marginTop: 40, scrollMarginTop: 130 }}>
          <div style={sectionHeader}>CHP Sector Capacity — Growth Story With a Ceiling</div>
          <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginBottom: 16, lineHeight: 1.6 }}>
            Community housing has grown 74% in 11 years — while public housing has shrunk. The sector is absorbing responsibility without proportional government investment.
          </p>
        </div>
        <div className="grid-3" style={{ marginBottom: 20 }}>
          <div className="kpi-card">
            <div className="kpi-label">CHP-Managed Properties</div>
            <div className="kpi-value" style={{ color: "#4d7fb5" }}>{(SECTOR_OVERVIEW.community_housing / 1000).toFixed(0)}k</div>
            <div className="kpi-delta">Up from 62k in 2013 — {Math.round((SECTOR_OVERVIEW.community_housing - 62000) / 62000 * 100)}% growth in 11 years</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Share of Social Housing Stock</div>
            <div className="kpi-value" style={{ color: "#4d7fb5" }}>25%</div>
            <div className="kpi-delta">Up from 16% in 2013 · public housing now {Math.round(SECTOR_OVERVIEW.public_housing / SECTOR_OVERVIEW.total_social_dwellings * 100)}% and declining</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Registered CHPs (NHR)</div>
            <div className="kpi-value" style={{ color: "#94a3b8" }}>{SECTOR_OVERVIEW.total_registered_chps}</div>
            <div className="kpi-delta">{SECTOR_OVERVIEW.tier1_count} Tier 1 (large) · sector rapidly consolidating</div>
          </div>
        </div>
        <div className="chart-container" style={{ marginBottom: 32 }}>
          <div className="chart-title">Social Housing Stock: Community Housing Growth vs Public Housing Decline (2013–2023)</div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={sectorTrendData} margin={{ top: 10, right: 20, bottom: 0, left: 20 }}>
              <defs>
                <linearGradient id="chpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4d7fb5" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4d7fb5" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="pubGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} tickFormatter={v => `${v}k`} />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }} formatter={(v: unknown) => [`${v}k`, ""]} />
              <Legend wrapperStyle={{ fontSize: 13, color: "#94a3b8", paddingTop: 8 }} />
              <Area type="monotone" dataKey="Public Housing" stroke="#94a3b8" strokeWidth={2} fill="url(#pubGrad)" />
              <Area type="monotone" dataKey="Community Housing" stroke="#4d7fb5" strokeWidth={2.5} fill="url(#chpGrad)" />
            </AreaChart>
          </ResponsiveContainer>
          <Analysis>
            The diverging lines tell the structural story of Australian housing policy over a decade.{" "}
            <strong style={{ color: "#94a3b8" }}>Public housing has declined</strong> from 330k to ~281k — state governments have divested, transferred, and under-maintained stock.{" "}
            <strong style={{ color: "#4d7fb5" }}>Community housing has grown</strong> from 62k to 119k, absorbing much of that divested stock and adding new supply through HAFF, NHHA, and state programs.{" "}
            But here&apos;s the ceiling: <strong style={{ color: "#fff" }}>the sector&apos;s growth depends entirely on government grants and concessional debt</strong>.{" "}
            Without a sustained pipeline — HAFF rounds 4, 5, and beyond — the growth curve flattens.{" "}
            The 640,000 households in core housing need cannot be served by 119k properties. The sector needs to be {Math.round(640000 / SECTOR_OVERVIEW.community_housing * 10) / 10}x its current size to meet evidenced need.
          </Analysis>
        </div>

        {/* ══ CLOSING: THE GAP AT A GLANCE ══════════════════════ */}
        <div id="gap" style={{ marginTop: 48, marginBottom: 8, borderTop: "2px solid #1e2d40", paddingTop: 40, scrollMarginTop: 130 }}>
          <div style={sectionHeader}>The Gap at a Glance — Need vs Response</div>
          <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginBottom: 24, lineHeight: 1.6 }}>
            Every section above feeds into this question: how far does the current policy response go toward closing the structural housing deficit?
          </p>
        </div>

        {/* Proportional gap bars */}
        <div className="chart-container" style={{ marginBottom: 24 }}>
          <div className="chart-title">Housing Response vs Evidenced Need — Proportional Scale (640,000 = 100%)</div>
          <div style={{ marginTop: 16 }}>
            {([
              { label: "Core housing need (AHURI/City Futures, 2021 Census)", value: 640000, color: "#c0614a", note: "Households who cannot afford adequate housing without assistance — rises to ~940k by 2041" },
              { label: "Public housing waitlist — households (RoGS 2026, Jun 2025)", value: 189536, color: "#f0a30a", note: "Decade high — assessed, eligible, waiting. SOMIH adds 17,478 on separate lists; community lists are integrated (not addable)" },
              { label: "HAFF homes contracted — Rounds 1–2", value: haffSummary.total_homes, color: "#4d7fb5", note: "Contracts signed or in execution — Round 3 (target +21,350) still in application phase" },
              { label: "HAFF homes completed to date (est. May 2026)", value: 1100, color: "#5aad8a", note: "Early Round 1 projects only — the pipeline is real but delivery is slow" },
            ] as const).map((row, i) => {
              const pct = Math.max(row.value / 640000 * 100, 0.4)
              return (
                <div key={i} style={{ marginBottom: i < 3 ? 22 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: "0.8rem" }}>
                    <span style={{ color: "#cbd5e1" }}>{row.label}</span>
                    <span style={{ color: row.color, fontWeight: 700 }}>
                      {row.value.toLocaleString()} · {Math.round(row.value / 640000 * 100)}%
                    </span>
                  </div>
                  <div style={{ height: 24, background: "#1a2535", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      width: `${pct}%`, height: "100%",
                      background: row.color, borderRadius: 4,
                      opacity: i === 0 ? 0.9 : 1,
                    }} />
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: 3 }}>{row.note}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Scorecard + What would it take */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
          <div className="chart-container">
            <div className="chart-title">Housing System Scorecard</div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {([
                { metric: "Rental affordability", detail: `42% of renters in stress · 83% in lowest income quintile`, color: "#c0614a" },
                { metric: "Housing supply vs Accord target", detail: `${approvals.pct_of_target}% of target · trend flat for 18+ months`, color: "#c0614a" },
                { metric: "Social housing waitlists", detail: "All states & territories rising · average wait now 4–8+ years", color: "#c0614a" },
                { metric: "HAFF delivery pipeline", detail: `${haffSummary.pct_of_5yr_target}% of 40k target announced · construction underway`, color: "#c49a3a" },
                { metric: "CHP sector capacity", detail: "119k properties · growing but entirely grant-dependent", color: "#c49a3a" },
                { metric: "Construction cost environment", detail: "Stabilised at 58% above 2019 — new floor, not retreating", color: "#c49a3a" },
              ] as const).map((row, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "10px 12px", background: "#0b1220", borderRadius: 6, border: "1px solid #1e2d40",
                }}>
                  <div style={{
                    width: 9, height: 9, borderRadius: "50%", marginTop: 4,
                    background: row.color, flexShrink: 0, boxShadow: `0 0 5px ${row.color}88`,
                  }} />
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#e2e8f0", marginBottom: 2 }}>{row.metric}</div>
                    <div style={{ fontSize: "0.74rem", color: "#94a3b8", lineHeight: 1.5 }}>{row.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-container">
            <div className="chart-title">What Would It Actually Take?</div>
            <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: "10px 0 16px", lineHeight: 1.6 }}>
              To house 640,000 households in core need — at $89k average HAFF grant per home (Rounds 1–2 contracted):
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {([
                {
                  timeframe: "Close the gap in 10 years",
                  pace: "64,000 homes/year",
                  cost: "$5.7B/year in grants",
                  context: "13× current HAFF annual grant capacity",
                  highlight: false,
                },
                {
                  timeframe: "Close the gap in 20 years",
                  pace: "32,000 homes/year",
                  cost: "$2.9B/year in grants",
                  context: "6.4× current HAFF annual grant capacity",
                  highlight: false,
                },
                {
                  timeframe: "At current HAFF pace (~5,000/yr)",
                  pace: "5,000 homes/year",
                  cost: "~$445M/year",
                  context: "128 years to close core housing need at this rate",
                  highlight: true,
                },
              ] as const).map((row, i) => (
                <div key={i} style={{
                  padding: "12px 14px", background: "#0b1220", borderRadius: 6,
                  border: `1px solid ${row.highlight ? "#c0614a55" : "#1e2d40"}`,
                }}>
                  <div style={{
                    fontSize: "0.72rem", fontWeight: 700, letterSpacing: "1px",
                    textTransform: "uppercase", marginBottom: 6,
                    color: row.highlight ? "#c0614a" : "#94a3b8",
                  }}>{row.timeframe}</div>
                  <div style={{ fontSize: "1rem", fontWeight: 800, color: row.highlight ? "#c0614a" : "#e2e8f0", marginBottom: 3 }}>
                    {row.pace}
                  </div>
                  <div style={{ fontSize: "0.77rem", color: "#94a3b8" }}>
                    {row.cost} · <span style={{ color: row.highlight ? "#c0614a" : "#94a3b8" }}>{row.context}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Analysis>
          The data across this dashboard tells one consistent story:{" "}
          <strong style={{ color: "#fff" }}>Australia faces a structural housing deficit, not a cyclical one.</strong>{" "}
          The 1.31 million households in rental stress and 129,000 unmet requests per year are symptoms of the same cause — a social housing stock of ~432k properties serving a core need of 640k households.{" "}
          HAFF is the largest federal housing investment in decades, and it matters: 18,650 contracted homes, construction underway, first completions arriving.{" "}
          But 2.9% of evidenced need is momentum — not a solution.{" "}
          <strong style={{ color: "#f6c90e" }}>What closes the gap is a decade-long, sustained pipeline</strong>:{" "}
          HAFF rounds 4, 5, 6, 7, 8; rising CHP balance sheets enabling concessional debt at scale; and state government land contributions reducing the grant burden per home.{" "}
          The community housing sector has the governance, the delivery track record, and the capacity to absorb investment at pace.{" "}
          <strong style={{ color: "#4d7fb5" }}>The constraint is not sector capacity — it is the political commitment to fund at the scale the evidence demands.</strong>
        </Analysis>

        {/* ── Data footnote ── */}
        <div style={{ fontSize: "0.72rem", color: "#94a3b8", lineHeight: 1.8, borderTop: "1px solid #1f2937", paddingTop: 16, marginBottom: 8 }}>
          <strong style={{ color: "#94a3b8" }}>Sources:</strong>{" "}
          ABS Building Approvals Cat. 8731.0 (monthly) · AIHW SHS Annual Report 2024–25 · ABS Survey of Income and Housing 2021–22 (rental stress) · Housing Australia HAFF Round 1 &amp; 2 media releases · ABS PPI Cat. 6427.0 (construction costs) · AIHW Housing Assistance in Australia 2023 (sector stock) · National Housing Register 2024. Updated May 2026.
        </div>

      </div>
    </div>
  )
}
