/**
 * Funding & Finance Navigator
 * All active mechanisms available to Australian CHPs for social/affordable housing delivery.
 *
 * Sources:
 *   Housing Australia — program guidelines, annual reports 2023-24
 *   Treasury — Budget Papers 2023-24 to 2025-26
 *   State housing authority annual reports and program documentation
 *   NHFIC / Housing Australia Impact Reports
 */

export type FundingType = "grant" | "loan" | "equity" | "tax" | "guarantee"
export type FundingTier = "federal" | "state" | "both"
export type FundingStatus = "active" | "next-round-q3-2025" | "ongoing" | "state-specific" | "announced"

export interface FundingMechanism {
  id: string
  name: string
  short_name: string
  funder: string
  type: FundingType
  tier: FundingTier
  status: FundingStatus
  program_size_m: number            // total committed / available ($M)
  typical_per_dwelling_k: number    // typical $ per home (0 if not applicable)
  rate_pct: number | null           // interest rate % for loans; null for grants/tax
  loan_term_years: number | null
  eligible_borrowers: string[]
  key_conditions: string[]
  stackable_with: string[]          // IDs of mechanisms that can be combined
  best_for: string
  application_window: string
  contact: string
  color: string
}

export const FUNDING_MECHANISMS: FundingMechanism[] = [
  {
    id: "haff",
    name: "Housing Australia Future Fund — Social & Affordable Component",
    short_name: "HAFF",
    funder: "Commonwealth — Housing Australia",
    type: "grant",
    tier: "federal",
    status: "next-round-q3-2025",
    program_size_m: 10_000,        // $10B fund (returns ~$500M/yr available for grants)
    typical_per_dwelling_k: 55,    // HIVE planning floor: est. upfront grant component only. Official R1-2 all-instruments commitment = $14.0B / 18,650 homes ≈ $751k/home over 25 yrs (availability payments + concessional loans + grants). Source: housingaustralia.gov.au
    rate_pct: null,
    loan_term_years: null,
    eligible_borrowers: [
      "Registered community housing providers (Tier 1 & 2 preferred)",
      "State and territory housing authorities",
      "Registered Aboriginal housing organisations",
    ],
    key_conditions: [
      "Dwellings must remain social/affordable for 20 years (covenant)",
      "At least 30% of homes must be social (below-market rent, not affordable)",
      "Priority cohorts: women & children, First Nations, older people at risk",
      "No single provider can receive >25% of a round's funding",
      "Projects must demonstrate planning approval pathway within 18 months",
    ],
    stackable_with: ["ha-loan", "nhif", "state-programs", "btr-tax"],
    best_for: "New mixed-tenure social/affordable projects by established CHPs. Largest single federal grant source.",
    application_window: "Round 4 expected Q3 2025. EOI ~6 weeks; full application ~10 weeks.",
    contact: "Housing Australia — haffenquiries@housingaustralia.gov.au",
    color: "#f6c90e",
  },
  {
    id: "sha",
    name: "Social Housing Accelerator",
    short_name: "SHA",
    funder: "Commonwealth — DSHAC",
    type: "grant",
    tier: "federal",
    status: "active",
    program_size_m: 2_000,
    typical_per_dwelling_k: 200,   // $2B / 10,000 homes = $200k/home (state authority delivery, not CHP)
    rate_pct: null,
    loan_term_years: null,
    eligible_borrowers: [
      "State and territory housing authorities only",
      "NOT directly accessible by CHPs (delivered via state pipeline)",
    ],
    key_conditions: [
      "Administered directly to state housing authorities",
      "Homes must be social (not affordable)",
      "States must match or supplement funding",
      "CHPs can access indirectly via state contracts/subleases",
    ],
    stackable_with: ["ha-loan", "state-programs"],
    best_for: "State housing authority pipeline. CHPs benefit indirectly as managing agents.",
    application_window: "Closed — one-off 2023 allocation. States drawing down.",
    contact: "Via state housing authority (LAHC NSW, Homes Victoria, etc.)",
    color: "#4d7fb5",
  },
  {
    id: "ha-loan",
    name: "Housing Australia Loan Facility (Bond Aggregator)",
    short_name: "HA Loans",
    funder: "Housing Australia (formerly NHFIC)",
    type: "loan",
    tier: "federal",
    status: "ongoing",
    // VERIFIED 2026-07-02 (Round 2 E3, HA Annual Report 2024-25): $5.0B in AHBA loans APPROVED
    // to CHPs since establishment (prior HIVE "6.3B issued" overstated the AHBA-specific figure —
    // likely conflated total HA finance across facilities). Funded via $2.8B of social/
    // sustainability bonds (7 issuances); ~$860M interest savings generated for the CHP sector.
    // HA's overall statutory liability cap: $10B -> $26B (2025-26 Budget).
    program_size_m: 10_000,
    typical_per_dwelling_k: 215,   // blended social/affordable debt capacity at 5.5%, 30yr
    rate_pct: 5.5,                 // approx 2025 rate (AOFM 10yr ~4.4% + ~1.1% HA margin)
    loan_term_years: 30,
    eligible_borrowers: [
      "Registered CHPs — Tier 1 (preferred) and Tier 2",
      "State and territory housing authorities",
      "Aboriginal housing organisations with NHR registration",
    ],
    key_conditions: [
      "Loan must be secured over social/affordable housing assets",
      "DSCR ≥ 1.05 (social housing) or 1.10 (affordable housing)",
      "Minimum loan size: $3M (smaller loans via aggregated facility)",
      "Environmental and accessibility standards required",
      "Annual financial reporting to Housing Australia",
    ],
    stackable_with: ["haff", "nhif", "state-programs", "sha", "btr-tax"],
    best_for: "Senior debt for any social/affordable project. Standard first step in any CHP funding stack.",
    application_window: "Ongoing — applications accepted year-round.",
    contact: "Housing Australia — lending@housingaustralia.gov.au | 1300 200 969",
    color: "#4a90d9",
  },
  {
    id: "nhif",
    name: "National Housing Infrastructure Facility",
    short_name: "NHIF",
    funder: "Housing Australia",
    type: "loan",
    tier: "federal",
    status: "ongoing",
    // CORRECTED 2026-07-02 (Round 2 E1): was $3B - actual is $2B ($1B at 2018 establishment
    // [up to $175M grants + $825M loans/equity] + $1B increase Sep 2023 targeted at crisis &
    // transitional housing). Three limbs: NHIF-CI (enabling infrastructure), NHIF-SAH (social/
    // affordable homes), NHIF-CT (crisis & transitional, launched Nov 2024).
    program_size_m: 2_000,
    typical_per_dwelling_k: 40,    // enables enabling infrastructure; not direct build funding
    rate_pct: 3.5,                 // concessional: below-market; approx 2025
    loan_term_years: 20,
    eligible_borrowers: [
      "State, territory and local governments",
      "Registered CHPs (via infrastructure stream)",
      "Registered housing developers with affordable housing component",
    ],
    key_conditions: [
      "Three limbs: Critical Infrastructure (CI) · Social & Affordable Housing (SAH) · Crisis & Transitional (CT, launched Nov 2024)",
      "CI: enabling infrastructure — water, sewerage, electricity, telecoms, transport, site remediation",
      "SAH: DOES fund new social/affordable rental homes directly (closes the cost-to-rent gap)",
      "CT: short-to-medium-term housing for women & children escaping family violence and at-risk youth",
      "Mix of concessional loans, grants and equity investments",
    ],
    stackable_with: ["haff", "ha-loan", "state-programs"],
    best_for: "Infrastructure-constrained sites (CI), direct social/affordable delivery (SAH), and crisis/transitional projects (CT).",
    application_window: "Ongoing — applications accepted quarterly.",
    contact: "Housing Australia — nhif@housingaustralia.gov.au",
    color: "#6b8aa0",
  },
  {
    id: "state-programs",
    // CORRECTED 2026-07-02 (Round 2 E4): state programs were badly stale. Verified:
    // NSW $6.6B Building Homes for NSW (2024-25 Budget; 8,400 public homes) — was $2.0B.
    // QLD $5.6B Q-CHIP community housing pipeline (2025-26 Budget) — was $1.1B "HISP".
    // WA $3.2B cumulative new investment since 2021-22 (2024-25 Budget) — was $2.4B.
    // VIC $5.3B Big Housing Build ✅ confirmed (Homes Victoria Guidance Note v2.0, May 2024).
    // SA ~$0.4B (A Better Housing Future era; no single headline figure verified — estimate).
    name: "State Housing Programs (VIC Big Housing Build / QLD Q-CHIP / NSW Building Homes for NSW / WA / SA)",
    short_name: "State Programs",
    funder: "State Governments",
    type: "grant",
    tier: "state",
    status: "state-specific",
    program_size_m: 21_100,        // combined: NSW $6.6B + QLD $5.6B + VIC $5.3B + WA $3.2B + SA ~$0.4B
    typical_per_dwelling_k: 150,   // state land + cash contributions; varies by state/project
    rate_pct: null,
    loan_term_years: null,
    eligible_borrowers: [
      "VIC: CHPs as delivery partners under Big Housing Build",
      "QLD: CHPs and state authority via HISP/HIGIA programs",
      "WA: Registered social housing organisations under HHIP",
      "NSW: CHPs under Communities Plus and LAHC asset program",
      "SA: CHPs under SAHT capital delivery program",
    ],
    key_conditions: [
      "Varies by state — refer to individual program guidelines",
      "Land typically provided by state (major contribution to viability)",
      "CHP must have minimum track record and asset base (state specific)",
      "Design standards include accessibility, sustainability ratings",
    ],
    stackable_with: ["haff", "ha-loan", "nhif", "sha"],
    best_for: "Varies by state. Generally for established CHPs with state relationships. Land contribution is often the most valuable component.",
    application_window: "State-specific — check individual program schedules.",
    contact: "LAHC (NSW), Homes Victoria (VIC), QHC (QLD), DPLH (WA), SAHT (SA)",
    color: "#5aad8a",
  },
  {
    id: "btr-tax",
    name: "Build-to-Rent Tax Concession (Managed Investment Trust — Withholding Tax)",
    short_name: "BTR Tax Concession",
    funder: "Commonwealth ATO",
    type: "tax",
    tier: "federal",
    status: "active",
    program_size_m: 0,             // tax concession — no direct program expenditure
    typical_per_dwelling_k: 0,     // depends on fund structure and investor returns
    rate_pct: 15,                  // withholding tax rate (reduced from 30% to 15% for eligible MIT BTR)
    loan_term_years: null,
    eligible_borrowers: [
      "Managed Investment Trusts (MITs) structured as BTR",
      "Requires minimum 10% of homes as affordable (<75% market rent)",
      "Minimum 50-apartment BTR development",
      "Must hold assets for 15 years",
    ],
    key_conditions: [
      "Withholding tax on MIT income distributions reduced from 30% to 15%",
      "Minimum 10% of dwellings must be affordable (below 75% market rent)",
      "15-year minimum holding period",
      "Land and development must be purpose-built (not converted)",
      "Applies to institutional investors (super funds, REITs) not CHPs directly",
    ],
    stackable_with: ["ha-loan", "haff"],
    best_for: "Institutional BTR developers with affordable housing component. CHPs can partner as operator/manager of the affordable dwellings.",
    application_window: "Ongoing — applies at MIT structure establishment.",
    contact: "ATO — specialist advice required for MIT structuring",
    color: "#1abc9c",
  },
  {
    id: "hgs",
    name: "Home Guarantee Scheme (First Home / Regional / Family / Indigenous)",
    short_name: "Home Guarantee Scheme",
    funder: "Housing Australia",
    type: "guarantee",
    tier: "federal",
    status: "ongoing",
    program_size_m: 500,            // government guarantee liability; not direct funding
    typical_per_dwelling_k: 0,      // guarantee allows 5% deposit; no direct subsidy
    rate_pct: null,
    loan_term_years: null,
    eligible_borrowers: [
      "First home buyers (FHBG — 35,000 places/yr)",
      "Single parents with dependent children (FHG — 5,000 places/yr)",
      "Regional first home buyers (RFHBG — 10,000 places/yr)",
      "NOT for CHPs or social housing — homeownership program only",
    ],
    key_conditions: [
      "Income test: singles ≤$125k, couples ≤$200k",
      "Property price caps by state/region",
      "Buyer must occupy property as primary residence",
      "Not applicable to social or affordable rental housing delivery",
    ],
    stackable_with: [],
    best_for: "Moderate-income owner-occupiers only. NOT directly useful for CHP development pipelines.",
    application_window: "Ongoing — via participating lenders.",
    contact: "Housing Australia — homegarantee@housingaustralia.gov.au",
    color: "#6b8aa0",
  },
  {
    id: "housing-support",
    // CORRECTED 2026-07-02 (Round 2 E2, Treasury-verified): the old entry conflated two programs
    // under "Housing Support Program $3B". Actual: New Homes Bonus = $3.0B (performance payments
    // to states exceeding their Accord share) + Housing Support Program = $0.5B (competitive
    // kick-start funding to state/local govs for services, amenities, planning capability).
    // Combined $3.5B endorsed by National Cabinet (Aug 2023).
    name: "National Housing Accord — New Homes Bonus & Housing Support Program",
    short_name: "New Homes Bonus + HSP",
    funder: "Commonwealth",
    type: "grant",
    tier: "both",
    status: "active",
    program_size_m: 3_500,
    typical_per_dwelling_k: 0,      // goes to states/councils for planning/infrastructure; not per-home
    rate_pct: null,
    loan_term_years: null,
    eligible_borrowers: [
      "State and territory governments",
      "Local governments (HSP: competitive; NHB: via state performance)",
      "NOT directly accessible by CHPs",
    ],
    key_conditions: [
      "New Homes Bonus ($3B): performance-based — states paid for exceeding their share of the 1.2M-homes Accord target",
      "Housing Support Program ($500M): competitive activation payments — connecting essential services, amenities, planning capability",
      "CHPs benefit indirectly from faster approvals and better-serviced land",
    ],
    stackable_with: ["haff", "ha-loan", "nhif"],
    best_for: "Systemic: improves planning environment and land supply. CHP teams should monitor for planning reforms that improve feasibility in target areas.",
    application_window: "Distributing 2024–2026. States receiving quarterly payments.",
    contact: "Treasury — National Housing Accord secretariat",
    color: "#e67e22",
  },
]

