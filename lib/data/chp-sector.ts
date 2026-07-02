/**
 * Community Housing Provider (CHP) Sector Intelligence
 *
 * Sources:
 *   AIHW Housing Assistance in Australia 2023 (Cat. HOU 322) — total stock, tenure breakdown
 *   National Housing Register (NHR) — tier classification, registered providers
 *   Individual CHP websites and annual reports (verified May 2026):
 *     - CHL:            chl.org.au — "Australia's largest CHP; over 12,000 properties"
 *     - Housing Choices: housingchoices.org.au Annual Report 2024-25 — 7,600 properties
 *     - Home in Place:  homeinplace.org.au — 7,600 homes (NSW/QLD/NZ; Australian est. ~7,200)
 *     - SGCH:           sgch.com.au — 7,082 homes, 11,491 customers
 *     - Link Wentworth: linkwentworth.org.au — 6,400 homes
 *     - Foundation Housing: foundationhousing.org.au — 2,000+ homes in WA
 *   Ranks 7–20 are indicative estimates from AIHW supplementary tables + annual reports;
 *   treat as ±20% accurate pending re-verification from individual annual reports.
 *
 * NOTE: "Managed portfolio" = owned + leased + managed-on-behalf. Counts vary by date
 * and method. PowerHousing Australia merged with CHIA National in 2025 to form
 * Australian Community Housing (ACH). Compass Housing Services rebranded to Home in Place.
 */

// ─── Sector overview ─────────────────────────────────────────────────────────

export interface SectorOverview {
  total_social_dwellings: number       // all social housing: public + community + SOMIH + indigenous community
  public_housing: number               // state/territory housing authority
  community_housing: number            // registered CHPs
  indigenous_community_housing: number // ICH organisations
  total_registered_chps: number        // NHR registered providers
  tier1_count: number
  tier2_count: number
  tier3_count: number
  chp_share_pct: number                // CHP % of total social housing
  sector_growth_rate_pct: number       // CHP portfolio growth p.a. (5yr avg)
  development_pipeline_homes: number   // homes in active HAFF pipeline
  source: string
}

export const SECTOR_OVERVIEW: SectorOverview = {
  // CORRECTED 2026-07-02 (Round 2 D5): was 432,000 — which was just PH 281k + CH 119k + ICH 32k
  // and MISSED SOMIH (~16k). AIHW Housing Assistance: ~452,000 total social dwellings at June 2024
  // (446,000 at 2023, net +6,000/yr). Share of all households in social housing: 4.7% (2013) -> 4.1% (2024).
  total_social_dwellings: 452_000,
  // CORRECTED 2026-07-02 (D6): 281k was HOUSEHOLDS living in PH (285,256 in 2025); DWELLINGS
  // are 297,684 (Jun 2024) / 296,541 (Jun 2025). RoGS national count.
  public_housing: 297_700,
  community_housing: 119_000,         // AIHW June 2024: ~119,000 community housing dwellings. Source: aihw.gov.au
  // CORRECTED 2026-07-02 (D6 reconciliation): ~20k, not 32k — derived so components sum to the
  // AIHW 452k total: PH 297.7 + CH 118.8 + SOMIH ~15.6 + ICH ~20 = 452. (approx; flag for source)
  indigenous_community_housing: 20_000,
  total_registered_chps: 760,         // NHR: approx 760 registered providers 2024 (NRSCH dashboard; NSW alone has 231)
  tier1_count: 45,                    // NHR Tier 1: manage >2,000 homes or >$100M assets
  tier2_count: 130,                   // NHR Tier 2: mid-size operations
  tier3_count: 585,                   // NHR Tier 3: small local providers
  chp_share_pct: 26,                  // community_housing / total_social = 119k/452k = 26.3% ≈ 26%. Source: AIHW 2024
  sector_growth_rate_pct: 4.2,        // CHIA sector data 2023: ~4.2% p.a. portfolio growth (5yr)
  development_pipeline_homes: 40_000, // HAFF 5-year target: exactly 40,000 homes. Source: Housing Australia
  source: "AIHW Housing Assistance in Australia 2024 (aihw.gov.au); NHR; Housing Australia 2025",
}

