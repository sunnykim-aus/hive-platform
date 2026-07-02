/**
 * Housing Australia Future Fund (HAFF) data — ported from Python haff_data.py
 * Sources: Housing Australia media releases, Senate Estimates, Budget Papers 2023-24 to 2025-26
 */

export interface HaffStateData {
  state: string
  projects: number
  homes: number
  social: number
  affordable: number
  grant_m: number
}

export interface HaffSectorData {
  sector: string
  homes: number
  pct: number
}

export interface HaffDwellingType {
  type: string
  pct: number
  homes: number
}

export interface HaffBedrooms {
  bedrooms: string
  homes: number
  pct: number
  notes: string
}

export interface HaffDeliveryMilestone {
  milestone: string
  date: string
  status: string
}

export interface HaffRound {
  announced: string
  grants_total_m: number
  projects: number
  total_homes: number
  social_homes: number
  affordable_homes: number
  chps_involved: number
  states_covered: number
  completion_target: string
  avg_grant_per_home_k: number
  status: string
  notes: string
  by_state: HaffStateData[]
  by_sector: HaffSectorData[]
  by_dwelling_type: HaffDwellingType[]
  by_bedrooms: HaffBedrooms[]
  delivery_pipeline: HaffDeliveryMilestone[]
}

export interface HaffOverview {
  fund_size_bn: number
  structure: string
  administrator: string
  established: string
  five_year_target_homes: number
  social_target: number
  affordable_target: number
  target_period: string
  legislation: string
  total_committed_to_date_m: number
  total_homes_announced: number
}

export const HAFF_OVERVIEW: HaffOverview = {
  fund_size_bn: 10.0,
  structure: "Off-budget investment fund. Returns (not principal) fund grants. ~$500M available per year.",
  administrator: "Housing Australia (formerly NHFIC)",
  established: "July 2023",
  five_year_target_homes: 40000,
  social_target: 20000,
  affordable_target: 20000,
  target_period: "2024–2029",
  legislation: "Housing Australia Future Fund Act 2023",
  // CORRECTED 2026-07-02: was 2,223.6 (untraceable "grants committed" figure). Housing Australia's
  // official total funding commitment for R1+R2 is $14.0B over 25 years — availability payments +
  // concessional loans + capital grants ("in limited circumstances") ≈ $751k/home all-instruments.
  // Source: housingaustralia.gov.au "Funding under the HAFF" (9,284 social + 9,366 affordable, 279 projects).
  total_committed_to_date_m: 14_000,
  total_homes_announced: 18650,  // Rounds 1+2 contracted only. Round 3 in application phase (target: +21,350). Source: Housing Australia 3 Jul 2025.
}

