/**
 * Housing Need — Who Needs Housing & Why
 * Deep demographic analysis of Australian housing demand cohorts.
 *
 * Sources:
 *   ABS Census 2021 (household composition, tenure, homelessness)
 *   ABS Survey of Income and Housing 2021-22 (rental stress by quintile)
 *   AIHW Specialist Homelessness Services 2022-23 (client profile)
 *   AHURI — Estimating Core Housing Need (2023)
 *   Productivity Commission Report on Housing (2024)
 *   National Housing Supply and Affordability Council (NHSAC) 2024
 *   CoreLogic / PropTrack rental data 2024
 *   DSS / AIHW People with Disability in Australia 2023
 *   AIHW Aboriginal and Torres Strait Islander people: housing 2024
 *   ANROWS — Domestic Violence & Homelessness Research 2023
 */

// ── Household Composition ─────────────────────────────────────
export interface HouseholdTypeRecord {
  label: string
  pct: number
  count_m: number   // millions of households
  color: string
  note: string
}

export const HOUSEHOLD_TYPES: HouseholdTypeRecord[] = [
  { label: "Couple with children", pct: 31.0, count_m: 3.38, color: "#4d7fb5", note: "Most stable tenure — majority owner-occupiers" },
  { label: "Couple, no children",  pct: 28.0, count_m: 3.05, color: "#5aad8a", note: "Highest rate of outright ownership (42%)" },
  { label: "Lone person",          pct: 27.0, count_m: 2.94, color: "#f6c90e", note: "Fastest-growing type — 23% (2006) → 27% (2021)" },
  { label: "Single parent",        pct: 11.0, count_m: 1.20, color: "#c0614a", note: "82% female-headed; highest rental stress rate" },
  { label: "Other household",      pct:  3.0, count_m: 0.33, color: "#6b8aa0", note: "Group households, multi-generational, etc." },
]

// ── Tenure Type ───────────────────────────────────────────────
export interface TenureRecord {
  label: string
  pct: number
  color: string
  stress_note: string
}

export const TENURE_TYPES: TenureRecord[] = [
  { label: "Owner — no mortgage", pct: 31, color: "#5aad8a", stress_note: "Lowest housing cost burden" },
  { label: "Owner — with mortgage", pct: 35, color: "#4d7fb5", stress_note: "Rate-sensitive; ~15% in mortgage stress" },
  { label: "Private renter", pct: 26, color: "#c49a3a", stress_note: "Primary at-risk population — 1 in 3 in stress" },
  { label: "Social housing", pct:  4, color: "#6b8aa0", stress_note: "Capped at income-based rent; waitlist ~165,500 (AIHW Housing Assistance 2025, Jun-2024: 159,100 public + 6,400 SOMIH; community housing mostly on integrated/unreported lists; ~188k on 2022 basis). Was 213k." },
  { label: "Other / not stated", pct: 4, color: "#555", stress_note: "Includes rent-free, boarding, not stated" },
]

// ── Rental Stress by Income Quintile ─────────────────────────
export interface RentalStressRecord {
  quintile: string
  label: string
  median_income_k: number    // $k/year
  affordable_rent_pw: number // 30% rule, per week
  median_market_rent_pw: number
  stress_pct: number         // % of renters in stress (>30%)
  severe_stress_pct: number  // % of renters in severe stress (>50%)
  color: string
}

export const RENTAL_STRESS_BY_QUINTILE: RentalStressRecord[] = [
  {
    quintile: "Q1", label: "Bottom 20%",
    median_income_k: 25, affordable_rent_pw: 144, median_market_rent_pw: 600,
    stress_pct: 83, severe_stress_pct: 68,
    color: "#c0614a",
  },
  {
    quintile: "Q2", label: "20th–40th percentile",
    median_income_k: 45, affordable_rent_pw: 260, median_market_rent_pw: 600,
    stress_pct: 55, severe_stress_pct: 24,
    color: "#e67e22",
  },
  {
    quintile: "Q3", label: "40th–60th percentile",
    median_income_k: 72, affordable_rent_pw: 415, median_market_rent_pw: 600,
    stress_pct: 18, severe_stress_pct: 6,
    color: "#c49a3a",
  },
  {
    quintile: "Q4", label: "60th–80th percentile",
    median_income_k: 105, affordable_rent_pw: 606, median_market_rent_pw: 600,
    stress_pct: 5, severe_stress_pct: 1,
    color: "#5aad8a",
  },
  {
    quintile: "Q5", label: "Top 20%",
    median_income_k: 175, affordable_rent_pw: 1010, median_market_rent_pw: 600,
    stress_pct: 2, severe_stress_pct: 0,
    color: "#5aad8a",
  },
]

