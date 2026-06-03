"use client"
import { useState } from "react"
import HiveSearch from "@/components/HiveSearch"
import Markdown from "@/components/Markdown"
import { downloadWordBrief, printPdfBrief, type BriefOpts } from "@/lib/briefExport"
import { POLICY_TIMELINE, TYPE_LABELS as POLICY_TYPE_LABELS, TYPE_COLORS as POLICY_TYPE_COLORS } from "@/lib/data/policy-timeline"
import { PROGRAMS } from "@/lib/data/programs"

// ── Constants ─────────────────────────────────────────────────────────────────

const CONFIDENCE_COLORS: Record<string, string> = { High: "#5aad8a", Medium: "#c49a3a", Low: "#c0614a" }

const STATUS_COLORS: Record<string, string> = {
  "Completed":                              "#5aad8a",
  "Active":                                 "#4d7fb5",
  "Ongoing":                                "#4d7fb5",
  "Ongoing (now Home Guarantee Scheme)":    "#4d7fb5",
  "Closed (running down)":                  "#6b8aa0",
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface PolicyImpactResult {
  answer: string
  sources: { index: number; title: string; agency: string; year: string; url: string; score: number }[]
}

// ── Reports data ──────────────────────────────────────────────────────────────

const REPORTS = [
  { title: "AHURI Final Report No. 409: Social housing supply and demand",                     agency: "AHURI",                  year: "2024", type: "Research",    url: "https://www.ahuri.edu.au/research/final-reports/409" },
  { title: "Housing Assistance in Australia 2023",                                             agency: "AIHW",                   year: "2023", type: "Government",  url: "https://www.aihw.gov.au/reports/housing-assistance/housing-assistance-in-australia" },
  { title: "Specialist Homelessness Services Annual Report 2022-23",                           agency: "AIHW",                   year: "2023", type: "Government",  url: "https://www.aihw.gov.au/reports/homelessness-services/specialist-homelessness-services-annual-report" },
  { title: "National Housing Finance and Investment Corporation Annual Report 2023-24",        agency: "Housing Australia",      year: "2024", type: "Government",  url: "https://www.housingaustralia.gov.au/annual-report-2023-24" },
  { title: "Building Approvals, Australia (ABS 8731.0)",                                      agency: "ABS",                    year: "2024", type: "Statistical", url: "https://www.abs.gov.au/statistics/industry/building-and-construction/building-approvals-australia/latest-release" },
  { title: "Population Projections, Australia (ABS 3222.0)",                                  agency: "ABS",                    year: "2023", type: "Statistical", url: "https://www.abs.gov.au/statistics/people/population/population-projections-australia/latest-release" },
  { title: "AHURI Final Report No. 378: The adequacy of social housing in Australia",         agency: "AHURI",                  year: "2022", type: "Research",    url: "https://www.ahuri.edu.au/research/final-reports/378" },
  { title: "AHURI Research Insights: Inclusionary zoning for social and affordable housing",  agency: "AHURI",                  year: "2022", type: "Research",    url: "https://www.ahuri.edu.au/research/final-reports/297" },
  { title: "HAFF Round 1 Allocation Outcomes Report",                                         agency: "Housing Australia",      year: "2024", type: "Government",  url: "https://www.housingaustralia.gov.au/housing-australia-future-fund" },
  { title: "National Housing Accord — First Year Progress Report",                            agency: "Treasury",               year: "2024", type: "Government",  url: "https://treasury.gov.au/policy-topics/housing" },
  { title: "Social Housing Futures — UNSW City Futures Research Centre",                      agency: "UNSW City Futures",      year: "2023", type: "Research",    url: "https://cityfutures.ada.unsw.edu.au/research/projects/social-housing-infrastructure-investment-pathway/" },
  { title: "AHURI Research Paper: Rental affordability in Australia",                         agency: "AHURI",                  year: "2023", type: "Research",    url: "https://www.ahuri.edu.au/research/final-reports/427" },
  { title: "National Rental Affordability Scheme Evaluation",                                 agency: "DSS",                    year: "2014", type: "Government",  url: "https://www.dss.gov.au/national-rental-affordability-scheme" },
  { title: "HomeBuilder Scheme Final Report",                                                 agency: "Treasury",               year: "2022", type: "Government",  url: "https://www.treasury.gov.au/homebuilder" },
  { title: "ANAO Performance Audit: National Partnership on Remote Indigenous Housing",       agency: "ANAO",                   year: "2017", type: "Audit",       url: "https://www.anao.gov.au/work/performance-audit/implementation-the-national-partnership-agreement-remote-indigenous-housing-the-nt" },
  { title: "Australian Demographic Statistics (ABS 3101.0)",                                  agency: "ABS",                    year: "2024", type: "Statistical", url: "https://www.abs.gov.au/statistics/people/population/national-state-and-territory-population/latest-release" },
  { title: "AHURI: Planning reform and housing supply in Australian cities",                  agency: "AHURI",                  year: "2023", type: "Research",    url: "https://www.ahuri.edu.au/research/final-reports/300" },
  { title: "ACOSS Rental Stress Report 2024",                                                 agency: "ACOSS",                  year: "2024", type: "Advocacy",    url: "https://povertyandinequality.acoss.org.au/" },
  { title: "HIA Housing Report: Construction Pipeline 2024",                                  agency: "HIA",                    year: "2024", type: "Industry",    url: "https://hia.com.au/our-industry/economics/housing-outlook" },
  { title: "Power Housing Australia: CHP Capacity & Funding Gap Report 2024",                agency: "Power Housing Australia", year: "2024", type: "Industry",    url: "https://www.powerhousingaustralia.com.au/resources/" },
]

const REPORT_TYPES = ["All", "Research", "Government", "Statistical", "Audit", "Advocacy", "Industry"]

// ── Pre-computed key findings ─────────────────────────────────────────────────

const KEY_FINDINGS = [
  {
    topic: "National Housing Deficit",
    finding: "640,000+ home shortfall projected by 2041 at current delivery rates. The gap between social housing need and supply widens by ~35,000 homes per year. HAFF and the Housing Accord together represent the largest federal intervention since the 1950s — but remain structurally insufficient at current delivery rates.",
    sources: "AHURI Final Report 409, 2024 · AIHW Housing Assistance 2023",
    color: "#c0614a",
  },
  {
    topic: "Construction Cost Inflation",
    finding: "58.5% cost escalation since 2019 means every $1B announced in 2022 now delivers 45% fewer homes. Government programs face compounding structural underfunding: every year without cost-adjustment reduces effective delivery capacity. The $10B HAFF has the effective purchasing power of a $5.5B fund at 2019 costs.",
    sources: "ABS PPI 6427.0 · Rawlinsons Construction Cost Guide 2025",
    color: "#c49a3a",
  },
  {
    topic: "HAFF Delivery Progress",
    finding: "18,650 homes contracted (Rounds 1–2 only) — 47% of the 40,000 five-year target. Round 3 applications opened January 2026, targeting the remaining 21,350 homes. Full program delivery by 2029 requires flawless Round 3 execution with no contract failures or construction delays.",
    sources: "Housing Australia media release 3 Jul 2025 · HAFF Round 3 launch Nov 2025",
    color: "#4d7fb5",
  },
  {
    topic: "CHP vs Direct Delivery",
    finding: "AHURI research consistently shows CHPs deliver 15–20% more dwellings per million invested compared to state housing authorities, with measurably better long-term tenancy outcomes. The CHP sector's growth from 16% to 28% of social housing stock since 2013 reflects this efficiency advantage — accelerated by HAFF's CHP-first design.",
    sources: "AHURI Final Report 378, 2022 · AIHW Housing Assistance 2024",
    color: "#5aad8a",
  },
  {
    topic: "Planning Reform Potential",
    finding: "AHURI analysis finds planning reform — inclusionary zoning, density uplift, fast-track DA pathways — could unlock 50,000–100,000 additional dwellings nationally within 5 years at near-zero additional government capital cost. Political resistance and council-level opposition, not technical feasibility, are the primary barriers to implementation.",
    sources: "AHURI: Planning reform and housing supply in Australian cities, 2023",
    color: "#6b8aa0",
  },
  {
    topic: "Homelessness Service Gaps",
    finding: "Australian specialist homelessness services assisted 290,000 people in 2022–23, but only 38% of requests for immediate accommodation were met. Evidence strongly supports Rapid Rehousing over transitional shelter-first approaches (3:1 on sustained housing outcomes), yet funding allocation still skews heavily toward transitional models.",
    sources: "AIHW Specialist Homelessness Services Annual Report 2022-23",
    color: "#7aaad4",
  },
]

// ── Cross-portfolio ROI ───────────────────────────────────────────────────────

const CROSS_PORTFOLIO_ROI = [
  {
    portfolio: "Health System",
    saving: "$0.40",
    mechanism: "Fewer emergency department presentations, reduced hospital admissions, lower mental health crisis costs. Rough sleepers cost the health system ~$28–40k/year vs ~$5k for a housed person.",
    color: "#c0614a",
  },
  {
    portfolio: "Justice & Corrections",
    saving: "$0.30",
    mechanism: "Housing instability is a primary driver of criminal justice involvement. Short-term incarceration costs $300–400/day in Australia. Stable housing reduces recidivism and court system costs.",
    color: "#c49a3a",
  },
  {
    portfolio: "Child Protection",
    saving: "$0.45",
    mechanism: "Family homelessness is a leading driver of children entering out-of-home care, which costs $60–120k/child/year. Stable housing is the most effective primary prevention lever.",
    color: "#7aaad4",
  },
  {
    portfolio: "Welfare & Employment",
    saving: "$0.20",
    mechanism: "Stable housing significantly improves employment outcomes and reduces dependency on income support. Employed tenants also contribute income tax, compounding the fiscal return.",
    color: "#5aad8a",
  },
  {
    portfolio: "Emergency Accommodation",
    saving: "$0.35",
    mechanism: "Crisis and transitional accommodation costs $80–150/person/night — 6–10× the cost-equivalent of a permanent social tenancy. Every social home prevents hundreds of crisis-bed nights annually.",
    color: "#6b8aa0",
  },
]

// ── Tabs ──────────────────────────────────────────────────────────────────────

const TOP_TABS = ["Ask Research", "Policy Analyser", "Program Scorecard", "Source Library"]

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ResearchPage() {
  const [activeTab,        setActiveTab]        = useState("Ask Research")

  // Policy Analyser state (API wiring untouched)
  const [selectedIdx,  setSelectedIdx]  = useState(0)
  const [loading,      setLoading]      = useState(false)
  const [result,       setResult]       = useState<PolicyImpactResult | null>(null)
  const [policyError,  setPolicyError]  = useState("")

  // Program Scorecard state
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null)

  // Source Library state
  const [search,      setSearch]      = useState("")
  const [typeFilter,  setTypeFilter]  = useState("All")

  const policy = POLICY_TIMELINE[selectedIdx]

  // ── analyseImpact — API call untouched ──────────────────────────────────────
  async function analyseImpact() {
    setLoading(true)
    setPolicyError("")
    setResult(null)
    try {
      const res = await fetch("/api/policy-impact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policyName: policy.event, fundingAmount: policy.amount_bn, year: policy.year }),
      })
      if (!res.ok) throw new Error("Analysis failed")
      const data = await res.json()
      setResult(data)
    } catch {
      setPolicyError("Analysis failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Export Brief — Policy Analyser
  const policyBriefOpts = (): BriefOpts => {
    const date = new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })
    return {
      docTitle: "HIVE Policy Analysis Brief",
      metaLines: [
        `Policy: ${policy.event}`,
        `Investment: $${policy.amount_bn}B · ${POLICY_TYPE_LABELS[policy.type]}`,
        `Date: ${date}`,
      ],
      answer: result!.answer,
      sources: result!.sources,
      footer: "Generated by HIVE — Housing Intelligence & Evidence. AI-synthesised from 681 indexed research reports; verify against primary sources before use.",
    }
  }

  // Computed values
  const totalCommitted  = PROGRAMS.reduce((s, p) => s + p.funding_committed_bn, 0)
  const totalDrawn      = PROGRAMS.reduce((s, p) => s + (p.funding_drawn_bn ?? 0), 0)
  const activeCount     = PROGRAMS.filter((p) => p.status === "Active" || p.status.includes("Ongoing")).length
  const completedCount  = PROGRAMS.filter((p) => p.status === "Completed" || p.status.includes("Closed")).length
  const totalInvestment = POLICY_TIMELINE.reduce((s, p) => s + p.amount_bn, 0)

  // Sort programs: active/ongoing first (by funding desc), then completed/closed (by year desc)
  const ACTIVE_STATUSES = ["Active", "Ongoing"]
  const sortedPrograms = [...PROGRAMS].sort((a, b) => {
    const aActive = ACTIVE_STATUSES.some(s => a.status.includes(s))
    const bActive = ACTIVE_STATUSES.some(s => b.status.includes(s))
    if (aActive && !bActive) return -1
    if (!aActive && bActive) return 1
    if (aActive && bActive) return b.funding_committed_bn - a.funding_committed_bn  // largest active first
    return b.announced_year - a.announced_year  // most recent completed first
  })

  const filteredReports = REPORTS.filter((r) => {
    const matchesSearch = search === "" || r.title.toLowerCase().includes(search.toLowerCase()) || r.agency.toLowerCase().includes(search.toLowerCase())
    const matchesType   = typeFilter === "All" || r.type === typeFilter
    return matchesSearch && matchesType
  })

  // Scorecard helpers
  function getDeliveryPct(prog: typeof PROGRAMS[0]): number | null {
    const primaryTarget  = prog.targets[0]
    const primaryOutcome = prog.outcomes[0]
    if (!primaryTarget || !primaryOutcome) return null
    const raw = Math.round((primaryOutcome.actual_value / primaryTarget.target_value) * 100)
    return Math.min(raw, 999)  // cap display at 999% to avoid chart-breaking overages
  }

  function deliveryColor(pct: number | null, status: string): string {
    if (status === "Active" || status.includes("Ongoing")) return "#4d7fb5"
    if (pct === null) return "#6b8aa0"
    if (pct >= 90) return "#5aad8a"
    if (pct >= 60) return "#c49a3a"
    return "#c0614a"
  }

  function deliveryLabel(pct: number | null, status: string): string {
    if (status.includes("Closed") || status.includes("running down")) return "Wound down"
    if (status === "Active") return "Active"
    if (status.includes("Ongoing")) return "Ongoing"
    if (pct === null) return "Tracked"
    if (pct >= 100) return "Exceeded"
    if (pct >= 90) return "Delivered"
    if (pct >= 60) return "Partial"
    return "Shortfall"
  }

  // Delivery grade — pace-adjusted for active programs, final result for completed ones
  function getScore(prog: typeof PROGRAMS[0]): { grade: string; pct: number; pctLabel: string; color: string; note: string } | null {
    const t = prog.targets[0]
    const o = prog.outcomes[0]
    if (!t || !o || typeof o.actual_value !== "number") return null
    const pct = Math.round((o.actual_value / t.target_value) * 100)
    const exceeded = pct >= 150
    const pctLabel = pct >= 200 ? `${(pct / 100).toFixed(1)}×` : `${pct}%`
    const completed = /Completed|Closed|running down/i.test(prog.status)
    const gradeFromPct = (p: number) => (p >= 95 ? "A" : p >= 80 ? "B" : p >= 60 ? "C" : p >= 40 ? "D" : "F")

    let grade: string
    let note: string
    if (exceeded) {
      grade = "A"
      note = `Exceeded — ${(pct / 100).toFixed(1)}× the original target`
    } else if (completed) {
      grade = gradeFromPct(Math.min(pct, 120))
      note = `${pct}% of target delivered`
    } else {
      const start = prog.implemented_year || prog.announced_year
      const end = t.target_year ?? prog.end_year ?? null
      const now = new Date().getFullYear()
      if (end && end > start) {
        const elapsedPct = Math.round(Math.max(0, Math.min(1, (now - start) / (end - start))) * 100)
        const ratio = elapsedPct > 0 ? pct / elapsedPct : 1
        grade = ratio >= 1.05 ? "A" : ratio >= 0.9 ? "B" : ratio >= 0.7 ? "C" : ratio >= 0.5 ? "D" : "F"
        note = ratio >= 1.0
          ? `On track — ${pct}% delivered, ${elapsedPct}% of timeline elapsed`
          : ratio >= 0.7
            ? `Slightly behind — ${pct}% delivered vs ${elapsedPct}% of time`
            : `Behind pace — ${pct}% delivered vs ${elapsedPct}% of time`
      } else {
        grade = gradeFromPct(pct)
        note = `${pct}% of target so far`
      }
    }
    const color = grade === "A" || grade === "B" ? "#5aad8a" : grade === "C" ? "#c49a3a" : grade === "D" ? "#e67e22" : "#c0614a"
    return { grade, pct, pctLabel, color, note }
  }

  return (
    <div style={{ background: "#0b1220", minHeight: "100vh" }}>
      <div className="page-container">

        <div className="page-header">
          <h1 className="page-title">Research &amp; Policy Intelligence</h1>
          <p className="page-subtitle">
            681 indexed reports across AHURI, AIHW, ABS, Housing Australia and 20+ organisations.
            Search the evidence base, analyse policy impact, track program delivery, and browse the source library.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(90,173,138,0.1)", border: "1px solid rgba(90,173,138,0.3)", borderRadius: 20, padding: "3px 12px", fontSize: "0.65rem", fontWeight: 700, color: "#5aad8a" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#5aad8a", boxShadow: "0 0 4px #5aad8a", display: "inline-block" }} />
              Live evidence base
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(77,127,181,0.1)", border: "1px solid rgba(77,127,181,0.3)", borderRadius: 20, padding: "3px 12px", fontSize: "0.65rem", fontWeight: 700, color: "#7aaad4" }}>
              ⚡ Cited answers in seconds
            </span>
          </div>
        </div>

        {/* Top-level tab navigation */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {TOP_TABS.map((tab) => (
            <button
              key={tab}
              className={`tab-pill ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
              style={{ padding: "8px 20px", fontSize: "0.82rem" }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ══ TAB 1: ASK RESEARCH ══════════════════════════════════════════ */}
        {activeTab === "Ask Research" && (
          <div>
            <div className="grid-4" style={{ marginBottom: 28 }}>
              {[
                { value: "681",       label: "Reports indexed",        color: "#f6c90e" },
                { value: "5,059",     label: "Indexed passages",       color: "#f6c90e" },
                { value: "20+",       label: "Source organisations",   color: "#f6c90e" },
                { value: "2004–2025", label: "Publication range",      color: "#f6c90e" },
              ].map(({ value, label, color }) => (
                <div key={label} className="kpi-card">
                  <div className="kpi-label">{label}</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color }}>{value}</div>
                </div>
              ))}
            </div>

            {/* HiveSearch — API wiring untouched */}
            <HiveSearch />

            {/* Key findings from the evidence base */}
            <div style={{ marginTop: 36, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                <div className="section-label" style={{ marginBottom: 0 }}>Key Findings — Evidence Base</div>
                <span style={{ fontSize: "0.68rem", color: "#4a5a6a", fontWeight: 600, letterSpacing: "0.5px" }}>
                  Pre-synthesised · Full search above for deeper queries
                </span>
              </div>
              <div className="grid-2" style={{ gap: 12 }}>
                {KEY_FINDINGS.map((f) => (
                  <div key={f.topic} className="hive-card" style={{ borderLeft: `3px solid ${f.color}`, padding: "16px 20px" }}>
                    <div style={{
                      fontSize: "0.68rem", fontWeight: 700, color: f.color,
                      letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8,
                    }}>{f.topic}</div>
                    <div style={{ fontSize: "0.79rem", color: "#94a3b8", lineHeight: 1.7, marginBottom: 10 }}>
                      {f.finding}
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "#4a5a6a", lineHeight: 1.5 }}>
                      Sources: {f.sources}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cross-portfolio ROI */}
            <div style={{ marginTop: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                <div className="section-label" style={{ marginBottom: 0 }}>Cross-Portfolio ROI — Budget Ammunition</div>
                <span style={{ fontSize: "0.68rem", color: "#4a5a6a" }}>Per $1 invested in social housing · pre-synthesised from AHURI + government actuarial research</span>
              </div>

              <div className="hive-card" style={{ padding: 0, overflow: "hidden" }}>
                {/* Header */}
                <div style={{ padding: "14px 20px", background: "#0d1825", borderBottom: "1px solid #1e2d40", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.6 }}>
                    Every dollar invested in social housing generates savings across five other government portfolios.
                    Combined, these cross-portfolio savings make the case that housing investment is{" "}
                    <strong style={{ color: "#fff" }}>fiscally positive</strong> — not a cost to government but a net saving.
                    Use this table in budget submissions and Cabinet briefings.
                  </div>
                  <div style={{ flexShrink: 0, marginLeft: 24, textAlign: "center" }}>
                    <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "#4a5a6a", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>Total ROI</div>
                    <div style={{ fontSize: "2.4rem", fontWeight: 900, color: "#5aad8a", lineHeight: 1 }}>$1.70</div>
                    <div style={{ fontSize: "0.65rem", color: "#4a5a6a", marginTop: 2 }}>saved per $1 invested</div>
                  </div>
                </div>

                {/* Portfolio rows */}
                {CROSS_PORTFOLIO_ROI.map((row, i) => (
                  <div key={row.portfolio} style={{
                    display: "flex", alignItems: "flex-start", gap: 0,
                    borderBottom: i < CROSS_PORTFOLIO_ROI.length - 1 ? "1px solid #1e2d40" : "none",
                    padding: 0,
                  }}>
                    {/* Saving amount */}
                    <div style={{
                      flexShrink: 0, width: 90, padding: "14px 16px",
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      borderRight: "1px solid #1e2d40",
                    }}>
                      <div style={{ fontSize: "1.4rem", fontWeight: 900, color: row.color, lineHeight: 1 }}>{row.saving}</div>
                      <div style={{ fontSize: "0.58rem", color: "#4a5a6a", marginTop: 3, textAlign: "center" }}>saved per $1</div>
                    </div>

                    {/* Portfolio + mechanism */}
                    <div style={{ flex: 1, padding: "12px 18px" }}>
                      <div style={{ fontSize: "0.7rem", fontWeight: 700, color: row.color, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>{row.portfolio}</div>
                      <div style={{ fontSize: "0.77rem", color: "#7a8fa8", lineHeight: 1.6 }}>{row.mechanism}</div>
                    </div>
                  </div>
                ))}

                {/* Footer */}
                <div style={{ padding: "10px 20px", background: "#0d1825", borderTop: "1px solid #1e2d40", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "0.65rem", color: "#4a5a6a", lineHeight: 1.5 }}>
                    Sources: AHURI Final Report No. 338 (2020) · Victorian DHHS Supportive Housing Evaluation (2021) ·
                    Productivity Commission Report on Government Services (2022) · AIHW Child Protection data (2023) · DSS actuarial review
                  </div>
                  <div style={{ flexShrink: 0, marginLeft: 16, fontSize: "0.62rem", color: "#2a3d52", textAlign: "right" }}>
                    Note: Savings are estimates from published evaluations.<br />Verify against primary sources before use in formal submissions.
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ══ TAB 2: POLICY ANALYSER (merged Analysis + Timeline) ════════════ */}
        {activeTab === "Policy Analyser" && (
          <div>
            {/* Selector + RAG call */}
            <div className="hive-card" style={{ marginBottom: 24 }}>
              <div className="section-label">Select Policy</div>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: 16, lineHeight: 1.65 }}>
                Select a major Australian housing policy and analyse its impact using the indexed evidence base.
                Synthesis drawn from 681 reports across AHURI, AIHW, government evaluations, and academic literature.
              </p>
              <select
                value={selectedIdx}
                onChange={(e) => { setSelectedIdx(Number(e.target.value)); setResult(null) }}
                style={{
                  width: "100%", background: "#0b1220", border: "1.5px solid #1e2d40",
                  borderRadius: 10, color: "#fff", padding: "10px 14px",
                  fontSize: "0.88rem", marginBottom: 16, cursor: "pointer",
                }}
              >
                {POLICY_TIMELINE.map((p, i) => (
                  <option key={i} value={i} style={{ background: "#1f2937" }}>
                    {p.year} — {p.event}
                  </option>
                ))}
              </select>

              <div className="grid-3" style={{ marginBottom: 16 }}>
                <div className="kpi-card">
                  <div className="kpi-label">Year Announced</div>
                  <div className="kpi-value" style={{ fontSize: "1.6rem", color: "#f6c90e" }}>{policy.year}</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Investment</div>
                  <div className="kpi-value" style={{ fontSize: "1.6rem", color: "#5aad8a" }}>${policy.amount_bn}B</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Policy Type</div>
                  <div style={{ marginTop: 8 }}>
                    <span className="badge" style={{
                      background: `${POLICY_TYPE_COLORS[policy.type]}22`,
                      color: POLICY_TYPE_COLORS[policy.type],
                      border: `1px solid ${POLICY_TYPE_COLORS[policy.type]}44`,
                    }}>
                      {POLICY_TYPE_LABELS[policy.type]}
                    </span>
                  </div>
                </div>
              </div>

              <button className="hive-btn" onClick={analyseImpact} disabled={loading}
                style={{ padding: "12px 28px", fontSize: "0.88rem", borderRadius: 10 }}>
                {loading ? "Analysing..." : "Analyse Impact"}
              </button>
            </div>

            {policyError && (
              <div className="callout-red" style={{ marginBottom: 20, fontSize: "0.85rem", color: "#c0614a" }}>
                {policyError}
              </div>
            )}

            {loading && (
              <div className="hive-card" style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: 12 }}>Searching evidence base...</div>
                <div style={{ fontSize: "0.82rem" }}>Querying 681 reports for &quot;{policy.event}&quot;</div>
              </div>
            )}

            {result && (
              <div>
                <div className="hive-card" style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div className="section-label" style={{ marginBottom: 0 }}>Evidence Synthesis</div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => printPdfBrief(policyBriefOpts())}
                        style={{
                          padding: "5px 14px", fontSize: "0.72rem", fontWeight: 700,
                          color: "#f6c90e", background: "rgba(246,201,14,0.06)",
                          border: "1px solid rgba(246,201,14,0.3)",
                          borderRadius: 6, cursor: "pointer", whiteSpace: "nowrap",
                        }}
                      >
                        ⬇ PDF
                      </button>
                      <button
                        onClick={() => downloadWordBrief(policyBriefOpts())}
                        style={{
                          padding: "5px 14px", fontSize: "0.72rem", fontWeight: 700,
                          color: "#cbd5e1", background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          borderRadius: 6, cursor: "pointer", whiteSpace: "nowrap",
                        }}
                      >
                        ⬇ Word
                      </button>
                    </div>
                  </div>
                  <Markdown text={result.answer} />
                </div>
                {result.sources.length > 0 && (
                  <div style={{ marginBottom: 32 }}>
                    <div className="section-label">Sources Referenced</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {result.sources.map((s) => (
                        <div key={s.index} id={`hive-source-${s.index}`} className="source-card" style={{ scrollMarginTop: 90 }}>
                          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <span style={{ color: "#f6c90e", fontWeight: 700, minWidth: 24 }}>[{s.index}]</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ color: "#fff", fontWeight: 600, marginBottom: 2 }}>{s.title}</div>
                              <div style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                                {s.agency}{s.year ? ` · ${s.year}` : ""}
                                {s.url && <> · <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: "#4d7fb5" }}>source</a></>}
                              </div>
                            </div>
                            <div style={{ fontSize: "0.78rem", color: "#4a5a6a" }}>
                              {(s.score * 100).toFixed(0)}% match
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Policy Timeline — always visible, acts as the picker */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                <div className="section-label" style={{ marginBottom: 0 }}>All Policies — Click to Select</div>
                <span style={{ fontSize: "0.72rem", color: "#4a5a6a" }}>
                  {POLICY_TIMELINE.length} policies · ${totalInvestment.toFixed(1)}B total · 2008–2024
                </span>
              </div>

              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute", left: 70, top: 0, bottom: 0, width: 2,
                  background: "linear-gradient(to bottom, #1e2d40, #2a3d52, #1e2d40)",
                }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {POLICY_TIMELINE.map((p, i) => {
                    const isSelected = selectedIdx === i
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", paddingBottom: 10 }}
                        onClick={() => { setSelectedIdx(i); setResult(null); window.scrollTo({ top: 0, behavior: "smooth" }) }}>
                        <div style={{ width: 70, textAlign: "right", paddingRight: 18, paddingTop: 12, flexShrink: 0 }}>
                          <span style={{ fontWeight: 800, color: isSelected ? "#f6c90e" : "#6b8aa0", fontSize: "0.95rem" }}>{p.year}</span>
                        </div>
                        <div style={{
                          width: 12, height: 12, borderRadius: "50%", flexShrink: 0,
                          background: isSelected ? POLICY_TYPE_COLORS[p.type] : "#2a3d52",
                          border: `2px solid ${isSelected ? POLICY_TYPE_COLORS[p.type] : "#2a3d52"}`,
                          marginTop: 14, zIndex: 1,
                          boxShadow: isSelected ? `0 0 8px ${POLICY_TYPE_COLORS[p.type]}66` : "none",
                        }} />
                        <div className="hive-card" style={{
                          flex: 1, marginLeft: 14, cursor: "pointer",
                          borderLeft: `3px solid ${isSelected ? POLICY_TYPE_COLORS[p.type] : "#1e2d40"}`,
                          background: isSelected ? "#151f2e" : "#111827",
                          padding: "10px 16px",
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                            <span style={{ fontWeight: isSelected ? 700 : 600, color: isSelected ? "#fff" : "#94a3b8", fontSize: "0.85rem" }}>{p.event}</span>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                              <span style={{ fontWeight: 700, color: "#f6c90e", fontSize: "0.85rem" }}>${p.amount_bn}B</span>
                              <span className="badge" style={{ background: `${POLICY_TYPE_COLORS[p.type]}18`, color: POLICY_TYPE_COLORS[p.type], border: `1px solid ${POLICY_TYPE_COLORS[p.type]}33`, fontSize: "0.6rem" }}>
                                {POLICY_TYPE_LABELS[p.type]}
                              </span>
                              {isSelected && <span style={{ fontSize: "0.65rem", color: "#f6c90e", fontWeight: 700 }}>SELECTED</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ TAB 3: PROGRAM SCORECARD ══════════════════════════════════════ */}
        {activeTab === "Program Scorecard" && (
          <div>
            <p className="page-subtitle" style={{ marginBottom: 24 }}>
              What Australian housing programs promised vs what they delivered — funding committed, primary targets,
              actual outcomes and confidence ratings sourced from government evaluations and AHURI research.
            </p>
            <div className="callout-blue" style={{ marginBottom: 24, fontSize: "0.74rem", color: "#94a3b8" }}>
              <strong style={{ color: "#7aaad4" }}>How the delivery grade works.</strong>{" "}
              For active programs the grade is pace-adjusted — delivery against target measured relative to how far through
              the timeline the program is (so a mid-flight program isn&apos;t judged on raw % alone). Completed programs are
              graded on final delivery. A = on or ahead of pace, through to F = well behind.
            </div>

            <div className="grid-4" style={{ marginBottom: 28 }}>
              <div className="kpi-card">
                <div className="kpi-label">Total Committed</div>
                <div className="kpi-value" style={{ color: "#f6c90e" }}>${totalCommitted.toFixed(1)}B</div>
                <div className="kpi-delta">Across {PROGRAMS.length} programs</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Total Drawn</div>
                <div className="kpi-value" style={{ color: "#5aad8a" }}>${totalDrawn.toFixed(1)}B</div>
                <div className="kpi-delta">{Math.round(totalDrawn / totalCommitted * 100)}% of committed</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Active Programs</div>
                <div className="kpi-value" style={{ color: "#4d7fb5" }}>{activeCount}</div>
                <div className="kpi-delta">Currently delivering</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Completed</div>
                <div className="kpi-value" style={{ color: "#6b8aa0" }}>{completedCount}</div>
                <div className="kpi-delta">Closed / wound down</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {sortedPrograms.map((p) => {
                const primaryTarget  = p.targets[0]
                const primaryOutcome = p.outcomes[0]
                const delivPct       = getDeliveryPct(p)
                const dColor         = deliveryColor(delivPct, p.status)
                const dLabel         = deliveryLabel(delivPct, p.status)
                const sColor         = STATUS_COLORS[p.status] ?? "#6b8aa0"
                const score          = getScore(p)
                const isExpanded     = expandedProgram === p.short_name
                const drawnPct       = p.funding_drawn_bn != null ? Math.round(p.funding_drawn_bn / p.funding_committed_bn * 100) : null

                return (
                  <div key={p.short_name} className="hive-card" style={{ padding: 0, overflow: "hidden" }}>

                    {/* Card header — always visible */}
                    <div style={{ padding: "16px 20px", cursor: "pointer" }}
                      onClick={() => setExpandedProgram(isExpanded ? null : p.short_name)}>
                      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>

                        {/* Year column */}
                        <div style={{ flexShrink: 0, textAlign: "center", minWidth: 44 }}>
                          <div style={{ fontSize: "1rem", fontWeight: 900, color: "#f6c90e", lineHeight: 1 }}>{p.announced_year}</div>
                          <div style={{ fontSize: "0.65rem", color: "#4a5a6a", marginTop: 2 }}>{p.end_year ? `–${p.end_year}` : "ongoing"}</div>
                        </div>

                        {/* Main content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* Name row */}
                          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                            <span style={{ fontWeight: 700, color: "#e8edf2", fontSize: "0.9rem" }}>{p.name}</span>
                            <span className="badge" style={{ background: `${sColor}18`, color: sColor, border: `1px solid ${sColor}33`, fontSize: "0.6rem" }}>{p.status}</span>
                            <span className="badge badge-grey" style={{ fontSize: "0.6rem" }}>{p.program_type}</span>
                          </div>

                          {score?.note && (
                            <div style={{ fontSize: "0.68rem", color: score.color, fontWeight: 600, marginBottom: 8 }}>{score.note}</div>
                          )}

                          {/* Metrics row */}
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px 16px" }}>

                            {/* Committed vs drawn */}
                            <div>
                              <div style={{ fontSize: "0.65rem", color: "#4a5a6a", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Funding</div>
                              <div style={{ fontSize: "0.82rem", color: "#f6c90e", fontWeight: 700 }}>${p.funding_committed_bn}B committed</div>
                              {drawnPct != null && (
                                <>
                                  <div className="progress-bar" style={{ height: 4, marginTop: 4, marginBottom: 2 }}>
                                    <div className="progress-fill" style={{ width: `${Math.min(100, drawnPct)}%`, background: "#5aad8a" }} />
                                  </div>
                                  <div style={{ fontSize: "0.65rem", color: "#5aad8a" }}>${p.funding_drawn_bn}B drawn ({drawnPct}%)</div>
                                </>
                              )}
                            </div>

                            {/* Primary target */}
                            <div>
                              <div style={{ fontSize: "0.65rem", color: "#4a5a6a", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Target</div>
                              {primaryTarget ? (
                                <>
                                  <div style={{ fontSize: "0.82rem", color: "#4d7fb5", fontWeight: 600 }}>
                                    {primaryTarget.target_value.toLocaleString()} {primaryTarget.target_unit}
                                  </div>
                                  <div style={{ fontSize: "0.68rem", color: "#4a5a6a" }}>{primaryTarget.metric}</div>
                                </>
                              ) : <div style={{ fontSize: "0.78rem", color: "#4a5a6a" }}>—</div>}
                            </div>

                            {/* Primary outcome */}
                            <div>
                              <div style={{ fontSize: "0.65rem", color: "#4a5a6a", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Actual</div>
                              {primaryOutcome ? (
                                <>
                                  <div style={{ fontSize: "0.82rem", color: dColor, fontWeight: 700 }}>
                                    {typeof primaryOutcome.actual_value === "number"
                                      ? primaryOutcome.actual_value.toLocaleString()
                                      : primaryOutcome.actual_value} {primaryOutcome.actual_unit}
                                  </div>
                                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 2 }}>
                                    {delivPct !== null && (
                                      <span style={{ fontSize: "0.68rem", fontWeight: 700, color: dColor }}>{delivPct}%</span>
                                    )}
                                    <span style={{
                                      fontSize: "0.6rem", fontWeight: 700, padding: "1px 6px", borderRadius: 3,
                                      background: `${dColor}18`, color: dColor, border: `1px solid ${dColor}33`,
                                    }}>{dLabel}</span>
                                    <span style={{
                                      fontSize: "0.6rem", padding: "1px 6px", borderRadius: 3,
                                      background: `${CONFIDENCE_COLORS[primaryOutcome.confidence]}18`,
                                      color: CONFIDENCE_COLORS[primaryOutcome.confidence],
                                      border: `1px solid ${CONFIDENCE_COLORS[primaryOutcome.confidence]}33`,
                                    }}>{primaryOutcome.confidence} confidence</span>
                                  </div>
                                </>
                              ) : (
                                <div style={{ fontSize: "0.78rem", color: "#5aad8a", fontWeight: 600 }}>Active — in delivery</div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Delivery grade */}
                        {score && (
                          <div style={{ flexShrink: 0, textAlign: "center", width: 56 }}>
                            <div style={{ width: 46, height: 46, borderRadius: 10, background: `${score.color}1a`, border: `1.5px solid ${score.color}66`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                              <span style={{ fontSize: "1.45rem", fontWeight: 900, color: score.color, lineHeight: 1 }}>{score.grade}</span>
                            </div>
                            <div style={{ fontSize: "0.55rem", color: "#4a5a6a", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: 5 }}>Delivery</div>
                            <div style={{ fontSize: "0.62rem", color: score.color, fontWeight: 800 }}>{score.pctLabel}</div>
                          </div>
                        )}

                        {/* Expand toggle */}
                        <div style={{ fontSize: "0.72rem", color: "#4a5a6a", flexShrink: 0, paddingTop: 2 }}>{isExpanded ? "▲" : "▼"}</div>
                      </div>
                    </div>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div style={{ borderTop: "1px solid #1e2d40", padding: "16px 20px", background: "#0d1825" }}>
                        <p style={{ fontSize: "0.8rem", color: "#7a8fa8", lineHeight: 1.7, marginBottom: 16 }}>{p.description}</p>

                        <div className="grid-2" style={{ gap: 24 }}>
                          <div>
                            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#4d7fb5", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 10 }}>All Targets</div>
                            {p.targets.map((t) => (
                              <div key={t.metric} style={{ marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #1e2d40" }}>
                                <div style={{ fontSize: "0.78rem", color: "#c8d8e8", fontWeight: 600 }}>{t.metric}</div>
                                <div style={{ fontSize: "0.82rem", color: "#4d7fb5", fontWeight: 700 }}>
                                  {t.target_value.toLocaleString()} {t.target_unit}
                                  {t.target_year ? <span style={{ color: "#4a5a6a", fontWeight: 400 }}> by {t.target_year}</span> : ""}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div>
                            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#5aad8a", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 10 }}>All Outcomes</div>
                            {p.outcomes.map((o) => (
                              <div key={o.metric} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #1e2d40" }}>
                                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 2 }}>
                                  <span style={{ fontSize: "0.78rem", color: "#c8d8e8", fontWeight: 600 }}>{o.metric}</span>
                                  <span style={{
                                    fontSize: "0.58rem", padding: "1px 6px", borderRadius: 3, fontWeight: 700,
                                    background: `${CONFIDENCE_COLORS[o.confidence]}18`, color: CONFIDENCE_COLORS[o.confidence],
                                    border: `1px solid ${CONFIDENCE_COLORS[o.confidence]}33`,
                                  }}>{o.confidence}</span>
                                </div>
                                <div style={{ fontSize: "0.82rem", color: "#5aad8a", fontWeight: 700 }}>
                                  {typeof o.actual_value === "number" ? o.actual_value.toLocaleString() : o.actual_value} {o.actual_unit}
                                  {o.measurement_year ? <span style={{ color: "#4a5a6a", fontWeight: 400, fontSize: "0.72rem" }}> ({o.measurement_year})</span> : ""}
                                </div>
                                {o.notes && <div style={{ fontSize: "0.72rem", color: "#4a5a6a", lineHeight: 1.55, marginTop: 3 }}>{o.notes}</div>}
                              </div>
                            ))}
                          </div>
                        </div>

                        {p.source_url && (
                          <div style={{ marginTop: 8 }}>
                            <a href={p.source_url} target="_blank" rel="noopener noreferrer"
                              style={{ fontSize: "0.72rem", color: "#4d7fb5" }}>View primary source →</a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ══ TAB 4: SOURCE LIBRARY ════════════════════════════════════════ */}
        {activeTab === "Source Library" && (
          <div>
            <p className="page-subtitle" style={{ marginBottom: 8 }}>
              20 curated anchor reports from the 681 documents indexed in HIVE — the foundational references
              across AHURI, AIHW, ABS, Housing Australia, ANAO, and industry bodies. All 681 are searchable
              via Ask Research above.
            </p>
            <div className="callout-blue" style={{ marginBottom: 24, fontSize: "0.78rem", color: "#94a3b8" }}>
              <strong style={{ color: "#7aaad4" }}>681 reports indexed · 20 shown here.</strong>{" "}
              The full corpus is searchable via the Ask Research tab — type any question to query across all 681 documents.
              This library shows the 20 highest-citation, most policy-relevant anchor reports.
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
              <input
                type="text"
                className="hive-input"
                placeholder="Search reports..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: "1 1 280px", padding: "10px 14px", fontSize: "0.88rem" }}
              />
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {REPORT_TYPES.map((t) => (
                  <button
                    key={t}
                    className={`tab-pill ${typeFilter === t ? "active" : ""}`}
                    onClick={() => setTypeFilter(t)}
                    style={{ padding: "6px 12px", fontSize: "0.72rem" }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ fontSize: "0.75rem", color: "#4a5a6a", marginBottom: 14 }}>
              {filteredReports.length} report{filteredReports.length !== 1 ? "s" : ""}{search || typeFilter !== "All" ? " matching filters" : ""}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {filteredReports.map((r, i) => (
                <div key={i} className="hive-card hive-card-hover" style={{ display: "flex", gap: 16, alignItems: "center", padding: "12px 16px" }}>
                  <div style={{ minWidth: 44, textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, color: "#6b8aa0", fontSize: "0.8rem" }}>{r.year}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: "#e8edf2", fontSize: "0.85rem", marginBottom: 4, lineHeight: 1.4 }}>{r.title}</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.72rem", color: "#7a8fa8" }}>{r.agency}</span>
                      <span className="badge badge-grey" style={{ fontSize: "0.58rem" }}>{r.type}</span>
                      <a href={r.url} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: "0.7rem", color: "#4d7fb5", textDecoration: "none" }}>
                        View source →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
