# HIVE Data Manual — every chart & metric, traced

The single source of truth for **every graph/chart/headline number on every HIVE
page**: where each figure comes from, exactly how it's calculated, and how often
it refreshes. No detail omitted. Pairs with `DATA_REFRESH_MATRIX.md` (cadence)
and `VALIDATION_SPEC.md` (pass/fail bar).

**How each item is documented**

> **Chart/metric name** — what it shows
> - **Data file:** `lib/data/<file>.ts` → field(s) used
> - **Primary source:** agency · dataset · Cat no. · release/year (from the data file header)
> - **Calculation:** the transform from raw source → the plotted/displayed number (reproducible)
> - **Cadence + re-run trigger:** how often the source publishes / when to refresh
> - **Status:** ✅ traced / 🟡 needs source confirm / 🔴 unverified

Legend for charts: 📊 bar · 📈 line · 🥧 pie · 🔀 composed · 🟦 area · 🔢 KPI card · 📋 table

---

## Page index (scope — nothing below may be skipped)

| Page (`app/…/page.tsx`) | Data file(s) | Charts | Status |
|---|---|---|---|
| **live-dashboard** (Housing Data) | shs, building-approvals, housing-need, haff, construction, chp-sector | 2🟦 3📊 2📈 + KPIs | 🟡 traced (§2) |
| **housing-need** | housing-need | 3📊 + KPIs/tables | 🟡 traced (§1 below) |
| **state-demand-supply** (Supply Pipeline) | population, state-analysis | 7📊 1🔀 3📈 | 🟡 traced (§3) |
| **population** | population | 1📊 1🔀 1📈 | ✅ traced (§4) |
| **feasibility** (Development Viability) | feasibility | 1📊 + calculators | 🟡 traced (§5) — full engine |
| **funding-sector** (Funding & Programs) | funding, haff, chp-sector, construction | 5📊 2📈 2🥧 | 🟡 traced (§6) |
| **asset-intelligence** | asset-intelligence, climate-risk | KPIs/score tables | ⬜ TODO |
| **climate-risk** | climate-risk | KPIs/score tables | ⬜ TODO |
| **building-energy** | building-energy | KPIs/tables | ⬜ TODO |
| **livable-housing** | livable-housing | KPIs/tables | ⬜ TODO |
| **esg-impact** | esg | KPIs/tables | ⬜ TODO |
| **sustainability** (hub) | building-energy, livable-housing, esg, asset-intelligence | rollup KPIs | ⬜ TODO |
| **research** (Evidence & Policy) | policy-timeline, programs | scorecard, timeline, KPIs | ⬜ TODO |
| **my-portfolio** | climate-risk | per-asset metrics | ⬜ TODO |

> Redirect stubs (haff→, ask-research→, etc.) carry no charts of their own.

---

<!-- ============================================================= -->
<!-- Sections below are filled page-by-page. Each chart/metric on   -->
<!-- the page gets its own entry. Do not mark a page ✅ until every  -->
<!-- chart AND every KPI card on it is documented.                  -->
<!-- ============================================================= -->

# 1. Housing Need  (`app/housing-need/page.tsx` → `lib/data/housing-need.ts`)

**Sources declared in the data file header:** ABS Census 2021 · ABS Survey of
Income & Housing (SIH) 2021-22 · AIHW Specialist Homelessness Services (SHS)
2022-23 · AHURI *Estimating Core Housing Need* 2023 · Productivity Commission
*Report on Housing* 2024 · NHSAC 2024 · CoreLogic/PropTrack 2024 · DSS/AIHW
*People with Disability* 2023 · AIHW *First Nations housing* 2024 · ANROWS *DV &
Homelessness* 2023. **All values are hard-coded constants transcribed from these
sources — they are not computed at runtime except where a formula is shown.**

