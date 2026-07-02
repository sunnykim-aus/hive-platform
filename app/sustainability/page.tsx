"use client"
import { getEnergyStats } from "@/lib/data/building-energy"
import { getNationalStats } from "@/lib/data/livable-housing"
import { SECTOR_COMPOSITE_SCORE, SECTOR_ESG_SCORES, PILLAR_COLORS } from "@/lib/data/esg"
import { getCompoundStats } from "@/lib/data/asset-intelligence"

const PILLARS = [
  {
    icon: "🌡",
    title: "Climate Risk Intelligence",
    subtitle: "152 suburbs · 5 hazard types · 8 states",
    href: "/climate-risk",
    color: "#c0614a",
    stats: [] as { label: string; value: string }[],
  },
  {
    icon: "⚡",
    title: "Building Energy Performance",
    subtitle: "NatHERS ratings · tenant cost burden · upgrade pathway",
    href: "/building-energy",
    color: "#c49a3a",
    stats: [] as { label: string; value: string }[],
  },
  {
    icon: "♿",
    title: "Livable Housing Design",
    subtitle: "Silver / Gold / Platinum · HAFF requirements · state compliance",
    href: "/livable-housing",
    color: "#8899aa",
    stats: [] as { label: string; value: string }[],
  },
  {
    icon: "🌍",
    title: "ESG & Impact Intelligence",
    subtitle: "Environmental · Social · Governance · investment lens",
    href: "/esg-impact",
    color: "#f6c90e",
    stats: [] as { label: string; value: string }[],
  },
  {
    icon: "🔬",
    title: "Asset Intelligence",
    subtitle: "Compound risk · triple failure · HAFF readiness",
    href: "/asset-intelligence",
    color: "#8b1a1a",
    stats: [] as { label: string; value: string }[],
  },
]

