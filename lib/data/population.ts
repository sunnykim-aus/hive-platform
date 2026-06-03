/**
 * ABS Population Projections & Housing Demand data — ported from Python population_data.py
 * Sources: ABS Cat. 3222.0, 3101.0, 3412.0, SQM Research, CoreLogic
 */

export interface NationalHistoricalRecord {
  year: number
  population_m: number
  nim: number
  natural_increase: number
  total_growth: number
}

export interface NOMDetailRecord {
  year: number
  total_k: number
  skilled_k: number
  family_k: number
  student_k: number
  other_k: number
  context: string
}

export interface MigrationPhase {
  label: string
  years: string
  avg_nim_k: number
  color: string
  narrative: string
  housing: string
}

export interface HousingMarketRecord {
  year: number
  national_vacancy_pct: number
  rent_index: number
  nim_k: number
}

export interface NationalProjection {
  year: number
  population_m: number
  natural_increase: number
  nim: number
}

export interface StateProjection {
  current_pop_m: number
  proj_2031_m: number
  proj_2041_m: number
  growth_drivers: string
  implied_new_dwellings_2041: number
  social_housing_pct: number
  current_approvals: number
  required_to_meet_demand: number
  color: string
}

export interface PolicyAdvocacy {
  category: string
  position: string
  evidence: string
}

export const HISTORICAL_NATIONAL: NationalHistoricalRecord[] = [
  { year: 2015, population_m: 23.78, nim: 0.183, natural_increase: 0.155, total_growth: 0.338 },
  { year: 2016, population_m: 24.13, nim: 0.183, natural_increase: 0.152, total_growth: 0.350 },
  { year: 2017, population_m: 24.51, nim: 0.231, natural_increase: 0.149, total_growth: 0.382 },
  { year: 2018, population_m: 24.90, nim: 0.240, natural_increase: 0.149, total_growth: 0.389 },
  { year: 2019, population_m: 25.36, nim: 0.239, natural_increase: 0.148, total_growth: 0.389 },
  { year: 2020, population_m: 25.50, nim: 0.194, natural_increase: 0.147, total_growth: 0.143 },
  { year: 2021, population_m: 25.51, nim: -0.084, natural_increase: 0.143, total_growth: 0.010 },
  { year: 2022, population_m: 25.98, nim: 0.170, natural_increase: 0.148, total_growth: 0.471 },
  { year: 2023, population_m: 26.84, nim: 0.518, natural_increase: 0.150, total_growth: 0.863 },
  { year: 2024, population_m: 27.22, nim: 0.395, natural_increase: 0.151, total_growth: 0.376 },
]

