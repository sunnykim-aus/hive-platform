/**
 * Building Energy Ratings Intelligence
 *
 * Two key rating systems:
 *   NatHERS (Nationwide House Energy Rating Scheme) — 0-10 stars, thermal performance
 *   NABERS (National Australian Built Environment Rating System) — 1-6 stars, operational energy
 *
 * NCC 2022 mandated 7-star NatHERS for all new residential construction (effective May 2023).
 * Existing social housing stock averages 2-3 stars — a 4-star gap that costs tenants
 * thousands per year in energy bills and creates documented heat-health mortality risk.
 *
 * Sources:
 *   CSIRO — NatHERS rating distribution study 2023
 *   AIHW — Social housing energy performance, Housing Assistance in Australia 2023
 *   AGL/Origin/EnergyAustralia — residential energy cost benchmarks 2024
 *   ClimateWorks Australia — Towards Zero Emissions housing report 2023
 *   AHURI — Residential energy efficiency and low-income households 2022
 *   NCC 2022 (National Construction Code) — 7-star mandate
 *   Housing Australia — HAFF energy design requirements 2024-25
 */

// ── NatHERS rating tiers ────────────────────────────────────────────────────

export interface NatHERSTier {
  stars: number
  label: string
  description: string
  typical_era: string
  pct_social_stock: number         // estimated % of social housing at this tier
  annual_energy_cost_av: number    // avg annual energy cost for tenant ($)
  annual_cost_vs_7star: number     // $ extra per year vs 7-star home
  summer_peak_temp_deg: number     // avg indoor peak temp on 40°C day (no A/C)
  health_risk: "Critical" | "High" | "Moderate" | "Low"
  color: string
}

export const NATHERS_TIERS: NatHERSTier[] = [
  {
    stars: 1, label: "1 Star — Thermally inadequate",
    description: "Almost no thermal protection. Indoor temperatures track outdoor almost perfectly. Effectively unliveable in Australian summer without A/C running continuously. Found in pre-1960s housing.",
    typical_era: "Pre-1960 construction",
    pct_social_stock: 8,
    annual_energy_cost_av: 4200,
    annual_cost_vs_7star: 2800,
    summer_peak_temp_deg: 46,
    health_risk: "Critical",
    color: "#c0614a",
  },
  {
    stars: 2, label: "2 Star — Very poor performance",
    description: "Minimal insulation, single-glazed windows, significant air leakage. Very high heating and cooling loads. The most common rating for 1960s-80s social housing estates.",
    typical_era: "1960s–1980s",
    pct_social_stock: 31,
    annual_energy_cost_av: 3600,
    annual_cost_vs_7star: 2200,
    summer_peak_temp_deg: 43,
    health_risk: "Critical",
    color: "#c0614a",
  },
  {
    stars: 3, label: "3 Star — Below minimum standard",
    description: "Some insulation but still significantly underperforming. High heating and cooling costs, particularly in climate-extreme zones. Common in 1980s-90s stock.",
    typical_era: "1980s–1990s",
    pct_social_stock: 28,
    annual_energy_cost_av: 2900,
    annual_cost_vs_7star: 1500,
    summer_peak_temp_deg: 40,
    health_risk: "High",
    color: "#c49a3a",
  },
  {
    stars: 4, label: "4 Star — Below current standard",
    description: "Reasonable insulation but still below the 6-star minimum that applied 2010-2023. Moderate heating and cooling loads. Typical of early 2000s construction.",
    typical_era: "Early 2000s",
    pct_social_stock: 18,
    annual_energy_cost_av: 2300,
    annual_cost_vs_7star: 900,
    summer_peak_temp_deg: 37,
    health_risk: "Moderate",
    color: "#c49a3a",
  },
  {
    stars: 5, label: "5 Star — Pre-2010 minimum",
    description: "Met the minimum standard pre-2010. Good insulation, better window performance. Still below the 6-star and 7-star mandates that followed.",
    typical_era: "Late 2000s",
    pct_social_stock: 8,
    annual_energy_cost_av: 1900,
    annual_cost_vs_7star: 500,
    summer_peak_temp_deg: 35,
    health_risk: "Moderate",
    color: "#4d7fb5",
  },
  {
    stars: 6, label: "6 Star — Previous minimum",
    description: "Met the 6-star minimum (2010-2022). Good thermal performance, significantly reduced heating and cooling loads. Most HAFF Round 1-2 new builds.",
    typical_era: "2010–2022",
    pct_social_stock: 4,
    annual_energy_cost_av: 1600,
    annual_cost_vs_7star: 200,
    summer_peak_temp_deg: 33,
    health_risk: "Low",
    color: "#5aad8a",
  },
  {
    stars: 7, label: "7 Star — Current NCC 2022 minimum",
    description: "Current mandatory minimum for all new residential construction since May 2023. Significant improvement in thermal performance. Required for all HAFF Round 3 funded dwellings.",
    typical_era: "Post-May 2023",
    pct_social_stock: 2,
    annual_energy_cost_av: 1400,
    annual_cost_vs_7star: 0,
    summer_peak_temp_deg: 30,
    health_risk: "Low",
    color: "#5aad8a",
  },
  {
    stars: 8, label: "8–10 Star — High performance / Net Zero ready",
    description: "Exceeds mandatory standard. Very low energy load, suitable for solar + battery integration. Net Zero capable with renewable energy. Target for Climate Active and Green Star rated social housing.",
    typical_era: "Emerging best practice",
    pct_social_stock: 1,
    annual_energy_cost_av: 800,
    annual_cost_vs_7star: -600,
    summer_peak_temp_deg: 27,
    health_risk: "Low",
    color: "#5aad8a",
  },
]

