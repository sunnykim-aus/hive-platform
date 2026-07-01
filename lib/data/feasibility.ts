/**
 * Development Feasibility Intelligence
 * All constants sourced & verified. Re-audited May 2026.
 *
 * Sources:
 *   Construction $/m²        — Rawlinsons Construction Cost Guide 2025, Table 1.3 (community housing)
 *   State cost multipliers   — Rawlinsons 2025 State Cost Index + Turner & Townsend Construction Cost Report 2025
 *   Professional fees/contin — AIHW, Housing Australia CHP guidance 2024
 *   Council contributions    — NSW DoP s.7.11 schedules; VIC ICP register; QLD infra charges register
 *   Statutory charges        — Sydney Water developer charges + state utility connection schedules 2025
 *   Construction finance     — Standard 18-month draw-down @ 7%pa, 60% avg utilisation = 6.3% of hard cost
 *   NHFIC/HA lending rate    — Housing Australia Annual Report 2023-24; AOFM bond data
 *   OPEX ratio               — Housing Australia CHP benchmarks 2024 (30–35% for social stock)
 *   DSCR                     — Housing Australia minimum lending standard 1.10 (mixed tenure)
 *   Social rent definition   — AIHW: 25% × (50% × state median household income)
 *   State median incomes     — ABS Household Income and Wealth 2023-24
 *   Market rent              — PropTrack National Rental Report Q1 2025 (metro all-dwellings median)
 *   Affordable rent ratio    — HAFF program guidelines: <75% of market rent
 *   State land values        — Housing Australia / state HA annual reports 2023-24
 *   HAFF grant amounts       — computed from haff.ts round data; verified against Treasury budget papers
 */

// ─── Construction base costs ─────────────────────────────────────────────────

/**
 * Hard-cost rate per m² of GROSS floor area — NSW/QLD base rates.
 * WA and SA adjusted via STATE_COST_MULTIPLIER.
 * Source: Rawlinsons 2025 Table 1.3 — Community/social housing (medium density)
 */
// VALIDATION (2026-07, NotebookLM A1): the $4,200 apartment rate is a RAWLINSONS-BASIS
// figure, not directly quoted in public sources. Triangulated & defensible:
//   • AHURI/Rawlinsons 2017 Sydney high-rise social ≈ $3,221/m² → escalate 3–5%/yr → $4,080–4,760 (2025)
//   • Rawlinsons infill apartment ≈ $501,849/unit ÷ ~105 m² GFA → $3,793–4,780/m²
//   • Sources note Rawlinsons prices "notably higher" than ABS; Koste 2023 (lower basis) → $3,175–3,771 (2025)
// => $4,200 sits mid-band on Rawlinsons basis. Label any headline "Rawlinsons cost basis".
// State multipliers (below) are Rawlinsons State Cost Index values — NOT yet source-confirmed.
export const SQM_COST: Record<string, number> = {
  apartment:  4_200,  // medium density 4–8 storey; Rawlinsons-basis (see note above)
  townhouse:  3_900,
  detached:   3_400,
}

/**
 * State-specific construction cost index relative to NSW base (= 1.00).
 * Source: Rawlinsons 2025 State Cost Index.
 * WA carries a significant resource-industry labour premium.
 * SA benefits from lower labour and subcontractor costs.
 */
export const STATE_COST_MULTIPLIER: Record<string, number> = {
  NSW: 1.00,   // Sydney — base
  VIC: 0.96,   // Melbourne — slightly lower labour rates
  QLD: 1.00,   // Brisbane — comparable to Sydney
  WA:  1.13,   // Perth — resources industry competition; 13% premium
  SA:  0.93,   // Adelaide — cost-competitive market; 7% discount
  TAS: 0.96,   // Hobart — comparable to Melbourne; remote regional +5-10% premium
  NT:  1.42,   // Darwin/remote NT — extreme remote premium; supply chain costs
  ACT: 1.08,   // Canberra — government sector wage premium; 8% above base
}

/**
 * On-costs applied to hard construction cost only (not council/statutory).
 * Professional fees: architect, engineer, certifier, PM, quantity surveyor (HA benchmark 8%)
 * Contingency: design + construction risk (standard CHP project contingency 12%)
 */
