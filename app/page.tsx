import { getSHSSummary } from "@/lib/data/shs"
import { getBuildingApprovalsSummary } from "@/lib/data/building-approvals"

export default function HomePage() {
  const shs = getSHSSummary()
  const approvals = getBuildingApprovalsSummary()

  const capabilities = [
    { title: "Evidence Synthesis", desc: "Synthesise findings across 681 indexed research reports instantly. Ask a question, get a sourced answer." },
    { title: "Live Demand Data", desc: "AIHW SHS quarterly updates, ABS building approvals, and state waitlist registers in one place." },
    { title: "Policy Impact Analysis", desc: "Query the evidence base for any major policy — HAFF, NRAS, Housing Accord — with confidence ratings." },
    { title: "Outcome Ledger", desc: "Track what government programs promised vs what they delivered, with funding efficiency analysis." },
    { title: "Population Projections", desc: "ABS Series B projections to 2044, disaggregated by state, with implied housing demand calculations." },
    { title: "State Intelligence", desc: "Deep-dive waitlist trends, building approvals, demographics, and social housing completions by state." },
    { title: "Construction Costs", desc: "Construction cost index from 2019–2025, global events timeline, and what $1B buys now vs then." },
    { title: "Policy Timeline", desc: "20 years of federal housing policy with investment amounts, types, and evidence of outcomes." },
  ]

  const userRoles = [
    { role: "CHPs & Housing Providers", desc: "Evidence for business cases, funding applications, and development proposals." },
    { role: "Policy Analysts", desc: "Program evaluation, cross-jurisdictional comparison, evidence synthesis." },
    { role: "Government Agencies", desc: "Research support for housing strategy, budget submissions, and ministerial briefings." },
    { role: "Researchers & Academics", desc: "Dataset access, literature review support, sector intelligence." },
    { role: "Advocates & Peak Bodies", desc: "Evidence-based advocacy with sourced data and policy impact analysis." },
    { role: "Funders & Investors", desc: "Market intelligence, sector capacity assessment, impact measurement frameworks." },
  ]

  const dataSources = [
    { abbr: "AHURI", name: "Australian Housing and Urban Research Institute", type: "Research" },
    { abbr: "AIHW", name: "Australian Institute of Health and Welfare (SHS, AIHIA)", type: "Government" },
    { abbr: "ABS 8731.0", name: "Building Approvals (monthly)", type: "Statistical" },
    { abbr: "ABS 3222.0", name: "Population Projections to 2044 (Series B)", type: "Statistical" },
    { abbr: "Housing Australia", name: "HAFF reports, NHFIC Annual Reports", type: "Government" },
    { abbr: "Treasury", name: "Budget papers, National Housing Accord documents", type: "Government" },
    { abbr: "State Authorities", name: "NSW DCJ, VIC DFFH, QLD DCHDE, WA DPLH, SA SAHT", type: "State" },
    { abbr: "SQM / CoreLogic", name: "Rental vacancy rates, property price indexes", type: "Commercial" },
  ]

  return (
    <div style={{ background: "#0f0f1a", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{
        position: "relative",
        backgroundImage: "url(https://images.pexels.com/photos/5103918/pexels-photo-5103918.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
        minHeight: 380,
        display: "flex",
        alignItems: "center",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(15,15,26,0.92) 0%, rgba(15,15,26,0.75) 100%)" }} />
        <div style={{ position: "relative", maxWidth: 1400, margin: "0 auto", padding: "60px 24px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <span className="badge badge-gold">Live Data</span>
            <span className="badge badge-grey">681 Reports Indexed</span>
            <span className="badge badge-grey">AI Synthesis</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, color: "#fff", marginBottom: 16, lineHeight: 1.15 }}>
            Housing Intelligence<br />&amp; Evidence
          </h1>
          <p style={{ fontSize: "1rem", color: "#aaa", maxWidth: 560, lineHeight: 1.7, marginBottom: 28 }}>
            Australia&apos;s housing crisis in numbers. Real-time data synthesis across 681 research reports, live government datasets, and 20 years of policy evidence.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="/ask-research" className="hive-btn" style={{ padding: "12px 24px", fontSize: "0.88rem", borderRadius: 10, display: "inline-block", textDecoration: "none" }}>
              Ask Research
            </a>
            <a href="/live-dashboard" className="hive-btn-outline" style={{ padding: "12px 24px", fontSize: "0.88rem", borderRadius: 10, display: "inline-block", textDecoration: "none" }}>
              Live Dashboard
            </a>
          </div>
        </div>
      </div>

      <div className="page-container">

        {/* Research index status */}
        <div className="hive-card" style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#27ae60" }} />
            <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: 2, color: "#888", fontWeight: 600 }}>Research Index — Live</span>
          </div>
          <div className="grid-3">
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#f6c90e" }}>681</div>
              <div style={{ fontSize: "0.78rem", color: "#888" }}>Research reports indexed</div>
            </div>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#3498db" }}>5,059</div>
              <div style={{ fontSize: "0.78rem", color: "#888" }}>Searchable text chunks</div>
            </div>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#27ae60" }}>2004–2025</div>
              <div style={{ fontSize: "0.78rem", color: "#888" }}>Publication range</div>
            </div>
          </div>
        </div>

        {/* Why this exists */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label">Why This Exists</div>
          <div className="grid-3">
            <div className="hive-card">
              <div style={{ fontSize: "1.2rem", marginBottom: 10 }}>The Problem</div>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: 8, fontSize: "0.92rem" }}></div>
              <div style={{ fontSize: "0.82rem", color: "#888", lineHeight: 1.7 }}>
                Australia is building 26% fewer homes than needed. 301,000 people sought crisis housing support last year. The waitlist across NSW, VIC, QLD, WA, and SA exceeds 203,500 households.
              </div>
            </div>
            <div className="hive-card">
              <div style={{ fontSize: "1.2rem", marginBottom: 10 }}>The Evidence Base</div>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: 8, fontSize: "0.92rem" }}></div>
              <div style={{ fontSize: "0.82rem", color: "#888", lineHeight: 1.7 }}>
                There are 681 research reports from AHURI, AIHW, ABS, Housing Australia, state authorities, and academic institutions. Most practitioners don&apos;t have time to read them.
              </div>
            </div>
            <div className="hive-card">
              <div style={{ fontSize: "1.2rem", marginBottom: 10 }}>The Solution</div>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: 8, fontSize: "0.92rem" }}></div>
              <div style={{ fontSize: "0.82rem", color: "#888", lineHeight: 1.7 }}>
                HIVE synthesises that evidence base instantly. Ask any question about Australian housing — get a sourced answer drawn from the research, not hallucinated by AI.
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="hive-card" style={{ marginBottom: 40, background: "linear-gradient(135deg, #1a1a2e, #0f0f1a)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 24, textAlign: "center" }}>
            {[
              { value: "12", label: "Intelligence Modules" },
              { value: "681+", label: "Research Reports" },
              { value: "10 yrs", label: "Historical Data" },
              { value: "+58%", label: "Build Cost Rise Since 2019" },
              { value: "2044", label: "Projection Horizon" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f6c90e" }}>{value}</div>
                <div style={{ fontSize: "0.72rem", color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live sector snapshot */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label">Live Sector Snapshot</div>
          <div className="grid-4">
            <div className="kpi-card">
              <div className="kpi-label">Annual Build Rate</div>
              <div className="kpi-value" style={{ color: "#e74c3c" }}>{(approvals.annual_run_rate / 1000).toFixed(0)}k</div>
              <div className="kpi-delta">{approvals.pct_of_target}% of 240k Accord target</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Annual Supply Shortfall</div>
              <div className="kpi-value" style={{ color: "#e74c3c" }}>{(approvals.gap_to_target / 1000).toFixed(0)}k</div>
              <div className="kpi-delta">Dwellings/year below Accord target</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Unmet SHS Requests</div>
              <div className="kpi-value" style={{ color: "#f39c12" }}>{(shs.unassisted_requests / 1000).toFixed(0)}k</div>
              <div className="kpi-delta">{shs.latest_year} · +{shs.unassisted_change_yoy}% YoY</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Housing Success Rate</div>
              <div className="kpi-value" style={{ color: "#f39c12" }}>{shs.housing_success_rate}%</div>
              <div className="kpi-delta">Of those needing housing, got it</div>
            </div>
          </div>
        </div>

        {/* What HIVE Does */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label">What HIVE Does</div>
          <div className="grid-4">
            {capabilities.map((cap) => (
              <div key={cap.title} className="hive-card hive-card-hover" style={{ cursor: "default" }}>
                <div style={{ fontWeight: 700, color: "#fff", marginBottom: 8, fontSize: "0.88rem" }}>{cap.title}</div>
                <div style={{ fontSize: "0.78rem", color: "#888", lineHeight: 1.6 }}>{cap.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Who Uses HIVE */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label">Who Uses HIVE</div>
          <div className="grid-3">
            {userRoles.map((r) => (
              <div key={r.role} className="hive-card hive-card-hover">
                <div style={{ fontWeight: 700, color: "#f6c90e", marginBottom: 6, fontSize: "0.88rem" }}>{r.role}</div>
                <div style={{ fontSize: "0.78rem", color: "#888", lineHeight: 1.6 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Sources */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label">Data Sources</div>
          <div className="grid-2">
            {dataSources.map((ds) => (
              <div key={ds.abbr} className="hive-card" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ minWidth: 90 }}>
                  <span style={{ fontWeight: 700, color: "#fff", fontSize: "0.82rem" }}>{ds.abbr}</span>
                  <div><span className="badge badge-grey" style={{ fontSize: "0.6rem", marginTop: 4 }}>{ds.type}</span></div>
                </div>
                <div style={{ fontSize: "0.78rem", color: "#888", lineHeight: 1.6 }}>{ds.name}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