// ── State energy performance data ──────────────────────────────────────────

export interface StateEnergyData {
  state: string
  label: string
  social_dwellings: number
  avg_nathers_stars: number
  pct_below_3star: number         // Most urgent — pre-1990s stock
  pct_below_6star: number         // Below previous minimum
  pct_meeting_7star: number       // Meeting current NCC 2022 standard
  avg_annual_energy_bill: number  // $ per household
  energy_poverty_pct: number      // % of tenants spending >10% income on energy
  haff_pipeline_7star_pct: number // % of HAFF-funded new builds meeting 7-star
  dominant_stock_era: string
  retrofit_gap_cost_m: number     // Estimated cost to upgrade all sub-3star to 5star
  notes: string
}

export const STATE_ENERGY_DATA: StateEnergyData[] = [
  {
    state: "NSW", label: "New South Wales",
    social_dwellings: 112000, avg_nathers_stars: 2.8, pct_below_3star: 42,
    pct_below_6star: 85, pct_meeting_7star: 3,
    avg_annual_energy_bill: 3200, energy_poverty_pct: 38,
    haff_pipeline_7star_pct: 82,
    dominant_stock_era: "1960s–1980s",
    retrofit_gap_cost_m: 1344,
    notes: "NSW's largest social housing estates (Claymore, Mount Druitt, Waterloo) were built in the 1960s-80s with virtually no insulation. The estate upgrade programme is critically under-resourced relative to the scale of need.",
  },
  {
    state: "VIC", label: "Victoria",
    social_dwellings: 84000, avg_nathers_stars: 3.1, pct_below_3star: 38,
    pct_below_6star: 82, pct_meeting_7star: 4,
    avg_annual_energy_bill: 3100, energy_poverty_pct: 35,
    haff_pipeline_7star_pct: 88,
    dominant_stock_era: "1960s–1980s",
    retrofit_gap_cost_m: 1008,
    notes: "Victoria's Big Housing Build mandated 7-star for all new builds from 2022 — the best pipeline performance nationally. However the existing stock in high-rise estates (Flemington, Fitzroy, North Melbourne) has complex energy retrofit challenges.",
  },
  {
    state: "QLD", label: "Queensland",
    social_dwellings: 68000, avg_nathers_stars: 3.2, pct_below_3star: 35,
    pct_below_6star: 80, pct_meeting_7star: 5,
    avg_annual_energy_bill: 2900, energy_poverty_pct: 32,
    haff_pipeline_7star_pct: 79,
    dominant_stock_era: "1970s–1990s",
    retrofit_gap_cost_m: 714,
    notes: "Queensland's tropical and sub-tropical climate means cooling dominates energy costs. Low-star housing in North Queensland (Townsville, Cairns) traps heat to dangerous levels. Elevated traditional housing presents unique retrofit challenges.",
  },
  {
    state: "WA", label: "Western Australia",
    social_dwellings: 42000, avg_nathers_stars: 2.6, pct_below_3star: 48,
    pct_below_6star: 88, pct_meeting_7star: 3,
    avg_annual_energy_bill: 3400, energy_poverty_pct: 42,
    haff_pipeline_7star_pct: 74,
    dominant_stock_era: "1970s–1980s",
    retrofit_gap_cost_m: 605,
    notes: "WA has the worst average NatHERS rating nationally. Extreme heat in Perth's outer suburbs and the Pilbara/Kimberley makes poor thermal performance life-threatening. Many remote community dwellings have no effective insulation at all.",
  },
  {
    state: "SA", label: "South Australia",
    social_dwellings: 38000, avg_nathers_stars: 2.7, pct_below_3star: 46,
    pct_below_6star: 87, pct_meeting_7star: 3,
    avg_annual_energy_bill: 3300, energy_poverty_pct: 40,
    haff_pipeline_7star_pct: 71,
    dominant_stock_era: "1950s–1970s",
    retrofit_gap_cost_m: 524,
    notes: "SA's Elizabeth/Playford estate — Australia's largest social housing precinct — was built with 1950s-60s standards and has the worst average energy rating of any major Australian housing estate. The heat mortality risk here is the most acute in southern Australia.",
  },
  {
    state: "TAS", label: "Tasmania",
    social_dwellings: 13500, avg_nathers_stars: 2.4, pct_below_3star: 52,
    pct_below_6star: 91, pct_meeting_7star: 2,
    avg_annual_energy_bill: 3800, energy_poverty_pct: 48,
    haff_pipeline_7star_pct: 68,
    dominant_stock_era: "1950s–1970s",
    retrofit_gap_cost_m: 211,
    notes: "Tasmania has the oldest stock nationally and the highest energy poverty rate (48%). Cold winters make poor thermal performance a different but equally dangerous crisis — hypothermia and respiratory illness rather than heat mortality. The average energy bill of $3,800 represents 12-15% of income for typical social housing tenants.",
  },
  {
    state: "NT", label: "Northern Territory",
    social_dwellings: 18000, avg_nathers_stars: 1.8, pct_below_3star: 68,
    pct_below_6star: 95, pct_meeting_7star: 1,
    avg_annual_energy_bill: 4100, energy_poverty_pct: 55,
    haff_pipeline_7star_pct: 58,
    dominant_stock_era: "1970s–1990s",
    retrofit_gap_cost_m: 324,
    notes: "NT has the worst average energy performance of any state or territory. Much of the remote community housing was purpose-built for the tropics in the 1970s-80s with minimal insulation. Year-round extreme heat plus very poor thermal performance and power supply issues create documented life-threatening conditions.",
  },
  {
    state: "ACT", label: "Aust. Capital Territory",
    social_dwellings: 11500, avg_nathers_stars: 3.6, pct_below_3star: 28,
    pct_below_6star: 75, pct_meeting_7star: 8,
    avg_annual_energy_bill: 2800, energy_poverty_pct: 28,
    haff_pipeline_7star_pct: 91,
    dominant_stock_era: "1970s–1990s",
    retrofit_gap_cost_m: 97,
    notes: "ACT has the best energy performance nationally, driven by CHC's systematic upgrade programme and the territory's strong climate policy. Cold Canberra winters make this a heating-dominated energy market — improved insulation is particularly impactful.",
  },
]

