"use client"
import { useState, useEffect } from "react"
import {
  ENVIRONMENTAL_METRICS, SOCIAL_METRICS, GOVERNANCE_METRICS,
  SECTOR_ESG_SCORES, SECTOR_COMPOSITE_SCORE, INVESTMENT_USE_CASES,
  ESG_MATURITY_LEVELS, PILLAR_COLORS, RATING_COLORS,
  type ESGPillar, type ESGRating,
} from "@/lib/data/esg"

const PILLARS: ESGPillar[] = ["Environmental", "Social", "Governance"]
const SECTIONS = ["Overview", "Environmental", "Social", "Governance", "Investment Lens", "Maturity Framework", "My Organisation"] as const
type Section = typeof SECTIONS[number]

// ── ESG Self-Assessment ───────────────────────────────────────────────────────
const ESG_KEY = "hive_esg_v1"

interface OrgESG {
  // Environmental
  avg_nathers:       number   // 1–10
  pct_solar:         number   // 0–100
  pct_7star:         number   // 0–100
  pct_renewable:     number   // 0–100
  no_gas:            "none" | "planned" | "committed"
  // Social
  tenant_satisfaction: number  // 0–100
  pct_accessible:    number    // 0–100
  social_roi:        number    // 0–5 ($/$ invested)
  impact_framework:  "none" | "basic" | "full"
  // Governance
  nhr_compliant:     boolean
  board_independence: number   // 0–100
  esg_report:        "none" | "partial" | "full"
  tcfd_disclosure:   "none" | "partial" | "full"
}

const DEFAULT_ORG_ESG: OrgESG = {
  avg_nathers: 2.9, pct_solar: 8, pct_7star: 21, pct_renewable: 10, no_gas: "none",
  tenant_satisfaction: 72, pct_accessible: 12, social_roi: 1.7, impact_framework: "none",
  nhr_compliant: true, board_independence: 60, esg_report: "partial", tcfd_disclosure: "none",
}

function calcOrgScores(o: OrgESG) {
  const e = Math.min(100, Math.round(
    Math.min(35, ((o.avg_nathers - 1) / 6) * 35) +
    (o.pct_solar   / 100) * 20 +
    (o.pct_7star   / 100) * 25 +
    (o.pct_renewable / 100) * 10 +
    (o.no_gas === "committed" ? 10 : o.no_gas === "planned" ? 5 : 0)
  ))
  const s = Math.min(100, Math.round(
    (o.tenant_satisfaction / 100) * 35 +
    (o.pct_accessible / 100) * 30 +
    Math.min(20, (o.social_roi / 3) * 20) +
    (o.impact_framework === "full" ? 15 : o.impact_framework === "basic" ? 7 : 0)
  ))
  const g = Math.min(100, Math.round(
    (o.nhr_compliant ? 30 : 0) +
    (o.board_independence / 100) * 25 +
    (o.esg_report === "full" ? 25 : o.esg_report === "partial" ? 12 : 0) +
    (o.tcfd_disclosure === "full" ? 20 : o.tcfd_disclosure === "partial" ? 10 : 0)
  ))
  const composite = Math.round(e * 0.35 + s * 0.35 + g * 0.30)
  return { e, s, g, composite }
}

function esgRating(score: number): ESGRating {
  if (score >= 65) return "Leader"
  if (score >= 50) return "Adequate"
  if (score >= 35) return "Below Average"
  return "Lagging"
}

const PILLAR_ICONS: Record<ESGPillar, string> = {
  Environmental: "🌍",
  Social:        "🤝",
  Governance:    "⚖️",
}

function RatingBadge({ rating, small }: { rating: ESGRating; small?: boolean }) {
  const color = RATING_COLORS[rating]
  return (
    <span style={{
      display: "inline-block", padding: small ? "1px 7px" : "2px 10px", borderRadius: 4,
      fontSize: small ? "0.58rem" : "0.65rem", fontWeight: 700,
      background: `${color}18`, color, border: `1px solid ${color}33`,
    }}>{rating}</span>
  )
}

function TrendIcon({ trend }: { trend: "improving" | "static" | "worsening" }) {
  return (
    <span style={{ fontSize: "0.72rem", color: trend === "improving" ? "#5aad8a" : trend === "worsening" ? "#c0614a" : "#6b8aa0" }}>
      {trend === "improving" ? "↗ Improving" : trend === "worsening" ? "↘ Worsening" : "→ Static"}
    </span>
  )
}

function ScoreGauge({ score, color }: { score: number; color: string }) {
  return (
    <div style={{ position: "relative" }}>
      <div style={{ fontSize: "2.4rem", fontWeight: 900, color, lineHeight: 1 }}>{score}</div>
      <div style={{ fontSize: "0.62rem", color: "#4a5a6a" }}>/100</div>
      <div className="progress-bar" style={{ height: 5, marginTop: 6 }}>
        <div className="progress-fill" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  )
}