export const HISTORICAL_STATE_POP: Record<string, { year: number; pop_m: number }[]> = {
  NSW: [
    { year: 2015, pop_m: 7.62 }, { year: 2016, pop_m: 7.75 }, { year: 2017, pop_m: 7.89 },
    { year: 2018, pop_m: 8.03 }, { year: 2019, pop_m: 8.11 }, { year: 2020, pop_m: 8.17 },
    { year: 2021, pop_m: 8.18 }, { year: 2022, pop_m: 8.20 }, { year: 2023, pop_m: 8.32 },
    { year: 2024, pop_m: 8.45 },
  ],
  VIC: [
    { year: 2015, pop_m: 5.94 }, { year: 2016, pop_m: 6.07 }, { year: 2017, pop_m: 6.23 },
    { year: 2018, pop_m: 6.43 }, { year: 2019, pop_m: 6.63 }, { year: 2020, pop_m: 6.65 },
    { year: 2021, pop_m: 6.50 }, { year: 2022, pop_m: 6.66 }, { year: 2023, pop_m: 6.91 },
    { year: 2024, pop_m: 7.10 },
  ],
  QLD: [
    { year: 2015, pop_m: 4.74 }, { year: 2016, pop_m: 4.83 }, { year: 2017, pop_m: 4.93 },
    { year: 2018, pop_m: 5.01 }, { year: 2019, pop_m: 5.10 }, { year: 2020, pop_m: 5.19 },
    { year: 2021, pop_m: 5.26 }, { year: 2022, pop_m: 5.46 }, { year: 2023, pop_m: 5.64 },
    { year: 2024, pop_m: 5.80 },
  ],
  WA: [
    { year: 2015, pop_m: 2.59 }, { year: 2016, pop_m: 2.61 }, { year: 2017, pop_m: 2.62 },
    { year: 2018, pop_m: 2.62 }, { year: 2019, pop_m: 2.63 }, { year: 2020, pop_m: 2.67 },
    { year: 2021, pop_m: 2.71 }, { year: 2022, pop_m: 2.81 }, { year: 2023, pop_m: 2.96 },
    { year: 2024, pop_m: 3.08 },
  ],
  SA: [
    { year: 2015, pop_m: 1.70 }, { year: 2016, pop_m: 1.71 }, { year: 2017, pop_m: 1.72 },
    { year: 2018, pop_m: 1.74 }, { year: 2019, pop_m: 1.75 }, { year: 2020, pop_m: 1.77 },
    { year: 2021, pop_m: 1.78 }, { year: 2022, pop_m: 1.81 }, { year: 2023, pop_m: 1.85 },
    { year: 2024, pop_m: 1.90 },
  ],
  TAS: [
    { year: 2015, pop_m: 0.513 }, { year: 2016, pop_m: 0.517 }, { year: 2017, pop_m: 0.524 },
    { year: 2018, pop_m: 0.532 }, { year: 2019, pop_m: 0.539 }, { year: 2020, pop_m: 0.542 },
    { year: 2021, pop_m: 0.545 }, { year: 2022, pop_m: 0.557 }, { year: 2023, pop_m: 0.567 },
    { year: 2024, pop_m: 0.574 },
  ],
  NT: [
    { year: 2015, pop_m: 0.243 }, { year: 2016, pop_m: 0.244 }, { year: 2017, pop_m: 0.244 },
    { year: 2018, pop_m: 0.246 }, { year: 2019, pop_m: 0.247 }, { year: 2020, pop_m: 0.248 },
    { year: 2021, pop_m: 0.249 }, { year: 2022, pop_m: 0.251 }, { year: 2023, pop_m: 0.254 },
    { year: 2024, pop_m: 0.257 },
  ],
  ACT: [
    { year: 2015, pop_m: 0.393 }, { year: 2016, pop_m: 0.402 }, { year: 2017, pop_m: 0.410 },
    { year: 2018, pop_m: 0.420 }, { year: 2019, pop_m: 0.427 }, { year: 2020, pop_m: 0.432 },
    { year: 2021, pop_m: 0.432 }, { year: 2022, pop_m: 0.453 }, { year: 2023, pop_m: 0.467 },
    { year: 2024, pop_m: 0.476 },
  ],
}

export const HISTORICAL_NOM_DETAIL: NOMDetailRecord[] = [
  { year: 2015, total_k: 183, skilled_k: 85, family_k: 47, student_k: 28, other_k: 23, context: "Pre-COVID steady state. Skilled and family streams dominating." },
  { year: 2016, total_k: 183, skilled_k: 86, family_k: 47, student_k: 29, other_k: 21, context: "Stable migration year. Strong Asian student demand in Melbourne and Sydney." },
  { year: 2017, total_k: 231, skilled_k: 98, family_k: 50, student_k: 54, other_k: 29, context: "Surge in international students — particularly from China and India." },
  { year: 2018, total_k: 240, skilled_k: 100, family_k: 52, student_k: 56, other_k: 32, context: "Peak pre-COVID NOM. Federal government debates reducing migration cap." },
  { year: 2019, total_k: 239, skilled_k: 99, family_k: 51, student_k: 57, other_k: 32, context: "Last full pre-COVID year. Migration at near-record levels." },
  { year: 2020, total_k: 194, skilled_k: 72, family_k: 45, student_k: 42, other_k: 35, context: "COVID begins (March). International borders close from March 2020." },
  { year: 2021, total_k: -84, skilled_k: -18, family_k: 10, student_k: -62, other_k: -14, context: "Borders remain closed for the full year. Net OUTFLOW — more people left Australia than arrived." },
  { year: 2022, total_k: 170, skilled_k: 70, family_k: 42, student_k: 38, other_k: 20, context: "Borders reopen. Pent-up demand begins. Skilled migration fast-tracked." },
  { year: 2023, total_k: 518, skilled_k: 188, family_k: 72, student_k: 189, other_k: 69, context: "RECORD annual NOM — more than double the pre-COVID average. Rental markets collapsed." },
  { year: 2024, total_k: 395, skilled_k: 155, family_k: 68, student_k: 128, other_k: 44, context: "Government targets reduction — student visa processing tightened." },
]

