import { getSHSSummary } from "@/lib/data/shs"
import { getBuildingApprovalsSummary } from "@/lib/data/building-approvals"
import PortfolioBanner from "@/components/PortfolioBanner"

export default function HomePage() {
  const shs = getSHSSummary()
  const approvals = getBuildingApprovalsSummary()

  // ── Situation Room — show 3 on homepage, all 6 exist ─────────────────────
  const SITUATION_CARDS = [
    {
      status: "BELOW TARGET", statusColor: "#c0614a", topic: "Housing Accord",
      primaryValue: `${approvals.pct_of_target}%`, primaryLabel: "of required pace",
      metric: `${approvals.annual_run_rate.toLocaleString()} homes/yr · ${approvals.gap_to_target.toLocaleString()} shortfall`,
      context: `${approvals.gap_to_target.toLocaleString()} annual shortfall vs 240,000 target. At this rate, the 1.2M goal misses by 315,000+ homes.`,
      action: "Planning reform is the fastest zero-cost lever — states are blocking it.",
      href: "/state-demand-supply", linkLabel: "Supply Pipeline →",
    },
    {
      status: "IN PROGRESS", statusColor: "#c49a3a", topic: "HAFF Delivery",
      primaryValue: "47%", primaryLabel: "contracted",
      metric: "18,650 of 40,000 homes · R3 in assessment",
      context: "Round 3 applications open Jan 2026 targeting the remaining 21,350. Full delivery by 2029 requires flawless Round 3 execution.",
      action: "Contracting decisions in late 2026 determine whether the 40,000-home commitment is met.",
      href: "/funding-sector", linkLabel: "Funding & Programs →",
    },
    {
      status: "ERODING CAPACITY", statusColor: "#c0614a", topic: "Construction Costs",
      primaryValue: "−45%", primaryLabel: "purchasing power",
      metric: "$1B builds 1,786 homes today vs 3,226 in 2019",
      context: "58.5% cost inflation since 2019. Programs announced at 2022 costs face structural funding gaps that compound every year without adjustment.",
      action: "Grant rates in HAFF Round 3 must reflect current build costs — not 2022 assumptions.",
      href: "/feasibility", linkLabel: "Development Viability →",
    },
  ]

  // ── Entry points — 4 capability-framed actions ───────────────────────────
  const ENTRY_POINTS = [
    {
      title: "Understand who needs housing",
      desc: "Who needs housing, where they are, and why the private market structurally fails them. Cohort profiles, waitlists, and rental stress by region.",
      href: "/housing-need", color: "#6b8aa0", cta: "Housing Need →",
    },
    {
      title: "Prove your development stacks up",
      desc: "Per-dwelling funding waterfall — TDC, HAFF grant, HA debt capacity, and residual gap. Model any state, typology, or HAFF scenario instantly.",
      href: "/feasibility", color: "#5aad8a", cta: "Development Viability →",
    },
    {
      title: "Know your sustainability exposure",
      desc: "Climate risk, NatHERS ratings, LHD compliance, and ESG benchmarks — connected across 152 suburbs and all 8 states. The only platform that shows the compound picture.",
      href: "/sustainability", color: "#1abc9c", cta: "Sustainability →",
    },
    {
      title: "Ask the evidence",
      desc: "681 indexed research reports — AHURI, AIHW, ABS, Treasury, Rawlinsons. Ask any question and get a cited answer. Every claim traced to a primary source.",
      href: "/research", color: "#f6c90e", cta: "Evidence & Policy →",
    },
  ]

  // ── Capabilities ─────────────────────────────────────────────────────────
  const capabilities = [
    { title: "Housing Data",          desc: "Live SHS quarterly data, ABS building approvals, state waitlist registers, and sector benchmarks — updated monthly.",          nav: "Housing Data →",          href: "/live-dashboard",      navColor: "#4d7fb5" },
    { title: "Housing Need",          desc: "Who needs housing and why. Population projections, homelessness cohort profiles, household composition, rental stress by region.", nav: "Housing Need →",          href: "/housing-need",        navColor: "#6b8aa0" },
    { title: "Supply Pipeline",       desc: "State-by-state supply intelligence — waitlist trends, building approvals, social housing completions, and the gap to demand.",   nav: "Supply Pipeline →",       href: "/state-demand-supply", navColor: "#c49a3a" },
    { title: "Development Viability", desc: "Per-dwelling funding waterfall — construction cost, HAFF grant, HA debt capacity, and residual equity gap. Any state or typology.", nav: "Development Viability →", href: "/feasibility",         navColor: "#5aad8a" },
    { title: "Funding & Programs",    desc: "Every active funding program catalogued — HAFF rounds, HA lending, state grants, tax incentives, and CHP sector benchmarks.",   nav: "Funding & Programs →",    href: "/funding-sector",      navColor: "#c49a3a" },
    { title: "Sustainability",        desc: "Climate risk (152 suburbs), NatHERS energy ratings, LHD compliance, and ESG intelligence — all connected in one place.",        nav: "Sustainability →",        href: "/sustainability",       navColor: "#1abc9c" },
    { title: "Asset Intelligence",    desc: "Compound risk scoring — Climate × Energy × LHD — per suburb. Identify extreme-risk assets and model remediation cost.",          nav: "Asset Intelligence →",    href: "/asset-intelligence",  navColor: "#e67e22" },
    { title: "Evidence & Policy",     desc: "Ask any question, get a cited answer from 681 indexed reports. 20 years of policy history, program scorecards, source library.", nav: "Evidence & Policy →",     href: "/research",            navColor: "#f6c90e" },
  ]

  // ── 4 personas ────────────────────────────────────────────────────────────
  const personas = [
    {
      role: "CEO / Executive Director",
      desc: "Walk into every board meeting knowing what the research says. Sector benchmarks, program performance, and housing need data — board-ready in seconds.",
      pills: ["Housing Data", "Evidence & Policy", "Asset Intelligence"],
    },
    {
      role: "Development Manager",
      desc: "Build HAFF submissions that hold up to scrutiny. Model feasibility, benchmark construction costs by state, and track the pipeline against demand.",
      pills: ["Development Viability", "Funding & Programs", "Sustainability"],
    },
    {
      role: "Policy & Advocacy Officer",
      desc: "Synthesise evidence across 681 reports for submissions, ministerial correspondence, and advocacy briefs. Cross-jurisdictional comparisons in seconds.",
      pills: ["Evidence & Policy", "Housing Need", "Supply Pipeline"],
    },
    {
      role: "Impact Investor / Financier",
      desc: "Market sizing, sector capacity, supply gap quantification, viability modelling, ESG benchmarks, and climate risk — all the intelligence an investment decision needs.",
      pills: ["Development Viability", "Sustainability", "Funding & Programs"],
    },
  ]

  // ── Key data sources (6 of 13 shown on homepage) ─────────────────────────
  const keyDataSources = [
    { abbr: "AHURI",             subtitle: "Australian Housing and Urban Research Institute",  desc: "The primary academic source — 15+ years of final reports and evidence reviews on every dimension of Australian housing.", color: "#c0614a" },
    { abbr: "AIHW",              subtitle: "Australian Institute of Health and Welfare",       desc: "Specialist Homelessness Services quarterly data, homelessness estimates, Indigenous housing, and housing assistance outcomes.", color: "#6b8aa0" },
    { abbr: "ABS",               subtitle: "Australian Bureau of Statistics",                  desc: "Building approvals (Cat. 8731.0), Census housing data, income surveys, and population projections Series B to 2066.", color: "#f6c90e" },
    { abbr: "Housing Australia",  subtitle: "Housing Australia (formerly NHFIC)",              desc: "HAFF program data, bond aggregation reports, lending guidelines, and annual State of the Nation's Housing reports.", color: "#4d7fb5" },
    { abbr: "Rawlinsons",        subtitle: "Rawlinsons Australian Construction Handbook",      desc: "Annual construction cost benchmarks by typology and state — the industry standard. 2019–2025 series underpins the HIVE cost index.", color: "#e67e22" },
    { abbr: "State HAs",         subtitle: "All 8 State & Territory Housing Authorities",     desc: "Social housing waitlist registers, public housing stock data, and annual reports — sourced directly from each jurisdiction.", color: "#c49a3a" },
  ]

  const pillHrefMap: Record<string, string> = {
    "Housing Data": "/live-dashboard", "Housing Need": "/housing-need",
    "Supply Pipeline": "/state-demand-supply", "Development Viability": "/feasibility",
    "Funding & Programs": "/funding-sector", "Sustainability": "/sustainability",
    "Asset Intelligence": "/asset-intelligence", "Evidence & Policy": "/research",
  }

  const sh = { fontSize: "1.05rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.3px", marginBottom: 6 } as const
  const divider = { borderTop: "1px solid #1e2d40", paddingTop: 32, marginBottom: 32 } as const

  return (
    <div style={{ background: "#0b1220", minHeight: "100vh" }}>

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <div style={{
        position: "relative",
        backgroundImage: "url(https://images.pexels.com/photos/5103918/pexels-photo-5103918.jpeg?auto=compress&cs=tinysrgb&w=1400)",
        backgroundSize: "cover", backgroundPosition: "center 25%",
        minHeight: 420, display: "flex", alignItems: "flex-start",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(7,13,24,0.94) 0%, rgba(11,18,32,0.88) 60%, rgba(7,13,24,0.96) 100%)" }} />
        <div style={{ position: "relative", maxWidth: 1400, margin: "0 auto", padding: "48px 48px 52px", width: "100%" }}>
          <div style={{ maxWidth: "60%" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(246,201,14,0.1)", border: "1px solid rgba(246,201,14,0.25)", borderRadius: 20, padding: "4px 12px", marginBottom: 14 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f6c90e", display: "inline-block", boxShadow: "0 0 6px #f6c90e" }} />
              <span style={{ fontSize: "0.64rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "1.5px", textTransform: "uppercase" }}>Australian Housing Intelligence Platform</span>
            </div>
            <h1 style={{ fontSize: "clamp(1.5rem, 3.6vw, 2.5em)", fontWeight: 900, color: "#fff", marginBottom: 14, lineHeight: 1.08, letterSpacing: "-1.4px" }}>
              The intelligence infrastructure<br />
              <span style={{ color: "#f6c90e" }}>Australia&apos;s housing sector has been missing.</span>
            </h1>
            <p style={{ fontSize: "0.84rem", color: "#94a3b8", lineHeight: 1.8, marginBottom: 22, maxWidth: 540 }}>
              Housing need, supply pipeline, development viability, funding programs, sustainability risk, and 20 years of evidence —
              connected in one platform. So the organisations solving Australia&apos;s housing crisis can move with the urgency the crisis demands.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href="/live-dashboard" className="hive-btn" style={{ padding: "9px 20px", fontSize: "0.76rem", borderRadius: 8, display: "inline-block", textDecoration: "none", fontWeight: 700 }}>Explore the Platform →</a>
              <a href="/feasibility" className="hive-btn-outline" style={{ padding: "9px 20px", fontSize: "0.76rem", borderRadius: 8, display: "inline-block", textDecoration: "none" }}>Development Viability →</a>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container">

        {/* ── Portfolio banner ────────────────────────────────────────────── */}
        <PortfolioBanner />

        {/* ── 2. THE CRISIS ───────────────────────────────────────────────── */}
        <div style={divider}>
          <p style={{ fontSize: "0.9rem", color: "#6b8aa0", lineHeight: 1.7, marginBottom: 20 }}>
            Australia&apos;s housing organisations make billion-dollar decisions — HAFF submissions, development pipelines, board commitments — with data that&apos;s fragmented, delayed, and disconnected.
            These are the numbers that make the case for why that has to change.
          </p>

          <div className="grid-4" style={{ marginBottom: 20 }}>
            {[
              { label: "Dwellings Built Per Year",  value: approvals.annual_run_rate.toLocaleString(), color: "#f6c90e", delta: `${approvals.pct_of_target}% of the 240,000 National Accord target`, deltaColor: "#c0614a" },
              { label: "Annual Supply Shortfall",   value: approvals.gap_to_target.toLocaleString(),   color: "#c0614a", delta: "Dwellings per year below what Australia needs", deltaColor: "#6b8aa0" },
              { label: "Unmet Housing Requests",    value: shs.unassisted_requests.toLocaleString(),   color: "#c49a3a", delta: `${Math.round(shs.unassisted_requests / 365).toLocaleString()} people turned away every single day`, deltaColor: "#6b8aa0" },
              { label: "Housing Success Rate",      value: `${shs.housing_success_rate}%`,             color: "#c49a3a", delta: "Only 1 in 4 people who needed housing actually received it", deltaColor: "#6b8aa0" },
            ].map(({ label, value, color, delta, deltaColor }) => (
              <div key={label} className="kpi-card" style={{ padding: "18px 20px" }}>
                <div className="kpi-label">{label}</div>
                <div className="kpi-value" style={{ color, fontSize: "1.8rem" }}>{value}</div>
                <div className="kpi-delta" style={{ color: deltaColor }}>{delta}</div>
              </div>
            ))}
          </div>

          {/* Pull quote — the single most powerful line */}
          <div style={{ background: "rgba(192,97,74,0.07)", border: "1px solid rgba(192,97,74,0.2)", borderLeft: "3px solid #c0614a", borderRadius: "0 8px 8px 0", padding: "16px 20px" }}>
            <span style={{ fontSize: "0.88rem", color: "#c8d8e8", lineHeight: 1.8 }}>
              The same $1B that built{" "}
              <strong style={{ color: "#fff" }}>3,226 social homes in 2019</strong>{" "}
              builds only{" "}
              <strong style={{ color: "#c0614a" }}>1,786 today</strong>{" "}
              — a 45% loss in construction purchasing power. 213,000 households have been assessed, found eligible, and are still waiting. Net overseas migration hit a record 518,000 in 2023. Every year without coordinated action compounds the deficit.
            </span>
            <div style={{ fontSize: "0.65rem", color: "#3a4d60", marginTop: 8 }}>
              ABS Building Approvals (Cat. 8731.0) · AIHW SHS Annual Report 2023–24 · ABS PPI House Construction (Cat. 6427.0) · ABS Cat. 3412.0. Updated May 2026.
            </div>
          </div>
        </div>

        {/* ── 3. SITUATION ROOM — 3 of 6 ─────────────────────────────────── */}
        <div style={divider}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid #1e2d40" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "2px", textTransform: "uppercase" }}>🐝 Situation Room</span>
              <span style={{ fontSize: "0.68rem", color: "#4a5a6a", fontWeight: 600 }}>· 6 critical indicators · 3 shown</span>
            </div>
            <span style={{ fontSize: "0.65rem", color: "#2a3d52" }}>Updated monthly · May 2026</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
            {SITUATION_CARDS.map((card) => (
              <div key={card.topic} style={{ display: "flex", alignItems: "stretch", background: "#111827", border: "1px solid #1e2d40", borderLeft: `3px solid ${card.statusColor}`, borderRadius: "0 10px 10px 0", overflow: "hidden" }}>
                <div style={{ flexShrink: 0, width: 200, padding: "13px 18px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: card.statusColor, flexShrink: 0 }} />
                    <span style={{ fontSize: "0.58rem", fontWeight: 800, color: card.statusColor, letterSpacing: "1px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{card.status}</span>
                  </div>
                  <div style={{ fontSize: "0.63rem", fontWeight: 700, color: "#4a5a6a", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 5, whiteSpace: "nowrap" }}>{card.topic}</div>
                  <div style={{ fontSize: "1.55rem", fontWeight: 900, color: card.statusColor, lineHeight: 1, marginBottom: 2 }}>{card.primaryValue}</div>
                  <div style={{ fontSize: "0.68rem", color: "#6b8aa0", fontWeight: 500, lineHeight: 1.3 }}>{card.primaryLabel}</div>
                </div>
                <div style={{ flex: 1, padding: "13px 20px", display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
                  <div style={{ fontSize: "0.7rem", color: "#4a5a6a", marginBottom: 5, fontWeight: 600 }}>{card.metric}</div>
                  <div style={{ fontSize: "0.78rem", color: "#7a8fa8", lineHeight: 1.6, marginBottom: 3 }}>{card.context}</div>
                  <div style={{ fontSize: "0.7rem", color: "#4a5a6a", lineHeight: 1.5, fontStyle: "italic" }}>{card.action}</div>
                </div>
                <div style={{ flexShrink: 0, padding: "13px 20px", display: "flex", alignItems: "center" }}>
                  <a href={card.href} style={{ fontSize: "0.72rem", fontWeight: 700, color: card.statusColor, textDecoration: "none", whiteSpace: "nowrap" }}>{card.linkLabel}</a>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "right" }}>
            <a href="/live-dashboard" style={{ fontSize: "0.72rem", color: "#4a5a6a", textDecoration: "none", fontWeight: 600 }}>
              + 3 more indicators: CHP Ceiling · Homelessness System · Asset &amp; Stock Condition →
            </a>
          </div>
        </div>

        {/* ── 4. WHAT HIVE DOES — 8 connected layers ──────────────────────── */}
        <div style={divider}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
            <div style={sh}>Eight connected intelligence layers</div>
          </div>
          <p style={{ fontSize: "0.84rem", color: "#6b8aa0", lineHeight: 1.7, marginBottom: 24 }}>
            Not a dashboard. Not a database. Eight modules that work independently — and together answer questions no single source can.
          </p>

          {/* 3 differentiated claims */}
          <div className="grid-3" style={{ marginBottom: 28 }}>
            {[
              { num: "01", label: "Sourced, not scraped", body: "681 primary publications — AHURI, AIHW, ABS, Treasury, Rawlinsons. Every claim traced to a specific report. Nothing synthesised from unverified sources.", color: "#f6c90e" },
              { num: "02", label: "Intelligence, not charts", body: "Every data point comes with HIVE Analysis — opinionated, sector-specific interpretation that tells you what the numbers mean for your next decision, not just what they are.", color: "#f6c90e" },
              { num: "03", label: "The full picture, one place", body: "From housing need to asset risk in one platform. No more assembling a submission from six different tabs across three government websites.", color: "#f6c90e" },
            ].map(({ num, label, body, color }) => (
              <div key={num} className="hive-card" style={{ borderTop: `2px solid ${color}22` }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8 }}>{num}</div>
                <div style={{ fontWeight: 700, color: "#fff", marginBottom: 8, fontSize: "0.92rem" }}>{label}</div>
                <div style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.75 }}>{body}</div>
              </div>
            ))}
          </div>

          {/* 8 module grid */}
          <div className="grid-4">
            {capabilities.map((cap) => (
              <a key={cap.title} href={cap.href} style={{ textDecoration: "none" }}>
                <div className="role-card" style={{ height: "100%", borderTop: `2px solid ${cap.navColor}`, display: "flex", flexDirection: "column" }}>
                  <div style={{ fontWeight: 800, color: "#fff", marginBottom: 6, fontSize: "0.9rem" }}>{cap.title}</div>
                  <div style={{ fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.7, marginBottom: 14, flex: 1 }}>{cap.desc}</div>
                  <span style={{ display: "inline-block", background: `${cap.navColor}15`, color: cap.navColor, border: `1px solid ${cap.navColor}33`, borderRadius: 6, padding: "4px 10px", fontSize: "0.7rem", fontWeight: 700 }}>{cap.nav}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── 5. SUSTAINABILITY SPOTLIGHT ─────────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ background: "linear-gradient(135deg, rgba(26,188,156,0.06) 0%, rgba(11,18,32,0.4) 100%)", border: "1px solid rgba(26,188,156,0.2)", borderRadius: 12, padding: "28px 32px", display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "#1abc9c", letterSpacing: "1.8px", textTransform: "uppercase", marginBottom: 10 }}>🌍 HIVE&apos;s most distinctive capability</div>
              <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#fff", marginBottom: 10, letterSpacing: "-0.3px", lineHeight: 1.2 }}>
                The triple failure — and where it concentrates
              </div>
              <p style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.75, marginBottom: 0, maxWidth: 680 }}>
                A subset of suburbs — HIVE&apos;s highest compound-risk tier (top ~10% of the 152 profiled) — face climate exposure, energy-poor stock, and LHD non-compliance simultaneously.
                This is where Australia&apos;s most vulnerable tenants live — paying $2,200+ extra in energy costs, in homes that reach 43°C+ on extreme heat days,
                without the accessibility features to age in place. HIVE is the only platform that maps this intersection across all 152 profiled suburbs.
              </p>
            </div>
            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
              <a href="/sustainability" className="hive-btn" style={{ padding: "10px 22px", fontSize: "0.78rem", borderRadius: 8, display: "inline-block", textDecoration: "none", fontWeight: 700, background: "#1abc9c", color: "#0b1220", border: "none", whiteSpace: "nowrap" }}>
                Explore Sustainability →
              </a>
            </div>
          </div>
        </div>

        {/* ── 6. WHERE TO START — 4 entry points ──────────────────────────── */}
        <div style={divider}>
          <div style={sh}>Where do you want to start?</div>
          <p style={{ fontSize: "0.82rem", color: "#6b8aa0", lineHeight: 1.6, marginBottom: 20 }}>Every section is live, sourced, and ready. Pick the area most relevant to the decision you&apos;re facing.</p>
          <div className="grid-4">
            {ENTRY_POINTS.map((ep) => (
              <a key={ep.title} href={ep.href} style={{ textDecoration: "none" }}>
                <div className="hive-card hive-card-hover" style={{ height: "100%", borderTop: `2px solid ${ep.color}33`, display: "flex", flexDirection: "column", padding: "18px 18px" }}>
                  <div style={{ fontWeight: 800, color: "#e8edf2", fontSize: "0.88rem", marginBottom: 8, lineHeight: 1.3 }}>{ep.title}</div>
                  <div style={{ fontSize: "0.78rem", color: "#6b8aa0", lineHeight: 1.7, flex: 1, marginBottom: 14 }}>{ep.desc}</div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: ep.color }}>{ep.cta}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── 7. WHO IT&apos;S FOR — 4 personas ────────────────────────────────── */}
        <div style={divider}>
          <div style={sh}>Built for people who make housing decisions</div>
          <p style={{ fontSize: "0.82rem", color: "#6b8aa0", lineHeight: 1.6, marginBottom: 20 }}>HIVE is used across the sector — by the organisations building homes, funding them, advocating for them, and investing in them.</p>
          <div className="grid-4">
            {personas.map((r) => (
              <div key={r.role} className="role-card" style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontWeight: 800, color: "#fff", fontSize: "0.88rem", marginBottom: 8 }}>{r.role}</div>
                <div style={{ fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.7, marginBottom: 14, flex: 1 }}>{r.desc}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {r.pills.map((pill) => (
                    <a key={pill} href={pillHrefMap[pill] ?? "#"} style={{ textDecoration: "none" }}>
                      <span style={{ display: "inline-block", background: "rgba(246,201,14,0.06)", border: "1px solid rgba(246,201,14,0.2)", borderRadius: 6, padding: "3px 10px", fontSize: "0.7rem", color: "#c9a820", fontWeight: 600, cursor: "pointer" }}>{pill}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 8. EVIDENCE FOUNDATION ──────────────────────────────────────── */}
        <div style={divider}>
          <div style={sh}>Grounded in primary evidence</div>
          <p style={{ fontSize: "0.82rem", color: "#6b8aa0", lineHeight: 1.6, marginBottom: 18 }}>Every answer HIVE gives is traceable to a specific publication. Nothing is made up. Nothing is approximate.</p>
          <div className="hive-card" style={{ marginBottom: 20, background: "linear-gradient(135deg, #1f2937, #0b1220)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "center" }}>
              <div><div className="stat-highlight">681</div><div className="stat-label">Reports Indexed</div></div>
              <div><div className="stat-highlight">5,059</div><div className="stat-label">Searchable Chunks</div></div>
              <div><div className="stat-highlight">13</div><div className="stat-label">Primary Sources</div></div>
              <div><div className="stat-highlight">20+</div><div className="stat-label">Years of Research</div></div>
            </div>
          </div>
          <div className="grid-3">
            {keyDataSources.map((ds) => (
              <div key={ds.abbr} className="data-source-card" style={{ borderLeftColor: ds.color }}>
                <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.92rem", marginBottom: 3 }}>{ds.abbr}</div>
                <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginBottom: 8 }}>{ds.subtitle}</div>
                <div style={{ fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.65 }}>{ds.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "right", marginTop: 10 }}>
            <a href="/research" style={{ fontSize: "0.72rem", color: "#4a5a6a", textDecoration: "none", fontWeight: 600 }}>
              View all 13 sources in the Evidence &amp; Policy library →
            </a>
          </div>
        </div>

        {/* ── 9. FOUNDER QUOTE ────────────────────────────────────────────── */}
        <div className="insight-box" style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#f6c90e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, color: "#0b1220", flexShrink: 0 }}>SK</div>
            <div>
              <p style={{ fontSize: "0.95rem", color: "#d0d0d0", lineHeight: 1.9, fontStyle: "italic", marginBottom: 14 }}>
                &ldquo;The data the housing sector needs has always been publicly available — ABS releases, AIHW reports, budget papers, waitlist registers, construction benchmarks.
                What hasn&apos;t existed is a single place where it&apos;s connected, current, and immediately usable.
                HIVE is built on the principle that better decisions come from better access to evidence — not from having more time or a larger research team.&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "0.88rem", color: "#f6c90e", fontWeight: 700 }}>Sunny Kim</span>
                <span style={{ color: "#333" }}>·</span>
                <span style={{ fontSize: "0.82rem", color: "#6b8aa0" }}>Founder · Impact Analytics Australia</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 10. FINAL CTA ───────────────────────────────────────────────── */}
        <div style={{ marginBottom: 48, background: "linear-gradient(135deg, #0d1825 0%, #111827 100%)", border: "1px solid #1e2d40", borderLeft: "3px solid #f6c90e", borderRadius: "0 12px 12px 0", padding: "32px 36px" }}>
          <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#fff", marginBottom: 6, letterSpacing: "-0.3px" }}>
            The housing crisis won&apos;t wait. Neither should your intelligence.
          </div>
          <p style={{ fontSize: "0.84rem", color: "#6b8aa0", lineHeight: 1.75, marginBottom: 20 }}>
            Every section is live, sourced, and built for the decision you&apos;re making today.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="/housing-need"     className="hive-btn-outline" style={{ padding: "9px 18px", fontSize: "0.78rem", borderRadius: 8, display: "inline-block", textDecoration: "none" }}>Housing Need →</a>
            <a href="/feasibility"      className="hive-btn-outline" style={{ padding: "9px 18px", fontSize: "0.78rem", borderRadius: 8, display: "inline-block", textDecoration: "none" }}>Development Viability →</a>
            <a href="/sustainability"   className="hive-btn-outline" style={{ padding: "9px 18px", fontSize: "0.78rem", borderRadius: 8, display: "inline-block", textDecoration: "none" }}>Sustainability →</a>
            <a href="/research"         className="hive-btn"         style={{ padding: "9px 18px", fontSize: "0.78rem", borderRadius: 8, display: "inline-block", textDecoration: "none", fontWeight: 700 }}>Evidence &amp; Policy →</a>
          </div>
        </div>

      </div>
    </div>
  )
}