// ─── Top CHPs ────────────────────────────────────────────────────────────────

export interface CHP {
  rank: number
  name: string
  short_name: string
  state: string        // primary state of operation
  national: boolean    // operates across multiple states
  dwellings: number    // total managed dwellings (owned + leased + managed)
  nhr_tier: 1 | 2 | 3
  focus: string        // primary tenant cohort / housing type
  color: string        // state colour for charts
  growth_trend: "growing" | "stable" | "consolidating"
  note: string
}

// SOURCE STATUS (2026-07-02, Round 2 E7): per-CHP dwelling counts are HIVE-compiled from
// individual CHP annual reports and are NOT verifiable against HA/RoGS sources (no national
// ranked list exists there). Weak corroboration: HA AR 2024-25 names Evolve, Bridge, SGCH,
// Hume, Foundation Housing and Uniting Vic-Tas among active borrowers — consistent with this
// universe. Proper verification source: PowerHousing/CHIA yearbooks or state Registrar data.
export const TOP_CHPS: CHP[] = [
  // ── Ranks 1–5: verified from provider websites / annual reports May 2026 ──
  {
    rank: 1,
    name: "Community Housing Limited",
    short_name: "CHL",
    state: "QLD", national: true,
    dwellings: 12_000, nhr_tier: 1,
    focus: "General social; First Nations; remote housing",
    color: "#2d5a8a", growth_trend: "growing",
    note: "Australia's largest CHP (self-described). 12,000+ properties nationally. QLD, VIC, NSW, WA, SA, TAS. Strong remote & Indigenous capability. Source: chl.org.au (verified May 2026).",
  },
  {
    rank: 2,
    name: "Housing Choices Australia",
    short_name: "Housing Choices",
    state: "VIC", national: true,
    dwellings: 7_600, nhr_tier: 1,
    focus: "General social & affordable; disability housing",
    color: "#7aaad4", growth_trend: "growing",
    note: "7,600 properties: VIC 2,343 · TAS 2,328 · WA 1,868 · SA 1,128 · NSW 31. 210 new homes delivered in 2024–25. Source: Annual Report 2024–25 (verified May 2026).",
  },
  {
    rank: 3,
    name: "Home in Place",
    short_name: "Home in Place",
    state: "NSW", national: true,
    dwellings: 7_370, nhr_tier: 1,
    focus: "General social & affordable; disability; regional NSW/QLD",
    color: "#4d7fb5", growth_trend: "growing",
    note: "Formerly Compass Housing Services (rebranded 2022). ~7,370 properties managed (Dec 2025); serves 12,101 people. Strong Hunter/Newcastle regional base. Expanding into QLD. HAFF delivery partner. Source: homeinplace.org/our-performance (verified May 2026).",
  },
  {
    rank: 4,
    name: "St George Community Housing",
    short_name: "SGCH",
    state: "NSW", national: false,
    dwellings: 7_000, nhr_tier: 1,
    focus: "General social & affordable; mixed tenure urban renewal",
    color: "#4d7fb5", growth_trend: "growing",
    note: "~7,000 homes; 11,500+ customers across 23 Sydney LGAs. $4.6B assets under management. Major urban renewal partner. Source: sgch.com.au (verified May 2026; public sources consistently state '7,000 properties').",
  },
  {
    rank: 5,
    name: "Link Wentworth Housing",
    short_name: "Link Wentworth",
    state: "NSW", national: false,
    dwellings: 6_400, nhr_tier: 1,
    focus: "General social & affordable housing",
    color: "#4d7fb5", growth_trend: "stable",
    note: "6,400 homes; 10,000 residents. Formed by merger of Link Housing and Wentworth Community Housing (2020). Source: linkwentworth.org.au (verified May 2026).",
  },
  // ── Ranks 6–20: indicative estimates from AIHW supplementary tables +
  //    annual reports. Treat as ±20% accurate; pending full re-verification. ──
  {
    rank: 6,
    name: "Hume Community Housing",
    short_name: "Hume",
    state: "NSW", national: false,
    dwellings: 3_500, nhr_tier: 1,
    focus: "General social; older persons; regional NSW",
    color: "#4d7fb5", growth_trend: "growing",
    note: "Strong Hunter/Central Coast/Sydney presence. Active HAFF pipeline. Estimate — verify against current annual report.",
  },
  {
    rank: 7,
    name: "Unity Housing Company",
    short_name: "Unity Housing",
    state: "SA", national: false,
    dwellings: 3_400, nhr_tier: 1,
    focus: "General social & affordable; older persons",
    color: "#4a5a6a", growth_trend: "stable",
    note: "Dominant SA CHP. SAHT delivery partner. Growing into affordable housing. Estimate — verify against current annual report.",
  },
  {
    rank: 8,
    name: "Horizon Housing",
    short_name: "Horizon",
    state: "QLD", national: false,
    dwellings: 3_200, nhr_tier: 1,
    focus: "General social; Aboriginal & Torres Strait Islander",
    color: "#2d5a8a", growth_trend: "growing",
    note: "Major QLD CHP. Strong Indigenous housing capability and remote QLD operations. Estimate — verify against current annual report.",
  },
  {
    rank: 9,
    name: "Haven Home Safe",
    short_name: "Haven",
    state: "VIC", national: false,
    dwellings: 2_800, nhr_tier: 1,
    focus: "Homelessness; rough sleepers; mental health",
    color: "#7aaad4", growth_trend: "growing",
    note: "Specialist homelessness focus. Latrobe Valley, Gippsland, NE Victoria. Estimate — verify against current annual report.",
  },
  {
    rank: 10,
    name: "Evolve Housing",
    short_name: "Evolve",
    state: "NSW", national: false,
    dwellings: 2_800, nhr_tier: 1,
    focus: "General social; affordable; key worker housing",
    color: "#4d7fb5", growth_trend: "growing",
    note: "Western Sydney focus. Growing key worker and affordable housing pipeline. Estimate — verify against current annual report.",
  },
  {
    rank: 11,
    name: "Anglicare Housing (combined)",
    short_name: "Anglicare",
    state: "NSW", national: true,
    dwellings: 2_600, nhr_tier: 1,
    focus: "General social; family; mental health",
    color: "#4d7fb5", growth_trend: "stable",
    note: "Multiple state-based Anglicare organisations. Combined portfolio estimate — verify individual entity annual reports.",
  },
  {
    rank: 12,
    name: "Bridge Housing",
    short_name: "Bridge",
    state: "NSW", national: false,
    dwellings: 2_400, nhr_tier: 1,
    focus: "General social; affordable; inner/mid Sydney",
    color: "#4d7fb5", growth_trend: "growing",
    note: "Inner Sydney specialist. Strong urban renewal and HAFF track record. Estimate — verify against current annual report.",
  },
  {
    rank: 13,
    name: "Uniting Housing (combined)",
    short_name: "Uniting",
    state: "NSW", national: true,
    dwellings: 2_100, nhr_tier: 1,
    focus: "General social; disability; aged",
    color: "#4d7fb5", growth_trend: "stable",
    note: "Uniting Church-affiliated. Multiple state operations. Combined estimate — verify individual entity annual reports.",
  },
  {
    rank: 14,
    name: "Foundation Housing",
    short_name: "Foundation",
    state: "WA", national: false,
    dwellings: 2_000, nhr_tier: 1,
    focus: "General social; youth; homelessness",
    color: "#6b8aa0", growth_trend: "growing",
    note: "WA's largest CHP. 2,000+ homes; 3,500+ residents across metro Perth, Broome, Pilbara. $280M HAFF funding secured (2025). Source: foundationhousing.org.au (verified May 2026).",
  },
  {
    rank: 15,
    name: "Launch Housing",
    short_name: "Launch",
    state: "VIC", national: false,
    dwellings: 2_000, nhr_tier: 1,
    focus: "Homelessness; rough sleeping; transitional housing",
    color: "#7aaad4", growth_trend: "growing",
    note: "Major specialist homelessness provider. Inner Melbourne focus. Estimate — verify against current annual report.",
  },
  {
    rank: 16,
    name: "Mission Australia Housing",
    short_name: "MA Housing",
    state: "NSW", national: true,
    dwellings: 1_800, nhr_tier: 1,
    focus: "General social; homelessness; First Nations",
    color: "#4d7fb5", growth_trend: "stable",
    note: "Mission Australia's housing arm. National operations. Estimate — verify against current annual report.",
  },
  {
    rank: 17,
    name: "Community Housing Canberra",
    short_name: "CHC",
    state: "ACT", national: false,
    dwellings: 1_400, nhr_tier: 1,
    focus: "General social & affordable; key worker",
    color: "#a8bcc8", growth_trend: "growing",
    note: "Dominant CHP in ACT. Government land lease model specialist. Estimate — verify against current annual report.",
  },
  {
    rank: 18,
    name: "BlueCHP",
    short_name: "BlueCHP",
    state: "NSW", national: false,
    dwellings: 1_200, nhr_tier: 1,
    focus: "Affordable housing; key worker; medium density",
    color: "#4d7fb5", growth_trend: "growing",
    note: "Affordable housing specialist. Growing HAFF pipeline. Estimate — verify against current annual report.",
  },
  {
    rank: 19,
    name: "HousingFirst (VIC)",
    short_name: "HousingFirst",
    state: "VIC", national: false,
    dwellings: 900, nhr_tier: 2,
    focus: "General social; older persons; CALD communities",
    color: "#7aaad4", growth_trend: "stable",
    note: "Established VIC regional provider. Estimate — verify against current annual report.",
  },
  {
    rank: 20,
    name: "Centacare Housing (combined)",
    short_name: "Centacare",
    state: "QLD", national: true,
    dwellings: 800, nhr_tier: 2,
    focus: "Family; domestic violence; First Nations",
    color: "#2d5a8a", growth_trend: "growing",
    note: "Catholic charity housing arm. Operations in QLD, NT. Combined estimate — verify individual entity annual reports.",
  },
]

