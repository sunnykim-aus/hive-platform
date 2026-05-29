"use client"
import { useState } from "react"
import { PROGRAMS, Program } from "@/lib/data/programs"
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts"

const CONFIDENCE_COLORS = { High: "#27ae60", Medium: "#f39c12", Low: "#e74c3c" }
const STATUS_COLORS: Record<string, string> = {
  "Completed": "#27ae60",
  "Active": "#3498db",
  "Ongoing": "#3498db",
  "Ongoing (now Home Guarantee Scheme)": "#3498db",
  "Closed (running down)": "#888",
}

export default function OutcomeLedgerPage() {
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null)

  const totalCommitted = PROGRAMS.reduce((s, p) => s + p.funding_committed_bn, 0)
  const totalDrawn = PROGRAMS.reduce((s, p) => s + (p.funding_drawn_bn ?? 0), 0)
  const activeCount = PROGRAMS.filter((p) => p.status === "Active" || p.status === "Ongoing" || p.status.includes("Ongoing")).length

  // Bubble chart data
  const bubbleData = PROGRAMS.map((p) => ({
    year: p.announced_year,
    funding: p.funding_committed_bn,
    name: p.short_name,
    status: p.status,
  }))

  return (
    <div style={{ background: "#0f0f1a", minHeight: "100vh" }}>
      <div className="page-container">

        <div className="page-header">
          <h1 className="page-title">Policy Outcome Ledger</h1>
          <p className="page-subtitle">
            What Australian housing programs promised vs what they delivered. Funding committed, targets set, and actual outcomes with confidence ratings.
          </p>
        </div>

        {/* Summary metrics */}
        <div className="grid-4" style={{ marginBottom: 24 }}>
          <div className="kpi-card">
            <div className="kpi-label">Total Committed</div>
            <div className="kpi-value" style={{ color: "#f6c90e" }}>${totalCommitted.toFixed(1)}B</div>
            <div className="kpi-delta">Across {PROGRAMS.length} programs</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Total Drawn</div>
            <div className="kpi-value" style={{ color: "#27ae60" }}>${totalDrawn.toFixed(1)}B</div>
            <div className="kpi-delta">Actual expenditure tracked</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Programs Tracked</div>
            <div className="kpi-value">{PROGRAMS.length}</div>
            <div className="kpi-delta">2008 to present</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Currently Active</div>
            <div className="kpi-value" style={{ color: "#3498db" }}>{activeCount}</div>
            <div className="kpi-delta">Ongoing programs</div>
          </div>
        </div>

        {/* Bubble chart */}
        <div className="chart-container" style={{ marginBottom: 24 }}>
          <div className="chart-title">Program Investment by Year ($B committed)</div>
          <ResponsiveContainer width="100%" height={260}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid stroke="#2a2a4e" strokeDasharray="3 3" />
              <XAxis
                type="number" dataKey="year" name="Year"
                domain={[2005, 2028]}
                tick={{ fill: "#666", fontSize: 10 }} tickLine={false}
              />
              <YAxis
                type="number" dataKey="funding" name="Funding ($B)"
                tick={{ fill: "#666", fontSize: 10 }} tickLine={false}
                tickFormatter={(v) => `$${v}B`}
              />
              <Tooltip
                contentStyle={{ background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 8, fontSize: 12 }}
                formatter={(value: unknown, name: unknown) => [(name as string) === "Year" ? String(value) : `$${value}B`, name as string]}
                cursor={{ strokeDasharray: "3 3" }}
              />
              <Scatter data={bubbleData} name="Programs">
                {bubbleData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={STATUS_COLORS[entry.status] ?? "#888"}
                    r={Math.max(8, Math.sqrt(entry.funding) * 8)}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
            {Object.entries(STATUS_COLORS).filter((_, i) => i < 3).map(([status, color]) => (
              <div key={status} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.72rem", color: "#888" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
                {status}
              </div>
            ))}
          </div>
        </div>

        {/* Program list */}
        <div>
          <div className="section-label">All Programs — Click to Expand</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {PROGRAMS.map((p: Program) => (
              <div key={p.short_name} className="hive-card" style={{ cursor: "pointer" }}>
                {/* Header row */}
                <div
                  style={{ display: "flex", alignItems: "flex-start", gap: 16 }}
                  onClick={() => setExpandedProgram(expandedProgram === p.short_name ? null : p.short_name)}
                >
                  <div style={{ minWidth: 50, textAlign: "center" }}>
                    <div style={{ fontWeight: 800, color: "#f6c90e", fontSize: "1rem" }}>{p.announced_year}</div>
                    <div style={{ fontSize: "0.65rem", color: "#555" }}>{p.end_year ? `–${p.end_year}` : "ongoing"}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, color: "#fff", fontSize: "0.9rem" }}>{p.name}</span>
                      <span className="badge" style={{ background: `${STATUS_COLORS[p.status] ?? "#666"}22`, color: STATUS_COLORS[p.status] ?? "#666", border: `1px solid ${STATUS_COLORS[p.status] ?? "#666"}44`, fontSize: "0.6rem" }}>
                        {p.status}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#888", display: "flex", gap: 16, flexWrap: "wrap" }}>
                      <span>Committed: <span style={{ color: "#f6c90e", fontWeight: 600 }}>${p.funding_committed_bn}B</span></span>
                      {p.funding_drawn_bn != null && <span>Drawn: <span style={{ color: "#27ae60", fontWeight: 600 }}>${p.funding_drawn_bn}B</span></span>}
                      <span style={{ color: "#666" }}>{p.program_type}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: "1rem", color: "#555" }}>{expandedProgram === p.short_name ? "▲" : "▼"}</div>
                </div>

                {/* Expanded content */}
                {expandedProgram === p.short_name && (
                  <div style={{ marginTop: 16, borderTop: "1px solid #2a2a4e", paddingTop: 16 }}>
                    <p style={{ fontSize: "0.82rem", color: "#aaa", lineHeight: 1.7, marginBottom: 16 }}>{p.description}</p>

                    <div className="grid-2">
                      {/* Targets */}
                      <div>
                        <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: 1, color: "#3498db", fontWeight: 600, marginBottom: 8 }}>Targets Set</div>
                        {p.targets.map((t) => (
                          <div key={t.metric} style={{ marginBottom: 8, fontSize: "0.8rem" }}>
                            <div style={{ color: "#ccc", fontWeight: 600 }}>{t.metric}</div>
                            <div style={{ color: "#3498db" }}>{t.target_value.toLocaleString()} {t.target_unit}{t.target_year ? ` by ${t.target_year}` : ""}</div>
                          </div>
                        ))}
                      </div>

                      {/* Outcomes */}
                      <div>
                        <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: 1, color: "#27ae60", fontWeight: 600, marginBottom: 8 }}>Outcomes Recorded</div>
                        {p.outcomes.map((o) => (
                          <div key={o.metric} style={{ marginBottom: 10, fontSize: "0.8rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ color: "#ccc", fontWeight: 600 }}>{o.metric}</span>
                              <span className="badge" style={{
                                background: `${CONFIDENCE_COLORS[o.confidence]}22`,
                                color: CONFIDENCE_COLORS[o.confidence],
                                border: `1px solid ${CONFIDENCE_COLORS[o.confidence]}44`,
                                fontSize: "0.6rem"
                              }}>{o.confidence}</span>
                            </div>
                            <div style={{ color: "#27ae60" }}>{typeof o.actual_value === 'number' ? o.actual_value.toLocaleString() : o.actual_value} {o.actual_unit}</div>
                            {o.notes && <div style={{ color: "#666", fontSize: "0.72rem", marginTop: 2 }}>{o.notes}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
