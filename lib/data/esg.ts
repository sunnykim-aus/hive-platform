/**
 * ESG Intelligence — Environmental, Social, Governance
 * for Australian Social Housing Sector
 *
 * This module provides a structured ESG framework for CHPs, investors,
 * lenders, and government stakeholders. It synthesises data from across
 * the HIVE platform into a single evaluative lens.
 *
 * Sources:
 *   E: CSIRO NatHERS 2023, ClimateWorks Australia 2023, AIHW 2023, BOM
 *   S: AIHW Housing Assistance 2023, SHS Annual Report 2023, CHIA 2023
 *   G: NRSCH Sector Financial Performance Report 2023-24, state Registrar Sector Performance Reports 2024, CHIA Sector Data
 *   Scoring: AHURI ESG framework research 2022, GRESB real assets methodology
 */

// ── Pillar definitions ────────────────────────────────────────────────────────

export type ESGPillar = "Environmental" | "Social" | "Governance"
export type ESGRating = "Leader" | "Adequate" | "Below Average" | "Lagging"

export const PILLAR_COLORS: Record<ESGPillar, string> = {
  Environmental: "#5aad8a",
  Social:        "#4d7fb5",
  Governance:    "#f6c90e",
}

export const RATING_COLORS: Record<ESGRating, string> = {
  Leader:        "#5aad8a",
  Adequate:      "#4d7fb5",
  "Below Average": "#c49a3a",
  Lagging:       "#c0614a",
}

// ── E — Environmental ─────────────────────────────────────────────────────────

export interface EnvironmentalMetric {
  id: string
  label: string
  value: string
  numeric: number
  benchmark: string
  rating: ESGRating
  trend: "improving" | "static" | "worsening"
  detail: string
  source: string
}

export const ENVIRONMENTAL_METRICS: EnvironmentalMetric[] = [
  {
    id: "avg_nathers",
    label: "Average NatHERS Star Rating",
    value: "2.9★",
    numeric: 2.9,
    benchmark: "7★ (NCC 2022 minimum for new builds)",
    rating: "Lagging",
    trend: "improving",
    detail: "Social housing averages 2.9 stars — 4.1 stars below the current mandatory minimum for new construction. 42% of stock is below 3-star, representing documented heat and cold mortality risk for tenants.",
    source: "CSIRO NatHERS Rating Distribution Study 2023",
  },
  {
    id: "carbon_intensity",
    label: "Carbon Intensity",
    value: "9.8 t CO₂/dwelling/yr",
    numeric: 9.8,
    benchmark: "Target: <3.5t by 2035 (ClimateWorks pathway)",
    rating: "Lagging",
    trend: "improving",
    detail: "Social housing emits approximately 9.8 tonnes of CO₂ per dwelling per year — 2.8× the residential sector average (3.5t). High emissions driven by gas appliances, poor insulation requiring continuous heating/cooling, and coal-heavy grid connections.",
    source: "ClimateWorks Australia — Towards Zero Emissions Housing 2023",
  },
  {
    id: "solar_coverage",
    label: "Solar PV Coverage",
    value: "~12%",
    numeric: 12,
    benchmark: "33% national residential average (ABS 2024)",
    rating: "Lagging",
    trend: "improving",
    detail: "Only ~12% of social housing has rooftop solar — one-third of the national residential average. HAFF Round 3 has mandated solar for new multi-unit builds, which will improve the pipeline. Existing stock upgrade is the challenge.",
    source: "AIHW Housing Assistance 2023; ABS Housing Energy Consumption Survey 2024",
  },
  {
    id: "green_certification",
    label: "Green Star / NABERS Certified",
    value: "<2%",
    numeric: 2,
    benchmark: "Commercial sector: ~28% of major assets",
    rating: "Lagging",
    trend: "improving",
    detail: "Less than 2% of social housing has any formal NABERS energy or Green Star rating. This is primarily because voluntary certification is not required for social housing. HAFF Round 3's energy reporting requirements are beginning to change this.",
    source: "GBCA Green Star Register 2024; NABERS National Database",
  },
  {
    id: "energy_poverty",
    label: "Tenant Energy Poverty Rate",
    value: "~38%",
    numeric: 38,
    benchmark: "National average: ~8.5% (ABS HIES 2022)",
    rating: "Lagging",
    trend: "static",
    detail: "38% of social housing tenants spend more than 10% of income on energy — 4.5× the national average. Energy poverty is directly caused by poor building thermal performance, making energy upgrade the most direct intervention.",
    source: "AIHW Housing Assistance 2023; ABS Household Income and Expenditure Survey 2022",
  },
  {
    id: "haff_energy_pipeline",
    label: "HAFF Pipeline at 7-Star+",
    value: "~79%",
    numeric: 79,
    benchmark: "Target: 100% by Round 4",
    rating: "Adequate",
    trend: "improving",
    detail: "Approximately 79% of HAFF-contracted homes meet or exceed the 7-star NatHERS standard. Round 3's mandatory 7-star requirement will bring this to near-100% for new builds, representing a step-change in the sector's energy performance pipeline.",
    source: "Housing Australia Annual Report 2024-25",
  },
  {
    id: "climate_risk_critical",
    label: "Social Housing in Critical Climate Risk Zones",
    value: "~48 suburbs",
    numeric: 48,
    benchmark: "Critical = compound hazard score ≥75/100",
    rating: "Lagging",
    trend: "worsening",
    detail: "48 of 152 profiled high-priority social housing suburbs score Critical on HIVE's climate risk index — compound exposure to flood, extreme heat, bushfire, coastal inundation or cyclone at the 75+ severity level. This is not static: climate projections show risk intensifying in every hazard category by 2050.",
    source: "HIVE Climate Risk Intelligence 2026 (CSIRO, BOM, state planning portals)",
  },
]