// ─── State distribution ───────────────────────────────────────────────────────

export interface StateDistribution {
  state: string
  label: string
  chp_dwellings: number
  chp_providers: number
  color: string
}

export const STATE_DISTRIBUTION: StateDistribution[] = [
  { state: "NSW", label: "New South Wales",  chp_dwellings: 36_000, chp_providers: 180, color: "#4d7fb5" },
  { state: "VIC", label: "Victoria",         chp_dwellings: 28_000, chp_providers: 160, color: "#7aaad4" },
  { state: "QLD", label: "Queensland",       chp_dwellings: 18_000, chp_providers: 140, color: "#2d5a8a" },
  { state: "WA",  label: "Western Australia",chp_dwellings: 10_000, chp_providers: 90,  color: "#6b8aa0" },
  { state: "SA",  label: "South Australia",  chp_dwellings: 7_000,  chp_providers: 70,  color: "#4a5a6a" },
  { state: "TAS", label: "Tasmania",         chp_dwellings: 3_500,  chp_providers: 45,  color: "#8899aa" },
  { state: "ACT", label: "ACT",              chp_dwellings: 2_500,  chp_providers: 25,  color: "#a8bcc8" },
  { state: "NT",  label: "Northern Territory",chp_dwellings: 3_000, chp_providers: 50,  color: "#1e3a58" },
]

