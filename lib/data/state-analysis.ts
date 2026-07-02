/**
 * State-level housing demand and supply analysis — ported from Python state_analysis.py
 * Sources: State housing authority annual reports, ABS Building Approvals (8731.0), AIHW SHS
 */

export interface WaitlistDataPoint {
  year: number
  applicants: number
}

export interface DemographicType {
  label: string
  pct: number
}

export interface ApprovalsDataPoint {
  year: number
  houses: number
  other: number
}

export interface SocialCompletionsDataPoint {
  year: number
  social: number
  affordable: number
}

export interface HouseholdSizeDataPoint {
  year: number
  avg: number
}

export interface StateInfo {
  full: string
  authority: string
  social_housing_stock: number
  target_new_pa: number
  key_program: string
  insight: string
}

// REBUILT 2026-07-02 from primary sources — the prior series (sum 213,000 at 2024;
// long smooth 2005-2024 histories) was not traceable to any published register and
// materially overstated QLD/SA (+26-33%) while understating TAS/NT (-32-49%).
// Verified basis, UNIT = HOUSEHOLDS on the PUBLIC HOUSING waiting list, at 30 June:
//   2025: RoGS 2026 Table 18A.29 (all states). 2024: derived from RoGS 2026
//   "change from 2024". NSW 2019-2023: AIHW Households.27 (national administrative
//   equivalent). Other states' pre-2024 history: not yet source-verified -> omitted.
// SOMIH waitlist is SEPARATE (RoGS 18A.31: 17,478 households nationally, Jun 2025;
// QLD 7,375 / NSW 4,601). Community housing: no national waitlist aggregate exists;
// jurisdictions use integrated registers, so summing program lists double-counts.
// National public-housing waitlist: 140,578 (2018) -> 168,552 (2024) -> 189,536 (2025).
export const WAITLIST_TREND: Record<string, WaitlistDataPoint[]> = {
  NSW: [
    { year: 2019, applicants: 49325 }, { year: 2020, applicants: 49674 }, { year: 2021, applicants: 48239 }, { year: 2022, applicants: 55693 }, { year: 2023, applicants: 54134 }, { year: 2024, applicants: 50726 }, { year: 2025, applicants: 59077 },
  ],
  VIC: [
    { year: 2024, applicants: 51380 }, { year: 2025, applicants: 56230 },
  ],
  QLD: [
    { year: 2024, applicants: 18818 }, { year: 2025, applicants: 24112 },
  ],
  WA: [
    { year: 2024, applicants: 20294 }, { year: 2025, applicants: 22409 },
  ],
  SA: [
    { year: 2024, applicants: 14043 }, { year: 2025, applicants: 13687 },
  ],
  TAS: [
    { year: 2024, applicants: 4709 }, { year: 2025, applicants: 5152 },
  ],
  NT: [
    { year: 2024, applicants: 5423 }, { year: 2025, applicants: 5467 },
  ],
  ACT: [
    { year: 2024, applicants: 3159 }, { year: 2025, applicants: 3402 },
  ],
}

