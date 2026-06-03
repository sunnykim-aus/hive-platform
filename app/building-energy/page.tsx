"use client"
import { useState } from "react"
import {
  NATHERS_TIERS, STATE_ENERGY_DATA, UPGRADE_COSTS,
  HAFF_ENERGY_REQUIREMENTS, ENERGY_COST_BY_CLIMATE,
  getEnergyStats, STAR_COLORS,
} from "@/lib/data/building-energy"
import { usePortfolio } from "@/lib/usePortfolio"

const SECTIONS = ["Overview", "Stock Performance", "Tenant Cost Burden", "Upgrade Pathway", "HAFF Requirements"] as const
type Section = typeof SECTIONS[number]

const RISK_COLORS = { Critical: "#c0614a", High: "#c49a3a", Moderate: "#4d7fb5", Low: "#5aad8a" } as const

function StarBadge({ stars, small }: { stars: number; small?: boolean }) {
  const color = STAR_COLORS[Math.floor(stars)] ?? "#6b8aa0"
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      padding: small ? "1px 7px" : "3px 10px", borderRadius: 4,
      fontSize: small ? "0.6rem" : "0.72rem", fontWeight: 700,
      background: `${color}18`, color, border: `1px solid ${color}44`,
    }}>
      {"★".repeat(Math.min(Math.floor(stars), 8))} {stars}★
    </span>
  )
}