### §1 · National Snapshot — 🔢 KPI cards
- **Data:** `STRESS_SUMMARY`, `HOMELESSNESS_LAYERS`, `ABS_CENSUS_HOMELESS_TOTAL`.
- **Figures & source:** 1.31M in rental stress, 640k severe (ABS SIH 2021-22) · 740k core housing need (AHURI 2023) · 122,494 homeless on Census night (ABS Census 2021) · 213,000 social-housing waitlist (state registers; stored in `TENURE_TYPES` note).
- **Calculation (derived, page.tsx:95-97):**
  - `gap = median_market_rent_pw_2024 − round(median_renter_income_k×1000 ÷ 52 × 0.30)` = 600 − round(65,000÷52×0.30) = **$225/wk** (market rent minus the 30%-of-income affordable rent).
  - `craCovers = round(cra_max_single_pw ÷ gap × 100)` = round(94÷225×100) = **42%** (share of the gap that max Commonwealth Rent Assistance covers).
- **Cadence:** SIH ~annual · Census 5-yr (next 2026) · AHURI ad-hoc · CRA annual.
- **Shared visual calc — `StatBar` (page.tsx:58):** every KPI bar meter on this page fills to `pct = min(100, value ÷ max × 100)` (capped at 100). Presentation only — does not change the underlying figure.
- **Status:** 🟡 (confirm SIH stress figures + waitlist 213k against current state-register totals).

### §2 · How Australia Lives
- **📊 BarChart (horizontal) — Household composition** (page.tsx:229) — `data = HOUSEHOLD_TYPES`, bar = `pct`. Couple w/children 31%, couple no-children 28%, lone-person 27%, single-parent 11%, other 3%. **Source:** ABS Census 2021. **Calc:** direct % of households from Census; `count_m` = pct × ~10.9M total households. **Cadence:** Census 5-yr.
- **📋 Tenure breakdown** (page.tsx:259-272) — `TENURE_TYPES`. Owner-no-mortgage 31% · owner-with-mortgage 35% · private renter 26% · social housing 4% · other 4%. **Source:** ABS Census 2021. **Calc:** direct %. **Cadence:** Census 5-yr.

### §3 · Rental Stress Spectrum
- **📊 BarChart — Stress by income quintile** (page.tsx:352) — `data = stressChartData` (from `RENTAL_STRESS_BY_QUINTILE.map`), bars = `stress_pct` ("In rental stress") + `severe_stress_pct` ("Severe stress"). Q1 83%/68% … Q5 2%/0%. **Source:** ABS SIH 2021-22. **Calc per quintile:** `affordable_rent_pw = median_income_k×1000 ÷ 52 × 0.30`; stress_pct = % of quintile's renters paying >30% of income; severe = >50%. `median_market_rent_pw` held at 600 (PropTrack 2024 capital-city median). **Cadence:** SIH ~annual · rents quarterly (PropTrack).
- **🔢 CRA bridge text** — max CRA ~$94/wk covers `craCovers`% of the gap (see §1 calc).

### §4 · The Six Cohorts the market fails  (Pro-gated detail)
- **📋 Cohort cards** — `VULNERABLE_COHORTS` (lone-person, single-parent, aged 65+, disability, First Nations, DV survivors). Each: scale, population %, waitlist_share_pct, key_facts, what_they_need. **Source:** mixed — ABS Census (scale/%), AIHW SHS (waitlist shares, DV %), DSS/AIHW (disability), AIHW First Nations 2024, ANROWS (DV). **Calc:** transcribed source figures, no runtime math. **Cadence:** Census 5-yr + AIHW annual.

### §5 · SHS Client Profile
- **🔢 Profile vs population cards** (page.tsx:541) — `SHS_CLIENT_PROFILE`: Female 57% (pop 50) · First Nations 25% (pop 3.5 → 7× over-rep) · disability 42% (pop 18) · under-25 28% · w/children 45%. **Source:** AIHW SHS 2022-23. **Calc:** over-representation = client_pct ÷ population_pct. **Cadence:** AIHW annual (~Dec).
- **📊 BarChart — Presenting reasons by gender** (page.tsx:584) — `data = SHS_PRESENTING_REASONS[genderTab]`, bar = `pct`. Women: DV 43%, financial 22%… Men: financial 38%, housing crisis 24%… **Source:** AIHW SHS 2022-23. **Calc:** direct %. **Cadence:** AIHW annual.