export const WAITLIST_DEMOGRAPHICS: Record<string, { year: string; source: string; types: DemographicType[] }> = {
  WA: {
    year: "2023-24", source: "DPLH Annual Report 2023-24",
    types: [
      { label: "Single person", pct: 52 }, { label: "Single parent + children", pct: 21 },
      { label: "Aged 65+", pct: 11 }, { label: "Couple + children", pct: 9 },
      { label: "Couple, no children", pct: 4 }, { label: "Other", pct: 3 },
    ],
  },
  NSW: {
    year: "2023-24", source: "DCJ Social Housing Waitlist 2023-24",
    types: [
      { label: "Single person", pct: 49 }, { label: "Single parent + children", pct: 23 },
      { label: "Aged 65+", pct: 13 }, { label: "Couple + children", pct: 8 },
      { label: "Couple, no children", pct: 4 }, { label: "Other", pct: 3 },
    ],
  },
  VIC: {
    year: "2023-24", source: "DFFH Housing Register 2023-24",
    types: [
      { label: "Single person", pct: 55 }, { label: "Single parent + children", pct: 20 },
      { label: "Aged 65+", pct: 10 }, { label: "Couple + children", pct: 8 },
      { label: "Couple, no children", pct: 4 }, { label: "Other", pct: 3 },
    ],
  },
  QLD: {
    year: "2023-24", source: "DCHDE Housing Register 2023-24",
    types: [
      { label: "Single person", pct: 48 }, { label: "Single parent + children", pct: 25 },
      { label: "Aged 65+", pct: 12 }, { label: "Couple + children", pct: 9 },
      { label: "Couple, no children", pct: 3 }, { label: "Other", pct: 3 },
    ],
  },
  SA: {
    year: "2023-24", source: "SAHT Housing Register 2023-24",
    types: [
      { label: "Single person", pct: 53 }, { label: "Single parent + children", pct: 19 },
      { label: "Aged 65+", pct: 14 }, { label: "Couple + children", pct: 7 },
      { label: "Couple, no children", pct: 4 }, { label: "Other", pct: 3 },
    ],
  },
  TAS: {
    year: "2023-24", source: "Housing Tasmania Applicant Register 2023-24",
    types: [
      { label: "Single person", pct: 57 }, { label: "Single parent + children", pct: 18 },
      { label: "Aged 65+", pct: 12 }, { label: "Couple + children", pct: 6 },
      { label: "Couple, no children", pct: 4 }, { label: "Other", pct: 3 },
    ],
  },
  NT: {
    year: "2023-24", source: "NT Housing Register 2023-24",
    types: [
      { label: "Single person", pct: 41 }, { label: "Single parent + children", pct: 28 },
      { label: "Aged 65+", pct: 7 }, { label: "Couple + children", pct: 14 },
      { label: "Couple, no children", pct: 6 }, { label: "Other", pct: 4 },
    ],
  },
  ACT: {
    year: "2023-24", source: "ACT Housing Registrar 2023-24",
    types: [
      { label: "Single person", pct: 50 }, { label: "Single parent + children", pct: 22 },
      { label: "Aged 65+", pct: 11 }, { label: "Couple + children", pct: 9 },
      { label: "Couple, no children", pct: 5 }, { label: "Other", pct: 3 },
    ],
  },
}