// ── Upgrade cost model ─────────────────────────────────────────────────────

export interface EnergyUpgradeCost {
  from_stars: number
  to_stars: number
  typical_measures: string[]
  cost_per_dwelling_k: { min: number; max: number }
  annual_bill_saving: number    // $ per year
  payback_years: number         // simple payback
  co2_reduction_kg: number      // kg CO2/year
  notes: string
}

export const UPGRADE_COSTS: EnergyUpgradeCost[] = [
  {
    from_stars: 2, to_stars: 5,
    typical_measures: ["Ceiling insulation (R4.0)", "Underfloor insulation", "Wall insulation (where accessible)", "Draught sealing", "Window film or secondary glazing"],
    cost_per_dwelling_k: { min: 8, max: 18 },
    annual_bill_saving: 1100,
    payback_years: 11,
    co2_reduction_kg: 1800,
    notes: "Most cost-effective upgrade pathway. Ceiling insulation delivers the biggest single benefit — typically $3-6k with immediate and significant bill reduction. Achievable without structural works.",
  },
  {
    from_stars: 2, to_stars: 6,
    typical_measures: ["All above PLUS:", "Double-glazed window replacement", "Upgraded external doors", "Heat pump hot water", "Mechanical ventilation"],
    cost_per_dwelling_k: { min: 18, max: 38 },
    annual_bill_saving: 1700,
    payback_years: 18,
    co2_reduction_kg: 2600,
    notes: "Window replacement is the dominant cost in this upgrade pathway ($8-15k). Best suited to properties with adequate structural condition to justify the investment.",
  },
  {
    from_stars: 2, to_stars: 7,
    typical_measures: ["Full fabric upgrade", "Triple-glazed windows", "Air-tightness testing and sealing", "Heat pump system", "Solar PV and battery-ready"],
    cost_per_dwelling_k: { min: 35, max: 65 },
    annual_bill_saving: 2200,
    payback_years: 22,
    co2_reduction_kg: 3400,
    notes: "2-star to 7-star is typically not cost-viable as a retrofit for most existing stock. New build or major redevelopment is usually better value at this level of improvement.",
  },
  {
    from_stars: 4, to_stars: 7,
    typical_measures: ["Window upgrade", "Additional insulation", "Heat pump hot water", "Draught sealing improvements", "Solar PV ready"],
    cost_per_dwelling_k: { min: 15, max: 28 },
    annual_bill_saving: 900,
    payback_years: 19,
    co2_reduction_kg: 1400,
    notes: "For 2000s-era stock, targeted upgrades to reach 7-star are more achievable. The base level of insulation means window improvements and air-tightness deliver the biggest gains.",
  },
]