### §6 · Typology Mismatch
- **📋 Need-vs-supply rows** (page.tsx:634) — `TYPOLOGY_MISMATCH` (bedroom size, location, accessibility, tenure security) each with need_pct vs supply_pct. `radarData` (page.tsx:113) just re-maps each row to `{dimension: first word, Need: need_pct, Supply: supply_pct}` for a radar/paired view — **no new computation**; the gap is shown visually as the Need-vs-Supply spread, not calculated. **Source:** composite — ABS Census (bedroom/location), AIHW (accessibility/disability 42%/97%), tenancy norms. **Calc:** values transcribed from source. **Cadence:** Census 5-yr / AIHW annual.

### §7 · Hidden Homelessness Iceberg
- **📋 Layered iceberg** (page.tsx:715) — `HOMELESSNESS_LAYERS`: rough sleeping 8,200 · crisis accom 21,000 · boarding 18,700 · severe overcrowding 14,400 · couch-surfing 47,400 (ABS Census 2021 categories; crisis = AIHW) → hidden: AHURI estimate 400,000 · core need 740,000 (AHURI 2023). Headline `ABS_CENSUS_HOMELESS_TOTAL = 122,494`. **Calc:** Census-night counts (visible) vs AHURI modelled estimates (hidden) — note the two methodologies differ. **Cadence:** Census 5-yr · AIHW annual · AHURI ad-hoc.

**Page status:** 🟡 — every chart/metric traced; confirm the SIH stress %s, the 213k waitlist, and AHURI 400k/740k against latest releases (NotebookLM check).

# 2. Housing Data / Live Dashboard  (`app/live-dashboard/page.tsx`)

**Data files:** `shs`, `building-approvals`, `housing-need`, `haff`,
`construction`, `chp-sector`.
**Sources:** AIHW SHS Annual Reports (shs) · ABS Building Approvals **Cat. 8731.0**, Table 8731009 (building-approvals) · ABS SIH 2021-22 (housing-need) · Housing Australia media releases + Senate Estimates + Budget Papers 2023-24→2025-26 (haff) · ABS **Cat. 6427.0** + Rawlinsons + AIHW + UNSW City Futures (construction) · AIHW *Housing Assistance in Australia 2023* **Cat. HOU 322** + National Housing Register + individual CHP annual reports (chp-sector).

### Gauge — Annual approvals vs target (🔢 top gauge, page.tsx:47-78)
- **Data:** `approvals = getBuildingApprovalsSummary()` → `annual_run_rate` vs target.
- **Calc:** `annual_run_rate` = **trailing 12-month sum of total dwellings approved nationally** (ABS standard, per building-approvals.ts methodology header). Display `(value/1000).toFixed(0)`k; gap badge `(|gap|/1000).toFixed(0)`k below/above target.
- **Gauge geometry (presentation trig, lines 47-63):** `fillDeg = pct/100×180`; `fillRad = π − fillDeg×π/180`; needle `valX=cx+r·cos(fillRad)`, `valY=cy−r·sin(fillRad)`; ticks `tickRad = π − tick/100×π`. Draws the semicircle only — does not alter the value.
- **Cadence:** ABS 8731.0 **monthly** (~12th-15th of following month); auto-refreshed by `scripts/refresh-data.mjs`.

### 📈 Building approvals trend + 12-month MA (LineChart, page.tsx:414)
- **Data:** `recentApprovals` = `approvalsWithMA.slice(-36)` (last 36 months), each `{date, total: total_aus, ma12}`.
- **Calc (lines 111-114):** for month *i*, `slice = BUILDING_APPROVALS[max(0,i-11) … i]`; **`ma12 = round(Σ slice.total_aus ÷ slice.length)`** = trailing 12-month moving average.
- **Derived KPI:** `fiveYearProjection = round(annual_run_rate × 5 ÷ 10000) × 10000` (5-yr projection, rounded to nearest 10,000).
- **Source/cadence:** ABS 8731.0, monthly.

### 📊 Rental stress by quintile (BarChart, page.tsx:293)
- **Data:** `rentalStressData = RENTAL_STRESS_BY_QUINTILE.map` → `stress_pct`. **Source:** ABS SIH 2021-22 (see §1·§3). **Calc:** direct. **Cadence:** SIH ~annual.