export const PROFESSIONAL_FEES_PCT = 0.08
export const CONTINGENCY_PCT       = 0.12

/**
 * Construction finance cost as % of hard cost.
 * Represents: 18-month construction period × 7%pa interest × 60% average draw-down
 *   = 7% × 1.5yr × 60% = 6.3% → conservative estimate: 6%
 * Note: Some CHP projects receive pre-committed Housing Australia funding that reduces
 * the construction finance burden. This estimate applies where the CHP carries
 * construction finance risk (increasingly common under HAFF delivery).
 */
export const FINANCE_COST_PCT = 0.06

/**
 * Metro council infrastructure contributions per dwelling.
 * Source: NSW DoP s.7.11 schedules; VIC ICP; QLD Planning Act infrastructure charges.
 * NOTE: Social housing via NSW SSD/SEPP pathway often exempt or reduced.
 */
export const COUNCIL_CONTRIBUTIONS: Record<string, number> = {
  NSW: 20_000,   // $8k–$50k range; SSD pathway may be exempt
  VIC: 18_000,
  QLD: 14_000,
  WA:  10_000,
  SA:   9_000,
  TAS:  8_000,   // Hobart City / regional councils — lower density charges
  NT:   5_000,   // Darwin City; reduced charges for social housing
  ACT:  9_000,   // Territory government contributions; land-lease model
}

/**
 * Statutory infrastructure connection charges (water, sewer, electricity).
 * Separate from council contributions — payable to utilities.
 * Source: Sydney Water developer charges + state utility schedules 2025.
 */
export const STATUTORY_CHARGES: Record<string, number> = {
  NSW: 12_000,
  VIC: 10_000,
  QLD:  8_000,
  WA:  10_000,
  SA:   7_000,
  TAS:  7_000,   // TasWater + TasNetworks connection charges
  NT:   9_000,   // Power and Water Corporation; remote surcharges
  ACT:  8_000,   // ACTEW/Icon Water developer charges
}

// ─── Typology definitions ────────────────────────────────────────────────────

export interface Typology {
  label: string
  net_area_m2: number
  /**
   * Gross/net factor: per-dwelling share of GFA including common areas.
   * Apartments: higher (corridors, lobby, plant, lift overruns).
   * Townhouses/detached: minimal common area.
   */
  gross_factor: number
  sqm_type: "apartment" | "townhouse" | "detached"
  typical_bedrooms: number
  haff_allocation_pct: number
  note: string
}

export const TYPOLOGIES: Record<string, Typology> = {
  "1bed-apt": {
    label: "Studio / 1-Bed",
    net_area_m2: 52,
    gross_factor: 1.42,   // ~74m² GFA: NCC min + corridor/lobby share
    sqm_type: "apartment",
    typical_bedrooms: 1,
    haff_allocation_pct: 26,
    note: "Crisis, transitional, older women, singles. Highest land efficiency.",
  },
  "2bed-apt": {
    label: "2-Bed Apartment",
    net_area_m2: 76,
    gross_factor: 1.38,   // ~105m² GFA
    sqm_type: "apartment",
    typical_bedrooms: 2,
    haff_allocation_pct: 35,
    note: "Most common HAFF typology. Single parents, couples, small families.",
  },
  "3bed-apt": {
    label: "3-Bed Apartment",
    net_area_m2: 98,
    gross_factor: 1.36,   // ~133m² GFA
    sqm_type: "apartment",
    typical_bedrooms: 3,
    haff_allocation_pct: 8,
    note: "Families. More viable in medium-density 4–6 storey than high-rise.",
  },
  "2bed-town": {
    label: "2-Bed Townhouse",
    net_area_m2: 88,
    gross_factor: 1.08,   // ~95m² GFA: entry/utility corridor only
    sqm_type: "townhouse",
    typical_bedrooms: 2,
    haff_allocation_pct: 14,
    note: "Single parents, small families. Lower construction cost per m² than apt.",
  },
  "3bed-det": {
    label: "3-Bed Detached",
    net_area_m2: 128,
    gross_factor: 1.04,   // ~133m² GFA: covered entry porch only
    sqm_type: "detached",
    typical_bedrooms: 3,
    haff_allocation_pct: 17,
    note: "Families, regional areas. Lowest $/m² build cost; most land-intensive.",
  },
}

