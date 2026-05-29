"use client"
import { getSHSSummary, SHS_DATA, WAITLIST_DATA } from "@/lib/data/shs"
import { getBuildingApprovalsSummary, BUILDING_APPROVALS } from "@/lib/data/building-approvals"
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend
} from "recharts"

export default function LiveDashboardPage() {
  const shs = getSHSSummary()
  const approvals = getBuildingApprovalsSummary()

  // Compute 12-month rolling average for building approvals
  const approvalsWithMA = BUILDING_APPROVALS.map((d, i) => {
    const start = Math.max(0, i - 11)
    const slice = BUILDING_APPROVALS.slice(start, i + 1)
    const avg = Math.round(slice.reduce((s, r) => s + r.total_aus, 0) / slice.length)
    return {
      date: d.date.slice(0, 7),
      total: d.total_aus,
      ma12: avg,
    }
  })

  // Show last 36 months
  const recentApprovals = approvalsWithMA.slice(-36)

  // SHS grouped bar data
  const shsBarData = SHS_DATA.slice(-6).map((d) => ({
    year: d.year,
    clients: d.clients,
    needing: d.needing_housing,
    got: d.got_housing,
  }))

  // Waitlist by state for last 4 years
  const states = ["NSW", "VIC", "QLD", "WA", "SA"]
  const years = [2021, 2022, 2023, 2024]
  const waitlistChartData = years.map((yr) => {
    const row: Record<string, number | string> = { year: yr }
    states.forEach((st) => {
      const rec = WAITLIST_DATA.find((d) => d.state === st && d.year === yr)
      if (rec) row[st] = rec.applicants
    })
    return row
  })

  const stateColors: Record<string, string> = {
    NSW: "#3498db", VIC: "#e74c3c", QLD: "#f39c12", WA: "#27ae60", SA: "#9b59b6"
  }

  return (
    <div style={{ background: "#0f0f1a", minHeight: "100vh" }}>
      <div className="page-container">

        <div className="page-header">
          <h1 className="page-title">Live Dashboard</h1>
          <p className="page-subtitle">
            Real-time snapshot of Australian housing supply and demand. Building approvals at {(approvals.annual_run_rate / 1000).toFixed(0)}k/year — {approvals.pct_of_target}% of the 240k Accord target. {shs.unassisted_requests.toLocaleString()} unmet requests last year.
          </p>
        </div>

        {/* Narrative callout */}
        <div className="callout-red" style={{ marginBottom: 28, fontSize: "0.88rem", color: "#ccc", lineHeight: 1.7 }}>
          <strong style={{ color: "#e74c3c" }}>Supply Reality:</strong> Australia is approving roughly <strong>{(approvals.annual_run_rate / 1000).toFixed(0)},000 homes per year</strong> — a shortfall of <strong>{(approvals.gap_to_target / 1000).toFixed(0)},000/year</strong> against the National Housing Accord target. At current rates, the 1.2 million home commitment will not be met. Meanwhile, {shs.total_clients.toLocaleString()} Australians sought specialist homelessness support in {shs.latest_year}, with {shs.unassisted_requests.toLocaleString()} requests going unmet.
        </div>

        {/* KPI row */}
        <div className="grid-4" style={{ marginBottom: 28 }}>
          <div className="kpi-card">
            <div className="kpi-label">Monthly Approvals</div>
            <div className="kpi-value" style={{ color: "#e74c3c" }}>{approvals.latest_monthly.toLocaleString()}</div>
            <div className="kpi-delta">{approvals.yoy_change_pct > 0 ? "+" : ""}{approvals.yoy_change_pct}% YoY</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Annual Run Rate</div>
            <div className="kpi-value" style={{ color: "#e74c3c" }}>{(approvals.annual_run_rate / 1000).toFixed(0)}k</div>
            <div className="kpi-delta">vs 240k Accord target</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">SHS Clients ({shs.latest_year})</div>
            <div className="kpi-value" style={{ fontSize: "1.6rem", color: "#f39c12" }}>{(shs.total_clients / 1000).toFixed(0)}k</div>
            <div className="kpi-delta">{shs.client_change_yoy > 0 ? "+" : ""}{shs.client_change_yoy}% YoY</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Housing Success Rate</div>
            <div className="kpi-value" style={{ color: "#f39c12" }}>{shs.housing_success_rate}%</div>
            <div className="kpi-delta">Got housing of those who needed it</div>
          </div>
        </div>

        {/* Building approvals line chart */}
        <div className="chart-container" style={{ marginBottom: 24 }}>
          <div className="chart-title">Building Approvals — Monthly (ABS 8731.0) with 12-Month Rolling Average</div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={recentApprovals} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="#2a2a4e" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: "#666", fontSize: 10 }} tickLine={false} interval={5} />
              <YAxis tick={{ fill: "#666", fontSize: 10 }} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#fff" }}
                formatter={(value: unknown, name: unknown) => [(value as number).toLocaleString(), (name as string) === "total" ? "Monthly approvals" : "12-mo average"]}
              />
              <ReferenceLine y={20000} stroke="#e74c3c" strokeDasharray="6 3" label={{ value: "20,000/mo target", fill: "#e74c3c", fontSize: 10 }} />
              <Line type="monotone" dataKey="total" stroke="#3498db" strokeWidth={1.5} dot={false} name="total" />
              <Line type="monotone" dataKey="ma12" stroke="#f6c90e" strokeWidth={2.5} dot={false} name="ma12" />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ fontSize: "0.72rem", color: "#666", marginTop: 8 }}>
            Blue: monthly approvals · Gold: 12-month rolling average · Red dashed: 20,000/month Accord pace
          </div>
        </div>

        {/* Supply gap progress bar */}
        <div className="hive-card" style={{ marginBottom: 24 }}>
          <div className="chart-title">Supply Gap — Annual Rate vs 240k Accord Target</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.82rem", color: "#aaa" }}>
            <span>Current: {approvals.annual_run_rate.toLocaleString()} / year</span>
            <span>Target: 240,000 / year</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${approvals.pct_of_target}%`, background: approvals.pct_of_target < 80 ? "#e74c3c" : "#27ae60" }} />
          </div>
          <div style={{ marginTop: 8, fontSize: "0.82rem", color: "#e74c3c", fontWeight: 600 }}>
            {approvals.pct_of_target}% of target — shortfall of {approvals.gap_to_target.toLocaleString()} dwellings per year
          </div>
        </div>

        {/* SHS bar chart */}
        <div className="chart-container" style={{ marginBottom: 24 }}>
          <div className="chart-title">Specialist Homelessness Services — Annual (AIHW)</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={shsBarData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="#2a2a4e" strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: "#666", fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fill: "#666", fontSize: 10 }} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 8, fontSize: 12 }}
                formatter={(value: unknown) => [(value as number).toLocaleString(), ""]}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: "#888" }} />
              <Bar dataKey="clients" fill="#3498db" name="Total clients" radius={[2, 2, 0, 0]} />
              <Bar dataKey="needing" fill="#f39c12" name="Needed housing" radius={[2, 2, 0, 0]} />
              <Bar dataKey="got" fill="#27ae60" name="Got housing" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Waitlist line chart */}
        <div className="chart-container" style={{ marginBottom: 24 }}>
          <div className="chart-title">Social Housing Waitlist by State (2021–2024)</div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={waitlistChartData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="#2a2a4e" strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: "#666", fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fill: "#666", fontSize: 10 }} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 8, fontSize: 12 }}
                formatter={(value: unknown) => [(value as number).toLocaleString(), ""]}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: "#888" }} />
              {states.map((st) => (
                <Line key={st} type="monotone" dataKey={st} stroke={stateColors[st]} strokeWidth={2} dot={{ r: 4 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* References */}
        <div className="hive-card" style={{ marginBottom: 24 }}>
          <div className="section-label">Data Sources</div>
          <table className="hive-table">
            <thead>
              <tr>
                <th>Dataset</th><th>Publisher</th><th>Frequency</th><th>Used for</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["ABS Building Approvals (8731.0)", "Australian Bureau of Statistics", "Monthly", "Supply run rate, Accord tracking"],
                ["SHS Annual Report", "AIHW", "Annual", "Homelessness demand, unmet need"],
                ["State Housing Registers", "NSW DCJ, VIC DFFH, QLD DCHDE, WA DPLH, SA SAHT", "Annual", "Waitlist volumes by state"],
              ].map(([ds, pub, freq, used]) => (
                <tr key={ds}>
                  <td style={{ color: "#fff" }}>{ds}</td>
                  <td>{pub}</td>
                  <td><span className="badge badge-grey">{freq}</span></td>
                  <td>{used}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