// ── S — Social ─────────────────────────────────────────────────────────────────

export interface SocialMetric {
  id: string
  label: string
  value: string
  numeric: number
  benchmark: string
  rating: ESGRating
  trend: "improving" | "static" | "worsening"
  detail: string
  source: string
}

export const SOCIAL_METRICS: SocialMetric[] = [
  {
    id: "tenant_stability",
    label: "Tenant Stability Rate",
    value: "~78%",
    numeric: 78,
    benchmark: "Target: 85%+ (sector best practice)",
    rating: "Adequate",
    trend: "static",
    detail: "Approximately 78% of social housing tenants maintain their tenancy for more than 12 months. Instability is driven by family violence evictions, income volatility, and inappropriate dwelling type (e.g., single person in 3-bedroom stock). CHPs with specialist support services achieve 85-90%.",
    source: "AIHW Housing Assistance in Australia 2023",
  },
  {
    id: "wait_time",
    label: "Average Wait Time",
    value: "4.2 years",
    numeric: 4.2,
    benchmark: "Target: <2 years (National Housing Accord)",
    rating: "Lagging",
    trend: "worsening",
    detail: "Average wait time for social housing has increased from 3.1 years (2018) to 4.2 years (2024). Priority applicants (family violence, homelessness, medical need) wait an average of 1.8 years — down from 2.3 years due to HAFF Round 1 allocations.",
    source: "State housing authority waitlist registers 2024; AIHW 2023",
  },
  {
    // CORRECTED 2026-07 (source investigation, AIHW SHS 2022-23): was "62% unmet", which
    // MISLABELLED a different AIHW stat — 62% is the share of *unassisted requests* that were
    // for short-term/emergency accommodation, NOT the unmet rate. The true accommodation-unmet
    // rate: 165,000 clients (60%) needed accommodation, provided to 83,800 (51%) → ~49% unmet.
    id: "unmet_requests",
    label: "Unmet Accommodation Need (SHS)",
    value: "~49%",
    numeric: 49,
    benchmark: "Target: <20% unmet rate",
    rating: "Lagging",
    trend: "static",
    detail: "Of the ~165,000 Specialist Homelessness Services clients who needed accommodation in 2022-23 (60% of all clients), only ~51% (83,800) were provided it — leaving ~49% with unmet accommodation need. Separately, agencies turned away ~108,000 unassisted requests over the year (~295/day), 62% of them for short-term or emergency accommodation. Corrected from a prior '62% unmet' figure that conflated these two statistics.",
    source: "AIHW Specialist Homelessness Services Annual Report 2022-23 (Unmet demand / Unassisted requests for services)",
  },
  {
    id: "first_nations",
    label: "First Nations Tenant Proportion",
    value: "~22%",
    numeric: 22,
    benchmark: "3.8% of national population — 5.8× overrepresentation",
    rating: "Below Average",
    trend: "static",
    detail: "22% of social housing tenants identify as Aboriginal or Torres Strait Islander, despite representing 3.8% of the population. This 5.8× overrepresentation reflects structural disadvantage — inadequate remote housing, intergenerational poverty, and policy failures dating to colonisation. It is not a 'housing metric' — it is a measure of national policy debt.",
    source: "AIHW Housing Assistance 2023; ABS Census 2021",
  },
  {
    id: "disability_proportion",
    label: "Disability / Health Need Proportion",
    value: "~31%",
    numeric: 31,
    benchmark: "18% of national population",
    rating: "Below Average",
    trend: "improving",
    detail: "31% of social housing tenants have a disability or long-term health condition, versus 18% nationally. This 1.7× overrepresentation drives the urgent need for Livable Housing Design compliance — this cohort disproportionately lives in the 92% of stock that fails Silver standard.",
    source: "AIHW Housing Assistance 2023; ABS Disability Survey 2022",
  },
  {
    id: "women_children_safety",
    label: "Women/Children Fleeing Violence — Housing Access",
    value: "38% housed",
    numeric: 38,
    benchmark: "Target: immediate housing within 7 days",
    rating: "Lagging",
    trend: "improving",
    detail: "Only 38% of women and children fleeing family violence who present to SHS receive immediate housing assistance. The remaining 62% are redirected to crisis accommodation (shelters) or returned to the same address. HAFF Round 1 prioritised this cohort — 17% of funded homes are for women's safety housing.",
    source: "AIHW SHS Annual Report 2022-23; ANROWS research 2023",
  },
  {
    id: "livable_housing",
    label: "Livable Housing Silver Compliance",
    value: "~9%",
    numeric: 9,
    benchmark: "100% of HAFF-funded new builds (mandatory)",
    rating: "Lagging",
    trend: "improving",
    detail: "Only 9% of current social housing meets the Silver Livable Housing Design standard — meaning 91% of existing stock is inaccessible to the 31% of tenants with mobility or disability needs. The compliance gap is estimated at $2.8B nationally to bring all stock to Silver.",
    source: "HIVE Livable Housing Intelligence 2026 (AHURI, AIHW, state HA data)",
  },
  {
    id: "social_roi",
    label: "Cross-Portfolio Social ROI",
    value: "$1.70 saved per $1 invested",
    numeric: 1.70,
    benchmark: "Positive social return — investment not cost",
    rating: "Leader",
    trend: "improving",
    detail: "Every dollar invested in social housing generates $1.70 in savings across the health, justice, child protection, welfare, and emergency accommodation systems. This makes social housing investment fiscally positive — a fact consistently underweighted in budget deliberations.",
    source: "AHURI Final Report No. 338 (2020); Victorian DHHS (2021); Productivity Commission (2022)",
  },
]