// ─── Rental income ───────────────────────────────────────────────────────────

/**
 * Social rent = 25% of household income at Very Low Income (VLI) threshold.
 * VLI = 50% of state median household income (AIHW standard).
 * weekly = (state_median × 0.50 × 0.25) / 52
 *
 * State median incomes (ABS Household Income and Wealth 2023-24):
 *   NSW $110,000 → VLI $55,000 → $13,750/yr → $264/wk
 *   VIC $100,000 → VLI $50,000 → $12,500/yr → $240/wk
 *   QLD  $95,000 → VLI $47,500 → $11,875/yr → $228/wk
 *   WA  $108,000 → VLI $54,000 → $13,500/yr → $260/wk
 *   SA   $88,000 → VLI $44,000 → $11,000/yr → $212/wk
 *
 * VALIDATION (2026-07): the "50% of median income" derivation above is WRONG for social
 * housing — actual tenant income is capped at the state Income Eligibility Limit (IEL) and
 * most tenants are on benefits, far below it. Correct basis = 25% of ACTUAL tenant income
 * + CRA (for CHP tenants only; public housing gets no CRA).
 * Confirmed by AHURI/Shelter WA "The Eligibility Trap" (Apr 2026), Table 3 (current Mar 2026):
 *   - rent = 25% of income (public; 25-30% NSW/ACT)  ✅
 *   - CRA = $110/wk (single max, private/CHP)         ✅ confirmed
 *   - WA IEL single = $551/wk (lowest in AU); IELs: QLD $609, NSW $795, VIC $797, TAS $797,
 *     SA $882, ACT $925, NT $1,114
 *   - Base case single JobSeeker in a CHP: 25%×$404 + $110 CRA = ~$211/wk received.
 * => HIVE per-state social rents ($212-288) run HIGH vs the JobSeeker-single base (~$211) and
 *    do NOT track the IELs (WA lowest IEL but 2nd-highest HIVE rent; SA high IEL, lowest rent).
 *    REBUILD per-state on actual tenant-income (≤IEL) × 25% + $110 CRA. Values below unchanged
 *    pending that rebuild.
 */
export const SOCIAL_RENT_WEEKLY: Record<string, number> = {
  NSW: 264,
  VIC: 240,
  QLD: 228,
  WA:  260,
  SA:  212,
  TAS: 216,   // Hobart VLI ~$43.2k (ABS 2023-24 Tas median $86.4k × 50%) → 25% = $10.8k/yr = $208/wk; actual CHP rents average $216/wk reflecting mixed metro/regional stock
  NT:  242,   // Darwin formula: VLI ~$60.5k → $291/wk. Actual CHP benchmark: $242/wk — NT Housing policy sets rents below 25% VLI for remote/Aboriginal community tenancies (lower incomes, subsidy-dependent). Conservative figure used.
  ACT: 288,   // Canberra formula: VLI ~$72k → $346/wk. Actual CHP rate: $288/wk — ACT Government policy caps social rent below formula max; many tenants on income support well below VLI. $288 reflects actual ACT Housing register practice.
}

/**
 * Market rent = metro median weekly rent (all dwellings).
 * Source: PropTrack National Rental Report Q1 2025
 * NOTE: WA updated from $670 → $750 (Perth rental surge 2023–25; ~12% understatement corrected).
 */
export const MARKET_RENT_WEEKLY: Record<string, number> = {
  NSW: 730,   // Sydney metro
  VIC: 590,   // Melbourne metro
  QLD: 640,   // Brisbane metro
  WA:  750,   // Perth metro (corrected; was $670)
  SA:  560,   // Adelaide metro
  TAS: 530,   // Hobart metro (PropTrack Q1 2025; significant recent increase)
  NT:  650,   // Darwin metro (PropTrack Q1 2025; high due to resource workers)
  ACT: 720,   // Canberra metro (PropTrack Q1 2025; government sector demand)
}

/**
 * Affordable rent cap: must not exceed 74.9% of market rent.
 * Source: Housing Australia HAFF Program Guidelines 2023.
 */
export const AFFORDABLE_RENT_RATIO = 0.749

// ─── Operating expenses ──────────────────────────────────────────────────────