// ── Annual cost by star rating ─────────────────────────────────────────────

export const ENERGY_COST_BY_CLIMATE: Record<string, { hot: number; temperate: number; cold: number }> = {
  "2-star": { hot: 4200, temperate: 3200, cold: 3800 },
  "3-star": { hot: 3500, temperate: 2700, cold: 3200 },
  "4-star": { hot: 2800, temperate: 2200, cold: 2600 },
  "5-star": { hot: 2200, temperate: 1800, cold: 2100 },
  "6-star": { hot: 1800, temperate: 1500, cold: 1700 },
  "7-star": { hot: 1500, temperate: 1300, cold: 1400 },
  "8-star": { hot: 1000, temperate: 850, cold: 900 },
}

// ── HAFF energy requirements ───────────────────────────────────────────────

export interface HAFFEnergyRequirement {
  round: string
  min_nathers: number
  detail: string
  solar_requirement: string
  heat_pump_requirement: string
  notes: string
}

export const HAFF_ENERGY_REQUIREMENTS: HAFFEnergyRequirement[] = [
  {
    round: "Round 1",
    min_nathers: 6,
    detail: "6-star NatHERS minimum (pre-NCC 2022 standard). Assessed through design documentation. No mandatory renewable energy requirement.",
    solar_requirement: "Not required",
    heat_pump_requirement: "Not required",
    notes: "Round 1 was contracted before NCC 2022 took effect. Many R1 projects were designed to 6-star but some, particularly those in design pre-2022, fell below this.",
  },
  {
    round: "Round 2",
    min_nathers: 7,
    detail: "7-star NatHERS minimum (aligned with NCC 2022). All R2 projects designed after NCC 2022 commencement. Housing Australia required independent energy assessor certification.",
    solar_requirement: "Strongly encouraged — scored positively",
    heat_pump_requirement: "Strongly encouraged for hot water",
    notes: "R2 marked the shift to 7-star compliance. Some R2 contracts signed in transition period — verify individual project compliance.",
  },
  {
    round: "Round 3",
    min_nathers: 7,
    detail: "7-star NatHERS minimum confirmed. Additionally, all projects must demonstrate whole-of-life energy performance including hot water systems. Applications scored on energy performance above 7-star minimum.",
    solar_requirement: "Required for all multi-unit developments >4 dwellings",
    heat_pump_requirement: "Required for all new builds — gas hot water excluded",
    notes: "R3 introduced the no-gas rule for new builds — a significant shift. Solar PV requirement for multi-unit is the first mandatory renewable energy provision in HAFF. Projects achieving 8+ stars receive additional assessment points.",
  },
]

// ── National stats ─────────────────────────────────────────────────────────

export function getEnergyStats() {
  const totalStock      = STATE_ENERGY_DATA.reduce((s,r) => s + r.social_dwellings, 0)
  const below3star      = STATE_ENERGY_DATA.reduce((s,r) => s + Math.round(r.social_dwellings * r.pct_below_3star / 100), 0)
  const below6star      = STATE_ENERGY_DATA.reduce((s,r) => s + Math.round(r.social_dwellings * r.pct_below_6star / 100), 0)
  const meeting7star    = STATE_ENERGY_DATA.reduce((s,r) => s + Math.round(r.social_dwellings * r.pct_meeting_7star / 100), 0)
  const avgBill         = Math.round(STATE_ENERGY_DATA.reduce((s,r) => s + r.avg_annual_energy_bill * r.social_dwellings, 0) / totalStock)
  const totalRetrofitGap = STATE_ENERGY_DATA.reduce((s,r) => s + r.retrofit_gap_cost_m, 0)
  const avgEnergyPoverty = Math.round(STATE_ENERGY_DATA.reduce((s,r) => s + r.energy_poverty_pct * r.social_dwellings, 0) / totalStock)
  return { totalStock, below3star, below6star, meeting7star, avgBill, totalRetrofitGap, avgEnergyPoverty }
}

export const STAR_COLORS: Record<number, string> = {
  1: "#c0614a", 2: "#c0614a", 3: "#c49a3a", 4: "#c49a3a",
  5: "#4d7fb5", 6: "#5aad8a", 7: "#5aad8a", 8: "#5aad8a",
}