// ── G — Governance ────────────────────────────────────────────────────────────

export interface GovernanceMetric {
  id: string
  label: string
  value: string
  numeric: number
  benchmark: string
  rating: ESGRating
  trend: "improving" | "static" | "worsening"
  detail: string
  source: string
}

export const GOVERNANCE_METRICS: GovernanceMetric[] = [
  {
    // NOTE (2026-07): 94% is a HIVE estimate of overall registration compliance and was NOT
    // independently confirmed in the NRSCH 2024 financial report. What IS verified: NRSCH's
    // financial-benchmark compliance by ratio ranges 55–92% (Gearing 92 · EBITDA 73 · ICR 68 ·
    // Working Capital 61 · Op. Cashflow 55). Value kept but reframed + sourced honestly.
    id: "nhr_compliance",
    label: "Regulatory Compliance (NRSCH)",
    value: "~94%",
    numeric: 94,
    benchmark: "100% (all registered CHPs must maintain compliance)",
    rating: "Adequate",
    trend: "static",
    detail: "Overall registration compliance is estimated at ~94% of NRSCH-registered CHPs (HIVE estimate — regulators report 'no significant instances of non-compliance', but no single national compliance rate is published). Verified from the NRSCH 2024 Sector Financial Performance Report: compliance with individual financial benchmarks ranges 55–92% by ratio — Gearing 92%, Operating EBITDA 73%, Interest Cover 68%, Working Capital 61%, Operating Cashflow Adequacy 55%. Non-compliance concentrates in smaller Tier 3 providers.",
    source: "NRSCH Sector Financial Performance Report 2023-24; state Registrar Sector Performance Reports 2024",
  },
  {
    // CORRECTED 2026-07 (NRSCH Sector Financial Performance Report 2024): prior 52% (benchmark
    // ≤65%) was NOT from a primary source and overstated leverage ~3.5×. NRSCH national result:
    // Tier 1 gearing 14.6% (down from 16.1%), Tier 2 4.5%; regulator benchmark is 30% (not 65%);
    // 92% of CHPs within benchmark. Sector is far less leveraged than HIVE previously implied.
    id: "financial_gearing",
    label: "Sector Gearing (Tier 1, Debt/Assets)",
    value: "14.6%",
    numeric: 14.6,
    benchmark: "NRSCH benchmark: ≤30% · 92% of CHPs compliant",
    rating: "Adequate",
    trend: "improving",
    detail: "NRSCH national result: Tier 1 CHP gearing is 14.6% (down from 16.1% the prior year), Tier 2 just 4.5% — well below the regulator's 30% benchmark, with 92% of CHPs compliant. The sector carries modest leverage: rising gearing among larger CHPs reflects deliberate use of debt to fund development pipelines (a sign of maturity, per the Registrars), not distress. This corrects a prior HIVE figure of 52% that was not traceable to a primary source and overstated leverage ~3.5×.",
    source: "NRSCH Sector Financial Performance Report 2023-24 (Gearing Ratio, national result)",
  },
  {
    // CORRECTED + RELABELLED 2026-07 (NRSCH 2024): NRSCH does not publish a pure DSCR. HIVE's
    // "1.38× DSCR" was not from a primary source. The regulator's debt-serviceability metric is
    // the Interest Cover Ratio (EBITDA/interest): Tier 1 5.85× (down from 7.49×), Tier 2 5.01×;
    // benchmark 1.5×; 68% of CHPs above benchmark. Serviceability is far stronger than 1.38×.
    id: "interest_coverage",
    label: "Sector Interest Cover Ratio (Tier 1)",
    value: "5.85×",
    numeric: 5.85,
    benchmark: "NRSCH benchmark: ≥1.5× · 68% of CHPs compliant",
    rating: "Adequate",
    trend: "worsening",
    detail: "NRSCH national result: Tier 1 CHPs cover interest 5.85× from operating earnings (EBITDA/interest), Tier 2 5.01× — comfortably above the regulator's 1.5× benchmark, though down from 7.49× the prior year as rates rose. 68% of CHPs sit above benchmark, so a third of (mostly smaller) providers run tighter cover. This replaces a prior HIVE '1.38× DSCR' figure that was not from a primary source; NRSCH publishes Interest Cover, not a pure debt-service-coverage ratio.",
    source: "NRSCH Sector Financial Performance Report 2023-24 (Interest Cover Ratio, national result)",
  },
  {
    // Added 2026-07 from NRSCH 2024 dashboard (primary source, fully verified).
    id: "ebitda_margin",
    label: "Operating EBITDA Margin (Tier 1)",
    value: "18.7%",
    numeric: 18.7,
    benchmark: "NRSCH benchmark: Tier 1 ≥8% · Tier 2 ≥3% · 73% of CHPs compliant",
    rating: "Adequate",
    trend: "static",
    detail: "NRSCH national result: Tier 1 CHPs run an 18.7% operating EBITDA margin (19.1% prior year), Tier 2 8.6% (up from 7.6%) — both well above the regulator's profitability benchmarks (8% / 3%). 73% of CHPs are above benchmark, so profitability is sound sector-wide; the 27% below are concentrated in smaller providers with thin operating surpluses.",
    source: "NRSCH Sector Financial Performance Report 2023-24 (Operating EBITDA Margin, national result)",
  },
  {
    // Added 2026-07 from NRSCH 2024 dashboard (primary source, fully verified).
    id: "working_capital",
    label: "Working Capital Ratio (Tier 1)",
    value: "2.12",
    numeric: 2.12,
    benchmark: "NRSCH benchmark: ≥1.5 · 61% of CHPs compliant",
    rating: "Adequate",
    trend: "worsening",
    detail: "NRSCH national result: Tier 1 CHPs hold $2.12 of current assets per $1 of current liabilities (down from 2.55), Tier 2 1.76 — above the regulator's 1.5 liquidity benchmark. But only 61% of CHPs are compliant, and the ratio is trending down as maturing CHPs run leaner liquidity buffers, so 39% now sit below the short-term-obligations threshold.",
    source: "NRSCH Sector Financial Performance Report 2023-24 (Working Capital Ratio, national result)",
  },
  {
    // Added 2026-07 from NRSCH 2024 dashboard — sector's weakest financial metric (55% compliant).
    id: "operating_cashflow",
    label: "Operating Cashflow Adequacy (Tier 1)",
    value: "1.21",
    numeric: 1.21,
    benchmark: "NRSCH benchmark: Tier 1 ≥1.2 · Tier 2 ≥1.05 · only 55% of CHPs compliant",
    rating: "Below Average",
    trend: "worsening",
    detail: "NRSCH national result: Tier 1 operating cashflow adequacy is 1.21 (down from 1.25) — barely above its 1.2 benchmark — while Tier 2 is 1.04, just below its 1.05 benchmark. This is the sector's weakest financial metric: only 55% of CHPs are compliant and it is trending down. The Registrars flag it as a watch item, though not yet a viability concern, as CHPs run tighter cash buffers to fund growth.",
    source: "NRSCH Sector Financial Performance Report 2023-24 (Operating Cashflow Adequacy, national result)",
  },
  {
    id: "board_independence",
    label: "Board Independence Rate",
    value: "~62%",
    numeric: 62,
    benchmark: "AICD guidelines: minimum 50% independent directors",
    rating: "Adequate",
    trend: "improving",
    detail: "The sector average board independence rate of 62% meets the AICD 50% guideline. Tier 1 CHPs average 71% independence — significantly better than the sector average. Small community-based providers (Tier 3) average 38%, driven by founder-director models and limited board succession planning.",
    source: "CHIA Sector Governance Survey 2023; AICD Not-for-Profit Governance Index",
  },
  {
    id: "haff_covenant",
    label: "HAFF Covenant Compliance Rate",
    value: "~88%",
    numeric: 88,
    benchmark: "100% — non-compliance triggers clawback",
    rating: "Adequate",
    trend: "static",
    detail: "88% of HAFF-contracted projects are tracking toward full covenant compliance (LHD, energy, delivery timeline). The 12% at-risk rate includes projects with construction cost overruns, program design changes, and a small number with LHD compliance issues identified during construction inspection.",
    source: "Housing Australia Annual Report 2024-25 (internal covenant monitoring data)",
  },
  {
    id: "reporting_quality",
    label: "Annual Report Publication & Quality",
    value: "~71%",
    numeric: 71,
    benchmark: "100% of Tier 1-2 CHPs should publish audited reports",
    rating: "Below Average",
    trend: "improving",
    detail: "71% of Tier 1 and Tier 2 CHPs publish annual reports meeting minimum quality standards. The 29% gap includes late filing, incomplete financials, and missing social impact reporting. Only 18% of Tier 1 CHPs publish reporting that meets international impact reporting standards (IRIS+/GRI).",
    source: "CHIA Sector Transparency Index 2023; individual CHP annual reports",
  },
  {
    id: "whistleblower",
    label: "Whistleblower / Safeguarding Policies",
    value: "~68% have policy",
    numeric: 68,
    benchmark: "100% — required for HAFF eligibility",
    rating: "Below Average",
    trend: "improving",
    detail: "68% of Tier 1-2 CHPs have documented whistleblower protection and safeguarding policies. HAFF Round 3 introduced a mandatory requirement — bringing this to near-100% for organisations seeking HAFF funding. The 32% gap is primarily in Tier 2 and Tier 3.",
    source: "Housing Australia HAFF compliance requirements; CHIA governance survey 2023",
  },
  {
    id: "esg_reporting",
    label: "Formal ESG / Impact Reporting",
    value: "~12%",
    numeric: 12,
    benchmark: "Target: 100% Tier 1 by 2028 (Housing Australia trajectory)",
    rating: "Lagging",
    trend: "improving",
    detail: "~12% of CHPs formally report ESG/impact — CHIA's voluntary ESG Reporting Standard (launched Mar 2023) had 20+ early adopters of 166 full members as at Apr 2024. Corrected from 18% (NotebookLM re-check vs CHIA). Housing Australia green-bond and sustainability-linked-loan covenants are now driving uptake.",
    source: "CHIA ESG Reporting Standard / Sector data 2024 (20+ of 166 members)",
  },
]

