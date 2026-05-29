"use client"
import {
  HISTORICAL_NATIONAL, HISTORICAL_NOM_DETAIL, MIGRATION_PHASES, NATIONAL_PROJECTIONS,
  STATE_PROJECTIONS, POLICY_ADVOCACY, ACCORD_TARGET, CURRENT_ANNUAL_APPROVALS,
  HISTORICAL_STATE_POP
} from "@/lib/data/population"
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts"

export default function PopulationPage() {
  const first = HISTORICAL_NATIONAL[0]
  const last = HISTORICAL_NATIONAL[HISTORICAL_NATIONAL.length - 1]
  const totalGrowth = (last.population_m - first.population_m).toFixed(2)
  const peak = HISTORICAL_NOM_DETAIL.reduce((a, b) => a.total_k > b.total_k ? a : b)
  const trough = HISTORICAL_NOM_DETAIL.reduce((a, b) => a.total_k < b.total_k ? a : b)

  // Area chart data: population + NOM
  const histData = HISTORICAL_NATIONAL.map((d) => ({
    year: d.year,
    population: d.population_m,
    nim: d.nim * 1000,
    natural: d.natural_increase * 1000,
  }))

  // NOM detail bar chart
  const nomData = HISTORICAL_NOM_DETAIL.map((d) => ({
    year: d.year,
    skilled: d.skilled_k,
    family: d.family_k,
    student: d.student_k,
    other: d.other_k,
  }))

  // State population lines
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
    NSW: "#3498db", VIC: "#e74c3c", QLD: "#f39c12", WA: "#27ae60", SA: "#9b59b6"
  }

  // Projections area chart
  const projData = NATIONAL_PROJECTIONS.map((d) => ({
    year: d.year,
    population: d.population_m,
    required_approvals: ACCORD_TARGET / 1000,
    current_approvals: CURRENT_ANNUAL_APPROVALS / 1000,
  }))

  return (
    <div style={{ background: "#0f0f1a", minHeight: "100vh" }}>
      <div className="page-container">

        <div className="page-header">
          <h1 className="page-title">Population &amp; Supply Gap</h1>
          <p className="page-subtitle">
            Ten years of actual population history, the COVID migration shock and its housing impact, evidence-based projections to 2044, and the policy positions the sector needs to advocate.
          </p>
          <div style={{ fontSize: "0.72rem", color: "#555", marginTop: 8 }}>
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
            <div className="kpi-value" style={{ color: "#e74c3c" }}>{peak.total_k.toLocaleString()}k</div>
            <div className="kpi-delta">Record — 2x pre-COVID average</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">COVID trough (2021)</div>
            <div className="kpi-value" style={{ color: "#e74c3c" }}>{trough.total_k.toLocaleString()}k</div>
            <div className="kpi-delta">Net outflow — first time since 1946</div>
          </div>
        </div>

        {/* National population area chart */}
        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="chart-container">
            <div className="chart-title">National Population (M) — 2015 to 2024</div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={histData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="#2a2a4e" strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fill: "#666", fontSize: 10 }} tickLine={false} />
                <YAxis domain={[23, 28]} tick={{ fill: "#666", fontSize: 10 }} tickLine={false} tickFormatter={(v) => `${v}M`} />
                <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 8, fontSize: 12 }} formatter={(v: unknown, n: unknown) => [((n as string) === "population") ? `${v}M` : (v as number).toLocaleString(), n as string]} />
                <Area type="monotone" dataKey="population" stroke="#f6c90e" fill="rgba(246,201,14,0.1)" strokeWidth={2.5} name="Population (M)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <div className="chart-title">Net Overseas Migration by Visa Class (000s)</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={nomData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="#2a2a4e" strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fill: "#666", fontSize: 10 }} tickLine={false} />
                <YAxis tick={{ fill: "#666", fontSize: 10 }} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 8, fontSize: 12 }} formatter={(v: unknown) => [`${v}k`, ""]} />
                <Legend wrapperStyle={{ fontSize: 10, color: "#888" }} />
                <Bar dataKey="skilled" fill="#27ae60" name="Skilled" stackId="a" />
                <Bar dataKey="family" fill="#3498db" name="Family" stackId="a" />
                <Bar dataKey="student" fill="#f39c12" name="Student" stackId="a" />
                <Bar dataKey="other" fill="#9b59b6" name="Other" stackId="a" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
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
                      {phase.label} <span style={{ color: "#666", fontWeight: 400 }}>— {phase.years} · avg {phase.avg_nim_k.toLocaleString()}k/yr</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#aaa", lineHeight: 1.7 }}>{phase.narrative}</div>
                  </div>
                  <div style={{ flex: "0 0 280px", background: "#0f0f1a", borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: 1, color: "#555", marginBottom: 6 }}>Housing market impact</div>
                    <div style={{ fontSize: "0.78rem", color: "#999", lineHeight: 1.6 }}>{phase.housing}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* State population */}
        <div className="chart-container" style={{ marginBottom: 24 }}>
          <div className="chart-title">State Population Growth — 2015 to 2024 (M)</div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={stateChartData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="#2a2a4e" strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: "#666", fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fill: "#666", fontSize: 10 }} tickLine={false} tickFormatter={(v) => `${v}M`} />
              <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 8, fontSize: 12 }} formatter={(v: unknown) => [`${v}M`, ""]} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#888" }} />
              {Object.keys(stateColors).map((st) => (
                <Line key={st} type="monotone" dataKey={st} stroke={stateColors[st]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
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
                <div style={{ marginTop: 8, fontSize: "0.72rem", color: "#666", lineHeight: 1.5 }}>{proj.growth_drivers.slice(0, 80)}...</div>
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
                <div style={{ fontSize: "0.8rem", color: "#ccc", lineHeight: 1.6, marginBottom: 10 }}>{p.position}</div>
                <div style={{ fontSize: "0.75rem", color: "#888", lineHeight: 1.6, borderTop: "1px solid #2a2a4e", paddingTop: 8 }}>
                  <span style={{ color: "#555", textTransform: "uppercase", letterSpacing: 1, fontSize: "0.65rem" }}>Evidence: </span>
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