export const APPROVALS_BY_TYPE: Record<string, ApprovalsDataPoint[]> = {
  WA: [
    { year: 2005, houses: 18200, other: 3800 }, { year: 2006, houses: 19100, other: 4200 },
    { year: 2007, houses: 17400, other: 4600 }, { year: 2008, houses: 14200, other: 3900 },
    { year: 2009, houses: 16800, other: 5200 }, { year: 2010, houses: 18900, other: 5800 },
    { year: 2011, houses: 20100, other: 6400 }, { year: 2012, houses: 21800, other: 7100 },
    { year: 2013, houses: 22400, other: 8200 }, { year: 2014, houses: 19800, other: 7600 },
    { year: 2015, houses: 17200, other: 6800 }, { year: 2016, houses: 14800, other: 5900 },
    { year: 2017, houses: 13200, other: 5100 }, { year: 2018, houses: 12400, other: 4800 },
    { year: 2019, houses: 11900, other: 4600 }, { year: 2020, houses: 14800, other: 4200 },
    { year: 2021, houses: 20400, other: 4900 }, { year: 2022, houses: 18600, other: 5100 },
    { year: 2023, houses: 16200, other: 4800 }, { year: 2024, houses: 14800, other: 5200 },
  ],
  NSW: [
    { year: 2005, houses: 22100, other: 19400 }, { year: 2010, houses: 23400, other: 18100 },
    { year: 2015, houses: 31200, other: 38400 }, { year: 2016, houses: 30800, other: 40200 },
    { year: 2017, houses: 29400, other: 37800 }, { year: 2018, houses: 27200, other: 33600 },
    { year: 2019, houses: 24800, other: 28400 }, { year: 2020, houses: 25400, other: 24800 },
    { year: 2021, houses: 29800, other: 23200 }, { year: 2022, houses: 26400, other: 21800 },
    { year: 2023, houses: 22800, other: 19600 }, { year: 2024, houses: 20400, other: 18200 },
  ],
  VIC: [
    { year: 2005, houses: 28400, other: 11200 }, { year: 2010, houses: 32400, other: 16800 },
    { year: 2015, houses: 40600, other: 32800 }, { year: 2016, houses: 41200, other: 36400 },
    { year: 2017, houses: 39800, other: 38200 }, { year: 2018, houses: 37400, other: 34800 },
    { year: 2019, houses: 34200, other: 29600 }, { year: 2020, houses: 36800, other: 26400 },
    { year: 2021, houses: 42400, other: 24800 }, { year: 2022, houses: 36200, other: 26400 },
    { year: 2023, houses: 30400, other: 24200 }, { year: 2024, houses: 27200, other: 22800 },
  ],
  QLD: [
    { year: 2005, houses: 24800, other: 8400 }, { year: 2010, houses: 24200, other: 11400 },
    { year: 2015, houses: 29400, other: 18800 }, { year: 2016, houses: 29200, other: 19400 },
    { year: 2017, houses: 27800, other: 17800 }, { year: 2018, houses: 26400, other: 16200 },
    { year: 2019, houses: 24800, other: 14800 }, { year: 2020, houses: 27200, other: 13600 },
    { year: 2021, houses: 32800, other: 14200 }, { year: 2022, houses: 30400, other: 15800 },
    { year: 2023, houses: 28200, other: 16400 }, { year: 2024, houses: 26400, other: 17200 },
  ],
  SA: [
    { year: 2010, houses: 9800, other: 3200 }, { year: 2012, houses: 8600, other: 3400 },
    { year: 2014, houses: 9200, other: 4100 }, { year: 2016, houses: 8800, other: 4600 },
    { year: 2018, houses: 8200, other: 4200 }, { year: 2020, houses: 9800, other: 3600 },
    { year: 2022, houses: 9200, other: 3800 }, { year: 2023, houses: 8400, other: 3600 },
    { year: 2024, houses: 7800, other: 3400 },
  ],
  TAS: [
    { year: 2010, houses: 2400, other: 600 }, { year: 2012, houses: 2100, other: 550 },
    { year: 2014, houses: 1900, other: 480 }, { year: 2016, houses: 2000, other: 520 },
    { year: 2018, houses: 2400, other: 700 }, { year: 2020, houses: 2800, other: 900 },
    { year: 2022, houses: 3100, other: 1100 }, { year: 2023, houses: 2900, other: 1000 },
    { year: 2024, houses: 2700, other: 900 },
  ],
  NT: [
    { year: 2010, houses: 1100, other: 400 }, { year: 2012, houses: 1200, other: 350 },
    { year: 2014, houses: 1000, other: 300 }, { year: 2016, houses: 900, other: 280 },
    { year: 2018, houses: 850, other: 250 }, { year: 2020, houses: 950, other: 280 },
    { year: 2022, houses: 1100, other: 320 }, { year: 2023, houses: 1050, other: 300 },
    { year: 2024, houses: 1000, other: 290 },
  ],
  ACT: [
    { year: 2010, houses: 1800, other: 1400 }, { year: 2012, houses: 1900, other: 1600 },
    { year: 2014, houses: 2000, other: 1800 }, { year: 2016, houses: 2200, other: 2100 },
    { year: 2018, houses: 2100, other: 2400 }, { year: 2020, houses: 2400, other: 2600 },
    { year: 2022, houses: 2600, other: 2900 }, { year: 2023, houses: 2500, other: 2800 },
    { year: 2024, houses: 2400, other: 2600 },
  ],
}

