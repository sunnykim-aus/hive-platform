/**
 * Construction cost index, global events, and housing condition data
 * ported from Python construction_data.py
 * Sources: ABS Cat. 6427.0, Rawlinsons, AIHW, UNSW City Futures
 */

export interface CostIndexRecord {
  year: number
  q: number
  index: number
  label: string | null
}

export interface GlobalEvent {
  date: string
  year_frac: number
  event: string
  impact: string
  cost_impact: string
  icon: string
  color: string
}

export interface CostPerDwelling {
  social_apartment_sqm: number
  social_townhouse_sqm: number
  social_detached_sqm: number
  avg_social_total: number
  avg_market_total: number
  note: string
}

export interface StockCondition {
  national_social_dwellings: number
  avg_age_years: number
  pct_built_before_1980: number
  pct_requiring_major_repair: number
  pct_requiring_urgent_repair: number
  estimated_maintenance_backlog_bn: number
  annual_maintenance_spend_bn: number
  years_to_clear_backlog_at_current_rate: number
  annual_demolition_rate: number
  annual_replacement_rate: number
  net_stock_loss_per_year: number
  source: string
}

export interface StateCondition {
  dwellings: number
  backlog_m: number
  program: string
  avg_age: number
  flagship_renewal: string
}

export interface GovernmentResponse {
  program: string
  year: number
  amount_m: number
  type: string
  homes: number | null
  notes: string
  status: string
  color: string
}

export const COST_INDEX: CostIndexRecord[] = [
  { year: 2019, q: 4, index: 100.0, label: null },
  { year: 2020, q: 1, index: 100.4, label: "COVID-19 shutdowns begin (Mar 2020)" },
  { year: 2020, q: 2, index: 100.1, label: null },
  { year: 2020, q: 3, index: 101.8, label: "HomeBuilder scheme launches — demand surge" },
  { year: 2020, q: 4, index: 103.2, label: null },
  { year: 2021, q: 1, index: 106.1, label: "Timber shortage: framing lumber +130% globally" },
  { year: 2021, q: 2, index: 109.8, label: "Suez Canal blocked — shipping containers crisis" },
  { year: 2021, q: 3, index: 113.5, label: null },
  { year: 2021, q: 4, index: 118.2, label: "HomeBuilder completions backlog peaks" },
  { year: 2022, q: 1, index: 125.4, label: "Russia invades Ukraine — steel & energy spike" },
  { year: 2022, q: 2, index: 132.1, label: "RBA rate hikes begin — subcontractor capacity crisis" },
  { year: 2022, q: 3, index: 138.7, label: "Construction insolvencies surge" },
  { year: 2022, q: 4, index: 143.2, label: null },
  { year: 2023, q: 1, index: 146.5, label: "Labour shortage persists — trades booked 12+ months" },
  { year: 2023, q: 2, index: 148.9, label: null },
  { year: 2023, q: 3, index: 151.2, label: null },
  { year: 2023, q: 4, index: 153.0, label: "Cost growth decelerating — but level remains elevated" },
  { year: 2024, q: 1, index: 154.8, label: null },
  { year: 2024, q: 2, index: 156.1, label: null },
  { year: 2024, q: 3, index: 157.0, label: null },
  { year: 2024, q: 4, index: 157.9, label: "57.9% above 2019 baseline" },
  { year: 2025, q: 1, index: 158.5, label: null },
]

