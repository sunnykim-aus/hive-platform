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
| **live-dashboard** (Housing Data) | shs, building-approvals, housing-need, haff, construction, chp-sector | 2🟦 3📊 2📈 + KPIs | ⬜ TODO |
| **housing-need** | housing-need | 3📊 + KPIs/tables | 🟡 traced (§1 below) |
| **state-demand-supply** (Supply Pipeline) | population, state-analysis | 7📊 1🔀 3📈 | ⬜ TODO |
| **population** | population | 1📊 1🔀 1📈 | ⬜ TODO |
| **feasibility** (Development Viability) | feasibility | 1📊 + calculators | ⬜ TODO |
| **funding-sector** (Funding & Programs) | funding, haff, chp-sector, construction | 5📊 2📈 2🥧 | ⬜ TODO |
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
- **📋 Need-vs-supply rows** (page.tsx:634) — `TYPOLOGY_MISMATCH` (bedroom size, location, accessibility, tenure security) each with need_pct vs supply_pct. `radarData` is computed (page.tsx:113) for an optional radar view. **Source:** composite — ABS Census (bedroom/location), AIHW (accessibility/disability 42%/97%), tenancy norms. **Calc:** transcribed; gap = need_pct − supply_pct. **Cadence:** Census 5-yr / AIHW annual.

### §7 · Hidden Homelessness Iceberg
- **📋 Layered iceberg** (page.tsx:715) — `HOMELESSNESS_LAYERS`: rough sleeping 8,200 · crisis accom 21,000 · boarding 18,700 · severe overcrowding 14,400 · couch-surfing 47,400 (ABS Census 2021 categories; crisis = AIHW) → hidden: AHURI estimate 400,000 · core need 740,000 (AHURI 2023). Headline `ABS_CENSUS_HOMELESS_TOTAL = 122,494`. **Calc:** Census-night counts (visible) vs AHURI modelled estimates (hidden) — note the two methodologies differ. **Cadence:** Census 5-yr · AIHW annual · AHURI ad-hoc.

**Page status:** 🟡 — every chart/metric traced; confirm the SIH stress %s, the 213k waitlist, and AHURI 400k/740k against latest releases (NotebookLM check).

<!-- NEXT: live-dashboard (Housing Data) — 6 data files, 7 charts -->
<!-- ============================================================= -->
