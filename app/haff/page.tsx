"use client"
import { useState } from "react"
import { HAFF_OVERVIEW, HAFF_ROUNDS, getHaffSummary, getStateTotals } from "@/lib/data/haff"
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts"

const TABS = ["Overview", "Round 1", "Round 2", "Round 3", "All Rounds"]
const ROUND_COLORS = { "Round 1": "#3498db", "Round 2": "#27ae60", "Round 3": "#f39c12" }

const STATUS_COLORS: Record<string, string> = {
  complete: "#27ae60",
  "on track": "#3498db",
  underway: "#f39c12",
  projected: "#666",
}

const PIE_COLORS = ["#f6c90e", "#3498db", "#27ae60", "#e74c3c", "#9b59b6", "#1abc9c", "#f39c12"]

function RoundPanel({ roundName }: { roundName: string }) {
  const r = HAFF_ROUNDS[roundName]
  if (!r) return null

  return (
    <div>
      {/* Round context */}
      <div className="callout-gold" style={{ marginBottom: 20, fontSize: "0.85rem", color: "#ccc", lineHeight: 1.7 }}>
        <strong style={{ color: "#f6c90e" }}>{roundName} — {r.announced}</strong><br />
        {r.notes}
      </div>

      {/* KPIs */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: "Total Homes", value: r.total_homes.toLocaleString(), color: "#f6c90e" },
          { label: "Social Homes", value: r.social_homes.toLocaleString(), color: "#27ae60" },
          { label: "Affordable Homes", value: r.affordable_homes.toLocaleString(), color: "#3498db" },
          { label: "Grant Funding", value: `$${r.grants_total_m.toFixed(0)}M`, color: "#fff" },
        ].map(({ label, value, color }) => (
          <div key={label} className="kpi-card">
            <div className="kpi-label">{label}</div>
            <div className="kpi-value" style={{ fontSize: "1.6rem", color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* 2x2 chart grid */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* By state */}
        <div className="chart-container">
          <div className="chart-title">By State — Homes</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={r.by_state} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 10 }}>
              <CartesianGrid stroke="#2a2a4e" strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fill: "#666", fontSize: 9 }} tickLine={false} />
              <YAxis type="category" dataKey="state" tick={{ fill: "#ccc", fontSize: 10 }} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 8, fontSize: 11 }} formatter={(v: unknown) => [(v as number).toLocaleString(), ""]} />
              <Bar dataKey="social" fill="#27ae60" name="Social" stackId="a" />
              <Bar dataKey="affordable" fill="#3498db" name="Affordable" stackId="a" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* By sector pie */}
        <div className="chart-container">
          <div className="chart-title">By Sector</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={r.by_sector} cx="50%" cy="50%" outerRadius={80} dataKey="homes" nameKey="sector">
                {r.by_sector.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 8, fontSize: 11 }} formatter={(v: unknown, n: unknown) => [(v as number).toLocaleString(), n as string]} />
              <Legend wrapperStyle={{ fontSize: 10, color: "#888" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bedroom mix */}
        <div className="chart-container">
          <div className="chart-title">Bedroom Mix</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={r.by_bedrooms} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="#2a2a4e" strokeDasharray="3 3" />
              <XAxis dataKey="bedrooms" tick={{ fill: "#666", fontSize: 9 }} tickLine={false} />
              <YAxis tick={{ fill: "#666", fontSize: 9 }} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 8, fontSize: 11 }} formatter={(v: unknown) => [(v as number).toLocaleString(), ""]} />
              <Bar dataKey="homes" fill="#f6c90e" radius={[3, 3, 0, 0]}>
                {r.by_bedrooms.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Dwelling type */}
        <div className="chart-container">
          <div className="chart-title">Dwelling Types</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={r.by_dwelling_type} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="homes" nameKey="type" paddingAngle={2}>
                {r.by_dwelling_type.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 8, fontSize: 11 }} formatter={(v: unknown) => [(v as number).toLocaleString(), ""]} />
              <Legend wrapperStyle={{ fontSize: 10, color: "#888" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Delivery pipeline */}
      <div className="hive-card">
        <div className="section-label">Delivery Pipeline</div>
        <div style={{ display: "flex", gap: 0, alignItems: "flex-start", flexWrap: "wrap" }}>
          {r.delivery_pipeline.map((m, i) => (
            <div key={m.milestone} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ textAlign: "center", minWidth: 140 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", margin: "0 auto 8px",
                  background: STATUS_COLORS[m.status] ?? "#666",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.8rem", fontWeight: 700, color: "#fff"
                }}>{i + 1}</div>
                <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#ccc", marginBottom: 2 }}>{m.milestone}</div>
                <div style={{ fontSize: "0.68rem", color: "#666" }}>{m.date}</div>
                <div><span className="badge" style={{ background: `${STATUS_COLORS[m.status] ?? "#666"}22`, color: STATUS_COLORS[m.status] ?? "#666", border: `1px solid ${STATUS_COLORS[m.status] ?? "#666"}44`, fontSize: "0.6rem", marginTop: 4 }}>{m.status}</span></div>
              </div>
              {i < r.delivery_pipeline.length - 1 && (
                <div style={{ width: 32, height: 2, background: "#2a2a4e", marginBottom: 24 }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HaffPage() {
  const [activeTab, setActiveTab] = useState("Overview")
  const summary = getHaffSummary()
  const stateTotals = getStateTotals()

  const pct = Math.min(100, summary.pct_of_5yr_target)

  return (
    <div style={{ background: "#0f0f1a", minHeight: "100vh" }}>
      <div className="page-container">

        <div className="page-header">
          <h1 className="page-title">Housing Australia Future Fund (HAFF)</h1>
          <p className="page-subtitle">
            The {HAFF_OVERVIEW.fund_size_bn}B off-budget fund delivering social and affordable housing through community housing providers. {HAFF_OVERVIEW.target_period} target: {HAFF_OVERVIEW.five_year_target_homes.toLocaleString()} homes.
          </p>
        </div>

        {/* Overview KPIs */}
        <div className="grid-4" style={{ marginBottom: 20 }}>
          <div className="kpi-card" style={{ borderTop: "3px solid #f6c90e" }}>
            <div className="kpi-label">Fund Size</div>
            <div className="kpi-value" style={{ color: "#f6c90e" }}>${HAFF_OVERVIEW.fund_size_bn}B</div>
            <div className="kpi-delta">Off-budget · returns fund grants</div>
          </div>
          <div className="kpi-card" style={{ borderTop: "3px solid #27ae60" }}>
            <div className="kpi-label">Homes Announced</div>
            <div className="kpi-value" style={{ color: "#27ae60" }}>{summary.total_homes.toLocaleString()}</div>
            <div className="kpi-delta">{summary.total_social.toLocaleString()} social · {summary.total_affordable.toLocaleString()} affordable</div>
          </div>
          <div className="kpi-card" style={{ borderTop: "3px solid #3498db" }}>
            <div className="kpi-label">% of 5-Year Target</div>
            <div className="kpi-value" style={{ color: "#3498db" }}>{summary.pct_of_5yr_target}%</div>
            <div className="kpi-delta">of {HAFF_OVERVIEW.five_year_target_homes.toLocaleString()} home target</div>
          </div>
          <div className="kpi-card" style={{ borderTop: "3px solid #9b59b6" }}>
            <div className="kpi-label">Total Projects</div>
            <div className="kpi-value">{summary.total_projects.toLocaleString()}</div>
            <div className="kpi-delta">Across 3 rounds, all states</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="hive-card" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.82rem", color: "#aaa" }}>
            <span>Progress: {summary.total_homes.toLocaleString()} homes announced</span>
            <span>Target: {HAFF_OVERVIEW.five_year_target_homes.toLocaleString()} homes by {HAFF_OVERVIEW.target_period}</span>
          </div>
          <div className="progress-bar" style={{ height: 16 }}>
            <div className="progress-fill" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #27ae60, #f6c90e)" }} />
          </div>
          <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#666" }}>
            <span style={{ color: "#f6c90e", fontWeight: 600 }}>{pct}% of 5-year target</span>
            <span>Remaining: {summary.remaining_to_target.toLocaleString()} homes</span>
          </div>
        </div>

        {/* Tab navigation */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`tab-pill ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "Overview" && (
          <div>
            <div className="hive-card" style={{ marginBottom: 20 }}>
              <div className="section-label">Fund Overview</div>
              <div className="grid-2">
                <div>
                  {[
                    ["Administrator", HAFF_OVERVIEW.administrator],
                    ["Established", HAFF_OVERVIEW.established],
                    ["Legislation", HAFF_OVERVIEW.legislation],
                    ["Structure", HAFF_OVERVIEW.structure],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", gap: 12, marginBottom: 10, fontSize: "0.82rem" }}>
                      <span style={{ color: "#666", minWidth: 100, textTransform: "uppercase", letterSpacing: 1, fontSize: "0.68rem" }}>{k}</span>
                      <span style={{ color: "#ccc" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div>
                  {[
                    ["5-Year Target", `${HAFF_OVERVIEW.five_year_target_homes.toLocaleString()} homes (${HAFF_OVERVIEW.social_target.toLocaleString()} social, ${HAFF_OVERVIEW.affordable_target.toLocaleString()} affordable)`],
                    ["Committed to Date", `$${HAFF_OVERVIEW.total_committed_to_date_m.toLocaleString()}M`],
                    ["Homes Announced", HAFF_OVERVIEW.total_homes_announced.toLocaleString()],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", gap: 12, marginBottom: 10, fontSize: "0.82rem" }}>
                      <span style={{ color: "#666", minWidth: 140, textTransform: "uppercase", letterSpacing: 1, fontSize: "0.68rem" }}>{k}</span>
                      <span style={{ color: "#f6c90e", fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeTab === "Round 1" || activeTab === "Round 2" || activeTab === "Round 3") && (
          <RoundPanel roundName={activeTab} />
        )}

        {activeTab === "All Rounds" && (
          <div>
            {/* State totals chart */}
            <div className="chart-container" style={{ marginBottom: 24 }}>
              <div className="chart-title">Total Homes by State — All 3 Rounds</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stateTotals} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 10 }}>
                  <CartesianGrid stroke="#2a2a4e" strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fill: "#666", fontSize: 10 }} tickLine={false} />
                  <YAxis type="category" dataKey="state" tick={{ fill: "#ccc", fontSize: 11 }} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 8, fontSize: 12 }} formatter={(v: unknown) => [(v as number).toLocaleString(), ""]} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#888" }} />
                  <Bar dataKey="social" fill="#27ae60" name="Social" stackId="a" />
                  <Bar dataKey="affordable" fill="#3498db" name="Affordable" stackId="a" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Summary table */}
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
                      <td style={{ color: "#27ae60" }}>{s.social.toLocaleString()}</td>
                      <td style={{ color: "#3498db" }}>{s.affordable.toLocaleString()}</td>
                      <td>${s.grant_m.toFixed(1)}M</td>
                    </tr>
                  ))}
                  <tr style={{ fontWeight: 700, borderTop: "2px solid #2a2a4e" }}>
                    <td style={{ color: "#fff" }}>TOTAL</td>
                    <td>{stateTotals.reduce((s, r) => s + r.projects, 0)}</td>
                    <td style={{ color: "#f6c90e" }}>{stateTotals.reduce((s, r) => s + r.homes, 0).toLocaleString()}</td>
                    <td style={{ color: "#27ae60" }}>{stateTotals.reduce((s, r) => s + r.social, 0).toLocaleString()}</td>
                    <td style={{ color: "#3498db" }}>{stateTotals.reduce((s, r) => s + r.affordable, 0).toLocaleString()}</td>
                    <td>${stateTotals.reduce((s, r) => s + r.grant_m, 0).toFixed(1)}M</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