### 📊 SHS outcomes, last 6 years (BarChart, page.tsx:325)
- **Data:** `shsBarData = SHS_DATA.slice(-6).map` → clients / needing_housing / got_housing per year; `latestSHS = SHS_DATA[last]`. **Source:** AIHW SHS Annual Reports. **Calc:** slice last 6; fields direct. **Cadence:** AIHW annual (~Dec).

### 📈 Social-housing waitlist by state (LineChart, page.tsx:471)
- **Data:** `waitlistChartData = years.map(...)` over `WAITLIST_DATA` (per state, per year applicants). **Derived KPI:** `waitlistTotal = Σ WAITLIST_DATA[year=2024].applicants` (national 2024 total). **Source:** state social-housing registers (in `shs.ts`). **Calc:** per-state series + national sum. **Cadence:** per-register (~annual).

### 📊 HAFF homes by state (BarChart, page.tsx:533)
- **Data:** `haffStates = getStateTotals().sort(homes desc)`; `haffSummary = getHaffSummary()`. **Derived KPI:** `avgGrantPerHome = round(total_grants_m × 1000 ÷ total_homes)`. **Source:** Housing Australia + Budget Papers. **Calc:** state totals sorted desc; avg grant per home. **Cadence:** per HAFF round / Budget (~annual).

### 🟦 Construction cost index, last 24 quarters (AreaChart, page.tsx:566)
- **Data:** `costData = COST_INDEX.slice(-24).map`. **Source:** ABS **Cat. 6427.0** (PPI) + Rawlinsons. **Calc:** slice last 24 quarters; index plotted as-is. **Cadence:** ABS 6427.0 **quarterly** · Rawlinsons annual.

### 🟦 CHP sector trend (AreaChart, page.tsx:634)
- **Data:** `sectorTrendData = SECTOR_TRENDS.map`. **Source:** AIHW HOU 322 + NHR. **Calc:** direct. **Cadence:** AIHW annual.

### 🔢 Core-need scale-up panel (page.tsx:660-688)
- **"Sector must grow N×":** `round(740000 ÷ SECTOR_OVERVIEW.community_housing × 10) ÷ 10` — core housing need (AHURI 740k) ÷ current community-housing stock, to 1 decimal.
- **Cohort bars vs core need:** each `pct = max(value ÷ 740000 × 100, 0.4)` (min 0.4 for visibility); label `round(value ÷ 740000 × 100)`%.
- **Source:** AHURI 2023 (740k) + AIHW HOU 322 (community_housing). **Cadence:** AHURI ad-hoc / AIHW annual.

**Page status:** 🟡 — all 7 charts + gauge + 4 derived KPIs traced; confirm `target`, `annual_run_rate`, 2024 waitlist sum, HAFF totals against latest releases.

# 3. Supply Pipeline / State Demand-Supply  (`app/state-demand-supply/page.tsx`)

**Data files:** `population`, `state-analysis`.
**Sources:** State housing-authority annual reports + ABS Building Approvals **Cat. 8731.0** + AIHW SHS (state-analysis) · ABS population estimates & projections + Net Overseas Migration (population — exact header documented in §4).
**Shared visual calc — `StatBar` (page.tsx:82):** `pct = min(100, value÷max×100)`, presentation only.

### 🔀 National population + components (ComposedChart, page.tsx:329)
- **Data:** `histData` — line `population`; bars `natural` / `nim`. **Calc (lines 197-198):** `natural = round(natural_increase × 1000)`, `nim = round(nim × 1000)` (source data in thousands → persons). **Derived:** `totalGrowth = (last.population_m − first.population_m).toFixed(2)`; `avgHhSize = (last.population_m ÷ 10.9).toFixed(1)` (persons per household, 10.9M households); `peak`/`trough = reduce max/min of HISTORICAL_NOM_DETAIL by total_k`. **Source:** ABS population. **Cadence:** ABS ERP quarterly / projections ad-hoc.

### 📈 State population projections to 2041 (LineChart, page.tsx:392)
- **Data:** `stateChartData` per-state series. **Derived (line 419):** `growthM = (proj_2041_m − currentPop).toFixed(2)`. **Source:** ABS population projections. **Cadence:** ABS projections (ad-hoc, ~3-5yr).