// ── National Stress Aggregates ────────────────────────────────
export const STRESS_SUMMARY = {
  total_renter_households: 3_120_000,
  in_rental_stress: 1_310_000,        // >30% income on rent — ABS Census 2021 basis (SIH 2023-24 withdrawn by ABS Jul 2025)
  in_severe_rental_stress: 640_000,   // >50% income on rent — ABS Census 2021 basis
  core_housing_need_ahuri: 640_000,   // AHURI/City Futures 2022 (2021 Census); rises to ~940k by 2041. (was 740k)
  median_market_rent_pw_2024: 600,    // capital city median, PropTrack 2024
  median_renter_income_k: 65,         // ABS SIH 2021-22 adjusted
  cra_max_single_pw: 110,             // CRA single max ≈ $110/wk. Confirmed: Services Australia $215.40/fortnight = $107.70/wk (single, no children, from 20 Mar 2026); Shelter WA Table 3 used $110. Was 94 (2024).
  rent_increase_since_2019_pct: 35,   // PropTrack / CoreLogic
}

// ── Vulnerable Cohorts ────────────────────────────────────────
export interface VulnerableCohort {
  id: string
  icon: string
  label: string
  color: string
  scale: string
  population: string
  waitlist_share_pct: number | null
  key_facts: string[]
  what_they_need: string[]
  why_market_fails: string
  hive_signal: string
}