export default function ESGPage() {
  const [activeSection, setActiveSection] = useState<Section>("Overview")
  const [orgESG, setOrgESG] = useState<OrgESG>(DEFAULT_ORG_ESG)
  const [esgSaved, setEsgSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ESG_KEY)
      if (raw) setOrgESG(JSON.parse(raw))
    } catch { /* ignore */ }
  }, [])

  function updateESG<K extends keyof OrgESG>(key: K, value: OrgESG[K]) {
    setOrgESG(prev => ({ ...prev, [key]: value }))
    setEsgSaved(false)
  }

  function saveESG() {
    localStorage.setItem(ESG_KEY, JSON.stringify(orgESG))
    setEsgSaved(true)
  }

  const orgScores = calcOrgScores(orgESG)

  const renderMetrics = (metrics: typeof ENVIRONMENTAL_METRICS) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {metrics.map(m => {
        const color = RATING_COLORS[m.rating]
        return (
          <div key={m.id} className="hive-card" style={{ borderLeft: `3px solid ${color}`, padding: "14px 20px" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, color: "#e8edf2", fontSize: "0.88rem" }}>{m.label}</span>
                  <RatingBadge rating={m.rating} small />
                  <TrendIcon trend={m.trend} />
                </div>
                <div style={{ fontSize: "0.75rem", color: "#7a8fa8", lineHeight: 1.7, marginBottom: 6 }}>{m.detail}</div>
                <div style={{ fontSize: "0.65rem", color: "#4a5a6a" }}>
                  <span style={{ color: "#4d7fb5" }}>Benchmark: </span>{m.benchmark} ·{" "}
                  <span style={{ color: "#4d7fb5" }}>Source: </span>{m.source}
                </div>
              </div>
              <div style={{ flexShrink: 0, textAlign: "right", minWidth: 120 }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 900, color, lineHeight: 1 }}>{m.value}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <div style={{ background: "#0b1220", minHeight: "100vh" }}>
      <div className="page-container">

        {/* Header */}
        {/* ── Breadcrumb ── */}
        <div style={{ marginBottom: 8, marginTop: 4 }}>
          <a href="/sustainability" style={{ fontSize: "0.72rem", color: "#1abc9c", textDecoration: "none", fontWeight: 600 }}>← Sustainability</a>
        </div>

        <div className="page-header" style={{ borderLeft: "3px solid #f6c90e" }}>
          <h1 className="page-title">ESG & Impact Intelligence</h1>
          <p className="page-subtitle">
            Environmental, Social, and Governance intelligence for the Australian social housing sector.
            How the sector performs across all three pillars — and why it matters for funding, investment, and policy.
            The sector composite ESG score is{" "}
            <strong style={{ color: "#c49a3a" }}>{SECTOR_COMPOSITE_SCORE}/100 (Below Average)</strong>{" "}
            — a significant gap from the 65+ threshold that opens access to green finance and impact capital.
          </p>
          <div style={{ fontSize: "0.72rem", color: "#4a5a6a", marginTop: 8 }}>
            Sources: AIHW · CSIRO · CHIA · Housing Australia · NHR · AHURI · ClimateWorks · ABS · state HA data
          </div>
        </div>

        {/* Sector average notice */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 12, padding: "8px 14px",
          background: "rgba(246,201,14,0.05)", border: "1px solid rgba(246,201,14,0.15)", borderRadius: 8,
        }}>
          <div style={{ fontSize: "0.68rem", color: "#c9a820", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
            ⚡ Sector Average Benchmark — all Australian CHPs (Tier 1–3)
          </div>
          <div style={{ fontSize: "0.68rem", color: "#4a5a6a", display: "flex", alignItems: "center", gap: 12 }}>
            <span>These are sector-wide estimates — your org will differ.</span>
            <button onClick={() => setActiveSection("My Organisation")}
              style={{ background: "rgba(246,201,14,0.08)", border: "1px solid rgba(246,201,14,0.3)", borderRadius: 4, padding: "2px 10px", color: "#f6c90e", cursor: "pointer", fontSize: "0.68rem", fontWeight: 700 }}>
              Score my organisation →
            </button>
          </div>
        </div>

        {/* ESG Pillar scores */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {SECTOR_ESG_SCORES.map(s => {
            const color = PILLAR_COLORS[s.pillar]
            return (
              <div key={s.pillar} className="hive-card" style={{ borderTop: `3px solid ${color}`, padding: "20px 22px" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: "1.2rem" }}>{PILLAR_ICONS[s.pillar]}</span>
                  <div>
                    <div style={{ fontWeight: 800, color: "#e8edf2", fontSize: "0.88rem" }}>{s.pillar}</div>
                    <RatingBadge rating={s.rating} small />
                  </div>
                </div>
                <ScoreGauge score={s.score} color={color} />
                <div style={{ marginTop: 12, fontSize: "0.7rem", color: "#7a8fa8", lineHeight: 1.6, borderTop: "1px solid #1e2d40", paddingTop: 10 }}>
                  <strong style={{ color }}>Strength: </strong>{s.key_strength.slice(0, 90)}...
                </div>
              </div>
            )
          })}
        </div>

        {/* Composite score callout */}
        <div style={{
          background: "#111827", border: "1px solid #1e2d40", borderRadius: 10,
          padding: "20px 24px", marginBottom: 24,
          display: "flex", gap: 24, alignItems: "center",
        }}>
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <div style={{ fontSize: "0.65rem", color: "#4a5a6a", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>Sector Composite</div>
            <div style={{ fontSize: "3rem", fontWeight: 900, color: "#c49a3a", lineHeight: 1 }}>{SECTOR_COMPOSITE_SCORE}</div>
            <div style={{ fontSize: "0.65rem", color: "#4a5a6a" }}>/100</div>
            <RatingBadge rating="Below Average" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.85rem", color: "#c8d8e8", lineHeight: 1.8, marginBottom: 8 }}>
              The sector's composite ESG score of <strong style={{ color: "#c49a3a" }}>{SECTOR_COMPOSITE_SCORE}/100</strong> reflects a sector
              that is <strong style={{ color: "#fff" }}>well-intentioned but structurally under-resourced</strong> on ESG.
              Governance is the strongest pillar (56) — CHPs generally comply with regulatory requirements.
              Social sits at 48 — genuine positive outcomes but system-level failures on wait times and unmet need.
              Environmental is the weakest (32) — driven by the 2.9-star legacy stock and 38% energy poverty rate.
            </div>
            <div style={{ fontSize: "0.78rem", color: "#6b8aa0", lineHeight: 1.7 }}>
              A score of <strong style={{ color: "#5aad8a" }}>65+</strong> unlocks meaningful access to impact capital and green finance.
              The pathway from 45 to 65 is achievable within 3-5 years through targeted interventions:
              energy retrofitting (E), social impact measurement (S), and ESG reporting infrastructure (G).
            </div>
          </div>
        </div>

        {/* Section nav */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 2 }}>
          {SECTIONS.map(s => (
            <button key={s} className={`tab-pill ${activeSection === s ? "active" : ""}`}
              onClick={() => setActiveSection(s)} style={{ padding: "8px 18px", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
              {s}
            </button>
          ))}
        </div>

        {/* ══ OVERVIEW ══════════════════════════════════════════════════════ */}
        {activeSection === "Overview" && (
          <div>
            <div className="section-label">Why ESG Matters for Social Housing — The Convergence</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 28 }}>
              {[
                {
                  pillar: "Environmental" as ESGPillar,
                  why: "Climate change is the largest long-term threat to social housing asset value. Buildings funded today will operate through 2050-2055 — when CSIRO projects dramatically intensified heat, flood, and cyclone events. An unpriced environmental risk is a ticking liability.",
                  urgency: "Insurance withdrawal is already happening in North Queensland and Northern Rivers. This is not a 2050 risk — it is a 2026 operating reality.",
                  link: "/climate-risk",
                  linkLabel: "Climate Risk →",
                },
                {
                  pillar: "Social" as ESGPillar,
                  why: "Social housing exists because markets fail the most vulnerable. But 'social' in ESG means measurement, not intention. CHPs that cannot quantify their social outcomes cannot attract impact capital, justify government investment, or demonstrate they are meeting their charitable mission.",
                  urgency: "62% of emergency housing requests go unmet. The gap between social mission and social delivery is the sector's credibility crisis — and it can only be closed through rigorous measurement.",
                  link: "/housing-need",
                  linkLabel: "Housing Need →",
                },
                {
                  pillar: "Governance" as ESGPillar,
                  why: "Governance is the enabler. Poor governance — inadequate boards, opaque financials, no ESG reporting — blocks access to every form of capital that the sector needs at scale. Green bonds, impact equity, NHFIC sustainability-linked loans all require governance infrastructure.",
                  urgency: "Only 18% of Tier 1 CHPs produce ESG reports. This leaves 82% invisible to the capital pools that could fund the sector's growth. It is a self-imposed funding ceiling.",
                  link: "/funding-sector",
                  linkLabel: "Funding & Programs →",
                },
              ].map(({ pillar, why, urgency, link, linkLabel }) => {
                const color = PILLAR_COLORS[pillar]
                const score = SECTOR_ESG_SCORES.find(s => s.pillar === pillar)!
                return (
                  <div key={pillar} className="hive-card" style={{ borderTop: `3px solid ${color}`, padding: "18px 20px", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: "1.1rem" }}>{PILLAR_ICONS[pillar]}</span>
                      <span style={{ fontWeight: 800, color: "#e8edf2" }}>{pillar}</span>
                      <ScoreGauge score={score.score} color={color} />
                    </div>
                    <div style={{ fontSize: "0.77rem", color: "#7a8fa8", lineHeight: 1.7, marginBottom: 10, flex: 1 }}>{why}</div>
                    <div style={{ fontSize: "0.72rem", color, lineHeight: 1.6, borderTop: "1px solid #1e2d40", paddingTop: 10, marginBottom: 10 }}>
                      <strong>Urgency: </strong>{urgency}
                    </div>
                    <a href={link} style={{ fontSize: "0.72rem", color, fontWeight: 700, textDecoration: "none" }}>{linkLabel}</a>
                  </div>
                )
              })}
            </div>

            {/* HIVE Analysis */}
            <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 8, padding: "18px 22px" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 14 }}>
                🐝 HIVE Analysis — The ESG Gap as a Capital Market Problem
              </div>
              <p style={{ fontSize: "0.85rem", color: "#c8d8e8", lineHeight: 1.8, marginBottom: 12 }}>
                Australia's social housing sector has a composite ESG score of {SECTOR_COMPOSITE_SCORE}/100.
                The global impact investing community — which manages more than AU$4 trillion in assets with ESG mandates —
                typically requires a minimum score of 55-65 to consider investment.
                At {SECTOR_COMPOSITE_SCORE}, the sector is <strong style={{ color: "#fff" }}>systematically excluded from the capital pools it most needs</strong>.
              </p>
              <p style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.75, marginBottom: 12 }}>
                This is not a philosophical problem — it is a structural funding ceiling.
                CHL and Housing Choices have broken through it with green bond issuances.
                The remaining 758 registered CHPs remain invisible to impact capital because they cannot demonstrate
                ESG performance in a format that capital markets can evaluate.
                The sector is leaving hundreds of millions of dollars in cheaper capital on the table every year.
              </p>
              <p style={{ fontSize: "0.8rem", color: "#6b8aa0", lineHeight: 1.7 }}>
                <strong style={{ color: "#5aad8a" }}>The opportunity:</strong>{" "}
                Moving the sector from {SECTOR_COMPOSITE_SCORE} to 65 unlocks green bond access (5-15bps cost saving),
                sustainability-linked NHFIC lending, impact equity from super funds, and preferred partner status for state government land programmes.
                At a sector financing need of $10B+ over the next decade, even 10bps cheaper capital saves $100M+ in interest costs —
                enough to fund hundreds of additional dwellings without a single extra dollar of government grant.
              </p>
            </div>
          </div>
        )}

        {/* ══ ENVIRONMENTAL ═════════════════════════════════════════════════ */}
        {activeSection === "Environmental" && (
          <div>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <p className="page-subtitle" style={{ marginBottom: 0 }}>
                  The Environmental pillar covers energy performance, carbon emissions, climate risk, and resource efficiency.
                  Social housing is among Australia's worst-performing sectors on all four dimensions —
                  but the HAFF pipeline is rapidly improving. The challenge is existing stock.
                </p>
              </div>
              <div style={{ flexShrink: 0, textAlign: "center" }}>
                <ScoreGauge score={32} color={PILLAR_COLORS.Environmental} />
                <div style={{ fontSize: "0.68rem", color: "#4a5a6a", marginTop: 4 }}>Environmental Score</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              <a href="/climate-risk" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#5aad8a", background: "rgba(90,173,138,0.1)", border: "1px solid rgba(90,173,138,0.3)", borderRadius: 6, padding: "6px 14px", textDecoration: "none" }}>
                🌡 Climate Risk Intelligence →
              </a>
              <a href="/building-energy" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#5aad8a", background: "rgba(90,173,138,0.1)", border: "1px solid rgba(90,173,138,0.3)", borderRadius: 6, padding: "6px 14px", textDecoration: "none" }}>
                ⚡ Building Energy Performance →
              </a>
            </div>
            {renderMetrics(ENVIRONMENTAL_METRICS)}
          </div>
        )}

        {/* ══ SOCIAL ════════════════════════════════════════════════════════ */}
        {activeSection === "Social" && (
          <div>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <p className="page-subtitle" style={{ marginBottom: 0 }}>
                  The Social pillar measures tenant outcomes, community impact, and service equity.
                  Social housing exists to serve the most vulnerable — the Social pillar measures whether it is succeeding.
                  The gap between mission and delivery is the sector's most important credibility challenge.
                </p>
              </div>
              <div style={{ flexShrink: 0, textAlign: "center" }}>
                <ScoreGauge score={48} color={PILLAR_COLORS.Social} />
                <div style={{ fontSize: "0.68rem", color: "#4a5a6a", marginTop: 4 }}>Social Score</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              <a href="/housing-need" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4d7fb5", background: "rgba(77,127,181,0.1)", border: "1px solid rgba(77,127,181,0.3)", borderRadius: 6, padding: "6px 14px", textDecoration: "none" }}>
                👥 Housing Need →
              </a>
              <a href="/livable-housing" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4d7fb5", background: "rgba(77,127,181,0.1)", border: "1px solid rgba(77,127,181,0.3)", borderRadius: 6, padding: "6px 14px", textDecoration: "none" }}>
                ♿ Livable Housing Design →
              </a>
              <a href="/research" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4d7fb5", background: "rgba(77,127,181,0.1)", border: "1px solid rgba(77,127,181,0.3)", borderRadius: 6, padding: "6px 14px", textDecoration: "none" }}>
                📊 Cross-Portfolio ROI →
              </a>
            </div>
            {renderMetrics(SOCIAL_METRICS)}
          </div>
        )}

        {/* ══ GOVERNANCE ════════════════════════════════════════════════════ */}
        {activeSection === "Governance" && (
          <div>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <p className="page-subtitle" style={{ marginBottom: 0 }}>
                  The Governance pillar covers regulatory compliance, financial sustainability, board quality, and transparency.
                  Good governance is the infrastructure that makes E and S performance possible —
                  and the credential that unlocks capital market access.
                </p>
              </div>
              <div style={{ flexShrink: 0, textAlign: "center" }}>
                <ScoreGauge score={56} color={PILLAR_COLORS.Governance} />
                <div style={{ fontSize: "0.68rem", color: "#4a5a6a", marginTop: 4 }}>Governance Score</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              <a href="/funding-sector" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f6c90e", background: "rgba(246,201,14,0.08)", border: "1px solid rgba(246,201,14,0.25)", borderRadius: 6, padding: "6px 14px", textDecoration: "none" }}>
                🏛 CHP Sector Intelligence →
              </a>
            </div>
            {renderMetrics(GOVERNANCE_METRICS)}
          </div>
        )}

        {/* ══ INVESTMENT LENS ═══════════════════════════════════════════════ */}
        {activeSection === "Investment Lens" && (
          <div>
            <p className="page-subtitle" style={{ marginBottom: 24 }}>
              How different capital providers use ESG data to evaluate social housing investment.
              Understanding this lens helps CHPs prioritise which ESG improvements unlock the most capital access.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {INVESTMENT_USE_CASES.map(uc => (
                <div key={uc.investor_type} className="hive-card" style={{ padding: "18px 22px" }}>
                  <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ fontSize: "1.5rem", flexShrink: 0, marginTop: 2 }}>{uc.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, color: "#e8edf2", fontSize: "0.9rem", marginBottom: 10 }}>{uc.investor_type}</div>
                      <div className="grid-2" style={{ gap: 16, marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#4d7fb5", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>How they use ESG</div>
                          {uc.how_they_use_esg.map((h, i) => (
                            <div key={i} style={{ fontSize: "0.75rem", color: "#7a8fa8", marginBottom: 5, display: "flex", gap: 6, lineHeight: 1.5 }}>
                              <span style={{ color: "#4d7fb5", flexShrink: 0 }}>·</span>{h}
                            </div>
                          ))}
                        </div>
                        <div>
                          <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#f6c90e", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Key metrics they look at</div>
                          {uc.key_metrics.map((k, i) => (
                            <div key={i} style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: 5, display: "flex", gap: 6, lineHeight: 1.5 }}>
                              <span style={{ color: "#f6c90e", flexShrink: 0 }}>·</span>{k}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#c49a3a", background: "rgba(196,154,58,0.06)", border: "1px solid rgba(196,154,58,0.2)", borderRadius: 6, padding: "8px 12px", lineHeight: 1.6 }}>
                        <strong>ESG gap risk: </strong>{uc.esg_gap_risk}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Investment opportunity callout */}
            <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 8, padding: "18px 22px", marginTop: 20 }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 }}>
                🐝 HIVE Analysis — The Capital Market Opportunity
              </div>
              <p style={{ fontSize: "0.85rem", color: "#c8d8e8", lineHeight: 1.8, marginBottom: 10 }}>
                Only two Australian CHPs have issued green bonds — CHL and Housing Choices Australia.
                Combined, they've raised approximately $500M in green-labelled debt at pricing 5-15bps below
                equivalent vanilla bonds. Extrapolating to the Tier 1 sector: if all 45 Tier 1 CHPs had green bond
                capability and refinanced 30% of their debt at 10bps cheaper, the sector would save{" "}
                <strong style={{ color: "#5aad8a" }}>approximately $45-60M per year in interest costs</strong> —
                enough to fund 500-800 additional social homes annually without additional government grants.
              </p>
              <p style={{ fontSize: "0.8rem", color: "#6b8aa0", lineHeight: 1.7 }}>
                The barrier is not investor appetite — it is CHP ESG infrastructure.
                A CHP without an environmental framework cannot issue a green bond.
                A CHP without social impact measurement cannot raise impact equity.
                A CHP without governance transparency cannot access the sustainability-linked loan market.
                <strong style={{ color: "#5aad8a" }}> ESG is not a reporting exercise — it is the key to unlocking a parallel capital system.</strong>
              </p>
            </div>
          </div>
        )}

        {/* ══ MATURITY FRAMEWORK ════════════════════════════════════════════ */}
        {activeSection === "Maturity Framework" && (
          <div>
            <p className="page-subtitle" style={{ marginBottom: 24 }}>
              A four-level ESG maturity framework for CHPs. Where are you, and what does the next level unlock?
              Most Australian CHPs are at Level 1-2. The pathway to Level 3-4 is achievable within 3-5 years.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              {ESG_MATURITY_LEVELS.map(level => {
                const color = level.color
                return (
                  <div key={level.level} className="hive-card" style={{
                    borderLeft: `3px solid ${color}`, padding: "18px 22px",
                    background: level.level === 4 ? "#0f1e0f" : level.level === 1 ? "#1e0f0f" : "#111827",
                  }}>
                    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <div style={{ flexShrink: 0, textAlign: "center", minWidth: 56 }}>
                        <div style={{ fontSize: "1.8rem", fontWeight: 900, color, lineHeight: 1 }}>{level.level}</div>
                        <div style={{ fontSize: "0.65rem", fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.5px" }}>{level.name}</div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.8rem", color: "#7a8fa8", lineHeight: 1.65, marginBottom: 10 }}>{level.description}</div>
                        <div style={{ fontSize: "0.7rem", color: "#4a5a6a", marginBottom: 10 }}>
                          <strong style={{ color: "#6b8aa0" }}>Typical CHP: </strong>{level.typical_chp}
                        </div>
                        <div className="grid-2" style={{ gap: 12 }}>
                          <div>
                            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#5aad8a", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Key actions to progress</div>
                            {level.key_actions.map((a, i) => (
                              <div key={i} style={{ fontSize: "0.72rem", color: "#6b8aa0", marginBottom: 4, display: "flex", gap: 6 }}>
                                <span style={{ color: "#5aad8a" }}>→</span>{a}
                              </div>
                            ))}
                          </div>
                          <div style={{ background: `${color}08`, border: `1px solid ${color}22`, borderRadius: 6, padding: "10px 14px" }}>
                            <div style={{ fontSize: "0.65rem", fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>HAFF implication</div>
                            <div style={{ fontSize: "0.7rem", color: "#7a8fa8", lineHeight: 1.6 }}>{level.haff_implication}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* HIVE Analysis */}
            <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 8, padding: "16px 20px" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 }}>
                🐝 HIVE Analysis — The ESG Investment That Pays for Itself
              </div>
              <p style={{ fontSize: "0.85rem", color: "#c8d8e8", lineHeight: 1.8, marginBottom: 10 }}>
                Moving from Level 1 to Level 3 requires approximately 18-24 months and an internal investment of
                $150,000-$350,000 (dedicated ESG role, systems, external assessment, reporting).
                The return: access to green bond pricing (5-15bps cheaper), NHFIC sustainability-linked loans,
                and higher HAFF application scores — collectively worth{" "}
                <strong style={{ color: "#5aad8a" }}>$500k-$2M+ per year for a Tier 1 CHP</strong> managing 2,000+ homes.
              </p>
              <p style={{ fontSize: "0.8rem", color: "#6b8aa0", lineHeight: 1.7 }}>
                The payback period on the ESG investment is under 12 months for most Tier 1 CHPs.
                Level 4 (Leading) adds green bond issuance capability and impact equity access —
                potentially unlocking hundreds of millions in alternative capital at below-market rates.
                <strong style={{ color: "#5aad8a" }}> ESG is not a cost centre — it is a capital access strategy.</strong>
              </p>
            </div>
          </div>
        )}

        {/* ── MY ORGANISATION tab ──────────────────────────────────────────── */}
        {activeSection === "My Organisation" && (
          <div>
            <div style={{ fontSize: "0.78rem", color: "#6b8aa0", lineHeight: 1.7, marginBottom: 20 }}>
              Input your organisation&apos;s metrics to see how you benchmark against the sector average (45/100).
              Scores are calculated live — save to persist across sessions.
            </div>

            {/* Score summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Environmental", score: orgScores.e,  color: PILLAR_COLORS.Environmental, sector: 32 },
                { label: "Social",        score: orgScores.s,  color: PILLAR_COLORS.Social,        sector: 48 },
                { label: "Governance",    score: orgScores.g,  color: PILLAR_COLORS.Governance,    sector: 56 },
                { label: "Composite",     score: orgScores.composite, color: "#f6c90e",            sector: SECTOR_COMPOSITE_SCORE },
              ].map(({ label, score, color, sector }) => (
                <div key={label} className="hive-card" style={{ borderTop: `3px solid ${color}`, padding: "16px 18px" }}>
                  <div style={{ fontSize: "0.65rem", color: "#6b8aa0", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: "2rem", fontWeight: 900, color, lineHeight: 1 }}>{score}</div>
                  <div style={{ fontSize: "0.6rem", color: "#4a5a6a", marginBottom: 8 }}>/100 · <RatingBadge rating={esgRating(score)} small /></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.65rem" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ background: "#1e2d40", borderRadius: 3, height: 5, overflow: "hidden", marginBottom: 2 }}>
                        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 3 }} />
                      </div>
                      <div style={{ background: "#1e2d40", borderRadius: 3, height: 3, overflow: "hidden" }}>
                        <div style={{ width: `${sector}%`, height: "100%", background: `${color}55`, borderRadius: 3 }} />
                      </div>
                    </div>
                    <span style={{ color: score > sector ? "#5aad8a" : "#c0614a", fontWeight: 700, minWidth: 36 }}>
                      {score > sector ? `+${score - sector}` : `${score - sector}`}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.58rem", color: "#4a5a6a", marginTop: 4 }}>vs sector avg {sector}</div>
                </div>
              ))}
            </div>

            {/* Environmental inputs */}
            <div className="hive-card" style={{ marginBottom: 14, borderLeft: "3px solid #5aad8a", padding: "18px 20px" }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#5aad8a", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 14 }}>🌍 Environmental</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                {[
                  { key: "avg_nathers" as const, label: "Avg NatHERS Rating", min: 1, max: 10, step: 0.1, sector: "2.9★", unit: "★", fmt: (v: number) => `${v.toFixed(1)}★` },
                  { key: "pct_solar"   as const, label: "% Dwellings with Solar", min: 0, max: 100, step: 1, sector: "~8%",  unit: "%", fmt: (v: number) => `${v}%` },
                  { key: "pct_7star"   as const, label: "% Stock at 7★ NCC 2022", min: 0, max: 100, step: 1, sector: "~21%", unit: "%", fmt: (v: number) => `${v}%` },
                  { key: "pct_renewable" as const, label: "% Renewable Energy Procurement", min: 0, max: 100, step: 1, sector: "~10%", unit: "%", fmt: (v: number) => `${v}%` },
                ].map(({ key, label, min, max, step, sector, fmt }) => (
                  <div key={key}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{label}</span>
                      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#5aad8a" }}>{fmt(orgESG[key] as number)}</span>
                    </div>
                    <input type="range" min={min} max={max} step={step} value={orgESG[key] as number}
                      onChange={e => updateESG(key, parseFloat(e.target.value) as OrgESG[typeof key])}
                      style={{ width: "100%", accentColor: "#5aad8a" }} />
                    <div style={{ fontSize: "0.58rem", color: "#4a5a6a" }}>Sector avg: {sector}</div>
                  </div>
                ))}
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginBottom: 8 }}>No-gas pipeline commitment</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {(["none", "planned", "committed"] as const).map(v => (
                      <button key={v} onClick={() => updateESG("no_gas", v)} style={{
                        padding: "4px 12px", fontSize: "0.7rem", borderRadius: 6, cursor: "pointer",
                        color: orgESG.no_gas === v ? "#0b1220" : "#94a3b8",
                        fontWeight: orgESG.no_gas === v ? 700 : 500,
                        background: orgESG.no_gas === v ? "#5aad8a" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${orgESG.no_gas === v ? "#5aad8a" : "#2a3d52"}`,
                      }}>{v.charAt(0).toUpperCase() + v.slice(1)}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Social inputs */}
            <div className="hive-card" style={{ marginBottom: 14, borderLeft: "3px solid #4d7fb5", padding: "18px 20px" }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#4d7fb5", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 14 }}>🤝 Social</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                {[
                  { key: "tenant_satisfaction" as const, label: "Tenant Satisfaction Score", min: 0, max: 100, step: 1, sector: "~72%", fmt: (v: number) => `${v}%` },
                  { key: "pct_accessible" as const, label: "% Dwellings Accessible (Silver+)", min: 0, max: 100, step: 1, sector: "~9%", fmt: (v: number) => `${v}%` },
                  { key: "social_roi" as const, label: "Social ROI ($/$ invested)", min: 0, max: 5, step: 0.1, sector: "$1.70", fmt: (v: number) => `$${v.toFixed(1)}` },
                ].map(({ key, label, min, max, step, sector, fmt }) => (
                  <div key={key}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{label}</span>
                      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#4d7fb5" }}>{fmt(orgESG[key] as number)}</span>
                    </div>
                    <input type="range" min={min} max={max} step={step} value={orgESG[key] as number}
                      onChange={e => updateESG(key, parseFloat(e.target.value) as OrgESG[typeof key])}
                      style={{ width: "100%", accentColor: "#4d7fb5" }} />
                    <div style={{ fontSize: "0.58rem", color: "#4a5a6a" }}>Sector avg: {sector}</div>
                  </div>
                ))}
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginBottom: 8 }}>Impact measurement framework</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {(["none", "basic", "full"] as const).map(v => (
                      <button key={v} onClick={() => updateESG("impact_framework", v)} style={{
                        padding: "4px 12px", fontSize: "0.7rem", borderRadius: 6, cursor: "pointer",
                        color: orgESG.impact_framework === v ? "#0b1220" : "#94a3b8",
                        fontWeight: orgESG.impact_framework === v ? 700 : 500,
                        background: orgESG.impact_framework === v ? "#4d7fb5" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${orgESG.impact_framework === v ? "#4d7fb5" : "#2a3d52"}`,
                      }}>{v === "none" ? "None" : v === "basic" ? "Basic" : "Full (GRESB)"}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Governance inputs */}
            <div className="hive-card" style={{ marginBottom: 20, borderLeft: "3px solid #6b8aa0", padding: "18px 20px" }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#6b8aa0", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 14 }}>⚖️ Governance</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginBottom: 4 }}>
                    Board independence — <strong style={{ color: "#6b8aa0" }}>{orgESG.board_independence}%</strong>
                  </div>
                  <input type="range" min={0} max={100} step={5} value={orgESG.board_independence}
                    onChange={e => updateESG("board_independence", parseInt(e.target.value))}
                    style={{ width: "100%", accentColor: "#6b8aa0" }} />
                  <div style={{ fontSize: "0.58rem", color: "#4a5a6a" }}>Sector avg: ~71%</div>
                </div>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 8 }}>
                    <input type="checkbox" checked={orgESG.nhr_compliant}
                      onChange={e => updateESG("nhr_compliant", e.target.checked)}
                      style={{ accentColor: "#6b8aa0" }} />
                    <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>NHR registered and compliant</span>
                  </label>
                </div>
                {[
                  { key: "esg_report" as const, label: "ESG / sustainability report", options: ["none", "partial", "full"] as const, labels: ["None", "Annual report mention", "Standalone ESG report"] },
                  { key: "tcfd_disclosure" as const, label: "TCFD climate risk disclosure", options: ["none", "partial", "full"] as const, labels: ["None", "Partial disclosure", "Full TCFD"] },
                ].map(({ key, label, options, labels }) => (
                  <div key={key}>
                    <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginBottom: 8 }}>{label}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {options.map((v, i) => (
                        <button key={v} onClick={() => updateESG(key, v)} style={{
                          padding: "4px 10px", fontSize: "0.68rem", borderRadius: 6, cursor: "pointer",
                          color: orgESG[key] === v ? "#0b1220" : "#94a3b8",
                          fontWeight: orgESG[key] === v ? 700 : 500,
                          background: orgESG[key] === v ? "#6b8aa0" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${orgESG[key] === v ? "#6b8aa0" : "#2a3d52"}`,
                        }}>{labels[i]}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save + pathway */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
              <div style={{ fontSize: "0.75rem", color: "#4a5a6a" }}>
                {orgScores.composite >= 65
                  ? <span style={{ color: "#5aad8a", fontWeight: 700 }}>✅ Above HIVE&apos;s 65 green-finance benchmark</span>
                  : <span>Gap to HIVE green-finance benchmark (65): <strong style={{ color: "#c49a3a" }}>{65 - orgScores.composite} points</strong></span>}
              </div>
              <button onClick={saveESG} style={{
                background: esgSaved ? "rgba(90,173,138,0.1)" : "rgba(246,201,14,0.1)",
                border: `1px solid ${esgSaved ? "#5aad8a" : "rgba(246,201,14,0.4)"}`,
                borderRadius: 8, padding: "9px 20px",
                color: esgSaved ? "#5aad8a" : "#f6c90e",
                fontSize: "0.76rem", fontWeight: 700, cursor: "pointer",
              }}>
                {esgSaved ? "✓ Saved" : "Save Assessment"}
              </button>
            </div>
          </div>
        )}

        {/* Methodology */}
        <div style={{ marginTop: 32, borderTop: "1px solid #1e2d40", paddingTop: 14 }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#4a5a6a", letterSpacing: "1.8px", textTransform: "uppercase", marginBottom: 6 }}>Methodology</div>
          <div style={{ fontSize: "0.7rem", color: "#4a5a6a", lineHeight: 1.6 }}>
            ESG scores are HIVE-derived estimates based on published sector data and AHURI research, and aligned with the <strong>CHIA ESG Reporting Standard (2023)</strong> — the community-housing sector&apos;s own framework — with broader-market frameworks (GRESB, ICMA Green Bond Principles) as reference only. The 65 &ldquo;green-finance&rdquo; mark is a HIVE readiness benchmark, not an official standard (no single ESG-score threshold governs green-finance eligibility).
            Sector composite is a simple average of E (32), S (48), G (56). Individual CHP scoring requires on-site assessment.
            Data sources cited inline. Scores reflect the sector as a whole — leading CHPs significantly outperform these averages.
          </div>
        </div>

      </div>
    </div>
  )
}