export default function SustainabilityPage() {
  const energyStats = getEnergyStats()
  const lhdStats    = getNationalStats()
  const compStats   = getCompoundStats()

  // Inject dynamic stats
  const cards = [
    {
      ...PILLARS[0],
      stats: [
        { label: "Critical risk suburbs", value: "48" },
        { label: "Insurance withdrawal risk", value: "31" },
        { label: "Social dwellings at High+ risk", value: "~80k" },
      ],
    },
    {
      ...PILLARS[1],
      stats: [
        { label: "Avg social stock rating", value: `~2.9★` },
        { label: "Below 3-star", value: `~${Math.round(energyStats.below3star/1000)}k dwellings` },
        { label: "In energy poverty", value: `~${energyStats.avgEnergyPoverty}%` },
      ],
    },
    {
      ...PILLARS[2],
      stats: [
        { label: "Meet Silver standard", value: `~9%` },
        { label: "Need upgrade", value: `~${Math.round(lhdStats.totalNeeding/1000)}k dwellings` },
        { label: "National upgrade cost", value: `$${lhdStats.totalCost.toFixed(1)}B` },
      ],
    },
    {
      ...PILLARS[3],
      stats: [
        { label: "Sector composite ESG", value: `${SECTOR_COMPOSITE_SCORE}/100` },
        { label: "Below HIVE green-finance benchmark", value: "65+ (HIVE)" },
        { label: "Producing ESG reports", value: "~12% of CHPs" },
      ],
    },
    {
      ...PILLARS[4],
      stats: [
        { label: "Highest-risk (top ~10%)", value: `${compStats.extreme} suburbs` },
        { label: "HAFF R4 gaps", value: `${compStats.haff_not_ready} suburbs` },
        { label: "Avg triple fix cost", value: `~$${compStats.avg_fix_cost_k}k/dwelling` },
      ],
    },
  ]

  return (
    <div style={{ background: "#0b1220", minHeight: "100vh" }}>
      <div className="page-container">

        {/* Header */}
        <div className="page-header" style={{ borderLeft: "3px solid #1abc9c" }}>
          <h1 className="page-title">Sustainability</h1>
          <p className="page-subtitle">
            A subset of suburbs — HIVE's highest compound-risk tier (top ~10% of the 152 profiled) — face climate exposure, energy-poor stock, and LHD non-compliance simultaneously.
            163k social dwellings are below 3-star NatHERS. Only 9% meet Silver livability standard. The HIVE ESG framework rates the sector at 45/100 — 20 points below HIVE&apos;s green-finance readiness benchmark (65).
            These are not separate problems. They concentrate in the same assets, affect the same tenants, and require connected intelligence to solve.
          </p>
        </div>

        {/* Module nav — most important first */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { label: "Asset Intelligence", href: "/asset-intelligence", color: "#e67e22" },
            { label: "Climate Risk",       href: "/climate-risk",       color: "#c0614a" },
            { label: "Building Energy",    href: "/building-energy",    color: "#5aad8a" },
            { label: "Livable Housing",    href: "/livable-housing",    color: "#f6c90e" },
            { label: "ESG & Impact",       href: "/esg-impact",         color: "#4d7fb5" },
          ].map(({ label, href, color }) => (
            <a key={label} href={href} style={{
              display: "inline-block", padding: "8px 18px", fontSize: "0.82rem", fontWeight: 600,
              color: "#c8d8e8", background: "rgba(255,255,255,0.04)",
              border: `1px solid #1e2d40`, borderTop: `2px solid ${color}`,
              borderRadius: "0 0 6px 6px", textDecoration: "none", transition: "all 0.15s",
            }}>
              {label}
            </a>
          ))}
        </div>

        {/* Jump nav — 3 sections only */}
        <div style={{
          borderTop: "1px solid #1e2d40", borderBottom: "1px solid #1e2d40",
          background: "#070d18", overflowX: "auto", scrollbarWidth: "none",
          margin: "0 -24px 28px",
        }}>
          <div style={{ display: "flex", gap: 4, padding: "7px 24px", whiteSpace: "nowrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#4a5a6a", marginRight: 8, letterSpacing: "1px", textTransform: "uppercase", flexShrink: 0 }}>JUMP TO</span>
            {[
              { id: "sus-kpis",  label: "Sector Summary" },
              { id: "sus-why",   label: "Why These Five Connect" },
              { id: "sus-paths", label: "Decision Paths" },
            ].map(s => (
              <a key={s.id} href={`#${s.id}`} style={{
                display: "inline-block", padding: "4px 12px", fontSize: "0.72rem", fontWeight: 600,
                color: "#94a3b8", background: "rgba(255,255,255,0.04)", border: "1px solid #1e2d40",
                borderRadius: 4, textDecoration: "none",
              }}>{s.label}</a>
            ))}
          </div>
        </div>

        {/* ── 1. SECTOR SUMMARY — 5 live numbers ── */}
        <div id="sus-kpis" style={{ scrollMarginTop: 130, marginBottom: 32 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0,1fr))", gap: 8 }}>
            {[
              { label: "Highest-Risk Suburbs", value: `${compStats.extreme}`, color: "#e67e22", delta: "Top ~10% compound risk (HIVE ranking)", href: "/asset-intelligence" },
              { label: "Critical Climate Risk", value: "8", color: "#c0614a", delta: "Highest climate tier · 31 facing insurance loss", href: "/climate-risk" },
              { label: "Below 3★ NatHERS", value: `~${Math.round(energyStats.below3star/1000)}k`, color: "#5aad8a", delta: `${Math.round(energyStats.below3star/energyStats.totalStock*100)}% of stock — urgent heat risk`, href: "/building-energy" },
              { label: "Below Silver LHD", value: `~${Math.round(lhdStats.totalNeeding/1000)}k`, color: "#f6c90e", delta: "91% of social stock · $2.8B to fix", href: "/livable-housing" },
              { label: "HIVE ESG framework score", value: `${SECTOR_COMPOSITE_SCORE}/100`, color: "#4d7fb5", delta: "Below Average · 20pts below HIVE benchmark (65)", href: "/esg-impact" },
            ].map(({ label, value, color, delta, href }) => (
              <a key={label} href={href} style={{ textDecoration: "none", height: "100%" }}>
                <div className="hive-card hive-card-hover" style={{
                  borderTop: `3px solid ${color}`, cursor: "pointer",
                  padding: "16px 16px", height: "100%", boxSizing: "border-box",
                }}>
                  <div style={{ fontSize: "1.7rem", fontWeight: 900, color, lineHeight: 1, marginBottom: 6 }}>{value}</div>
                  <div style={{ fontSize: "0.64rem", fontWeight: 700, color: "#7a8fa8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: "0.68rem", color: "#6b8aa0", lineHeight: 1.4 }}>{delta}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── 2. WHY THESE FIVE CONNECT ── */}
        <div id="sus-why" style={{ scrollMarginTop: 130, marginBottom: 32 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#4a5a6a", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 14 }}>
            Why these five modules must be read together
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              {
                title: "Climate × Energy = Mortality Risk",
                body: "A Critical heat-risk suburb with 2-star NatHERS stock creates indoor temperatures of 43°C+ on extreme heat days. Neither problem alone is fatal — together they are. That intersection is what Asset Intelligence maps.",
                color: "#c0614a",
                tag: "Climate Risk + Building Energy → Asset Intelligence",
              },
              {
                title: "Energy × LHD = Tenant Poverty Trap",
                body: "A tenant in a 2-star home with non-compliant LHD pays $2,200+ extra per year in energy costs, cannot age in place, and has no pathway to independence. The same capital investment — upgrading the dwelling — fixes both simultaneously.",
                color: "#5aad8a",
                tag: "Building Energy + Livable Housing",
              },
              {
                title: "ESG × Capital = The Funding Unlock",
                body: "A CHP that documents climate risk, energy upgrades, and LHD compliance in a structured ESG report unlocks green bond pricing (10bps cheaper), NHFIC sustainability-linked loans, and impact equity — funding hundreds more homes at no additional cost.",
                color: "#4d7fb5",
                tag: "All five modules → ESG & Impact",
              },
            ].map(({ title, body, color, tag }) => (
              <div key={title} className="hive-card" style={{ borderTop: `2px solid ${color}`, padding: "18px 20px" }}>
                <div style={{ fontWeight: 700, color: "#e8edf2", fontSize: "0.88rem", marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: "0.78rem", color: "#7a8fa8", lineHeight: 1.7, marginBottom: 12 }}>{body}</div>
                <div style={{ fontSize: "0.62rem", color: color, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", background: `${color}10`, padding: "3px 8px", borderRadius: 4, display: "inline-block" }}>{tag}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. DECISION PATHS ── */}
        <div id="sus-paths" style={{ scrollMarginTop: 130 }} />
        <div className="section-label">Start here — common decision paths</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {[
            { q: "Which suburbs have the worst compound risk?", href: "/asset-intelligence", color: "#c0614a" },
            { q: "Is my project HAFF Round 4 ready on all dimensions?", href: "/asset-intelligence", color: "#c49a3a" },
            { q: "What does my state's social housing stock score on climate risk?", href: "/climate-risk", color: "#c0614a" },
            { q: "How much will it cost to bring my portfolio to 7-star energy?", href: "/building-energy", color: "#c49a3a" },
            { q: "What LHD tier do I need for the women's safety stream?", href: "/livable-housing", color: "#8899aa" },
            { q: "What ESG score do I need to access green bonds?", href: "/esg-impact", color: "#f6c90e" },
          ].map(({ q, href, color }) => (
            <a key={q} href={href} style={{ textDecoration: "none" }}>
              <div className="hive-card hive-card-hover" style={{ padding: "12px 16px", display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ color, fontWeight: 700, flexShrink: 0 }}>→</span>
                <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{q}</span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </div>
  )
}