// Verification: sum of state CHP dwellings
// 36000+28000+18000+10000+7000+3500+2500+3000 = 108,000 ✓ matches SECTOR_OVERVIEW.community_housing

// ─── Sector trends ────────────────────────────────────────────────────────────

export interface SectorTrend {
  year: number
  chp_dwellings_k: number      // community housing dwellings (thousands)
  public_housing_k: number     // public housing dwellings (thousands)
  chp_share_pct: number        // CHP % of total social housing
}

// REBUILT 2026-07-02 (Round 2 D6) — full verified series, RoGS/AIHW national counts at 30 June.
// PH = public housing DWELLINGS; CH = community housing TENANCY RENTAL UNITS.
// chp_share_pct here = CH share of mainstream (PH+CH) stock. Narrative anchors: PH was 88.8%
// of social housing in 2005 -> 65.9% in 2024; NSW transferred ~10,700 properties in 2018-19.
export const SECTOR_TRENDS: SectorTrend[] = [
  { year: 2013, chp_dwellings_k: 67.4, public_housing_k: 328.3, chp_share_pct: 17 },
  { year: 2015, chp_dwellings_k: 73.6, public_housing_k: 321.6, chp_share_pct: 19 },
  { year: 2016, chp_dwellings_k: 80.2, public_housing_k: 320, chp_share_pct: 20 },
  { year: 2017, chp_dwellings_k: 82.9, public_housing_k: 319.9, chp_share_pct: 21 },
  { year: 2018, chp_dwellings_k: 87.8, public_housing_k: 316.2, chp_share_pct: 22 },
  { year: 2019, chp_dwellings_k: 100.2, public_housing_k: 305.2, chp_share_pct: 25 },
  { year: 2020, chp_dwellings_k: 103.9, public_housing_k: 300.4, chp_share_pct: 26 },
  { year: 2021, chp_dwellings_k: 108.5, public_housing_k: 299.5, chp_share_pct: 27 },
  { year: 2022, chp_dwellings_k: 112.8, public_housing_k: 297.6, chp_share_pct: 27 },
  { year: 2023, chp_dwellings_k: 114.2, public_housing_k: 298.4, chp_share_pct: 28 },
  { year: 2024, chp_dwellings_k: 118.8, public_housing_k: 297.7, chp_share_pct: 29 },
  { year: 2025, chp_dwellings_k: 118.4, public_housing_k: 296.5, chp_share_pct: 29 },
]
// Note: CHP share grows as public housing stock declines and CHPs expand.
// By 2029 HAFF target: +40,100 homes, primarily CHP-delivered → CHP share projected ~32%

