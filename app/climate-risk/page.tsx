"use client"
import { useState, useMemo, useEffect } from "react"
import {
  CLIMATE_RISK_SUBURBS, CLIMATE_EVENTS, RISK_COLORS, HAZARD_ICONS,
  ALL_STATES, type RiskLevel, type HazardType,
} from "@/lib/data/climate-risk"
import { usePortfolio } from "@/lib/usePortfolio"

// ── Per-state HIVE Analysis ────────────────────────────────────────────────────
const STATE_ANALYSIS: Record<string, { summary: string; urgency: string; action: string }> = {
  NSW: {
    summary: "New South Wales faces the most diverse climate risk profile of any state — extreme heat in western Sydney (Mount Druitt, Campbelltown, Penrith), catastrophic flooding in the Northern Rivers (Lismore) and Hunter Valley (Maitland, Wagga Wagga), and significant bushfire interface across Greater Sydney's outer ring and the Illawarra escarpment.",
    urgency: "Insurance withdrawal from the Northern Rivers is already underway. The 2022 flood events exposed the depth of social housing vulnerability — much of the worst-affected stock in Lismore sits in floodways that can never be made safe at affordable cost. Managed retreat is the only viable long-term solution for the highest-risk properties.",
    action: "Priority actions: (1) Managed retreat programme for Lismore and Maitland floodway properties. (2) Thermal retrofitting of western Sydney estates — targeting Mount Druitt, Campbelltown and Penrith where heat mortality risk is documented. (3) BAL compliance upgrades for Wollongong and Penrith bushfire interface stock.",
  },
  VIC: {
    summary: "Victoria's primary social housing climate risk is urban heat — Broadmeadows and Dandenong are among Australia's most heat-affected metropolitan areas with deeply disadvantaged tenant populations and thermally poor 1960s-80s housing stock. The Latrobe Valley (Moe) faces compound flood and bushfire risk compounded by the economic shock of coal industry closure.",
    urgency: "Broadmeadows has documented heat mortality events in social housing during heatwaves. The estate was built without air conditioning and with minimal insulation. As days above 40°C increase from 10 per year now to 20+ by 2050 under 2°C projections, the current stock is not survivable in extreme events without cooling infrastructure.",
    action: "Priority actions: (1) Thermal retrofitting and cooling installation programme for Broadmeadows and Dandenong estates — this is a life-safety issue, not comfort. (2) Flood and bushfire risk assessment and managed retreat planning for Latrobe Valley. (3) Urban greening strategy for Melbourne's outer suburban heat islands.",
  },
  QLD: {
    summary: "Queensland has the most extreme climate risk for social housing of any Australian state. Compound cyclone, flood and heat risks in North Queensland cities (Cairns, Townsville) represent the greatest physical threat to social housing stock in the nation. Inland flooding (Goodna, Bundaberg, Rockhampton, Toowoomba) regularly renders social housing uninhabitable, and insurance withdrawal is acute across the cyclone zone.",
    urgency: "The Northern Queensland cyclone insurance crisis is existential for many homeowners and will worsen for social housing. Goodna is Australia's most repeatedly flooded suburb — six major floods in 11 years 2011-2022. Cairns faces a direct Category 5 cyclone landfall scenario that would be catastrophic for its largely pre-cyclone-code social housing stock.",
    action: "Priority actions: (1) Cyclone-proofing programme for pre-code social housing in Cairns, Townsville and Mackay — wind loading upgrades to current Category 5 standard. (2) Managed retreat programme for Goodna, Bundaberg and Rockhampton floodway properties. (3) Insurance reinsurance pool expansion to Queensland social housing sector. (4) Remote heat crisis response for Mount Isa.",
  },
  WA: {
    summary: "Western Australia's climate risk is dominated by extreme heat — from Port Hedland's near-year-round extreme temperatures (115+ days above 35°C by 2050) to Perth's hottest outer suburbs. The Kimberley (Broome, Kununurra) faces compound cyclone and extreme heat. The social housing stock in remote and semi-remote WA is among the most thermally inadequate in Australia.",
    urgency: "Port Hedland faces compound cyclone Category 4-5 risk AND near-year-round extreme heat — the combination makes it the highest single-suburb climate risk location for social housing outside the NT. Kalgoorlie's remote heat crisis is documented — 75+ days above 35°C with predominantly Indigenous tenants in poorly insulated housing and limited cooling access.",
    action: "Priority actions: (1) Emergency cyclone-proofing for Port Hedland social housing — wind region D compliance is a life-safety requirement. (2) Thermal retrofitting and cooling programme for Kalgoorlie, Geraldton and Mirrabooka — prioritise Indigenous housing. (3) Insurance advocacy for Kimberley properties as NQCIRP does not extend to WA.",
  },
  SA: {
    summary: "South Australia's climate risk is driven by extreme urban heat — particularly in the Elizabeth/Playford area, which is arguably the most heat-stressed social housing estate in southern Australia. The combination of SEIFA 1 disadvantage, 8,500+ social dwellings with near-zero cooling access, and accelerating extreme heat days represents a documented mortality risk.",
    urgency: "In the 2019 Adelaide heatwave, multiple Elizabeth social housing residents died. The estate was built without air conditioning and the current SA Housing Authority upgrade programme is critically underfunded. By 2050 under 2°C projections, Elizabeth will experience 96 days above 35°C and 22 days above 40°C annually. This is a public health emergency in slow motion.",
    action: "Priority actions: (1) Emergency cooling installation programme for Elizabeth/Davoren Park — retrofit all social dwellings to at least 2-star energy efficiency and install reverse-cycle A/C. (2) Port Augusta and Whyalla remote heat programmes for Indigenous tenants. (3) Morphett Vale coastal planning — monitor for SLR impact as development continues.",
  },
  TAS: {
    summary: "Tasmania has the most moderate climate risk profile nationally, but is not risk-free. Flood risk along the Derwent River (Bridgewater, Glenorchy) and Tamar River (Launceston/Ravenswood) corridors affects significant concentrations of social housing. Tasmania's cooler climate currently provides a buffer against heat, but CSIRO projects major changes under 2°C warming.",
    urgency: "Bridgewater is Australia's most disadvantaged community outside of remote Indigenous settlements, and its social housing stock sits directly on the Derwent River floodplain. The 2018 flood affected 400+ properties. Tasmania has the oldest social housing stock in Australia — much of it dates from the 1950s-60s and has major structural and thermal performance issues independent of climate risk.",
    action: "Priority actions: (1) Flood risk assessment and managed retreat planning for Bridgewater Derwent River floodway properties. (2) Structural upgrades and thermal retrofitting for Glenorchy and Launceston social housing — the stock is at end of useful life in many cases. (3) Coastal monitoring for Devonport and Queenstown.",
  },
  NT: {
    summary: "The Northern Territory faces the most extreme combined climate risk of any Australian jurisdiction. Remote extreme heat (Alice Springs 98+ days above 35°C, Katherine, Darwin), catastrophic flooding (Katherine 2023, Alice Springs Todd River), and high cyclone probability (Darwin/Palmerston Category 5) create compound hazards across a social housing stock that is overwhelmingly old, thermally inadequate, and serves the nation's most disadvantaged communities.",
    urgency: "Katherine's 2023 flood inundated the entire town centre — the worst flood since 1998 — causing catastrophic damage to social housing and town camps. Darwin's cyclone risk is existential: a direct Category 5 hit (the Tracy scenario) would cause complete destruction of pre-code housing stock. Alice Springs town camps have heat-health conditions that are a national emergency — 98 days above 35°C with housing that cannot safely be cooled.",
    action: "Priority actions: (1) Emergency cyclone-proof rebuilding programme for pre-code Darwin and Palmerston housing — Category 5 compliance is life-safety. (2) Katherine managed retreat and flood-resilient rebuild programme. (3) Alice Springs town camp emergency thermal retrofitting — this is the most urgent heat-health social housing crisis in Australia. (4) Power supply reliability programme for Darwin — cooling that fails during cyclone power cuts is ineffective.",
  },
  ACT: {
    summary: "The ACT's primary climate risk is bushfire — the 2003 Canberra Firestorm destroyed 500 homes including ACT government housing and fundamentally changed planning for the region. The urban-bush interface in Tuggeranong and Gungahlin remains a significant risk, with the 2019-20 Black Summer bringing fire to within kilometres of both suburbs. Heat is an increasing secondary concern.",
    urgency: "The 2003 Canberra Firestorm remains Australia's most devastating urban bushfire event proportional to a city's housing stock. The ACT government has since made BAL compliance mandatory for new construction, but older social housing in the bushfire interface has not been systematically upgraded. As fire weather intensifies, the probability of a repeat event increases.",
    action: "Priority actions: (1) BAL compliance audit and upgrade programme for pre-2003 social housing in Tuggeranong and Belconnen bushfire interface. (2) Thermal upgrade programme for older ACT social housing stock to improve heat performance as summers intensify. (3) Maintain and strengthen the ACT's bushfire response and managed retreat planning frameworks.",
  },
}

