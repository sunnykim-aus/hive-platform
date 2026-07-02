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
| **live-dashboard** (Housing Data) | shs, building-approvals, housing-need, haff, construction, chp-sector | 2🟦 3📊 2📈 + KPIs | 🟢 validated + corrected (§2) |
| **housing-need** | housing-need | 3📊 + KPIs/tables | 🟡 §1 + Notebook-B corrected (waitlist→165.5k) |
| **state-demand-supply** (Supply Pipeline) | population, state-analysis | 7📊 1🔀 3📈 | 🟢 validated + corrected (§3) |
| **population** | population | 1📊 1🔀 1📈 | ✅ traced (§4) |
| **feasibility** (Development Viability) | feasibility | 1📊 + calculators | 🟢 validated §5 (2026-07) — pending Rawlinsons |
| **funding-sector** (Funding & Programs) | funding, haff, chp-sector, construction | 5📊 2📈 2🥧 | 🟢 validated + corrected (§6) |
| **asset-intelligence** | asset-intelligence, climate-risk | KPIs/score tables | 🟢 validated §7 (Notebook C) |
| **climate-risk** | climate-risk | KPIs/score tables | 🟡 §8 — HIVE-constructed scores (C) |
| **building-energy** | building-energy | KPIs/tables | 🔴 §9 — NatHERS unsourceable (no published data) |
| **livable-housing** | livable-housing | KPIs/tables | 🟡 §10 — Silver optimistic (no SH-specific data) |
| **esg-impact** | esg | KPIs/tables | 🔴 §11 — metric-layer errors (audit needed) |
| **sustainability** (hub) | building-energy, livable-housing, esg, asset-intelligence | rollup KPIs | ✅ traced (§12) — rollup |
| **research** (Evidence & Policy) | policy-timeline, programs | scorecard, timeline, KPIs | 🟢 validated + corrected (§13) |
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
- **Status:** 🟢 Notebook-B **corrected in code (2026-07)**: waitlist →165.5k, core need →640k, CRA →$110, homeless breakdown → exact ABS 2021 groups. Rental stress held at 2021 (no newer official data). B5 SHS over-rep ✅ (25/3.5≈7×, arithmetic). ⚠️ note the `gap`/`craCovers` §1 calc now uses CRA $110.

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
- **"Sector must grow N×":** `round(640000 ÷ SECTOR_OVERVIEW.community_housing × 10) ÷ 10` — core housing need (AHURI/City Futures 640k) ÷ current community-housing stock (119k), to 1 decimal → **5.4×**.
- **Cohort bars vs core need:** each `pct = max(value ÷ 640000 × 100, 0.4)` (min 0.4 for visibility); label `round(value ÷ 640000 × 100)`%.
- **Source:** AHURI/City Futures (640k, 2021 Census) + AIHW HOU 322 (community_housing). **Cadence:** AHURI ad-hoc / AIHW annual.