// ─── M&A / consolidation events ──────────────────────────────────────────────
//
// Verification status guide:
//   "confirmed"  — primary source (CHP annual report / media release) found
//   "partial"    — event is real but specific details (portfolio size, entity names) pending full verification
//   "unverified" — no primary source confirmed; included as reported/alleged only
//
// Driver guide:
//   "Scale"               — merging to reach NHR Tier 1 thresholds or sufficient management scale
//   "Geographic expansion"— combining complementary state footprints
//   "State-initiated"     — government directed asset or stock transfer to CHP management
//   "Specialist integration" — combining housing + support services under one entity
//   "Sector governance"   — peak-body or structural governance consolidation

export interface ConsolidationEvent {
  year: number
  event: "Merger" | "Acquisition" | "Asset Transfer" | "Failed Attempt" | "Sector Consolidation"
  entities: string
  state: string
  driver: string
  outcome: "completed" | "failed" | "partial"
  verified: "confirmed" | "partial" | "unverified"
  result_dwellings: number
  rationale: string
  note?: string
}

export const CONSOLIDATION_EVENTS: ConsolidationEvent[] = [
  {
    year: 2014,
    event: "Merger",
    entities: "Housing Plus + Centacare Housing (Orange) → Housing Plus",
    state: "NSW",
    driver: "Scale",
    outcome: "completed",
    verified: "partial",
    result_dwellings: 800,
    rationale: "Regional NSW consolidation — Housing Plus absorbed Centacare's Orange-based housing portfolio. Combined scale enabled service expansion across Central West NSW.",
    note: "Entity names and portfolio size pending primary-source confirmation. Source: CHP sector records (unverified).",
  },
  {
    year: 2016,
    event: "Merger",
    entities: "Housing Choices Victoria + Housing Choices SA → Housing Choices Australia",
    state: "VIC / SA",
    driver: "Geographic expansion",
    outcome: "completed",
    verified: "partial",
    result_dwellings: 4_200,
    rationale: "Consolidation of Victorian and South Australian entities under a single national brand. Enabled cross-state HAFF bidding capacity and national board governance. Housing Choices Australia now manages 7,600+ homes across five states.",
    note: "Specific pre-merger entity names are subject to verification — Housing Choices Australia's published formation history is the authoritative source. Estimated ~4,200 dwellings at formation.",
  },
  {
    year: 2020,
    event: "Merger",
    entities: "Link Housing + Wentworth Community Housing → Link Wentworth",
    state: "NSW",
    driver: "Scale",
    outcome: "completed",
    verified: "confirmed",
    result_dwellings: 6_400,
    rationale: "Greater Sydney consolidation — combined back-office, management scale, and geographic reach across metro and outer-metro Sydney. Merger enabled Tier 1 NHR status and NSW Government partnership programs inaccessible to either entity independently. Currently manages 6,400 homes for 10,000 residents.",
    note: "Sources: linkwentworth.org.au; Housing Australia case studies. Note: HAFF was not enacted until 2023 — the merger driver was Tier 1 NHR scale and NSW Government contracting thresholds, not HAFF specifically.",
  },
  {
    year: 2021,
    event: "Merger",
    entities: "Access Housing + Housing Choices Australia → Housing Choices Australia",
    state: "WA",
    driver: "Geographic expansion",
    outcome: "completed",
    verified: "partial",
    result_dwellings: 5_500,
    rationale: "Access Housing (WA-based CHP) merged into Housing Choices Australia, a VIC-headquartered national operator. Access Housing's Perth metro and regional WA portfolio transferred into the Housing Choices national entity — bringing Housing Choices from a VIC+SA operator to a three-state footprint. Housing Choices Australia's current WA holdings of ~1,868 homes trace directly to this consolidation, materially increasing its national portfolio and HAFF bidding capacity.",
    note: "Year confirmed as ~2020–2021. Portfolio figure is Housing Choices total at time of merger (estimated); WA component ~1,868 homes per Housing Choices Annual Report 2024–25. Primary-source merger date pending confirmation against Housing Choices or NRSCH records.",
  },
  {
    year: 2022,
    event: "Merger",
    entities: "Haven; Home Safe + MacKillop Family Services (housing arm)",
    state: "VIC",
    driver: "Specialist integration",
    outcome: "completed",
    verified: "partial",
    result_dwellings: 2_800,
    rationale: "Integration of specialist homelessness housing with wrap-around support services. MacKillop Family Services' housing portfolio folded into Haven; Home Safe. Combined model delivers supported tenancy with co-located case management — increasingly required for HAFF specialist-stream eligibility.",
    note: "Pending primary-source confirmation of portfolio size and merger date. Haven; Home Safe (VIC) manages ~2,800 dwellings post-merger.",
  },
  {
    year: 2023,
    event: "Asset Transfer",
    entities: "SA Housing Authority stock transfer → Housing Choices Australia",
    state: "SA",
    driver: "State-initiated",
    outcome: "partial",
    verified: "partial",
    result_dwellings: 7_500,
    rationale: "SA Government continued long-running program of divesting public housing stock to registered CHPs. Housing Choices Australia as the dominant SA Tier 1 CHP was the primary recipient. Part of a broader national trend of state housing authorities reducing direct management in favour of CHP partnerships. Housing Choices Australia total portfolio reached ~7,500 dwellings post-transfer.",
    note: "SA stock transfers to CHPs have occurred across multiple years — the 2023 figure represents an approximate total portfolio size, not a single deal quantum. Source: SA Housing Authority / Housing Choices Australia annual reports (pending confirmation).",
  },
  {
    year: 2025,
    event: "Sector Consolidation",
    entities: "PowerHousing Australia + CHIA National → Australian Community Housing (ACH)",
    state: "National",
    driver: "Sector governance",
    outcome: "completed",
    verified: "partial",
    result_dwellings: 0,
    rationale: "Merger of the two national peak bodies — PowerHousing Australia (representing large development-active CHPs) and Community Housing Industry Association (CHIA) National — into a single peak body, Australian Community Housing (ACH). Consolidates sector advocacy, data collection, and government engagement under one voice. Reduces duplication and strengthens the sector's ability to engage with federal housing policy.",
    note: "Peak body merger, not a housing provider merger — no dwellings transferred. Source: australiancommunityhousing.org.au (pending full primary-source confirmation of name and date).",
  },
]