const STATE_LABELS: Record<string, string> = {
  NSW: "New South Wales", VIC: "Victoria", QLD: "Queensland",
  WA: "Western Australia", SA: "South Australia", TAS: "Tasmania",
  NT: "Northern Territory", ACT: "Aust. Capital Territory",
}

function RiskBadge({ level, small }: { level: RiskLevel; small?: boolean }) {
  const color = RISK_COLORS[level]
  return (
    <span style={{ display: "inline-block", padding: small ? "1px 7px" : "2px 10px", borderRadius: 4, fontSize: small ? "0.58rem" : "0.65rem", fontWeight: 700, background: `${color}18`, color, border: `1px solid ${color}33` }}>
      {level}
    </span>
  )
}

function HazardBar({ score, level }: { score: number; level: RiskLevel }) {
  const color = RISK_COLORS[level]
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "0.85rem", fontWeight: 800, color, lineHeight: 1 }}>{score}</div>
      <div className="progress-bar" style={{ height: 3, marginTop: 3 }}>
        <div className="progress-fill" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  )
}

export default function ClimateRiskPage() {
  const [selectedState, setSelectedState] = useState("NSW")
  const { portfolio } = usePortfolio()

  // Pre-select portfolio state on mount
  useEffect(() => {
    if (portfolio?.primary_state && portfolio.primary_state !== "All" && ALL_STATES.includes(portfolio.primary_state)) {
      setSelectedState(portfolio.primary_state)
    }
  }, [portfolio?.primary_state])
  const [expandedId, setExpandedId]       = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<"scorecard" | "events">("scorecard")
  const [suburbSearch, setSuburbSearch]   = useState("")

  const stateSuburbs = useMemo(() =>
    CLIMATE_RISK_SUBURBS
      .filter(s => s.state === selectedState)
      .sort((a, b) => b.overall_score - a.overall_score),
    [selectedState]
  )

  // National summary stats
  const totalSuburbs    = CLIMATE_RISK_SUBURBS.length
  const criticalTotal   = CLIMATE_RISK_SUBURBS.filter(s => s.overall_level === "Critical").length
  const highTotal       = CLIMATE_RISK_SUBURBS.filter(s => s.overall_level === "High").length
  const insuranceTotal  = CLIMATE_RISK_SUBURBS.filter(s => s.insurance_status === "withdrawal_risk" || s.insurance_status === "effectively_uninsurable").length
  const dwellingsAtRisk = CLIMATE_RISK_SUBURBS.filter(s => s.overall_level === "Critical" || s.overall_level === "High").reduce((s, r) => s + r.est_social_dwellings, 0)

  // Per-state stats
  const stateCritical      = stateSuburbs.filter(s => s.overall_level === "Critical").length
  const stateHigh          = stateSuburbs.filter(s => s.overall_level === "High").length
  const stateInsurance     = stateSuburbs.filter(s => s.insurance_status === "withdrawal_risk" || s.insurance_status === "effectively_uninsurable").length
  const stateDwellingsRisk = stateSuburbs.filter(s => s.overall_level === "Critical" || s.overall_level === "High").reduce((s, r) => s + r.est_social_dwellings, 0)
  const worstSuburb        = stateSuburbs[0]
  const analysis           = STATE_ANALYSIS[selectedState]

  return (
    <div style={{ background: "#0b1220", minHeight: "100vh" }}>
      <div className="page-container">

        {/* ── Breadcrumb ── */}
        <div style={{ marginBottom: 8, marginTop: 4 }}>
          <a href="/sustainability" style={{ fontSize: "0.72rem", color: "#1abc9c", textDecoration: "none", fontWeight: 600 }}>← Sustainability</a>
        </div>

        {/* ── Header ── */}
        <div className="page-header" style={{ borderLeft: "3px solid #c0614a" }}>
          <h1 className="page-title">Climate Risk Intelligence</h1>
          <p className="page-subtitle">
            Suburb-level climate risk for Australian social housing across all 8 states and territories.
            Rated across flood, extreme heat, bushfire, coastal inundation, and cyclone hazards.
            {" "}{totalSuburbs} suburbs profiled · {criticalTotal} Critical · {highTotal} High · {insuranceTotal} facing insurance withdrawal.
          </p>
          <div style={{ fontSize: "0.72rem", color: "#4a5a6a", marginTop: 8 }}>
            Sources: BOM · CSIRO ClimateChange in Australia · State planning portals · ICA · Geoscience Australia · ABS SEIFA 2021
          </div>
        </div>

        {/* ── National KPIs ── */}
        <div className="grid-4" style={{ marginBottom: 20 }}>
          {[
            { label: "Suburbs Profiled", value: totalSuburbs, color: "#f6c90e", delta: "Across all 8 states/territories" },
            { label: "Critical Risk Suburbs", value: criticalTotal, color: "#c0614a", delta: "Highest climate-risk tier (HIVE ranking, corrected 2026)" },
            { label: "Social Dwellings at High+ Risk", value: `${(dwellingsAtRisk/1000).toFixed(0)}k`, color: "#c0614a", delta: "Estimated social dwellings in Critical/High zones" },
            { label: "Insurance Withdrawal Risk", value: insuranceTotal, color: "#c49a3a", delta: "Suburbs with limited/unaffordable coverage" },
          ].map(({ label, value, color, delta }) => (
            <div key={label} className="kpi-card" style={{ borderTop: `3px solid ${color}` }}>
              <div className="kpi-label">{label}</div>
              <div className="kpi-value" style={{ color }}>{value}</div>
              <div className="kpi-delta">{delta}</div>
            </div>
          ))}
        </div>

        {/* ── Why this matters ── */}
        <div className="callout-red" style={{ marginBottom: 24 }}>
          <strong style={{ color: "#c0614a" }}>Why this matters now.</strong>{" "}
          HAFF-funded social housing has a 25–30 year asset life — projects contracted in 2025 will still be in service in 2050–2055, when CSIRO projects dramatically increased hazard exposure.
          Every funding decision today locks in climate exposure for a generation. Insurance withdrawal is already happening in Lismore, Goodna, and North Queensland.
        </div>

        {/* ── Section toggle ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <button className={`tab-pill ${activeSection === "scorecard" ? "active" : ""}`}
            onClick={() => setActiveSection("scorecard")} style={{ padding: "8px 20px", fontSize: "0.82rem" }}>
            State Deep-Dive
          </button>
          <button className={`tab-pill ${activeSection === "events" ? "active" : ""}`}
            onClick={() => setActiveSection("events")} style={{ padding: "8px 20px", fontSize: "0.82rem" }}>
            Historical Events
          </button>
        </div>

        {/* ══ STATE DEEP-DIVE ═════════════════════════════════════════════════ */}
        {activeSection === "scorecard" && (
          <div>

            {/* State tabs — 4×2 grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 24 }}>
              {ALL_STATES.map(state => (
                <button key={state}
                  onClick={() => { setSelectedState(state); setExpandedId(null) }}
                  style={{
                    padding: "8px 12px", fontSize: "0.76rem", fontWeight: selectedState === state ? 700 : 500,
                    color: selectedState === state ? "#0b1220" : "#94a3b8",
                    background: selectedState === state ? "#f6c90e" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${selectedState === state ? "#f6c90e" : "#1e2d40"}`,
                    borderRadius: 6, cursor: "pointer", transition: "all 0.15s",
                    textAlign: "center",
                  }}>
                  {state} — {STATE_LABELS[state]}
                </button>
              ))}
            </div>

            {/* State KPIs */}
            <div className="grid-4" style={{ marginBottom: 20 }}>
              {[
                { label: "Suburbs Profiled", value: stateSuburbs.length, color: "#f6c90e", delta: `In ${STATE_LABELS[selectedState]}` },
                { label: "Critical + High Risk", value: `${stateCritical} Critical · ${stateHigh} High`, color: "#c0614a", delta: `${stateSuburbs.filter(s=>s.overall_level==="Moderate"||s.overall_level==="Low").length} Moderate/Low` },
                { label: "Social Dwellings at Risk", value: `${(stateDwellingsRisk/1000).toFixed(1)}k`, color: "#c0614a", delta: "Estimated in Critical/High risk suburbs" },
                { label: "Insurance Risk Suburbs", value: stateInsurance, color: "#c49a3a", delta: stateInsurance > 0 ? "Facing withdrawal or unaffordable premiums" : "No current insurance withdrawal" },
              ].map(({ label, value, color, delta }) => (
                <div key={label} className="kpi-card" style={{ borderTop: `3px solid ${color}` }}>
                  <div className="kpi-label">{label}</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color, marginTop: 4, marginBottom: 4 }}>{value}</div>
                  <div className="kpi-delta">{delta}</div>
                </div>
              ))}
            </div>

            {/* HIVE Analysis */}
            {analysis && (
              <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 8, padding: "16px 20px", marginBottom: 24 }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 }}>
                  🐝 HIVE Analysis — {STATE_LABELS[selectedState]}
                </div>
                <p style={{ fontSize: "0.85rem", color: "#c8d8e8", lineHeight: 1.8, marginBottom: 10 }}>{analysis.summary}</p>
                <p style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.75, marginBottom: 10 }}>
                  <strong style={{ color: "#c0614a" }}>Urgency: </strong>{analysis.urgency}
                </p>
                <p style={{ fontSize: "0.8rem", color: "#6b8aa0", lineHeight: 1.7, margin: 0 }}>
                  <strong style={{ color: "#5aad8a" }}>Priority actions: </strong>{analysis.action}
                </p>
              </div>
            )}

            {/* All suburb cards for this state */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#4a5a6a", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                All {STATE_LABELS[selectedState]} Suburbs — {stateSuburbs.filter(s => !suburbSearch || s.suburb_name.toLowerCase().includes(suburbSearch.toLowerCase()) || s.lga_name.toLowerCase().includes(suburbSearch.toLowerCase())).length} of {stateSuburbs.length} · sorted by risk score
              </div>
              <input
                type="text"
                placeholder="Search suburb or LGA..."
                value={suburbSearch}
                onChange={e => { setSuburbSearch(e.target.value); setExpandedId(null) }}
                style={{
                  background: "#111827", border: "1px solid #2a3d52", borderRadius: 6,
                  padding: "5px 12px", color: "#e2e8f0", fontSize: "0.78rem",
                  outline: "none", width: 220,
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {stateSuburbs.filter(s => !suburbSearch || s.suburb_name.toLowerCase().includes(suburbSearch.toLowerCase()) || s.lga_name.toLowerCase().includes(suburbSearch.toLowerCase())).map(suburb => {
                const isExpanded   = expandedId === suburb.id
                const primaryColor = RISK_COLORS[suburb.overall_level]

                return (
                  <div key={suburb.id} className="hive-card"
                    style={{ borderLeft: `3px solid ${primaryColor}`, padding: 0, overflow: "hidden" }}>

                    <div style={{ padding: "14px 18px", cursor: "pointer", display: "flex", gap: 14, alignItems: "center" }}
                      onClick={() => setExpandedId(isExpanded ? null : suburb.id)}>

                      <div style={{ flexShrink: 0, textAlign: "center", minWidth: 52 }}>
                        <div style={{ fontSize: "1.4rem", fontWeight: 900, color: primaryColor, lineHeight: 1 }}>{suburb.overall_score}</div>
                        <div style={{ fontSize: "0.55rem", color: "#4a5a6a" }}>/100</div>
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 700, color: "#e8edf2", fontSize: "0.9rem" }}>{suburb.suburb_name}</span>
                          <RiskBadge level={suburb.overall_level} small />
                          <span style={{ fontSize: "0.65rem", color: "#4a5a6a" }}>{HAZARD_ICONS[suburb.primary_hazard]} {suburb.primary_hazard}</span>
                          {(suburb.insurance_status === "withdrawal_risk" || suburb.insurance_status === "effectively_uninsurable") && (
                            <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#c0614a", background: "rgba(192,97,74,0.1)", border: "1px solid rgba(192,97,74,0.3)", padding: "1px 6px", borderRadius: 3 }}>⚠ Insurance risk</span>
                          )}
                        </div>
                        <div style={{ fontSize: "0.68rem", color: "#4a5a6a" }}>
                          {suburb.lga_name} · {suburb.est_social_dwellings.toLocaleString()} social dwellings · SEIFA {suburb.seifa_score}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
                        {([
                          { icon: "🌡", s: suburb.heat.score, l: suburb.heat.level },
                          { icon: "🌊", s: suburb.flood.score, l: suburb.flood.level },
                          { icon: "🔥", s: suburb.bushfire.score, l: suburb.bushfire.level },
                          { icon: "🏖", s: suburb.coastal?.score ?? 0, l: (suburb.coastal?.level ?? "Low") as RiskLevel },
                          { icon: "🌀", s: suburb.cyclone?.score ?? 0, l: (suburb.cyclone?.level ?? "Low") as RiskLevel },
                        ]).map((h, i) => (
                          <div key={i} style={{ textAlign: "center", minWidth: 36 }}>
                            <div style={{ fontSize: "0.62rem", marginBottom: 2 }}>{h.icon}</div>
                            {h.s > 0 ? <HazardBar score={h.s} level={h.l} /> : <div style={{ fontSize: "0.6rem", color: "#2a3d52" }}>n/a</div>}
                          </div>
                        ))}
                      </div>

                      <div style={{ fontSize: "0.65rem", color: "#4a5a6a", flexShrink: 0 }}>{isExpanded ? "▲" : "▼"}</div>
                    </div>

                    {isExpanded && (
                      <div style={{ borderTop: "1px solid #1e2d40", padding: "16px 18px", background: "#0d1825" }}>
                        <div className="grid-2" style={{ gap: 24 }}>
                          <div>
                            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#c0614a", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 10 }}>Hazard Detail</div>
                            {[
                              { icon: "🌡", name: "Extreme Heat", data: `${suburb.heat.days_over_35_current} days >35°C now → ${suburb.heat.days_over_35_2050} by 2050 · Canopy ${suburb.heat.tree_canopy_cover_pct}%`, note: suburb.heat.notes, level: suburb.heat.level },
                              { icon: "🌊", name: "Flood", data: suburb.flood.in_flood_overlay ? suburb.flood.overlay_type : "Not in flood overlay", note: suburb.flood.notes, level: suburb.flood.level },
                              { icon: "🔥", name: "Bushfire", data: suburb.bushfire.in_bushfire_prone_land ? `${suburb.bushfire.bal_zone} · ${suburb.bushfire.pct_area_bushfire_prone}% area` : "Not in bushfire prone land", note: suburb.bushfire.notes, level: suburb.bushfire.level },
                              ...(suburb.coastal ? [{ icon: "🏖", name: "Coastal / SLR", data: `SLR 2050: ${suburb.coastal.slr_impact_2050} · 2100: ${suburb.coastal.slr_impact_2100}`, note: suburb.coastal.notes, level: suburb.coastal.level }] : []),
                              ...(suburb.cyclone ? [{ icon: "🌀", name: "Cyclone", data: `Wind ${suburb.cyclone.wind_region} · Max Cat ${suburb.cyclone.max_category_risk} · ${suburb.cyclone.annual_probability_pct}%/yr`, note: suburb.cyclone.notes, level: suburb.cyclone.level }] : []),
                            ].map(h => (
                              <div key={h.name} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #1a2535" }}>
                                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }}>
                                  <span>{h.icon}</span>
                                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#c8d8e8" }}>{h.name}</span>
                                  <RiskBadge level={h.level} small />
                                </div>
                                <div style={{ fontSize: "0.7rem", color: "#6b8aa0", marginBottom: 2 }}>{h.data}</div>
                                <div style={{ fontSize: "0.67rem", color: "#4a5a6a", lineHeight: 1.55 }}>{h.note}</div>
                              </div>
                            ))}
                          </div>
                          <div>
                            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#4d7fb5", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 10 }}>Context & Action</div>
                            <div style={{ fontSize: "0.78rem", color: "#7a8fa8", lineHeight: 1.7, marginBottom: 12 }}>{suburb.notes}</div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px", marginBottom: 12 }}>
                              {[
                                ["Adaptation cost", `~$${suburb.adaptation_cost_per_dwelling_k}k/dwelling`],
                                ["Displacement risk", suburb.displacement_risk],
                                ["Insurance", suburb.insurance_status.replace(/_/g, " ")],
                                ["Key CHPs", suburb.key_chps.join(", ") || "None confirmed"],
                              ].map(([l, v]) => (
                                <div key={l}>
                                  <div style={{ fontSize: "0.62rem", color: "#4a5a6a", textTransform: "uppercase", letterSpacing: "0.5px" }}>{l}</div>
                                  <div style={{ fontSize: "0.78rem", color: "#c8d8e8", fontWeight: 600 }}>{v}</div>
                                </div>
                              ))}
                            </div>
                            {suburb.insurance_notes && (
                              <div style={{ fontSize: "0.7rem", color: "#4a5a6a", background: "rgba(192,97,74,0.05)", border: "1px solid rgba(192,97,74,0.15)", borderRadius: 6, padding: "8px 12px", lineHeight: 1.5 }}>
                                <strong style={{ color: "#c0614a" }}>Insurance: </strong>{suburb.insurance_notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ══ HISTORICAL EVENTS ══════════════════════════════════════════════ */}
        {activeSection === "events" && (
          <div>
            <p className="page-subtitle" style={{ marginBottom: 20 }}>
              Major climate events that have directly impacted Australian social housing. Each event is a data point in the accelerating pattern of climate-driven housing loss.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[...CLIMATE_EVENTS].sort((a, b) => b.year - a.year).map(ev => {
                const c = ev.event_type === "Flood" ? "#4d7fb5" : ev.event_type === "Bushfire" ? "#c49a3a" : ev.event_type === "Cyclone" ? "#7aaad4" : "#c0614a"
                return (
                  <div key={ev.id} className="hive-card" style={{ borderLeft: `3px solid ${c}`, padding: "16px 20px" }}>
                    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <div style={{ flexShrink: 0, textAlign: "center", minWidth: 48 }}>
                        <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#f6c90e" }}>{ev.year}</div>
                        <div style={{ fontSize: "0.7rem" }}>{HAZARD_ICONS[ev.event_type]}</div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 700, color: "#e8edf2", fontSize: "0.88rem" }}>{ev.name}</span>
                          <span style={{ fontSize: "0.6rem", fontWeight: 700, padding: "1px 6px", borderRadius: 3, background: `${c}18`, color: c, border: `1px solid ${c}33` }}>{ev.event_type}</span>
                          {ev.ica_catastrophe && <span style={{ fontSize: "0.6rem", color: "#4a5a6a" }}>ICA Cat.</span>}
                          <span className="badge badge-grey" style={{ fontSize: "0.6rem" }}>{ev.affected_states.join(" · ")}</span>
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#7a8fa8", lineHeight: 1.6, marginBottom: 8 }}>{ev.notes}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px 12px", fontSize: "0.7rem" }}>
                          {[["Social housing", ev.social_housing_affected.toLocaleString()], ["Destroyed", ev.dwellings_destroyed.toLocaleString()], ["Insured loss", `$${ev.estimated_cost_bn}B`], ["Fed. recovery", `$${ev.federal_recovery_m.toLocaleString()}M`]].map(([l, v]) => (
                            <div key={l}><div style={{ color: "#4a5a6a", marginBottom: 1 }}>{l}</div><div style={{ color: "#c8d8e8", fontWeight: 700 }}>{v}</div></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Methodology ── */}
        <div style={{ marginTop: 32, borderTop: "1px solid #1e2d40", paddingTop: 14 }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#4a5a6a", letterSpacing: "1.8px", textTransform: "uppercase", marginBottom: 6 }}>Methodology</div>
          <div style={{ fontSize: "0.7rem", color: "#4a5a6a", lineHeight: 1.6 }}>
            Hazard scores 0–100 from state planning overlays, BOM climate records, and CSIRO 2°C scenario projections.
            Composite weighting: Extreme Heat 30% · Flood 25% · Bushfire 20% · Coastal 15% · Cyclone 10% (applicable hazards only).
            Social dwelling estimates from AIHW 2023 + state HA data. SEIFA from ABS Census 2021.
            <strong style={{ color: "#6b8aa0" }}> Scores are evidence-based estimates — verify against primary planning overlays before use in investment decisions.</strong>
          </div>
        </div>

      </div>
    </div>
  )
}
