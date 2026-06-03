"use client"
import {
  HISTORICAL_NATIONAL, HISTORICAL_NOM_DETAIL, MIGRATION_PHASES, NATIONAL_PROJECTIONS,
  STATE_PROJECTIONS, POLICY_ADVOCACY, ACCORD_TARGET, CURRENT_ANNUAL_APPROVALS,
  HISTORICAL_STATE_POP
} from "@/lib/data/population"
import {
  ComposedChart, AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from "recharts"

export default function PopulationPage() {
  const first = HISTORICAL_NATIONAL[0]
  const last = HISTORICAL_NATIONAL[HISTORICAL_NATIONAL.length - 1]
  const totalGrowth = (last.population_m - first.population_m).toFixed(2)
  const peak = HISTORICAL_NOM_DETAIL.reduce((a, b) => a.total_k > b.total_k ? a : b)
  const trough = HISTORICAL_NOM_DETAIL.reduce((a, b) => a.total_k < b.total_k ? a : b)

  // Dual-axis ComposedChart: stacked bars (natural increase + NOM) + population line
  const histData = HISTORICAL_NATIONAL.map((d) => ({
    year: d.year,
    population: d.population_m,
    natural: Math.round(d.natural_increase * 1000),
    nim: Math.round(d.nim * 1000),
  }))

  // NOM detail stacked bar — Streamlit colors: blue, green, orange, purple
  const nomData = HISTORICAL_NOM_DETAIL.map((d) => ({
    year: d.year,
    skilled: d.skilled_k,
    family: d.family_k,
    student: d.student_k,
    other: d.other_k,
  }))

  // State population lines with dots
  const stateYears = HISTORICAL_STATE_POP.NSW.map((d) => d.year)
  const stateChartData = stateYears.map((yr) => {
    const row: Record<string, number | string> = { year: yr }
    for (const [state, data] of Object.entries(HISTORICAL_STATE_POP)) {
      const found = data.find((d) => d.year === yr)
      if (found) row[state] = found.pop_m
    }
    return row
  })

  const stateColors: Record<string, string> = {
    NSW: "#4d7fb5",
    VIC: "#c0614a",
    QLD: "#c49a3a",
    WA:  "#5aad8a",
    SA:  "#b97cff",
  }

  return (
    <div style={{ background: "#0b1220", minHeight: "100vh" }}>
      <div className="page-container">

        <div className="page-header">
          <h1 className="page-title">Population &amp; Supply Gap</h1>
          <p className="page-subtitle">
            Ten years of actual population history, the COVID migration shock and its housing impact, evidence-based projections to 2044, and the policy positions the sector needs to advocate.
          </p>
          <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: 8 }}>
            Sources: ABS Cat. 3101.0 (historical), ABS Cat. 3412.0 (migration), ABS Cat. 3222.0 (projections, Series B), SQM Research, CoreLogic
          </div>
        </div>

        {/* Historical KPIs */}
        <div style={{ marginBottom: 8 }}>
          <div className="section-label">Ten Years of Population Growth — What Actually Happened</div>
        </div>
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
            <div className="kpi-delta">Net outflow — first time since 1946</div>
          </div>
        </div>

        {/* ── Dual-axis: population line + stacked bars ── */}
        <div className="chart-container" style={{ marginBottom: 24 }}>
          <div className="chart-title">National Population &amp; Net Overseas Migration — 2015 to 2024</div>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: 12 }}>
            ABS Cat. 3101.0 &amp; 3412.0 — annual June-year figures
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={histData} margin={{ top: 10, right: 60, bottom: 0, left: 55 }}>
              <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 13 }} tickLine={false} />
              {/* Left Y: Population (M) */}
              <YAxis
                yAxisId="pop"
                domain={[23, 28]}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickLine={false}
                tickFormatter={(v) => `${v}M`}
                label={{ value: "Population (M)", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 13, dx: -28 }}
              />
              {/* Right Y: Annual arrivals (000s) */}
              <YAxis
                yAxisId="nom"
                orientation="right"
                domain={[-150, 700]}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickLine={false}
                tickFormatter={(v) => `${v}k`}
                label={{ value: "Annual arrivals", angle: 90, position: "insideRight", fill: "#94a3b8", fontSize: 13, dx: 28 }}
              />
              <Tooltip
                contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                formatter={(v: unknown) => [`${v}`, ""]}
              />
              <Legend wrapperStyle={{ fontSize: 13, color: "#94a3b8", paddingTop: 8 }} />
              {/* Stacked bars on right axis */}
              <Bar yAxisId="nom" dataKey="natural" name="Natural increase" stackId="a" fill="#5aad8a" opacity={0.85} />
              <Bar yAxisId="nom" dataKey="nim" name="Net overseas migration" stackId="a" fill="#4d7fb5" opacity={0.85} radius={[2, 2, 0, 0]} />
              {/* Population line on left axis */}
              <Line
                yAxisId="pop"
                type="monotone"
                dataKey="population"
                name="National population"
                stroke="#f6c90e"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#f6c90e", stroke: "#0b1220", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Migration phases */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-label">Four Phases of Migration — and What Each Did to Housing</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MIGRATION_PHASES.map((phase) => (
              <div key={phase.label} className="hive-card" style={{ borderLeft: `4px solid ${phase.color}` }}>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 300px" }}>
                    <div style={{ fontWeight: 700, color: "#fff", marginBottom: 4, fontSize: "0.9rem" }}>
                      {phase.label} <span style={{ color: "#94a3b8", fontWeight: 400 }}>— {phase.years} · avg {phase.avg_nim_k.toLocaleString()}k/yr</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.7 }}>{phase.narrative}</div>
                  </div>
                  <div style={{ flex: "0 0 280px", background: "#0b1220", borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: 1, color: "#94a3b8", marginBottom: 6 }}>Housing market impact</div>
                    <div style={{ fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.6 }}>{phase.housing}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── State population lines with dots ── */}
        <div className="chart-container" style={{ marginBottom: 24 }}>
          <div className="chart-title">State Population Growth — 2015 to 2024 (M)</div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stateChartData} margin={{ top: 10, right: 20, bottom: 0, left: 55 }}>
              <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 13 }} tickLine={false} />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickLine={false}
                tickFormatter={(v) => `${v}M`}
                label={{ value: "Population (M)", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 13, dx: -28 }}
              />
              <Tooltip
                contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                formatter={(v: unknown) => [`${v}M`, ""]}
              />
              <Legend wrapperStyle={{ fontSize: 13, color: "#94a3b8" }} />
              {Object.entries(stateColors).map(([st, color]) => (
                <Line
                  key={st}
                  type="monotone"
                  dataKey={st}
                  stroke={color}
                  strokeWidth={2.2}
                  dot={{ r: 4, fill: color, stroke: "#0b1220", strokeWidth: 1.5 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ── Migration breakdown stacked bars ── */}
        <div className="chart-container" style={{ marginBottom: 24 }}>
          <div className="chart-title">Migration Breakdown by Visa Stream — 2015 to 2024 (000s)</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={nomData} margin={{ top: 10, right: 20, bottom: 0, left: 55 }}>
              <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 13 }} tickLine={false} />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickLine={false}
                tickFormatter={(v) => `${v}k`}
                label={{ value: "People ('000s)", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 13, dx: -28 }}
              />
              <Tooltip
                contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                formatter={(v: unknown) => [`${v}k`, ""]}
              />
              <Legend wrapperStyle={{ fontSize: 13, color: "#94a3b8" }} />
              <ReferenceLine yAxisId={0} y={0} stroke="#444" />
              <Bar dataKey="skilled" name="Skilled migration" stackId="a" fill="#4d7fb5" opacity={0.9} />
              <Bar dataKey="family" name="Family stream" stackId="a" fill="#5aad8a" opacity={0.9} />
              <Bar dataKey="student" name="International students" stackId="a" fill="#f0a30a" opacity={0.9} />
              <Bar dataKey="other" name="Other / humanitarian" stackId="a" fill="#6b8aa0" opacity={0.9} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ABS projections */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-label">ABS Series B Projections to 2044</div>
          <div className="grid-4" style={{ marginBottom: 16 }}>
            {Object.entries(STATE_PROJECTIONS).map(([state, proj]) => (
              <div key={state} className="kpi-card" style={{ borderTop: `3px solid ${proj.color}` }}>
                <div className="kpi-label">{state} — to 2041</div>
                <div className="kpi-value" style={{ fontSize: "1.4rem", color: proj.color }}>{proj.proj_2041_m}M</div>
                <div className="kpi-delta">from {proj.current_pop_m}M today</div>
                <div style={{ marginTop: 8, fontSize: "0.72rem", color: "#94a3b8", lineHeight: 1.5 }}>{proj.growth_drivers.slice(0, 80)}...</div>
              </div>
            ))}
          </div>
        </div>

        {/* Policy advocacy */}
        <div style={{ marginBottom: 24 }}>
          <div className="section-label">Policy Advocacy Positions</div>
          <div className="grid-2">
            {POLICY_ADVOCACY.map((p) => (
              <div key={p.category} className="hive-card">
                <div style={{ fontWeight: 700, color: "#f6c90e", marginBottom: 8, fontSize: "0.88rem" }}>{p.category}</div>
                <div style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.6, marginBottom: 10 }}>{p.position}</div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8", lineHeight: 1.6, borderTop: "1px solid #1e2d40", paddingTop: 8 }}>
                  <span style={{ color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, fontSize: "0.78rem" }}>Evidence: </span>
                  {p.evidence}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