export const SOCIAL_HOUSING_COMPLETIONS: Record<string, SocialCompletionsDataPoint[]> = {
  WA: [
    { year: 2010, social: 860, affordable: 420 }, { year: 2011, social: 920, affordable: 380 },
    { year: 2012, social: 1100, affordable: 440 }, { year: 2013, social: 620, affordable: 310 },
    { year: 2014, social: 390, affordable: 280 }, { year: 2015, social: 290, affordable: 240 },
    { year: 2016, social: 210, affordable: 200 }, { year: 2017, social: 160, affordable: 180 },
    { year: 2018, social: 190, affordable: 160 }, { year: 2019, social: 280, affordable: 140 },
    { year: 2020, social: 360, affordable: 130 }, { year: 2021, social: 490, affordable: 150 },
    { year: 2022, social: 720, affordable: 180 }, { year: 2023, social: 870, affordable: 210 },
    { year: 2024, social: 980, affordable: 240 },
  ],
  NSW: [
    { year: 2010, social: 1180, affordable: 600 }, { year: 2011, social: 1240, affordable: 580 },
    { year: 2012, social: 1380, affordable: 640 }, { year: 2013, social: 820, affordable: 520 },
    { year: 2014, social: 710, affordable: 480 }, { year: 2015, social: 590, affordable: 440 },
    { year: 2016, social: 520, affordable: 400 }, { year: 2017, social: 440, affordable: 360 },
    { year: 2018, social: 390, affordable: 320 }, { year: 2019, social: 360, affordable: 290 },
    { year: 2020, social: 340, affordable: 260 }, { year: 2021, social: 480, affordable: 300 },
    { year: 2022, social: 640, affordable: 380 }, { year: 2023, social: 820, affordable: 420 },
    { year: 2024, social: 1020, affordable: 460 },
  ],
  VIC: [
    { year: 2010, social: 880, affordable: 400 }, { year: 2011, social: 940, affordable: 380 },
    { year: 2012, social: 1020, affordable: 420 }, { year: 2013, social: 680, affordable: 360 },
    { year: 2014, social: 590, affordable: 320 }, { year: 2015, social: 520, affordable: 280 },
    { year: 2016, social: 580, affordable: 300 }, { year: 2017, social: 640, affordable: 340 },
    { year: 2018, social: 700, affordable: 380 }, { year: 2019, social: 760, affordable: 420 },
    { year: 2020, social: 820, affordable: 460 }, { year: 2021, social: 1240, affordable: 560 },
    { year: 2022, social: 2820, affordable: 800 }, { year: 2023, social: 3440, affordable: 960 },
    { year: 2024, social: 3820, affordable: 1100 },
  ],
  QLD: [
    { year: 2010, social: 820, affordable: 380 }, { year: 2011, social: 760, affordable: 340 },
    { year: 2012, social: 880, affordable: 360 }, { year: 2013, social: 560, affordable: 280 },
    { year: 2014, social: 490, affordable: 250 }, { year: 2015, social: 440, affordable: 220 },
    { year: 2016, social: 410, affordable: 200 }, { year: 2017, social: 390, affordable: 190 },
    { year: 2018, social: 380, affordable: 180 }, { year: 2019, social: 420, affordable: 190 },
    { year: 2020, social: 520, affordable: 210 }, { year: 2021, social: 680, affordable: 240 },
    { year: 2022, social: 860, affordable: 280 }, { year: 2023, social: 1020, affordable: 320 },
    { year: 2024, social: 1180, affordable: 360 },
  ],
  SA: [
    { year: 2010, social: 420, affordable: 180 }, { year: 2012, social: 360, affordable: 160 },
    { year: 2014, social: 310, affordable: 140 }, { year: 2016, social: 260, affordable: 130 },
    { year: 2018, social: 230, affordable: 120 }, { year: 2020, social: 260, affordable: 130 },
    { year: 2022, social: 320, affordable: 160 }, { year: 2023, social: 380, affordable: 190 },
    { year: 2024, social: 420, affordable: 210 },
  ],
  TAS: [
    { year: 2010, social: 160, affordable: 60 }, { year: 2012, social: 140, affordable: 55 },
    { year: 2014, social: 120, affordable: 50 }, { year: 2016, social: 100, affordable: 45 },
    { year: 2018, social: 90, affordable: 40 }, { year: 2020, social: 110, affordable: 50 },
    { year: 2022, social: 140, affordable: 65 }, { year: 2023, social: 170, affordable: 80 },
    { year: 2024, social: 200, affordable: 95 },
  ],
  NT: [
    { year: 2010, social: 320, affordable: 80 }, { year: 2012, social: 280, affordable: 70 },
    { year: 2014, social: 260, affordable: 65 }, { year: 2016, social: 230, affordable: 60 },
    { year: 2018, social: 210, affordable: 55 }, { year: 2020, social: 240, affordable: 60 },
    { year: 2022, social: 270, affordable: 70 }, { year: 2023, social: 290, affordable: 75 },
    { year: 2024, social: 310, affordable: 80 },
  ],
  ACT: [
    { year: 2010, social: 180, affordable: 90 }, { year: 2012, social: 160, affordable: 85 },
    { year: 2014, social: 150, affordable: 80 }, { year: 2016, social: 140, affordable: 80 },
    { year: 2018, social: 160, affordable: 90 }, { year: 2020, social: 190, affordable: 100 },
    { year: 2022, social: 230, affordable: 120 }, { year: 2023, social: 260, affordable: 140 },
    { year: 2024, social: 290, affordable: 155 },
  ],
}