**Page status:** 🟢 **validated + corrected 2026-07-02.** The data files were current (AIHW Jun 2025 · HA Jul 2025 · AIHW SHS 2024-25) but the **prose hardcoded stale figures** — all fixed:
- core need 740k → **640k** (9 places incl. proportional-scale chart base + scale-up calc);
- waitlist row 213k → **165,500** (AIHW 2025 households); by-state chart keeps the state-register series (~213k sum) with an explicit note distinguishing the two measures;
  - **SUPERSEDED by NotebookLM Round 2 (D1, 2026-07-02): waitlist REBUILT from RoGS 2026 Table 18A.29** — per-state households on the **public housing** waiting list at 30 June: **2025 national 189,536** (decade high; NSW 59,077 · VIC 56,230 · QLD 24,112 · WA 22,409 · SA 13,687 · NT 5,467 · TAS 5,152 · ACT 3,402), 2024 = 168,552 (derived from RoGS change-from-2024), NSW 2019-23 from AIHW Households.27. The old 213k series was **untraceable and materially wrong per state** (QLD +33% · SA +26% overstated; TAS −32% · NT −49% understated). SOMIH separate: **17,478** (18A.31; ⚠️ ≠ AIHW's 6,400 — scope check pending). Community housing: integrated registers, no addable national list. QLD caveat: ~99.6% "greatest need" (restrictive eligibility — not comparable). `WAITLIST_DATA` (shs.ts) + `WAITLIST_TREND` (state-analysis.ts) rebuilt with verified points only; §1/§2/§3 + homepage headline prose updated to 189,536; chart now 2019–2025 (pre-2024 NSW-only). **D2 ✅ RESOLVED (2026-07-02):** the 213k-vs-165.5k gap = integrated common registers include community-housing applicants (~26% of stock) that AIHW's public+SOMIH count excludes; there are NO national minimum data specifications for social-housing waitlists. SOMIH 17,478 (RoGS, program-level, double-counting allowed) vs ~6,400 (AIHW, unduplicated/subset) — so **never sum PH + SOMIH lists** (overlap); on-page phrasing adjusted accordingly. SOMIH operates only in NSW/QLD/SA/TAS/NT. **D3 ✅ (2026-07-02):** community housing 2013 baseline corrected **62k → 67,385** tenancy rental units (2005: 30,392 · 2025: 118,425 units, 110,326 households housed — HIVE's 119k current ✅ confirmed). Growth claim "+92%" → **+77%**; fixed in §2 KPI/prose + §6 prose + SECTOR_TRENDS (2015-2021 points marked as interpolations pending verification). Note: community housing is counted in *tenancy rental units*, not dwellings. **D4 🟡 no-coverage (2026-07-02):** RoGS/AIHW sources report NASHH programs only and explicitly exclude non-NASHH programs — HAFF completions aren't in them. HIVE's "~1,100 completed (est. May 2026)" stays labelled as an estimate (on-page label already says "est."). → **Re-ask in Notebook E** (HA Annual Report 2024-25 / Senate Estimates are the right sources). **D5 🔴🔴 (2026-07-02) — two fixes:** ① HIVE's "12,000 (~6%) of approvals are social/affordable (NSW 3.8/VIC 9.8/QLD 3.5)" was **unsupported** — replaced with the verified framing: **net social-stock gain just ~6,000 dwellings in 2023-24 (AIHW 446k → 452k) ≈ 3% of the ~198k pipeline**; household share slid 4.7% (2013) → 4.1% (2024). ② **Total social stock corrected 432k → 452,000** — the old figure was PH 281k + CH 119k + ICH 32k and **missed SOMIH ~16k** (the "AIHW ~432,129" comment was untraceable); chp_share 28% → 26%. Bonus verified ammo: state public-housing capex $3.51B in 2024-25 (up from $2.7B) · NSW committed 8,400 new social homes · ACT 400 by 2027. **D6 ✅🔴 (2026-07-02) — full verified series + 2 fixes:** `SECTOR_TRENDS` rebuilt with the complete RoGS/AIHW national series 2013–2025 (PH dwellings 328,340 → 296,541 · CH units 67,385 → 118,425; no more interpolated points). Fixes: ① `public_housing` **281k → 297.7k** — 281k was *households in* PH (285,256 in 2025), not dwellings; ② `indigenous_community_housing` **32k → ~20k** (reconciles components to the 452k total: 297.7+118.8+15.6+20 ≈ 452 ✓; §2 public-share KPI now computes 66% ≈ verified 65.9%). Prose: "330k→281k (−15%)" → "328k→297k dwellings (−10%)"; NSW 2018-19 transfer of ~10,700 properties added as the divestment example. PH share of social housing 88.8% (2005) → 65.9% (2024). **E1 🔴 (2026-07-02): NHIF $3B → $2B** ($1B est. 2018 [≤$175M grants + $825M loans/equity] + $1B increase Sep 2023 for crisis/transitional). Program capacity header $39.7B → **$38.7B**. Navigator conditions rewritten for the three limbs (CI · SAH · CT) — old text wrongly said NHIF "NOT for construction of dwellings directly"; NHIF-SAH funds homes directly. Bonus: HA statutory liability cap $10B → **$26B** (2025-26 Budget) — noted on HA Loans entry, E3 to confirm. **E2 🔴 CONFIRMED (2026-07-02, NotebookLM outside-note + Treasury web = 2 sources):** the suspected conflation was real. Old entry "Housing Support Program $3.0B" actually bundled **New Homes Bonus $3.0B** (performance payments to states exceeding their 1.2M-target share) with **Housing Support Program $0.5B** (competitive activation funding — services, amenities, planning capability). Entry renamed "New Homes Bonus & Housing Support Program", size → **$3.5B** (National Cabinet, Aug 2023); conditions rewritten per-program. Header capacity $38.7B → **$39.2B**. **E3 ✅🔴 (2026-07-02, HA Annual Report 2024-25):** liability cap **$10B → $26B confirmed** (2025-26 Budget; noted, program row kept at $10B facility basis). But HIVE's "**$6.3B issued**" was wrong for the AHBA: actual **$5.0B approved to CHPs** since establishment (6.3 likely conflated total HA finance across facilities). Fixed in funding.ts + programs.ts (§13 NHFIC outcome row, now sourced to AR 2024-25). New verified detail: $2.8B raised via 7 social/sustainability bond issuances · ~$860M interest savings to the CHP sector. **E4 🔴🔴🔴 (2026-07-02, NotebookLM VIC + web-verified NSW/QLD/WA):** state programs badly stale — NSW $2.0B → **$6.6B** (Building Homes for NSW, 2024-25 Budget, 8,400 public homes) · QLD $1.1B → **$5.6B** (Q-CHIP, 2025-26 Budget) · WA $2.4B → **$3.2B** (cumulative since 2021-22) · VIC $5.3B ✅ confirmed · SA ~$0.4B 🟡 kept (no single headline verified). Combined $11.2B → **$21.1B**; program-capacity header → **$49.1B**. HIVE was understating state investment by ~$10B. **E5 🟡→demoted (2026-07-02):** HA publishes **no per-round instrument split** — the R1 "$561.8M grant component" is **not identifiable anywhere** in HA reporting (NotebookLM even flagged a Budget-page "PDF 562 KB" file size as the possible artifact behind it). Verified per round: homes, projects (279 contracts R1+R2), $14.0B all-instruments. UI demotions: §6 round KPI now shows verified **Projects** (was grant $); §6 state-table column → "Est. Grant ($M, HIVE)"; §2 avg-grant KPI → "Est. Upfront Grant per Home (HIVE)" with the $14.0B/$751k official context. grants_total_m kept in data as HIVE-indicative with a hard do-not-surface-as-fact note. **E6 🔴 REBASED (2026-07-02):** the $310k (2019) / $560k (2025) per-home pair behind "45% fewer homes per $1B" and "$10B ≈ $5.5B" was **not traceable to any source**. Rebased: **2025 ≈ $450k** national blended (HIVE estimate anchored to program evidence — VIC BHB $5.3B ÷ 12,000+ ≈ **$442k**; Wangaratta 2025 $18.3M ÷ 44 = **$416k**); **2019 = $284k** (back-cast via the ABS-sourced +58.5% index). Derived claims now: yield drop **~37%** (was 45) · homes/$1B **3,521 → 2,222** · HAFF effective purchasing power **~$6.3B** (was 5.5). Fixed in construction.ts + homepage + §6 header/KPIs (auto) + §13 KEY_FINDINGS. avg_market_total (490k/820k) remains an unverified HIVE estimate — flagged. **E7 🟡 no-coverage (2026-07-02):** no ranked CHP-by-dwellings list exists in HA sources. TOP_CHPS magnitudes stay HIVE-compiled (from CHP annual reports) — annotated in code; weak corroboration that the universe is right (HA AR 2024-25 names Evolve/Bridge/SGCH/Hume/Foundation/Uniting as active borrowers). Bonus verified: HA has supported **46,000+ homes** since establishment (all facilities). Proper source for a future pass: PowerHousing/CHIA yearbook or Registrar data. **E8 🟡 (2026-07-02):** even HA's AR 2024-25 publishes **no completed-vs-under-construction split** for HAFF/NHAF (only 279 contracts · 18,650 homes · construction must start ≤18 months from contract close). HIVE's ~1,100 completions stays a sector estimate — labels hardened in §2 (both spots) to say HA publishes no completions split. Also noted: HA reports "58,000+ homes supported across all programs in 2024-25" vs "46,000+ since establishment" (different measures — recorded, not reconciled). **F1 ✅ refined (2026-07-02):** SHI new dwellings 19,300 → **19,600** (at 31 Mar 2013; 98% of 20,000) · repairs ~**80,000** ✅ ($400M element) · final funding pool **$5.238B** (revised from announced $5.6B — timeline keeps 5.6 as the announced amount). Grade unchanged (A). **F2 🔴 (2026-07-02):** NRAS "36,000 delivered (2014)" matched no source. Verified: **incentives allocated (incl. reserved) 37,583** at 30 Jun 2015 (ANAO Apr-2015: 37,679) = 75% of the original 50,000 · **dwellings actually delivered & available for rent: 27,614** (30 Jun 2015) · target revised down to 38,000 in the 2014-15 Budget · closed to new allocations **May 2014** · winds down ~2026. Primary metric switched to incentives-allocated (75% → grade stays C); shortfall 14,000 → 12,417. **F3 🔴✅ (2026-07-02):** NHFIC "15,000 dwellings enabled" was untraceable → **18,853 cumulative supported at 30 Jun 2024** (AR 2023-24, AHBA+NHIF). The 46,000+ (Jun 2025) = adds HAFF/NHAF R1-2's 18,650; of the 46k+, 38,000+ are social/affordable (rest market-rate/SDA in mixed projects). Key definition captured: **"supported" = Board-approved finance pipeline, NOT completions** (FY2023-24 completions-supported: 1,783) — explains every HA headline number. **F4 ✅→updated (2026-07-02):** Help to Buy $5.5B was correct pre-2025-26 Budget; **now $6.3B** (+$800M to lift price/income caps). Timeline row updated (Σ → $36.0B... recompute: **$35.2B**/9 events). Detail: legislated Nov 2024, Program Directions 13 Jun 2025, launch late 2025; 40,000 households; equity ≤30% existing / ≤40% new; 2% deposit.
- HAFF "25,804 announced" → **18,650 contracted** R1-2 (✅ HA media 3 Jul 2025; R3 +21,350 in application); 3.5% → **2.9%** of need; avg grant $86k → **$89k** (=1,661.8M ÷ 18,650);
- "What would it take" recomputed: 64k/yr · $5.7B/yr (10-yr) · 32k/yr · $2.9B/yr (20-yr) · **128 years** at ~5k/yr;
- CHP stock 108k → **119k**, social stock 398k → **432k**, public 290k → **281k** (match chp-sector.ts / AIHW);
- "350 **people** turned away/day" → "350 unassisted **requests**/day" (AIHW counts requests ✅ 129k confirmed vs AIHW 2024-25);
- **shs.ts unit break fixed**: `unassisted` 2021-22→2023-24 re-based to AIHW *requests* series (105k/108k/110k) — pre-2021-22 rows are the older unassisted-*people* basis (documented in code, not charted).

⚠️ Still to double-check via NotebookLM (lower stakes): per-state WAITLIST_DATA series (NSW 61.5k etc. vs state register reports) · "62k community housing in 2013" baseline · "~1,100 HAFF completions (May 2026)" · "12,000 (~6%) of approvals are social/affordable" · COST_INDEX quarterly values · SECTOR_TRENDS series.

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
- **`trueNeedEstimate = round(latest_waitlist × TRUE_NEED_MULTIPLIER[state])`** (line 259) — registered waitlist scaled up to estimated true need. ✅ **Relabelled 2026-07-02:** the page previously presented this as "AHURI/NHSC methodology" — an overclaim. Now labelled **HIVE estimate (AHURI-informed)**: the national anchor is real (core need 640k ÷ AIHW waitlist 165.5k ≈ **3.9×**; ÷ register sum 213k ≈ 3.0×), but the per-state spread (NSW 3.8 · VIC 3.5 · QLD 4.1 · WA 3.6 · SA 3.2 · TAS 4.2 · NT 5.8 · ACT 3.4) is a HIVE judgement reflecting relative homelessness/stress rates — not published AHURI figures. Documented in code comment + on-page label + footer.
- **Delivery as % of waitlist (lines 795-797):** `(requiredFor10yr ÷ latest_waitlist × 100).toFixed(1)`% needed/yr; `(accessible_total ÷ latest_waitlist × 100).toFixed(1)`% actual/yr; gap = `annualGap` dwellings/yr.

**Page status:** 🟢 **validated + corrected 2026-07-02.**
- Cross-page consistency ✅ — per-state waitlists identical to §2's `WAITLIST_DATA` (sum 213k); national KPI strip relabelled "State registers · AIHW households: 165.5k"; core-need KPI 740k → **640k**.
- `TRUE_NEED_MULTIPLIER` overclaim fixed — relabelled HIVE estimate (see above).
- Population anchors (state current/2031/2041) consistent with ABS ERP 2026; population.ts validated under §4.
- `accessible_total = latest social + affordable completions`; `years_to_clear = waitlist ÷ accessible_total` — definitions traced (state-analysis.ts:459-461).
⚠️ NotebookLM double-check list: per-state 2024 register values (NSW 61.5k · VIC 63.2k · QLD 35.8k · WA 24.6k · SA 18.4k · TAS 3.5k · NT 2.8k · ACT 3.2k) vs each state authority's annual report · per-state completions series · "less than 5% of backlog" subtitle claim.

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

### SA4 Opportunity Score (`lib/data/sa4-opportunity.ts`) — formula documented ✅
- `need = min(100, stress/60×60 + demand_index×0.40)` · `coverageGap` by Tier-1 count (0→100 · 1→78 · 2→52 · 3→28 · else max(8,100−t1×22)) · `pop = min(100, population/4200)`.
- **`opportunity = need×0.50 + coverageGap×0.30 + pop×0.20`**; bands ≥75 Critical · ≥58 High · ≥42 Moderate · else Well-served.
- **Weights are HIVE judgement** (inputs sourced: RAI 2023 · AIHW · NHR register). Now labelled "HIVE's Opportunity Score" on-page with weights disclosed. 34 SA4s (header comment corrected from 28).

**Page status:** 🟢 **validated + corrected 2026-07-02.**
- **HAFF finance re-based to the official anchor** — HA publishes a **$14.0B total 25-yr commitment for R1–2** (availability payments + concessional loans + limited grants; 9,284 social + 9,366 affordable = 18,650 ✅ matches HIVE homes; ≈ **$751k/home all-instruments**). The old "committed to date $2,223.6M" was untraceable → replaced with $14.0B (label: "Committed R1–2 (25-yr, all instruments)").
- Per-round `grants_total_m` (R1 $561.8M · R2 $1,100M) relabelled **"Grant Component (est.)"** — HA does not publish a per-round grant split; R1 ~$41k vs R2 ~$220k per home are NOT comparable (different instrument mixes). Basis note added in haff.ts.
- feasibility.ts `$55k` note rewritten: **HIVE planning floor for upfront grant**, not "total grants ÷ 40,000". funding.ts `typical_per_dwelling_k: 55` same.
- Header prose fixed: "$39.7B **in program capacity**" (was "committed"; = Σ program sizes ✓ arithmetic) · "**only 47% contracted (53% remains)**" (was inverted "47% uncontracted") · KPI "Combined Committed" → "Combined Program Capacity".
- Sector-shift prose: 290k→**281k** public (−15%) · 108k→**119k** community (+92%) — matches chp-sector.ts.
- R3 indicative-split disclosure ✅ already on-page ("Indicative proportions based on Rounds 1–2").
- yieldDrop 45% ✓ arithmetic ($1B÷$310k vs $1B÷$560k) — **basis of $310k/$560k per-home TDC → NotebookLM list**.
⚠️ NotebookLM double-check list: NHIF $3B size · Housing Support Program $3B (may conflate $500M HSP with $3B New Homes Bonus) · HA Loans $10B cap · state program sizes (VIC 5.3 · QLD 1.1 · WA 2.4 · NSW 2.0 · SA 0.4) · R1 $561.8M grant component provenance · $310k/$560k per-home cost basis · TOP_CHPS dwellings list.

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

**Source:** composite — see §8 (climate), §9 (energy), §10 (LHD). **Cadence:** driven by slowest input (Census 5-yr for climate exposure; energy/LHD ~annual). **Status:** 🟢 **Notebook C — validated + REBUILT 2026-07.** The old "**152 / 13 extreme**" headline was an artifact: heat_score was ~0.87-correlated with the (then-inflated) 35°C-day counts, and overall_score was hand-elevated above its own stated composite formula. After the heat re-base (§8) the scores were rebuilt — heat_score = 0.6·exposure(BOM days + humid-tropical floor) + 0.4·vulnerability(canopy/cooling/UHI/tenant); overall_score = proper weighted composite (heat30/flood25/bushfire20/coastal15/cyclone10, applicable-only). On corrected data the absolute "extreme" count → **~0**, confirming it was never a robust statistic. **Reframed (Frame A):** the product now presents the **top ~10% (16) as "highest-risk" — an explicit HIVE relative ranking**, not an absolute "N extreme" claim. Highest-risk = remote NT/WA First Nations communities. Inputs still anchored (NatHERS 1.8–3.6 vs "1.5–3 stars"; Silver 3–18% vs "~5%"). **Weights/thresholds are HIVE methodology; present as HIVE analysis.**

### 🔬 Worked example — **Derby, WA** (every number on the suburb card, reproducible)

*Derby · Derby-West Kimberley · 1,000 social dwellings · SEIFA 728 · overall 66 (Critical)*

**Step A — Extreme Heat score = 94** (rebuilt 2026, BOM-based)
- **Exposure** = `min(100, 20 + days35×0.55 + days40×1.0)` = 20 + 142×0.55 + 31×1.0 = 129 → **100** (capped). *(BOM Pilbara climatology: 142 days ≥35°C, 31 ≥40°C — one of Australia's hottest inhabited places → maxed.)*
- **Vulnerability** = `35 + (25−canopy) + (100−cooling)×0.2 + (UHI−1)×8 + tenant`
  = 35 + (25−6)=19 + (100−~20)×0.2=16 + (~1.3−1)×8=2.4 + Critical(+12) = **~84**. *(6% canopy, ~20% cooling access, Critical tenant vulnerability — remote Indigenous community, poor stock.)*
- **Heat = 0.60×100 + 0.40×84 = 94.** *("142 days >35°C now → 205 by 2050" = BOM current + CSIRO projection.)*

**Step B — the 5 hazard scores** (heat rebuilt; flood/bushfire/coastal/cyclone are event/mapping-based, validated accurate)
| Heat | Flood | Bushfire | Coastal/SLR | Cyclone |
|---|---|---|---|---|
| **94** | **72** (Fitzroy River, 2023 flood) | **18** (not bushfire-prone) | **58** (King Sound tidal/surge) | **80** (Wind Region C, Cat 4, 12%/yr) |

**Step C — overall_score = 66** (weighted composite of applicable hazards)
`= (94×0.30 + 72×0.25 + 18×0.20 + 58×0.15 + 80×0.10) ÷ 1.0`
`= 28.2 + 18.0 + 3.6 + 8.7 + 8.0 = 66.5 → 66` → **Critical** (≥62 on the rebuilt scale).

**Step D — compound risk = 75** (Asset Intelligence, `computeCompoundRisk`)
`= climate(66)×0.40 + energyGap(WA 73)×0.35 + lhdGap(WA 93)×0.25`
`= 26.4 + 25.6 + 23.3 = 75` → **≥75 = "highest-risk" tier (top ~10%, one of the 16).**
*(WA energyGap = (7−2.6)/6×100 = 73; lhdGap = 100−7 = 93.)*

**Plain-English:** Derby's 94 heat score = *how hot it actually is* (142 days ≥35°C → exposure maxed) × *how badly its people can cope* (no shade, no cooling, vulnerable remote community → 84), blended 60:40. Grounded in BOM measurements + real housing vulnerability, not perception.

# 8. Climate Risk  (`app/climate-risk/page.tsx` + `my-portfolio` → `lib/data/climate-risk.ts`)

**Geographic unit:** SA2 (≈ suburb), high-priority social-housing suburbs across all 8 states/territories.
**Sources:** BOM (temperature + climate projections) · state planning portals (flood overlays, bushfire-prone land) · CSIRO *Climate Change in Australia* (2°C scenario) · Insurance Council of Australia (catastrophe + insurance) · Geoscience Australia (coastal elevation + SLR) · ABS SEIFA (`seifa_score`).

### Hazard + composite scoring (data file header + per-suburb records)
- **Hazard score bands (0–100):** Critical ≥75 · High 58–74 · Moderate 42–57 · Low <42.
- **Composite `overall_score` (applicable hazards only, re-normalised):** **Extreme Heat 30% · Flood 25% · Bushfire 20% · Coastal/SLR 15% · Cyclone 10%.** Only hazards present at the suburb are weighted (weights renormalise to those present).
- **Sub-hazard detail (per suburb):** heat (`days_over_35` current/2030/2050, `days_over_40`, urban-heat-island factor, tree-canopy %, cooling-access %), flood (`in_flood_overlay`, overlay type, `pct_area_in_overlay`, last major event), `insurance_status` (insured / withdrawal_risk / effectively_uninsurable), `est_social_dwellings`, `social_housing_density`.
- **Calc:** sub-hazard scores transcribed from source agencies; `overall_score` = weighted blend of applicable hazards. **Cadence:** CSIRO/BOM projections ad-hoc; planning overlays ~annual; insurance data annual.

**Status:** 🟡 — scoring model + weights documented (Notebook C). The composite `overall_score` per suburb is a **HIVE construct** from BOM/CSIRO/ICA/Geoscience projections — the *methodology* traces to those agencies but individual per-suburb hazard scores are not published figures. Hazard weights (Heat 30/Flood 25/Bushfire 20/Coastal 15/Cyclone 10) are HIVE-defined. Present as HIVE analysis, not official hazard ratings.

**C3 — per-suburb data (2026-07):** suburbs are **real** and grounded in real risk. Of the 5 hazards, flood/bushfire/cyclone are accurate (event-based) and coastal plausible; **only HEAT was overstated**. **HEAT DATA RE-BASED — all 152 suburbs** to BOM "Mean number of days ≥35/40°C" Annual per representative station + CSIRO projections (~×1.4 by 2030, ~×1.8 by 2050). Metro/coastal/tropical were 2–20× too high (Sydney 30→3.2, Cairns 55-62→3.3, Townsville 65→3.7, Darwin 92→13.9); arid zones (Alice 93, Mount Isa 127, Port Hedland 142) were accurate. Confidence B/C/E labelled in `climate-risk.ts` header; 18 prose notes fixed. **Flood:** Lismore 14.4m / highest on record ✅ (fixed: **28 Feb**, ~1,400 Lismore homes vs "4,000+" region-wide). ⚠️ Heat SCORE (0-100) left unchanged — its possible inflation may still affect compound rankings; review separately.

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

**Feeds:** `STATE_ENERGY_DATA.avg_nathers_stars` & `haff_pipeline_7star_pct` → Compound Risk §7. **Cadence:** CSIRO/AIHW ~annual · energy benchmarks annual. **Status:** 🟡→🔴 **NotebookLM re-check (2026-07):** "163k below 3-star" = **162,880 ✅** (Σ stock×pct — arithmetic). BUT ⚠️ **there is NO published social-housing NatHERS data** — AIHW/CSIRO do **not** capture NatHERS ratings for social housing (data is "piecemeal"). So HIVE's per-state `avg_nathers_stars` (1.8–3.6) + national 2.9 + `pct_below_3star` (28–68%) are **HIVE estimates with no sourceable basis at that granularity** — the "CSIRO NatHERS Distribution Study 2023" citation overclaims. Only anchor: **"70% of existing homes ≤3★" (CSIRO)** — and social housing should be *worse* than average, so HIVE's 42%-below-3★ likely **understates** the problem (→ energyGap into compound §7 understated). ⚠️ total stock **387k vs AIHW ~452k**. **Relabel as HIVE estimates; source is a genuine national data gap, not HIVE's fault — but must not be presented as measured.**

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

**Feeds:** `STATE_COMPLIANCE.pct_meeting_silver`, `upgrade_cost_to_silver_bn`, `total_social_dwellings`, `haff_pipeline_compliant_pct` → Compound Risk §7. **Cadence:** AIHW/AHURI ~annual. **Status:** 🟡 **NotebookLM re-check (2026-07):** anchor **✅ confirmed** — ANUHD/Rights & Inclusion Australia review: the voluntary regime achieved **<5% of the 100%-of-new-homes 2020 target** (i.e. <5% of *new* homes meet Silver). HIVE's social-housing figure **9% is above that anchor** → **optimistic** (existing/social stock should be *lower* than new homes; understates the LHD gap fed into compound §7). ⚠️ Like §9, there is **no published social-housing Silver-compliance figure** — per-state `pct_meeting_silver` (3–18%) are HIVE estimates; label as such, not measured.

# 11. ESG Impact  (`app/esg-impact/page.tsx` → `lib/data/esg.ts`)

**Framework:** E / S / G pillars synthesising HIVE data into one evaluative lens (GRESB-style).
**Sources:** **E** — CSIRO NatHERS 2023, ClimateWorks 2023, AIHW 2023, BOM · **S** — AIHW Housing Assistance 2023, SHS Annual Report 2023, CHIA 2023 · **G** — NRSCH Sector Financial Performance Report 2023-24 (gearing, ICR, EBITDA margin, working capital, cashflow adequacy), state Registrar Sector Performance Reports 2024, CHIA Sector Data · **Scoring methodology** — AHURI ESG framework research 2022 + GRESB real-assets methodology.

### Composite score — `SECTOR_COMPOSITE_SCORE` (esg.ts:380)
- **`= round(Σ SECTOR_ESG_SCORES.score ÷ SECTOR_ESG_SCORES.length)`** — straight mean of the pillar scorecards (E 32, S 48, G 56, …).
- Pillar metrics: `ENVIRONMENTAL_METRICS`, `SOCIAL_METRICS`, `GOVERNANCE_METRICS` (each metric: value + rating). `INVESTMENT_USE_CASES`, `ESG_MATURITY_LEVELS` are reference tables.

#### The 26 underlying metrics (what the pillar scores are judged from)
Each metric = a measurable sector data point; its **rating** = how the value compares to a benchmark. Scale: **Lagging** (far below target) · **Below Average** · **Adequate** (meets minimum) · **Leader** (best-in-class). Pillar score is a HIVE judgement over the pillar's ratings (not a formula). Most sources are external; **2 are HIVE-internal** (marked ⚑, the climate/LHD data we re-based).

**🌱 Environmental → 32** (6 of 7 Lagging)
| Metric | Value | Benchmark | Rating | Source |
|---|---|---|---|---|
| Avg NatHERS | 2.9★ | 7★ (NCC) | Lagging | CSIRO 2023 |
| Carbon intensity | 9.8 t CO₂/dw/yr | <3.5t (2035) | Lagging | ClimateWorks 2023 |
| Solar PV | ~12% | 33% national | Lagging | AIHW·ABS 2024 |
| Green Star/NABERS | <2% | ~28% commercial | Lagging | GBCA 2024 |
| Tenant energy poverty | ~38% | ~8.5% national | Lagging | AIHW·ABS 2022 |
| HAFF pipeline 7★+ | ~79% | 100% (R4) | Adequate | HA 2024-25 |
| SH in critical climate zones | ~48 suburbs | ≥75/100 | Lagging | ⚑ HIVE Climate 2026 |

**🏘️ Social → 48** (mixed; 1 Leader)
| Metric | Value | Benchmark | Rating | Source |
|---|---|---|---|---|
| Tenant stability | ~78% | 85%+ | Adequate | AIHW 2023 |
| Avg wait time | 4.2 yrs | <2 yrs | Lagging | state registers 2024 |
| Unmet accommodation need (SHS) | ~49% | <20% | Lagging | AIHW SHS 2022-23 |
| First Nations tenants | ~22% | 3.8% pop (5.8×) | Below Avg | AIHW·ABS |
| Disability/health | ~31% | 18% pop | Below Avg | AIHW·ABS 2022 |
| DV women housed | 38% | 7-day immediate | Lagging | AIHW·ANROWS |
| Livable Silver compliance | ~9% | 100% new builds | Lagging | ⚑ HIVE Livable 2026 |
| Social ROI | $1.70/$1 | positive | **Leader** | AHURI 338 (2020) |

**⚖️ Governance → 56** (mostly Adequate)
| Metric | Value | Benchmark | Rating | Source |
|---|---|---|---|---|
| Regulatory compliance (NRSCH) | ~94%¹ | 100% | Adequate | NRSCH 2024 |
| Sector gearing (Tier 1) | 14.6% | ≤30% (NRSCH) | Adequate | NRSCH 2024 |
| Interest Cover Ratio (Tier 1) | 5.85× | ≥1.5× (NRSCH) | Adequate | NRSCH 2024 |
| Operating EBITDA margin (Tier 1) | 18.7% | ≥8% (NRSCH) · 73% compliant | Adequate | NRSCH 2024 |
| Working Capital Ratio (Tier 1) | 2.12 | ≥1.5 (NRSCH) · 61% compliant | Adequate | NRSCH 2024 |
| Operating Cashflow Adequacy (Tier 1) | 1.21 | ≥1.2 (NRSCH) · **only 55% compliant** | Below Avg | NRSCH 2024 |
| Board independence | ~62% | ≥50% | Adequate | CHIA·AICD |
| HAFF covenant compliance | ~88% | 100% | Adequate | HA 2024-25 |
| Annual report publication | ~71% | 100% (T1-2) | Below Avg | CHIA 2023 |
| Whistleblower policy | ~68% | 100% | Below Avg | HA·CHIA |
| Formal ESG reporting | ~12% | 100% (2028) | Lagging | CHIA 2024 |

**Roll-up:** each metric → rating vs benchmark → pillar score (HIVE judgement) → mean of 3 = **45**. ⚠️ A strict rating-average would be ~37 (Social/Gov set +8–14 above their rating-implied levels → mild optimism). Present as **HIVE ESG framework**, not an external rating.

**✅ NotebookLM metric audit (2026-07) — errors found in INPUTS, now RESOLVED:**
- **(b) "Unmet SHS requests 62%" → ~49% [FIXED `3e3a799`].** Source investigation (AIHW SHS 2022-23) confirmed the 62% was a mislabel: AIHW's 62% is the share of *unassisted requests* that were for short-term/emergency accommodation — not an unmet rate. True figure: 165k clients (60%) needed accommodation, 83.8k (51%) were provided it → **~49% unmet**. (Also cross-turned-away: ~108k unassisted requests/yr, ~295/day.)
- **(e) "Formal ESG reporting 18%" → ~12% [FIXED `dde7490`]** (CHIA: "20+ early adopters" of 166 members, 2024). Overstated.
- **(a) NatHERS 2.9★ — unsourceable** (§9; no published social-housing NatHERS).
- **(c/d/f) Governance financials — VERIFIED against NRSCH Sector Financial Performance Report 2024 [FIXED `<gov>`]:**
  - **gearing 52% → 14.6%** (Tier 1; Tier 2 4.5%). Benchmark ≤65% → **≤30% (NRSCH)**. Prior figure overstated leverage ~3.5× and used the wrong benchmark. 92% of CHPs compliant.
  - **DSCR 1.38× → relabelled Interest Cover Ratio 5.85×** (Tier 1; T2 5.01×). NRSCH publishes ICR, not a pure DSCR. Benchmark ≥1.5×; 68% compliant; eased from 7.49× under rate pressure.
  - **NHR 94% → kept as HIVE estimate of overall registration compliance (unconfirmed by a single national rate), now paired with the verified NRSCH financial-benchmark compliance range 55–92%** (Gearing 92 · EBITDA 73 · ICR 68 · Working Capital 61 · Op. Cashflow 55).
  - **Takeaway:** the sector is *stronger* than HIVE implied — far less leveraged, much higher interest cover. HIVE had *under*stated financial health.

¹ ~94% is a HIVE estimate of overall registration compliance; NRSCH publishes no single national compliance rate. Verified financial-benchmark compliance ranges 55–92% by ratio (see audit note below).

**Calc:** composite = unweighted mean of 3 pillar scores; metric ratings transcribed from sources. **Cadence:** annual (pillar sources). **Status:** 🟡 **HIVE construct — honestly disclosed (2026-07).** Composite **45** = mean(E32/S48/G56). The page **already carries a methodology note** ("HIVE-derived estimates … sector as a whole … individual CHP requires on-site assessment") — good, responsible disclosure. How the pillar scores were set (reverse-engineered): they track each pillar's metric-rating distribution (Env 6/7 "Lagging"→32 ✓) but are **subjective (no rubric)** and lean **optimistic** — Social (~34 implied → 48) and Governance (~48 → 56) sit +8–14 above a strict rating-average; a strict average of all three ≈ 37 vs the stated 45. **Two remaining gaps:** (a) "based on GRESB/UNPRI/ICMA" overclaims — the scores are analyst judgements *informed by* (not computed via) those frameworks → soften to "informed by"; (b) the "green finance threshold **65+**" is not a real standard → label "HIVE benchmark" or replace with an actual green-bond criterion.

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

**Cadence:** programs/policy AHURI+Treasury ad-hoc (budget cycle); evidence base **monthly auto** (research-pipeline).

**Status:** 🟢 **validated + corrected 2026-07-02.**
- **"5,059 passages" ✅ VERIFIED LIVE** — Pinecone `describe_index_stats` returned exactly **5,059 vectors** in namespace `research` (checked 2026-07-02).
- **"681 reports" → "630+"** — crawler meta has 683 records but only **631 unique URLs** (52 duplicates). All 11 on-page "681" references replaced with the defensible floor "630+". *(Pipeline improvement: dedupe reports_meta.json by URL.)*
- **Grade rubric now attributed on-page**: "HIVE rubric" with full thresholds disclosed (completed A ≥95/B ≥80/C ≥60/D ≥40; active pace-ratio A ≥1.05/B ≥0.9/C ≥0.7/D ≥0.5). Targets/outcomes remain sourced (AIHW·DSS·HA·ABS·ANAO); the grade is HIVE's reading.
- **POLICY_TIMELINE corrected**: 2008 stimulus + 2009 SHI rows **merged** (same $5.6B — was double-counted in `totalInvestment`); Accord **$10B → $3.5B** (10.0 was HAFF's figure; matches programs.ts); NRAS year 2011 → **2008**; HomeBuilder 2021 → **2020**; Accord target text 1M → 1.2M. New Σ = **$34.4B across 9 events** (was $46.5B/10 — $12.1B of it double-count/misattribution).
- programs.ts spot-checked ✅: HAFF row matches today's verified 18,650/47%; SHI 19.3k/20k · NRAS 36k/50k · NHFIC $6.3B loans · Accord 177k vs 240k/yr all consistent with cited evaluations.
- KEY_FINDINGS: "640k shortfall by 2041" rephrased → "640k today → ~940k by 2041".
⚠️ NotebookLM list: SHI 19,300 exact · NRAS 36,000 exact · Help to Buy $5.5B · NHFIC "15,000 dwellings enabled" · "$10B HAFF ≈ $5.5B effective" ($310k/$560k per-home basis, shared with §6).

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
