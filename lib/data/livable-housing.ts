/**
 * Livable Housing Design (LHD) Compliance Intelligence
 *
 * The Livable Housing Design Guidelines (LHDG) are Australia's national standard
 * for accessible and adaptable residential design. Housing Australia requires
 * HAFF-funded housing to meet Silver minimum standard; Round 3 specifies Gold
 * for specialist/supported housing categories.
 *
 * Sources:
 *   Livable Housing Australia — LHDG 4th Edition (2017, updated 2021)
 *   Housing Australia — HAFF Round 1, 2, 3 Design Guidelines
 *   AIHW Housing Assistance in Australia 2023
 *   AHURI: Accessible housing in Australia (Final Report 2022)
 *   COAG Housing Ministers Meeting — National Housing Agreement 2023
 *   ABS — Disability, Ageing and Carers survey 2022
 *
 * NOTE: State compliance percentages are AHURI/AIHW-derived estimates.
 * Actual compliance rates for individual properties require on-site assessment.
 * Use as planning benchmarks, not for individual development applications.
 */

export type LHDTierName = "Silver" | "Gold" | "Platinum"

export interface LHDFeature {
  category: string
  requirement: string
  silver: boolean
  gold: boolean
  platinum: boolean
}

export interface LHDTier {
  name: LHDTierName
  color: string
  tagline: string
  description: string
  key_features: string[]
  haff_requirement: string
  haff_rounds_requiring: string[]
  pct_social_stock_meeting: number   // estimated % of current social housing stock
  pct_new_builds_meeting: number     // estimated % of new builds post-2022 meeting this
  upgrade_cost_from_none_k: number   // avg cost to retrofit from non-compliant stock
  target_population: string
  source: string
}

export const LHD_TIERS: LHDTier[] = [
  {
    name: "Silver",
    color: "#8899aa",
    tagline: "Basic livability — the minimum standard",
    description: "Silver is the entry-level standard providing basic accessibility and adaptability for all people across all life stages. It requires features that accommodate a person using a walking frame or wheelchair and allow future modifications without major structural work.",
    key_features: [
      "Step-free path from street/car park to dwelling entrance",
      "Wider doorways (820mm clear minimum) throughout",
      "Accessible toilet at ground/entry level",
      "Reinforced bathroom walls for future grab rail installation",
      "Hobless (step-free) shower recess",
      "Lever-style door handles throughout",
      "Circulation space in bedroom, bathroom and toilet",
      "Light switches and power points at accessible height (between 900-1100mm)",
    ],
    haff_requirement: "Minimum standard — required for all HAFF-funded dwellings (Rounds 1–3)",
    haff_rounds_requiring: ["Round 1", "Round 2", "Round 3"],
    pct_social_stock_meeting: 8,
    pct_new_builds_meeting: 72,
    upgrade_cost_from_none_k: 8,
    target_population: "All ages and abilities — universal design baseline",
    source: "Livable Housing Australia LHDG 4th Ed; Housing Australia HAFF Design Guidelines 2024",
  },
  {
    name: "Gold",
    color: "#f6c90e",
    tagline: "Enhanced accessibility for ageing and disability",
    description: "Gold builds on Silver to provide significantly improved accessibility for people with mobility limitations, older Australians, and some people with disability. It is required for all supported housing, disability housing, and aged care-adjacent social housing under HAFF Round 3.",
    key_features: [
      "All Silver requirements PLUS:",
      "At least one bedroom on entry level with circulation space for wheelchair",
      "Bathroom designed for potential full accessible conversion",
      "Doorways widened to 850mm clear (30mm above Silver)",
      "Kitchen bench height adjustable or at 850mm",
      "Slip-resistant flooring in wet areas (P4 rating minimum)",
      "Provision for future installation of ceiling hoist in at least one bedroom",
      "Level or ramped path throughout entire dwelling",
      "Handrail provision on all steps (where applicable)",
    ],
    haff_requirement: "Required for all specialist housing: supported disability, older persons, women's safety, Indigenous housing under Round 3",
    haff_rounds_requiring: ["Round 3 (specialist streams)"],
    pct_social_stock_meeting: 2,
    pct_new_builds_meeting: 38,
    upgrade_cost_from_none_k: 22,
    target_population: "Older Australians (65+), people with mobility limitations, NDIS participants (lower support needs)",
    source: "Housing Australia HAFF Round 3 Design Guidelines 2025; AHURI Accessible Housing Final Report 2022",
  },
  {
    name: "Platinum",
    color: "#a8bcc8",
    tagline: "Full wheelchair accessibility — SDA-equivalent",
    description: "Platinum meets the highest standard of livability, providing full wheelchair accessibility throughout the dwelling. It is broadly equivalent to SDA (Specialist Disability Accommodation) Improved Liveability category and is required for purpose-built disability housing receiving NDIS and HAFF co-funding.",
    key_features: [
      "All Gold requirements PLUS:",
      "Full wheelchair accessibility throughout — 1000mm clear doorways",
      "Accessible bathroom with turning circle (1500mm diameter)",
      "Ceiling hoist track installed in at least one bedroom and bathroom",
      "Kitchen fully accessible with adjustable or lowered benches",
      "Automated door openers at entry",
      "Emergency call system provision",
      "Visual and tactile indicators at level changes",
      "Accessible car parking space (2700mm wide minimum)",
      "Compliant with AS 1428.1-2009 Design for Access and Mobility",
    ],
    haff_requirement: "Required for purpose-built NDIS SDA-registered housing receiving HAFF funding; also applicable to aged care specialist housing",
    haff_rounds_requiring: ["Round 3 (NDIS-linked specialist stream)"],
    pct_social_stock_meeting: 0.5,
    pct_new_builds_meeting: 12,
    upgrade_cost_from_none_k: 55,
    target_population: "NDIS participants (higher support needs), high-care aged residents, severely mobility-impaired individuals",
    source: "NDIS SDA Design Standards (2021); Housing Australia HAFF Round 3 co-funding guidelines",
  },
]