export const HOUSEHOLD_SIZE_TREND: Record<string, HouseholdSizeDataPoint[]> = {
  WA:  [{ year: 2001, avg: 2.72 }, { year: 2006, avg: 2.65 }, { year: 2011, avg: 2.60 }, { year: 2016, avg: 2.55 }, { year: 2021, avg: 2.51 }],
  NSW: [{ year: 2001, avg: 2.59 }, { year: 2006, avg: 2.55 }, { year: 2011, avg: 2.53 }, { year: 2016, avg: 2.51 }, { year: 2021, avg: 2.47 }],
  VIC: [{ year: 2001, avg: 2.60 }, { year: 2006, avg: 2.57 }, { year: 2011, avg: 2.55 }, { year: 2016, avg: 2.52 }, { year: 2021, avg: 2.48 }],
  QLD: [{ year: 2001, avg: 2.63 }, { year: 2006, avg: 2.60 }, { year: 2011, avg: 2.57 }, { year: 2016, avg: 2.52 }, { year: 2021, avg: 2.48 }],
  SA:  [{ year: 2001, avg: 2.44 }, { year: 2006, avg: 2.40 }, { year: 2011, avg: 2.38 }, { year: 2016, avg: 2.35 }, { year: 2021, avg: 2.31 }],
  TAS: [{ year: 2001, avg: 2.48 }, { year: 2006, avg: 2.44 }, { year: 2011, avg: 2.40 }, { year: 2016, avg: 2.37 }, { year: 2021, avg: 2.33 }],
  NT:  [{ year: 2001, avg: 2.72 }, { year: 2006, avg: 2.68 }, { year: 2011, avg: 2.65 }, { year: 2016, avg: 2.62 }, { year: 2021, avg: 2.58 }],
  ACT: [{ year: 2001, avg: 2.62 }, { year: 2006, avg: 2.58 }, { year: 2011, avg: 2.55 }, { year: 2016, avg: 2.52 }, { year: 2021, avg: 2.49 }],
}