// ─── Recommended stacks ──────────────────────────────────────────────────────

export interface FundingStack {
  label: string
  description: string
  mechanisms: string[]   // IDs
  typical_gap_k: number  // residual gap per dwelling after this stack ($k)
  best_for: string
  complexity: "low" | "medium" | "high"
  color: string
}

export const RECOMMENDED_STACKS: FundingStack[] = [
  {
    label: "Gold Standard Stack",
    description: "HAFF grant + Housing Australia loan + State program (land or cash). The optimal federal+state combination used by major CHPs.",
    mechanisms: ["haff", "ha-loan", "state-programs"],
    typical_gap_k: 50,
    best_for: "Established Tier 1/2 CHPs with state relationships. Metro projects with state land available.",
    complexity: "high",
    color: "#f6c90e",
  },
  {
    label: "Federal-only Stack",
    description: "HAFF grant + Housing Australia loan. Accessible without state partnership. Common for CHPs building on own land.",
    mechanisms: ["haff", "ha-loan"],
    typical_gap_k: 280,
    best_for: "CHPs with own land or land purchased at concessional rates. 50/50 tenure mix to maximise debt serviceability.",
    complexity: "medium",
    color: "#4d7fb5",
  },
  {
    label: "BTR Affordable Partnership",
    description: "BTR tax concession + Housing Australia loan. Institutional developer leads BTR; CHP operates affordable component.",
    mechanisms: ["btr-tax", "ha-loan"],
    typical_gap_k: 40,
    best_for: "Joint ventures between CHPs and institutional developers. Key worker/affordable housing in metro areas.",
    complexity: "high",
    color: "#1abc9c",
  },
  {
    label: "Infrastructure-led Stack",
    description: "NHIF (infrastructure) + HAFF (construction) + HA loan. For large greenfield sites requiring servicing before build.",
    mechanisms: ["nhif", "haff", "ha-loan"],
    typical_gap_k: 80,
    best_for: "Large-scale community or estate renewal. Sites requiring significant enabling infrastructure investment.",
    complexity: "high",
    color: "#6b8aa0",
  },
]

// ─── Summary stats ────────────────────────────────────────────────────────────

export interface FundingNavigatorSummary {
  total_programs: number
  total_committed_bn: number
  grant_programs: number
  loan_programs: number
  tax_programs: number
}

export function getFundingSummary(): FundingNavigatorSummary {
  const grants = FUNDING_MECHANISMS.filter(m => m.type === "grant")
  const loans  = FUNDING_MECHANISMS.filter(m => m.type === "loan")
  const tax    = FUNDING_MECHANISMS.filter(m => m.type === "tax")
  const totalBn = FUNDING_MECHANISMS
    .filter(m => m.program_size_m > 0)
    .reduce((s, m) => s + m.program_size_m, 0) / 1000

  return {
    total_programs: FUNDING_MECHANISMS.length,
    total_committed_bn: Math.round(totalBn * 10) / 10,
    grant_programs: grants.length,
    loan_programs: loans.length,
    tax_programs: tax.length,
  }
}