export const VULNERABLE_COHORTS: VulnerableCohort[] = [
  {
    id: "lone-person",
    icon: "🧍",
    label: "Lone-Person Households",
    color: "#f6c90e",
    scale: "2.94M households",
    population: "27% of all Australian households",
    waitlist_share_pct: 52,
    key_facts: [
      "Fastest-growing household type — up from 23% in 2006 to 27% in 2021",
      "52–55% of social housing waitlists across all states",
      "Median income significantly below couple households; disproportionately renting",
      "Many are working-age adults priced out of ownership and increasingly unable to afford private rent",
      "Ageing dimension: growing share of lone-person households are 65+, on fixed incomes",
    ],
    what_they_need: [
      "1-bedroom apartments and studios — not houses",
      "Inner and middle-ring locations: near transport, employment, services",
      "Security of tenure — not 12-month rolling leases with rent review risk",
      "Accessible design where the occupant is ageing (Level 2 Livable Housing)",
    ],
    why_market_fails: "The private market builds almost exclusively for families and couples. Studios and 1BR units are built for investors, not renters: they command premium rents per square metre, are concentrated in high-rise towers with poor accessibility, and offer no tenure security. A lone person on $45,000/year can afford $260/week — the median market rent is $600.",
    hive_signal: "Every lone-person household without secure housing is a confirmed social housing candidate. The 2.94M figure is a demand pipeline — CHPs that build 1BR accessible units in established suburbs are solving for the dominant unmet need.",
  },
  {
    id: "single-parent",
    icon: "👩‍👧",
    label: "Single-Parent Families",
    color: "#c0614a",
    scale: "1.1M households",
    population: "11% of all households — 82% female-headed",
    waitlist_share_pct: 23,
    key_facts: [
      "82% of single-parent households are headed by women",
      "43% of women presenting to SHS services cite domestic violence as primary reason",
      "DV is the #1 cause of women and children losing stable housing",
      "23% of social housing waitlists nationally",
      "Many carry the triple burden: sole income earner, primary carer, housing insecure",
      "Children's schooling disruption compounds disadvantage when forced to move repeatedly",
    ],
    what_they_need: [
      "2–3 bedroom dwellings (enough for children to sleep separately)",
      "Proximity to primary and secondary schools — often the binding constraint on location",
      "Near public transport and affordable childcare/services",
      "Safety: secure entry, well-lit common areas, known neighbours",
      "DV-specific pathways: crisis accommodation → transitional housing → permanent tenancy",
    ],
    why_market_fails: "The private rental market offers no safety — landlords can refuse, lease end with 90 days notice, and rent increases can force moves. A single mother fleeing DV needs a tenancy that cannot be arbitrarily ended. She also needs affordability: with a sole parenting income (~$40k/year Centrelink + part-time work), the maximum affordable rent is ~$230/week — less than half the market median for a 2BR.",
    hive_signal: "DV-related demand is permanent and acute. Women and children leaving DV are the fastest-moving segment of SHS demand. CHPs with transitional housing linked to DV services consistently achieve better long-term outcomes than generic allocations.",
  },
  {
    id: "aged",
    icon: "👴",
    label: "Older Australians (65+)",
    color: "#4d7fb5",
    scale: "4.2M people — 17% of population",
    population: "Growing to 23% of population by 2041",
    waitlist_share_pct: 12,
    key_facts: [
      "17% of the population is now 65+ — growing to 23% by 2041 (ABS projections)",
      "The 'ageing renter' cohort: those who never achieved home ownership, now on fixed incomes",
      "10–13% of social housing waitlists are aged applicants — a share that will grow structurally",
      "70% of older Australians prefer to age in place rather than enter residential aged care",
      "Only 5% of rental housing meets basic accessibility standards (Livable Housing Level 2)",
      "Aged pension: ~$27,600/year for a single person — affordable rent = $159/week",
    ],
    what_they_need: [
      "1–2 bedroom dwellings — smaller is better (lower maintenance, lower cost)",
      "Accessible design: step-free entry, wider doorways, accessible bathroom (Livable Housing Level 2+)",
      "Ground-floor or lift access — stairs become a safety hazard",
      "Within 800m of public transport and 2km of primary healthcare",
      "Proximity to social connection — isolation is a health risk equal to smoking 15 cigarettes/day",
    ],
    why_market_fails: "The private market builds inaccessibly — 97% of new housing has no accessibility features. An aged pensioner paying market rent ($600/week) would spend 163% of their income on housing. The mismatch between fixed income and market rent is total. Aged care residential entry costs $500k+. For renters who never owned, there is no asset to fund aged care entry — they need affordable, accessible community housing.",
    hive_signal: "The ageing renter pipeline is 15–20 years of structural demand. Every year that passes without accessible social housing for this cohort adds to the crisis. CHPs building to Livable Housing Level 2 standard are future-proofing their stock and solving for the fastest-growing segment.",
  },
  {
    id: "disability",
    icon: "♿",
    label: "People with Disability",
    color: "#6b8aa0",
    scale: "4.4M Australians",
    population: "18% of the population — most are not NDIS participants",
    waitlist_share_pct: null,
    key_facts: [
      "18% of Australians (4.4M people) have some form of disability",
      "Only 3% of Australian housing stock is fully accessible",
      "42% of SHS clients have a disability — massively over-represented relative to their 18% population share",
      "NDIS SDA-eligible participants: ~28,000 nationally — but only 17,000 enrolled in SDA",
      "The 200,000+ with disability NOT in the NDIS are the invisible cohort: in housing stress in private rentals or inappropriate social housing",
      "Disability intersects with every other cohort: 35% of SHS clients who are aged have a disability",
    ],
    what_they_need: [
      "Accessible design: step-free, wider doors, turning circles, accessible wet areas",
      "SDA for those with extreme functional impairment and high support needs",
      "For the broader disability cohort: Livable Housing Level 2 (Silver) minimum",
      "Proximity to NDIS service providers, allied health, community supports",
      "Affordability: many on DSP ($28,600/year) — affordable rent is $165/week",
    ],
    why_market_fails: "The private market does not build accessibly because accessibility costs 2–4% more per dwelling and is not demanded by the majority of buyers. Disabled renters face a double bind: inaccessible stock forces them into unsuitable dwellings, and their income (DSP) prices them out of any suitable alternative. Only purpose-built or substantially modified social housing solves this.",
    hive_signal: "The SDA market is the high-visibility end of disability housing — but the broader disability cohort is 200x larger and almost entirely unserved by purpose-designed stock. Universal design in mainstream social housing is not a cost — it is the only way to avoid decommissioning stock 10 years early as tenants age and become mobility-impaired.",
  },
  {
    id: "first-nations",
    icon: "🪃",
    label: "First Nations Australians",
    color: "#c49a3a",
    scale: "~900,000 people",
    population: "3.5% of population — 25x over-represented in housing need",
    waitlist_share_pct: null,
    key_facts: [
      "25% of First Nations people live in overcrowded dwellings — vs 5% for non-Indigenous Australians",
      "8× more likely to present to SHS services than the general population",
      "3.5× more likely to be counted as homeless on Census night",
      "Remote housing deficit: estimated 5,500+ additional dwellings needed in remote communities",
      "Urban First Nations homelessness is largely invisible — couch-surfing and temporary stays don't show in crisis counts",
      "Self-determination in housing: community-controlled housing organisations (ICHOs) deliver significantly better outcomes than mainstream allocations",
    ],
    what_they_need: [
      "Culturally appropriate design: space for extended family, outdoor living areas, multiple generations",
      "Community-controlled housing (ICHOs) — self-determination is not optional, it is the evidence-based model",
      "Remote: durable, cyclone/flood-resistant construction with climate considerations",
      "Urban: access to cultural services, community connection, proximity to family networks",
      "Pathway housing: from crisis/transitional to secure long-term tenancy with support",
    ],
    why_market_fails: "Private rental and mainstream social housing allocation processes are culturally hostile — application forms, ID requirements, and tenancy databases disadvantage people with interrupted rental histories caused by systemic factors. Geographic isolation eliminates the private market as a solution in remote areas entirely. The waitlist system itself is a barrier: 20+ years to wait means most don't apply.",
    hive_signal: "ICHO partnerships are the most effective delivery model for First Nations housing. CHPs working in partnership with ICHOs — not replacing them — achieve housing stability rates significantly above mainstream alternatives. This is an underutilised development and management partnership opportunity.",
  },
  {
    id: "dv-survivors",
    icon: "🛡️",
    label: "Domestic Violence Survivors",
    color: "#c0614a",
    scale: "150,000+ women & children flee DV each year",
    population: "43% of female SHS presentations cite DV as primary reason",
    waitlist_share_pct: null,
    key_facts: [
      "DV is the #1 cause of homelessness for women and children in Australia",
      "43% of women presenting to SHS services cite DV as their primary reason",
      "SHS agencies report 7 in 10 requests for crisis accommodation cannot be met — beds are full",
      "150,000+ women and children leave DV situations each year in search of safety",
      "Women leaving DV frequently give up safe housing because alternative housing is unavailable",
      "Without a housing exit, crisis accommodation becomes long-term — blocking access for others in crisis",
    ],
    what_they_need: [
      "Crisis accommodation: immediate, safe, women-and-children-only, no paperwork barrier",
      "Transitional housing: 3–12 months to stabilise, access legal support, rebuild safety plans",
      "Long-term tenancy: secure lease, location change possible to avoid perpetrator contact",
      "Linked support: DV case management, legal advocacy, children's services co-located or integrated",
      "Confidential address: perpetrator cannot find them through tenancy records",
    ],
    why_market_fails: "A woman with children fleeing DV has no time for a 6-month application process or a 10-year waitlist. She has no rental history at her current address (it was the perpetrator's), often has financial abuse impacting credit, and may have a tenancy database listing from a joint tenancy the perpetrator damaged. Every private market barrier is amplified in a crisis situation.",
    hive_signal: "DV housing need is acute, recurring, and permanent. Without secure housing exit pathways, DV services cannot rotate women through crisis support effectively. CHPs that maintain dedicated DV-exit tenancy allocations and partner with front-line DV services create a system that actually works. The housing response to DV is the most urgent unmet need in the sector.",
  },
]

