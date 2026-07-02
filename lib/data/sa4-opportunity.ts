/**
 * SA4 Opportunity Score — CHP Coverage vs Housing Need
 *
 * SA4 (Statistical Area Level 4) is the ABS geographic unit used for labour
 * force and housing analysis — broadly equivalent to a major urban district or
 * large regional zone containing 100,000–500,000 people.
 *
 * Sources:
 *   Population: ABS Census 2021 (Cat. 2071.0)
 *   Rental stress: National Shelter Rental Affordability Index 2023; ABS 2021 Census
 *   Social demand index: AIHW Housing Assistance 2023; state HA waitlist data
 *   CHP presence: NHR provider register + individual CHP annual reports (May 2026)
 *   Centroids: ABS SA4 centroid estimates (approximate — for mapping only)
 *
 * NOTE: This dataset covers the 34 highest-priority SA4 regions by housing need.
 *       Full 107-SA4 dataset requires ABS GeoJSON boundary integration (Phase 2).
 *
 * SCORING (HIVE composite — weights are HIVE judgement, inputs sourced above):
 *   need = min(100, stress/60×60 + demand_index×0.40) · coverageGap by Tier-1 count
 *   (0→100, 1→78, 2→52, 3→28, else max(8, 100−t1×22)) · popScore = min(100, pop/4200)
 *   opportunity = need×0.50 + coverageGap×0.30 + popScore×0.20
 *   bands: ≥75 Critical · ≥58 High · ≥42 Moderate · else Well-served
 */

export interface SA4Region {
  id: string
  name: string
  state: string
  sa4_code: string
  lat: number                    // SA4 centroid latitude
  lng: number                    // SA4 centroid longitude
  population: number
  rental_stress_pct: number      // % of renters paying >30% income on rent
  social_demand_index: number    // 0–100 estimated social housing need intensity
  tier1_chps: string[]           // Tier 1 CHP names operating in region
  tier2_chp_count: number        // Estimated Tier 2 providers (from NHR)
  key_lgas: string[]             // Key LGAs / suburbs covered
  notes: string
}

export interface SA4Scored extends SA4Region {
  need_score: number
  coverage_gap_score: number
  population_score: number
  opportunity_score: number
  coverage_rating: "None" | "Thin" | "Moderate" | "Strong"
  opportunity_band: "Critical" | "High" | "Moderate" | "Well-served"
}

