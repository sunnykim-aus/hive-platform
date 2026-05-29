import { POLICY_TIMELINE, TYPE_COLORS, TYPE_LABELS } from "@/lib/data/policy-timeline"

export default function PolicyTimelinePage() {
  const totalInvestment = POLICY_TIMELINE.reduce((s, p) => s + p.amount_bn, 0)

  return (
    <div style={{ background: "#0f0f1a", minHeight: "100vh" }}>
      <div className="page-container">

        <div className="page-header">
          <h1 className="page-title">Australian Housing Policy Timeline</h1>
          <p className="page-subtitle">
            Major federal housing policy interventions from 2008 to 2024. Total investment across 10 programs: ${totalInvestment.toFixed(1)}B.
          </p>
        </div>

        {/* Summary */}
        <div className="grid-4" style={{ marginBottom: 32 }}>
          <div className="kpi-card">
            <div className="kpi-label">Policies Tracked</div>
            <div className="kpi-value">{POLICY_TIMELINE.length}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Total Investment</div>
            <div className="kpi-value" style={{ color: "#f6c90e" }}>${totalInvestment.toFixed(1)}B</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Time Span</div>
            <div className="kpi-value" style={{ fontSize: "1.5rem" }}>2008–2024</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Largest Program</div>
            <div className="kpi-value" style={{ fontSize: "1.2rem" }}>HAFF / Accord</div>
            <div className="kpi-delta">$10B each</div>
          </div>
        </div>

        {/* Vertical timeline */}
        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div style={{
            position: "absolute",
            left: 72,
            top: 0,
            bottom: 0,
            width: 2,
            background: "linear-gradient(to bottom, #2a2a4e, #f6c90e, #2a2a4e)",
          }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {POLICY_TIMELINE.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 0, paddingBottom: 28 }}>
                {/* Year */}
                <div style={{ width: 72, textAlign: "right", paddingRight: 20, paddingTop: 14 }}>
                  <span style={{ fontWeight: 800, color: "#f6c90e", fontSize: "1.1rem" }}>{p.year}</span>
                </div>

                {/* Dot */}
                <div style={{
                  width: 16, height: 16, borderRadius: "50%",
                  background: TYPE_COLORS[p.type] ?? "#f6c90e",
                  border: "3px solid #0f0f1a",
                  boxShadow: `0 0 10px ${TYPE_COLORS[p.type] ?? "#f6c90e"}66`,
                  flexShrink: 0,
                  marginTop: 16,
                  zIndex: 1,
                }} />

                {/* Card */}
                <div className="hive-card" style={{
                  flex: 1,
                  marginLeft: 20,
                  borderLeft: `3px solid ${TYPE_COLORS[p.type] ?? "#f6c90e"}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.92rem", marginBottom: 6 }}>{p.event}</div>
                      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f6c90e" }}>${p.amount_bn}B</span>
                        <span className="badge" style={{
                          background: `${TYPE_COLORS[p.type]}22`,
                          color: TYPE_COLORS[p.type],
                          border: `1px solid ${TYPE_COLORS[p.type]}44`,
                        }}>
                          {TYPE_LABELS[p.type]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="hive-card" style={{ marginTop: 16 }}>
          <div className="section-label">Policy Types</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {Object.entries(TYPE_LABELS).map(([type, label]) => (
              <div key={type} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", color: "#888" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: TYPE_COLORS[type] }} />
                {label}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