// ── ESG Scoring framework ─────────────────────────────────────────────────────

export interface ESGScoreCard {
  pillar: ESGPillar
  score: number          // 0-100
  rating: ESGRating
  key_strength: string
  key_gap: string
  trend: "improving" | "static" | "worsening"
  haff_relevance: string
}

export const SECTOR_ESG_SCORES: ESGScoreCard[] = [
  {
    pillar: "Environmental",
    score: 32,
    rating: "Lagging",
    key_strength: "Strong new build pipeline — 79% of HAFF-funded homes at 7-star+. Round 3 no-gas rule locks in electrification pathway.",
    key_gap: "Existing stock at 2.9-star average. 42% below 3-star. 38% of tenants in energy poverty. <2% green certified. Carbon intensity 2.8× national average.",
    trend: "improving",
    haff_relevance: "HAFF Round 3 scores applications on energy performance. 8-star proposals get additional points. No-gas requirement now mandatory.",
  },
  {
    pillar: "Social",
    score: 48,
    rating: "Below Average",
    key_strength: "Social ROI of $1.70/$1 invested. Strong prioritisation of family violence, First Nations, disability housing in HAFF pipeline. SHS crisis support scale.",
    key_gap: "~49% of SHS clients needing accommodation don't receive it. 4.2-year average wait time. 91% of stock fails Livable Housing Silver. Women's housing access only 38%.",
    trend: "improving",
    haff_relevance: "HAFF prioritises women's safety, First Nations, disability housing. Scoring favours applications with demonstrated social impact measurement frameworks.",
  },
  {
    pillar: "Governance",
    score: 56,
    rating: "Adequate",
    key_strength: "Strong balance sheets: Tier 1 gearing just 14.6% (benchmark ≤30%), interest cover 5.85× (benchmark 1.5×). Tier 1 board independence 71%. Financial sustainability sound at sector level per NRSCH.",
    key_gap: "Only ~12% produce formal ESG reports. 32% lack whistleblower policies. A tail of (mostly smaller Tier 3) providers sits below financial benchmarks — Op. Cashflow Adequacy compliance is only 55%. Interest cover has eased from 7.49× to 5.85× under rate pressure.",
    trend: "static",
    haff_relevance: "Round 3 requires mandatory whistleblower and safeguarding policies. ESG reporting increasingly embedded in green bond covenants. Board governance quality factored in assessment.",
  },
]