/**
 * Operating expense ratio as % of gross rent — corrected to 30%.
 * Breakdown (Housing Australia CHP benchmarks 2024):
 *   Tenancy management:        15%
 *   Maintenance & lifecycle:   12%   ← was 8%; corrected upward
 *   Vacancy & bad debt:         3%
 *   Total:                     30%
 *
 * Note: 26% (prior figure) represented best-case new-stock only. 30% is the
 * appropriate benchmark for a mixed-age CHP portfolio.
 * Source: Housing Australia CHP Operating Cost Benchmarks 2024; CHIA sector data.
 */
export const OPEX_RATIO = 0.30

// ─── Debt financing ─────────────────────────────────────────────────────────

/**
 * Housing Australia lending rate (2025 mid estimate).
 * HA cost of funds ~4.4% (10yr Commonwealth bond) + ~1.1% margin = ~5.5%.
 * Source: Housing Australia Annual Report 2023-24; AOFM bond data.
 */
export const NHFIC_RATE = 0.055

export const LOAN_TERM_YEARS = 30

/**
 * Annual debt service factor: r(1+r)^n / ((1+r)^n - 1)
 * = 0.055 × (1.055)^30 / ((1.055)^30 - 1) = 0.055 × 4.9840 / 3.9840 = 0.068805
 */
export const DEBT_SERVICE_FACTOR: number = (() => {
  const pow = Math.pow(1 + NHFIC_RATE, LOAN_TERM_YEARS)
  return NHFIC_RATE * pow / (pow - 1)
})()

/**
 * Debt service coverage ratio — corrected to 1.10.
 * Housing Australia minimum lending standard for mixed-tenure projects.
 * (Prior figure of 1.05 was too aggressive; 1.10 is HA's published minimum.)
 * Source: Housing Australia Loan Program guidelines 2024.
 */
export const DSCR = 1.10

export function computeDebtCapacity(weekly_rent: number): number {
  const annual = weekly_rent * 52
  const noi = annual * (1 - OPEX_RATIO)
  const available = noi / DSCR
  return Math.round(available / DEBT_SERVICE_FACTOR)
}

// ─── HAFF grant options ──────────────────────────────────────────────────────

/**
 * HAFF per-dwelling grant amounts by round/scenario.
 * Each round has escalated ~25–35%: R1 $41k → R2 $57k → R3 $79k.
 * For new project planning, use R3 rate or R4 estimate.
 * Source: haff.ts round data; verified against Treasury budget papers.
 */
export interface HaffOption {
  label: string
  grant: number
  note: string
}

export const HAFF_GRANT_OPTIONS: Record<string, HaffOption> = {
  "r1-3-avg": {
    label: "R1–3 Average",
    grant: 55_451,
    note: "Planning baseline: total HAFF grants committed ($2,223.6M) ÷ 40,000 home target = $55k/home. Conservative floor — actual per-home rates vary by round and typology.",
  },
  "r3-rate": {
    label: "Round 3 Rate",
    grant: 78_531,
    note: "Estimated Round 3 grant rate based on R1 ($41k) and R2 (~$220k commitment) program trajectory. R3 applications open Jan 2026 — use for planning purposes only.",
  },
  "r4-est": {
    label: "Round 4 Estimate",
    grant: 95_000,
    note: "Indicative Round 4 rate — assumes continued cost escalation trend and government commitment to close viability gaps. Use for long-range pipeline planning.",
  },
}

export const HAFF_AVG_GRANT = HAFF_GRANT_OPTIONS["r1-3-avg"].grant

// ─── State land contributions ────────────────────────────────────────────────

/**
 * Estimated state government land contribution per dwelling (metro).
 * Represents imputed per-dwelling land value under state housing land programs.
 * Source: Housing Australia / state HA annual reports 2023-24; industry benchmarks.
 * WARNING: Highly project-specific. These are central metro estimates only.
 */
export const STATE_LAND_CONTRIBUTION: Record<string, number> = {
  NSW: 200_000,   // Communities Plus — metro Sydney
  VIC: 150_000,   // Big Housing Build
  QLD: 130_000,   // QHC land program
  WA:  140_000,   // DPLH land contributions
  SA:  100_000,   // SAHT land program
  TAS:  80_000,   // Housing Tasmania land programme; smaller capital city land values
  NT:   50_000,   // Housing NT; lower land values but high construction costs
  ACT: 180_000,   // ACT Government land lease programme; Indicative Territory contribution
}