### 📊 Net Overseas Migration components (BarChart, page.tsx:448)
- **Data:** `nomData`. **Source:** ABS NOM. **Calc:** components plotted direct (×1000 where in thousands). **Cadence:** ABS NOM quarterly.

### 📊 Years to clear waitlist by state (BarChart, page.tsx:556)
- **Data:** `yearsToClearChart = [...allStateSummaries].sort(yearsToClear desc)`, bar = `yearsToClear`. **Calc per state:** `yearsToClear = round(waitlist ÷ delivery)` (years to clear at current delivery pace). **National:** `natYearsClear = round(natWaitlist ÷ natDelivery)` where `natWaitlist = Σ waitlist`, `natDelivery = Σ delivery` (lines 239-241). **Source:** state authorities + AIHW. **Cadence:** ~annual.

### 📊 Delivery gap (BarChart, page.tsx:578)
- **Data:** `deliveryGapChart`. **Calc (lines 227-228, national 242-243):** `requiredFor10yr = round(waitlist ÷ 10)` (annual build to clear in 10yr); `annualGap = max(0, requiredFor10yr − accessible_total)`; national `natRequired = round(natWaitlist ÷ 10)`, `natGap = max(0, natRequired − natDelivery)`. **Source:** state authorities. **Cadence:** ~annual.

### 📈 Selected-state waitlist trend (LineChart, page.tsx:753)
- **Data:** `s.waitlist_trend` (per-state series). **Source:** state social-housing registers. **Calc:** direct. **Cadence:** ~annual.

### 📊 Waitlist by state (BarChart, page.tsx:771)
- **Data:** `stateComparison = allStates.sort(waitlist desc)`, bar = `waitlist`. **Source:** state registers. **Calc:** sort desc. **Cadence:** ~annual.

### 📊 Recent approvals + 📊 completions (BarChart, page.tsx:864 / 879)
- **Data:** `recentApprovals`; `recentCompletions = s.social_housing_completions.slice(-8)` (last 8 periods). **Source:** ABS 8731.0 (approvals) + state authorities (completions). **Calc:** slice recent. **Cadence:** approvals monthly · completions ~annual.

### 📊 Demographics breakdown (BarChart, page.tsx:935)
- **Data:** `demoData` (DemographicType pct). **Source:** ABS Census. **Calc:** direct %. **Cadence:** Census 5-yr.

### 📈 Household size trend (LineChart, page.tsx:956)
- **Data:** `s.household_size_trend`. **Source:** ABS Census/ERP. **Calc:** direct. **Cadence:** Census 5-yr.

### 🔢 True-need + delivery-rate KPIs
- **`trueNeedEstimate = round(latest_waitlist × TRUE_NEED_MULTIPLIER[state])`** (line 259) — registered waitlist scaled up to estimated true need. ⚠️ **`TRUE_NEED_MULTIPLIER` is a HIVE-defined per-state assumption — its basis must be documented/validated (🟡).**
- **Delivery as % of waitlist (lines 795-797):** `(requiredFor10yr ÷ latest_waitlist × 100).toFixed(1)`% needed/yr; `(accessible_total ÷ latest_waitlist × 100).toFixed(1)`% actual/yr; gap = `annualGap` dwellings/yr.

**Page status:** 🟡 — all 11 charts + national rollups + true-need KPIs traced. **Action:** document the basis of `TRUE_NEED_MULTIPLIER` (per-state) and the `delivery`/`accessible_total` definitions; confirm projections release.

# 4. Population  (`app/population/page.tsx` → `lib/data/population.ts`)

**Sources (data file header):** ABS **Cat. 3222.0** (Population Projections) · **Cat. 3101.0** (National/State ERP) · **Cat. 3412.0** (Migration, Australia) · SQM Research · CoreLogic. *(This header is the authority for the population source referenced in §3 and §2.)*