// ── SHS Client Profile ────────────────────────────────────────
export interface SHSClientStat {
  label: string
  pct: number
  population_pct: number | null   // population baseline for comparison (null if N/A)
  color: string
  note: string
}

export const SHS_CLIENT_PROFILE: SHSClientStat[] = [
  { label: "Female", pct: 57, population_pct: 50, color: "#c0614a", note: "Women over-represented due to DV as primary presenting reason" },
  { label: "Male", pct: 40, population_pct: 50, color: "#4d7fb5", note: "Primary presenting reason: financial hardship, unemployment" },
  { label: "First Nations", pct: 25, population_pct: 3.5, color: "#c49a3a", note: "7× over-represented relative to population share" },
  { label: "With disability", pct: 42, population_pct: 18, color: "#6b8aa0", note: "More than double population rate of disability" },
  { label: "Aged under 25", pct: 28, population_pct: 25, color: "#5aad8a", note: "Youth disproportionately at risk; family breakdown key driver" },
  { label: "With accompanying children", pct: 45, population_pct: null, color: "#f6c90e", note: "Nearly half of all clients are accompanied by at least one child" },
]

export const SHS_PRESENTING_REASONS = {
  women: [
    { reason: "Domestic / family violence", pct: 43, color: "#c0614a" },
    { reason: "Financial difficulty / unemployment", pct: 22, color: "#c49a3a" },
    { reason: "Housing crisis (eviction, lease end)", pct: 18, color: "#4d7fb5" },
    { reason: "Family / relationship breakdown (non-DV)", pct: 11, color: "#6b8aa0" },
    { reason: "Other", pct: 6, color: "#555" },
  ],
  men: [
    { reason: "Financial difficulty / unemployment", pct: 38, color: "#c49a3a" },
    { reason: "Housing crisis (eviction, lease end)", pct: 24, color: "#4d7fb5" },
    { reason: "Domestic / family violence", pct: 14, color: "#c0614a" },
    { reason: "Mental health / alcohol & other drugs", pct: 15, color: "#6b8aa0" },
    { reason: "Other", pct: 9, color: "#555" },
  ],
}