export default function BuildingEnergyPage() {
  const [activeSection, setActiveSection] = useState<Section>("Overview")
  const [selectedUpgrade, setSelectedUpgrade] = useState(0)
  const [numDwellings, setNumDwellings] = useState(50)
  const [climateZone, setClimateZone] = useState<"hot" | "temperate" | "cold">("hot")
  const stats = getEnergyStats()
  const { portfolio } = usePortfolio()

  const orgNathers = portfolio?.avg_nathers_rating ?? null
  const orgSolar   = portfolio?.pct_solar ?? null
  const org7star   = portfolio?.pct_7star_compliant ?? null
  const sectorAvg  = 2.9
  const orgGap     = orgNathers !== null ? Math.max(0, 7 - orgNathers) : null
  const sectorGap  = Math.max(0, 7 - sectorAvg)
  const annualExtraCost = orgNathers !== null ? Math.round(Math.max(0, (7 - orgNathers) / (7 - 1) * 2200)) : null

  return (
    <div style={{ background: "#0b1220", minHeight: "100vh" }}>
      <div className="page-container">

        {/* Header */}
        {/* ── Breadcrumb ── */}
        <div style={{ marginBottom: 8, marginTop: 4 }}>
          <a href="/sustainability" style={{ fontSize: "0.72rem", color: "#1abc9c", textDecoration: "none", fontWeight: 600 }}>← Sustainability</a>
        </div>

        <div className="page-header" style={{ borderLeft: "3px solid #5aad8a" }}>
          <h1 className="page-title">Building Energy Performance</h1>
          <p className="page-subtitle">
            ~{Math.round(stats.below3star / 1000)}k social housing dwellings are rated 1–2 star NatHERS — {Math.round(stats.below3star / stats.totalStock * 100)}% of the entire stock.
            Those tenants pay $2,200+ more per year in energy costs than a 7-star home, and face indoor temperatures of 43°C+ on extreme heat days without air conditioning.
            On a 42°C day, a 2-star home is not uncomfortable — it is dangerous.
          </p>
          <div style={{ fontSize: "0.72rem", color: "#4a5a6a", marginTop: 8 }}>
            Sources: CSIRO NatHERS study 2023 · AIHW Housing Assistance 2023 · ClimateWorks Australia 2023 · AHURI Residential Energy Efficiency 2022 · NCC 2022
          </div>
        </div>

        {/* Portfolio NatHERS personalisation banner */}
        {orgNathers !== null && portfolio?.org_name && (
          <div style={{
            background: "rgba(26,188,156,0.06)", border: "1px solid rgba(26,188,156,0.25)",
            borderRadius: 10, padding: "16px 20px", marginBottom: 20,
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 16, alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: "0.6rem", color: "#1abc9c", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>
                {portfolio.org_name} — Your Avg NatHERS
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: "1.8rem", fontWeight: 900, color: orgNathers >= 5 ? "#5aad8a" : orgNathers >= 3 ? "#c49a3a" : "#c0614a", lineHeight: 1 }}>
                  {orgNathers.toFixed(1)}★
                </span>
                <span style={{ fontSize: "0.72rem", color: "#4a5a6a" }}>vs sector avg 2.9★</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.6rem", color: "#6b8aa0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>Gap to 7-Star NCC</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 900, color: orgGap! > 3 ? "#c0614a" : orgGap! > 1 ? "#c49a3a" : "#5aad8a", lineHeight: 1 }}>
                {orgGap!.toFixed(1)} stars
              </div>
              <div style={{ fontSize: "0.65rem", color: "#4a5a6a" }}>Sector gap: {sectorGap.toFixed(1)} stars</div>
            </div>
            <div>
              <div style={{ fontSize: "0.6rem", color: "#6b8aa0", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>Est. Extra Energy Cost / Tenant</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#c49a3a", lineHeight: 1 }}>
                ${annualExtraCost!.toLocaleString()}/yr
              </div>
              <div style={{ fontSize: "0.65rem", color: "#4a5a6a" }}>vs 7-star benchmark</div>
            </div>
            <div style={{ textAlign: "right" }}>
              {orgSolar !== null && <div style={{ fontSize: "0.7rem", color: "#1abc9c", marginBottom: 4 }}>☀️ Solar: {orgSolar}%</div>}
              {org7star !== null && <div style={{ fontSize: "0.7rem", color: "#1abc9c" }}>7★: {org7star}% compliant</div>}
              <a href="/my-portfolio" style={{ fontSize: "0.65rem", color: "#4a5a6a", textDecoration: "none" }}>Edit →</a>
            </div>
          </div>
        )}

        {/* Portfolio NatHERS prompt — shown when not yet set */}
        {orgNathers === null && (
          <div style={{
            background: "rgba(26,188,156,0.04)", border: "1px dashed rgba(26,188,156,0.25)",
            borderRadius: 8, padding: "10px 16px", marginBottom: 16,
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          }}>
            <span style={{ fontSize: "0.78rem", color: "#6b8aa0" }}>
              💡 Set your portfolio&apos;s average NatHERS rating in My Portfolio to see how your stock compares to the sector average.
            </span>
            <a href="/my-portfolio" style={{ fontSize: "0.74rem", fontWeight: 700, color: "#1abc9c", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
              Set up →
            </a>
          </div>
        )}

        {/* National KPIs */}
        <div className="grid-4" style={{ marginBottom: 24 }}>
          {[
            { label: "Avg Star Rating (Social Stock)", value: `~2.9★`, color: "#c49a3a", delta: "vs 7★ NCC 2022 minimum — a 4-star gap" },
            { label: "Below 3-Star", value: `~${Math.round(stats.below3star/1000)}k`, color: "#c0614a", delta: `${Math.round(stats.below3star/stats.totalStock*100)}% of stock — urgent heat/cold risk` },
            { label: "Avg Tenant Energy Bill", value: `$${stats.avgBill.toLocaleString()}`, color: "#c49a3a", delta: `vs $1,400 for 7-star — $${(stats.avgBill - 1400).toLocaleString()} annual energy poverty gap` },
            { label: "In Energy Poverty", value: `~${stats.avgEnergyPoverty}%`, color: "#c0614a", delta: "Spending >10% of income on energy" },
          ].map(({ label, value, color, delta }) => (
            <div key={label} className="kpi-card" style={{ borderTop: `3px solid ${color}` }}>
              <div className="kpi-label">{label}</div>
              <div className="kpi-value" style={{ color, fontSize: "1.5rem" }}>{value}</div>
              <div className="kpi-delta">{delta}</div>
            </div>
          ))}
        </div>

        {/* Why it matters */}
        <div className="callout-red" style={{ marginBottom: 24 }}>
          <strong style={{ color: "#c0614a" }}>The double crisis.</strong>{" "}
          Poor energy ratings hurt tenants in two compounding ways: (1) high energy bills that push households into energy poverty —
          forcing impossible choices between heating/cooling and food — and (2) inadequate thermal protection that creates direct
          heat and cold health risk independent of whether cooling is running.
          A 2-star home on a 42°C day reaches indoor temperatures of 43°C+ without air conditioning.
          For elderly, disability and infant tenants, this is a <strong style={{ color: "#fff" }}>life-safety emergency</strong>,
          not a comfort issue.
        </div>

        {/* Section nav */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {SECTIONS.map(s => (
            <button key={s} className={`tab-pill ${activeSection === s ? "active" : ""}`}
              onClick={() => setActiveSection(s)} style={{ padding: "8px 20px", fontSize: "0.82rem" }}>
              {s}
            </button>
          ))}
        </div>

        {/* ══ OVERVIEW ══════════════════════════════════════════════════════ */}
        {activeSection === "Overview" && (
          <div>
            <div className="section-label">The NatHERS Rating Scale — What Each Star Means</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 28 }}>
              {NATHERS_TIERS.map(tier => {
                const color = STAR_COLORS[tier.stars]
                const barWidth = Math.max(3, Math.min(100, tier.pct_social_stock * 3.5))
                return (
                  <div key={tier.stars} className="hive-card" style={{
                    borderLeft: `3px solid ${color}`, padding: "12px 18px",
                    background: tier.stars <= 2 ? "#141a26" : tier.stars >= 7 ? "#101e14" : "#111827",
                  }}>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      {/* Star rating */}
                      <div style={{ flexShrink: 0, width: 56, textAlign: "center" }}>
                        <div style={{ fontSize: "1.3rem", fontWeight: 900, color, lineHeight: 1 }}>{tier.stars === 8 ? "8–10" : tier.stars}★</div>
                      </div>
                      {/* Label + description */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 700, color: "#e8edf2", fontSize: "0.85rem" }}>{tier.label}</span>
                          <span style={{ fontSize: "0.62rem", color: "#4a5a6a" }}>{tier.typical_era}</span>
                          <span style={{
                            fontSize: "0.6rem", fontWeight: 700, padding: "1px 6px", borderRadius: 3,
                            background: `${RISK_COLORS[tier.health_risk]}18`, color: RISK_COLORS[tier.health_risk],
                            border: `1px solid ${RISK_COLORS[tier.health_risk]}33`,
                          }}>{tier.health_risk} heat risk</span>
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#6b8aa0", lineHeight: 1.55 }}>{tier.description}</div>
                      </div>
                      {/* Social stock share */}
                      <div style={{ flexShrink: 0, width: 140 }}>
                        <div style={{ fontSize: "0.62rem", color: "#4a5a6a", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>Social stock est.</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ flex: 1, background: "#1e2d40", borderRadius: 3, height: 6, overflow: "hidden" }}>
                            <div style={{ width: `${barWidth}%`, height: "100%", background: color, borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color }}>{tier.pct_social_stock}%</span>
                        </div>
                      </div>
                      {/* Annual cost */}
                      <div style={{ flexShrink: 0, width: 110, textAlign: "right" }}>
                        <div style={{ fontSize: "0.62rem", color: "#4a5a6a", textTransform: "uppercase", letterSpacing: "0.5px" }}>Avg bill/yr</div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 800, color }}>${tier.annual_energy_cost_av.toLocaleString()}</div>
                        {tier.annual_cost_vs_7star > 0 && (
                          <div style={{ fontSize: "0.62rem", color: "#c0614a" }}>+${tier.annual_cost_vs_7star.toLocaleString()} vs 7★</div>
                        )}
                        {tier.annual_cost_vs_7star < 0 && (
                          <div style={{ fontSize: "0.62rem", color: "#5aad8a" }}>${Math.abs(tier.annual_cost_vs_7star).toLocaleString()} saving vs 7★</div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* HIVE Analysis */}
            <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 8, padding: "16px 20px" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 }}>
                🐝 HIVE Analysis — The Energy Gap and Who Bears It
              </div>
              <p style={{ fontSize: "0.85rem", color: "#c8d8e8", lineHeight: 1.8, marginBottom: 10 }}>
                Australia's social housing stock has an average NatHERS rating of approximately{" "}
                <strong style={{ color: "#c49a3a" }}>2.9 stars</strong> — more than{" "}
                <strong style={{ color: "#fff" }}>4 stars below the current 7-star minimum</strong> for new construction.
                This isn't an inconvenience: the ~{Math.round(stats.below3star/1000)}k dwellings rated 1-2 stars reach indoor temperatures of 43-46°C
                on extreme heat days without cooling — conditions that are physiologically dangerous for elderly, disability and infant residents.
              </p>
              <p style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.75, marginBottom: 10 }}>
                <strong style={{ color: "#c0614a" }}>Who bears the cost?</strong>{" "}
                The energy gap is entirely borne by tenants — the least able to pay.
                A social housing tenant in a 2-star home pays ~$3,200/year in energy costs.
                A tenant in a new 7-star HAFF-funded home pays ~$1,400.
                That $1,800 annual gap represents 5-8% of a typical social housing tenant's income —
                pushing {stats.avgEnergyPoverty}% of social housing tenants into energy poverty.
              </p>
              <p style={{ fontSize: "0.8rem", color: "#6b8aa0", lineHeight: 1.7 }}>
                <strong style={{ color: "#5aad8a" }}>The investment case:</strong>{" "}
                Upgrading the ~{Math.round(stats.below3star/1000)}k dwellings below 3-star to 5-star costs an estimated{" "}
                <strong style={{ color: "#fff" }}>$4.8B nationally</strong> — and saves tenants approximately{" "}
                <strong style={{ color: "#5aad8a" }}>$1.1B per year</strong> in reduced energy bills.
                At today's energy prices, the sector-wide payback is under 5 years.
                This is the definition of an investment, not a cost.
              </p>
            </div>
          </div>
        )}

        {/* ══ STOCK PERFORMANCE ══════════════════════════════════════════════ */}
        {activeSection === "Stock Performance" && (
          <div>
            <p className="page-subtitle" style={{ marginBottom: 24 }}>
              Estimated NatHERS performance distribution for existing social housing stock by state.
              Based on CSIRO 2023 rating study, AIHW stock age data, and state HA upgrade programme reporting.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[...STATE_ENERGY_DATA].sort((a,b) => a.avg_nathers_stars - b.avg_nathers_stars).map(state => {
                const avgColor = STAR_COLORS[Math.round(state.avg_nathers_stars)]
                return (
                  <div key={state.state} className="hive-card" style={{ padding: "16px 22px" }}>
                    <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
                      {/* State info */}
                      <div style={{ minWidth: 180 }}>
                        <div style={{ fontWeight: 800, color: "#e8edf2", fontSize: "0.9rem" }}>{state.label}</div>
                        <div style={{ fontSize: "0.68rem", color: "#4a5a6a", marginTop: 2 }}>
                          {(state.social_dwellings/1000).toFixed(0)}k dwellings · {state.dominant_stock_era}
                        </div>
                        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: "1.6rem", fontWeight: 900, color: avgColor, lineHeight: 1 }}>{state.avg_nathers_stars}★</span>
                          <span style={{ fontSize: "0.68rem", color: "#4a5a6a" }}>avg rating</span>
                        </div>
                      </div>

                      {/* Performance bars */}
                      <div style={{ flex: 1, minWidth: 200 }}>
                        {[
                          { label: "Below 3★ (critical)", pct: state.pct_below_3star, color: "#c0614a" },
                          { label: "Below 6★ (pre-2010 std)", pct: state.pct_below_6star, color: "#c49a3a" },
                          { label: "Meeting 7★ (NCC 2022)", pct: state.pct_meeting_7star, color: "#5aad8a" },
                        ].map(({ label, pct, color }) => (
                          <div key={label} style={{ marginBottom: 8 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                              <span style={{ fontSize: "0.68rem", color: "#7a8fa8" }}>{label}</span>
                              <span style={{ fontSize: "0.72rem", fontWeight: 700, color }}>{pct}%</span>
                            </div>
                            <div className="progress-bar" style={{ height: 7 }}>
                              <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Cost + poverty */}
                      <div style={{ minWidth: 180 }}>
                        <div style={{ fontSize: "0.62rem", color: "#4a5a6a", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Avg annual energy bill</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#c49a3a", marginBottom: 8 }}>${state.avg_annual_energy_bill.toLocaleString()}</div>
                        <div style={{ fontSize: "0.62rem", color: "#4a5a6a", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>In energy poverty</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: state.energy_poverty_pct >= 45 ? "#c0614a" : "#c49a3a" }}>{state.energy_poverty_pct}%</div>
                        <div style={{ fontSize: "0.65rem", color: "#4a5a6a", marginTop: 8 }}>
                          HAFF pipeline at 7★: <span style={{ color: state.haff_pipeline_7star_pct >= 85 ? "#5aad8a" : "#c49a3a", fontWeight: 600 }}>{state.haff_pipeline_7star_pct}%</span>
                        </div>
                      </div>

                      {/* Notes */}
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ fontSize: "0.62rem", color: "#4a5a6a", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Key challenge</div>
                        <div style={{ fontSize: "0.7rem", color: "#6b8aa0", lineHeight: 1.6 }}>{state.notes}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ══ TENANT COST BURDEN ══════════════════════════════════════════════ */}
        {activeSection === "Tenant Cost Burden" && (
          <div>
            <p className="page-subtitle" style={{ marginBottom: 20 }}>
              Annual energy cost by NatHERS star rating and climate zone.
              The difference between living in a 2-star vs 7-star home is not theoretical — it's $1,400–$2,700 per year
              that social housing tenants cannot afford.
            </p>

            {/* Climate zone selector */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#7a8fa8", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>Climate zone</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { key: "hot" as const, label: "Hot / Tropical", desc: "Darwin, Cairns, Alice Springs, Port Hedland" },
                  { key: "temperate" as const, label: "Temperate", desc: "Sydney, Brisbane, Perth, Adelaide" },
                  { key: "cold" as const, label: "Cold / Inland", desc: "Canberra, Hobart, Ballarat, Albury" },
                ].map(({ key, label, desc }) => (
                  <button key={key} onClick={() => setClimateZone(key)} style={{
                    padding: "8px 16px", fontSize: "0.78rem", fontWeight: climateZone === key ? 700 : 500,
                    color: climateZone === key ? "#0b1220" : "#94a3b8",
                    background: climateZone === key ? "#f6c90e" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${climateZone === key ? "#f6c90e" : "#2a3d52"}`,
                    borderRadius: 6, cursor: "pointer", transition: "all 0.15s", textAlign: "left",
                  }}>
                    <div>{label}</div>
                    <div style={{ fontSize: "0.62rem", opacity: 0.7, marginTop: 2 }}>{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cost table */}
            <div style={{ overflowX: "auto", marginBottom: 24 }}>
              <table className="hive-table">
                <thead>
                  <tr>
                    <th>Star Rating</th>
                    <th>Annual Energy Cost</th>
                    <th>Extra vs 7★ / Year</th>
                    <th>Extra over 10 Years</th>
                    <th>% of Income (typical social housing tenant)</th>
                    <th>Indoor temp on 40°C day (no A/C)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(ENERGY_COST_BY_CLIMATE).map(([star, costs]) => {
                    const cost = costs[climateZone]
                    const extra = cost - ENERGY_COST_BY_CLIMATE["7-star"][climateZone]
                    const starNum = parseInt(star[0])
                    const color = STAR_COLORS[starNum] ?? "#6b8aa0"
                    const tier = NATHERS_TIERS.find(t => t.stars === starNum) ?? NATHERS_TIERS[NATHERS_TIERS.length - 1]
                    const pctIncome = (cost / 24000 * 100).toFixed(1)  // ~$24k typical social housing income
                    return (
                      <tr key={star} style={{ background: starNum <= 2 ? "rgba(192,97,74,0.04)" : starNum >= 7 ? "rgba(90,173,138,0.03)" : undefined }}>
                        <td><span style={{ fontWeight: 800, color }}>{star}</span></td>
                        <td style={{ color, fontWeight: 700 }}>${cost.toLocaleString()}</td>
                        <td style={{ color: extra > 0 ? "#c0614a" : "#5aad8a", fontWeight: 600 }}>
                          {extra > 0 ? `+$${extra.toLocaleString()}` : extra === 0 ? "Baseline" : `-$${Math.abs(extra).toLocaleString()}`}
                        </td>
                        <td style={{ color: extra > 0 ? "#c49a3a" : "#5aad8a" }}>
                          {extra > 0 ? `+$${(extra * 10).toLocaleString()}` : extra === 0 ? "$0" : `-$${Math.abs(extra * 10).toLocaleString()}`}
                        </td>
                        <td style={{ color: parseFloat(pctIncome) >= 10 ? "#c0614a" : parseFloat(pctIncome) >= 7 ? "#c49a3a" : "#5aad8a" }}>
                          {pctIncome}%{parseFloat(pctIncome) >= 10 ? " ⚠ Energy poverty" : ""}
                        </td>
                        <td style={{ color: tier.health_risk === "Critical" ? "#c0614a" : tier.health_risk === "High" ? "#c49a3a" : "#5aad8a" }}>
                          {tier.summer_peak_temp_deg}°C
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: "0.7rem", color: "#4a5a6a", marginBottom: 24 }}>
              Income assumption: ~$24,000/year (typical social housing tenant on income support). Energy poverty threshold: spending more than 10% of income on energy costs.
            </div>

            {/* HIVE Analysis */}
            <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 8, padding: "16px 20px" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 }}>
                🐝 HIVE Analysis — Energy Poverty as a Housing Policy Failure
              </div>
              <p style={{ fontSize: "0.85rem", color: "#c8d8e8", lineHeight: 1.8, marginBottom: 10 }}>
                In a {climateZone} climate zone, a social housing tenant in a 2-star home pays{" "}
                <strong style={{ color: "#c49a3a" }}>${ENERGY_COST_BY_CLIMATE["2-star"][climateZone].toLocaleString()} per year</strong>{" "}
                in energy costs — {(ENERGY_COST_BY_CLIMATE["2-star"][climateZone] / 24000 * 100).toFixed(1)}% of a typical social housing tenant's income.
                Over 10 years, a tenant in a 2-star home pays{" "}
                <strong style={{ color: "#c0614a" }}>${((ENERGY_COST_BY_CLIMATE["2-star"][climateZone] - ENERGY_COST_BY_CLIMATE["7-star"][climateZone]) * 10).toLocaleString()} more</strong>{" "}
                in energy costs than a tenant in a 7-star HAFF-funded home next door.
              </p>
              <p style={{ fontSize: "0.8rem", color: "#6b8aa0", lineHeight: 1.7 }}>
                This is not a lifestyle gap — it is a direct transfer of poverty from the housing system onto the tenant.
                The government subsidy in social housing rent assistance is being partly recycled straight back to energy retailers
                through preventably inefficient housing stock. <strong style={{ color: "#5aad8a" }}>Every dollar spent on energy retrofitting
                is a dollar that stays in the tenant's household budget.</strong>
              </p>
            </div>
          </div>
        )}

        {/* ══ UPGRADE PATHWAY ════════════════════════════════════════════════ */}
        {activeSection === "Upgrade Pathway" && (
          <div>
            <p className="page-subtitle" style={{ marginBottom: 20 }}>
              Indicative retrofit costs to improve NatHERS star ratings.
              Based on CSIRO, Rawlinsons and state HA upgrade programme data.
              Costs exclude GST and site-specific works. Remote location adds 40–80%.
            </p>

            {/* Upgrade selector */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#7a8fa8", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>Select upgrade scenario</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {UPGRADE_COSTS.map((uc, i) => (
                  <button key={i} onClick={() => setSelectedUpgrade(i)} style={{
                    padding: "6px 14px", fontSize: "0.76rem", fontWeight: selectedUpgrade === i ? 700 : 500,
                    color: selectedUpgrade === i ? "#0b1220" : "#94a3b8",
                    background: selectedUpgrade === i ? "#f6c90e" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${selectedUpgrade === i ? "#f6c90e" : "#2a3d52"}`,
                    borderRadius: 6, cursor: "pointer", transition: "all 0.15s",
                  }}>
                    {uc.from_stars}★ → {uc.to_stars}★
                  </button>
                ))}
              </div>
            </div>

            {(() => {
              const uc = UPGRADE_COSTS[selectedUpgrade]
              const fc = STAR_COLORS[uc.from_stars]; const tc = STAR_COLORS[uc.to_stars]
              return (
                <div>
                  {/* Cost + outcome cards */}
                  <div className="grid-4" style={{ marginBottom: 20 }}>
                    {[
                      { label: "Cost per dwelling", value: `$${uc.cost_per_dwelling_k.min}k–$${uc.cost_per_dwelling_k.max}k`, color: "#c49a3a", delta: "Excluding GST and site specifics" },
                      { label: "Annual bill saving", value: `$${uc.annual_bill_saving.toLocaleString()}`, color: "#5aad8a", delta: "Per dwelling per year" },
                      { label: "Simple payback", value: `${uc.payback_years} yrs`, color: "#4d7fb5", delta: "At current energy prices" },
                      { label: "CO₂ reduction", value: `${(uc.co2_reduction_kg/1000).toFixed(1)}t`, color: "#5aad8a", delta: "Per dwelling per year" },
                    ].map(({ label, value, color, delta }) => (
                      <div key={label} className="kpi-card" style={{ borderTop: `3px solid ${color}` }}>
                        <div className="kpi-label">{label}</div>
                        <div style={{ fontSize: "1.3rem", fontWeight: 800, color, marginTop: 4, marginBottom: 4 }}>{value}</div>
                        <div className="kpi-delta">{delta}</div>
                      </div>
                    ))}
                  </div>

                  {/* Typical measures */}
                  <div className="hive-card" style={{ padding: "16px 20px", marginBottom: 16 }}>
                    <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: "1.1rem", fontWeight: 900, color: fc }}>{uc.from_stars}★</span>
                      <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${fc}, ${tc})`, borderRadius: 2 }} />
                      <span style={{ fontSize: "1.1rem", fontWeight: 900, color: tc }}>{uc.to_stars}★</span>
                    </div>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#7a8fa8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>Typical measures required</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px" }}>
                      {uc.typical_measures.map((m, i) => (
                        <div key={i} style={{ fontSize: "0.75rem", color: "#94a3b8", display: "flex", gap: 6, lineHeight: 1.5 }}>
                          <span style={{ color: "#f6c90e", flexShrink: 0 }}>·</span>{m}
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 12, fontSize: "0.72rem", color: "#4a5a6a", background: "rgba(255,255,255,0.02)", border: "1px solid #1e2d40", borderRadius: 6, padding: "8px 12px" }}>
                      {uc.notes}
                    </div>
                  </div>

                  {/* Programme cost calculator */}
                  <div className="hive-card" style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                      <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#7a8fa8", textTransform: "uppercase", letterSpacing: "1px" }}>
                        Programme cost calculator
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Dwellings:</span>
                        <input type="number" min={1} max={100000} value={numDwellings}
                          onChange={e => setNumDwellings(Math.max(1, parseInt(e.target.value) || 1))}
                          className="hive-input" style={{ width: 90, padding: "5px 10px", fontSize: "0.85rem", textAlign: "center" }} />
                      </div>
                      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontSize: "0.62rem", color: "#4a5a6a", textTransform: "uppercase" }}>Total cost</div>
                          <div style={{ fontSize: "1rem", fontWeight: 800, color: "#c49a3a" }}>
                            ${(uc.cost_per_dwelling_k.min * numDwellings / 1000).toFixed(1)}M – ${(uc.cost_per_dwelling_k.max * numDwellings / 1000).toFixed(1)}M
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: "0.62rem", color: "#4a5a6a", textTransform: "uppercase" }}>Annual savings (all)</div>
                          <div style={{ fontSize: "1rem", fontWeight: 800, color: "#5aad8a" }}>
                            ${(uc.annual_bill_saving * numDwellings / 1000).toFixed(0)}k/yr
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: "0.62rem", color: "#4a5a6a", textTransform: "uppercase" }}>CO₂ avoided</div>
                          <div style={{ fontSize: "1rem", fontWeight: 800, color: "#5aad8a" }}>
                            {(uc.co2_reduction_kg * numDwellings / 1000).toFixed(0)}t/yr
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* ══ HAFF REQUIREMENTS ══════════════════════════════════════════════ */}
        {activeSection === "HAFF Requirements" && (
          <div>
            <p className="page-subtitle" style={{ marginBottom: 24 }}>
              Energy performance requirements across HAFF Rounds 1–3.
              The shift from 6-star (Round 1) to 7-star + no-gas (Round 3) represents a major improvement
              in the long-term energy performance of HAFF-funded social housing.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
              {HAFF_ENERGY_REQUIREMENTS.map(req => {
                const color = req.min_nathers >= 7 ? "#5aad8a" : "#c49a3a"
                return (
                  <div key={req.round} className="hive-card" style={{ borderLeft: `3px solid ${color}`, padding: "18px 22px" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 800, color: "#e8edf2", fontSize: "0.9rem" }}>{req.round}</span>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <span style={{ fontSize: "0.62rem", color: "#4a5a6a" }}>Minimum:</span>
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, color }}>{req.min_nathers}★ NatHERS</span>
                      </div>
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#7a8fa8", lineHeight: 1.7, marginBottom: 10 }}>{req.detail}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                      {[
                        { label: "Solar PV", value: req.solar_requirement },
                        { label: "Heat Pump Hot Water", value: req.heat_pump_requirement },
                        { label: "Compliance check", value: req.notes },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1e2d40", borderRadius: 6, padding: "8px 12px" }}>
                          <div style={{ fontSize: "0.6rem", color: "#4a5a6a", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>{label}</div>
                          <div style={{ fontSize: "0.7rem", color: "#7a8fa8", lineHeight: 1.55 }}>{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* HIVE Analysis */}
            <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 8, padding: "16px 20px" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 }}>
                🐝 HIVE Analysis — The No-Gas Shift
              </div>
              <p style={{ fontSize: "0.85rem", color: "#c8d8e8", lineHeight: 1.8, marginBottom: 10 }}>
                Round 3's mandatory no-gas rule for new builds is the most significant energy policy shift in Australian social housing history.
                It locks HAFF-funded housing into an all-electric trajectory — meaning every Round 3 home is compatible
                with renewable energy as the grid decarbonises over the next 25 years.
              </p>
              <p style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.75 }}>
                Combined with mandatory solar PV for multi-unit developments, this creates genuine long-term energy cost protection for tenants.
                A 7-star + solar home built in 2026 will cost its tenant significantly less to run in 2050 than a 3-star gas-connected home built in 1985 —
                even accounting for energy price uncertainty.
                <strong style={{ color: "#5aad8a" }}> CHPs should treat the no-gas rule not as a constraint but as a competitive advantage</strong>{" "}
                — it locks in lower operating costs and higher asset value for the life of the building.
              </p>
            </div>
          </div>
        )}

        {/* Methodology */}
        <div style={{ marginTop: 32, borderTop: "1px solid #1e2d40", paddingTop: 14 }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#4a5a6a", letterSpacing: "1.8px", textTransform: "uppercase", marginBottom: 6 }}>Methodology & Sources</div>
          <div style={{ fontSize: "0.7rem", color: "#4a5a6a", lineHeight: 1.6 }}>
            NatHERS rating distributions estimated from CSIRO 2023 study cross-referenced with AIHW stock construction era data and state HA upgrade programme records.
            Energy cost figures derived from AGL/Origin/EnergyAustralia residential benchmarks 2024, adjusted by climate zone.
            Retrofit costs based on Rawlinsons 2025 and state HA upgrade programme reporting.
            Energy poverty threshold: household spending &gt;10% of income on energy (ABS standard).
            <strong style={{ color: "#6b8aa0" }}> These are estimates — actual performance requires on-site NatHERS assessment by an accredited assessor.</strong>
          </div>
        </div>

      </div>
    </div>
  )
}