### 🔀 National population + growth components (ComposedChart, page.tsx:102)
- **Data:** `histData` from `HISTORICAL_NATIONAL` — line `population` (population_m); bars `natural` / `nim`.
- **Calc (lines 23-24):** `natural = round(natural_increase × 1000)`, `nim = round(nim × 1000)` (source in thousands → persons). **Derived:** `totalGrowth = (last.population_m − first.population_m).toFixed(2)`; `peak`/`trough = reduce max/min of HISTORICAL_NOM_DETAIL by total_k`.
- **Cadence:** ABS ERP **quarterly** (3101.0) · projections ad-hoc (3222.0).

### 📈 State population projections (LineChart, page.tsx:174)
- **Data:** `stateChartData` per-state series to 2041. **Source:** ABS 3222.0. **Calc:** direct projections. **Cadence:** ABS projections (ad-hoc).

### 📊 Net Overseas Migration components (BarChart, page.tsx:207)
- **Data:** `nomData` from `HISTORICAL_NOM_DETAIL`. **Source:** ABS 3412.0. **Calc:** components plotted (×1000 where in thousands). **Cadence:** ABS migration **annual** · NOM quarterly.

**Page status:** ✅ — 3 charts + derived growth/peak/trough traced; sources cited to ABS Cat. nos. (NotebookLM check still pending across all pages).

# 5. Development Viability / Feasibility  (`app/feasibility/page.tsx` → `lib/data/feasibility.ts`)

