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
| **housing-need** | housing-need | 3📊 + KPIs/tables | 🟡 §1 + Notebook-B checked (waitlist→184k) |
| **state-demand-supply** (Supply Pipeline) | population, state-analysis | 7📊 1🔀 3📈 | 🟡 traced (§3) |
| **population** | population | 1📊 1🔀 1📈 | ✅ traced (§4) |
| **feasibility** (Development Viability) | feasibility | 1📊 + calculators | 🟢 validated §5 (2026-07) — pending Rawlinsons |
| **funding-sector** (Funding & Programs) | funding, haff, chp-sector, construction | 5📊 2📈 2🥧 | 🟡 traced (§6) |
| **asset-intelligence** | asset-intelligence, climate-risk | KPIs/score tables | 🟡 traced (§7) |
| **climate-risk** | climate-risk | KPIs/score tables | 🟡 traced (§8) |
| **building-energy** | building-energy | KPIs/tables | 🟡 traced (§9) |
| **livable-housing** | livable-housing | KPIs/tables | 🟡 traced (§10) |
| **esg-impact** | esg | KPIs/tables | 🟡 traced (§11) |
| **sustainability** (hub) | building-energy, livable-housing, esg, asset-intelligence | rollup KPIs | ✅ traced (§12) — rollup |
| **research** (Evidence & Policy) | policy-timeline, programs | scorecard, timeline, KPIs | 🟡 traced (§13) |
| **my-portfolio** | climate-risk | per-asset metrics | 🟡 traced (§8, shared model) |

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
- **Figures & source (validated + CORRECTED 2026-07, Notebook B):**
  - **122,494 homeless** on Census night — ✅ ABS Census 2021 (latest; 2026 Census ~2027). **Breakdown corrected** to exact ABS groups: rough 7,636 · supported 24,291 · boarding 22,137 · **severe-crowding 47,895** · staying-temp 16,597 · other 3,934 (severe-crowding ↔ couch-surf were swapped).
  - **1.31M rental stress / 640k severe** — 🟡 held; **ABS Census 2021 basis** (SIH 2023-24 withdrawn by ABS 17 Jul 2025 — renters under-sampled → no newer official figure). Label corrected in code.
  - **waitlist ~~213,000~~ → 165,500** ✅✅ double-checked. AIHW *Housing Assistance 2025* (Jun-2024): 159,100 public + 6,400 SOMIH (NotebookLM PDF read corrected my web 184k). Range 165k–188k by edition; community lists integrated/unreported.
  - **core housing need ~~740k~~ → 640,000** ✅ corrected. AHURI/City Futures 2022 (2021 Census; → ~940k by 2041).
  - **CRA max single ~~$94~~ → $110** ✅ (AHURI/Shelter WA Table 3, Mar-2026) — raises craCovers 42% → ~49%.
- **Calculation (derived, page.tsx:95-97):**
  - `gap = median_market_rent_pw_2024 − round(median_renter_income_k×1000 ÷ 52 × 0.30)` = 600 − round(65,000÷52×0.30) = **$225/wk** (market rent minus the 30%-of-income affordable rent).
  - `craCovers = round(cra_max_single_pw ÷ gap × 100)` = round(**110**÷225×100) = **49%** (share of the gap that max Commonwealth Rent Assistance covers; CRA updated $94→$110 for 2026).
- **Cadence:** SIH ~annual · Census 5-yr (next 2026) · AHURI ad-hoc · CRA annual.
- **Shared visual calc — `StatBar` (page.tsx:58):** every KPI bar meter on this page fills to `pct = min(100, value ÷ max × 100)` (capped at 100). Presentation only — does not change the underlying figure.
- **Status:** 🟢 Notebook-B **corrected in code (2026-07)**: waitlist →184k, core need →640k, CRA →$110, homeless breakdown → exact ABS 2021 groups. Rental stress held at 2021 (no newer official data). B5 SHS over-rep ✅ (25/3.5≈7×, arithmetic). ⚠️ note the `gap`/`craCovers` §1 calc now uses CRA $110.

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

