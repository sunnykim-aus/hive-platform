"use client"
import { useState } from "react"
import { usePortfolio } from "@/lib/usePortfolio"
import { STREAM_LABELS, STREAM_HAFF_TIER, type HousingStream } from "@/lib/portfolio"
import {
  LHD_TIERS, STATE_COMPLIANCE, HAFF_LHD_REQUIREMENTS,
  UPGRADE_COSTS, DEMAND_DRIVERS, getNationalStats, TIER_COLORS,
  type LHDTierName,
} from "@/lib/data/livable-housing"

const SECTIONS = ["Overview", "State Compliance", "HAFF Requirements", "Upgrade Costs", "Demand Drivers"] as const
type Section = typeof SECTIONS[number]

// Platinum gets a premium crisp blue-white — visually above Gold, not below
const DISPLAY_COLORS: Record<LHDTierName, string> = {
  Silver:   "#8899aa",
  Gold:     "#f6c90e",
  Platinum: "#c8e0f4",   // premium crisp blue-white — clearly above Gold
}

function TierBadge({ tier, small }: { tier: LHDTierName; small?: boolean }) {
  const color = DISPLAY_COLORS[tier]
  return (
    <span style={{
      display: "inline-block",
      padding: small ? "1px 7px" : "2px 10px",
      borderRadius: 4,
      fontSize: small ? "0.6rem" : "0.68rem",
      fontWeight: 700,
      background: tier === "Platinum" ? "rgba(200,224,244,0.12)" : `${color}18`,
      color,
      border: `1px solid ${color}44`,
      letterSpacing: "0.3px",
    }}>{tier}</span>
  )
}