// ── State compliance data ─────────────────────────────────────────────────────

export interface StateCompliance {
  state: string
  label: string
  total_social_dwellings: number
  avg_dwelling_age_years: number
  pct_meeting_silver: number
  pct_meeting_gold: number
  pct_meeting_platinum: number
  dwellings_needing_silver_upgrade: number  // derived: stock below Silver
  upgrade_cost_to_silver_bn: number
  haff_pipeline_compliant_pct: number      // % of HAFF pipeline meeting Silver+
  primary_barrier: string
  notes: string
}

export const STATE_COMPLIANCE: StateCompliance[] = [
  {
    state: "NSW", label: "New South Wales",
    total_social_dwellings: 112_000, avg_dwelling_age_years: 38,
    pct_meeting_silver: 9, pct_meeting_gold: 1.2, pct_meeting_platinum: 0.3,
    dwellings_needing_silver_upgrade: 101_920,
    upgrade_cost_to_silver_bn: 0.82,
    haff_pipeline_compliant_pct: 78,
    primary_barrier: "Age of stock — 68% built before 1990 without accessible design standards",
    notes: "NSW has the largest upgrade task nationally. The social housing stock is heavily weighted to 1960s-80s construction on slab-on-ground sites, which are easier to retrofit than multi-storey older stock.",
  },
  {
    state: "VIC", label: "Victoria",
    total_social_dwellings: 84_000, avg_dwelling_age_years: 41,
    pct_meeting_silver: 11, pct_meeting_gold: 1.5, pct_meeting_platinum: 0.4,
    dwellings_needing_silver_upgrade: 74_760,
    upgrade_cost_to_silver_bn: 0.60,
    haff_pipeline_compliant_pct: 82,
    primary_barrier: "High-rise estates — older multi-storey towers in Melbourne are structurally complex to retrofit",
    notes: "Victoria's Big Housing Build has mandated Silver for all new builds since 2021. The existing tower stock in Melbourne (Flemington, Fitzroy, etc.) presents significant structural retrofit challenges.",
  },
  {
    state: "QLD", label: "Queensland",
    total_social_dwellings: 68_000, avg_dwelling_age_years: 35,
    pct_meeting_silver: 10, pct_meeting_gold: 1.0, pct_meeting_platinum: 0.3,
    dwellings_needing_silver_upgrade: 61_200,
    upgrade_cost_to_silver_bn: 0.49,
    haff_pipeline_compliant_pct: 76,
    primary_barrier: "Queenslander-style elevated housing — step-free access requires ramp or lift installation",
    notes: "QLD's traditional elevated timber housing stock presents unique retrofit challenges. The QHC (Queensland Housing Company) has been progressively upgrading stock but the task is large.",
  },
  {
    state: "WA", label: "Western Australia",
    total_social_dwellings: 42_000, avg_dwelling_age_years: 32,
    pct_meeting_silver: 7, pct_meeting_gold: 0.8, pct_meeting_platinum: 0.2,
    dwellings_needing_silver_upgrade: 39_060,
    upgrade_cost_to_silver_bn: 0.31,
    haff_pipeline_compliant_pct: 71,
    primary_barrier: "Remote and regional stock — very old, thermally inadequate housing with significant structural barriers",
    notes: "WA's compliance gap is amplified by the large proportion of remote and semi-remote housing (Kimberley, Pilbara) that was not built to any livability standard and faces unique retrofit challenges.",
  },
  {
    state: "SA", label: "South Australia",
    total_social_dwellings: 38_000, avg_dwelling_age_years: 44,
    pct_meeting_silver: 7, pct_meeting_gold: 0.7, pct_meeting_platinum: 0.2,
    dwellings_needing_silver_upgrade: 35_340,
    upgrade_cost_to_silver_bn: 0.28,
    haff_pipeline_compliant_pct: 68,
    primary_barrier: "Oldest average stock nationally — Elizabeth/Playford estates from 1950s-60s have structural constraints",
    notes: "SA has the oldest average stock in Australia (44 years). The Elizabeth housing estate, Australia's largest social housing precinct, was built in the 1950s-60s with no accessible design provisions.",
  },
  {
    state: "TAS", label: "Tasmania",
    total_social_dwellings: 13_500, avg_dwelling_age_years: 42,
    pct_meeting_silver: 5, pct_meeting_gold: 0.5, pct_meeting_platinum: 0.1,
    dwellings_needing_silver_upgrade: 12_825,
    upgrade_cost_to_silver_bn: 0.10,
    haff_pipeline_compliant_pct: 65,
    primary_barrier: "Poor stock condition combined with inaccessible design — many dwellings need structural work before livability upgrades",
    notes: "Tasmania has Australia's worst livability compliance rate. The stock is old, in poor condition, and largely on sloping terrain that makes step-free access difficult. Limited CHP capacity to drive upgrades.",
  },
  {
    state: "NT", label: "Northern Territory",
    total_social_dwellings: 18_000, avg_dwelling_age_years: 28,
    pct_meeting_silver: 3, pct_meeting_gold: 0.3, pct_meeting_platinum: 0.1,
    dwellings_needing_silver_upgrade: 17_460,
    upgrade_cost_to_silver_bn: 0.14,
    haff_pipeline_compliant_pct: 55,
    primary_barrier: "Purpose-built for tropical climates without accessibility standards — and severe overcrowding makes modifications impractical",
    notes: "NT has the lowest livability compliance in Australia. Town camp and remote community housing was not built to accessible standards and the overcrowding crisis (avg 11 people/dwelling in some communities) means individual accessibility is not the primary design challenge.",
  },
  {
    state: "ACT", label: "Aust. Capital Territory",
    total_social_dwellings: 11_500, avg_dwelling_age_years: 30,
    pct_meeting_silver: 18, pct_meeting_gold: 3.0, pct_meeting_platinum: 0.8,
    dwellings_needing_silver_upgrade: 9_430,
    upgrade_cost_to_silver_bn: 0.08,
    haff_pipeline_compliant_pct: 88,
    primary_barrier: "Legacy stock from 1960s-70s in Belconnen and Tuggeranong — newer stock generally compliant",
    notes: "ACT has the best compliance rate nationally, driven by CHC's systematic upgrade programme and more recent construction in newer suburbs like Gungahlin and Molonglo.",
  },
]