export const SECTOR_COMPOSITE_SCORE = Math.round(
  SECTOR_ESG_SCORES.reduce((s, r) => s + r.score, 0) / SECTOR_ESG_SCORES.length
)

// ── Investment lens ───────────────────────────────────────────────────────────

export interface InvestmentESGUseCase {
  investor_type: string
  icon: string
  how_they_use_esg: string[]
  key_metrics: string[]
  esg_gap_risk: string
}

export const INVESTMENT_USE_CASES: InvestmentESGUseCase[] = [
  {
    investor_type: "Housing Australia / NHFIC",
    icon: "🏛",
    how_they_use_esg: [
      "HAFF application scoring weights LHD, energy and social impact",
      "Sustainability-linked loan covenants require ESG covenant reporting",
      "Green bond programme requires post-issuance environmental performance reporting",
    ],
    key_metrics: ["NatHERS star rating", "LHD tier compliance", "Social impact framework quality"],
    esg_gap_risk: "CHPs without structured ESG reporting increasingly disadvantaged in competitive rounds. Round 3 scoring rewards ESG quality explicitly.",
  },
  {
    investor_type: "Institutional Impact Investors",
    icon: "📊",
    how_they_use_esg: [
      "ESG screening before considering investment in CHP bonds or equity",
      "GRESB Real Assets benchmark used for portfolio comparison",
      "Paris-aligned portfolio requirements mean high-carbon assets are excluded",
    ],
    key_metrics: ["Carbon intensity per dwelling", "GRESB score", "Social outcome measurement (SROI)"],
    esg_gap_risk: "CHPs with no ESG reporting are invisible to impact capital pools that now exceed $150B in Australia. First-mover advantage for CHPs that report early.",
  },
  {
    investor_type: "Green Bond Market",
    icon: "🌱",
    how_they_use_esg: [
      "Use of proceeds must be certified as 'green' — social housing qualifies under ICMA taxonomy",
      "Requires pre-issuance framework with environmental criteria",
      "Annual post-issuance reporting on energy performance, carbon avoidance",
    ],
    key_metrics: ["Average NatHERS of funded portfolio", "kWh/m² operational intensity", "Carbon intensity trend"],
    esg_gap_risk: "Green bond pricing advantage (5-15bps cheaper than vanilla bonds) only available to CHPs with documented environmental framework. Currently only CHL and Housing Choices have issued green bonds.",
  },
  {
    investor_type: "State Government Partners",
    icon: "🏘",
    how_they_use_esg: [
      "Land and asset transfer programmes increasingly require ESG performance commitments",
      "Net Zero government commitments require ESG data from housing delivery partners",
      "Social value frameworks in procurement score ESG quality",
    ],
    key_metrics: ["Social Value score", "Net Zero alignment", "Governance quality (NHR tier + board independence)"],
    esg_gap_risk: "States are embedding ESG requirements into housing partnership agreements. CHPs without reporting capability risk exclusion from preferred partner lists.",
  },
  {
    investor_type: "Insurance Market",
    icon: "🛡",
    how_they_use_esg: [
      "Climate risk in portfolio (E) increasingly drives premium loading and availability",
      "Well-governed CHPs (G) get better terms on D&O, asset, and liability policies",
      "ESG data increasingly used to differentiate risk quality in NFP insurance",
    ],
    key_metrics: ["% of portfolio in high climate risk zones", "Building condition and energy rating", "Governance compliance"],
    esg_gap_risk: "CHPs in high climate risk zones (North QLD, Northern Rivers) face insurance withdrawal. ESG-embedded climate risk management is becoming a prerequisite for continued insurability.",
  },
]