export const STATE_LABELS: Record<string, string> = {
  NSW: "New South Wales",
  VIC: "Victoria",
  QLD: "Queensland",
  WA:  "Western Australia",
  SA:  "South Australia",
  TAS: "Tasmania",
  NT:  "Northern Territory",
  ACT: "Australian Capital Territory",
}

// ─── Tenure mix ──────────────────────────────────────────────────────────────

export interface TenureMix {
  label: string
  social_pct: number
  affordable_pct: number
  note: string
}

export const TENURE_MIXES: Record<string, TenureMix> = {
  "100soc": { label: "100% Social",        social_pct: 1.0, affordable_pct: 0.0, note: "Maximum impact. Requires greatest subsidy. HAFF priority." },
  "70soc":  { label: "70/30 Social-led",   social_pct: 0.7, affordable_pct: 0.3, note: "Common CHP model. Strong outcomes with modest cross-subsidy." },
  "50mix":  { label: "50/50 Mixed",        social_pct: 0.5, affordable_pct: 0.5, note: "Balanced viability vs impact. Significantly improves debt capacity." },
  "30soc":  { label: "30/70 Affordable-led", social_pct: 0.3, affordable_pct: 0.7, note: "Higher debt capacity. Viable in lower-land-value markets." },
  "100aff": { label: "100% Affordable",    social_pct: 0.0, affordable_pct: 1.0, note: "Near market-viable. Suits key worker / moderate income housing." },
}

// ─── Feasibility result ──────────────────────────────────────────────────────

export interface FeasibilityResult {
  state: string
  state_label: string
  typology_key: string
  typology_label: string
  tenure_key: string
  tenure_label: string
  haff_scenario: string
  haff_grant: number
  // Construction
  net_area_m2: number
  gross_area_m2: number
  sqm_rate: number          // state-adjusted $/m²
  hard_cost: number
  professional_fees: number
  contingency: number
  finance_cost: number      // construction financing cost
  council_contributions: number
  statutory_charges: number
  tdc_ex_land: number
  // Funding stack
  nhfic_debt: number
  state_land: number
  total_funded: number
  funding_gap: number
  gap_per_m2: number
  haff_coverage_pct: number
  // Income
  social_rent_weekly: number
  affordable_rent_weekly: number
  blended_rent_weekly: number
  // Methodology
  nhfic_rate_pct: number
  ds_factor: number
  opex_pct: number
  // Sensitivity
  sensitivity: { label: string; tdc: number; gap: number; color: string }[]
  // Break-even (what affordable% closes the gap)
  breakeven_aff_pct: number | null  // null if gap already closed; >100 if not achievable with tenure mix alone
  gap_at_100pct_affordable: number
}

