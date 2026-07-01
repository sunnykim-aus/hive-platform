# HIVE Master Validation Tracker

Tracks **every value in the product** from unverified → validated. Feasibility is
fully populated (all 8 states). Each row: current value → source to check → status.
Work the "source lookups" (one lookup validates all 8 states at once).

**Status key:** 🔴 unverified · 🟡 defensible/triangulated (not directly quoted) ·
✅ source-confirmed · ⬛ HIVE assumption (document, don't source).

**How to use:** open the matching NotebookLM notebook, upload the ONE source listed,
paste the prompt, then fill the state columns from its cited answer.

---

## PART 1 — Feasibility (Development Viability)  §5

### 1.0 National constants (validate once, apply to all states)
| Constant | Value | Status | Source / note |
|---|---|---|---|
| On-cost: professional fees | 8% | ⬛ | HIVE (HA benchmark) — write rationale |
| On-cost: contingency | 12% | ⬛ | HIVE (CHP standard) |
| On-cost: construction finance | 6% | ⬛ | HIVE (18mo@7%×60% draw) |
| Opex ratio | 30% | 🟡 | HA CHP benchmarks 2024 (30–35%) — confirm |
| NHFIC/HA rate | 5.5% | 🟡 | Not published; indicative (NotebookLM A3) |
| DSCR | 1.10 | 🟡 | Not published; HA min lending std |
| Debt-service factor | 0.068805 | ✅ | = 5.5%/30yr mortgage constant (math-verified) |
| HAFF grant R1-3 avg | $55,451 | 🟡 | 40,000-home target ✅; total-committed not quoted |
| **Base apartment rate (NSW=1.00)** | **$4,200/m²** | 🟡 | **Rawlinsons-basis triangulated $4,080–4,760** (2017 escalated + $501,849/unit). NOT directly quoted. |
| CRA component (social rent) | $110/wk | 🟡 | Services Australia; family-weighted (single ≈$94) |
| Social income-rent (base) | ~$150/wk | 🟡 | AHURI actual $129–164 |
| Affordable rent ratio | 0.749 | ✅ | HAFF <75% rule |

### 1.1 State cost multiplier  → **Source: Rawlinsons 2025 State Cost Index (1 table)**
| | NSW | VIC | QLD | WA | SA | TAS | NT | ACT | Status |
|---|---|---|---|---|---|---|---|---|---|
| Current (HIVE) | 1.00 | 0.96 | 1.00 | 1.13 | 0.93 | 0.96 | 1.42 | 1.08 | — |
| **T&T GCMI 2025** (Sydney=1.00) | 1.00 | 0.87 | 1.03 | **0.92** | 0.85 | n/a | n/a | n/a | cross-check |
| Verdict vs T&T | ✅ | 🟡 high | 🟡 low | 🔴 **+21pt** | 🟡 high | 🔴? | 🟡 | 🟡 |
| Rawlinsons (user) | ? | ? | ? | ? | ? | ? | ? | ? | pending |

> **Cross-check done (2026-07, T&T GCMI 2025, US$/m²):** Sydney $3,046 · Brisbane $3,135 · Perth $2,815 · Melbourne $2,655 · Adelaide $2,587.
> - **🔴 WA 1.13 overstated** — T&T puts Perth at 0.92 (BELOW Sydney); HIVE's "resources premium" looks like a legacy mining-boom figure. Correcting WA → gap **$254,781 → $138,092** (−$117k/dwelling).
> - **🟡 QLD 1.00 slightly low** — Brisbane now 1.03 (above Sydney); correcting → gap $221,958 → $238,628.
> - **🟡 VIC 0.96 / SA 0.93** run ~8–9 pts above T&T (0.87 / 0.85) — same direction, lean high.
> - **NT/ACT/TAS not in T&T:** public data supports NT large premium (Darwin cyclone +20–40%, remote to $5k/m²); ACT ≈ Sydney + govt premium (1.08 plausible); TAS (0.96) unconfirmed.
> - ⚠️ T&T is a *general* all-building index (methodology ≠ Rawlinsons apartment-specific) → **signal, not replacement**. **Confirm with Rawlinsons 2025 State Cost Index (user).**
>
> **When you have Rawlinsons (Notebook A upload):** "From the Rawlinsons 2025 State Cost Index / location index, quote the construction cost index for each capital relative to Sydney = 1.00. Give all eight (NSW, VIC, QLD, WA, SA, TAS, NT, ACT)." ⚠️ Resolve WA first (T&T–HIVE disagree by 21 pts).

### 1.2 Market rent (weekly)  → **Source: PropTrack National Rental Report, latest Q (1 report)**
| | NSW | VIC | QLD | WA | SA | TAS | NT | ACT | Status |
|---|---|---|---|---|---|---|---|---|---|
| HIVE current | 730 | 590 | 640 | 750 | 560 | 530 | 650 | 720 | — |
| **Domain Mar-2026 UNIT** | 750 | 600 | 660 | 695 | 550 | ~530? | 600 | 580 | ✅ current |
| Domain Mar-2026 house | 800 | 590 | 680 | 740 | — | — | 699 | 700 | ref |
| vs unit | 🟡 low | ✅ | 🟡 low | 🟡 high | ✅ | ? | 🟡 | 🔴 high | |

> **RESOLVED via current web data (Domain Mar-2026 quarter).** The 2024 flags were STALE —
> Perth surged (2024 $580 → 2026 unit $695 / house $740), so HIVE WA $750 is now defensible.
> **Key fix = measure:** HIVE labels "all dwellings" but the feasibility is a 2-bed APARTMENT →
> the **unit median** is the right comparator (house rents run higher). On the unit basis HIVE is
> mostly within ±$50; outliers **ACT $720 vs unit $580** (high), NT $650 vs $600, WA $750 vs $695.
> Shelter WA's $600 was Perth-1BR only — superseded. Hobart unit unconfirmed (~$530; vacancy 0.2%).
> **Proposed set (2026 unit):** NSW 750 · VIC 600 · QLD 660 · WA 695 · SA 550 · TAS 530 · NT 600 · ACT 580.

### 1.3 Social rent (weekly, CHP-received = income-rent + CRA)  → **Source: AHURI + state housing policy**
| | NSW | VIC | QLD | WA | SA | TAS | NT | ACT | Status |
|---|---|---|---|---|---|---|---|---|---|
| Current | 264 | 240 | 228 | 260 | 212 | 216 | 242 | 288 | 🔴 all |
| Implied income (−$110 CRA) | 154 | 130 | 118 | 150 | 102 | 106 | 132 | 178 | check vs $129–164 |
| Confirmed | | | | | | | | | |
> **NotebookLM (Notebook B):** "From AHURI / state housing data, quote the average
> weekly social-housing rent (or the income-based rent) for community housing in each
> state. Note whether it includes Commonwealth Rent Assistance." ⚠️ SA/TAS/QLD implied
> income-rents are below the AHURI $129–164 band — confirm those three.

### 1.4 Council contributions  → **Source: state planning infrastructure schedules**
| | NSW | VIC | QLD | WA | SA | TAS | NT | ACT | Status |
|---|---|---|---|---|---|---|---|---|---|
| was | 20,000 | 18,000 | 14,000 | 10,000 | 9,000 | 8,000 | 5,000 | 9,000 | — |
| HIA/CIE benchmark | 11,175 | 28,673* | 57,106* | 12,091 | 17,552 | 5,672 | — | 3,151 | market |
| **updated** | **11,000** | 18,000 | 14,000 | **12,000** | 9,000 | **6,000** | 5,000 | **4,000** | 🟡 indicative |

> **VERIFIED 2026-07 (method + result).** No clean single source — council contributions are
> **LGA-specific** (NSW s7.11 · VIC ICP · QLD LGIP · WA DCP) and **social/affordable housing is
> often EXEMPT/reduced** (NSW Housing SEPP etc.). So these are **net-of-exemption indicative
> estimates**, not exact charges. Method: compare to HIA "Taxation of the Housing Sector" / CIE
> city benchmarks; align clear outliers; keep conservative where HIVE < benchmark.
> - *Melbourne $28,673 (Fishermans Bend) and Brisbane $57,106 are premium-precinct figures → NOT adopted; kept conservative.*
> - Corrected: NSW 20k→11k, WA 10k→12k, TAS 8k→6k, ACT 9k→4k. **Statutory (1.5) unchanged — utility connections are generally NOT exempt.**
> - To verify a specific project: the target council's Contributions Plan (primary, LGA-specific).

### 1.5 Statutory charges  → **Source: state utility developer-charge schedules**
| | NSW | VIC | QLD | WA | SA | TAS | NT | ACT | Status |
|---|---|---|---|---|---|---|---|---|---|
| Current | 12,000 | 10,000 | 8,000 | 10,000 | 7,000 | 7,000 | 9,000 | 8,000 | 🔴 all |
> NSW ≈ $12,068 confirmed by NotebookLM A1 ✅ (matches). Confirm the other 7.

### 1.6 State land contribution  → **Source: state HA annual reports (already flagged "estimate")**
| | NSW | VIC | QLD | WA | SA | TAS | NT | ACT | Status |
|---|---|---|---|---|---|---|---|---|---|
| Current | 200,000 | 150,000 | 130,000 | 140,000 | 100,000 | 80,000 | 50,000 | 180,000 | 🟡 est. |
> In-code note: "highly project-specific, central metro estimates only." NotebookLM A1
> surfaced raw Sydney infill land ≈ $184,480 (vs $200,000). Keep as labelled estimate.

### 1.7 Typologies (net area / gross factor)  → **Source: NCC minimums + Rawlinsons GFA**
| Typology | net m² | gross factor | Status |
|---|---|---|---|
| Studio/1-Bed | 52 | 1.42 | 🔴 |
| **2-Bed Apartment** | 76 | 1.38 | 🔴 (used in $137k) |
| 3-Bed Apartment | 98 | 1.36 | 🔴 |
| 2-Bed Townhouse | 88 | 1.08 | 🔴 |
| 3-Bed Detached | 128 | 1.04 | 🔴 |

### 1.8 Per-state GAP outputs (2-bed apt, 50/50, R1-3avg)
| basis | NSW | VIC | QLD | WA | SA | TAS | NT | ACT |
|---|---|---|---|---|---|---|---|---|
| original (old inputs) | 136,949 | 191,984 | 221,958 | 254,781 | 225,338 | 265,817 | 522,526 | 182,555 |
| **updated** (2026 unit rent + rebuilt social + council) | **130,835** | **190,541** | **218,111** | **274,575** | **220,047** | **258,046** | **529,259** | **214,106** |

> **Updated 2026-07** with three validated corrections (market rent = Domain Mar-2026 unit ·
> social rent rebuilt on IEL basis · council aligned to HIA benchmark). **Still pending:** build
> rate + cost multipliers (Rawlinsons — user) → gaps not yet final, esp. WA/NT (multiplier flagged).
> **Marketing honesty:** NSW ~$131k is the **national floor**; most states $190–275k, NT $529k.
> Never present the floor as typical.

---

## PART 2 — Other pages (to populate next)

| Figure | Page | Current | Source to check | Status |
|---|---|---|---|---|
| B1 1.31M / 640k rental stress | Housing Need | STRESS_SUMMARY | ABS Census 2021 / SIH 2019-20 | ✅ basis confirmed — NotebookLM: current AIHW/ROGS 2025 reports still use **SIH 2019-20** for rental-stress calcs (corroborates pre-2023-24 basis). SIH 2023-24 withdrawal per ABS Review Report page (my web source; upload it to quote directly). Value held (no newer official data). |
| B2 waitlist ~~213k~~→**165.5k** | Housing Need | 165,500 | AIHW *Housing Assistance 2025* Jun-2024: 159,100 public + 6,400 SOMIH | ✅✅ **double-check corrected my web extract** (I had 184k; NotebookLM PDF read = 165.5k — more authoritative). Range 165k–188k by edition; community-housing lists integrated/unreported; 2026 edition pending. All sources < 213k. |
| B3 122,494 homeless | Housing Need | ABS_CENSUS_HOMELESS_TOTAL | ABS Census 2021 | ✅✅ **double-confirmed** (web + NotebookLM): 7,636/24,291/16,597/22,137/3,934/47,895. Note: ABS applies small random adjustments so groups may not sum exactly to 122,494 |
| B4 core need ~~740k~~→**640k** | Housing Need | HOMELESSNESS_LAYERS + STRESS_SUMMARY | AHURI/City Futures 2022 (2021 Census; →940k 2041) | ✅✅ **double-confirmed** (web + NotebookLM: 640,000 → 940,000 by 2041) |
| B5 SHS over-rep (7× / 2.3×) | Housing Need | SHS_CLIENT_PROFILE | AIHW SHS | ✅ arithmetic (25%÷3.5% = 7×) |
| §9 Building Energy "163k below 3★" | Sustainability hub | STATE_ENERGY_DATA | CSIRO/AIHW | 🟡 163k=162,880 ✅; NatHERS 2.6–3.6 **optimistic** vs "existing 1.8★"; stock 387k vs AIHW ~452k |
| §10 Livable "9% Silver" | Sustainability hub | STATE_COMPLIANCE | AHURI/LHDG | 🟡 9% vs published "~5% comply" — slightly optimistic |
| §11 ESG composite 45 | Sustainability hub | SECTOR_COMPOSITE_SCORE | GRESB method | 🔴 HIVE construct (pillar scores are HIVE judgements) — label "HIVE ESG framework", not external rating |
| — energy/LHD feed compound | Asset Intel | energyGap/lhdGap | — | ⚠️ both optimistic → compound §7 slightly **understates** energy+LHD dimensions (opposite of the old heat overstatement) |
| — CRA max single ~~$94~~→**$110** | Housing Need | STRESS_SUMMARY | Services Australia (authoritative) | ✅✅ **double-confirmed**: Services Australia $215.40/fortnight = $107.70/wk single max (from 20 Mar 2026); Shelter WA Table 3 = $110. $110 within rounding. (raises craCovers 42%→49%) |
| **C1** compound risk headline | Asset Intel | computed | rebuilt on corrected data | ✅ **REBUILT + REFRAMED 2026-07.** The old "**152 / 13 extreme**" was an artifact: heat_score was ~0.87-driven by inflated 35°C-days, and overall_score was hand-elevated (not the stated composite). Rebuilt heat_score (0.6·exposure[BOM days]+0.4·vulnerability) + overall_score (proper weighted composite). On corrected data the absolute "extreme" count collapsed to **~0** → proving it was never robust. **Reframed (Frame A):** dropped the absolute "N extreme" claim → **top ~10% (16) = "highest-risk" (HIVE relative ranking)**. Highest-risk list now = remote NT/WA First Nations communities (Katherine, Derby, Port Hedland, Alice…) — genuinely defensible. Page text updated on home/asset-intelligence/sustainability/climate-risk. |
| **C2** weights 40/35/25 · climate 30/25/20/15/10 · bands ≥85/72/58/42 | Asset/Climate | — | — | ⬛ **HIVE methodology** — document rationale, not source-validate |
| **C3a** per-suburb FLOOD data | Climate Risk | CLIMATE_RISK_SUBURBS | state flood studies / BOM | ✅ real + substantially confirmed (Lismore 14.4m/highest-record; corrected 28 Feb / ~1,400 homes). |
| **C3b** HEAT (30% weight) `days_over_35/40` | Climate Risk | .heat | **BOM station climatology + CSIRO** | ✅ **RE-BASED 2026-07 (all 152).** Was overstated ~2–20× for metro/coastal/tropical. Now BOM "Mean days ≥35/40°C" Annual per station — **11 read directly from BOM**: Sydney 3.2 (was 30), Melbourne 9.2, Adelaide 21.5, Perth 26.8, Cairns 3.3 (was 55-62!), Townsville 3.7 (was 65-85!), Hobart 1.2, Darwin 13.9 (was 92-98!); **arid accurate** — Alice 93.3, Mount Isa 127, Port Hedland 142. + CSIRO (Canberra 7.1, Dubbo 22, Far West 47) + established climatology for smaller zones (labelled B/C/E in code). Projections ~×1.4 (2030)/×1.8 (2050). 18 prose notes fixed. **Heat SCORE (0-100) unchanged — review separately.** |
| **C3c** BUSHFIRE (20%) | Climate Risk | .bushfire | state bushfire-prone maps / events | ✅ event+mapping based, accurate (Tuggeranong "2003 Canberra Firestorm 4 dead/500 homes" ✅; Armadale 2021 Wooroloo; BAL zones factual) |
| **C3d** COASTAL/SLR (15%) | Climate Risk | .coastal | Geoscience Australia / IPCC SLR | 🟡 plausible — "1m SLR by 2100" is mainstream IPCC high-emissions; `pct_area_below_2m_ahd` (38–42% for Cairns/Port Hedland) are HIVE estimates but credible for low-lying tropical towns. No obvious inflation; Geoscience trace to confirm. |
| **C3e** CYCLONE (10%) | Climate Risk | .cyclone | BOM cyclone history | ✅ accurate — Yasi 2011 Cat 5 "north of Townsville" ✅ (Mission Beach); Larry 2006 Cat 5 (BOM-confirmed) at Innisfail 80km S of Cairns ✅; wind regions correct |
| **C3 verdict** | — | — | — | **4 of 5 hazards sound** (flood/bushfire/cyclone accurate, coastal plausible). **Only HEAT (30%) is overstated** → fix scope narrows to a heat re-base, not the whole dataset. |
| $2,200 energy penalty | Building Energy | 2200 | — | ⬛ |
| ESG pillar scores 32/48/56 | ESG | SECTOR_ESG_SCORES | AHURI/GRESB rubric | ⬛ |
| Scorecard A–F thresholds | Research | getScore | — | ⬛ |
| 681 / 5,059 evidence | Research | live count | Pinecone (ask Claude) | 🔴 |
| population/NOM/approvals | multiple | ABS cats | ABS releases | 🔴 |

> Each row expands to its own detailed block (like Part 1) as we reach it.

---

## ▶ NotebookLM Run Sheet — feasibility (do in this order)

Each task = open the notebook, upload the ONE source, paste the prompt, fill the tracker row. Ordered highest-leverage first.

### RUN 1 · Market rents (8 states) — Notebook A
**Upload:** PropTrack National Rental Report, latest quarter (proptrack.com.au → Insights Hub).
> Paste: *"From the latest PropTrack rental report, quote the median weekly rent (all dwellings) for each capital city: Sydney, Melbourne, Brisbane, Perth, Adelaide, Hobart, Darwin, Canberra. Give the exact figure for each."*
**Watch:** HIVE has WA $750 > NSW $730 — confirm Perth really tops Sydney (T&T said Perth is *cheaper* to build, but rents ≠ build cost, so this can still hold). Fill row **1.2**.

### RUN 2 · Social rents + CRA (8 states) — Notebook B
**Upload:** AHURI report on social/community housing rents + (if available) a state housing rent-policy page.
> Paste: *"From these sources, quote the average weekly rent charged for community/social housing (income-based rent), per state if given. Separately: does community housing rent include Commonwealth Rent Assistance (CRA), and what is the maximum weekly CRA for a single person and for a family? Quote each figure."*
**Watch:** implied income (HIVE value − $110 CRA) is below the AHURI $129–164 band for **SA $102 / TAS $106 / QLD $118** — confirm those three. Fill row **1.3**.

### RUN 3 · Council + statutory charges (16 values) — Notebook A
**Upload:** NSW s.7.11 / VIC ICP / QLD infrastructure-charges schedule (+ Sydney Water developer-charges page).
> Paste: *"Quote the per-dwelling (a) local/council infrastructure contribution and (b) statutory utility connection charge for infill residential development in each capital city, and note any social-housing exemption or reduction. Give figures per state where available."*
**Watch:** NotebookLM A1 already found NSW infill infra ≈ $11,175 vs HIVE council **$20,000** — NSW council looks HIGH. NSW statutory $12,068 already ✅. Fill rows **1.4 / 1.5**.

### RUN 4 · The $137k stack (A1–A6) — Notebook A
Already scripted in `NOTEBOOKLM_VALIDATION_RUNBOOK.md` → Part 1 (A1 build rate, A2 grant, A3 rate/DSCR, A4 social+CRA ✅, A5 market ✅). Run any A-rows still blank.

### RUN 5 · State cost multipliers — **USER (Rawlinsons, not NotebookLM)**
Rawlinsons is paid, so NotebookLM can't. T&T cross-check already done (row 1.1). When you open Rawlinsons 2025 State Cost Index:
> Confirm the 8 city indices relative to Sydney = 1.00. **Resolve WA first** (T&T 0.92 vs HIVE 1.13 — 21-pt gap). Then QLD (T&T 1.03 vs 1.00), and NT/ACT/TAS (no public cross-check).

### After each run
Recompute the affected state gaps (ask Claude) and promote the row 🔴→✅. **Do not** market any state's gap until its multiplier + rents are confirmed.

---

## RUN 1–4 results (2026-07, Notebook A) — read this before continuing

**The big lesson: most "not supported" = wrong/dated SOURCE uploaded, not a wrong HIVE number.**
The notebook currently holds *secondary/older* docs (Summer Foundation 2024, HIA Taxation
CIE 2023-24, AHURI 2017, HA Corporate Plan 2024-25, Rawlinsons 2026 *cover pages only*).
To get ✅ we must upload the **primary current releases**.

**Confirmed ✅ (bank these):** 40,000-dwelling target · $10B HAFF / $500M-floor (indexed 2029-30) ·
NSW statutory $12,068 (= HIVE $12,000) · social income-rent ~$155 (AHURI) · Sydney market rent $730 (2024).

**Flags 🔴/🟡 from this run:**
| Input | HIVE | Source said | Note |
|---|---|---|---|
| Build rate $4,200 | $4,200 | Rawlinsons cost tables NOT in upload (cover only); unit costs quoted $404k/$501k/$820k (noisy) | still 🟡 — need actual Rawlinsons 2026 Table 1.3 |
| Rate 5.5% / DSCR 1.10 | 5.5%/1.10 | HA plan qualitative only — "cheaper than private, longer term"; **no number published** | ⬛ **HIVE assumption — will never get external ✅; relabel** |
| HAFF grant $55,451 | $55,451 | target 40k ✅; no "total committed" in upload; floor-basis → **$71,250/home** | 🟡 possibly higher → would *reduce* gap |
| CRA component $110 | $110 | AHURI 2017 models ~$58/wk (dated + all-social avg incl. non-CRA public) | 🟡 need current Services Australia CRA schedule |
| Market rent (8) | see 1.2 | 2024 PropTrack via Summer Foundation: **Perth $580 (HIVE $750!)** · Adelaide $650 ($560) · Canberra $620 ($720) · Melb $570 · Bris $630 · Darwin $600 · Hobart $520 | 🔴 Perth/Adelaide/Canberra off — but 2024 secondary; need primary PropTrack |
| NSW council $20,000 | $20,000 | HIA/CIE: Sydney local infra $11,175 | 🟡 HIVE ~$9k high |

**$137k robustness (NSW, market rent $730 ✅):** across grant $55k–$71k × CRA $58–$110,
NSW gap = **$122k–$149k** → the flagship holds ~$130–140k regardless. ✅ robust.

**Market-rent correction impact:** WA $750→$580 *widens* gap; with mult 0.92 too, WA ≈ $169k.
SA $560→$650 narrows to $209k. ACT $720→$620 widens to $201k. All states stay ≫ NSW.

### ▶ Next: upload PRIMARY current sources to Notebook A
1. **PropTrack National Rental Report** — the actual latest PDF (not Summer Foundation) → market rents
2. **Rawlinsons 2026 Ed.34 — Table 1.3 (apartment) + State Cost Index pages** → build rate + multipliers
3. **Services Australia — Rent Assistance rate schedule (current)** → CRA component
4. **Housing Australia — latest HAFF outcomes / funding-committed announcement** → grant total
5. **Relabel in code:** 5.5% rate + 1.10 DSCR as *HIVE modeling assumptions* (HA lends below-market; exact terms confidential) — these can't be externally sourced.

## RUN 2 partial (Notebook B) — AHURI/Shelter WA "The Eligibility Trap" (Apr 2026)

Primary AHURI 2026 source. Validates the **social-rent income side** (not market rent / build cost).

**Confirmed ✅:**
- **CRA = $110/wk** (single max, private/CHP) — Table 3, "current March 2026". *Our $110 assumption confirmed.*
- **Rent = 25% of income** (public housing; 25-30% NSW/ACT) — confirms HIVE's 25%.
- **Public housing = no CRA; community housing (CHP) = +CRA** → HIVE's CHP-received basis is correct.
- **IEL (single, max weekly income), ROGS 2026:** WA $551 (lowest) · QLD $609 · NSW $795 · VIC $797 · TAS $797 · SA $882 · ACT $925 · NT $1,114.
- **Waitlist counts (ROGS 2026):** WA **22,409** (2024) · VIC **56,532** (2026) · QLD **32,951** (2025). → 3 states = 111,892; useful anchor for the 213k national (row B2).

**Flag 🔴 — social rents run high + don't track IELs:**
- Base case single JobSeeker in a CHP: 25% × $404 + $110 CRA = **~$211/wk**. HIVE WA = $260 (~$50 high).
- No consistent income basis: WA has the *lowest* IEL ($551) but HIVE's 2nd-highest rent ($260); SA has a *high* IEL ($882) but HIVE's lowest rent ($212).
- **DONE (2026-07): `SOCIAL_RENT_WEEKLY` rebuilt** = 25% × [45% JobSeeker $404 + 35% pension $530 + 20% working@0.9×IEL] + CRA $110. Now tracks the IEL; band $227–252 (was $212–288):

| | NSW | VIC | QLD | WA | SA | TAS | NT | ACT |
|---|---|---|---|---|---|---|---|---|
| was | 264 | 240 | 228 | 260 | 212 | 216 | 242 | 288 |
| **rebuilt** | **238** | **238** | **229** | **227** | **242** | **238** | **252** | **243** |
| gap Δ | +$7k | +$0.5k | $0 | +$8k | −$7k | −$6k | −$3k | +$11k |

  NSW flagship gap $137k → **~$144k**. ⚠️ Gaps still use *unvalidated* market rents + multipliers → not final. Assumption: income mix 45/35/20 (adjustable). Verified arithmetically (Python replica of `computeFeasibility`); browser check blocked by launch.json cwd bug (npm ran from `/Users/sunnykim`).

**Still open (not in this source):** market rents (PropTrack), build rate + multipliers (Rawlinsons), council/land.

## ▶ Notebook B double-check run sheet (NotebookLM confirmation of the corrected figures)

Corrections were made from **direct web extraction** of primary sources; run these in NotebookLM as an **independent second reference** (upload the CURRENT sources or you'll get false "not supported").

**Upload:** ABS *Estimating Homelessness: Census 2021* · AIHW *Housing Assistance in Australia 2025* · AHURI/City Futures *Calibrating Australia's social & affordable housing needs* (2022) · Shelter WA *Eligibility Trap* (already up).

| # | Prompt | Expected confirm |
|---|---|---|
| B3 | "Quote the total homeless on Census night 2021 and the count in each operational group (rough sleeping, supported accom, staying-temp, boarding, other temp lodging, severely crowded)." | 7,636 / 24,291 / 16,597 / 22,137 / 3,934 / 47,895 · total 122,494 |
| B2 | "Quote households on the public-housing and SOMIH waiting lists at the latest date (AIHW)." | ✅ 159,100 public + 6,400 SOMIH = 165,500 (Jun 2024) — NotebookLM corrected my web 184k |
| B4 | "Quote the AHURI estimate of households whose housing doesn't meet their needs, and the 2041 projection." | 640,000 → 940,000 (2041) |
| B1 | "Did ABS release SIH 2023-24 renter/housing-cost stats? Quote the release status." | withdrawn / not released |
| CRA | "Quote the max weekly CRA for a single person in Eligibility Trap Table 3." | ✅ $110 (confirmed vs Services Australia $107.70/wk, 20 Mar 2026) |

**Notebook B: COMPLETE ✅** — all 5 figures + CRA validated & (where needed) corrected against latest primary sources, most double-confirmed via NotebookLM/Services Australia. The double-check caught 1 of my own web-extract errors (waitlist 184k→165.5k).

→ Two independent sources agreeing (my web extract + NotebookLM cited passage) = strong ✅ per VALIDATION_SPEC.

## Progress
- **Feasibility:** structure ✅ · all state values extracted ✅ · internal-consistency ✅ ·
  NSW $137k triangulated 🟡 · **multiplier cross-checked vs T&T ✅ (WA flagged 🔴)** ·
  social-rent+CRA basis fixed in code ✅. **Remaining:** RUN 1–5 (external sources).
- **Other pages (B/C/D):** listed in Part 2; detailed blocks + prompts to follow next.