export const MIGRATION_PHASES: MigrationPhase[] = [
  {
    label: "Pre-COVID steady state",
    years: "2015–2019",
    avg_nim_k: 215,
    color: "#4d7fb5",
    narrative: "Australia's NOM averaged 215,000 per year — high by historical standards but absorbed into an economy and housing market growing in parallel. Inner-city rental markets were tight but the system was in equilibrium.",
    housing: "Vacancy rates 2–3%. Rents rising moderately at CPI+2%. Social housing waitlists growing slowly. Construction running at ~200,000/yr.",
  },
  {
    label: "COVID collapse",
    years: "2020–2021",
    avg_nim_k: 55,
    color: "#c0614a",
    narrative: "International borders slammed shut in March 2020. NOM crashed from +239,000 to −84,000 over two years — a swing of 323,000 people. Temporary visa holders left. International students departed.",
    housing: "Paradoxically, some capital city vacancy rates rose as students and workers departed (Melbourne CBD briefly hit 8% vacancy). Regional and coastal markets boomed as Australians relocated with remote work.",
  },
  {
    label: "Reopening surge",
    years: "2022–2023",
    avg_nim_k: 344,
    color: "#c49a3a",
    narrative: "Borders reopened in stages from mid-2021. By 2023, NOM hit a record 518,000 — more than double the pre-COVID average. Three factors compounded: pent-up student demand, accelerated skilled migration, and humanitarian programs.",
    housing: "National rental vacancy hit 1.0% in 2023 — the lowest since records began. Perth vacancy: 0.4%. Brisbane: 0.7%. Median rents rose 10–15% in a single year.",
  },
  {
    label: "Managed moderation",
    years: "2024–2025",
    avg_nim_k: 340,
    color: "#5aad8a",
    narrative: "Government has tightened student visa processing and proposed university enrolment caps. NOM is declining but remains above the pre-COVID average. The structural imbalance — population growing faster than housing supply — has not resolved.",
    housing: "Vacancy recovering slowly toward 1.5–2.0%. Rent growth slowing but from a 35% higher base than 2019. Social housing waitlists remain at record levels.",
  },
]

export const HOUSING_MARKET_HISTORY: HousingMarketRecord[] = [
  { year: 2015, national_vacancy_pct: 2.8, rent_index: 100, nim_k: 183 },
  { year: 2016, national_vacancy_pct: 2.6, rent_index: 102, nim_k: 183 },
  { year: 2017, national_vacancy_pct: 2.4, rent_index: 105, nim_k: 231 },
  { year: 2018, national_vacancy_pct: 2.3, rent_index: 108, nim_k: 240 },
  { year: 2019, national_vacancy_pct: 2.1, rent_index: 110, nim_k: 239 },
  { year: 2020, national_vacancy_pct: 2.5, rent_index: 109, nim_k: 194 },
  { year: 2021, national_vacancy_pct: 1.8, rent_index: 112, nim_k: -84 },
  { year: 2022, national_vacancy_pct: 1.2, rent_index: 122, nim_k: 170 },
  { year: 2023, national_vacancy_pct: 1.0, rent_index: 140, nim_k: 518 },
  { year: 2024, national_vacancy_pct: 1.3, rent_index: 148, nim_k: 395 },
]