export const GLOBAL_EVENTS: GlobalEvent[] = [
  {
    date: "Mar 2020", year_frac: 2020.17, event: "COVID-19 Global Pandemic",
    impact: "Construction sites shut across Australia. Import supply chains disrupted. Cost pressures initially muted — then exploded as demand rebounded.",
    cost_impact: "+0.4% in 2020, followed by +18% over 2021", icon: "🦠", color: "#e74c3c",
  },
  {
    date: "Jun 2020", year_frac: 2020.42, event: "HomeBuilder Scheme Launched",
    impact: "Government stimulus offering $25,000 grants for new homes. Created an immediate demand surge — builders booked out 12–18 months. Trades prices rose sharply as capacity was overwhelmed.",
    cost_impact: "Added estimated $15,000–$25,000 to average build cost due to trades premium", icon: "🏠", color: "#f39c12",
  },
  {
    date: "Jan 2021", year_frac: 2021.0, event: "Global Timber Crisis",
    impact: "Framing lumber prices rose 130% globally in 12 months. North American sawmill shutdowns during COVID combined with surging US housing demand created a worldwide shortage.",
    cost_impact: "Framing and structural timber: +40–60% vs 2019", icon: "🪵", color: "#8e5e3a",
  },
  {
    date: "Mar 2021", year_frac: 2021.21, event: "Suez Canal Blockage",
    impact: "Ever Given grounded for 6 days — halted $9.6B/day in global trade. Compounded an already strained shipping container shortage.",
    cost_impact: "Imported materials: +15–25% freight premiums through to mid-2022", icon: "🚢", color: "#3498db",
  },
  {
    date: "Feb 2022", year_frac: 2022.12, event: "Russia Invades Ukraine",
    impact: "Russia and Ukraine supply ~30% of global steel and significant shares of nickel, aluminium, and neon gas. Energy prices spiked and fed through to Australian LNG prices.",
    cost_impact: "Structural steel: +22–30%. Reinforcing bar: +35%. Energy-intensive materials: +15–20%", icon: "⚔️", color: "#c0392b",
  },
  {
    date: "May 2022", year_frac: 2022.37, event: "RBA Begins Rate Hikes",
    impact: "Cash rate rose from 0.1% to 4.35% in 13 months. Builder financing costs rose sharply. Fixed-price contracts signed in 2021 became loss-making.",
    cost_impact: "Financing costs: +200–300bps. Triggered wave of builder insolvencies.", icon: "📈", color: "#9b59b6",
  },
  {
    date: "2022–2023", year_frac: 2022.75, event: "Labour Shortage Crisis",
    impact: "Closure of international borders during COVID eliminated 45,000 working holiday visa workers from the construction labour pool. Trades were booked 12–18 months in advance.",
    cost_impact: "Labour cost per dwelling: up 20–30% vs 2019 baseline", icon: "👷", color: "#1abc9c",
  },
  {
    date: "2023–2025", year_frac: 2023.5, event: "Elevated Plateau",
    impact: "Cost growth has slowed but costs remain 55–60% above 2019. The structural factors (labour shortages, tight trades capacity, elevated materials) have not unwound.",
    cost_impact: "Current build cost: $3,800–$5,500/m² for social housing — vs $2,200–$3,100/m² in 2019", icon: "📊", color: "#7f8c8d",
  },
]

export const COST_PER_DWELLING: Record<string, CostPerDwelling> = {
  "2019": {
    social_apartment_sqm: 2300, social_townhouse_sqm: 2100, social_detached_sqm: 1850,
    avg_social_total: 310000, avg_market_total: 490000,
    note: "Pre-COVID baseline. Fixed-price contracts routinely delivered within 5–8% of estimate.",
  },
  "2025": {
    social_apartment_sqm: 4200, social_townhouse_sqm: 3900, social_detached_sqm: 3400,
    avg_social_total: 560000, avg_market_total: 820000,
    note: "Current market. Fixed-price contracts require 15–20% contingency. Many CHPs report HAFF funding gaps of $80,000–$150,000 per dwelling.",
  },
}

export const BILLION_DOLLAR_YIELD: Record<number, number> = {
  2019: Math.round(1000000000 / 310000),
  2025: Math.round(1000000000 / 560000),
}

export const STOCK_CONDITION: StockCondition = {
  national_social_dwellings: 430000,
  avg_age_years: 38,
  pct_built_before_1980: 42,
  pct_requiring_major_repair: 14,
  pct_requiring_urgent_repair: 4,
  estimated_maintenance_backlog_bn: 26.5,
  annual_maintenance_spend_bn: 1.2,
  years_to_clear_backlog_at_current_rate: 22,
  annual_demolition_rate: 1200,
  annual_replacement_rate: 900,
  net_stock_loss_per_year: 300,
  source: "UNSW City Futures (2023), AIHW Housing Assistance in Australia (2023)",
}