// ── Typology Mismatch ─────────────────────────────────────────
export interface TypologyMismatchRecord {
  dimension: string
  need: string
  need_pct: number
  supply: string
  supply_pct: number
  gap_note: string
}

export const TYPOLOGY_MISMATCH: TypologyMismatchRecord[] = [
  {
    dimension: "Bedroom size",
    need: "1–2 bedrooms (lone persons + small families)",
    need_pct: 65,
    supply: "3–4 bedroom detached houses",
    supply_pct: 60,
    gap_note: "Market builds family homes; waitlist is dominated by singles and single parents who need smaller dwellings",
  },
  {
    dimension: "Location",
    need: "Inner / middle ring — near transport, services, employment",
    need_pct: 78,
    supply: "Outer suburban greenfield — car-dependent, far from services",
    supply_pct: 65,
    gap_note: "Vulnerable cohorts cannot drive to services; outer suburban supply is structurally inaccessible to them",
  },
  {
    dimension: "Accessibility",
    need: "Step-free, accessible bathroom, wider doors (42% of SHS clients have disability)",
    need_pct: 42,
    supply: "Standard construction with no accessibility features",
    supply_pct: 97,
    gap_note: "97% of new housing has no accessibility features; 42% of those who need housing have a disability",
  },
  {
    dimension: "Tenure security",
    need: "Long-term secure tenancy — certainty of not being displaced",
    need_pct: 95,
    supply: "12-month fixed term, subject to rent review and non-renewal",
    supply_pct: 100,
    gap_note: "Private market offers no security; repeated forced moves are the single biggest barrier to escaping housing stress",
  },
]

// ── Hidden Homelessness ───────────────────────────────────────
export interface HomelessnessLayer {
  label: string
  count: number
  color: string
  visibility: "visible" | "semi-hidden" | "hidden"
  description: string
}

export const HOMELESSNESS_LAYERS: HomelessnessLayer[] = [
  // Exact ABS Census 2021 operational groups (verified 2026-07). Total = 122,494.
  {
    label: "Rough sleeping / improvised dwellings",
    count: 7_636,
    color: "#c0614a",
    visibility: "visible",
    description: "Improvised dwellings, tents or sleeping out — the visible face of homelessness. ABS Census 2021.",
  },
  {
    label: "Supported accommodation for the homeless",
    count: 24_291,
    color: "#e67e22",
    visibility: "visible",
    description: "In SHS-funded/supported accommodation: refuges, shelters, transitional housing. ABS Census 2021.",
  },
  {
    label: "Boarding houses (insecure)",
    count: 22_137,
    color: "#c49a3a",
    visibility: "semi-hidden",
    description: "Boarding house residents without lease rights — can be displaced with little notice. ABS Census 2021.",
  },
  {
    label: "Severely overcrowded dwellings",
    count: 47_895,
    color: "#f6c90e",
    visibility: "semi-hidden",
    description: "Living in 'severely' crowded dwellings (needs 4+ extra bedrooms, ABS CNOS). ABS Census 2021 — the largest single group (39.1%). Concentrated in First Nations communities.",
  },
  {
    label: "Staying temporarily with other households",
    count: 16_597,
    color: "#5aad8a",
    visibility: "semi-hidden",
    description: "Couch-surfing — staying temporarily with friends or family without long-term accommodation. ABS Census 2021. (Plus 3,934 in other temporary lodging.)",
  },
  {
    label: "Hidden homelessness (AHURI estimate)",
    count: 400_000,
    color: "#1a6b3a",
    visibility: "hidden",
    description: "AHURI-estimated total including those in marginal housing situations not captured by Census night methodology. Includes people in temporary rentals, sofa-surfing networks, and those who moved on Census night.",
  },
  {
    label: "Core housing need (AHURI)",
    count: 640_000,
    color: "#0d3320",
    visibility: "hidden",
    description: "AHURI/City Futures 2022 estimate (2021 Census): households in housing that does not meet their needs (suitability, affordability or availability). Rises to ~940,000 by 2041. (was 740k)",
  },
]

export const ABS_CENSUS_HOMELESS_TOTAL = 122_494  // ABS Census 2021 headline count