export const NATIONAL_PROJECTIONS: NationalProjection[] = [
  { year: 2024, population_m: 26.8, natural_increase: 0.15, nim: 0.28 },
  { year: 2025, population_m: 27.2, natural_increase: 0.15, nim: 0.25 },
  { year: 2026, population_m: 27.6, natural_increase: 0.15, nim: 0.24 },
  { year: 2027, population_m: 28.0, natural_increase: 0.15, nim: 0.23 },
  { year: 2028, population_m: 28.4, natural_increase: 0.15, nim: 0.22 },
  { year: 2029, population_m: 28.7, natural_increase: 0.15, nim: 0.21 },
  { year: 2030, population_m: 29.1, natural_increase: 0.15, nim: 0.20 },
  { year: 2035, population_m: 30.7, natural_increase: 0.14, nim: 0.18 },
  { year: 2040, population_m: 32.3, natural_increase: 0.12, nim: 0.15 },
  { year: 2044, population_m: 33.4, natural_increase: 0.11, nim: 0.13 },
]

export const STATE_PROJECTIONS: Record<string, StateProjection> = {
  NSW: {
    current_pop_m: 8.35, proj_2031_m: 9.20, proj_2041_m: 10.05,
    growth_drivers: "Strong net overseas migration, internal migration from VIC/QLD, concentrated in Greater Sydney and Hunter Region.",
    implied_new_dwellings_2041: 340000, social_housing_pct: 4.2,
    current_approvals: 35500, required_to_meet_demand: 53000, color: "#4d7fb5",
  },
  VIC: {
    current_pop_m: 7.05, proj_2031_m: 7.85, proj_2041_m: 8.60,
    growth_drivers: "Highest internal migration gain nationally, strong NOM recovery post-COVID. Growth concentrated in Melbourne outer suburbs and Geelong.",
    implied_new_dwellings_2041: 300000, social_housing_pct: 3.4,
    current_approvals: 45200, required_to_meet_demand: 52000, color: "#c0614a",
  },
  QLD: {
    current_pop_m: 5.72, proj_2031_m: 6.45, proj_2041_m: 7.20,
    growth_drivers: "Fastest-growing state by net internal migration. South East Queensland absorbed 50,000+ interstate arrivals per year post-2020. Brisbane Olympics pipeline.",
    implied_new_dwellings_2041: 255000, social_housing_pct: 3.8,
    current_approvals: 31000, required_to_meet_demand: 44000, color: "#c49a3a",
  },
  WA: {
    current_pop_m: 3.02, proj_2031_m: 3.42, proj_2041_m: 3.82,
    growth_drivers: "Resources sector driving NOM and skilled migration. Perth land release constraints limiting outer-suburban supply. Rental vacancy below 1%.",
    implied_new_dwellings_2041: 120000, social_housing_pct: 4.6,
    current_approvals: 14200, required_to_meet_demand: 22000, color: "#5aad8a",
  },
  SA: {
    current_pop_m: 1.86, proj_2031_m: 2.00, proj_2041_m: 2.12,
    growth_drivers: "Lower growth than eastern states. Defence and energy sector investment driving skilled migration. Adelaide affordable by comparison.",
    implied_new_dwellings_2041: 55000, social_housing_pct: 6.1,
    current_approvals: 7200, required_to_meet_demand: 11000, color: "#6b8aa0",
  },
  TAS: {
    current_pop_m: 0.574, proj_2031_m: 0.600, proj_2041_m: 0.628,
    growth_drivers: "Modest growth driven by sea-change migration, retirees, and remote workers. Constrained land supply and island geography limit development pace.",
    implied_new_dwellings_2041: 22000, social_housing_pct: 7.2,
    current_approvals: 2700, required_to_meet_demand: 4200, color: "#1abc9c",
  },
  NT: {
    current_pop_m: 0.257, proj_2031_m: 0.268, proj_2041_m: 0.282,
    growth_drivers: "Defence expansion, energy sector (gas, hydrogen), and Aboriginal community investment. High churn in skilled workforce and significant remote population needs.",
    implied_new_dwellings_2041: 10000, social_housing_pct: 17.8,
    current_approvals: 1000, required_to_meet_demand: 1800, color: "#e67e22",
  },
  ACT: {
    current_pop_m: 0.476, proj_2031_m: 0.520, proj_2041_m: 0.562,
    growth_drivers: "Federal government employment base, expanding health and education sectors, and overflow from expensive Sydney market. Infill-focused planning supports density.",
    implied_new_dwellings_2041: 36000, social_housing_pct: 8.4,
    current_approvals: 5000, required_to_meet_demand: 7500, color: "#c0614a",
  },
}

