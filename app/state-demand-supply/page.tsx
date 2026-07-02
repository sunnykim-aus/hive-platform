"use client"
import { useState } from "react"
import {
  HISTORICAL_NATIONAL, HISTORICAL_NOM_DETAIL, MIGRATION_PHASES,
  STATE_PROJECTIONS, POLICY_ADVOCACY, HISTORICAL_STATE_POP,
} from "@/lib/data/population"
import { getStateSummary, getAllStatesLatest, STATE_INFO } from "@/lib/data/state-analysis"
import {
  ComposedChart, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ReferenceLine, Cell,
} from "recharts"
import ProUpgradePanel from "@/components/ProUpgradePanel"
import { useTier } from "@/lib/useTier"
import { meetsTier } from "@/lib/entitlements"

const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]

const STATE_COLORS: Record<string, string> = {
  NSW: "#4d7fb5", VIC: "#c0614a", QLD: "#c49a3a", WA: "#5aad8a", SA: "#6b8aa0",
  TAS: "#1abc9c", NT: "#e67e22", ACT: "#c0614a",
}

// HIVE modelling assumption (relabelled 2026-07). National anchor is real: AHURI/City Futures
// core housing need 640k ÷ public-housing waitlist 189.5k (RoGS 2026, Jun 2025) ≈ 3.4×
// (÷ AIHW Jun-2024 basis 165.5k ≈ 3.9×). The PER-STATE spread is a HIVE judgement reflecting
// relative homelessness/stress rates (e.g. NT homelessness ~12× national rate) — NOT published
// AHURI per-state multipliers.
const TRUE_NEED_MULTIPLIER: Record<string, number> = {
  NSW: 3.8, VIC: 3.5, QLD: 4.1, WA: 3.6, SA: 3.2,
  TAS: 4.2, NT: 5.8, ACT: 3.4,
}

// ── Shared components ────────────────────────────────────────

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

function DualAnalysis({ title, left, right, footer }: {
  title: string
  left: { label: string; color: string; content: React.ReactNode }
  right: { label: string; color: string; content: React.ReactNode }
  footer: React.ReactNode
}) {
  return (
    <div style={{
      background: "#111827", border: "1px solid #1e2d40",
      borderRadius: 8, padding: "14px 18px", marginTop: 14,
    }}>
      <span style={{
        fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e",
        letterSpacing: "1.5px", textTransform: "uppercase", display: "block", marginBottom: 14,
      }}>🐝 HIVE Analysis — {title}</span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[left, right].map((side) => (
          <div key={side.label} style={{ background: "#0b1220", borderRadius: 6, border: "1px solid #1e2d40", padding: "12px 14px" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: side.color, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>
              {side.label}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.8 }}>{side.content}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #1e2d40", fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.7 }}>
        <strong style={{ color: "#f6c90e" }}>Which number we use:</strong>{" "}{footer}
      </div>
    </div>
  )
}

function GapBar({ label, value, max, color, sublabel }: {
  label: string; value: number; max: number; color: string; sublabel?: string
}) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: "0.85rem" }}>
        <span style={{ color: "#cbd5e1", fontWeight: 600 }}>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{value.toLocaleString()}</span>
      </div>
      <div style={{ height: 26, background: "#1e1e36", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, minWidth: pct > 0 ? 4 : 0 }} />
      </div>
      {sublabel && <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 4 }}>{sublabel}</div>}
    </div>
  )
}