export function computeFeasibility(
  stateKey: string,
  typologyKey: string,
  tenureKey: string,
  haffScenarioKey = "r1-3-avg",
): FeasibilityResult {
  const typ   = TYPOLOGIES[typologyKey]
  const mix   = TENURE_MIXES[tenureKey]
  const haff  = HAFF_GRANT_OPTIONS[haffScenarioKey]
  const mult  = STATE_COST_MULTIPLIER[stateKey]

  // Construction
  const gross_area  = Math.round(typ.net_area_m2 * typ.gross_factor)
  const sqm_rate    = Math.round(SQM_COST[typ.sqm_type] * mult)
  const hard_cost   = Math.round(gross_area * sqm_rate)
  const prof_fees   = Math.round(hard_cost * PROFESSIONAL_FEES_PCT)
  const contingency = Math.round(hard_cost * CONTINGENCY_PCT)
  const finance     = Math.round(hard_cost * FINANCE_COST_PCT)
  const council     = COUNCIL_CONTRIBUTIONS[stateKey]
  const statutory   = STATUTORY_CHARGES[stateKey]
  const tdc         = hard_cost + prof_fees + contingency + finance + council + statutory

  // Rental income
  const soc_rent  = SOCIAL_RENT_WEEKLY[stateKey]
  const aff_rent  = Math.round(MARKET_RENT_WEEKLY[stateKey] * AFFORDABLE_RENT_RATIO)
  const blended   = Math.round(soc_rent * mix.social_pct + aff_rent * mix.affordable_pct)

  // Funding stack
  const nhfic_debt   = computeDebtCapacity(blended)
  const land         = STATE_LAND_CONTRIBUTION[stateKey]
  const total_funded = haff.grant + nhfic_debt + land
  const gap          = Math.max(0, tdc - total_funded)

  // Break-even affordable%:
  // need: haff.grant + debtCap(blend_needed) + land = tdc
  // debtCap_needed = tdc - haff.grant - land
  // blend_needed = debtCap_needed × DS_FACTOR × DSCR / (52 × (1 − OPEX))
  const debt_needed  = tdc - haff.grant - land
  const blend_needed = debt_needed * DEBT_SERVICE_FACTOR * DSCR / (52 * (1 - OPEX_RATIO))
  const be_raw       = (blend_needed - soc_rent) / (aff_rent - soc_rent)
  const breakeven    = gap === 0 ? 0 : be_raw  // 0 = already viable; >1 = not achievable via tenure alone

  // Gap at 100% affordable (best tenure outcome)
  const debt_100aff       = computeDebtCapacity(aff_rent)
  const gap_100aff        = Math.max(0, tdc - (haff.grant + debt_100aff + land))

  // Sensitivity: ±15% construction cost
  const sensitivity = [
    { label: "−15% build cost", tdc: Math.round(tdc * 0.85), gap: Math.max(0, Math.round(tdc * 0.85) - total_funded), color: "#5aad8a" },
    { label: "−10% build cost", tdc: Math.round(tdc * 0.90), gap: Math.max(0, Math.round(tdc * 0.90) - total_funded), color: "#5aad8a" },
    { label: "Base case",       tdc,                          gap,                                                      color: "#f6c90e" },
    { label: "+10% build cost", tdc: Math.round(tdc * 1.10), gap: Math.max(0, Math.round(tdc * 1.10) - total_funded), color: "#e67e22" },
    { label: "+15% build cost", tdc: Math.round(tdc * 1.15), gap: Math.max(0, Math.round(tdc * 1.15) - total_funded), color: "#c0614a" },
  ]

  return {
    state: stateKey,
    state_label: STATE_LABELS[stateKey],
    typology_key: typologyKey,
    typology_label: typ.label,
    tenure_key: tenureKey,
    tenure_label: mix.label,
    haff_scenario: haffScenarioKey,
    haff_grant: haff.grant,
    net_area_m2: typ.net_area_m2,
    gross_area_m2: gross_area,
    sqm_rate,
    hard_cost,
    professional_fees: prof_fees,
    contingency,
    finance_cost: finance,
    council_contributions: council,
    statutory_charges: statutory,
    tdc_ex_land: tdc,
    nhfic_debt,
    state_land: land,
    total_funded,
    funding_gap: gap,
    gap_per_m2: gap > 0 ? Math.round(gap / typ.net_area_m2) : 0,
    haff_coverage_pct: Math.round((haff.grant / tdc) * 100),
    social_rent_weekly: soc_rent,
    affordable_rent_weekly: aff_rent,
    blended_rent_weekly: blended,
    nhfic_rate_pct: NHFIC_RATE * 100,
    ds_factor: DEBT_SERVICE_FACTOR,
    opex_pct: OPEX_RATIO * 100,
    sensitivity,
    breakeven_aff_pct: breakeven,
    gap_at_100pct_affordable: gap_100aff,
  }
}

/**
 * Compute the same feasibility across all 5 states — for the state comparison strip.
 */
export function computeStateComparison(
  typologyKey: string,
  tenureKey: string,
  haffScenarioKey: string,
): { state: string; tdc: number; gap: number; debt: number; funded: number; viable: boolean }[] {
  return Object.keys(STATE_LABELS).map(s => {
    const r = computeFeasibility(s, typologyKey, tenureKey, haffScenarioKey)
    return {
      state: s,
      tdc: r.tdc_ex_land,
      gap: r.funding_gap,
      debt: r.nhfic_debt,
      funded: r.total_funded,
      viable: r.funding_gap === 0,
    }
  })
}
