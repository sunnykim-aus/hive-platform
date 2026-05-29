"use client"
import {
  COST_INDEX, GLOBAL_EVENTS, COST_PER_DWELLING, BILLION_DOLLAR_YIELD,
  STOCK_CONDITION, STATE_CONDITION, GOVERNMENT_RESPONSES, getCostImpactSummary
} from "@/lib/data/construction"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea
} from "recharts"

export default function ConditionsPage() {
  const impact = getCostImpactSummary()

  // Cost index chart data
  const costData = COST_INDEX.map((d) => ({
    period: `${d.year} Q${d.q}`,
    index: d.index,
    hasLabel: !!d.label,
  }))

  return (
    <div style={{ background: "#0f0f1a", minHeight: "100vh" }}>
      <div className="page-container">

        <div className="page-header">
          <h1 className="page-title">Housing Conditions &amp; Construction Costs</h1>
          <p className="page-subtitle">
            Two forces squeezing public housing: existing stock is ageing and deteriorating, while global events since 2019 have made building new stock dramatically more expensive.
          </p>
        </div>

        {/* KPI row */}
        <div className="grid-4" style={{ marginBottom: 28 }}>
          <div className="kpi-card">
            <div className="kpi-label">Cost Rise Since 2019</div>
            <div className="kpi-value" style={{ color: "#e74c3c" }}>+{impact.cost_rise_pct}%</div>
            <div className="kpi-delta">ABS PPI House Construction</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Avg Social Home — 2019</div>
            <div className="kpi-value" style={{ fontSize: "1.5rem", color: "#27ae60" }}>${(impact.avg_cost_2019 / 1000).toFixed(0)}k</div>
            <div className="kpi-delta">Pre-COVID baseline</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Avg Social Home — 2025</div>
            <div className="kpi-value" style={{ fontSize: "1.5rem", color: "#e74c3c" }}>${(impact.avg_cost_2025 / 1000).toFixed(0)}k</div>
            <div className="kpi-delta">+${(impact.cost_increase_abs / 1000).toFixed(0)}k per dwelling</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Maintenance Backlog</div>
            <div className="kpi-value" style={{ color: "#e74c3c" }}>${impact.maintenance_backlog_bn}B</div>
            <div className="kpi-delta">{impact.pct_stock_major_repair}% of stock needs major repair</div>
          </div>
        </div>

        {/* Construction cost chart */}
        <div className="chart-container" style={{ marginBottom: 24 }}>
          <div className="chart-title">Construction Cost Index — 2019 to 2025 (Q4 2019 = 100)</div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={costData} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid stroke="#2a2a4e" strokeDasharray="3 3" />
              <XAxis dataKey="period" tick={{ fill: "#666", fontSize: 9 }} tickLine={false} angle={-45} textAnchor="end" interval={3} />
              <YAxis domain={[95, 165]} tick={{ fill: "#666", fontSize: 10 }} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 8, fontSize: 12 }}
                formatter={(v: unknown) => [`${(v as number).toFixed(1)}`, "Index"]}
              />
              {/* Shaded regions for key periods */}
              <ReferenceArea x1="2020 Q1" x2="2021 Q4" fill="rgba(231,76,60,0.08)" label={{ value: "COVID", position: "insideTopLeft", fill: "#e74c3c", fontSize: 9 }} />
              <ReferenceArea x1="2022 Q1" x2="2022 Q4" fill="rgba(246,201,14,0.06)" label={{ value: "Ukraine + Rate hikes", position: "insideTopLeft", fill: "#f6c90e", fontSize: 9 }} />
              <ReferenceLine y={100} stroke="#555" strokeDasharray="4 2" label={{ value: "2019 baseline (100)", fill: "#555", fontSize: 9, position: "right" }} />
              <Line
                type="monotone"
                dataKey="index"
                stroke="#f6c90e"
                strokeWidth={2.5}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                dot={(props: any) =>
                  props.payload?.hasLabel
                    ? <circle key={`dot-${props.cx}`} cx={props.cx ?? 0} cy={props.cy ?? 0} r={5} fill="#e74c3c" stroke="#0f0f1a" strokeWidth={2} />
                    : <g key={`dot-empty-${props.cx}`} />
                }
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Global events */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-label">Global Events Driving the Cost Rise</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {GLOBAL_EVENTS.map((ev) => (
              <div key={ev.event} className="hive-card" style={{ borderLeft: `4px solid ${ev.color}`, padding: "14px 18px" }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ fontSize: "1.4rem", flexShrink: 0, marginTop: 2 }}>{ev.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, color: "#fff", fontSize: "0.88rem" }}>{ev.event}</span>
                      <span className="badge" style={{ background: `${ev.color}22`, color: ev.color, border: `1px solid ${ev.color}44`, fontSize: "0.65rem" }}>{ev.date}</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#aaa", lineHeight: 1.7, marginBottom: 4 }}>{ev.impact}</div>
                    <div style={{ fontSize: "0.78rem", color: "#f6c90e", fontWeight: 600 }}>Cost impact: {ev.cost_impact}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What $1B buys */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-label">What $1 Billion Buys — 2019 vs 2025</div>
          <div className="grid-3">
            <div className="hive-card" style={{ textAlign: "center" }}>
              <div className="kpi-label">$1B in 2019</div>
              <div style={{ fontSize: "3rem", fontWeight: 900, color: "#27ae60", lineHeight: 1 }}>{BILLION_DOLLAR_YIELD[2019].toLocaleString()}</div>
              <div style={{ fontSize: "0.82rem", color: "#aaa", marginTop: 6 }}>social homes</div>
              <div style={{ fontSize: "0.75rem", color: "#666", marginTop: 4 }}>Avg. $310,000 per dwelling</div>
            </div>
            <div className="hive-card" style={{ textAlign: "center" }}>
              <div className="kpi-label">$1B in 2025</div>
              <div style={{ fontSize: "3rem", fontWeight: 900, color: "#e74c3c", lineHeight: 1 }}>{BILLION_DOLLAR_YIELD[2025].toLocaleString()}</div>
              <div style={{ fontSize: "0.82rem", color: "#aaa", marginTop: 6 }}>social homes</div>
              <div style={{ fontSize: "0.75rem", color: "#666", marginTop: 4 }}>Avg. $560,000 per dwelling</div>
            </div>
            <div className="hive-card" style={{ textAlign: "center", background: "linear-gradient(135deg, #1a1a2e, #2a1a1a)" }}>
              <div className="kpi-label">Homes lost per $1B</div>
              <div style={{ fontSize: "3rem", fontWeight: 900, color: "#e74c3c", lineHeight: 1 }}>
                -{(BILLION_DOLLAR_YIELD[2019] - BILLION_DOLLAR_YIELD[2025]).toLocaleString()}
              </div>
              <div style={{ fontSize: "0.82rem", color: "#aaa", marginTop: 6 }}>social homes not built</div>
              <div style={{ fontSize: "0.75rem", color: "#666", marginTop: 4 }}>Due to cost escalation alone</div>
            </div>
          </div>
        </div>

        {/* Flow-on effects */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-label">Flow-on Effects — Property Market &amp; Rental Crisis</div>
          <div className="grid-3">
            <div className="hive-card">
              <div style={{ fontSize: "0.75rem", color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Private Rental Market</div>
              <div style={{ fontSize: "2.4rem", fontWeight: 900, color: "#e74c3c", lineHeight: 1, marginBottom: 6 }}>+32%</div>
              <div style={{ fontSize: "0.72rem", color: "#aaa", letterSpacing: 0.5, marginBottom: 10 }}>MEDIAN RENT RISE 2020–2025</div>
              <div style={{ fontSize: "0.78rem", color: "#888", lineHeight: 1.6 }}>Construction cost inflation fed directly into new build costs, lifting the price floor for developers. Vacancy rates fell to historic lows — 1.0–1.2% nationally in 2023.</div>
            </div>
            <div className="hive-card">
              <div style={{ fontSize: "0.75rem", color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Owner-Occupied Market</div>
              <div style={{ fontSize: "2.4rem", fontWeight: 900, color: "#e74c3c", lineHeight: 1, marginBottom: 6 }}>+58%</div>
              <div style={{ fontSize: "0.72rem", color: "#aaa", letterSpacing: 0.5, marginBottom: 10 }}>NEW BUILD COST RISE SINCE 2019</div>
              <div style={{ fontSize: "0.78rem", color: "#888", lineHeight: 1.6 }}>New home builds are now $250,000–$280,000 more expensive than 2019. With 13 RBA rate hikes, mortgage serviceability dropped sharply — more buyers pushed into rentals.</div>
            </div>
            <div className="hive-card" style={{ borderColor: "#e74c3c44" }}>
              <div style={{ fontSize: "0.75rem", color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Public Sector Capacity</div>
              <div style={{ fontSize: "2.4rem", fontWeight: 900, color: "#e74c3c", lineHeight: 1, marginBottom: 6 }}>−44%</div>
              <div style={{ fontSize: "0.72rem", color: "#aaa", letterSpacing: 0.5, marginBottom: 10 }}>HOMES PER $1B VS 2019</div>
              <div style={{ fontSize: "0.78rem", color: "#888", lineHeight: 1.6 }}>Government programs announced in 2022–23 at 2022 cost assumptions now face significant funding gaps. HAFF grants cover only 70–85% of current build costs.</div>
            </div>
          </div>
        </div>

        {/* Stock condition */}
        <div style={{ marginBottom: 28 }}>
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
              <div className="kpi-value" style={{ color: "#e74c3c" }}>${STOCK_CONDITION.estimated_maintenance_backlog_bn}B</div>
              <div className="kpi-delta">At current spend: {STOCK_CONDITION.years_to_clear_backlog_at_current_rate} yrs to clear</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Net Stock Loss / Year</div>
              <div className="kpi-value" style={{ color: "#e74c3c" }}>-{STOCK_CONDITION.net_stock_loss_per_year}</div>
              <div className="kpi-delta">Demolitions outpace replacements</div>
            </div>
          </div>

          {/* State breakdown */}
          <div className="grid-2">
            {Object.entries(STATE_CONDITION).map(([state, cond]) => (
              <div key={state} className="hive-card">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, color: "#fff", fontSize: "0.88rem" }}>{state}</span>
                  <span style={{ fontSize: "0.78rem", color: "#888" }}>{cond.dwellings.toLocaleString()} dwellings · avg {cond.avg_age} yrs</span>
                </div>
                <div style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: "0.72rem", color: "#666", marginBottom: 4 }}>Backlog: <span style={{ color: "#e74c3c", fontWeight: 600 }}>${(cond.backlog_m / 1000).toFixed(1)}B</span></div>
                  <div className="progress-bar" style={{ height: 6 }}>
                    <div className="progress-fill" style={{ width: `${Math.min(100, cond.backlog_m / 80)}%`, background: "#e74c3c" }} />
                  </div>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#888", lineHeight: 1.5 }}>{cond.program}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Government responses */}
        <div style={{ marginBottom: 24 }}>
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
                  <td style={{ color: "#f6c90e", fontWeight: 600 }}>${(r.amount_m / 1000).toFixed(1)}B</td>
                  <td style={{ color: "#888", fontSize: "0.78rem" }}>{r.type}</td>
                  <td><span className="badge" style={{ background: `${r.color}22`, color: r.color, border: `1px solid ${r.color}44`, fontSize: "0.65rem" }}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
