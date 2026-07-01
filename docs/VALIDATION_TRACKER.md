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
| Current | 730 | 590 | 640 | 750 | 560 | 530 | 650 | 720 | 🔴 all |
| Confirmed | | | | | | | | | |
> **NotebookLM:** "From the latest PropTrack rental report, quote the median weekly
> rent (all dwellings) for each capital city. Give all eight." ⚠️ Check WA $750 > NSW
> $730 — is Perth really above Sydney?

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
| Current | 20,000 | 18,000 | 14,000 | 10,000 | 9,000 | 8,000 | 5,000 | 9,000 | 🔴 all |
> ⚠️ NotebookLM A1 surfaced NSW infill infra ≈ $11,175 (vs current $20,000) — NSW
> council looks HIGH. **NotebookLM:** "Quote per-dwelling local infrastructure /
> developer contributions for infill residential in each capital (note social-housing
> exemptions)."

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

### 1.8 Per-state GAP outputs (2-bed apt, 50/50, R1-3avg) — recompute after inputs confirmed
| NSW | VIC | QLD | WA | SA | TAS | NT | ACT |
|---|---|---|---|---|---|---|---|
| 136,949 | 191,984 | 221,958 | 254,781 | 225,338 | 265,817 | 522,526 | 182,555 |
> **Marketing honesty:** $137k (NSW) is the **national floor**. Typical state $180–265k;
> NT $523k. Present as "from ~$137k (NSW) — most states $200k+", never "$137k typical".

---

## PART 2 — Other pages (to populate next)

| Figure | Page | Current | Source to check | Status |
|---|---|---|---|---|
| 1.31M / 640k rental stress | Housing Need | STRESS_SUMMARY | ABS SIH | 🔴 |
| 213k waitlist | Housing Need | 213,000 | 8 state registers | 🔴 ⚠️ def. risk |
| 122,494 homeless | Housing Need | ABS_CENSUS_HOMELESS_TOTAL | ABS 2049.0 | 🔴 |
| 740k core need | Housing Need | HOMELESSNESS_LAYERS | AHURI | 🔴 |
| 152 / 13 compound | Asset Intel | computed | inputs: CSIRO/AIHW | 🔴 |
| Climate hazard weights | Climate Risk | 30/25/20/15/10 | — | ⬛ |
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

## Progress
- **Feasibility:** structure ✅ · all state values extracted ✅ · internal-consistency ✅ ·
  NSW $137k triangulated 🟡 · **multiplier cross-checked vs T&T ✅ (WA flagged 🔴)** ·
  social-rent+CRA basis fixed in code ✅. **Remaining:** RUN 1–5 (external sources).
- **Other pages (B/C/D):** listed in Part 2; detailed blocks + prompts to follow next.
