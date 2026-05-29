"use client"
import { getSHSSummary, SHS_DATA, WAITLIST_DATA } from "@/lib/data/shs"
import { getBuildingApprovalsSummary, BUILDING_APPROVALS } from "@/lib/data/building-approvals"
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend
} from "recharts"

// ── Radial gauge (SVG) ──────────────────────────────────────
function RadialGauge({ value, target, pct }: { value: number; target: number; pct: number }) {
  const r = 75, cx = 120, cy = 105
  // Background semi-arc: 180° → 0°
  const bgX1 = cx - r, bgY1 = cy   // left tip
  const bgX2 = cx + r, bgY2 = cy   // right tip
  // Fill arc: how far around (pct/100 * 180 degrees from left)
  const fillDeg = (pct / 100) * 180
  const fillRad = (Math.PI) - (fillDeg * Math.PI / 180)
  const valX = cx + r * Math.cos(fillRad)
  const valY = cy - r * Math.sin(fillRad)
  const largeArc = fillDeg > 180 ? 1 : 0
  const gaugeColor = pct < 80 ? "#e74c3c" : "#27ae60"

  return (
    <svg viewBox="0 0 240 130" style={{ width: "100%", maxWidth: 300, display: "block", margin: "0 auto" }}>
      {/* Tick marks */}
      {[0, 25, 50, 75, 100].map((tick) => {
        const tickRad = Math.PI - (tick / 100) * Math.PI
        const x1 = cx + (r - 10) * Math.cos(tickRad)
        const y1 = cy - (r - 10) * Math.sin(tickRad)
        const x2 = cx + (r + 2) * Math.cos(tickRad)
        const y2 = cy - (r + 2) * Math.sin(tickRad)
        return <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3a3a6e" strokeWidth="1.5" />
      })}
      {/* Background track */}
      <path d={`M ${bgX1} ${bgY1} A ${r} ${r} 0 0 1 ${bgX2} ${bgY2}`}
        fill="none" stroke="#1e1e3a" strokeWidth="20" strokeLinecap="round" />
      {/* Fill arc */}
      <path d={`M ${bgX1} ${bgY1} A ${r} ${r} 0 ${largeArc} 1 ${valX} ${valY}`}
        fill="none" stroke={gaugeColor} strokeWidth="20" strokeLinecap="round" />
      {/* Glow on fill end */}
      <circle cx={valX} cy={valY} r="5" fill={gaugeColor} opacity="0.6" />
      {/* Labels */}
      <text x={bgX1 - 4} y={cy + 18} textAnchor="middle" fill="#555" fontSize="9">0</text>
      <text x={bgX2 + 4} y={cy + 18} textAnchor="middle" fill="#555" fontSize="9">240k</text>
      {/* Center value */}
      <text x={cx} y={cy - 20} textAnchor="middle" fill="#fff" fontSize="24" fontWeight="900" fontFamily="system-ui">
        {(value / 1000).toFixed(0)}k
      </text>
      <text x={cx} y={cy - 2} textAnchor="middle" fill="#888" fontSize="10">dwellings/year</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill={gaugeColor} fontSize="12" fontWeight="700">
        ▼ {((target - value) / 1000).toFixed(0)}k vs target
      </text>
      <text x={cx} y={cy + 30} textAnchor="middle" fill="#555" fontSize="9">
        {pct}% of 240,000 Accord target
      </text>
    </svg>
  )
}