function PartTitle({ id, part, children }: { id: string; part: string; children: React.ReactNode }) {
  return (
    <div id={id} style={{ paddingTop: 4, marginBottom: 6 }}>
      <div style={{ fontSize: "0.80rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 4 }}>
        {part}
      </div>
      <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.3px" }}>
        {children}
      </div>
    </div>
  )
}

const divider = { border: "none", borderTop: "1px solid #1e2d40", margin: "36px 0" } as const

// ── Jump nav ─────────────────────────────────────────────────

const JUMP_SECTIONS = [
  { id: "growth",      label: "Population Growth" },
  { id: "states",      label: "State Outlook" },
  { id: "pressure",    label: "Housing Pressure" },
  { id: "waitlist",    label: "Waitlist Crisis" },
  { id: "state-drill", label: "State Deep-Dive" },
  { id: "policy",      label: "Policy Levers" },
]

function JumpNav() {
  return (
    <div style={{
      background: "#070d18",
      borderTop: "1px solid #1e2d40",
      borderBottom: "1px solid #1e2d40",
      position: "sticky",
      top: 76,
      zIndex: 50,
      overflowX: "auto",
      scrollbarWidth: "none" as const,
      margin: "0 -24px 28px",
    }}>
      <div style={{
        padding: "7px 24px",
        display: "flex", gap: 4, whiteSpace: "nowrap" as const, alignItems: "center",
      }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#4a5a6a", marginRight: 8, letterSpacing: "1px", textTransform: "uppercase", flexShrink: 0 }}>JUMP TO</span>
        {JUMP_SECTIONS.map((sec) => (
          <a
            key={sec.id}
            href={`#${sec.id}`}
            style={{
              display: "inline-block",
              padding: "4px 12px",
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "#94a3b8",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid #1e2d40",
              borderRadius: 4,
              textDecoration: "none",
            }}
          >
            {sec.label}
          </a>
        ))}
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────

export default function DemandSupplyPage() {
  const [selectedState, setSelectedState] = useState("NSW")

  const { tier, loaded: tierLoaded, gatingActive } = useTier()
  const proState: "loading" | "unlocked" | "locked" = !tierLoaded
    ? "loading"
    : !gatingActive || meetsTier(tier, "pro")
      ? "unlocked"
      : "locked"

  // ── Population data ──────────────────────────────────────
  const first = HISTORICAL_NATIONAL[0]
  const last  = HISTORICAL_NATIONAL[HISTORICAL_NATIONAL.length - 1]
  const totalGrowth = (last.population_m - first.population_m).toFixed(2)

  // Latest actual state population from historical data (for projection cards)
  const latestStatePop: Record<string, number> = Object.fromEntries(
    Object.entries(HISTORICAL_STATE_POP).map(([state, data]) => [
      state, data[data.length - 1].pop_m,
    ])
  )

  // Avg household size implied by population / Census household count
  const avgHhSize = (last.population_m / 10.9).toFixed(1)
  const peak   = HISTORICAL_NOM_DETAIL.reduce((a, b) => a.total_k > b.total_k ? a : b)
  const trough = HISTORICAL_NOM_DETAIL.reduce((a, b) => a.total_k < b.total_k ? a : b)

  const histData = HISTORICAL_NATIONAL.map((d) => ({
    year: d.year,
    population: d.population_m,
    natural: Math.round(d.natural_increase * 1000),
    nim: Math.round(d.nim * 1000),
  }))

  const nomData = HISTORICAL_NOM_DETAIL.map((d) => ({
    year: d.year,
    skilled: d.skilled_k,
    family: d.family_k,
    student: d.student_k,
    other: d.other_k,
  }))

  const stateYears = HISTORICAL_STATE_POP.NSW.map((d) => d.year)
  const stateChartData = stateYears.map((yr) => {
    const row: Record<string, number | string> = { year: yr }
    for (const [state, data] of Object.entries(HISTORICAL_STATE_POP)) {
      const found = data.find((d) => d.year === yr)
      if (found) row[state] = found.pop_m
    }
    return row
  })

  const statePopColors: Record<string, string> = {
    NSW: "#4d7fb5", VIC: "#c0614a", QLD: "#c49a3a", WA: "#5aad8a", SA: "#b97cff",
    TAS: "#1abc9c", NT: "#e67e22", ACT: "#c0614a",
  }

  // ── D&S data ─────────────────────────────────────────────
  const allStateSummaries = STATES.map(st => {
    const s = getStateSummary(st)
    const requiredFor10yr = Math.round(s.latest_waitlist / 10)
    const annualGap = Math.max(0, requiredFor10yr - s.accessible_total)
    return {
      state: st, full: s.state_full,
      waitlist: s.latest_waitlist,
      delivery: s.accessible_total,
      yearsToClear: s.years_to_clear_waitlist ?? 99,
      requiredFor10yr, annualGap,
      accessiblePct: s.accessible_pct_of_approvals,
    }
  })

  const natWaitlist   = allStateSummaries.reduce((a, s) => a + s.waitlist, 0)
  const natDelivery   = allStateSummaries.reduce((a, s) => a + s.delivery, 0)
  const natYearsClear = Math.round(natWaitlist / natDelivery)
  const natRequired   = Math.round(natWaitlist / 10)
  const natGap        = Math.max(0, natRequired - natDelivery)

  const yearsToClearChart = [...allStateSummaries].sort((a, b) => b.yearsToClear - a.yearsToClear)
  const deliveryGapChart  = allStateSummaries.map(s => ({
    state: s.state,
    "Current delivery": s.delivery,
    "Required (10yr clearance)": s.requiredFor10yr,
  }))

  // ── Selected state ────────────────────────────────────────
  const s = getStateSummary(selectedState)
  const allStates      = getAllStatesLatest()
  const stateComparison = allStates.sort((a, b) => b.waitlist - a.waitlist)
  const recentApprovals   = s.approvals_by_type.slice(-8)
  const recentCompletions = s.social_housing_completions.slice(-8)
  const demoData          = s.demographics.types ?? []
  const trueNeedEstimate  = Math.round(s.latest_waitlist * TRUE_NEED_MULTIPLIER[selectedState])
  const multiplier        = TRUE_NEED_MULTIPLIER[selectedState]
  const requiredFor10yr   = Math.round(s.latest_waitlist / 10)
  const annualGap         = Math.max(0, requiredFor10yr - s.accessible_total)

  return (
    <div style={{ background: "#0b1220", minHeight: "100vh" }}>
      <div className="page-container">

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="page-header">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 className="page-title">Supply Pipeline</h1>
              <p className="page-subtitle">
                Population pressure is accelerating. Supply is not.
                Australia added {totalGrowth}M people in a decade — a record {peak.total_k.toLocaleString()}k in 2023 alone — while social and affordable completions covered less than 5% of the backlog each year.
                Waitlists across all 8 states and territories now take <strong style={{ color: "#c0614a" }}>{Math.round(natWaitlist / natDelivery)} years to clear</strong> at current delivery rates — and that assumes zero new applications, which never happens.
              </p>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: 8 }}>
                Sources: ABS Cat. 3101.0 · 3412.0 · 3222.0 · State housing registers · AIHW · AHURI · CoreLogic · PropTrack. Updated May 2026.
              </div>
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "rgba(39,174,96,0.1)", border: "1px solid rgba(39,174,96,0.25)",
              borderRadius: 20, padding: "6px 14px", whiteSpace: "nowrap" as const, flexShrink: 0,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#5aad8a", display: "inline-block", boxShadow: "0 0 6px #5aad8a" }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#5aad8a", letterSpacing: "1px" }}>Last updated: May 2026</span>
            </div>
          </div>
        </div>

        <JumpNav />

        {/* ═══════════════════════════════════════════════════════
            PART 1 — POPULATION ENGINE
        ═══════════════════════════════════════════════════════ */}
        <PartTitle id="growth" part="Part 1">The Population Engine</PartTitle>
        <p style={{ fontSize: "0.88rem", color: "#94a3b8", marginBottom: 20, lineHeight: 1.6 }}>
          Ten years of actual growth, the COVID migration shock, and what each wave did to the housing market.
        </p>

        <div className="grid-4" style={{ marginBottom: 24 }}>
          <div className="kpi-card">
            <div className="kpi-label">Population 2015</div>
            <div className="kpi-value">{first.population_m.toFixed(2)}M</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Population 2024</div>
            <div className="kpi-value" style={{ color: "#f6c90e" }}>{last.population_m.toFixed(2)}M</div>
            <div className="kpi-delta">+{totalGrowth}M over 10 years</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Peak NOM (2023)</div>
            <div className="kpi-value" style={{ color: "#c0614a" }}>{peak.total_k.toLocaleString()}k</div>
            <div className="kpi-delta">Record — 2× pre-COVID average</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">COVID trough (2021)</div>
            <div className="kpi-value" style={{ color: "#c0614a" }}>{trough.total_k.toLocaleString()}k</div>
            <div className="kpi-delta" style={{ color: "#c0614a" }}>Net outflow — first time since 1946</div>
          </div>
        </div>

        <div className="chart-container" style={{ marginBottom: 24 }}>
          <div className="chart-title">National Population &amp; Net Overseas Migration — 2015 to 2024</div>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: 12 }}>ABS Cat. 3101.0 &amp; 3412.0 — annual June-year figures</div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={histData} margin={{ top: 10, right: 60, bottom: 0, left: 55 }}>
              <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 13 }} tickLine={false} />
              <YAxis yAxisId="pop" domain={[23, 28]} tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false}
                tickFormatter={(v) => `${v}M`}
                label={{ value: "Population (M)", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 13, dx: -28 }} />
              <YAxis yAxisId="nom" orientation="right" domain={[-150, 700]}
                tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false}
                tickFormatter={(v) => `${v}k`}
                label={{ value: "Annual arrivals", angle: 90, position: "insideRight", fill: "#94a3b8", fontSize: 13, dx: 28 }} />
              <Tooltip
                contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                formatter={(v: unknown) => [`${v}`, ""]}
              />
              <Legend wrapperStyle={{ fontSize: 13, color: "#94a3b8", paddingTop: 8 }} />
              <Bar yAxisId="nom" dataKey="natural" name="Natural increase" stackId="a" fill="#5aad8a" opacity={0.85} />
              <Bar yAxisId="nom" dataKey="nim" name="Net overseas migration" stackId="a" fill="#4d7fb5" opacity={0.85} radius={[2, 2, 0, 0]} />
              <Line yAxisId="pop" type="monotone" dataKey="population" name="National population"
                stroke="#f6c90e" strokeWidth={2.5}
                dot={{ r: 4, fill: "#f6c90e", stroke: "#0b1220", strokeWidth: 2 }}
                activeDot={{ r: 6 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div style={{ marginBottom: 28 }}>
          <div className="section-label">Four Phases of Migration — and What Each Did to Housing</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MIGRATION_PHASES.map((phase) => (
              <div key={phase.label} className="hive-card" style={{ borderLeft: `4px solid ${phase.color}` }}>
                <div style={{ display: "flex", gap: 20, alignItems: "stretch" }}>
                  <div style={{ flex: "3 1 0", minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: "#fff", marginBottom: 4, fontSize: "0.9rem" }}>
                      {phase.label}{" "}
                      <span style={{ color: "#94a3b8", fontWeight: 400 }}>— {phase.years} · avg {phase.avg_nim_k.toLocaleString()}k/yr</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.7 }}>{phase.narrative}</div>
                  </div>
                  <div style={{ flex: "2 1 0", background: "#0b1220", borderRadius: 8, padding: "12px 16px", minWidth: 0 }}>
                    <div style={{ fontSize: "0.72rem", textTransform: "uppercase" as const, letterSpacing: "1px", fontWeight: 700, color: "#7a8fa8", marginBottom: 6 }}>
                      Housing Market Impact
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.65 }}>{phase.housing}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr style={divider} />

        {/* ═══════════════════════════════════════════════════════
            PART 2 — STATE GROWTH & 2044 OUTLOOK
        ═══════════════════════════════════════════════════════ */}
        <PartTitle id="states" part="Part 2">State Growth &amp; 2044 Outlook</PartTitle>
        <p style={{ fontSize: "0.88rem", color: "#94a3b8", marginBottom: 20, lineHeight: 1.6 }}>
          Growth is not uniform. QLD and WA are growing fastest — making their housing deficits exponentially harder to close without a step-change in delivery.
        </p>

        <div className="chart-container" style={{ marginBottom: 24 }}>
          <div className="chart-title">State Population Growth — 2015 to 2024 (M)</div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stateChartData} margin={{ top: 10, right: 20, bottom: 0, left: 55 }}>
              <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 13 }} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} tickFormatter={(v) => `${v}M`}
                label={{ value: "Population (M)", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 13, dx: -28 }} />
              <Tooltip
                contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                formatter={(v: unknown) => [`${v}M`, ""]}
              />
              <Legend wrapperStyle={{ fontSize: 13, color: "#94a3b8" }} />
              {Object.entries(statePopColors).map(([st, color]) => (
                <Line key={st} type="monotone" dataKey={st} stroke={color} strokeWidth={2.2}
                  dot={{ r: 4, fill: color, stroke: "#0b1220", strokeWidth: 1.5 }}
                  activeDot={{ r: 6 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 28,
        }}>
          {Object.entries(STATE_PROJECTIONS).map(([state, proj]) => {
            const currentPop = latestStatePop[state] ?? proj.current_pop_m
            const growthM = (proj.proj_2041_m - currentPop).toFixed(2)
            return (
              <div key={state} className="kpi-card" style={{ borderTop: `3px solid ${proj.color}`, display: "flex", flexDirection: "column", minWidth: 0 }}>
                <div className="kpi-label" style={{ whiteSpace: "normal", lineHeight: 1.4 }}>{state} — ABS Series B to 2041</div>
                <div className="kpi-value" style={{ fontSize: "1.4rem", color: proj.color }}>{proj.proj_2041_m}M</div>
                <div className="kpi-delta">from {currentPop}M today (+{growthM}M)</div>
                <div style={{ marginTop: 8, fontSize: "0.72rem", color: "#94a3b8", lineHeight: 1.5 }}>
                  {proj.growth_drivers}
                </div>
              </div>
            )
          })}
        </div>

        <hr style={divider} />

        {/* ═══════════════════════════════════════════════════════
            PART 3 — THE DEMAND CASCADE (BRIDGE)
        ═══════════════════════════════════════════════════════ */}
        <PartTitle id="pressure" part="Part 3">From Population to Housing Pressure</PartTitle>
        <p style={{ fontSize: "0.88rem", color: "#94a3b8", marginBottom: 20, lineHeight: 1.6 }}>
          Population growth does not become a housing crisis automatically — it becomes one when new households cannot be absorbed by supply,
          and when the most vulnerable cohorts are systematically passed over by what the market builds.
        </p>

        {/* Migration by visa stream */}
        <div className="chart-container" style={{ marginBottom: 24 }}>
          <div className="chart-title">Migration Breakdown by Visa Stream — 2015 to 2024 (000s)</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={nomData} margin={{ top: 10, right: 20, bottom: 0, left: 55 }}>
              <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 13 }} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} tickFormatter={(v) => `${v}k`}
                label={{ value: "People ('000s)", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 13, dx: -28 }} />
              <Tooltip
                contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                formatter={(v: unknown) => [`${v}k`, ""]}
              />
              <Legend wrapperStyle={{ fontSize: 13, color: "#94a3b8" }} />
              <ReferenceLine y={0} stroke="#444" />
              <Bar dataKey="skilled" name="Skilled migration" stackId="a" fill="#4d7fb5" opacity={0.9} />
              <Bar dataKey="family"  name="Family stream"     stackId="a" fill="#5aad8a" opacity={0.9} />
              <Bar dataKey="student" name="International students" stackId="a" fill="#f0a30a" opacity={0.9} />
              <Bar dataKey="other"   name="Other / humanitarian"   stackId="a" fill="#6b8aa0" opacity={0.9} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* The demand cascade funnel */}
        <div style={{
          background: "#111827", border: "1px solid #1e2d40",
          borderRadius: 10, padding: "20px 24px", marginBottom: 24,
        }}>
          <div style={{
            fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e",
            letterSpacing: "1.5px", textTransform: "uppercase" as const, marginBottom: 18,
          }}>
            🐝 The Demand Cascade — From People to Housing Need
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 0,
            overflowX: "auto" as const,
          }}>
            {[
              { n: `${last.population_m}M`, label: "Australians",  sub: "2024 ABS estimate",          color: "#f6c90e" },
              { n: "10.9M",  label: "Households",         sub: `÷ ${avgHhSize} persons avg`,  color: "#4d7fb5" },
              { n: "3.1M",   label: "Private renters",    sub: "26% of all households",      color: "#c49a3a" },
              { n: "1.31M",  label: "In rental stress",   sub: ">30% of income on rent",     color: "#c0614a" },
              { n: "640k",   label: "Core housing need",  sub: "AHURI — no market solution", color: "#c0614a" },
              { n: "190k",   label: "On the waitlist",    sub: "Public housing households, Jun 2025 (RoGS) · +17.5k SOMIH", color: "#6b8aa0" },
            ].map((item, i, arr) => (
              <div key={i} style={{ display: "flex", alignItems: "stretch", minWidth: 110 }}>
                <div style={{ flex: 1, textAlign: "center" as const, padding: "14px 6px" }}>
                  <div style={{ fontSize: "1.45rem", fontWeight: 900, color: item.color, lineHeight: 1 }}>{item.n}</div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#cbd5e1", marginTop: 5 }}>{item.label}</div>
                  <div style={{ fontSize: "0.66rem", color: "#94a3b8", marginTop: 3, lineHeight: 1.4 }}>{item.sub}</div>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ display: "flex", alignItems: "center", paddingBottom: 14, color: "#1e2d40", fontSize: "1.1rem" }}>→</div>
                )}
              </div>
            ))}
          </div>
          <div style={{
            borderTop: "1px solid #1e2d40", paddingTop: 14, marginTop: 4,
            fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.8,
          }}>
            The 2023 migration surge added ~518,000 people — roughly{" "}
            <strong style={{ color: "#fff" }}>207,000 new households</strong> at the national average household size.
            Of those, approximately <strong style={{ color: "#c49a3a" }}>54,000 would enter the private rental market</strong>,
            competing with existing low-income renters for stock that was already structurally undersupplied.
            National building approvals were ~170,000 in 2023 against a pre-existing shortfall — and almost none targeted
            the income levels that needed it.{" "}
            <strong style={{ color: "#fff" }}>Every year of undersupply compounds the pressure on the bottom two income quintiles.</strong>
          </div>
        </div>

        <hr style={divider} />

        {/* ═══════════════════════════════════════════════════════
            PART 4 — THE WAITLIST CRISIS
        ═══════════════════════════════════════════════════════ */}
        <PartTitle id="waitlist" part="Part 4">The Waitlist Crisis</PartTitle>
        <p style={{ fontSize: "0.88rem", color: "#94a3b8", marginBottom: 20, lineHeight: 1.6 }}>
          Aggregated across all 8 states and territories with public housing registers.
          This is the scale of the problem before any state-level policy response.
        </p>

        <div className="grid-4" style={{ marginBottom: 20 }}>
          <div className="kpi-card">
            <div className="kpi-label">Total National Waitlist</div>
            <div className="kpi-value" style={{ color: "#c0614a" }}>{natWaitlist.toLocaleString()}</div>
            <div className="kpi-delta">Verified, approved applicants across all states &amp; territories</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Total Annual Delivery</div>
            <div className="kpi-value" style={{ fontSize: "1.6rem", color: "#5aad8a" }}>{natDelivery.toLocaleString()}</div>
            <div className="kpi-delta">Social + affordable completions per year</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">National Years to Clear</div>
            <div className="kpi-value" style={{ color: "#c0614a" }}>{natYearsClear}</div>
            <div className="kpi-delta">At current delivery, zero new applications</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">National Annual Gap</div>
            <div className="kpi-value" style={{ fontSize: "1.6rem", color: "#c49a3a" }}>{natGap.toLocaleString()}</div>
            <div className="kpi-delta">Extra dwellings/yr needed to clear in 10 years</div>
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: 8 }}>
          <div className="chart-container">
            <div className="chart-title">Years to Clear Waitlist — by State (worst to best)</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={yearsToClearChart} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 55 }}>
                <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false}
                  label={{ value: "Years", position: "insideBottomRight", offset: -4, fill: "#94a3b8", fontSize: 12 }} />
                <YAxis type="category" dataKey="state" tick={{ fill: "#ccc", fontSize: 13 }} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                  formatter={(v: unknown) => [`${v} years`, "to clear waitlist"]}
                />
                <Bar dataKey="yearsToClear" radius={[0, 4, 4, 0]}>
                  {yearsToClearChart.map((entry) => (
                    <Cell key={entry.state}
                      fill={entry.yearsToClear > 40 ? "#c0614a" : entry.yearsToClear > 20 ? "#c49a3a" : "#5aad8a"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <div className="chart-title">Annual Delivery vs Required for 10-Year Clearance</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={deliveryGapChart} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barCategoryGap="25%">
                <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
                <XAxis dataKey="state" tick={{ fill: "#ccc", fontSize: 13 }} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                  formatter={(v: unknown) => [(v as number).toLocaleString(), ""]}
                />
                <Bar dataKey="Current delivery" fill="#5aad8a" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Required (10yr clearance)" fill="#c0614a" opacity={0.6} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: "0.78rem" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#94a3b8" }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: "#5aad8a", display: "inline-block" }} />
                Current delivery
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#94a3b8" }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: "#c0614a", opacity: 0.6, display: "inline-block" }} />
                Required for 10yr clearance
              </span>
            </div>
          </div>
        </div>

        <div className="hive-card" style={{ marginBottom: 8 }}>
          <div className="chart-title" style={{ marginBottom: 12 }}>All States — Key Metrics at a Glance</div>
          <table className="hive-table">
            <thead>
              <tr>
                <th>State</th>
                <th>Waitlist</th>
                <th>Annual Delivery</th>
                <th>Years to Clear</th>
                <th>Annual Gap (10yr)</th>
                <th>Accessible %</th>
              </tr>
            </thead>
            <tbody>
              {allStateSummaries.map((row) => (
                <tr key={row.state} style={{ cursor: "pointer" }} onClick={() => setSelectedState(row.state)}>
                  <td>
                    <span style={{ fontWeight: 700, color: STATE_COLORS[row.state] }}>{row.state}</span>
                    <span style={{ color: "#94a3b8", fontSize: "0.78rem", marginLeft: 8 }}>{row.full}</span>
                  </td>
                  <td style={{ color: "#c0614a", fontWeight: 600 }}>{row.waitlist.toLocaleString()}</td>
                  <td style={{ color: "#5aad8a", fontWeight: 600 }}>{row.delivery.toLocaleString()}</td>
                  <td>
                    <span style={{ color: row.yearsToClear > 40 ? "#c0614a" : row.yearsToClear > 20 ? "#c49a3a" : "#5aad8a", fontWeight: 700 }}>
                      {row.yearsToClear} yrs
                    </span>
                  </td>
                  <td style={{ color: "#c49a3a", fontWeight: 600 }}>{row.annualGap.toLocaleString()}</td>
                  <td style={{ color: "#94a3b8" }}>{row.accessiblePct}%</td>
                </tr>
              ))}
              <tr style={{ borderTop: "1px solid #1e2d40" }}>
                <td><span style={{ fontWeight: 800, color: "#f6c90e" }}>NATIONAL</span></td>
                <td style={{ color: "#c0614a", fontWeight: 800 }}>{natWaitlist.toLocaleString()}</td>
                <td style={{ color: "#5aad8a", fontWeight: 800 }}>{natDelivery.toLocaleString()}</td>
                <td><span style={{ color: "#c0614a", fontWeight: 800 }}>{natYearsClear} yrs</span></td>
                <td style={{ color: "#c49a3a", fontWeight: 800 }}>{natGap.toLocaleString()}</td>
                <td style={{ color: "#94a3b8" }}>—</td>
              </tr>
            </tbody>
          </table>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 10 }}>
            Click any state row to jump to the detailed breakdown below.
          </div>
        </div>

        <Analysis>
          The population data above explains why the waitlist keeps growing: Australia added {totalGrowth}M people in 10 years,
          with a {peak.total_k.toLocaleString()}k NOM surge in 2023 alone — each new arrival household competing
          in a rental market already under structural stress.{" "}
          <strong style={{ color: "#fff" }}>{natWaitlist.toLocaleString()} households are on verified waitlists</strong> across all states and territories,
          yet combined social and affordable delivery totals just {natDelivery.toLocaleString()} dwellings —{" "}
          less than <strong style={{ color: "#c0614a" }}>5% of the backlog</strong> per year.
          At that rate, clearing the national queue would take <strong style={{ color: "#c0614a" }}>{natYearsClear} years</strong> — assuming zero new applicants, which never happens.
          <br /><br />
          Victoria&apos;s Big Housing Build has brought it to a{" "}
          <strong style={{ color: "#f6c90e" }}>13-year horizon</strong> — the only state remotely close to manageable.
          NSW remains at <strong style={{ color: "#c0614a" }}>42 years</strong>, SA at 29 years, QLD at 23 years, and WA at 20 years.
          <strong style={{ color: "#fff" }}> To close the backlog in a decade, national delivery would need to increase by {natGap.toLocaleString()} dwellings per year</strong> — more than double current output.
        </Analysis>

        <hr style={divider} />

        {/* ═══════════════════════════════════════════════════════
            PART 5 — STATE DEEP-DIVE
        ═══════════════════════════════════════════════════════ */}
        <PartTitle id="state-drill" part="Part 5">State Deep-Dive</PartTitle>
        {proState === "loading" && <div style={{ padding: 24, textAlign: "center", color: "#6b8aa0", fontSize: "0.85rem" }}>Loading…</div>}
        {proState === "locked" && (
          <ProUpgradePanel
            title="State deep-dive is a Pro feature"
            body="Drill into any state — true-need estimates, multi-decade projections, and delivery-gap modelling. The free plan includes the state-level growth and waitlist outlook above."
          />
        )}
        {proState === "unlocked" && (<>
        <p style={{ fontSize: "0.88rem", color: "#94a3b8", marginBottom: 16, lineHeight: 1.6 }}>
          Waitlist history, supply pipeline, delivery gap, who is waiting, and what needs to change — state by state.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 28 }}>
          {STATES.map((st) => (
            <button
              key={st}
              className={`tab-pill ${selectedState === st ? "active" : ""}`}
              onClick={() => setSelectedState(st)}
              style={{
                borderColor: selectedState === st ? STATE_COLORS[st] : undefined,
                color: selectedState === st ? STATE_COLORS[st] : undefined,
                width: "100%",
              }}
            >
              {st} — {STATE_INFO[st]?.full}
            </button>
          ))}
        </div>

        <div className="grid-4" style={{ marginBottom: 16 }}>
          <div className="kpi-card">
            <div className="kpi-label">Official Waitlist ({s.waitlist_year})</div>
            <div className="kpi-value" style={{ color: "#c0614a" }}>{s.latest_waitlist.toLocaleString()}</div>
            <div className="kpi-delta" style={{ color: s.wl_change_yoy && s.wl_change_yoy > 0 ? "#c0614a" : "#5aad8a" }}>
              {s.wl_change_yoy !== null ? `${s.wl_change_yoy > 0 ? "+" : ""}${s.wl_change_yoy}% YoY` : "—"}
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Social + Affordable Completions</div>
            <div className="kpi-value" style={{ fontSize: "1.6rem", color: "#5aad8a" }}>{s.accessible_total.toLocaleString()}</div>
            <div className="kpi-delta">Dwellings reaching people in need per year</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Years to Clear Waitlist</div>
            <div className="kpi-value" style={{ color: s.years_to_clear_waitlist && s.years_to_clear_waitlist > 20 ? "#c0614a" : "#c49a3a" }}>
              {s.years_to_clear_waitlist ?? "—"}
            </div>
            <div className="kpi-delta">At current delivery, zero new applications</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Annual Delivery Gap</div>
            <div className="kpi-value" style={{ fontSize: "1.6rem", color: "#c49a3a" }}>{annualGap.toLocaleString()}</div>
            <div className="kpi-delta">Extra dwellings/yr needed to clear in 10 years</div>
          </div>
        </div>

        <Analysis>
          <strong style={{ color: "#fff" }}>{s.state_full} would take {s.years_to_clear_waitlist ?? "many"} years to clear its waitlist at current delivery rates</strong>{" "}
          — assuming no new applications, which never happens.
          To clear the {s.latest_waitlist.toLocaleString()} household backlog within 10 years,{" "}
          {s.state_full} would need to deliver{" "}
          <strong style={{ color: "#c49a3a" }}>{requiredFor10yr.toLocaleString()} social and affordable dwellings per year</strong>{" "}
          — it is currently delivering {s.accessible_total.toLocaleString()}, a gap of{" "}
          <strong style={{ color: "#c0614a" }}>{annualGap.toLocaleString()} dwellings every year</strong>.{" "}
          {s.state_full}&apos;s key program is the{" "}
          <strong style={{ color: "#fff" }}>{s.key_program}</strong>, targeting {s.target_new_pa.toLocaleString()} new dwellings per year.
        </Analysis>

        <div className="callout-gold" style={{ marginTop: 16, marginBottom: 28, fontSize: "0.88rem", color: "#cbd5e1", lineHeight: 1.8 }}>
          <strong style={{ color: "#f6c90e" }}>{s.state_full} — {s.authority}</strong><br />
          {s.insight}
        </div>

        {/* Demand sub-section */}
        <div className="section-label" style={{ marginBottom: 8 }}>Demand — Who Is Waiting, and How Long?</div>
        <p style={{ fontSize: "0.88rem", color: "#94a3b8", marginBottom: 16, lineHeight: 1.6 }}>
          The official register tracks verified, eligible applicants. The gap bar shows the delivery rate needed to actually close it.
        </p>

        <div className="grid-2" style={{ marginBottom: 8 }}>
          <div className="chart-container">
            <div className="chart-title">Waitlist Trend — {s.state_full} (All Years)</div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={s.waitlist_trend} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} interval={3} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                  formatter={(v: unknown) => [(v as number).toLocaleString(), "applicants"]}
                />
                <Line type="monotone" dataKey="applicants" stroke={STATE_COLORS[selectedState]} strokeWidth={2.5}
                  dot={{ r: 3, fill: STATE_COLORS[selectedState], stroke: "#0b1220", strokeWidth: 1 }}
                  activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <div className="chart-title">State Comparison — Waitlist 2024</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stateComparison} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 55 }}>
                <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="state" tick={{ fill: "#ccc", fontSize: 13 }} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                  formatter={(v: unknown) => [(v as number).toLocaleString(), "applicants"]}
                />
                <Bar dataKey="waitlist" radius={[0, 4, 4, 0]}>
                  {stateComparison.map((entry) => (
                    <Cell key={entry.state} fill={STATE_COLORS[entry.state] ?? "#4d7fb5"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container" style={{ marginBottom: 8 }}>
          <div className="chart-title">The Delivery Gap — {s.state_full}</div>
          <div style={{ padding: "8px 0" }}>
            <GapBar label="Official waitlist (households waiting)" value={s.latest_waitlist} max={s.latest_waitlist} color="#c0614a"
              sublabel="100% — the full backlog to clear" />
            <GapBar label="Required annual delivery to clear in 10 years" value={requiredFor10yr} max={s.latest_waitlist} color="#c49a3a"
              sublabel={`${((requiredFor10yr / s.latest_waitlist) * 100).toFixed(1)}% of waitlist per year`} />
            <GapBar label="Actual social + affordable completions per year" value={s.accessible_total} max={s.latest_waitlist} color="#5aad8a"
              sublabel={`${((s.accessible_total / s.latest_waitlist) * 100).toFixed(1)}% of waitlist per year — gap of ${annualGap.toLocaleString()} dwellings/yr`} />
          </div>
        </div>

        <DualAnalysis
          title="Two Ways to Count Housing Demand"
          left={{
            label: "Official Housing Register · Verified Waitlist",
            color: "#c0614a",
            content: <>
              The housing register counts applicants formally assessed as eligible —
              the <strong style={{ color: "#fff" }}>most reliable and comparable figure</strong>, auditable and year-on-year consistent.
              It is also a significant undercount: complex processes and long waits deter many acutely vulnerable people from applying.
              <br /><br />
              <strong style={{ color: "#c0614a" }}>{s.state_full}: {s.latest_waitlist.toLocaleString()} verified households</strong>
            </>
          }}
          right={{
            label: "Estimated True Need · HIVE Estimate (AHURI-informed)",
            color: "#c49a3a",
            content: <>
              Registers undercount need: hidden homelessness, severe rental stress (&gt;50% income),
              and those who gave up registering are excluded. Nationally, AHURI/City Futures core housing need (640k) runs
              ~3.4× the public-housing waitlist (RoGS, Jun 2025) — HIVE applies a state-adjusted multiplier ({multiplier}× for {s.state_full}, reflecting
              relative homelessness and stress rates) to estimate true unmet need of{" "}
              <strong style={{ color: "#c49a3a" }}>{trueNeedEstimate.toLocaleString()} households</strong>.
            </>
          }}
          footer={<>
            KPI cards use the <strong style={{ color: "#fff" }}>official register</strong>.
            The estimated true need ({trueNeedEstimate.toLocaleString()}) is a{" "}
            <strong style={{ color: "#fff" }}>HIVE estimate anchored to AHURI/City Futures core-need research</strong> —
            the 640k core-need figure is published (the ~3.4× ratio to the RoGS waitlist follows from it); the per-state adjustment is HIVE&apos;s. Cite it as an estimate, not an official figure.
          </>}
        />

        {/* Supply sub-section */}
        <div className="section-label" style={{ marginTop: 32, marginBottom: 8 }}>Supply — What&apos;s Being Built, and For Whom?</div>
        <p style={{ fontSize: "0.88rem", color: "#94a3b8", marginBottom: 16, lineHeight: 1.6 }}>
          Total approvals measure the pipeline. Social and affordable completions measure what actually reaches people in need.
        </p>

        <div style={{
          background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 10,
          padding: "16px 20px", marginBottom: 16,
          display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap",
        }}>
          <div style={{ minWidth: 140 }}>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase" as const, letterSpacing: "1px", color: "#94a3b8", marginBottom: 4 }}>
              Accessible % of Approvals
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#5aad8a", lineHeight: 1 }}>{s.accessible_pct_of_approvals}%</div>
            <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: 4 }}>Social + affordable of total pipeline</div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ height: 20, background: "#0b1220", borderRadius: 10, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ width: `${s.accessible_pct_of_approvals}%`, height: "100%", background: "#5aad8a", borderRadius: 10 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
              <span style={{ color: "#5aad8a" }}>{s.accessible_pct_of_approvals}% accessible ({s.accessible_total.toLocaleString()} dwellings)</span>
              <span style={{ color: "#94a3b8" }}>{(100 - s.accessible_pct_of_approvals).toFixed(1)}% private ({(s.latest_approvals_total - s.accessible_total).toLocaleString()} dwellings)</span>
            </div>
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: 8 }}>
          <div className="chart-container">
            <div className="chart-title">Building Approvals by Type — {s.state_full}</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={recentApprovals} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                  formatter={(v: unknown) => [(v as number).toLocaleString(), ""]} />
                <Bar dataKey="houses" fill="#4d7fb5" name="Houses" stackId="a" />
                <Bar dataKey="other"  fill="#6b8aa0" name="Other"  stackId="a" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <div className="chart-title">Social + Affordable Completions — {s.state_full}</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={recentCompletions} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                  formatter={(v: unknown) => [(v as number).toLocaleString(), ""]} />
                <Bar dataKey="social"      fill="#5aad8a" name="Social"      stackId="a" />
                <Bar dataKey="affordable"  fill="#f6c90e" name="Affordable"  stackId="a" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <DualAnalysis
          title="Two Ways to Measure Supply"
          left={{
            label: "Building Approvals · What Governments Report",
            color: "#4d7fb5",
            content: <>
              Approvals are planning permissions — the headline number in budget announcements.{" "}
              <strong style={{ color: "#fff" }}>Approvals are not completions.</strong>{" "}
              They lapse, stall, or serve the private market entirely.
              In {s.state_full}, only <strong style={{ color: "#5aad8a" }}>{s.accessible_pct_of_approvals}%</strong>{" "}
              of approved dwellings are social or affordable.
              <br /><br />
              <strong style={{ color: "#4d7fb5" }}>{s.latest_approvals_total.toLocaleString()} approvals/year</strong>
            </>
          }}
          right={{
            label: "Social + Affordable Completions · What Gets Delivered",
            color: "#5aad8a",
            content: <>
              Completions are the only supply that directly reduces waitlist pressure.
              The gap between total approvals and social completions reveals how little of the pipeline serves housing need.
              This is the number CHPs should lead with in advocacy.
              <br /><br />
              <strong style={{ color: "#5aad8a" }}>{s.latest_social_completions.toLocaleString()} social</strong>{" "}
              + <strong style={{ color: "#f6c90e" }}>{s.latest_affordable_completions.toLocaleString()} affordable</strong> per year
            </>
          }}
          footer={<>
            KPI cards use <strong style={{ color: "#fff" }}>completions only</strong> — the only number that actually reduces the queue.
            Approvals are shown for pipeline context.
          </>}
        />

        {/* Who is waiting */}
        <div className="section-label" style={{ marginTop: 32, marginBottom: 8 }}>Who Is on the Waitlist?</div>
        <p style={{ fontSize: "0.88rem", color: "#94a3b8", marginBottom: 16, lineHeight: 1.6 }}>
          Household type and size trends define what needs to be built — and why the private market consistently misses the mark.
        </p>

        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="chart-container">
            <div className="chart-title">Waitlist Demographics — {s.state_full} ({s.demographics.year})</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={demoData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="label" tick={{ fill: "#ccc", fontSize: 12 }} tickLine={false} width={155} />
                <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                  formatter={(v: unknown) => [`${v}%`, ""]} />
                <Bar dataKey="pct" fill="#f6c90e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <Analysis>
              In {s.state_full},{" "}
              <strong style={{ color: "#fff" }}>{(demoData[0]?.pct ?? 0) + (demoData[1]?.pct ?? 0)}% of waitlist applicants are singles or single-parent families</strong>{" "}
              — groups who need <strong style={{ color: "#f6c90e" }}>studios, 1- and 2-bedroom dwellings</strong> close to services.
              Yet the approvals pipeline is <strong style={{ color: "#fff" }}>{s.houses_pct_of_approvals}% detached houses</strong> — 3–4 bedrooms in outer suburbs.
              The market builds what it can sell, not what the waitlist needs.
            </Analysis>
          </div>

          <div className="chart-container">
            <div className="chart-title">Household Size Trend — {s.state_full} (Census)</div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={s.household_size_trend} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} />
                <YAxis domain={[2.2, 2.9]} tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                  formatter={(v: unknown) => [`${v} persons`, "avg household"]} />
                <Line type="monotone" dataKey="avg" stroke="#4d7fb5" strokeWidth={2.5}
                  dot={{ r: 5, fill: "#4d7fb5", stroke: "#0b1220", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
            <Analysis>
              A declining average household size is a hidden demand driver —{" "}
              <strong style={{ color: "#fff" }}>each 0.1 person fall means the same population needs more dwellings</strong>,
              even with zero population growth.
              In {s.state_full} this trend has continued since 2001, driven by ageing, relationship breakdown, and younger household formation.
              Fewer people per household means more 1- and 2-bedroom dwellings are needed, not fewer.
            </Analysis>
          </div>
        </div>

        <hr style={divider} />

        {/* ═══════════════════════════════════════════════════════
            PART 6 — POLICY LEVERS
        ═══════════════════════════════════════════════════════ */}
        </>)}
        <PartTitle id="policy" part="Part 6">Policy Levers</PartTitle>
        <p style={{ fontSize: "0.88rem", color: "#94a3b8", marginBottom: 20, lineHeight: 1.6 }}>
          The evidence from population trends, waitlist data, and delivery gaps converges on clear advocacy positions for the housing sector.
        </p>

        <div className="grid-2" style={{ marginBottom: 24 }}>
          {POLICY_ADVOCACY.map((p) => (
            <div key={p.category} className="hive-card">
              <div style={{ fontWeight: 700, color: "#f6c90e", marginBottom: 8, fontSize: "0.88rem" }}>{p.category}</div>
              <div style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.6, marginBottom: 10 }}>{p.position}</div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", lineHeight: 1.6, borderTop: "1px solid #1e2d40", paddingTop: 8 }}>
                <span style={{ color: "#94a3b8", textTransform: "uppercase" as const, letterSpacing: 1, fontSize: "0.78rem" }}>Evidence: </span>
                {p.evidence}
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: "0.75rem", color: "#94a3b8", lineHeight: 1.8, borderTop: "1px solid #1f2937", paddingTop: 16 }}>
          <strong style={{ color: "#94a3b8" }}>Sources:</strong>{" "}
          ABS Cat. 3101.0 (population history) · ABS Cat. 3412.0 (migration) · ABS Cat. 3222.0 (projections, Series B) ·
          State housing registers (annual) · ABS Building Approvals Cat. 8731.0 · ABS Census household size 2001–2021 ·
          AHURI — Estimating Australia&apos;s core housing need (2023) · NHSAC — State of the Housing System 2024 ·
          PropTrack Rental Report Q4 2024. Updated May 2026.
        </div>

      </div>
    </div>
  )
}
