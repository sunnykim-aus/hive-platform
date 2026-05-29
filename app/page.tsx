import { getSHSSummary } from "@/lib/data/shs"
import { getBuildingApprovalsSummary } from "@/lib/data/building-approvals"

export default function HomePage() {
  const shs = getSHSSummary()
  const approvals = getBuildingApprovalsSummary()

  const capabilities = [
    { title: "Evidence Synthesis", desc: "Synthesise findings across 681 indexed research reports instantly. Ask a question, get a sourced answer.", nav: "Ask Research", href: "/ask-research", navColor: "#f6c90e" },
    { title: "Live Demand Data", desc: "AIHW SHS quarterly updates, ABS building approvals, and state waitlist registers in one place.", nav: "Live Dashboard", href: "/live-dashboard", navColor: "#3498db" },
    { title: "Policy Impact Analysis", desc: "Query the evidence base for any major policy — HAFF, NRAS, Housing Accord — with confidence ratings.", nav: "Policy Impact", href: "/policy-impact", navColor: "#9b59b6" },
    { title: "Outcome Ledger", desc: "Track what government programs promised vs what they delivered, with funding efficiency analysis.", nav: "Outcomes", href: "/outcome-ledger", navColor: "#27ae60" },
    { title: "Population Projections", desc: "ABS Series B projections to 2044, disaggregated by state, with implied housing demand calculations.", nav: "Population", href: "/population", navColor: "#e74c3c" },
    { title: "State Intelligence", desc: "Deep-dive waitlist trends, building approvals, demographics, and social housing completions by state.", nav: "Demand & Supply", href: "/state-demand-supply", navColor: "#f39c12" },
    { title: "Construction Costs", desc: "Construction cost index from 2019–2025, global events timeline, and what $1B buys now vs then.", nav: "Conditions", href: "/conditions", navColor: "#888" },
    { title: "Policy Timeline", desc: "20 years of federal housing policy with investment amounts, types, and evidence of outcomes.", nav: "Timeline", href: "/policy-timeline", navColor: "#3498db" },
  ]

  const userRoles = [
    { role: "CEO / Executive Director", icon: "🏢", desc: "Board-ready evidence, sector snapshot, and program benchmarking for executive decisions.", pills: ["Policy Impact", "HAFF", "Outcomes"] },
    { role: "Policy & Advocacy", icon: "📣", desc: "Program evaluation, cross-jurisdictional comparison, and evidence synthesis for advocacy briefs.", pills: ["Ask Research", "Policy Impact", "Timeline"] },
    { role: "Development Manager", icon: "🏗️", desc: "Site feasibility, construction cost trends, state pipeline data, and HAFF round analysis.", pills: ["HAFF", "Conditions", "Demand & Supply"] },
    { role: "Grants & Funding", icon: "💰", desc: "Evidence for funding applications, program benchmarks, and impact measurement frameworks.", pills: ["Outcomes", "Ask Research", "Reports"] },
    { role: "Impact Investor", icon: "📊", desc: "Market intelligence, sector capacity, housing supply gap analysis, and policy risk.", pills: ["Live Dashboard", "Population", "Conditions"] },
    { role: "Government Stakeholder", icon: "🏛️", desc: "Research support for housing strategy, budget submissions, and ministerial briefings.", pills: ["Ask Research", "Population", "HAFF"] },
  ]

  // Data sources matching Streamlit "What Data Powers HIVE" section
  const dataSources = [
    {
      abbr: "AHURI",
      subtitle: "Australian Housing and Urban Research Institute",
      desc: "15 years of final reports, policy bulletins, research briefs and evidence reviews — the authoritative academic source on Australian housing.",
      color: "#e74c3c",
    },
    {
      abbr: "Housing Australia",
      subtitle: "Housing Australia (formerly NHFIC)",
      desc: "Annual reports, Home Guarantee Scheme trends, bond aggregation data, and social housing investment reports.",
      color: "#3498db",
    },
    {
      abbr: "Treasury",
      subtitle: "Australian Government Treasury",
      desc: "Federal Budget Papers (2010–2026) — Budget Paper 2 lists every housing program, its funding, and year-by-year allocations. The financial ground truth.",
      color: "#f6c90e",
    },
    {
      abbr: "ABS",
      subtitle: "Australian Bureau of Statistics",
      desc: "Building approvals (monthly), Census housing data, residential property price indexes, housing occupancy and costs surveys.",
      color: "#f6c90e",
    },
    {
      abbr: "AIHW",
      subtitle: "Australian Institute of Health and Welfare",
      desc: "Specialist Homelessness Services annual reports, homelessness estimates from Census, Indigenous housing data — the authoritative source on housing outcomes.",
      color: "#9b59b6",
    },
    {
      abbr: "Productivity Commission",
      subtitle: "Productivity Commission",
      desc: "Major housing inquiries including the landmark 2022 Housing and Homelessness report, rental assistance review, and Report on Government Services (housing chapter).",
      color: "#27ae60",
    },
    {
      abbr: "DSS",
      subtitle: "Department of Social Services",
      desc: "National Housing and Homelessness Agreement, National Rental Affordability Scheme documentation, homelessness strategy policy papers.",
      color: "#888",
    },
    {
      abbr: "Power Housing",
      subtitle: "Power Housing Australia",
      desc: "Community housing sector peak body publications and State of the Sector reports (where accessible).",
      color: "#888",
    },
  ]

  const pillHrefMap: Record<string, string> = {
    "Ask Research": "/ask-research",
    "Policy Impact": "/policy-impact",
    "Timeline": "/policy-timeline",
    "HAFF": "/haff",
    "Outcomes": "/outcome-ledger",
    "Reports": "/reports",
    "Conditions": "/conditions",
    "Demand & Supply": "/state-demand-supply",
    "Live Dashboard": "/live-dashboard",
    "Population": "/population",
  }

  return (
    <div style={{ background: "#0f0f1a", minHeight: "100vh" }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <div style={{
        position: "relative",
        backgroundImage: "url(https://images.pexels.com/photos/5103918/pexels-photo-5103918.jpeg?auto=compress&cs=tinysrgb&w=1400)",
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
        minHeight: 380,
        display: "flex",
        alignItems: "center",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(10,10,20,0.88) 0%, rgba(20,12,5,0.72) 50%, rgba(10,10,20,0.90) 100%)",
        }} />
        <div style={{ position: "relative", maxWidth: 1400, margin: "0 auto", padding: "64px 28px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
            <span className="badge badge-gold">Live Data</span>
            <span className="badge badge-grey">681 Reports Indexed</span>
            <span className="badge badge-grey">AI Synthesis</span>
            <span className="badge badge-grey">Open to Housing Sector</span>
            <span className="badge badge-grey">Updated Monthly</span>
          </div>
          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.2em)",
            fontWeight: 900,
            color: "#fff",
            marginBottom: 18,
            lineHeight: 1.12,
            letterSpacing: "-0.5px",
          }}>
            Housing Intelligence<br />&amp; Evidence
          </h1>
          <p style={{ fontSize: "1rem", color: "#bbb", maxWidth: 580, lineHeight: 1.75, marginBottom: 28 }}>
            Australia&apos;s housing crisis in numbers. Real-time data synthesis across 681 research reports, live government datasets, and 20 years of policy evidence — built for the housing sector.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="/ask-research" className="hive-btn" style={{ padding: "12px 26px", fontSize: "0.88rem", borderRadius: 10, display: "inline-block", textDecoration: "none" }}>
              🔍 Ask Research
            </a>
            <a href="/live-dashboard" className="hive-btn-outline" style={{ padding: "12px 26px", fontSize: "0.88rem", borderRadius: 10, display: "inline-block", textDecoration: "none" }}>
              Live Dashboard →
            </a>
          </div>
        </div>
      </div>

      <div className="page-container">

        {/* ── Research index status ────────────────────────── */}
        <div className="hive-card" style={{ marginBottom: 32, background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#27ae60", boxShadow: "0 0 6px #27ae60" }} />
            <span style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: 2, color: "#888", fontWeight: 600 }}>Research Index — Live</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            <div>
              <div className="stat-highlight">681</div>
              <div className="stat-label">Reports Indexed</div>
            </div>
            <div>
              <div className="stat-highlight" style={{ color: "#3498db" }}>5,059</div>
              <div className="stat-label">Searchable Chunks</div>
            </div>
            <div>
              <div className="stat-highlight" style={{ color: "#27ae60" }}>Active</div>
              <div className="stat-label">AI Search Status</div>
            </div>
            <div>
              <div className="stat-highlight" style={{ color: "#888", fontSize: "1.4em" }}>May 2025</div>
              <div className="stat-label">Last Indexed</div>
            </div>
          </div>
        </div>

        {/* ── Why This Exists ──────────────────────────────── */}
        <div style={{ marginBottom: 36 }}>
          <div className="section-label">Why This Exists</div>
          <div className="grid-3">
            <div className="hive-card">
              <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>🔴</div>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: 8, fontSize: "0.95rem" }}>The Problem</div>
              <div style={{ fontSize: "0.82rem", color: "#aaa", lineHeight: 1.75 }}>
                Australia is building <strong style={{ color: "#e74c3c" }}>26% fewer homes</strong> than needed. {shs.total_clients.toLocaleString()} people sought crisis housing support last year. The waitlist across NSW, VIC, QLD, WA, and SA exceeds 203,500 households.
              </div>
            </div>
            <div className="hive-card">
              <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>📚</div>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: 8, fontSize: "0.95rem" }}>The Evidence Base</div>
              <div style={{ fontSize: "0.82rem", color: "#aaa", lineHeight: 1.75 }}>
                There are <strong style={{ color: "#f6c90e" }}>681 research reports</strong> from AHURI, AIHW, ABS, Housing Australia, state authorities, and academic institutions. Most practitioners don&apos;t have time to read them.
              </div>
            </div>
            <div className="hive-card">
              <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>🐝</div>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: 8, fontSize: "0.95rem" }}>The Solution</div>
              <div style={{ fontSize: "0.82rem", color: "#aaa", lineHeight: 1.75 }}>
                HIVE synthesises that evidence base instantly. Ask any question about Australian housing — get a <strong style={{ color: "#f6c90e" }}>sourced answer</strong> drawn from the research, not hallucinated by AI.
              </div>
            </div>
          </div>
        </div>

        {/* ── Insight quote ────────────────────────────────── */}
        <div className="insight-box" style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "linear-gradient(135deg, #f6c90e, #e0a800)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.9rem", fontWeight: 800, color: "#0f0f1a", flexShrink: 0,
            }}>
              SK
            </div>
            <div>
              <p style={{ fontSize: "0.88rem", color: "#ccc", lineHeight: 1.8, fontStyle: "italic", marginBottom: 8 }}>
                &ldquo;Housing policy decisions are made with incomplete information. HIVE exists to close that gap — making 20 years of research and live data accessible to everyone working on the housing crisis, not just those with the time to read hundreds of reports.&rdquo;
              </p>
              <div style={{ fontSize: "0.72rem", color: "#f6c90e", fontWeight: 600 }}>Sunny Kim · Housing Data Lead</div>
            </div>
          </div>
        </div>

        {/* ── Platform stats bar ───────────────────────────── */}
        <div className="hive-card" style={{ marginBottom: 36, background: "linear-gradient(135deg, #1a1a2e, #0f0f1a)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 24, textAlign: "center" }}>
            <div>
              <div className="stat-highlight">12</div>
              <div className="stat-label">Platform Modules</div>
            </div>
            <div>
              <div className="stat-highlight">681+</div>
              <div className="stat-label">Reports Indexed</div>
            </div>
            <div>
              <div className="stat-highlight">10 yrs</div>
              <div className="stat-label">Population History</div>
            </div>
            <div>
              <div className="stat-highlight" style={{ color: "#e74c3c" }}>+58%</div>
              <div className="stat-label">Construction Cost Rise</div>
            </div>
            <div>
              <div className="stat-highlight">2044</div>
              <div className="stat-label">Projections To</div>
            </div>
          </div>
        </div>

        {/* ── The Housing Crisis in Numbers ───────────────── */}
        <div style={{ marginBottom: 36 }}>
          <div className="section-label">The Housing Crisis in Numbers</div>
          <div className="grid-4">
            <div className="kpi-card">
              <div className="kpi-label">Annual Build Rate</div>
              <div className="kpi-value" style={{ color: "#e74c3c" }}>{(approvals.annual_run_rate / 1000).toFixed(0)}k</div>
              <div className="kpi-delta">{approvals.pct_of_target}% of 240k Accord target</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Annual Supply Shortfall</div>
              <div className="kpi-value" style={{ color: "#e74c3c" }}>{(approvals.gap_to_target / 1000).toFixed(0)}k</div>
              <div className="kpi-delta">Dwellings/year below target</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">SHS Clients {shs.latest_year}</div>
              <div className="kpi-value" style={{ color: "#f39c12" }}>{(shs.total_clients / 1000).toFixed(0)}k</div>
              <div className="kpi-delta">{shs.client_change_yoy > 0 ? "+" : ""}{shs.client_change_yoy}% YoY</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Unmet SHS Requests</div>
              <div className="kpi-value" style={{ color: "#f39c12" }}>{(shs.unassisted_requests / 1000).toFixed(0)}k</div>
              <div className="kpi-delta">{shs.latest_year} · unassisted</div>
            </div>
          </div>
        </div>

        {/* ── Platform capabilities ────────────────────────── */}
        <div style={{ marginBottom: 36 }}>
          <div className="section-label">What HIVE Does</div>
          <div className="grid-4">
            {capabilities.map((cap) => (
              <a key={cap.title} href={cap.href} style={{ textDecoration: "none" }}>
                <div className="role-card" style={{ height: "100%" }}>
                  <div style={{ fontWeight: 700, color: "#fff", marginBottom: 8, fontSize: "0.9rem" }}>{cap.title}</div>
                  <div style={{ fontSize: "0.78rem", color: "#aaa", lineHeight: 1.65, marginBottom: 14 }}>{cap.desc}</div>
                  <div>
                    <span className="badge" style={{
                      background: `${cap.navColor}22`,
                      color: cap.navColor,
                      border: `1px solid ${cap.navColor}44`,
                      fontSize: "0.62rem",
                    }}>{cap.nav} →</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── Who Uses HIVE ────────────────────────────────── */}
        <div style={{ marginBottom: 36 }}>
          <div className="section-label">Who Uses HIVE</div>
          <div className="grid-3">
            {userRoles.map((r) => (
              <div key={r.role} className="role-card">
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: "1.4rem" }}>{r.icon}</span>
                  <span className="role-title">{r.role}</span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "#aaa", lineHeight: 1.65, marginBottom: 12 }}>{r.desc}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {r.pills.map((pill) => (
                    <a key={pill} href={pillHrefMap[pill] ?? "#"} style={{ textDecoration: "none" }}>
                      <span className="badge badge-grey" style={{ fontSize: "0.62rem", cursor: "pointer" }}>{pill}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Not Sure Where to Start ──────────────────────── */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: 8 }}>Not Sure Where to Start? Search Anything</h2>
          <p style={{ fontSize: "0.88rem", color: "#888", marginBottom: 16 }}>
            Type a question, a policy name, a housing issue — HIVE will find what the research says.
          </p>
          <a href="/ask-research" style={{ textDecoration: "none", display: "block" }}>
            <div style={{
              background: "#1a1a2e",
              border: "1px solid #2a2a4e",
              borderRadius: 10,
              padding: "14px 20px",
              fontSize: "0.88rem",
              color: "#555",
              cursor: "pointer",
              transition: "border-color 0.2s",
            }}>
              e.g. What does the research say about social housing waitlists in Victoria?
            </div>
          </a>
        </div>

        {/* ── What Data Powers HIVE ────────────────────────── */}
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: 8 }}>What Data Powers HIVE</h2>
          <p style={{ fontSize: "0.88rem", color: "#888", marginBottom: 20 }}>
            Every answer HIVE gives is grounded in real publications from these sources. Nothing is made up. Every claim can be traced to a specific report.
          </p>

          {/* Stats row */}
          <div className="hive-card" style={{ marginBottom: 20, background: "linear-gradient(135deg, #1a1a2e, #0f0f1a)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "center" }}>
              <div>
                <div className="stat-highlight">683</div>
                <div className="stat-label">Reports Indexed</div>
              </div>
              <div>
                <div className="stat-highlight">5,059</div>
                <div className="stat-label">Searchable Chunks</div>
              </div>
              <div>
                <div className="stat-highlight">8</div>
                <div className="stat-label">Data Sources</div>
              </div>
              <div>
                <div className="stat-highlight">15+</div>
                <div className="stat-label">Years of Research</div>
              </div>
            </div>
          </div>

          {/* Source cards */}
          <div className="grid-2">
            {dataSources.map((ds) => (
              <div key={ds.abbr} className="data-source-card" style={{ borderLeftColor: ds.color }}>
                <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.92rem", marginBottom: 3 }}>{ds.abbr}</div>
                <div style={{ fontSize: "0.72rem", color: "#666", marginBottom: 10 }}>{ds.subtitle}</div>
                <div style={{ fontSize: "0.8rem", color: "#aaa", lineHeight: 1.65 }}>{ds.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── How the data pipeline works ─────────────────── */}
        <div className="callout-gold" style={{ marginBottom: 40, fontSize: "0.85rem", color: "#ccc", lineHeight: 1.8 }}>
          <strong style={{ color: "#f6c90e" }}>How the data pipeline works:</strong> HIVE&apos;s crawler automatically downloads PDFs and HTML pages from each source above. Each document is split into ~400-word chunks and embedded using a local AI model. When you search, HIVE finds the most relevant chunks semantically — not just by keyword — then sends them to Claude to synthesise a coherent, cited answer. The pipeline runs on your machine. No data leaves your environment except the Claude API call. Re-run the pipeline at any time from Browse Reports to pick up new publications.
        </div>

      </div>
    </div>
  )
}