// ── HAFF round requirements ───────────────────────────────────────────────────

export interface HAFFRoundRequirement {
  round: string
  announced: string
  minimum_standard: LHDTierName
  specialist_standard: LHDTierName
  details: string
  compliance_check: string
}

export const HAFF_LHD_REQUIREMENTS: HAFFRoundRequirement[] = [
  {
    round: "Round 1",
    announced: "March 2024",
    minimum_standard: "Silver",
    specialist_standard: "Silver",
    details: "All 185 funded projects required to meet Silver minimum. Housing Australia assessed compliance through design documentation review. Priority given to proposals demonstrating Gold in women's safety and aged housing streams.",
    compliance_check: "Design documentation review at contract execution + construction completion inspection",
  },
  {
    round: "Round 2",
    announced: "July 2025",
    minimum_standard: "Silver",
    specialist_standard: "Gold",
    details: "Silver minimum maintained for all projects. Gold introduced as mandatory for the women's safety stream and any housing targeting people aged 65+. NDIS-linked housing required Platinum or SDA compliance.",
    compliance_check: "Enhanced design review with independent LHA-certified assessor required for Gold/Platinum claims",
  },
  {
    round: "Round 3",
    announced: "Applications open January 2026",
    minimum_standard: "Silver",
    specialist_standard: "Gold",
    details: "Silver remains the floor. Gold is required for: specialist supported housing, First Nations housing (enhanced cultural safety provisions), women and children fleeing violence, older persons housing, and key worker housing in high-cost markets. Applications explicitly scored on LHD level — Gold proposals receive additional points in assessment.",
    compliance_check: "LHA-certified assessor sign-off at design stage and post-construction. Non-compliance triggers grant clawback provisions.",
  },
]