export const STATE_CONDITION: Record<string, StateCondition> = {
  NSW: {
    dwellings: 125000, backlog_m: 7200, avg_age: 41,
    program: "LAHC Asset Management Strategy — $812M over 4 years announced 2023. NSW Auditor-General (2020) found 22% of stock in poor or very poor condition.",
    flagship_renewal: "Communities Plus — replacing 33 high-rise estates with mixed-tenure development. Redfern, Waterloo, Macquarie Park.",
  },
  VIC: {
    dwellings: 85000, backlog_m: 5100, avg_age: 36,
    program: "Big Housing Build — $5.3B program (2020). 12,000 new homes, 9,300 refurbishments.",
    flagship_renewal: "Flemington Estate, Carlton, North Richmond — high-rise renewal.",
  },
  QLD: {
    dwellings: 75000, backlog_m: 4400, avg_age: 33,
    program: "Queensland Housing Investment Growth Initiative — $1.1B (2022). Mix of new builds and maintenance.",
    flagship_renewal: "Logan and Woodridge precinct renewal. Olympic legacy housing commitments post-Brisbane 2032.",
  },
  WA: {
    dwellings: 40000, backlog_m: 2100, avg_age: 35,
    program: "Housing and Homelessness Investment Package — $2.4B (2021–25). New builds prioritised over maintenance.",
    flagship_renewal: "Remote Aboriginal community housing — critically underfunded.",
  },
  SA: {
    dwellings: 37000, backlog_m: 1900, avg_age: 44,
    program: "South Australian Housing Trust Capital Program — $400M over 4 years.",
    flagship_renewal: "Woodville West, Angle Park, Bowden — inner-ring estate renewal.",
  },
}

export const GOVERNMENT_RESPONSES: GovernmentResponse[] = [
  {
    program: "Social Housing Accelerator", year: 2023, amount_m: 2000,
    type: "New construction grants to states", homes: 10000,
    notes: "Direct federal grants to state housing authorities. No requirement for community housing provider involvement.",
    status: "Underway", color: "#27ae60",
  },
  {
    program: "HAFF — Social Housing Component", year: 2023, amount_m: 4000,
    type: "Grant funding via Housing Australia", homes: 20000,
    notes: "Delivered through CHPs — the sector's primary new-build pipeline. Cost escalation has created funding gaps on many approved projects.",
    status: "Rounds 1–3 underway", color: "#f6c90e",
  },
  {
    program: "National Housing Infrastructure Facility", year: 2018, amount_m: 3000,
    type: "Concessional loans for infrastructure", homes: null,
    notes: "Finances enabling infrastructure (roads, water, sewerage) for housing developments.",
    status: "Ongoing", color: "#3498db",
  },
  {
    program: "Homes for Australians — Energy Efficiency", year: 2024, amount_m: 300,
    type: "Retrofit grants", homes: null,
    notes: "Grants to improve energy efficiency in social housing. Reduces tenant energy costs and improves stock condition.",
    status: "Announced", color: "#1abc9c",
  },
  {
    program: "State Maintenance Budgets (combined)", year: 2024, amount_m: 1200,
    type: "Ongoing state maintenance", homes: null,
    notes: "Combined annual state housing authority maintenance spend. Against a $26.5B backlog, this represents under 5% per year.",
    status: "Ongoing — inadequate", color: "#e74c3c",
  },
]

export function getCostImpactSummary() {
  const idx_now = COST_INDEX[COST_INDEX.length - 1].index
  const pct_rise = Math.round((idx_now - 100.0) * 10) / 10

  return {
    cost_rise_pct: pct_rise,
    avg_cost_2019: COST_PER_DWELLING["2019"].avg_social_total,
    avg_cost_2025: COST_PER_DWELLING["2025"].avg_social_total,
    cost_increase_abs: COST_PER_DWELLING["2025"].avg_social_total - COST_PER_DWELLING["2019"].avg_social_total,
    homes_per_bn_2019: BILLION_DOLLAR_YIELD[2019],
    homes_per_bn_2025: BILLION_DOLLAR_YIELD[2025],
    homes_lost_per_bn: BILLION_DOLLAR_YIELD[2019] - BILLION_DOLLAR_YIELD[2025],
    maintenance_backlog_bn: STOCK_CONDITION.estimated_maintenance_backlog_bn,
    pct_stock_major_repair: STOCK_CONDITION.pct_requiring_major_repair,
  }
}