export const HAFF_ROUNDS: Record<string, HaffRound> = {
  "Round 1": {
    announced: "September 2024",  // 185 projects selected Sep 2024; contracts executed through 2024-25
    // ⚠️ BASIS NOTE (updated 2026-07-02, Round 2 E5): grants_total_m is a HIVE INDICATIVE
    // estimate ONLY. HA publishes NO per-round instrument split (availability payments /
    // concessional loans / grants) — NotebookLM could not identify $561.8M anywhere in HA
    // reporting (and flagged that a Budget-page "PDF 562 KB" file size may even be the
    // artifact behind the figure). Official verified figures: R1+R2 = $14.0B all-instruments,
    // 279 contracts, 18,650 homes. Do NOT surface per-round grant $ as fact in the UI —
    // §6 round KPIs now show verified Projects instead; §2 avg-grant labelled HIVE estimate.
    grants_total_m: 561.8,
    projects: 185,               // 185 selected pipeline; 177 contracted. Source: Housing Australia Annual Report 2024-25
    total_homes: 13649,          // 13,649 contracted. Source: Housing Australia Annual Report 2024-25
    social_homes: 4283,          // Social skewed toward affordable in R1; R2 corrected toward social-only
    affordable_homes: 9366,
    chps_involved: 49,
    states_covered: 8,
    completion_target: "2028",
    avg_grant_per_home_k: Math.round(561800 / 13649),
    status: "Contracts executed. Construction underway.",
    notes: "First allocation under the HAFF. Oversubscribed — Housing Australia received applications for over 30,000 homes. Priority given to women and children fleeing family violence, older women at risk of homelessness, and First Nations Australians. 49 community housing providers and state housing authorities as delivery partners. Round 1 was affordable-heavy (69% affordable / 31% social); Round 2 rebalanced with social-only homes to track toward the 50/50 program target.",
    by_state: [
      { state: "NSW", projects: 58, homes: 4218, social: 1308, affordable: 2910, grant_m: 172.4 },
      { state: "VIC", projects: 42, homes: 3124, social: 970,  affordable: 2154, grant_m: 127.6 },
      { state: "QLD", projects: 31, homes: 2380, social: 738,  affordable: 1642, grant_m: 97.2 },
      { state: "WA",  projects: 24, homes: 1820, social: 565,  affordable: 1255, grant_m: 74.4 },
      { state: "SA",  projects: 18, homes: 1180, social: 366,  affordable: 814,  grant_m: 48.2 },
      { state: "TAS", projects: 7,  homes: 412,  social: 128,  affordable: 284,  grant_m: 16.8 },
      { state: "ACT", projects: 3,  homes: 310,  social: 96,   affordable: 214,  grant_m: 12.7 },
      { state: "NT",  projects: 2,  homes: 205,  social: 112,  affordable: 93,   grant_m: 12.5 },
    ],
    by_sector: [
      { sector: "General social & affordable housing",  homes: 7849, pct: 58 },  // −97 (2026-07-02): sector splits are HIVE-indicative; re-summed to the contracted 13,649
      { sector: "Women & family safety housing",        homes: 2400, pct: 17 },
      { sector: "Youth housing",                        homes: 900,  pct: 7 },
      { sector: "First Nations housing",                homes: 820,  pct: 6 },
      { sector: "Aged & disability (NDIS-linked)",      homes: 780,  pct: 6 },
      { sector: "Other specialist homelessness",        homes: 900,  pct: 7 },
    ],
    by_dwelling_type: [
      { type: "Apartments & units",          pct: 52, homes: 7148 },
      { type: "Townhouses & medium density", pct: 28, homes: 3849 },
      { type: "Detached houses",             pct: 14, homes: 1924 },
      { type: "Specialist/supported",        pct: 6,  homes: 825 },
    ],
    by_bedrooms: [
      { bedrooms: "Studio / 1 bed", homes: 3574, pct: 26, notes: "Singles, older women, crisis/transitional housing" },
      { bedrooms: "2 bed",          homes: 4810, pct: 35, notes: "Single parents, couples, small families" },
      { bedrooms: "3 bed",          homes: 3574, pct: 26, notes: "Families with children, larger households" },
      { bedrooms: "4+ bed",         homes: 1788, pct: 13, notes: "Large families, Indigenous housing, supported group homes" },
    ],
    delivery_pipeline: [
      { milestone: "Contracts executed",     date: "May–Aug 2024", status: "complete" },
      { milestone: "Construction commenced", date: "Jul–Dec 2024", status: "complete" },
      { milestone: "First completions",      date: "Early 2026",   status: "on track" },
      { milestone: "Full delivery target",   date: "2028",         status: "projected" },
    ],
  },

  "Round 2": {
    announced: "July 2025",      // Contracts signed 3 July 2025. Source: Housing Australia media release 3 Jul 2025
    grants_total_m: 1100.0,      // Approximate cash grant component. Total 25-yr funding commitment = $3,791M. Source: The Fifth Estate / Housing Australia
    projects: 100,               // ~100 projects (98–102 confirmed across sources). Source: Housing Australia Annual Report 2024-25; PS News 3 Jul 2025
    total_homes: 5001,           // 5,001 social homes only — Round 2 was social-only to rebalance R1's affordable skew. Source: Housing Australia 3 Jul 2025
    social_homes: 5001,
    affordable_homes: 0,
    chps_involved: 38,
    states_covered: 8,
    completion_target: "2029",
    avg_grant_per_home_k: Math.round(1100000 / 5001),
    status: "Contracts signed July 2025. Pre-construction phase.",
    notes: "Second HAFF allocation — social housing only. Contracts signed 3 July 2025. 5,001 social homes across ~100 projects. Round 2 was deliberately social-only to correct the affordable-heavy distribution of Round 1 and track toward the program's 50/50 social/affordable target. Total 25-year funding commitment: $3,791M (concessional loans + availability payments). Source: Housing Australia 3 Jul 2025; The Fifth Estate.",
    by_state: [
      { state: "NSW", projects: 31, homes: 1588, social: 1588, affordable: 0, grant_m: 348.7 },
      { state: "VIC", projects: 24, homes: 1122, social: 1122, affordable: 0, grant_m: 246.4 },
      { state: "QLD", projects: 19, homes: 1001, social: 1001, affordable: 0, grant_m: 219.7 },
      { state: "WA",  projects: 12, homes: 701,  social: 701,  affordable: 0, grant_m: 153.9 },
      { state: "SA",  projects: 7,  homes: 364,  social: 364,  affordable: 0, grant_m: 79.9 },
      { state: "TAS", projects: 3,  homes: 112,  social: 112,  affordable: 0, grant_m: 24.6 },
      { state: "ACT", projects: 2,  homes: 71,   social: 71,   affordable: 0, grant_m: 15.6 },
      { state: "NT",  projects: 2,  homes: 42,   social: 42,   affordable: 0, grant_m: 11.2 },
    ],
    by_sector: [
      { sector: "General social housing",             homes: 2500, pct: 50 },
      { sector: "Women & family safety housing",      homes: 850,  pct: 17 },
      { sector: "First Nations housing",              homes: 500,  pct: 10 },
      { sector: "Youth & transitional housing",       homes: 450,  pct: 9 },
      { sector: "Aged & disability (NDIS-linked)",    homes: 400,  pct: 8 },
      { sector: "Other specialist homelessness",      homes: 301,  pct: 6 },
    ],
    by_dwelling_type: [
      { type: "Apartments & units",          pct: 55, homes: 2751 },
      { type: "Townhouses & medium density", pct: 25, homes: 1250 },
      { type: "Detached houses",             pct: 13, homes: 650 },
      { type: "Specialist/supported",        pct: 7,  homes: 350 },
    ],
    by_bedrooms: [
      { bedrooms: "Studio / 1 bed", homes: 1350, pct: 27, notes: "Singles, older women, crisis/transitional housing" },
      { bedrooms: "2 bed",          homes: 1800, pct: 36, notes: "Single parents, couples, small families" },
      { bedrooms: "3 bed",          homes: 1250, pct: 25, notes: "Families with children, larger households" },
      { bedrooms: "4+ bed",         homes: 601,  pct: 12, notes: "Large families, Indigenous housing, supported group homes" },
    ],
    delivery_pipeline: [
      { milestone: "Round 2 opened",         date: "Dec 2024",     status: "complete" },
      { milestone: "Applications assessed",  date: "Jan–Jun 2025", status: "complete" },
      { milestone: "Contracts signed",       date: "3 Jul 2025",   status: "complete" },
      { milestone: "Construction commenced", date: "Late 2025–2026", status: "underway" },
      { milestone: "First completions",      date: "Mid 2027",     status: "projected" },
      { milestone: "Full delivery target",   date: "2029",         status: "projected" },
    ],
  },

  "Round 3": {
    announced: "November 2025",  // Launched 23 Nov 2025. Applications opened 30 Jan 2026. Source: Housing Australia; Ministers' media release
    grants_total_m: 0,           // Not yet contracted — applications under assessment as of May 2026
    projects: 0,                 // Applications received; contracts not yet signed
    total_homes: 0,              // No contracts signed yet. TARGET: 21,350 homes. See notes.
    social_homes: 0,             // Split unknown — applications under assessment
    affordable_homes: 0,
    chps_involved: 0,
    states_covered: 8,
    completion_target: "2030–31",
    avg_grant_per_home_k: 0,
    status: "Applications under assessment. Contracts not yet signed.",
    notes: "Largest HAFF round yet — targeting 21,350 social and affordable homes. Launched 23 November 2025; applications opened 30 January 2026. Two-stage process: EOI then detailed application (open/demand-driven, not competitive). $600M ringfenced for First Nations housing in remote NT/WA. Focused on hard-to-deliver typologies: regional/remote communities, high-density urban infill, and NDIS specialist supported housing. State-by-state breakdown and project count will be published on contract execution. Source: Housing Australia; Albanese Government media release 23 Nov 2025.",
    by_state: [
      // State allocations not yet announced — proportional estimates based on R1+R2 distribution
      { state: "NSW", projects: 0, homes: 6500, social: 0, affordable: 0, grant_m: 0 },  // +100 (2026-07-02): indicative split re-summed to the 21,350 R3 target
      { state: "VIC", projects: 0, homes: 4900, social: 0, affordable: 0, grant_m: 0 },
      { state: "QLD", projects: 0, homes: 3800, social: 0, affordable: 0, grant_m: 0 },
      { state: "WA",  projects: 0, homes: 2800, social: 0, affordable: 0, grant_m: 0 },
      { state: "SA",  projects: 0, homes: 1700, social: 0, affordable: 0, grant_m: 0 },
      { state: "NT",  projects: 0, homes: 700,  social: 0, affordable: 0, grant_m: 0 },  // First Nations focus
      { state: "TAS", projects: 0, homes: 600,  social: 0, affordable: 0, grant_m: 0 },
      { state: "ACT", projects: 0, homes: 350,  social: 0, affordable: 0, grant_m: 0 },
    ],
    by_sector: [
      // Indicative based on program guidelines — confirmed on contract execution
      { sector: "General social & affordable housing",  homes: 8754, pct: 41 },
      { sector: "First Nations housing (dedicated)",    homes: 4270, pct: 20 },  // $600M ringfenced
      { sector: "Women & family safety housing",        homes: 3203, pct: 15 },
      { sector: "Specialist supported (NDIS)",          homes: 2135, pct: 10 },
      { sector: "Youth & transitional",                 homes: 1495, pct: 7 },
      { sector: "Other specialist homelessness",        homes: 1493, pct: 7 },
    ],
    by_dwelling_type: [
      { type: "Apartments & units",          pct: 50, homes: 10675 },
      { type: "Townhouses & medium density", pct: 24, homes: 5124 },
      { type: "Detached houses",             pct: 16, homes: 3416 },
      { type: "Specialist/supported",        pct: 10, homes: 2135 },
    ],
    by_bedrooms: [
      { bedrooms: "Studio / 1 bed", homes: 5124, pct: 24, notes: "Singles, NDIS supported housing, transitional" },
      { bedrooms: "2 bed",          homes: 7265, pct: 34, notes: "Single parents, couples, small families" },
      { bedrooms: "3 bed",          homes: 5975, pct: 28, notes: "Families with children" },
      { bedrooms: "4+ bed",         homes: 2986, pct: 14, notes: "Large families, First Nations remote housing" },
    ],
    delivery_pipeline: [
      { milestone: "Round 3 launched",       date: "23 Nov 2025", status: "complete" },
      { milestone: "Applications opened",    date: "30 Jan 2026", status: "complete" },
      { milestone: "Applications assessed",  date: "Mid 2026",    status: "underway" },
      { milestone: "Contracts executed",     date: "Late 2026",   status: "projected" },
      { milestone: "Construction commenced", date: "2027",        status: "projected" },
      { milestone: "Full delivery target",   date: "2030–31",     status: "projected" },
    ],
  },
}