> **This page computes the headline $137k per-dwelling funding gap** (VALIDATION_SPEC #1). Every output is computed live by `computeFeasibility()` — not stored. Below is the full chain.

**Sources (data file header — re-audited May 2026), per constant:**
| Constant | Value | Source |
|---|---|---|
| `SQM_COST` ($/m²) | by typology | Rawlinsons Construction Cost Guide **2025, Table 1.3** (community housing) |
| `STATE_COST_MULTIPLIER` | per state | Rawlinsons 2025 State Cost Index + Turner & Townsend 2025 |
| `PROFESSIONAL_FEES_PCT` | 0.08 | AIHW · Housing Australia CHP guidance 2024 |
| `CONTINGENCY_PCT` | 0.12 | AIHW · HA 2024 |
| `FINANCE_COST_PCT` | 0.06 | 18-mo draw-down @7%pa, 60% util ≈ 6.3% (header), constant set to 6% |
| `COUNCIL_CONTRIBUTIONS` | per state | NSW DoP s.7.11 · VIC ICP register · QLD infra charges register |
| `STATUTORY_CHARGES` | per state | Sydney Water developer charges + state utility schedules 2025 |
| `SOCIAL_RENT_WEEKLY` | per state | AIHW: **25% × (50% × state median household income)** |
| state median incomes | — | ABS Household Income & Wealth **2023-24** |
| `MARKET_RENT_WEEKLY` | per state | PropTrack National Rental Report **Q1 2025** (metro median) |
| `AFFORDABLE_RENT_RATIO` | 0.749 | HAFF guidelines: <75% of market rent |
| `OPEX_RATIO` | 0.30 | HA CHP benchmarks 2024 (30–35%) |
| `NHFIC_RATE` | 0.055 | Housing Australia Annual Report 2023-24 + AOFM bond data |
| `LOAN_TERM_YEARS` | 30 | HA loan program |
| `DSCR` | 1.10 | HA minimum lending standard (mixed tenure) |
| `HAFF_GRANT_OPTIONS` | R1-3 avg **$55,451**, R3 $78,531, R4est $95,000 | R1-3avg = total HAFF grants **$2,223.6M ÷ 40,000 homes**; verified vs Treasury budget papers |
| `STATE_LAND_CONTRIBUTION` | NSW $200k … NT $50k | Housing Australia / state HA annual reports 2023-24 (⚠️ "highly project-specific, central metro estimates only") |

### The core formula — `computeFeasibility(state, typology, tenure, haffRound)` (feasibility.ts:391)

**A. Total Development Cost (ex-land):**
1. `gross_area = round(net_area_m2 × gross_factor)`
2. `sqm_rate = round(SQM_COST[type] × STATE_COST_MULTIPLIER[state])`
3. `hard_cost = round(gross_area × sqm_rate)`
4. `professional_fees = round(hard_cost × 0.08)`
5. `contingency = round(hard_cost × 0.12)`
6. `finance_cost = round(hard_cost × 0.06)`
7. `council = COUNCIL_CONTRIBUTIONS[state]` · `statutory = STATUTORY_CHARGES[state]`
8. **`TDC = hard_cost + professional_fees + contingency + finance_cost + council + statutory`**

**B. Rental income:**
9. `social_rent = SOCIAL_RENT_WEEKLY[state]`
10. `affordable_rent = round(MARKET_RENT_WEEKLY[state] × 0.749)`
11. `blended_rent = round(social_rent × social_pct + affordable_rent × affordable_pct)`

**C. Debt capacity** — `computeDebtCapacity(rent)` (feasibility.ts:259):
- `NOI = rent × 52 × (1 − OPEX_RATIO)` → `available = NOI ÷ DSCR` → **`debt = round(available ÷ DEBT_SERVICE_FACTOR)`**
- `DEBT_SERVICE_FACTOR = r(1+r)^n ÷ ((1+r)^n − 1)` = 0.055×1.055³⁰÷(1.055³⁰−1) = **0.068805** (standard mortgage constant, 5.5%/30yr).

**D. Funding stack & gap:**
12. `nhfic_debt = computeDebtCapacity(blended_rent)`
13. `state_land = STATE_LAND_CONTRIBUTION[state]`
14. `total_funded = haff_grant + nhfic_debt + state_land`
15. **`funding_gap = max(0, TDC − total_funded)`** ← **the $137k headline (NSW 2-bed, R1-3 avg, 100% social)**
16. `gap_per_m2 = round(gap ÷ net_area_m2)` · `haff_coverage_pct = round(haff_grant ÷ TDC × 100)`

**E. Break-even affordable %** (feasibility.ts:428-431):
- `debt_needed = TDC − haff_grant − state_land`
- `blend_needed = debt_needed × DEBT_SERVICE_FACTOR × DSCR ÷ (52 × (1 − OPEX_RATIO))`
- `breakeven_aff_pct = (blend_needed − social_rent) ÷ (affordable_rent − social_rent)` (0 = already viable; >1 = unachievable by tenure mix alone)
- `gap_at_100pct_affordable = max(0, TDC − (haff_grant + computeDebtCapacity(affordable_rent) + state_land))`

### 📊 Sensitivity — gap vs ±build cost (BarChart, the page's 1 chart)
- **Data:** `r.sensitivity` (feasibility.ts:438) — TDC × {0.85, 0.90, 1.00, 1.10, 1.15}; each `gap = max(0, scaledTDC − total_funded)`. **Calc:** ±10/15% construction-cost stress on the gap.

### 🔢 Page-level derived (page.tsx)
- `fmtK(n) = "$" + round(n÷1000) + "k"` (display).
- **Scenario compare (lines 145-169):** `gapA/gapB = max(0, tdc − grant{A|B} − debt − land)`; `avgGapA/B = round(Σ gap ÷ count)`; `additionalCost = |totalCostB − totalCostA|`; `total(n) = round(n × dwellings)`.
- `fundedPct = round(funded ÷ tdc × 100)` (line 781); `perM2 = gap>0 ? round(gap ÷ net_area_m2) : 0` (line 844).
- NOI display (lines 678-679, 981): `round(blended_rent × 52 × 0.70)` NOI/yr; OpEx `round(blended_rent × 52 × 0.30 ÷ 52)`/wk.
- "Shift to `ceil(breakeven × 100)`%+ affordable to close gap" (lines 194, 1002).

**Cadence:** Rawlinsons **annual** · PropTrack **quarterly** · ABS income **biennial** · HA annual · HAFF **per round** (R3 opened Jan 2026 → update grant options).

**Page status:** 🟡 — **entire viability engine traced end-to-end** (TDC → debt → gap → break-even → sensitivity). This is VALIDATION_SPEC #1/#6: top NotebookLM-check priority. ⚠️ `STATE_LAND_CONTRIBUTION` and R3/R4 grant estimates are explicitly flagged in-code as estimates — surface that in any number shown to customers.

# 6. Funding & Programs / Funding-Sector  (`app/funding-sector/page.tsx`)

**Data files:** `funding`, `haff`, `chp-sector`, `construction`.
**Sources:** Housing Australia program guidelines + annual reports 2023-24, Treasury Budget Papers 2023-24→2025-26, state HA reports, NHFIC/HA Impact Reports (funding) · HA media releases + Senate Estimates + Budget Papers (haff) · AIHW HOU 322 + NHR + CHP annual reports (chp-sector) · ABS 6427.0 + Rawlinsons + AIHW + UNSW City Futures (construction).
**Display helper:** `fmtMoney` — `amount_m ≥ 1000 ? (amount_m/1000).toFixed(1)+"B" : amount_m+"M"`.

### HAFF round breakdown (per selected round `r = HAFF_ROUNDS[tab]`)
- **📊 Homes by state** (BarChart, page.tsx:204) — `r.by_state`, bar `homes`.
- **🥧 Homes by sector** (PieChart, page.tsx:218) — `r.by_sector`, value `homes`.
- **📊 Homes by bedrooms** (BarChart, page.tsx:231) — `r.by_bedrooms`, bar `homes`.
- **🥧 Homes by dwelling type** (PieChart, page.tsx:247) — `r.by_dwelling_type`.
- **Source:** haff.ts (HA media releases / Budget). **Calc:** direct from round data; R3+ are *indicative proportions based on R1-2 distribution* (in-code note, page.tsx:144 — ⚠️ flag as estimate). **Cadence:** per HAFF round.

### HAFF summary + state table (page.tsx:524, 550-559)
- **📊 stateTotals** (BarChart) — grants/homes by state. **Table footers:** `Σ projects`, `Σ grant_m.toFixed(1)`M. **KPI:** `haffPct = min(100, haffSummary.pct_of_5yr_target)`. **Source:** haff.ts. **Cadence:** per round / Budget.

### Top CHPs (page.tsx:870, 921)
- **📊 Top-20 CHPs by dwellings** (BarChart, top20Data) · **📊 CHP dwellings by state** (stateChpData).
- **Calc:** `top5Total = Σ TOP_CHPS[0:5].dwellings`; `top20Total = Σ TOP_CHPS.dwellings`; concentration `round(top20Total ÷ SECTOR_OVERVIEW.community_housing × 100)`% (lines 312-313, 776, 865). **Source:** chp-sector.ts (AIHW HOU 322 + NHR + CHP reports). **Cadence:** AIHW annual + CHP reports.

### 📈 Sector trend (LineChart, page.tsx:954) + 📈 Construction cost (LineChart, page.tsx:1249)
- **trendData** = `SECTOR_TRENDS` (CHP stock growth). **costData** = `COST_INDEX` (construction cost index). **Source:** chp-sector / construction (ABS 6427.0). **Calc:** direct. **Cadence:** AIHW annual · ABS 6427.0 quarterly.

### 🔢 Opportunity / impact KPIs (page.tsx:323-330)
- `criticalCount = count(opportunity_band == "Critical")`; `noCoverageCount = count(tier1_chps.length == 0)`; **`avgOppScore = round(Σ opportunity_score ÷ count)`**. ⚠️ **`opportunity_score` / `opportunity_band` are HIVE-computed composite scores — their formula must be documented (🟡; likely shared with Asset Intelligence §, confirm there).**
- `yieldDrop = round((1 − BILLION_DOLLAR_YIELD[2025] ÷ BILLION_DOLLAR_YIELD[2019]) × 100)` — % drop in homes-per-$bn since 2019. `costIncrease = round(impact.cost_increase_abs ÷ 1000)`. **Source:** construction.ts / HA. **Cadence:** annual.

### 📋 Funding mechanisms navigator
- `FUNDING_MECHANISMS` filtered by type (grant/loan/equity/tax/guarantee). **Source:** funding.ts (HA/Treasury/state). **Calc:** display/filter only. **Cadence:** per Budget.

**Page status:** 🟡 — all 9 charts + concentration/yield/impact KPIs traced. **Actions:** (1) document `opportunity_score` formula; (2) mark R3+ HAFF splits as indicative in any customer-facing view.

<!-- NEXT: asset-intelligence + climate-risk (composite scores) -->
<!-- ============================================================= -->