> Computes the headline per-dwelling **funding gap** (VALIDATION_SPEC #1). Every output is computed live by `computeFeasibility()` — not stored. **Notebook-A validated 2026-07** — most inputs confirmed/updated to current sources below; only build rate + cost multipliers await Rawlinsons 2026.

**Per-constant source + validation status (Notebook A, validated 2026-07):**
| Constant | Value(s) | Source | Status |
|---|---|---|---|
| `SQM_COST` apartment | **$4,200/m²** | Rawlinsons (2026 basis) — triangulated: 2017 AHURI-Rawlinsons escalated → $4,080–4,760; Rawlinsons infill $501,849/unit | 🟡 Rawlinsons-basis, **not directly quoted** (Koste/ABS lower ~$3,175–3,771) |
| `STATE_COST_MULTIPLIER` | NSW 1.00 … WA 1.13 … NT 1.42 | Rawlinsons State Cost Index + T&T | 🔴 **WA 1.13 vs T&T 0.92 (Perth below Sydney)**; QLD 1.00 vs 1.03 — pending Rawlinsons |
| `PROFESSIONAL_FEES` 0.08 · `CONTINGENCY` 0.12 · `FINANCE` 0.06 | | HA/AIHW CHP guidance | ⬛ HIVE assumption (document rationale) |
| `SOCIAL_RENT_WEEKLY` | **rebuilt** NSW 238 · VIC 238 · QLD 229 · WA 227 · SA 242 · TAS 238 · NT 252 · ACT 243 | **= 25% × tenant income (≤ state IEL) + CRA $110**. AHURI/Shelter WA *The Eligibility Trap* (Apr 2026) | ✅ method (25% ✅, CRA $110 ✅); values model-based (income mix 45/35/20) |
| `MARKET_RENT_WEEKLY` | **NSW 750 · VIC 600 · QLD 660 · WA 695 · SA 550 · TAS 530 · NT 600 · ACT 580** | **Domain Rental Report Mar-2026 — UNIT (apartment) medians** | ✅ current (unit = right comparator for apartments) |
| `AFFORDABLE_RENT_RATIO` 0.749 | | HAFF guidelines <75% of market | ✅ |
| `COUNCIL_CONTRIBUTIONS` | NSW 11k · VIC 18k · QLD 14k · WA 12k · SA 9k · TAS 6k · NT 5k · ACT 4k | HIA/CIE city benchmark, **net-of-exemption** | 🟡 indicative (LGA-specific; social housing often exempt) |
| `STATUTORY_CHARGES` | NSW $12,000 … | Sydney Water + state utilities | ✅ NSW $12,068 confirmed; others pending |
| `OPEX_RATIO` 0.30 | | HA CHP benchmarks (30–35%) | 🟡 |
| `NHFIC_RATE` 5.5% · `DSCR` 1.10 | | HA lends "below private-sector rate" — **exact rate/DSCR NOT published** | ⬛ **HIVE modeling assumption** (unpublishable) |
| `DEBT_SERVICE_FACTOR` 0.068805 | | = 5.5%/30yr mortgage constant | ✅ math-verified |
| `HAFF_GRANT` R1-3 avg **$55,451** | | 40,000-home target ✅; total-committed not quoted; legislative-floor basis → ~$71,250 | 🟡 (either would *reduce* gap) |
| `STATE_LAND_CONTRIBUTION` | NSW $200k … NT $50k | state HA reports | 🟡 "estimate only" (flagged in-code) |
| **CRA** $110/wk | | Services Australia; AHURI *Eligibility Trap* Table 3 (Mar-2026), single max | ✅ confirmed |

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
9. `social_rent = SOCIAL_RENT_WEEKLY[state]` — **rebuilt (2026)** = 25% × actual tenant income (≤ state IEL, benefit-weighted) + CRA $110. *(Replaces the weak "50% of median income" derivation; CHP tenants get CRA, public housing does not.)*
10. `affordable_rent = round(MARKET_RENT_WEEKLY[state] × 0.749)` — market rent = Domain **2026 unit** median.
11. `blended_rent = round(social_rent × social_pct + affordable_rent × affordable_pct)`

**C. Debt capacity** — `computeDebtCapacity(rent)` (feasibility.ts:259):
- `NOI = rent × 52 × (1 − OPEX_RATIO)` → `available = NOI ÷ DSCR` → **`debt = round(available ÷ DEBT_SERVICE_FACTOR)`**
- `DEBT_SERVICE_FACTOR = r(1+r)^n ÷ ((1+r)^n − 1)` = 0.055×1.055³⁰÷(1.055³⁰−1) = **0.068805** (standard mortgage constant, 5.5%/30yr).

**D. Funding stack & gap:**
12. `nhfic_debt = computeDebtCapacity(blended_rent)`
13. `state_land = STATE_LAND_CONTRIBUTION[state]`
14. `total_funded = haff_grant + nhfic_debt + state_land`
15. **`funding_gap = max(0, TDC − total_funded)`** ← headline example **NSW 2-bed apt, 50/50 tenure, R1-3 avg ≈ $131,000** (updated 2026 inputs; was quoted $137k on old inputs). ⚠️ NSW is the **national FLOOR** — other states $190k–$529k (NT). Never present the floor as typical. 100% social = ~$205k+.
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

**Cadence:** Rawlinsons **annual** (Ed. 34 = 2026) · Domain rents **quarterly** · IEL/CRA **annual** (ROGS/Services Australia) · HAFF **per round**.

**Page status:** 🟢 **Notebook A validated 2026-07.** Confirmed/updated: market rents (Domain 2026 unit) ✅ · social rent + CRA $110 + 25% rule ✅ (AHURI/Shelter WA) · council indicative ✅ · statutory NSW ✅ · debt-service factor ✅. **Still pending (→ VALIDATION_TRACKER):** build rate $4,200 + state multipliers (**Rawlinsons 2026 — user**; WA/NT flagged) · HAFF grant $55k vs $71k · `NHFIC_RATE`/`DSCR` are **unpublished HIVE assumptions** (label as such) · `STATE_LAND` estimate. **Per-state gaps are not final until the multipliers are confirmed.**

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

# 7. Asset Intelligence — Compound Risk  (`app/asset-intelligence/page.tsx` → `lib/data/asset-intelligence.ts`)

> Powers the **"152 suburbs compound risk / 13 extreme"** headline (VALIDATION_SPEC #3). Scores are **computed live** by `computeCompoundRisk()`, combining three other datasets — no stored compound numbers.

**Inputs (imported):** `climate-risk.ts` (suburb climate score) · `building-energy.ts` (`STATE_ENERGY_DATA`) · `livable-housing.ts` (`STATE_COMPLIANCE`).

### Compound Risk Score — `computeCompoundRisk(suburb)` (asset-intelligence.ts:72)
- **Climate score** = `suburb.overall_score` (direct from climate-risk.ts, §8).
- **Energy gap score** = `min(100, round((7 − avg_nathers_stars) ÷ 6 × 100))` — distance below 7-star NatHERS on a 6-star scale.
- **LHD gap score** = `min(100, round(100 − pct_meeting_silver))` — distance below 100% Livable-Housing Silver compliance.
- **Compound score** = `round(climate × 0.40 + energyGap × 0.35 + lhdGap × 0.25)`.
- **Band** (`getCompoundBand`): **Extreme ≥85 · Critical ≥72 · High ≥58 · Moderate ≥42 · Low <42**. The "triple-failure" suburbs = Extreme band (all three dimensions severe).
- **Headline counts:** "152 / 13 extreme" = counts of `CLIMATE_RISK_SUBURBS` whose computed `compound_band` = (all risk) / Extreme. Recompute = re-run over the suburb list.

### Financial implication calcs (asset-intelligence.ts:102-105)
- `energyExtra = avg_annual_energy_bill − 1400` (excess vs 7-star baseline $1,400/yr).
- `lhdUpgrade = upgrade_cost_to_silver_bn × 1000 ÷ total_social_dwellings` ($k per dwelling).
- `energyUpgrade = 13` ($k, 2★→5★ per-dwelling, from building-energy).
- `totalFix = round(lhdUpgrade + energyUpgrade)`.

### HAFF Round-4 readiness flags (asset-intelligence.ts:109-119)
- Flag if `haff_pipeline_7star_pct < 72` · `haff_pipeline_compliant_pct < 70` · `insurance_status ∈ {effectively_uninsurable, withdrawal_risk}`. `haffReady = no flags`.

**Source:** composite — see §8 (climate), §9 (energy), §10 (LHD). **Cadence:** driven by slowest input (Census 5-yr for climate exposure; energy/LHD ~annual). **Status:** 🟡 — weights (40/35/25) and band thresholds are HIVE-defined; document rationale + validate the 152/13 counts.

# 8. Climate Risk  (`app/climate-risk/page.tsx` + `my-portfolio` → `lib/data/climate-risk.ts`)

**Geographic unit:** SA2 (≈ suburb), high-priority social-housing suburbs across all 8 states/territories.
**Sources:** BOM (temperature + climate projections) · state planning portals (flood overlays, bushfire-prone land) · CSIRO *Climate Change in Australia* (2°C scenario) · Insurance Council of Australia (catastrophe + insurance) · Geoscience Australia (coastal elevation + SLR) · ABS SEIFA (`seifa_score`).

### Hazard + composite scoring (data file header + per-suburb records)
- **Hazard score bands (0–100):** Critical ≥75 · High 58–74 · Moderate 42–57 · Low <42.
- **Composite `overall_score` (applicable hazards only, re-normalised):** **Extreme Heat 30% · Flood 25% · Bushfire 20% · Coastal/SLR 15% · Cyclone 10%.** Only hazards present at the suburb are weighted (weights renormalise to those present).
- **Sub-hazard detail (per suburb):** heat (`days_over_35` current/2030/2050, `days_over_40`, urban-heat-island factor, tree-canopy %, cooling-access %), flood (`in_flood_overlay`, overlay type, `pct_area_in_overlay`, last major event), `insurance_status` (insured / withdrawal_risk / effectively_uninsurable), `est_social_dwellings`, `social_housing_density`.
- **Calc:** sub-hazard scores transcribed from source agencies; `overall_score` = weighted blend of applicable hazards. **Cadence:** CSIRO/BOM projections ad-hoc; planning overlays ~annual; insurance data annual.

**Status:** 🟡 — scoring model + weights documented; the per-suburb hazard sub-scores need source-trace per agency (NotebookLM), and the weight scheme is HIVE-defined (document rationale).

# 9. Building Energy  (`app/building-energy/page.tsx` → `lib/data/building-energy.ts`)

**Rating systems:** NatHERS (0–10★ thermal) · NABERS (1–6★ operational). NCC 2022 mandates 7★ NatHERS for new builds (May 2023); existing social stock ~2–3★.
**Sources:** CSIRO NatHERS distribution study 2023 · AIHW *Housing Assistance in Australia 2023* (social-housing energy) · AGL/Origin/EnergyAustralia residential cost benchmarks 2024 · ClimateWorks Australia *Towards Zero Emissions* 2023.

### National aggregates — `getEnergyStats()` (building-energy.ts:333)
- `totalStock = Σ social_dwellings`
- `below3star = Σ round(social_dwellings × pct_below_3star ÷ 100)` (also below6star, meeting7star)
- `avgBill = round(Σ(avg_annual_energy_bill × social_dwellings) ÷ totalStock)` — **dwelling-weighted** mean
- `totalRetrofitGap = Σ retrofit_gap_cost_m`
- `avgEnergyPoverty = round(Σ(energy_poverty_pct × social_dwellings) ÷ totalStock)` — dwelling-weighted

### Page calcs (🔢 KPIs + calculator)
- `orgGap = max(0, 7 − orgNathers)`; `sectorGap = max(0, 7 − sectorAvg)` (stars below NCC 7★).
- **`annualExtraCost = round(max(0, (7 − orgNathers) ÷ (7 − 1) × 2200))`** — extra energy bill: star-gap normalised over the 6-star range × $2,200 max penalty.
- "~`round(below3star ÷ 1000)`k dwellings 1–2★ = `round(below3star ÷ totalStock × 100)`% of stock."
- `extra = cost − ENERGY_COST_BY_CLIMATE["7-star"][zone]` (excess vs 7★ by climate zone).
- `barWidth = max(3, min(100, pct_social_stock × 3.5))` — presentation only.

**Feeds:** `STATE_ENERGY_DATA.avg_nathers_stars` & `haff_pipeline_7star_pct` → Compound Risk §7. **Cadence:** CSIRO/AIHW ~annual · energy benchmarks annual. **Status:** 🟡 — aggregates + $2,200 penalty assumption traced (document the $2,200 basis).

# 10. Livable Housing (LHD)  (`app/livable-housing/page.tsx` → `lib/data/livable-housing.ts`)

**Standard:** Livable Housing Design Guidelines (Silver/Gold/Platinum). HAFF requires Silver min; R3 Gold for specialist.
**Sources:** Livable Housing Australia LHDG 4th Ed (2017, upd. 2021) · HA HAFF R1-3 Design Guidelines · AIHW 2023 · AHURI *Accessible housing in Australia* (2022) · COAG NHA 2023 · ABS Disability, Ageing & Carers 2022.

### National aggregates — `getNationalStats()` (livable-housing.ts:320)
- `totalStock = Σ total_social_dwellings`
- `totalSilver = Σ round(total_social_dwellings × pct_meeting_silver ÷ 100)` (also totalGold)
- `totalNeeding = Σ dwellings_needing_silver_upgrade`
- `totalCost = Σ upgrade_cost_to_silver_bn` ($B national upgrade)

### Page calcs
- "% meeting Silver" = `round(totalSilver ÷ totalStock × 100)`; below-Silver = `(totalNeeding ÷ 1000).toFixed(0)`k; national upgrade `totalCost.toFixed(1)`B.
- **Retrofit calculator:** `minTotal = (cost.min × numDwellings ÷ 1000).toFixed(1)`, `maxTotal = (cost.max × numDwellings ÷ 1000).toFixed(1)` ($k×dwellings → $M); `numDwellings = max(1, parseInt(input))`.
- Stream tiers via `STREAM_HAFF_TIER` (Gold mandatory / Platinum-SDA filters).

**Feeds:** `STATE_COMPLIANCE.pct_meeting_silver`, `upgrade_cost_to_silver_bn`, `total_social_dwellings`, `haff_pipeline_compliant_pct` → Compound Risk §7. **Cadence:** AIHW/AHURI ~annual. **Status:** 🟡 — aggregates + calculator traced; per-state compliance %s need source-trace.

# 11. ESG Impact  (`app/esg-impact/page.tsx` → `lib/data/esg.ts`)

**Framework:** E / S / G pillars synthesising HIVE data into one evaluative lens (GRESB-style).
**Sources:** **E** — CSIRO NatHERS 2023, ClimateWorks 2023, AIHW 2023, BOM · **S** — AIHW Housing Assistance 2023, SHS Annual Report 2023, CHIA 2023 · **G** — NHR Register 2024, HA Annual Report 2024, CHIA Sector Data · **Scoring methodology** — AHURI ESG framework research 2022 + GRESB real-assets methodology.

### Composite score — `SECTOR_COMPOSITE_SCORE` (esg.ts:380)
- **`= round(Σ SECTOR_ESG_SCORES.score ÷ SECTOR_ESG_SCORES.length)`** — straight mean of the pillar scorecards (E 32, S 48, G 56, …).
- Pillar metrics: `ENVIRONMENTAL_METRICS`, `SOCIAL_METRICS`, `GOVERNANCE_METRICS` (each metric: value + rating). `INVESTMENT_USE_CASES`, `ESG_MATURITY_LEVELS` are reference tables.

**Calc:** composite = unweighted mean of 3 pillar scores; metric ratings transcribed from sources. **Cadence:** annual (pillar sources). **Status:** 🟡 — composite formula traced; the individual pillar scores (32/48/56) are HIVE/AHURI-framework judgements — document scoring rubric.

# 12. Sustainability (hub)  (`app/sustainability/page.tsx`)

**Pure rollup page — no new calculations.** Aggregates other sections' outputs into one dashboard.
- `energyStats = getEnergyStats()` (§9) → "Below 3-star ~`round(below3star÷1000)`k dwellings".
- `lhdStats = getNationalStats()` (§10) → "Need upgrade ~`round(totalNeeding÷1000)`k"; "National upgrade cost `$totalCost.toFixed(1)`B".
- `compStats` (compound risk §7) → "Extreme compound risk `compStats.extreme` suburbs" (= **13**, count of Extreme-band suburbs).
- **Source/calc/cadence:** entirely inherited from §7 (asset-intelligence), §9 (building-energy), §10 (livable-housing), §11 (esg). **Status:** ✅ — rollup only; correctness depends on the source sections.

# 13. Evidence & Policy / Research  (`app/research/page.tsx` → `lib/data/programs.ts`, `policy-timeline.ts`)

**Sources:** AHURI · Treasury · government reports (programs + policy-timeline headers). AI search backed by the crawled report corpus → Pinecone (`hive-research`/`research`).

### 🔢 Program funding KPIs (research.tsx:204-208)
- `totalCommitted = Σ funding_committed_bn`; `totalDrawn = Σ (funding_drawn_bn ?? 0)`.
- `activeCount = count(status ∈ Active|Ongoing)`; `completedCount = count(status ∈ Completed|Closed)`.
- `totalInvestment = Σ POLICY_TIMELINE.amount_bn`.

### 📋 Program Scorecard grade — `getScore(prog)` (research.tsx:255) — **VALIDATION_SPEC #8**
- `pct = round(actual_value ÷ target_value × 100)`; `pctLabel = pct≥200 ? (pct/100).toFixed(1)+"×" : pct+"%"`.
- `gradeFromPct(p)` = **A ≥95 · B ≥80 · C ≥60 · D ≥40 · F <40**.
- **Exceeded** (`pct ≥ 150`) → **A**.
- **Completed** → `gradeFromPct(min(pct, 120))`.
- **Active (pace-adjusted):** `elapsedPct = round(clamp(0,1, (now − start) ÷ (end − start)) × 100)`; `ratio = pct ÷ elapsedPct`; grade = **A ≥1.05 · B ≥0.9 · C ≥0.7 · D ≥0.5 · F <0.5** (delivery vs time elapsed).
- **Active, no timeline** → `gradeFromPct(pct)`.

### 🔢 Evidence-base counts & escalation
- **"681 reports / 5,059 passages"** (VALIDATION_SPEC #4) — `REPORTS` count + Pinecone `vector_count(namespace=research)`. Auto-refreshed monthly by the research-pipeline. `filteredReports = REPORTS.filter(search/agency)`.
- Primary-outcome %: `min(round(actual_value ÷ target_value × 100), 999)` (capped to avoid chart overflow).
- **"58.5% cost escalation since 2019 → $10B HAFF ≈ $5.5B effective"** — derived narrative from `BILLION_DOLLAR_YIELD` (construction.ts): yield drop drives effective-purchasing-power statement.
- **AI "Ask Research"** → `POST /api/policy-impact` (Pinecone retrieval + LLM). Pro-gated.

**Cadence:** programs/policy AHURI+Treasury ad-hoc (budget cycle); evidence base **monthly auto** (research-pipeline). **Status:** 🟡 — grade rubric + funding rollups fully traced; the A–F thresholds are HIVE-defined (document rationale); confirm 681/5,059 against live Pinecone count.

---

## Coverage summary

All **14 content pages traced** via exhaustive calc-sweep (every `Math.*`, arithmetic, `reduce`/`map`/`filter` cross-checked against the section). Composite/assumption items flagged for VALIDATION_SPEC follow-up:

| Flag | Where | Action |
|---|---|---|
| `TRUE_NEED_MULTIPLIER` (per-state) | §3 Supply Pipeline | document basis |
| `opportunity_score` / band | §6 Funding | document formula |
| Compound weights 40/35/25 + bands | §7 Asset Intelligence | document rationale; validate 152/13 |
| Climate hazard weights (30/25/20/15/10) | §8 Climate Risk | document rationale; source-trace sub-scores |
| $2,200 energy penalty | §9 Building Energy | document basis |
| ESG pillar scores (32/48/56) | §11 ESG | document rubric |
| Program grade A–F thresholds | §13 Research | document rationale |
| State land + R3/R4 HAFF estimates | §5 Viability | mark "estimate" in customer view |

Next: run the **NotebookLM double-reference check** (per VALIDATION_SPEC) on the flagged figures, and promote each page 🟡→✅ as its sources reconcile.

<!-- ============================================================= -->