// maxPct allows tier-specific scaling so all bars show meaningful differences
function ComplianceBar({ pct, color, maxPct = 20 }: { pct: number; color: string; maxPct?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, background: "#1e2d40", borderRadius: 4, height: 8, overflow: "hidden" }}>
        <div style={{ width: `${Math.max(4, Math.min(100, (pct / maxPct) * 100))}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontSize: "0.78rem", fontWeight: 700, color, minWidth: 36 }}>{pct}%</span>
    </div>
  )
}

export default function LivableHousingPage() {
  const [activeSection, setActiveSection] = useState<Section>("Overview")
  const [selectedTypology, setSelectedTypology] = useState(0)
  const [numDwellings, setNumDwellings] = useState(50)
  const stats = getNationalStats()
  const { portfolio, hasPortfolio } = usePortfolio()

  // Derive stream-specific requirements from portfolio
  const streamRequirements = hasPortfolio && portfolio ? (() => {
    const goldStreams = portfolio.housing_streams.filter(s => STREAM_HAFF_TIER[s as HousingStream] === "Gold mandatory")
    const platStreams = portfolio.housing_streams.filter(s => STREAM_HAFF_TIER[s as HousingStream] === "Platinum / SDA")
    const minTier = platStreams.length > 0 ? "Platinum" : goldStreams.length > 0 ? "Gold" : "Silver"
    return { goldStreams, platStreams, minTier }
  })() : null

  return (
    <div style={{ background: "#0b1220", minHeight: "100vh" }}>
      <div className="page-container">

        {/* Header */}
        {/* ── Breadcrumb ── */}
        <div style={{ marginBottom: 8, marginTop: 4 }}>
          <a href="/sustainability" style={{ fontSize: "0.72rem", color: "#1abc9c", textDecoration: "none", fontWeight: 600 }}>← Sustainability</a>
        </div>

        <div className="page-header" style={{ borderLeft: "3px solid #f6c90e" }}>
          <h1 className="page-title">Livable Housing Design</h1>
          <p className="page-subtitle">
            Australia's national accessible housing standard — Silver, Gold, and Platinum tiers.
            Housing Australia requires HAFF-funded housing to meet Silver minimum;
            Round 3 mandates Gold for specialist streams. Only{" "}
            <strong style={{ color: "#f6c90e" }}>~{Math.round(stats.totalSilver / 1000)}k of ~{(stats.totalStock / 1000).toFixed(0)}k</strong>{" "}
            profiled social dwellings (~{Math.round(stats.totalSilver / stats.totalStock * 100)}%) meet Silver standard
            — across 8 states/territories (AIHW national total ~430k).
          </p>
          <div style={{ fontSize: "0.72rem", color: "#4a5a6a", marginTop: 8 }}>
            Sources: Livable Housing Australia LHDG 4th Edition · Housing Australia HAFF Design Guidelines · AIHW Housing Assistance 2023 · AHURI Accessible Housing Report 2022
          </div>
        </div>

        {/* National KPIs */}
        <div className="grid-4" style={{ marginBottom: 28 }}>
          {[
            { label: "Meet Silver Standard", value: `~${Math.round(stats.totalSilver / stats.totalStock * 100)}%`, color: TIER_COLORS.Silver, delta: `~${Math.round(stats.totalSilver/1000)}k of ~${(stats.totalStock/1000).toFixed(0)}k profiled dwellings (est.)` },
            { label: "Meet Gold Standard", value: `${(stats.totalGold / stats.totalStock * 100).toFixed(1)}%`, color: TIER_COLORS.Gold, delta: `${stats.totalGold.toLocaleString()} dwellings — Gold or above` },
            { label: "Need Silver Upgrade", value: `${(stats.totalNeeding / 1000).toFixed(0)}k`, color: "#c0614a", delta: "Below minimum HAFF standard" },
            { label: "National Upgrade Cost", value: `$${stats.totalCost.toFixed(1)}B`, color: "#c49a3a", delta: "To bring all stock to Silver minimum" },
          ].map(({ label, value, color, delta }) => (
            <div key={label} className="kpi-card" style={{ borderTop: `3px solid ${color}` }}>
              <div className="kpi-label">{label}</div>
              <div className="kpi-value" style={{ color, fontSize: "1.6rem" }}>{value}</div>
              <div className="kpi-delta">{delta}</div>
            </div>
          ))}
        </div>

        {/* Why it matters */}
        <div className="callout-gold" style={{ marginBottom: 28 }}>
          <strong style={{ color: "#f6c90e" }}>Why this matters for HAFF Round 3.</strong>{" "}
          Housing Australia explicitly scores Round 3 applications on LHD compliance level — Gold proposals receive additional assessment points over Silver.
          For specialist streams (supported disability, First Nations, women's safety, older persons), Gold is <strong style={{ color: "#fff" }}>mandatory, not optional</strong>.
          CHPs submitting below-Gold proposals for these streams will be screened out regardless of other merits.
          With {(stats.totalNeeding / 1000).toFixed(0)}k existing dwellings below Silver standard, the compliance upgrade task is also a significant CHP capital programme.
        </div>

        {/* Portfolio stream alert */}
        {streamRequirements && (
          <div style={{
            background: "#111827", border: "1px solid #f6c90e33", borderLeft: "3px solid #f6c90e",
            borderRadius: "0 10px 10px 0", padding: "12px 18px", marginBottom: 20,
            display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap",
          }}>
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#f6c90e", textTransform: "uppercase", letterSpacing: "1px", flexShrink: 0 }}>
              {portfolio?.org_name} — your HAFF R3 minimum
            </span>
            <TierBadge tier={streamRequirements.minTier as LHDTierName} small />
            {streamRequirements.goldStreams.length > 0 && (
              <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                Gold required for: {streamRequirements.goldStreams.map(s => STREAM_LABELS[s as HousingStream]).join(", ")}
              </span>
            )}
            {streamRequirements.platStreams.length > 0 && (
              <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                Platinum/SDA required for: {streamRequirements.platStreams.map(s => STREAM_LABELS[s as HousingStream]).join(", ")}
              </span>
            )}
            <a href="/my-portfolio" style={{ fontSize: "0.65rem", color: "#4a5a6a", textDecoration: "none", marginLeft: "auto", flexShrink: 0 }}>Edit streams →</a>
          </div>
        )}

        {/* Section nav */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {SECTIONS.map(s => (
            <button key={s}
              className={`tab-pill ${activeSection === s ? "active" : ""}`}
              onClick={() => setActiveSection(s)}
              style={{ padding: "8px 20px", fontSize: "0.82rem" }}>
              {s}
            </button>
          ))}
        </div>

        {/* ══ OVERVIEW ═══════════════════════════════════════════════════════ */}
        {activeSection === "Overview" && (
          <div>
            <div className="section-label">The Three Tiers — What Each Means</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
              {LHD_TIERS.map(tier => {
              const dc = DISPLAY_COLORS[tier.name]
              return (
                <div key={tier.name} className="hive-card" style={{
                  borderTop: `3px solid ${dc}`,
                  padding: "20px 22px",
                  background: tier.name === "Platinum" ? "#131e2e" : "#111827",
                }}>
                  {/* Tier header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <TierBadge tier={tier.name} />
                    <span style={{ fontSize: "0.72rem", color: "#4a5a6a" }}>{tier.tagline}</span>
                  </div>

                  <p style={{ fontSize: "0.79rem", color: "#7a8fa8", lineHeight: 1.7, marginBottom: 16 }}>
                    {tier.description}
                  </p>

                  {/* Key features */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#4a5a6a", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>Key requirements</div>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {tier.key_features.slice(0, 5).map((f, i) => (
                        <li key={i} style={{ fontSize: "0.72rem", color: "#6b8aa0", marginBottom: 5, display: "flex", gap: 6, lineHeight: 1.5 }}>
                          <span style={{ color: tier.color, flexShrink: 0 }}>·</span>
                          {f}
                        </li>
                      ))}
                      {tier.key_features.length > 5 && (
                        <li style={{ fontSize: "0.68rem", color: "#4a5a6a" }}>+{tier.key_features.length - 5} more requirements</li>
                      )}
                    </ul>
                  </div>

                  {/* Stats */}
                  <div style={{ borderTop: "1px solid #1e2d40", paddingTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px" }}>
                    {[
                      ["Current stock", `${tier.pct_social_stock_meeting}%`],
                      ["New builds post-2022 est.", `${tier.pct_new_builds_meeting}%`],
                      ["Retrofit cost", `~$${tier.upgrade_cost_from_none_k}k`],
                      ["HAFF status", tier.haff_rounds_requiring.length > 0 ? "Required" : "Optional"],
                    ].map(([l, v]) => (
                      <div key={l}>
                        <div style={{ fontSize: "0.6rem", color: "#4a5a6a", textTransform: "uppercase", letterSpacing: "0.5px" }}>{l}</div>
                        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: dc }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  {/* HAFF requirement */}
                  <div style={{ marginTop: 12, background: `${dc}08`, border: `1px solid ${dc}22`, borderRadius: 6, padding: "8px 12px" }}>
                    <div style={{ fontSize: "0.62rem", fontWeight: 700, color: dc, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>HAFF requirement</div>
                    <div style={{ fontSize: "0.7rem", color: "#94a3b8", lineHeight: 1.55 }}>{tier.haff_requirement}</div>
                  </div>
                </div>
              )})}
            </div>

            {/* Gap analysis */}
            <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 8, padding: "16px 20px", marginBottom: 24 }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 }}>
                🐝 HIVE Analysis — The Compliance Gap
              </div>
              <p style={{ fontSize: "0.85rem", color: "#c8d8e8", lineHeight: 1.8, marginBottom: 10 }}>
                Only <strong style={{ color: TIER_COLORS.Silver }}>8% of Australia's social housing stock</strong> meets even the Silver baseline standard —
                meaning 92% of existing social dwellings fail the minimum that Housing Australia now requires for all new HAFF-funded construction.
                This gap will not close through new builds alone: even at HAFF's target pace of 40,000 new homes, the existing stock of 390,000+ non-compliant dwellings
                represents a <strong style={{ color: "#fff" }}>10:1 legacy liability</strong> for every new compliant home added.
              </p>
              <p style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.75, marginBottom: 10 }}>
                <strong style={{ color: "#c49a3a" }}>The ageing population compounds this urgency.</strong>{" "}
                By 2030, 5.8 million Australians will be aged 65+ — and 80% of people with disability prefer to age in place.
                Without accessible housing, the social housing system will be forcing its most vulnerable tenants
                (elderly, mobility-impaired, NDIS participants) into housing that actively prevents independence.
              </p>
              <p style={{ fontSize: "0.8rem", color: "#6b8aa0", lineHeight: 1.7 }}>
                <strong style={{ color: "#5aad8a" }}>The investable opportunity:</strong>{" "}
                Upgrading all existing social housing to Silver standard nationally costs an estimated ${stats.totalCost.toFixed(1)}B.
                This is less than the annual Commonwealth housing assistance spend — and generates returns through reduced aged care demand,
                reduced hospital presentations, and extended independent living. Framed correctly, this is health and aged care savings, not housing expenditure.
              </p>
            </div>

            {/* Demand drivers */}
            <div className="section-label">Why Demand is Growing</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              {DEMAND_DRIVERS.map(d => (
                <div key={d.driver} className="hive-card" style={{ padding: "14px 18px" }}>
                  <div style={{ fontWeight: 700, color: "#e8edf2", fontSize: "0.85rem", marginBottom: 6 }}>{d.driver}</div>
                  <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: "0.6rem", color: "#4a5a6a", textTransform: "uppercase" }}>Now</div>
                      <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#f6c90e" }}>{d.current_estimate}</div>
                    </div>
                    <div style={{ alignSelf: "center", color: "#2a3d52", fontSize: "1rem" }}>→</div>
                    <div>
                      <div style={{ fontSize: "0.6rem", color: "#4a5a6a", textTransform: "uppercase" }}>2030</div>
                      <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#c49a3a" }}>{d.projected_2030}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#7a8fa8", lineHeight: 1.6 }}>{d.relevance}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ STATE COMPLIANCE ═══════════════════════════════════════════════ */}
        {activeSection === "State Compliance" && (
          <div>
            <p className="page-subtitle" style={{ marginBottom: 24 }}>
              Estimated compliance rates for existing social housing stock across all states and territories.
              Based on AIHW stock data, AHURI research, and state housing authority reports.
              Figures are planning estimates — individual properties require on-site LHA-certified assessment.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[...STATE_COMPLIANCE].sort((a, b) => b.pct_meeting_silver - a.pct_meeting_silver).map(state => (
                <div key={state.state} className="hive-card" style={{ padding: "18px 22px" }}>
                  <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

                    {/* State info */}
                    <div style={{ minWidth: 180 }}>
                      <div style={{ fontWeight: 800, color: "#e8edf2", fontSize: "0.9rem" }}>{state.label}</div>
                      <div style={{ fontSize: "0.68rem", color: "#4a5a6a", marginTop: 2 }}>
                        {(state.total_social_dwellings / 1000).toFixed(0)}k social dwellings · avg {state.avg_dwelling_age_years} yrs old
                      </div>
                    </div>

                    {/* Compliance bars */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px 20px", marginBottom: 10 }}>
                        {([
                          { tier: "Silver" as LHDTierName, pct: state.pct_meeting_silver, maxPct: 20 },
                          { tier: "Gold" as LHDTierName, pct: state.pct_meeting_gold, maxPct: 3.5 },
                          { tier: "Platinum" as LHDTierName, pct: state.pct_meeting_platinum, maxPct: 1 },
                        ]).map(({ tier, pct, maxPct }) => (
                          <div key={tier}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                              <TierBadge tier={tier} small />
                              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: DISPLAY_COLORS[tier] }}>{pct}%</span>
                            </div>
                            <div className="progress-bar" style={{ height: 6 }}>
                              <div className="progress-fill" style={{ width: `${Math.max(4, Math.min(100, (pct/maxPct)*100))}%`, background: DISPLAY_COLORS[tier] }} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#7a8fa8", lineHeight: 1.6 }}>
                        <strong style={{ color: "#c0614a" }}>{state.dwellings_needing_silver_upgrade.toLocaleString()} dwellings</strong> below Silver standard ·
                        Upgrade cost to Silver: <strong style={{ color: "#c49a3a" }}>${(state.upgrade_cost_to_silver_bn * 1000).toFixed(0)}M</strong> ·
                        HAFF pipeline compliant: <strong style={{ color: state.haff_pipeline_compliant_pct >= 80 ? "#5aad8a" : "#c49a3a" }}>{state.haff_pipeline_compliant_pct}%</strong>
                      </div>
                    </div>

                    {/* Primary barrier */}
                    <div style={{ flexShrink: 0, maxWidth: 260 }}>
                      <div style={{ fontSize: "0.6rem", color: "#4a5a6a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Primary barrier</div>
                      <div style={{ fontSize: "0.72rem", color: "#6b8aa0", lineHeight: 1.55 }}>{state.primary_barrier}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ HAFF REQUIREMENTS ══════════════════════════════════════════════ */}
        {activeSection === "HAFF Requirements" && (
          <div>
            <p className="page-subtitle" style={{ marginBottom: 24 }}>
              Livable Housing Design requirements across HAFF Rounds 1–3.
              Non-compliance results in application rejection or grant clawback post-construction.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
              {HAFF_LHD_REQUIREMENTS.map(req => (
                <div key={req.round} className="hive-card" style={{
                  borderLeft: `3px solid ${req.minimum_standard === "Silver" && req.specialist_standard === "Silver" ? TIER_COLORS.Silver : TIER_COLORS.Gold}`,
                  padding: "18px 22px",
                }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 800, color: "#e8edf2", fontSize: "0.9rem" }}>{req.round}</span>
                    <span style={{ fontSize: "0.7rem", color: "#4a5a6a" }}>{req.announced}</span>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ fontSize: "0.62rem", color: "#4a5a6a" }}>Minimum:</span>
                      <TierBadge tier={req.minimum_standard} small />
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ fontSize: "0.62rem", color: "#4a5a6a" }}>Specialist:</span>
                      <TierBadge tier={req.specialist_standard} small />
                    </div>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#7a8fa8", lineHeight: 1.7, marginBottom: 10 }}>{req.details}</p>
                  <div style={{ fontSize: "0.7rem", color: "#4a5a6a", background: "rgba(255,255,255,0.02)", border: "1px solid #1e2d40", borderRadius: 6, padding: "8px 12px" }}>
                    <strong style={{ color: "#6b8aa0" }}>Compliance check: </strong>{req.compliance_check}
                  </div>
                </div>
              ))}
            </div>

            {/* Round 3 Action Checklist */}
            <div className="hive-card" style={{ marginBottom: 20, padding: "18px 22px" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#5aad8a", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 16 }}>
                ✓ What to do right now — Round 3 compliance checklist
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
                {[
                  { n: "01", title: "Confirm your housing stream", action: "Women's safety, First Nations, older persons, NDIS-linked = Gold mandatory. General social housing = Silver. Identify this before anything else.", urgent: true },
                  { n: "02", title: "Engage an LHA-certified assessor", action: "Book a Livable Housing Australia certified assessor to review your design before submission. Gold+ claims require their sign-off.", urgent: true },
                  { n: "03", title: "Audit your existing managed stock", action: "For upgrade/maintenance components, assess what proportion of your current stock meets Silver. This affects feasibility and grant sizing.", urgent: false },
                  { n: "04", title: "Review drawings for Silver minimums", action: "Step-free access, 820mm doorways, hobless shower, lever handles, grab rail reinforcing. Check every one. Do not assume compliance.", urgent: true },
                  { n: "05", title: "Budget for Gold if specialist stream", action: "Add $12–22k per dwelling above Silver budget. Not doing this creates a funding gap post-contract that cannot be recovered.", urgent: false },
                  { n: "06", title: "Understand the clawback clause", action: "Round 3 includes post-construction LHA inspection. Non-compliance triggers grant clawback. This is a contractual obligation, not a design suggestion.", urgent: true },
                ].map(({ n, title, action, urgent }) => (
                  <div key={n} style={{ display: "flex", gap: 12, padding: "11px 0", borderBottom: "1px solid #1a2535" }}>
                    <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 800, background: urgent ? "rgba(246,201,14,0.1)" : "rgba(77,127,181,0.1)", color: urgent ? "#f6c90e" : "#4d7fb5", border: `1px solid ${urgent ? "rgba(246,201,14,0.25)" : "rgba(77,127,181,0.2)"}` }}>{n}</div>
                    <div>
                      <div style={{ fontSize: "0.78rem", fontWeight: 700, color: urgent ? "#e8edf2" : "#94a3b8", marginBottom: 3 }}>{title}</div>
                      <div style={{ fontSize: "0.7rem", color: "#6b8aa0", lineHeight: 1.6 }}>{action}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action implications */}
            <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 8, padding: "16px 20px" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 }}>
                🐝 HIVE Analysis — What this means for Round 3 applications
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { title: "General social housing stream", req: "Silver minimum", action: "Ensure step-free access, wide doorways, hobless shower, lever handles. Have LHA-certified assessor review design before submission.", color: TIER_COLORS.Silver },
                  { title: "Women's safety / family violence", req: "Gold mandatory", action: "Full bathroom accessibility, ceiling hoist provision, kitchen adaptability. Budget additional $12-20k per dwelling vs Silver. Assessor sign-off required.", color: TIER_COLORS.Gold },
                  { title: "First Nations / remote housing", req: "Gold mandatory", action: "Cultural safety provisions additionally required. Remote cost premiums mean Gold retrofit can cost $30-60k/dwelling. New builds strongly preferred over retrofit.", color: TIER_COLORS.Gold },
                  { title: "NDIS-linked specialist housing", req: "Platinum + SDA registration", action: "Must be co-funded with NDIS SDA and meet AS 1428.1 standard. Requires SDA registration — not just design compliance. Budget $55-140k/dwelling.", color: TIER_COLORS.Platinum },
                ].map(({ title, req, action, color }) => (
                  <div key={title} style={{ background: `${color}06`, border: `1px solid ${color}22`, borderRadius: 8, padding: "14px 16px" }}>
                    <div style={{ fontWeight: 700, color: "#e8edf2", fontSize: "0.82rem", marginBottom: 4 }}>{title}</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: "0.62rem", color: "#4a5a6a" }}>Requirement:</span>
                      <TierBadge tier={req.split(" ")[0] as LHDTierName} small />
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#7a8fa8", lineHeight: 1.6 }}>{action}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ UPGRADE COSTS ══════════════════════════════════════════════════ */}
        {activeSection === "Upgrade Costs" && (
          <div>
            <p className="page-subtitle" style={{ marginBottom: 20 }}>
              Indicative retrofit costs to achieve each LHD tier by dwelling typology.
              Based on industry benchmarks from Rawlinsons, Housing Australia project data, and state HA upgrade programme reporting.
              Remote location add 40–80% to all figures. Costs exclude GST and site-specific works.
            </p>

            {/* Typology selector */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#7a8fa8", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>Select dwelling typology</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {UPGRADE_COSTS.map((uc, i) => (
                  <button key={i} onClick={() => setSelectedTypology(i)}
                    style={{
                      padding: "6px 14px", fontSize: "0.76rem", fontWeight: selectedTypology === i ? 700 : 500,
                      color: selectedTypology === i ? "#0b1220" : "#94a3b8",
                      background: selectedTypology === i ? "#f6c90e" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${selectedTypology === i ? "#f6c90e" : "#2a3d52"}`,
                      borderRadius: 6, cursor: "pointer", transition: "all 0.15s",
                    }}>
                    {uc.typology}
                  </button>
                ))}
              </div>
            </div>

            {/* Cost cards */}
            {(() => {
              const uc = UPGRADE_COSTS[selectedTypology]
              return (
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#4a5a6a", marginBottom: 16 }}>
                    Selected: <strong style={{ color: "#c8d8e8" }}>{uc.typology}</strong>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
                    {([
                      { tier: "Silver" as LHDTierName, cost: uc.to_silver_k },
                      { tier: "Gold" as LHDTierName, cost: uc.to_gold_k },
                      { tier: "Platinum" as LHDTierName, cost: uc.to_platinum_k },
                    ]).map(({ tier, cost }) => {
                      const color = TIER_COLORS[tier]
                      return (
                        <div key={tier} className="hive-card" style={{ borderTop: `3px solid ${color}`, padding: "18px 20px" }}>
                          <TierBadge tier={tier} />
                          <div style={{ marginTop: 12, marginBottom: 8 }}>
                            <div style={{ fontSize: "0.65rem", color: "#4a5a6a", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Retrofit cost range</div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 900, color, lineHeight: 1 }}>
                              ${cost.min}k – ${cost.max}k
                            </div>
                            <div style={{ fontSize: "0.68rem", color: "#4a5a6a", marginTop: 2 }}>per dwelling</div>
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "#7a8fa8", lineHeight: 1.65, borderTop: "1px solid #1e2d40", paddingTop: 10 }}>
                            {cost.notes}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Total cost calculator */}
                  <div className="hive-card" style={{ marginBottom: 16, padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                      <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#7a8fa8", textTransform: "uppercase", letterSpacing: "1px" }}>
                        Programme cost calculator
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Number of dwellings:</span>
                        <input
                          type="number" min={1} max={10000}
                          value={numDwellings}
                          onChange={e => setNumDwellings(Math.max(1, parseInt(e.target.value) || 1))}
                          className="hive-input"
                          style={{ width: 90, padding: "5px 10px", fontSize: "0.85rem", textAlign: "center" }}
                        />
                      </div>
                      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                        {([
                          { tier: "Silver" as LHDTierName, cost: uc.to_silver_k },
                          { tier: "Gold" as LHDTierName, cost: uc.to_gold_k },
                          { tier: "Platinum" as LHDTierName, cost: uc.to_platinum_k },
                        ]).map(({ tier, cost }) => {
                          const minTotal = (cost.min * numDwellings / 1000).toFixed(1)
                          const maxTotal = (cost.max * numDwellings / 1000).toFixed(1)
                          return (
                            <div key={tier} style={{ textAlign: "center" }}>
                              <TierBadge tier={tier} small />
                              <div style={{ fontSize: "0.88rem", fontWeight: 800, color: DISPLAY_COLORS[tier], marginTop: 4 }}>
                                ${minTotal}M – ${maxTotal}M
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="callout-blue" style={{ fontSize: "0.8rem" }}>
                    <strong style={{ color: "#7aaad4" }}>Key considerations for {uc.typology}:</strong>{" "}
                    {selectedTypology === 0 && "Ground floor units are the most cost-effective retrofit typology. Many already have near-step-free access, making Silver achievable with relatively minor works."}
                    {selectedTypology === 1 && "Single-storey detached houses are the most common social housing typology nationally. Path of travel creation is usually the biggest single cost item."}
                    {selectedTypology === 2 && "Elevated/Queenslander housing presents the most significant retrofit challenge. Platform lifts or ramps to elevated floors can cost $15-25k before internal works even begin."}
                    {selectedTypology === 3 && "Multi-storey units without lifts cannot achieve full Silver compliance at the building entry level. Building-wide lift programmes (typically $80-150k+ shared across occupants) are the only solution."}
                    {selectedTypology === 4 && "Remote community housing should be prioritised for replacement (new build) over retrofit given cost premiums. The combination of older stock, remote costs, and structural deficiencies makes retrofit poor value for money."}
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* ══ DEMAND DRIVERS ═════════════════════════════════════════════════ */}
        {activeSection === "Demand Drivers" && (
          <div>
            <p className="page-subtitle" style={{ marginBottom: 24 }}>
              Population trends driving the urgent need for accessible social housing.
              The demand gap will widen significantly before 2030 — making the compliance upgrade backlog a growing liability, not a stable one.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
              {DEMAND_DRIVERS.map(d => (
                <div key={d.driver} className="hive-card" style={{ padding: "18px 20px" }}>
                  <div style={{ fontWeight: 700, color: "#e8edf2", fontSize: "0.88rem", marginBottom: 10 }}>{d.driver}</div>
                  <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 12, padding: "10px 14px", background: "#0d1825", borderRadius: 8 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "0.6rem", color: "#4a5a6a", textTransform: "uppercase", marginBottom: 2 }}>Current</div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#7aaad4" }}>{d.current_estimate}</div>
                    </div>
                    <div style={{ flex: 1, height: 2, background: "linear-gradient(90deg, #7aaad4, #c49a3a)", borderRadius: 2 }} />
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "0.6rem", color: "#4a5a6a", textTransform: "uppercase", marginBottom: 2 }}>2030</div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#c49a3a" }}>{d.projected_2030}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "#7a8fa8", lineHeight: 1.7 }}>{d.relevance}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 8, padding: "16px 20px" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 }}>
                🐝 HIVE Analysis — The 2030 Demand Cliff
              </div>
              <p style={{ fontSize: "0.85rem", color: "#c8d8e8", lineHeight: 1.8, marginBottom: 10 }}>
                Australia is approaching a <strong style={{ color: "#fff" }}>perfect storm in accessible housing demand</strong>.
                By 2030, 5.8 million Australians will be aged 65+ — a 35% increase from today.
                Meanwhile, NDIS participant numbers are growing at 8% annually, with an acute shortage of Platinum/SDA-standard housing
                already causing participants to remain in hospital or unsuitable settings.
              </p>
              <p style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.75 }}>
                The current social housing system is not designed for this population.
                92% of stock fails Silver standard. Only 0.5% meets Platinum.
                Without an urgent, funded upgrade programme, Australia's social housing system will increasingly
                warehouse its most vulnerable residents in housing that actively prevents independence —
                driving up aged care and hospital costs in a vicious cycle.
                <strong style={{ color: "#5aad8a" }}>{" "}The business case for LHD upgrades is not a housing argument — it is a health and fiscal argument.</strong>
              </p>
            </div>
          </div>
        )}

        {/* Methodology */}
        <div style={{ marginTop: 32, borderTop: "1px solid #1e2d40", paddingTop: 14 }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#4a5a6a", letterSpacing: "1.8px", textTransform: "uppercase", marginBottom: 6 }}>Methodology & Sources</div>
          <div style={{ fontSize: "0.7rem", color: "#4a5a6a", lineHeight: 1.6 }}>
            Compliance percentages are AHURI/AIHW-derived estimates based on construction era, known upgrade programmes, and housing typology distributions.
            Actual compliance rates for individual properties require on-site assessment by a Livable Housing Australia certified assessor.
            Upgrade costs derived from Rawlinsons 2025, Housing Australia HAFF project data, and state HA upgrade programme reporting.
            <strong style={{ color: "#6b8aa0" }}> Do not use for individual development applications — engage an LHA-certified assessor.</strong>
          </div>
        </div>

      </div>
    </div>
  )
}