export const POLICY_ADVOCACY: PolicyAdvocacy[] = [
  {
    category: "Increase the National Housing Accord target",
    position: "The current 1.2M/5-year target (240,000/yr) is based on 2022 population assumptions. With NOM running at 400,000+ per year, the required build rate is closer to 300,000–320,000 per year.",
    evidence: "ABS 3222.0 Series B projects 7.3M additional people to 2041 — requiring approximately 3.0M additional dwellings at current household size. Current trajectory delivers approximately 1.9M.",
  },
  {
    category: "Mandate inclusionary zoning at 15% minimum",
    position: "All new greenfield and medium-density developments above 50 dwellings should include a minimum 15% social/affordable component as a condition of planning approval.",
    evidence: "AHURI research (2022) found that inclusionary zoning of 10–15% would add 12,000–18,000 affordable dwellings annually at zero net public cost when combined with density bonuses.",
  },
  {
    category: "Accelerate Build-to-Rent for affordable tiers",
    position: "The managed investment trust (MIT) withholding tax concession for Build-to-Rent should be extended to include a mandatory 20% affordable tier (at 75% of market rent).",
    evidence: "The government's 2023 BTR tax changes were welcomed but AHURI modelling shows they will add fewer than 5,000 dwellings at below-market rents over 10 years without an affordability mandate.",
  },
  {
    category: "Fast-track planning reform for social housing",
    position: "State planning approvals for community housing provider developments should be treated as State Significant Development with a 60-day determination target.",
    evidence: "Power Housing Australia (2024): planning delays are the single largest controllable cost driver in CHP development pipelines, accounting for 22% of total development costs in metropolitan areas.",
  },
  {
    category: "Establish a Social Housing Futures Fund",
    position: "A dedicated off-budget fund of $5B (modelled on HAFF but for existing stock renewal) to address the $25B+ deferred maintenance backlog in social housing.",
    evidence: "UNSW City Futures (2023): the national social housing maintenance backlog is estimated at $26.5B. At current state funding rates, it will take 40+ years to clear.",
  },
  {
    category: "Tie Commonwealth Rent Assistance to housing CPI",
    position: "Commonwealth Rent Assistance has not kept pace with rental market increases. Indexing CRA to a rental-specific CPI measure rather than the headline CPI would prevent the effective reduction in support.",
    evidence: "ACOSS (2024): the real value of CRA has fallen 20% relative to market rents since 2019. Recipients face average rental stress of 67% — spending 2 in every 3 dollars of income on rent.",
  },
]

export const ACCORD_TARGET = 240000
// ABS 12-month snapshot used in population/supply-gap analysis — matches Python population_data.py
// (Note: live run rate on homepage/live-dashboard uses getBuildingApprovalsSummary() = 188,408)
export const CURRENT_ANNUAL_APPROVALS = 163000
export const CURRENT_DWELLING_STOCK_M = 11.2
