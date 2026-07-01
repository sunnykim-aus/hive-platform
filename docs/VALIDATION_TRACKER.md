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
| Current | 1.00 | 0.96 | 1.00 | 1.13 | 0.93 | 0.96 | 1.42 | 1.08 | 🔴 all |
| Confirmed | | | | | | | | | |
> **NotebookLM (Notebook A):** "From the Rawlinsons State Cost Index, quote the
> construction cost index for each state/capital relative to Sydney/NSW = 1.00.
> Give all eight." ⚠️ NT 1.42 (42% remote premium) and WA 1.13 are the big levers — check first.

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

## Progress
- **Feasibility:** structure ✅, all state values extracted ✅, internal-consistency run ✅,
  NSW scenario triangulated 🟡. **External source-checks pending** (6 lookups → 42 values).
- **Other pages:** listed; detailed blocks to follow.