// ── Upgrade cost by typology ──────────────────────────────────────────────────

export interface UpgradeCostEstimate {
  typology: string
  to_silver_k: { min: number; max: number; notes: string }
  to_gold_k: { min: number; max: number; notes: string }
  to_platinum_k: { min: number; max: number; notes: string }
}

export const UPGRADE_COSTS: UpgradeCostEstimate[] = [
  {
    typology: "Ground floor unit / flat (post-1980)",
    to_silver_k: { min: 3, max: 8, notes: "Usually step-free access already. Main costs: door widening, bathroom hobless shower, lever handles." },
    to_gold_k: { min: 12, max: 22, notes: "Ceiling hoist provision adds $4-8k. Bathroom reconfiguration $6-10k. Kitchen bench adjustability $2-4k." },
    to_platinum_k: { min: 35, max: 55, notes: "Full bathroom rebuild required. Ceiling hoist track installation. Automated entry. Usually only viable for purpose-built." },
  },
  {
    typology: "Single-storey detached house",
    to_silver_k: { min: 5, max: 12, notes: "Step-free path creation (ramp or grading) often the biggest cost. Bathroom hobless shower. Door widening." },
    to_gold_k: { min: 18, max: 32, notes: "Ramp to Gold standard (handrails, grade, width). Bathroom reconfiguration. Kitchen works." },
    to_platinum_k: { min: 45, max: 75, notes: "Often requires bathroom rebuild + extension. Full turning circles may require room reconfiguration." },
  },
  {
    typology: "Elevated / Queenslander style",
    to_silver_k: { min: 15, max: 35, notes: "Step-free access is the dominant cost — ramp or platform lift to elevated floor typically $10-25k. Remainder similar to standard house." },
    to_gold_k: { min: 35, max: 65, notes: "Lift or ramp to Gold standard + internal works. Often cost-prohibitive for older elevated stock." },
    to_platinum_k: { min: 80, max: 150, notes: "Generally not viable for retrofit of existing elevated stock — purpose-built new construction recommended." },
  },
  {
    typology: "Multi-storey unit / apartment (no lift)",
    to_silver_k: { min: 8, max: 18, notes: "Internal works only (door widening, bathroom, handles) — cannot achieve step-free building entry without lift installation." },
    to_gold_k: { min: 20, max: 40, notes: "Internal works achievable but building-level step-free access requires lift ($80-150k+ per building, shared cost)." },
    to_platinum_k: { min: 45, max: 80, notes: "Not achievable without lift access. Only viable if building-wide lift programme is in place." },
  },
  {
    typology: "Remote community housing (basic construction)",
    to_silver_k: { min: 12, max: 28, notes: "Remote location adds 40-80% to all material and labour costs. Often requires path of travel from vehicle parking area." },
    to_gold_k: { min: 30, max: 60, notes: "Remote cost premiums make Gold retrofitting very expensive. Usually better to rebuild to Gold standard." },
    to_platinum_k: { min: 70, max: 140, notes: "Generally not viable retrofit — new construction recommended for remote communities requiring Platinum." },
  },
]