export const SA4_REGIONS: SA4Region[] = [
  // ── NEW SOUTH WALES ────────────────────────────────────────────────────────
  {
    id: "nsw-sydney-inner", name: "Sydney — Inner City",
    state: "NSW", sa4_code: "117", lat: -33.882, lng: 151.207,
    population: 312_000, rental_stress_pct: 48, social_demand_index: 72,
    tier1_chps: ["SGCH", "Bridge", "Link Wentworth", "MA Housing", "Anglicare"],
    tier2_chp_count: 12,
    key_lgas: ["City of Sydney", "Woolloomooloo", "Glebe", "Newtown", "Surry Hills", "Potts Point"],
    notes: "Highest property values in Australia. Strong CHP presence but extreme land cost means viability gap is severe.",
  },
  {
    id: "nsw-sydney-parramatta", name: "Sydney — Parramatta",
    state: "NSW", sa4_code: "124", lat: -33.817, lng: 151.002,
    population: 265_000, rental_stress_pct: 44, social_demand_index: 80,
    tier1_chps: ["SGCH", "Evolve", "Uniting", "BlueCHP"],
    tier2_chp_count: 8,
    key_lgas: ["Parramatta", "Auburn", "Merrylands", "Granville", "Wentworthville"],
    notes: "High rental demand, major state urban renewal corridor. Evolve and SGCH key delivery partners.",
  },
  {
    id: "nsw-sydney-southwest", name: "Sydney — South West",
    state: "NSW", sa4_code: "127", lat: -34.020, lng: 150.804,
    population: 388_000, rental_stress_pct: 46, social_demand_index: 88,
    tier1_chps: ["SGCH", "Uniting", "MA Housing"],
    tier2_chp_count: 6,
    key_lgas: ["Campbelltown", "Camden", "Liverpool", "Fairfield", "Bankstown"],
    notes: "Fastest growing housing demand corridor in NSW. Long social housing waitlists.",
  },
  {
    id: "nsw-sydney-blacktown", name: "Sydney — Blacktown",
    state: "NSW", sa4_code: "104", lat: -33.769, lng: 150.906,
    population: 415_000, rental_stress_pct: 45, social_demand_index: 82,
    tier1_chps: ["Evolve", "Anglicare"],
    tier2_chp_count: 5,
    key_lgas: ["Blacktown", "Mount Druitt", "Seven Hills", "Quakers Hill", "Rooty Hill", "Doonside"],
    notes: "Largest SA4 by population in NSW. Only 2 Tier 1 CHPs relative to enormous need.",
  },
  {
    id: "nsw-sydney-outer-west", name: "Sydney — Outer West & Blue Mts",
    state: "NSW", sa4_code: "123", lat: -33.741, lng: 150.641,
    population: 293_000, rental_stress_pct: 43, social_demand_index: 74,
    tier1_chps: ["Link Wentworth", "Uniting"],
    tier2_chp_count: 4,
    key_lgas: ["Penrith", "Blue Mountains", "Hawkesbury", "Lithgow", "Katoomba"],
    notes: "Significant housing stress in Penrith/Blue Mountains. Limited Tier 1 presence.",
  },
  {
    id: "nsw-newcastle", name: "Newcastle & Lake Macquarie",
    state: "NSW", sa4_code: "102", lat: -32.927, lng: 151.753,
    population: 311_000, rental_stress_pct: 38, social_demand_index: 65,
    tier1_chps: ["Home in Place", "Hume", "MA Housing"],
    tier2_chp_count: 7,
    key_lgas: ["Newcastle", "Lake Macquarie", "Cessnock", "Maitland", "Port Stephens"],
    notes: "Home in Place HQ (formerly Compass). Strong regional CHP base.",
  },
  {
    id: "nsw-central-coast", name: "Central Coast",
    state: "NSW", sa4_code: "103", lat: -33.430, lng: 151.339,
    population: 346_000, rental_stress_pct: 42, social_demand_index: 71,
    tier1_chps: ["Hume", "Home in Place"],
    tier2_chp_count: 5,
    key_lgas: ["Gosford", "Wyong", "Terrigal", "The Entrance", "Tuggerah", "Toukley"],
    notes: "High rental stress relative to income. Aging population adding supported housing demand.",
  },
  {
    id: "nsw-hunter-valley", name: "Hunter Valley (ex Newcastle)",
    state: "NSW", sa4_code: "101", lat: -32.554, lng: 151.175,
    population: 198_000, rental_stress_pct: 35, social_demand_index: 58,
    tier1_chps: ["Hume"],
    tier2_chp_count: 3,
    key_lgas: ["Singleton", "Muswellbrook", "Dungog", "Upper Hunter", "Scone"],
    notes: "Rural and regional. Limited Tier 1 presence outside mining townships.",
  },
  // ── VICTORIA ───────────────────────────────────────────────────────────────
  {
    id: "vic-melbourne-inner", name: "Melbourne — Inner",
    state: "VIC", sa4_code: "206", lat: -37.814, lng: 144.968,
    population: 156_000, rental_stress_pct: 46, social_demand_index: 78,
    tier1_chps: ["Housing Choices", "Launch", "Haven", "Anglicare"],
    tier2_chp_count: 9,
    key_lgas: ["Melbourne CBD", "Fitzroy", "Collingwood", "Richmond", "South Yarra", "Prahran"],
    notes: "Strong CHP presence. High land cost remains primary viability barrier.",
  },
  {
    id: "vic-melbourne-west", name: "Melbourne — West",
    state: "VIC", sa4_code: "212", lat: -37.870, lng: 144.737,
    population: 342_000, rental_stress_pct: 41, social_demand_index: 79,
    tier1_chps: ["Housing Choices", "Uniting"],
    tier2_chp_count: 6,
    key_lgas: ["Wyndham", "Hobsons Bay", "Maribyrnong", "Brimbank", "Melton"],
    notes: "Rapidly growing. Large refugee and migrant communities with specialist housing needs.",
  },
  {
    id: "vic-melbourne-north-west", name: "Melbourne — North West",
    state: "VIC", sa4_code: "210", lat: -37.706, lng: 144.883,
    population: 287_000, rental_stress_pct: 43, social_demand_index: 76,
    tier1_chps: ["Housing Choices", "HousingFirst"],
    tier2_chp_count: 5,
    key_lgas: ["Hume", "Moreland", "Moonee Valley", "Sunbury", "Broadmeadows"],
    notes: "High demand corridor. Only 2 Tier 1 CHPs for large population.",
  },
  {
    id: "vic-melbourne-south-east", name: "Melbourne — South East",
    state: "VIC", sa4_code: "211", lat: -38.013, lng: 145.226,
    population: 328_000, rental_stress_pct: 39, social_demand_index: 68,
    tier1_chps: ["Housing Choices"],
    tier2_chp_count: 4,
    key_lgas: ["Casey", "Greater Dandenong", "Cardinia", "Frankston", "Berwick"],
    notes: "Significant unmet need. Under-covered relative to population.",
  },
  {
    id: "vic-geelong", name: "Geelong",
    state: "VIC", sa4_code: "202", lat: -38.149, lng: 144.362,
    population: 261_000, rental_stress_pct: 37, social_demand_index: 62,
    tier1_chps: ["Housing Choices", "Haven"],
    tier2_chp_count: 4,
    key_lgas: ["Geelong", "Surf Coast", "Golden Plains", "Queenscliffe", "Lara"],
    notes: "Growing regional centre. Housing demand accelerating post-COVID tree/sea change migration.",
  },
  {
    id: "vic-gippsland", name: "Gippsland",
    state: "VIC", sa4_code: "203", lat: -38.191, lng: 146.427,
    population: 274_000, rental_stress_pct: 36, social_demand_index: 68,
    tier1_chps: ["Haven"],
    tier2_chp_count: 3,
    key_lgas: ["Latrobe Valley", "Traralgon", "Sale", "Bairnsdale", "East Gippsland"],
    notes: "Haven's core geographic focus. Specialist homelessness + supported housing needs.",
  },
  // ── QUEENSLAND ─────────────────────────────────────────────────────────────
  {
    id: "qld-brisbane-south", name: "Brisbane — South",
    state: "QLD", sa4_code: "305", lat: -27.592, lng: 153.049,
    population: 296_000, rental_stress_pct: 38, social_demand_index: 70,
    tier1_chps: ["CHL", "Housing Choices", "Centacare"],
    tier2_chp_count: 6,
    key_lgas: ["Brisbane South", "Logan", "Loganlea", "Springwood", "Sunnybank"],
    notes: "Good Tier 1 presence. CHL's QLD HQ provides strong delivery capability.",
  },
  {
    id: "qld-brisbane-east", name: "Brisbane — East",
    state: "QLD", sa4_code: "303", lat: -27.524, lng: 153.172,
    population: 244_000, rental_stress_pct: 36, social_demand_index: 65,
    tier1_chps: ["CHL", "Horizon"],
    tier2_chp_count: 4,
    key_lgas: ["Brisbane East", "Redland", "Cleveland", "Capalaba", "Wynnum"],
    notes: "Moderate coverage. CHL and Horizon combined provide reasonable capacity.",
  },
  {
    id: "qld-gold-coast-north", name: "Gold Coast — North",
    state: "QLD", sa4_code: "308", lat: -27.966, lng: 153.384,
    population: 312_000, rental_stress_pct: 43, social_demand_index: 74,
    tier1_chps: ["CHL"],
    tier2_chp_count: 3,
    key_lgas: ["Surfers Paradise", "Southport", "Broadbeach", "Burleigh Heads", "Robina"],
    notes: "High rental stress driven by tourism economy. Only CHL with Tier 1 presence.",
  },
  {
    id: "qld-townsville", name: "Townsville",
    state: "QLD", sa4_code: "318", lat: -19.258, lng: 146.819,
    population: 189_000, rental_stress_pct: 44, social_demand_index: 84,
    tier1_chps: ["Horizon", "CHL"],
    tier2_chp_count: 3,
    key_lgas: ["Townsville", "Thuringowa", "Magnetic Island", "Charters Towers"],
    notes: "High Indigenous housing need. Horizon has strong First Nations capability in this region.",
  },
  {
    id: "qld-cairns", name: "Cairns",
    state: "QLD", sa4_code: "301", lat: -16.924, lng: 145.770,
    population: 168_000, rental_stress_pct: 40, social_demand_index: 78,
    tier1_chps: ["CHL"],
    tier2_chp_count: 2,
    key_lgas: ["Cairns", "Tablelands", "Douglas", "Cook"],
    notes: "Gateway to remote Indigenous communities. Acute housing need, limited Tier 1 options.",
  },
  {
    id: "qld-outback-north", name: "Queensland — Outback (North)",
    state: "QLD", sa4_code: "399", lat: -20.742, lng: 141.103,
    population: 76_000, rental_stress_pct: 52, social_demand_index: 95,
    tier1_chps: ["CHL"],
    tier2_chp_count: 1,
    key_lgas: ["Mount Isa", "Cloncurry", "Richmond", "McKinlay", "Boulia"],
    notes: "Remote Indigenous communities. Extreme housing need. CHL specialist remote capability but scale insufficient.",
  },
  // ── WESTERN AUSTRALIA ──────────────────────────────────────────────────────
  {
    id: "wa-perth-inner", name: "Perth — Inner",
    state: "WA", sa4_code: "505", lat: -31.960, lng: 115.857,
    population: 186_000, rental_stress_pct: 36, social_demand_index: 64,
    tier1_chps: ["Foundation", "Housing Choices"],
    tier2_chp_count: 5,
    key_lgas: ["Perth CBD", "Fremantle", "Cottesloe", "Subiaco", "Victoria Park", "South Perth"],
    notes: "Foundation Housing HQ. Access Housing (now Housing Choices WA) added capacity in 2021.",
  },
  {
    id: "wa-perth-north-west", name: "Perth — North West",
    state: "WA", sa4_code: "508", lat: -31.670, lng: 115.799,
    population: 254_000, rental_stress_pct: 38, social_demand_index: 68,
    tier1_chps: ["Foundation"],
    tier2_chp_count: 3,
    key_lgas: ["Joondalup", "Wanneroo", "Stirling", "Yanchep", "Two Rocks"],
    notes: "High growth corridor. Only Foundation with Tier 1 presence outside inner metro.",
  },
  {
    id: "wa-perth-south-east", name: "Perth — South East",
    state: "WA", sa4_code: "510", lat: -32.100, lng: 115.990,
    population: 229_000, rental_stress_pct: 40, social_demand_index: 72,
    tier1_chps: ["Foundation"],
    tier2_chp_count: 2,
    key_lgas: ["Gosnells", "Armadale", "Canning", "Serpentine-Jarrahdale"],
    notes: "Outer suburban growth. Limited CHP capacity relative to rapid population growth.",
  },
  {
    id: "wa-outback-north", name: "WA — Outback (North)",
    state: "WA", sa4_code: "599", lat: -20.374, lng: 121.449,
    population: 58_000, rental_stress_pct: 56, social_demand_index: 97,
    tier1_chps: ["Foundation"],
    tier2_chp_count: 1,
    key_lgas: ["Broome", "Port Hedland", "Karratha", "Kununurra", "Derby"],
    notes: "Pilbara and Kimberley remote communities. Highest rental stress in Australia. Foundation expanding but scale insufficient.",
  },
  // ── SOUTH AUSTRALIA ────────────────────────────────────────────────────────
  {
    id: "sa-adelaide-north", name: "Adelaide — North",
    state: "SA", sa4_code: "401", lat: -34.742, lng: 138.637,
    population: 322_000, rental_stress_pct: 39, social_demand_index: 76,
    tier1_chps: ["Unity Housing", "Housing Choices"],
    tier2_chp_count: 4,
    key_lgas: ["Playford", "Salisbury", "Port Adelaide Enfield", "Elizabeth", "Davoren Park"],
    notes: "Highest social housing need in SA. Unity Housing and Housing Choices are primary delivery vehicles.",
  },
  {
    id: "sa-adelaide-central", name: "Adelaide — Central & Hills",
    state: "SA", sa4_code: "402", lat: -34.929, lng: 138.601,
    population: 194_000, rental_stress_pct: 37, social_demand_index: 65,
    tier1_chps: ["Unity Housing", "Housing Choices", "Anglicare"],
    tier2_chp_count: 6,
    key_lgas: ["Adelaide CBD", "Unley", "Norwood", "Burnside", "Campbelltown"],
    notes: "Best-covered SA4 in SA. Unity Housing dominant with Housing Choices adding national scale.",
  },
  {
    id: "sa-adelaide-south", name: "Adelaide — South",
    state: "SA", sa4_code: "403", lat: -35.122, lng: 138.563,
    population: 231_000, rental_stress_pct: 35, social_demand_index: 58,
    tier1_chps: ["Unity Housing"],
    tier2_chp_count: 3,
    key_lgas: ["Marion", "Onkaparinga", "Holdfast Bay", "Morphett Vale", "Noarlunga"],
    notes: "Moderate demand. Unity Housing sole Tier 1 presence in south metro.",
  },
  {
    id: "sa-outback", name: "South Australia — Outback",
    state: "SA", sa4_code: "499", lat: -29.000, lng: 134.000,
    population: 42_000, rental_stress_pct: 48, social_demand_index: 88,
    tier1_chps: [],
    tier2_chp_count: 1,
    key_lgas: ["APY Lands", "Coober Pedy", "Outback Communities Authority", "Roxby Downs"],
    notes: "APY Lands and remote communities. No Tier 1 CHP presence. Critical gap — Indigenous housing need is severe.",
  },

  // ── TASMANIA ───────────────────────────────────────────────────────────────
  {
    id: "tas-hobart", name: "Hobart",
    state: "TAS", sa4_code: "601", lat: -42.882, lng: 147.324,
    population: 238_000, rental_stress_pct: 46, social_demand_index: 79,
    tier1_chps: ["Housing Choices Australia", "Centacare"],
    tier2_chp_count: 4,
    key_lgas: ["Hobart", "Clarence", "Glenorchy", "Kingborough", "Huon Valley"],
    notes: "Australia's tightest capital city rental market at under 0.5% vacancy for most of 2022-23. Strong unmet demand; limited Tier 1 capacity relative to need.",
  },
  {
    id: "tas-launceston", name: "Launceston and North East",
    state: "TAS", sa4_code: "602", lat: -41.434, lng: 147.137,
    population: 148_000, rental_stress_pct: 38, social_demand_index: 72,
    tier1_chps: ["Housing Choices Australia"],
    tier2_chp_count: 3,
    key_lgas: ["Launceston", "George Town", "Meander Valley", "Northern Midlands"],
    notes: "Secondary Tasmanian market with growing demand. Single Tier 1 CHP presence; gap in specialist disability and aged housing.",
  },
  {
    id: "tas-south-east", name: "South East Tasmania",
    state: "TAS", sa4_code: "603", lat: -43.010, lng: 147.500,
    population: 82_000, rental_stress_pct: 36, social_demand_index: 64,
    tier1_chps: [],
    tier2_chp_count: 2,
    key_lgas: ["Sorell", "Tasman", "Glamorgan-Spring Bay", "Break O'Day"],
    notes: "Regional and coastal communities. No Tier 1 CHP presence. Tourism-driven rental pressure displacing lower-income residents.",
  },

  // ── NORTHERN TERRITORY ────────────────────────────────────────────────────
  {
    id: "nt-darwin", name: "Darwin",
    state: "NT", sa4_code: "701", lat: -12.462, lng: 130.842,
    population: 148_000, rental_stress_pct: 42, social_demand_index: 83,
    tier1_chps: ["Venture Housing"],
    tier2_chp_count: 3,
    key_lgas: ["Darwin", "Palmerston", "Litchfield", "Wagait Beach"],
    notes: "Defence and government workforce drives high rental demand. Significant Indigenous population in town camps. Venture Housing the primary Tier 1 operator; sector needs strengthening.",
  },
  {
    id: "nt-outback", name: "Northern Territory — Outback",
    state: "NT", sa4_code: "702", lat: -20.500, lng: 134.500,
    population: 109_000, rental_stress_pct: 62, social_demand_index: 97,
    tier1_chps: [],
    tier2_chp_count: 1,
    key_lgas: ["Alice Springs", "MacDonnell", "Barkly", "East Arnhem", "West Arnhem", "Tiwi Islands"],
    notes: "Highest housing stress and overcrowding in Australia. Remote Aboriginal communities with critical unmet need. No Tier 1 CHP operating at scale. National partnership funding essential.",
  },

  // ── AUSTRALIAN CAPITAL TERRITORY ──────────────────────────────────────────
  {
    id: "act-canberra", name: "Australian Capital Territory",
    state: "ACT", sa4_code: "801", lat: -35.282, lng: 149.129,
    population: 476_000, rental_stress_pct: 34, social_demand_index: 66,
    tier1_chps: ["CHC Affordable Housing", "Havelock Housing", "Argyle Community Housing"],
    tier2_chp_count: 5,
    key_lgas: ["Belconnen", "Gungahlin", "Inner North", "Inner South", "Tuggeranong", "Weston Creek", "Woden Valley"],
    notes: "High-income territory but social housing waitlist of 3,200 driven by public sector churn and high market rents. ACT has three Tier 1 CHPs with active pipelines. Infill planning provides good development sites.",
  },
]

