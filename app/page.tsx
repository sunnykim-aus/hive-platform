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
        backgroundPosition: "center 25%",
        minHeight: 520,
        display: "flex",
        alignItems: "flex-start",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(10,10,20,0.88) 0%, rgba(20,12,5,0.72) 50%, rgba(10,10,20,0.90) 100%)",
        }} />
        <div style={{ position: "relative", maxWidth: 1400, margin: "0 auto", padding: "40px 48px 56px", width: "100%" }}>
          <div style={{ maxWidth: "60%", textAlign: "left" }}>

            {/* Eyebrow */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(246,201,14,0.1)", border: "1px solid rgba(246,201,14,0.25)",
              borderRadius: 20, padding: "5px 14px", marginBottom: 22,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#f6c90e", display: "inline-block", boxShadow: "0 0 8px #f6c90e" }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                Australian Housing Intelligence Platform
              </span>
            </div>

            {/* H1 */}
            <h1 style={{
              fontSize: "clamp(2.2rem, 5.5vw, 3.6em)",
              fontWeight: 900,
              color: "#fff",
              marginBottom: 20,
              lineHeight: 1.0,
              letterSpacing: "-2px",
            }}>
              Housing Intelligence<br />
              <span style={{ color: "#f6c90e" }}>&amp; Evidence</span>
            </h1>

            {/* Subtext */}
            <p style={{ fontSize: "1.05rem", color: "#c8c8d8", lineHeight: 1.85, marginBottom: 32, maxWidth: 580 }}>
              Walk into every meeting with the numbers.{" "}
              <strong style={{ color: "#fff", fontWeight: 600 }}>Ask any question about Australian housing and get a cited, evidence-based answer in seconds</strong>{" "}
              — drawn from 681 indexed reports, live ABS &amp; AIHW data, and 20 years of policy history. Built for CHPs, advocates, developers, and investors who need evidence, not opinions.
            </p>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: 12, marginBottom: 36, flexWrap: "wrap" }}>
              <a href="/ask-research" className="hive-btn" style={{ padding: "13px 28px", fontSize: "0.9rem", borderRadius: 10, display: "inline-block", textDecoration: "none", fontWeight: 700 }}>
                🔍 Ask Research
              </a>
              <a href="/live-dashboard" className="hive-btn-outline" style={{ padding: "13px 28px", fontSize: "0.9rem", borderRadius: 10, display: "inline-block", textDecoration: "none" }}>
                Live Dashboard →
              </a>
            </div>

            {/* Badge pills — 2 rows of 5 */}
            {[
              [
                { label: "📄 681 Reports Indexed",           color: "#f6c90e", bg: "rgba(246,201,14,0.12)",  border: "rgba(246,201,14,0.3)" },
                { label: "🏛 ABS · AHURI · AIHW · Treasury", color: "#ccc",    bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.14)" },
                { label: "📈 Population Projections to 2044",color: "#ccc",    bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.14)" },
                { label: "🔴 Construction Cost Crisis",       color: "#e74c3c", bg: "rgba(231,76,60,0.1)",    border: "rgba(231,76,60,0.28)" },
                { label: "🤖 AI Synthesis · Word Export",     color: "#3498db", bg: "rgba(52,152,219,0.1)",   border: "rgba(52,152,219,0.28)" },
              ],
              [
                { label: "🗺 State-by-State Intelligence",   color: "#f39c12", bg: "rgba(243,156,18,0.1)",   border: "rgba(243,156,18,0.28)" },
                { label: "🏠 Live Building Approvals",       color: "#27ae60", bg: "rgba(39,174,96,0.1)",    border: "rgba(39,174,96,0.28)" },
                { label: "📋 Social Housing Waitlists",      color: "#ccc",    bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.14)" },
                { label: "💰 HAFF Round Analysis",           color: "#9b59b6", bg: "rgba(155,89,182,0.1)",   border: "rgba(155,89,182,0.28)" },
                { label: "📅 20 Years of Policy History",    color: "#ccc",    bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.14)" },
              ],
            ].map((row, ri) => (
              <div key={ri} style={{ display: "flex", gap: 8, marginBottom: ri === 0 ? 8 : 0 }}>
                {row.map(({ label, color, bg, border }) => (
                  <span key={label} style={{
                    display: "inline-block",
                    padding: "5px 12px",
                    borderRadius: 20,
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    letterSpacing: "0.2px",
                    whiteSpace: "nowrap",
                    color,
                    background: bg,
                    border: `1px solid ${border}`,
                  }}>
                    {label}
                  </span>
                ))}
              </div>
            ))}

          </div>
        </div>
      </div>

      <div className="page-container">

        {/* ── Research index status ────────────────────────── */}
        <div style={{
          background: "linear-gradient(135deg, #13131f, #1a1a2e)",
          border: "1px solid #2a2a4e", borderRadius: 12,
          padding: "20px 28px", marginBottom: 32,
        }}>
          <div style={{ display: "flex", gap: 40, alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1.5px", color: "#666", marginBottom: 4 }}>Reports Indexed</div>
              <div style={{ fontSize: "2em", fontWeight: 800, color: "#fff", lineHeight: 1 }}>683</div>
              <div style={{ fontSize: "0.78rem", color: "#888", marginTop: 4 }}>AHURI · ABS · AIHW · Treasury</div>
            </div>
            <div style={{ width: 1, height: 48, background: "#2a2a4e" }} />
            <div>
              <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1.5px", color: "#666", marginBottom: 4 }}>Searchable Chunks</div>
              <div style={{ fontSize: "2em", fontWeight: 800, color: "#fff", lineHeight: 1 }}>5,059</div>
              <div style={{ fontSize: "0.78rem", color: "#888", marginTop: 4 }}>Vector embeddings ready</div>
            </div>
            <div style={{ width: 1, height: 48, background: "#2a2a4e" }} />
            <div>
              <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1.5px", color: "#666", marginBottom: 4 }}>AI Search Status</div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#27ae60", marginTop: 4 }}>
                <span style={{ fontSize: "0.7em" }}>●</span> Live &amp; Indexed
              </div>
              <div style={{ fontSize: "0.78rem", color: "#888", marginTop: 4 }}>Ready — use Ask Research to query</div>
            </div>
            <div style={{ width: 1, height: 48, background: "#2a2a4e" }} />
            <div>
              <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1.5px", color: "#666", marginBottom: 4 }}>Last Indexed</div>
              <div style={{ fontSize: "0.95em", fontWeight: 700, color: "#fff", marginTop: 4 }}>May 2024</div>
              <div style={{ fontSize: "0.78rem", color: "#888", marginTop: 4 }}>Re-run pipeline to update</div>
            </div>
          </div>
        </div>

        {/* ── Why This Exists ──────────────────────────────── */}
        <div style={{ marginBottom: 36 }}>
          <div className="section-label">Why This Exists</div>
          <div className="grid-3">
            <div className="hive-card">
              <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>📋</div>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: 8, fontSize: "0.95rem" }}>The Problem</div>
              <div style={{ fontSize: "0.82rem", color: "#aaa", lineHeight: 1.75 }}>
                Every week, sector professionals need evidence fast — for submissions, board papers, grant applications. The answers exist. Finding them takes days.
              </div>
            </div>
            <div className="hive-card">
              <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>📚</div>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: 8, fontSize: "0.95rem" }}>The Evidence Base</div>
              <div style={{ fontSize: "0.82rem", color: "#aaa", lineHeight: 1.75 }}>
                681 reports across AHURI, ABS, AIHW, Treasury and state housing registers — synthesised and searchable in seconds.
              </div>
            </div>
            <div className="hive-card">
              <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>⚡</div>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: 8, fontSize: "0.95rem" }}>The Solution</div>
              <div style={{ fontSize: "0.82rem", color: "#aaa", lineHeight: 1.75 }}>
                HIVE connects the evidence base to live data and AI synthesis — collapsing the time between question and answer from days to minutes.
              </div>
            </div>
          </div>
        </div>

        {/* ── Insight quote ────────────────────────────────── */}
        <div className="insight-box" style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "#f6c90e",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.7rem", fontWeight: 800, color: "#0f0f1a", flexShrink: 0,
            }}>
              SK
            </div>
            <div>
              <p style={{ fontSize: "0.95rem", color: "#d0d0d0", lineHeight: 1.9, fontStyle: "italic", marginBottom: 16 }}>
                &ldquo;Housing policy decisions are made with incomplete information. HIVE exists to close that gap — making 20 years of research and live data accessible to everyone working on the housing crisis, not just those with the time to read hundreds of reports.&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "0.88rem", color: "#f6c90e", fontWeight: 700 }}>Sunny Kim</span>
                <span style={{ color: "#444" }}>·</span>
                <span style={{ fontSize: "0.82rem", color: "#888" }}>Housing Data Lead · Community Housing Professional, Australia</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Platform stats bar ───────────────────────────── */}
        <div style={{
          background: "linear-gradient(135deg, #1a1a2e, #0f0f1a)",
          border: "1px solid #2a2a4e", borderRadius: 12,
          padding: "20px 28px", marginBottom: 36,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 0,
        }}>
          {[
            { value: "12", label: "Platform Modules", color: "#f6c90e" },
            { value: "681+", label: "Reports Indexed", color: "#fff" },
            { value: "10 yrs", label: "Population History", color: "#fff" },
            { value: "+58%", label: "Construction Cost Rise", color: "#e74c3c" },
            { value: "2044", label: "Projections To", color: "#fff" },
          ].map((stat, i) => (
            <div key={stat.label} style={{ display: "flex", alignItems: "stretch", flex: 1 }}>
              {i > 0 && <div style={{ width: 1, background: "#2a2a4e", margin: "0 0", alignSelf: "stretch" }} />}
              <div style={{ flex: 1, textAlign: "center", padding: "8px 16px" }}>
                <div style={{ fontSize: "1.6em", fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "1px", color: "#666", marginTop: 6 }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── The Housing Crisis in Numbers ───────────────── */}
        <div style={{ marginBottom: 36 }}>
          <div className="section-label">The Housing Crisis in Numbers — Right Now</div>
          <div className="grid-4" style={{ marginBottom: 20 }}>
            <div className="kpi-card">
              <div className="kpi-label">Dwellings Built Per Year</div>
              <div className="kpi-value" style={{ color: "#f6c90e" }}>{approvals.annual_run_rate.toLocaleString()}</div>
              <div className="kpi-delta" style={{ color: "#e74c3c" }}>{approvals.pct_of_target}% of the 240,000 National Accord target</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Annual Supply Shortfall</div>
              <div className="kpi-value" style={{ color: "#f39c12" }}>{approvals.gap_to_target.toLocaleString()}</div>
              <div className="kpi-delta">Dwellings per year below what Australia needs</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Unmet Housing Requests (2023–24)</div>
              <div className="kpi-value" style={{ color: "#f39c12" }}>{shs.unassisted_requests.toLocaleString()}</div>
              <div className="kpi-delta">People who sought help and didn&apos;t receive housing</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Housing Success Rate (SHS)</div>
              <div className="kpi-value" style={{ color: "#f39c12" }}>{shs.housing_success_rate}%</div>
              <div className="kpi-delta">Only 1 in 4 people who needed housing actually received it</div>
            </div>
          </div>

          {/* Insight box */}
          <div className="callout-gold" style={{ fontSize: "0.88rem", color: "#ccc", lineHeight: 1.8 }}>
            <strong style={{ color: "#f6c90e" }}>What this means for community housing:</strong><br />
            Australia is building at <strong style={{ color: "#fff" }}>{approvals.pct_of_target}% of the pace needed</strong> to meet the National Housing Accord — a shortfall of <strong style={{ color: "#e74c3c" }}>{approvals.gap_to_target.toLocaleString()} dwellings every year</strong>. At the same time, demand is accelerating: <strong>{shs.unassisted_requests.toLocaleString()} people</strong> sought homelessness services last year and left without housing. There are over <strong style={{ color: "#fff" }}>203,500 approved applicants</strong> on social housing waitlists across the major states — a confirmed tenant pipeline that no private developer can match.
            <br /><br />
            Compounding this: net overseas migration hit a record <strong style={{ color: "#f6c90e" }}>518,000 in 2023</strong> — more than double the pre-COVID average — driving national rental vacancy to 1.0% and rents 48% above 2015 levels. And the same $1B that built 3,226 social homes in 2019 builds only <strong style={{ color: "#e74c3c" }}>1,786 today</strong>, after a 58% rise in construction costs since COVID. The case for community housing investment has never been stronger — and the evidence to make that case has never been more complete.
            <br /><br />
            <em style={{ color: "#666" }}>ABS Building Approvals (Cat. 8731.0), AIHW SHS Annual Report 2023–24, ABS Cat. 3412.0 (migration), ABS PPI House Construction (Cat. 6427.0). Updated May 2026.</em>
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
