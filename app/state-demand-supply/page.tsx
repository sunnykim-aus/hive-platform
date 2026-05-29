"use client"
import { useState } from "react"
import { getStateSummary, getAllStatesLatest, STATE_INFO } from "@/lib/data/state-analysis"
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts"

const STATE_COLORS: Record<string, string> = {
  NSW: "#3498db", VIC: "#e74c3c", QLD: "#f39c12", WA: "#27ae60", SA: "#9b59b6"
}

const STATES = ["WA", "NSW", "VIC", "QLD", "SA"]

export default function StateDemandSupplyPage() {
  const [selectedState, setSelectedState] = useState("WA")
  const s = getStateSummary(selectedState)
  const allStates = getAllStatesLatest()

  // Donut data: accessible vs private
  const donutData = [
    { name: "Accessible (social + affordable)", value: s.accessible_pct_of_approvals },
    { name: "Private market supply", value: 100 - s.accessible_pct_of_approvals },
  ]

  // Recent approvals for bar chart (last 8 years)
  const recentApprovals = s.approvals_by_type.slice(-8)

  // Recent completions for delivery chart
  const recentCompletions = s.social_housing_completions.slice(-8)

  // Waitlist trend for line chart
  const waitlistTrend = s.waitlist_trend.filter((_, i) => i % 2 === 0) // every other year for clarity

  // Demographic data
  const demoData = s.demographics.types ?? []

  // All-states comparison
  const stateComparison = allStates.sort((a, b) => b.waitlist - a.waitlist)

  return (
    <div style={{ background: "#0f0f1a", minHeight: "100vh" }}>
      <div className="page-container">

        <div className="page-header">
          <h1 className="page-title">State Demand &amp; Supply Analysis</h1>
          <p className="page-subtitle">
            State-level housing demand vs supply: waitlist trends, building approvals, social housing completions, and demographics.
          </p>
        </div>

        {/* State selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {STATES.map((st) => (
            <button
              key={st}
              className={`tab-pill ${selectedState === st ? "active" : ""}`}
              onClick={() => setSelectedState(st)}
              style={{ borderColor: selectedState === st ? STATE_COLORS[st] : undefined, color: selectedState === st ? STATE_COLORS[st] : undefined }}
            >
              {st} — {STATE_INFO[st]?.full}
            </button>
          ))}
        </div>

        {/* KPI row */}
        <div className="grid-4" style={{ marginBottom: 24 }}>
          <div className="kpi-card">
            <div className="kpi-label">Waitlist ({s.waitlist_year})</div>
            <div className="kpi-value" style={{ color: "#e74c3c" }}>{s.latest_waitlist.toLocaleString()}</div>
            <div className="kpi-delta">{s.wl_change_yoy !== null ? `${s.wl_change_yoy > 0 ? "+" : ""}${s.wl_change_yoy}% YoY` : "—"}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Annual Approvals</div>
            <div className="kpi-value" style={{ fontSize: "1.6rem" }}>{s.latest_approvals_total.toLocaleString()}</div>
            <div className="kpi-delta">{s.houses_pct_of_approvals}% detached houses</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Social Completions</div>
            <div className="kpi-value" style={{ fontSize: "1.6rem", color: "#27ae60" }}>{s.latest_social_completions.toLocaleString()}</div>
            <div className="kpi-delta">+{s.latest_affordable_completions.toLocaleString()} affordable</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Years to Clear Waitlist</div>
            <div className="kpi-value" style={{ color: s.years_to_clear_waitlist && s.years_to_clear_waitlist > 20 ? "#e74c3c" : "#f39c12" }}>
              {s.years_to_clear_waitlist ?? "—"}
            </div>
            <div className="kpi-delta">At current delivery rate</div>
          </div>
        </div>

        {/* Insight card */}
        <div className="callout-gold" style={{ marginBottom: 24, fontSize: "0.85rem", color: "#ccc", lineHeight: 1.7 }}>
          <strong style={{ color: "#f6c90e" }}>{s.state_full} — {s.authority}</strong><br />
          {s.insight}
        </div>

        {/* Chart row 1: donut + approvals + delivery */}
        <div className="grid-3" style={{ marginBottom: 24 }}>
          <div className="chart-container">
            <div className="chart-title">Accessible vs Private Supply (%)</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value">
                  <Cell fill="#27ae60" />
                  <Cell fill="#2a2a4e" />
                </Pie>
                <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 8, fontSize: 12 }} formatter={(v: unknown) => [`${(v as number).toFixed(1)}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ textAlign: "center", fontSize: "0.78rem", color: "#888" }}>
              <span style={{ color: "#27ae60" }}>{s.accessible_pct_of_approvals}%</span> accessible · <span style={{ color: "#666" }}>{(100 - s.accessible_pct_of_approvals).toFixed(1)}%</span> private
            </div>
          </div>

          <div className="chart-container">
            <div className="chart-title">Building Approvals by Type</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={recentApprovals} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="#2a2a4e" strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fill: "#666", fontSize: 9 }} tickLine={false} />
                <YAxis tick={{ fill: "#666", fontSize: 9 }} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 8, fontSize: 11 }} formatter={(v: unknown) => [(v as number).toLocaleString(), ""]} />
                <Bar dataKey="houses" fill="#3498db" name="Houses" stackId="a" />
                <Bar dataKey="other" fill="#9b59b6" name="Other" stackId="a" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <div className="chart-title">Social + Affordable Completions</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={recentCompletions} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="#2a2a4e" strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fill: "#666", fontSize: 9 }} tickLine={false} />
                <YAxis tick={{ fill: "#666", fontSize: 9 }} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 8, fontSize: 11 }} formatter={(v: unknown) => [(v as number).toLocaleString(), ""]} />
                <Bar dataKey="social" fill="#27ae60" name="Social" stackId="a" />
                <Bar dataKey="affordable" fill="#f6c90e" name="Affordable" stackId="a" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Supply reality callout */}
        <div className="callout-red" style={{ marginBottom: 24, fontSize: "0.85rem", color: "#ccc", lineHeight: 1.7 }}>
          <strong style={{ color: "#e74c3c" }}>Supply Reality:</strong> {s.state_full} is delivering {s.accessible_pct_of_approvals}% accessible housing from its total approvals pipeline of {s.latest_approvals_total.toLocaleString()} dwellings/year. Against a waitlist of {s.latest_waitlist.toLocaleString()}, at current delivery rates it would take approximately {s.years_to_clear_waitlist ?? "many"} years to clear the list — assuming no new applications.
        </div>

        {/* Chart row 2: waitlist + state comparison */}
        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="chart-container">
            <div className="chart-title">Waitlist Trend — {s.state_full}</div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={waitlistTrend} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="#2a2a4e" strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fill: "#666", fontSize: 10 }} tickLine={false} />
                <YAxis tick={{ fill: "#666", fontSize: 10 }} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 8, fontSize: 12 }} formatter={(v: unknown) => [(v as number).toLocaleString(), "applicants"]} />
                <Line type="monotone" dataKey="applicants" stroke={STATE_COLORS[selectedState]} strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <div className="chart-title">State Comparison — Waitlist 2024</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stateComparison} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 10 }}>
                <CartesianGrid stroke="#2a2a4e" strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fill: "#666", fontSize: 10 }} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="state" tick={{ fill: "#ccc", fontSize: 11 }} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 8, fontSize: 12 }} formatter={(v: unknown) => [(v as number).toLocaleString(), "applicants"]} />
                <Bar dataKey="waitlist" radius={[0, 4, 4, 0]}>
                  {stateComparison.map((entry) => (
                    <Cell key={entry.state} fill={STATE_COLORS[entry.state] ?? "#3498db"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demographics + household size */}
        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="chart-container">
            <div className="chart-title">Waitlist Demographics — {s.state_full}</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={demoData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                <CartesianGrid stroke="#2a2a4e" strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fill: "#666", fontSize: 10 }} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="label" tick={{ fill: "#ccc", fontSize: 10 }} tickLine={false} width={150} />
                <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 8, fontSize: 12 }} formatter={(v: unknown) => [`${v}%`, ""]} />
                <Bar dataKey="pct" fill="#f6c90e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <div className="chart-title">Household Size Trend — {s.state_full}</div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={s.household_size_trend} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="#2a2a4e" strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fill: "#666", fontSize: 10 }} tickLine={false} />
                <YAxis domain={[2.2, 2.9]} tick={{ fill: "#666", fontSize: 10 }} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 8, fontSize: 12 }} formatter={(v: unknown) => [`${v} persons`, "avg household"]} />
                <Line type="monotone" dataKey="avg" stroke="#3498db" strokeWidth={2.5} dot={{ r: 4, fill: "#3498db" }} />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ fontSize: "0.72rem", color: "#666", marginTop: 8 }}>
              Declining household size means each person added to the population requires more dwellings.
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