export const STATE_INFO: Record<string, StateInfo> = {
  WA: {
    full: "Western Australia",
    authority: "DPLH — Dept. of Planning, Lands and Heritage",
    social_housing_stock: 38000,
    target_new_pa: 3300,
    key_program: "WA Housing Strategy 2020–2030",
    insight: "WA's waitlist hit a decade low in 2019–20 as the mining boom's affordability pressure eased, but has since surged 43% in four years driven by post-COVID population growth, interstate migration, and a rental market vacancy rate under 1%. Supply is overwhelmingly detached houses — but over half of waitlist applicants are singles who need 1–2 bedroom apartments or units. The mismatch between what's being built and what's needed is structural.",
  },
  NSW: {
    full: "New South Wales",
    authority: "DCJ — Dept. of Communities and Justice",
    social_housing_stock: 125000,
    target_new_pa: 5400,
    key_program: "NSW Housing 2041",
    insight: "NSW has the largest waitlist in the country — over 61,000 — and it has grown steadily for 20 years with no meaningful reduction. Despite high apartment construction in 2014–2017, almost none was affordable or social housing. The waitlist demographics show 49% singles and 13% aged — but new supply skews toward 3–4 bedroom houses in outer suburbs, far from services these cohorts need.",
  },
  VIC: {
    full: "Victoria",
    authority: "DFFH — Dept. of Families, Fairness and Housing",
    social_housing_stock: 83000,
    target_new_pa: 12000,
    key_program: "Big Housing Build ($5.3B)",
    insight: "Victoria's waitlist grew by two-thirds — from 38,000 to 63,000 in five years — the largest absolute increase of any state. The Big Housing Build ($5.3B, 12,000 new dwellings) is the largest state housing investment in Australian history and is now delivering. VIC is the only state building enough to potentially bend the curve — but 55% of applicants are singles, and the build mix must skew toward smaller typologies to match.",
  },
  QLD: {
    full: "Queensland",
    authority: "DCHDE — Housing and Homelessness",
    social_housing_stock: 74000,
    target_new_pa: 5200,
    key_program: "Queensland Housing Investment Growth Initiative",
    insight: "QLD's waitlist has surged 67% since 2019, driven by interstate migration, tourism-driven rental market pressure in coastal regions, and a tight vacancy rate. Building approvals peaked in 2015–2016 and have been falling since. QLD's construction pipeline is dominated by detached housing, while 48% of waitlist applicants are singles and 25% are single-parent families — groups needing smaller, well-located dwellings.",
  },
  SA: {
    full: "South Australia",
    authority: "SAHT — SA Housing Trust",
    social_housing_stock: 37000,
    target_new_pa: 1000,
    key_program: "Housing Roadmap 2024",
    insight: "SA has a smaller but rapidly growing waitlist, up 16% since 2022 and up ~38% over the past decade. SA's housing market has become one of Australia's tightest, with Adelaide vacancy rates under 0.5%. The SAHT stock has declined due to sales and demolitions outpacing new builds. Demographics show 53% singles and 14% aged — both groups needing affordable, smaller dwellings in accessible locations.",
  },
  TAS: {
    full: "Tasmania",
    authority: "Housing Tasmania — Dept. of Communities",
    social_housing_stock: 12500,
    target_new_pa: 400,
    key_program: "Tasmanian Affordable Housing Action Plan",
    insight: "Tasmania has Australia's tightest rental market by vacancy rate — Hobart sat below 0.5% for most of 2022-23, pushing rents up 35% in three years. The waitlist has grown steadily to 3,500, disproportionately large for a state of 570,000. Supply is severely constrained by geography, construction cost premiums, and a limited CHP sector. With 57% of waitlist applicants being single-person households, the urgent need is for compact, well-located dwellings in Hobart and Launceston.",
  },
  NT: {
    full: "Northern Territory",
    authority: "NT Housing — Dept. of Housing and Community Development",
    social_housing_stock: 14000,
    target_new_pa: 350,
    key_program: "Our Community. Our Future. Our Homes",
    insight: "The NT has the highest rate of overcrowding and homelessness per capita in Australia, concentrated in remote Aboriginal communities. A disproportionate share of the 2,800-strong waitlist represents families needing larger dwellings — 14% couples with children vs 9% nationally. Construction costs in the NT are the highest in Australia (42% above national average) due to supply chain constraints, remoteness, and climate. Federal investment through the remote housing program is critical.",
  },
  ACT: {
    full: "Australian Capital Territory",
    authority: "ACT Housing — Community Services Directorate",
    social_housing_stock: 11000,
    target_new_pa: 500,
    key_program: "ACT Housing Strategy 2018–2028",
    insight: "Despite being Australia's wealthiest jurisdiction by income, Canberra has a waitlist of 3,200 — driven by high market rents, public sector churn, and inadequate social stock relative to demand. ACT's infill-focused planning means most new supply is mid-to-high density, yet the social housing mix remains outdated. The ACT government has ambitious sustainability targets and its housing pipeline skews toward apartments, which aligns well with the 50% singles and 22% single-parent demographics on the waitlist.",
  },
}