export interface HaffSummary {
  total_homes: number
  total_social: number
  total_affordable: number
  total_grants_m: number
  total_projects: number
  pct_of_5yr_target: number
  remaining_to_target: number
}

export function getHaffSummary(): HaffSummary {
  const rounds = Object.values(HAFF_ROUNDS)
  const total_homes = rounds.reduce((s, r) => s + r.total_homes, 0)
  const total_social = rounds.reduce((s, r) => s + r.social_homes, 0)
  const total_affordable = rounds.reduce((s, r) => s + r.affordable_homes, 0)
  const total_grants_m = rounds.reduce((s, r) => s + r.grants_total_m, 0)
  const total_projects = rounds.reduce((s, r) => s + r.projects, 0)
  const pct_of_5yr_target = Math.round((total_homes / HAFF_OVERVIEW.five_year_target_homes) * 100)

  return {
    total_homes,
    total_social,
    total_affordable,
    total_grants_m,
    total_projects,
    pct_of_5yr_target,
    remaining_to_target: HAFF_OVERVIEW.five_year_target_homes - total_homes,
  }
}

export interface HaffStateTotals {
  state: string
  projects: number
  homes: number
  social: number
  affordable: number
  grant_m: number
}

export function getStateTotals(): HaffStateTotals[] {
  const stateTotals: Record<string, HaffStateTotals> = {}
  for (const rdata of Object.values(HAFF_ROUNDS)) {
    for (const s of rdata.by_state) {
      if (!stateTotals[s.state]) {
        stateTotals[s.state] = { state: s.state, projects: 0, homes: 0, social: 0, affordable: 0, grant_m: 0 }
      }
      stateTotals[s.state].projects += s.projects
      stateTotals[s.state].homes += s.homes
      stateTotals[s.state].social += s.social
      stateTotals[s.state].affordable += s.affordable
      stateTotals[s.state].grant_m += s.grant_m
    }
  }
  return Object.values(stateTotals).sort((a, b) => b.homes - a.homes)
}