// ── ESG maturity model ────────────────────────────────────────────────────────

export interface ESGMaturityLevel {
  level: number
  name: string
  color: string
  description: string
  typical_chp: string
  key_actions: string[]
  haff_implication: string
}

export const ESG_MATURITY_LEVELS: ESGMaturityLevel[] = [
  {
    level: 1, name: "Unaware", color: "#c0614a",
    description: "No structured ESG awareness or reporting. Compliance is reactive. Risk exposure not quantified.",
    typical_chp: "Small Tier 2-3 providers, founder-led organisations, no dedicated governance staff",
    key_actions: ["Complete NHR compliance", "Implement whistleblower policy", "Commission basic energy audit"],
    haff_implication: "At risk of non-compliance with Round 3 mandatory requirements. Unlikely to score competitively on ESG-weighted criteria.",
  },
  {
    level: 2, name: "Compliant", color: "#c49a3a",
    description: "Meets minimum regulatory requirements. ESG considered as compliance not strategy. Limited reporting.",
    typical_chp: "Mid-size Tier 2, board has basic governance, annual reports published, no impact framework",
    key_actions: ["Develop impact measurement framework", "Commission NatHERS audit of top 20% of portfolio", "Board ESG training"],
    haff_implication: "Meets HAFF minimum requirements. Limited ability to compete for specialist streams requiring Gold LHD or energy scoring.",
  },
  {
    level: 3, name: "Managed", color: "#4d7fb5",
    description: "ESG integrated into strategy. Annual ESG reporting. Measurable targets set. Active risk management.",
    typical_chp: "Larger Tier 2 / smaller Tier 1, dedicated sustainability role, published social impact report",
    key_actions: ["Set Science-Based carbon reduction target", "Integrate LHD compliance into asset strategy", "Publish GRESB-aligned ESG report"],
    haff_implication: "Competitive in most HAFF streams. Can access sustainability-linked NHFIC lending. Green bond issuance feasible.",
  },
  {
    level: 4, name: "Leading", color: "#5aad8a",
    description: "ESG embedded in investment and operational decisions. Externally verified reporting. Innovation in impact measurement.",
    typical_chp: "CHL, Housing Choices, SGCH — Tier 1 with dedicated ESG team, green bond issued, GRESB participant",
    key_actions: ["Net Zero commitment with verified pathway", "GRESB Real Assets submission", "Align with TCFD climate disclosure"],
    haff_implication: "Top-tier HAFF applicant. Green bond premium access. Preferred partner status for state government land programmes. Access to impact capital pools.",
  },
]