export interface StateSummary {
  state: string
  state_full: string
  authority: string
  social_housing_stock: number
  target_new_pa: number
  key_program: string
  insight: string
  latest_waitlist: number
  waitlist_year: number
  wl_change_yoy: number | null
  wl_change_decade: number | null
  latest_approvals_total: number
  latest_approvals_houses: number
  latest_approvals_other: number
  houses_pct_of_approvals: number
  demographics: { year: string; source: string; types: DemographicType[] }
  waitlist_trend: WaitlistDataPoint[]
  approvals_by_type: ApprovalsDataPoint[]
  social_housing_completions: SocialCompletionsDataPoint[]
  latest_social_completions: number
  latest_affordable_completions: number
  accessible_total: number
  accessible_pct_of_approvals: number
  years_to_clear_waitlist: number | null
  household_size_trend: HouseholdSizeDataPoint[]
}

export function getStateSummary(state = "WA"): StateSummary {
  const waitlist = WAITLIST_TREND[state] ?? []
  const demographics = WAITLIST_DEMOGRAPHICS[state] ?? { year: "", source: "", types: [] }
  const approvals = APPROVALS_BY_TYPE[state] ?? []
  const social = SOCIAL_HOUSING_COMPLETIONS[state] ?? []
  const hh_size = HOUSEHOLD_SIZE_TREND[state] ?? []
  const info = STATE_INFO[state] ?? { full: state, authority: "", social_housing_stock: 0, target_new_pa: 0, key_program: "", insight: "" }

  const latest_wl = waitlist[waitlist.length - 1] ?? { year: 0, applicants: 0 }
  const prev_wl = waitlist[waitlist.length - 2] ?? null

  const wl_change_yoy = prev_wl
    ? Math.round(((latest_wl.applicants - prev_wl.applicants) / prev_wl.applicants) * 100 * 10) / 10
    : null

  const decade_ago = [...waitlist].reverse().find(w => w.year <= latest_wl.year - 10)
  const wl_change_decade = decade_ago
    ? Math.round(((latest_wl.applicants - decade_ago.applicants) / decade_ago.applicants) * 100 * 10) / 10
    : null

  const latest_approvals = approvals[approvals.length - 1] ?? { year: 0, houses: 0, other: 0 }
  const total_approvals = (latest_approvals.houses ?? 0) + (latest_approvals.other ?? 0)
  const houses_pct = total_approvals ? Math.round((latest_approvals.houses / total_approvals) * 100) : 0

  const latest_social_entry = social[social.length - 1] ?? { year: 0, social: 0, affordable: 0 }
  const latest_social_completions = latest_social_entry.social ?? 0
  const latest_affordable_completions = latest_social_entry.affordable ?? 0
  const accessible_total = latest_social_completions + latest_affordable_completions
  const accessible_pct_of_approvals = total_approvals ? Math.round((accessible_total / total_approvals) * 100 * 10) / 10 : 0
  const years_to_clear_waitlist = accessible_total ? Math.round(latest_wl.applicants / accessible_total) : null

  return {
    state,
    state_full: info.full,
    authority: info.authority,
    social_housing_stock: info.social_housing_stock,
    target_new_pa: info.target_new_pa,
    key_program: info.key_program,
    insight: info.insight,
    latest_waitlist: latest_wl.applicants,
    waitlist_year: latest_wl.year,
    wl_change_yoy,
    wl_change_decade,
    latest_approvals_total: total_approvals,
    latest_approvals_houses: latest_approvals.houses,
    latest_approvals_other: latest_approvals.other,
    houses_pct_of_approvals: houses_pct,
    demographics,
    waitlist_trend: waitlist,
    approvals_by_type: approvals,
    social_housing_completions: social,
    latest_social_completions,
    latest_affordable_completions,
    accessible_total,
    accessible_pct_of_approvals,
    years_to_clear_waitlist,
    household_size_trend: hh_size,
  }
}

export function getAllStatesLatest() {
  return ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"].map(state => {
    const s = getStateSummary(state)
    return {
      state,
      waitlist: s.latest_waitlist,
      approvals_total: s.latest_approvals_total,
      approvals_houses: s.latest_approvals_houses,
      approvals_other: s.latest_approvals_other,
      stock: s.social_housing_stock,
    }
  })
}