export default function LiveDashboardPage() {
  const shs = getSHSSummary()
  const approvals = getBuildingApprovalsSummary()

  // 12-month rolling average for building approvals
  const approvalsWithMA = BUILDING_APPROVALS.map((d, i) => {
    const start = Math.max(0, i - 11)
    const slice = BUILDING_APPROVALS.slice(start, i + 1)
    const avg = Math.round(slice.reduce((s, r) => s + r.total_aus, 0) / slice.length)
    return { date: d.date.slice(0, 7), total: d.total_aus, ma12: avg }
  })
  const recentApprovals = approvalsWithMA.slice(-36)

  // SHS grouped bar — last 6 years
  const shsBarData = SHS_DATA.slice(-6).map((d) => ({
    year: d.year,
    "Sought help":    d.clients,
    "Needed housing": d.needing_housing,
    "Got housing":    d.got_housing,
  }))

  // SHS 2023-24 funnel (latest year)
  const latestSHS = SHS_DATA[SHS_DATA.length - 1]
  const funnelData = [
    { label: "Sought help",    value: latestSHS.clients,         pct: 100,  color: "#4a90d9" },
    { label: "Needed housing", value: latestSHS.needing_housing, pct: Math.round(latestSHS.needing_housing / latestSHS.clients * 100), color: "#f0a30a" },
    { label: "Got housing",    value: latestSHS.got_housing,     pct: Math.round(latestSHS.got_housing / latestSHS.clients * 100),     color: "#2ecc71" },
  ]

  // Waitlist by state
  const states = ["NSW", "VIC", "QLD", "WA", "SA"]
  const years = [2019, 2020, 2021, 2022, 2023, 2024]
  const waitlistChartData = years.map((yr) => {
    const row: Record<string, number | string> = { year: yr }
    states.forEach((st) => {
      const rec = WAITLIST_DATA.find((d) => d.state === st && d.year === yr)
      if (rec) row[st] = rec.applicants
    })
    return row
  })

  const stateColors: Record<string, string> = {
    NSW: "#4a90d9", VIC: "#e74c3c", QLD: "#f0a30a", WA: "#2ecc71", SA: "#9b59b6"
  }

  return (
    <div style={{ background: "#0f0f1a", minHeight: "100vh" }}>
      <div className="page-container">

        <div className="page-header">
          <h1 className="page-title">Live Housing Dashboard</h1>
          <p className="page-subtitle">
            Key indicators updated from ABS and AIHW. Building approvals at {approvals.annual_run_rate.toLocaleString()}/year — {approvals.pct_of_target}% of the 240k Accord target. {shs.unassisted_requests.toLocaleString()} unmet requests last year.
          </p>
        </div>

        {/* Narrative callout */}
        <div className="callout-red" style={{ marginBottom: 28, fontSize: "0.88rem", color: "#ccc", lineHeight: 1.8 }}>
          Australia is currently building at an annual rate of <strong style={{ color: "#fff" }}>{approvals.annual_run_rate.toLocaleString()} dwellings per year</strong> — <strong style={{ color: "#e74c3c" }}>{approvals.gap_to_target.toLocaleString()} dwellings behind</strong> the National Housing Accord target of 240,000 per year. Meanwhile, <strong style={{ color: "#f39c12" }}>{shs.unassisted_requests.toLocaleString()} requests for help went unmet</strong> through specialist homelessness services last year, with only <strong style={{ color: "#f39c12" }}>{shs.housing_success_rate}%</strong> of people who needed housing actually receiving it.
        </div>

        {/* KPI row */}
        <div className="grid-4" style={{ marginBottom: 28 }}>
          <div className="kpi-card">
            <div className="kpi-label">Monthly Approvals</div>
            <div className="kpi-value" style={{ color: "#e74c3c" }}>{approvals.latest_monthly.toLocaleString()}</div>
            <div className="kpi-delta" style={{ color: "#27ae60" }}>+{approvals.yoy_change_pct}% vs last year</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Annual Run Rate</div>
            <div className="kpi-value" style={{ color: "#e74c3c" }}>{approvals.annual_run_rate.toLocaleString()}</div>
            <div className="kpi-delta" style={{ color: "#e74c3c" }}>{approvals.pct_of_target}% of 240k accord target</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Unmet SHS Requests</div>
            <div className="kpi-value" style={{ fontSize: "1.6rem", color: "#f39c12" }}>{shs.unassisted_requests.toLocaleString()}</div>
            <div className="kpi-delta" style={{ color: "#e74c3c" }}>+{shs.unassisted_change_yoy}% YoY</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Housing Success Rate</div>
            <div className="kpi-value" style={{ color: "#f39c12" }}>{shs.housing_success_rate}%</div>
            <div className="kpi-delta">1 in 4 people who needed housing got it</div>
          </div>
        </div>

        {/* ── Housing Supply — Are We Building Enough? ── */}
        <div style={{ marginBottom: 8 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", marginBottom: 4 }}>Housing Supply — Are We Building Enough?</h2>
          <p style={{ fontSize: "0.82rem", color: "#888", marginBottom: 16, lineHeight: 1.6 }}>
            The <strong style={{ color: "#f6c90e" }}>gold line</strong> is the 12-month rolling average — the real trend. The <strong style={{ color: "#4a90d9" }}>blue line</strong> is monthly approvals. The <strong style={{ color: "#e74c3c" }}>red dashed line</strong> is the 20,000/month pace needed to hit the Accord target.
          </p>
        </div>

        {/* Approvals chart + gauge side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, marginBottom: 24 }}>
          <div className="chart-container">
            <div className="chart-title">Monthly Dwelling Approvals — ABS 8731.0</div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={recentApprovals} margin={{ top: 16, right: 20, bottom: 0, left: 10 }}>
                <CartesianGrid stroke="#1e1e36" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: "#555", fontSize: 10 }} tickLine={false} interval={5} />
                <YAxis tick={{ fill: "#555", fontSize: 10 }} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} label={{ value: "Dwellings approved", angle: -90, position: "insideLeft", fill: "#555", fontSize: 10, dx: -4 }} />
                <Tooltip
                  contentStyle={{ background: "#13131f", border: "1px solid #2a2a4e", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#aaa" }}
                  formatter={(value: unknown, name: unknown) => [(value as number).toLocaleString(), (name as string) === "total" ? "Monthly approvals" : "12-mo average"]}
                />
                <ReferenceLine y={20000} stroke="#e74c3c" strokeDasharray="6 3" label={{ value: "Accord target (20,000/mth)", fill: "#e74c3c", fontSize: 9, position: "insideTopRight" }} />
                <Line type="monotone" dataKey="total" stroke="#4a90d9" strokeWidth={2} dot={false} name="total" opacity={0.8} />
                <Line type="monotone" dataKey="ma12" stroke="#f6c90e" strokeWidth={3} dot={false} name="ma12" />
                <Legend wrapperStyle={{ fontSize: 11, color: "#888", paddingTop: 8 }} formatter={(val) => val === "total" ? "Monthly approvals" : "12-month average"} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Radial gauge */}
          <div className="chart-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div className="chart-title" style={{ textAlign: "center" }}>Supply Gap at a Glance</div>
            <RadialGauge value={approvals.annual_run_rate} target={240000} pct={approvals.pct_of_target} />
            <div style={{ marginTop: 12, fontSize: "0.78rem", color: "#888", textAlign: "center", lineHeight: 1.6 }}>
              <strong style={{ color: "#e74c3c" }}>What this means:</strong><br />
              At current pace, Australia will deliver roughly{" "}
              <strong style={{ color: "#fff" }}>940,000 homes</strong> over 5 years — against a target of 1.2 million.
            </div>
          </div>
        </div>

        {/* ── Homelessness & Housing Demand ── */}
        <div style={{ marginBottom: 8 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", marginBottom: 4 }}>Homelessness &amp; Housing Demand — The Human Cost</h2>
          <p style={{ fontSize: "0.82rem", color: "#888", marginBottom: 16, lineHeight: 1.6 }}>
            How many people sought help each year, how many went unassisted, and — crucially — <strong style={{ color: "#fff" }}>how few of those who needed long-term housing actually received it.</strong>
          </p>
        </div>

        {/* SHS bar chart */}
        <div className="chart-container" style={{ marginBottom: 16 }}>
          <div className="chart-title">Specialist Homelessness Services — Annual Trend (AIHW)</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={shsBarData} margin={{ top: 10, right: 20, bottom: 0, left: 10 }} barCategoryGap="20%">
              <CartesianGrid stroke="#1e1e36" strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: "#555", fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fill: "#555", fontSize: 10 }} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} label={{ value: "Number of people", angle: -90, position: "insideLeft", fill: "#555", fontSize: 10, dx: -4 }} />
              <Tooltip
                contentStyle={{ background: "#13131f", border: "1px solid #2a2a4e", borderRadius: 8, fontSize: 12 }}
                formatter={(value: unknown) => [(value as number).toLocaleString(), ""]}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: "#888", paddingTop: 8 }} />
              <Bar dataKey="Sought help"    fill="#4a90d9" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Needed housing" fill="#f0a30a" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Got housing"    fill="#2ecc71" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* SHS 2023-24 funnel */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div className="chart-container">
            <div className="chart-title">2023–24 Outcomes — The Unmet Housing Gap</div>
            <div style={{ marginTop: 12 }}>
              {funnelData.map((row, i) => (
                <div key={row.label} style={{ marginBottom: i < funnelData.length - 1 ? 20 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.8rem" }}>
                    <span style={{ color: "#ccc" }}>{row.label}</span>
                    <span style={{ color: row.color, fontWeight: 700 }}>{row.value.toLocaleString()} · {row.pct}%</span>
                  </div>
                  <div style={{ height: 28, background: "#1e1e36", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                    <div style={{
                      width: `${row.pct}%`, height: "100%",
                      background: row.color, borderRadius: 4,
                      display: "flex", alignItems: "center", paddingLeft: 10,
                      fontSize: "0.75rem", fontWeight: 700, color: "#0f0f1a",
                      transition: "width 0.8s ease",
                    }}>
                      {row.pct > 15 ? row.value.toLocaleString() : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="callout-red" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: "0.82rem", color: "#aaa", lineHeight: 1.8 }}>
              <strong style={{ color: "#f39c12" }}>The unmet housing gap:</strong><br /><br />
              In 2023–24, <strong style={{ color: "#fff" }}>{latestSHS.needing_housing.toLocaleString()} people</strong> came to SHS agencies specifically needing long-term housing.<br /><br />
              Only <strong style={{ color: "#2ecc71" }}>{latestSHS.got_housing.toLocaleString()} received it.</strong> That means{" "}
              <strong style={{ color: "#e74c3c" }}>{(latestSHS.needing_housing - latestSHS.got_housing).toLocaleString()} people</strong>{" "}
              walked away without housing — a <strong style={{ color: "#e74c3c" }}>73% failure rate</strong> driven directly by insufficient social and community housing stock.
            </div>
          </div>
        </div>

        {/* ── Social Housing Waitlists ── */}
        <div style={{ marginBottom: 8 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff", marginBottom: 4 }}>Social Housing Waitlists — The Queue Getting Longer</h2>
          <p style={{ fontSize: "0.82rem", color: "#888", marginBottom: 16, lineHeight: 1.6 }}>
            Each line is approved applicants waiting for social housing in each state. A rising line means the sector is losing ground.{" "}
            <strong style={{ color: "#fff" }}>NSW alone has over 61,000 households on the register.</strong>
          </p>
        </div>

        <div className="chart-container" style={{ marginBottom: 24 }}>
          <div className="chart-title">Social Housing Waitlist by State (2019–2024)</div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={waitlistChartData} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
              <CartesianGrid stroke="#1e1e36" strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: "#555", fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fill: "#555", fontSize: 10 }} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} label={{ value: "Approved applicants on waitlist", angle: -90, position: "insideLeft", fill: "#555", fontSize: 10, dx: -4 }} />
              <Tooltip
                contentStyle={{ background: "#13131f", border: "1px solid #2a2a4e", borderRadius: 8, fontSize: 12 }}
                formatter={(value: unknown) => [(value as number).toLocaleString(), ""]}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: "#888", paddingTop: 8 }} />
              {states.map((st) => (
                <Line key={st} type="monotone" dataKey={st} stroke={stateColors[st]} strokeWidth={2.5}
                  dot={{ r: 5, fill: stateColors[st], strokeWidth: 2, stroke: "#0f0f1a" }}
                  activeDot={{ r: 7 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <div className="callout-gold" style={{ marginTop: 16, fontSize: "0.78rem", color: "#aaa", lineHeight: 1.7 }}>
            <strong style={{ color: "#f6c90e" }}>Reading this chart:</strong> Combined waitlists across tracked states have grown by <strong style={{ color: "#fff" }}>73%</strong> over the period shown. NSW and VIC have the largest absolute numbers. Every person on this list is a potential tenant for a community housing provider.
          </div>
        </div>

        {/* Data sources */}
        <div className="hive-card" style={{ marginBottom: 24 }}>
          <div className="section-label">Data Sources</div>
          <table className="hive-table">
            <thead>
              <tr><th>Dataset</th><th>Publisher</th><th>Frequency</th><th>Used for</th></tr>
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