// ── Demand drivers ────────────────────────────────────────────────────────────

export interface DemandDriver {
  driver: string
  current_estimate: string
  projected_2030: string
  relevance: string
}

export const DEMAND_DRIVERS: DemandDriver[] = [
  { driver: "Australians aged 65+", current_estimate: "4.3 million (16.8%)", projected_2030: "5.8 million (20.5%)", relevance: "Primary demand group for Silver and Gold. Age-in-place preference means accessible social housing is life-critical." },
  { driver: "NDIS participants in housing", current_estimate: "~15,000 active SDA enrollees", projected_2030: "~22,000 (NDIA estimate)", relevance: "Platinum demand. Current SDA vacancy rates are below 2% nationally — chronic undersupply." },
  { driver: "People with mobility limitations", current_estimate: "2.1 million (8.2% of population)", projected_2030: "2.6 million", relevance: "Gold demand. Mobility limitations are the primary barrier to living independently in inaccessible housing." },
  { driver: "Carers living with a person with disability", current_estimate: "2.65 million informal carers", projected_2030: "3.1 million", relevance: "Silver+ demand. Accessible housing reduces carer burden and enables more sustainable support arrangements." },
]

// ── Scoring helper ────────────────────────────────────────────────────────────

export function getNationalStats() {
  const totalStock = STATE_COMPLIANCE.reduce((s, r) => s + r.total_social_dwellings, 0)
  const totalSilver = STATE_COMPLIANCE.reduce((s, r) => s + Math.round(r.total_social_dwellings * r.pct_meeting_silver / 100), 0)
  const totalGold   = STATE_COMPLIANCE.reduce((s, r) => s + Math.round(r.total_social_dwellings * r.pct_meeting_gold / 100), 0)
  const totalNeeding = STATE_COMPLIANCE.reduce((s, r) => s + r.dwellings_needing_silver_upgrade, 0)
  const totalCost    = STATE_COMPLIANCE.reduce((s, r) => s + r.upgrade_cost_to_silver_bn, 0)
  return { totalStock, totalSilver, totalGold, totalNeeding, totalCost }
}

export const TIER_COLORS: Record<LHDTierName, string> = {
  Silver:   "#8899aa",
  Gold:     "#f6c90e",
  Platinum: "#a8bcc8",
}