// ─── Scoring ─────────────────────────────────────────────────────────────────

export function computeOpportunityScore(sa4: SA4Region): SA4Scored {
  const needScore = Math.min(100, Math.round(
    (sa4.rental_stress_pct / 60) * 60 +
    (sa4.social_demand_index / 100) * 40
  ))
  const t1 = sa4.tier1_chps.length
  const coverageGapScore = t1 === 0 ? 100 : t1 === 1 ? 78 : t1 === 2 ? 52 : t1 === 3 ? 28 : Math.max(8, 100 - t1 * 22)
  const popScore = Math.min(100, Math.round(sa4.population / 4200))
  const opportunityScore = Math.round(needScore * 0.50 + coverageGapScore * 0.30 + popScore * 0.20)

  const coverageRating: SA4Scored["coverage_rating"] =
    t1 === 0 ? "None" : t1 === 1 ? "Thin" : t1 <= 3 ? "Moderate" : "Strong"

  const opportunityBand: SA4Scored["opportunity_band"] =
    opportunityScore >= 75 ? "Critical" :
    opportunityScore >= 58 ? "High" :
    opportunityScore >= 42 ? "Moderate" : "Well-served"

  return { ...sa4, need_score: needScore, coverage_gap_score: coverageGapScore, population_score: popScore, opportunity_score: opportunityScore, coverage_rating: coverageRating, opportunity_band: opportunityBand }
}

export function getScoredRegions(): SA4Scored[] {
  return SA4_REGIONS.map(computeOpportunityScore).sort((a, b) => b.opportunity_score - a.opportunity_score)
}

export const OPPORTUNITY_COLORS: Record<SA4Scored["opportunity_band"], string> = {
  "Critical":    "#c0614a",
  "High":        "#c49a3a",
  "Moderate":    "#4d7fb5",
  "Well-served": "#5aad8a",
}

export const COVERAGE_COLORS: Record<SA4Scored["coverage_rating"], string> = {
  "None":     "#c0614a",
  "Thin":     "#c49a3a",
  "Moderate": "#4d7fb5",
  "Strong":   "#5aad8a",
}
