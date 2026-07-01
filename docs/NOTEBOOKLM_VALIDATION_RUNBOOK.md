# NotebookLM Validation Runbook — hand-held, step-by-step

Goal: verify **every HIVE headline number** against its primary source using
NotebookLM, working from this guide **alone** — no need to re-open the code or ask
questions. Each figure below gives you: the claim → the full arithmetic with real
numbers → which inputs need source-checking → the exact source to upload → the exact
words to paste into NotebookLM → what a PASS vs FAIL answer looks like → where to
record it.

Pairs with `DATA_MANUAL.md` (the method) and `VALIDATION_SPEC.md` (the pass/fail bar).

---

## PART 0 — One-time setup (do this first, ~10 min)

**What NotebookLM is:** a Google tool (notebooklm.google.com, free with a Google
account) that answers questions using *only* the documents you give it, and quotes
the exact sentence it used. That quote is your proof.

**0.1 — Open** notebooklm.google.com → sign in with your Google account.

**0.2 — You will create 4 notebooks** (one per domain, so sources stay grouped):
- **Notebook A — "HIVE · Funding & Viability"**
- **Notebook B — "HIVE · Housing Need"**
- **Notebook C — "HIVE · Climate & Asset Risk"**
- **Notebook D — "HIVE · Programs & Evidence"**

Create Notebook A now: click **"＋ New notebook"** → rename it (top-left title) to
**HIVE · Funding & Viability**.

**0.3 — How to add a source** (you'll do this a lot):
- Click **"＋ Add source"** (top-left panel).
- Choose **PDF/Upload** to upload a downloaded file, **or** **Website/Link** to paste
  a URL, **or** **Paste text** to paste copied text.
- After it loads, the source appears with a ✔ checkbox — leave it **checked** so
  NotebookLM uses it.

**0.4 — How to ask** — type your question in the bottom chat box, press Enter.
The answer will have little **numbered citation chips** (¹ ² ³). **Click a chip** to
jump to the exact sentence in the source. **That sentence is what you copy into the
verdict log.**

**0.5 — Golden rule:** if NotebookLM cannot find support, it will say so ("the sources
do not mention…"). That is a **valid, useful** answer — it means 🔴, not a failure of
the tool.

---

## PART 1 — Notebook A: Funding & Viability  ⭐ (the marketing flagship)

**Upload these sources into Notebook A first** (each figure notes which one it needs):

| Tag | Source to upload | Where to get it |
|---|---|---|
| **[RAWL]** | Rawlinsons Australian Construction Handbook **2025**, community-housing $/m² page (Table 1.3) | Proprietary. You likely have it via work — scan/upload just that page. ⚠️ If you can't, mark cost inputs 🟡 "not independently checkable". |
| **[HA]** | Housing Australia — HAFF program guidelines + **Annual Report 2023-24** | housingaustralia.gov.au → About us → Publications |
| **[TREAS]** | Treasury **Budget Paper No. 2, 2023-24 → 2025-26** (HAFF line items) | budget.gov.au → past budgets → search "Housing Australia Future Fund" |
| **[PT]** | PropTrack **National Rental Report**, latest quarter | proptrack.com.au → Insights Hub → Rental Report |
| **[ABS-INC]** | ABS **Household Income and Wealth, Australia** (Cat. 6523.0), 2023-24 | abs.gov.au → search "6523.0" |

---

### ⭐ A1 — The $137,000 per-dwelling funding gap  (VALIDATION_SPEC #1 · DATA_MANUAL §5)

**What we claim:** a new **NSW 2-bed apartment**, **50/50 social-affordable tenure**,
after a HAFF R1-3-average grant + Housing Australia debt + NSW state land, is
**~$137k short** (before land cost is added to the build).

> ❗ **Important — pin the scenario.** The live calculator only produces $137k for the
> **50/50 mixed** case. The **100% social** case is **$205k**. Before validating, be
> sure the marketing number is describing the 50/50 mix — and that the surrounding
> copy doesn't imply "100% social" (that would be a messaging mismatch to fix).

**The full arithmetic (every number is real — hand-check each line):**

*Step 1 — Total Development Cost (ex-land):*
```
Typology 2-Bed Apartment: net area 76 m², gross factor 1.38, type = apartment
gross area   = round(76 × 1.38)          = 105 m²
$/m² rate    = round(4,200 × 1.00[NSW])  = $4,200        ← [RAWL]
hard cost    = round(105 × 4,200)        = $441,000
professional = round(441,000 × 0.08)     = $35,280       ← 8% (HA benchmark)
contingency  = round(441,000 × 0.12)     = $52,920       ← 12% (CHP standard)
finance      = round(441,000 × 0.06)     = $26,460       ← 6% (18mo @7% ×60% draw)
council      =                             $20,000       ← NSW s.7.11
statutory    =                             $12,000       ← Sydney Water etc.
────────────────────────────────────────────────────────
TDC (ex-land)                            = $587,660
```
*Step 2 — Rental income → debt capacity:*
```
social rent  = $264/wk   ← [ABS-INC]: 25% × (50% × NSW median household income)
market rent  = $730/wk   ← [PT]
affordable   = round(730 × 0.749)        = $547/wk       ← HAFF <75% rule
blended (50/50) = round(264×0.5 + 547×0.5) = $406/wk
  annual        = 406 × 52               = $21,112
  NOI (−30% opex)= 21,112 × 0.70         = $14,778.4
  ÷ DSCR 1.10                            = $13,435
  ÷ debt-service-factor 0.068805*        = $195,260  = NHFIC/HA debt
      *0.068805 = 5.5%×(1.055^30) ÷ ((1.055^30)−1)  [30-yr mortgage constant]
```
*Step 3 — Funding stack & gap:*
```
HAFF grant (R1-3 avg)  = $55,451     ← [HA]/[TREAS]  (= $2,223.6M ÷ 40,000 homes)
NHFIC/HA debt          = $195,260
NSW state land         = $200,000    ← [HA] (⚠️ in-code: "central metro estimate only")
────────────────────────────────────
total funded           = $450,711
FUNDING GAP = 587,660 − 450,711      = $136,949  ≈ $137k   ✔
```

**What NotebookLM must confirm (the source-dependent inputs only):** $4,200/m² rate
[RAWL], 5.5% rate + 1.10 DSCR [HA], $55,451 grant [HA/TREAS], $264 social rent
[ABS-INC], $730 market rent [PT]. *(The 8%/12%/6% on-costs, 30% opex, and land
$200k are HIVE assumptions — see A6.)*

**Paste into NotebookLM (Notebook A):**
> Using only these sources, check each of the following and quote the exact supporting
> passage for each, or say it is not supported:
> 1. Medium-density apartment construction cost is about $4,200 per m² in Sydney/NSW (Rawlinsons 2025).
> 2. Housing Australia's indicative lending rate is about 5.5% and its minimum Debt Service Coverage Ratio for mixed-tenure projects is 1.10.
> 3. The average HAFF grant is about $55,000 per home (total grants committed divided by the ~40,000 home target).
> 4. A social rent in NSW of about $264/week (25% of income, set at 50% of NSW median household income).
> 5. A median market rent in metro Sydney of about $730/week.

**PASS looks like:** *"$4,200/m² — supported: 'Medium-density residential (4–8 storey)
… $4,150–$4,300/m²' [chip]"* → each line has a quoted number within tolerance.
**FAIL looks like:** *"The sources do not state a per-m² rate"* or a quoted number
outside ±5% → mark that input 🔴 and the whole $137k inherits the weakest input.

**Record:** verdict log row A1, plus one row each for the sub-inputs that failed.

---

### A2 — $55,451 HAFF grant per home
**Claim:** total HAFF grants committed ($2,223.6M) ÷ 40,000-home target = $55,451.
**Needs:** [HA], [TREAS]. **Paste:**
> From these sources, quote (a) the total HAFF funding/grants committed to date and
> (b) the total number of homes targeted. Then divide (a) by (b).
**PASS:** both numbers quoted and the division ≈ $55k. **FAIL:** figures differ →
recompute and update `HAFF_GRANT_OPTIONS["r1-3-avg"].grant` in `lib/data/feasibility.ts`.

### A3 — 5.5% lending rate + 1.10 DSCR
**Needs:** [HA]. **Paste:**
> From the Housing Australia documents, quote the published/indicative lending rate
> and the minimum Debt Service Coverage Ratio for mixed-tenure loans.
**PASS:** both quoted. **FAIL / not published:** mark 🟡 "indicative, not published"
(these move rates — note the date).

### A4 — NSW social rent $264/wk & A5 — market rent $730/wk
**Needs:** [ABS-INC] (A4), [PT] (A5). **Paste (A4):**
> Quote the NSW median household income from ABS 6523.0. Then confirm: 50% of that,
> at 25% rent-to-income, weekly, is about $264.
**Paste (A5):**
> Quote the median weekly rent for metro Sydney (all dwellings) from the latest
> PropTrack rental report.
**PASS:** quoted values reproduce $264 / $730 within tolerance.

### A6 — HIVE assumptions in the $137k (document, don't "validate")
These have **no external source** — they are HIVE's modelling choices. Don't hunt for
them in NotebookLM; instead write one defensible line each in `DATA_MANUAL §5`:
- professional fees **8%**, contingency **12%**, finance **6%**, opex **30%**
- NSW state land **$200,000** (flagged in-code as "central metro estimate only")
- gross factor **1.38** for a 2-bed apartment
Mark A6 ✅ once each has a one-line rationale written down.

---

## PART 2 — Notebook B: Housing Need

**Upload into Notebook B:**

| Tag | Source | Where |
|---|---|---|
| **[HLESS]** | ABS *Estimating Homelessness: Census 2021* (Cat. 2049.0) | abs.gov.au → search "2049.0" |
| **[SIH]** | ABS *Survey of Income and Housing 2019-20/2021-22* (Cat. 6523.0/4130.0) | abs.gov.au → search "housing occupancy and costs 4130.0" |
| **[SHS]** | AIHW *Specialist Homelessness Services Annual Report* (latest) | aihw.gov.au → search "specialist homelessness services annual report" |
| **[AHURI]** | AHURI report on core / social housing need | ahuri.edu.au → Research → search "core housing need" |
| **[REG-xx]** | Each state/territory social-housing register annual report (×8) | e.g. "NSW social housing register annual report", "Vic Housing Register report", etc. |

### B1 — Rental stress: 1.31M / 640k severe  (#7 · §1/§3)
**Claim:** ~1,310,000 renter households pay >30% of income on rent; ~640,000 pay >50%.
**No arithmetic — these are read straight from ABS.** **Needs:** [SIH]. **Paste:**
> From the ABS housing-cost data, quote the number of renter households paying more
> than 30% of gross income on housing, and the number paying more than 50%. If only
> percentages are given, quote them plus the total renter households so I can compute.
**PASS:** quoted counts (or % × base) ≈ 1.31M / 640k. **FAIL:** update
`STRESS_SUMMARY.in_rental_stress` / `in_severe_rental_stress` in `housing-need.ts`.

### B2 — 213,000 social-housing waitlist  (#2 · §1)  ⚠️ highest-risk number
**Claim:** ~213,000 households on social-housing waitlists nationally (sum of 8 registers).
**Needs:** [REG-xx] ×8. **Paste (after uploading all 8):**
> For each state and territory register report here, quote the number on the social
> housing waiting list (and specify if it is the "greatest need"/priority subset or
> the total eligible list), with the report year. List all eight, then sum them.
**⚠️ The real risk is definitional, not arithmetic:** are all 8 the same year? Are they
"households" or "applicants"? Greatest-need vs total list? **Paste follow-up:**
> Are these eight figures the same year and the same definition (households vs
> applicants, priority vs total)? Flag any mismatch.
**PASS:** 8 quoted, consistent basis, sum ≈ 213k. **FAIL:** note the mixed basis in
`DATA_MANUAL §1` and either restate the number or add a "mixed-basis, indicative" caveat.

### B3 — 122,494 homeless on Census night  (§7)
**Claim:** 122,494 total; categories 8,200 / 21,000 / 18,700 / 14,400 / 47,400.
**Needs:** [HLESS]. **Paste:**
> From ABS Estimating Homelessness Census 2021, quote the total homeless count on
> Census night and the count in each operational category (improvised/rough sleeping,
> supported accommodation, boarding houses, severely crowded, staying temporarily with
> others). Give the exact figure for each.
**PASS:** total quoted = 122,494 and categories match within rounding. **FAIL:** correct
`HOMELESSNESS_LAYERS` / `ABS_CENSUS_HOMELESS_TOTAL`.

### B4 — 740,000 core housing need  (§1/§7)
**Claim:** ~740,000 households in core housing need (AHURI definition).
**Needs:** [AHURI]. **Paste:**
> Quote the AHURI estimate of households in core (or unmet) housing need, and quote
> its definition of "core housing need". Give the number and the year of the estimate.
**PASS:** number ≈ 740k + definition quoted. **FAIL/older:** update the figure + cite
the specific AHURI report and year in `DATA_MANUAL`.

### B5 — SHS over-representation (worked example)  (§5)
**Claim (arithmetic):** First Nations = 25% of SHS clients ÷ 3.5% of population = **7.1×**
(shown as "7×"); disability 42% ÷ 18% = **2.3×**. **Needs:** [SHS] (client %s) + [HLESS]/
Census (population %s). **Paste:**
> From the AIHW SHS report quote the % of clients who are First Nations and the % with
> disability. Separately confirm the population share of each (~3.5% First Nations, ~18%
> disability). I will divide client-% by population-% to get over-representation.
**PASS:** client %s quoted (25% / 42%) → 7× / 2.3× reproduces.

---

## PART 3 — Notebook C: Climate & Asset Risk (composite scores)

> For composite scores, **do not** try to "validate the score" — the weightings are
> HIVE's design choice. Validate that the **inputs** are traceable, and document the
> weighting as stated methodology.

**Upload into Notebook C:**

| Tag | Source | Where |
|---|---|---|
| **[CSIRO-CL]** | CSIRO/BOM *Climate Change in Australia* projections | climatechangeinaustralia.gov.au |
| **[CSIRO-EN]** | CSIRO NatHERS rating distribution study 2023 + AIHW social-housing energy | csiro.au / aihw.gov.au "housing assistance in Australia" |
| **[ICA]** | Insurance Council of Australia catastrophe data | insurancecouncil.com.au |

### C1 — "152 suburbs compound risk / 13 extreme"  (#3 · §7/§8)
**Claim:** compound score = climate × 0.40 + energyGap × 0.35 + lhdGap × 0.25; counts
of suburbs by band give 152 (at-risk) / 13 (Extreme, ≥85).
**Worked example of the inputs (for one suburb):**
```
climate score = suburb.overall_score              ← from BOM/CSIRO hazard blend [CSIRO-CL]
energy gap    = min(100, round((7 − stateStars)/6 × 100))   ← stateStars from [CSIRO-EN]
   e.g. state avg 2.5★:  (7−2.5)/6 ×100 = 75
lhd gap       = min(100, round(100 − pctSilver))  ← pctSilver from LHD data
   e.g. 12% Silver:  100−12 = 88
compound      = round(climate×0.40 + 75×0.35 + 88×0.25)
```
**Needs:** [CSIRO-CL] (climate), [CSIRO-EN] (NatHERS stars). **Paste:**
> For a NSW social-housing suburb, I need to confirm the *inputs* to a risk model,
> not the model. (1) From the climate projections, quote the projected change in a
> hazard (e.g. days over 35°C) for this region. (2) From the CSIRO/AIHW energy data,
> quote the average NatHERS star rating of existing social housing. Are these two
> inputs supported?
**PASS:** the input values trace → mark C1 ✅ **on inputs**, and add the note *"weights
40/35/25 and band thresholds are HIVE's analytical choice (documented in §7)."*
**FAIL:** input untraceable → fix the input value in `climate-risk.ts` / `building-energy.ts`.

### C2 — Climate hazard weights (document only)
Heat 30 / Flood 25 / Bushfire 20 / Coastal 15 / Cyclone 10 are HIVE's weighting. **No
NotebookLM.** Write one line in `DATA_MANUAL §8` on why (e.g. "heat weighted highest —
dominant social-housing health hazard"). Mark ✅ when written.

---

## PART 4 — Notebook D: Programs & Evidence

### D1 — "681 reports / 5,059 indexed passages"  (#4 · §13)  — NOT a NotebookLM job
This is a **live system count**, not a published figure. Validate it against the actual
index. **Ask me** and I will run the Pinecone `vector_count(namespace=research)` + the
report-ledger count and give you both numbers + today's date to paste into the log.

### D2 — Program Scorecard grades  (#8 · §13)
The A–F rubric is HIVE's; NotebookLM validates the **target and actual** feeding it.
**Upload into Notebook D:** [TREAS] + the specific program's evaluation/annual report.
**Paste (per published program):**
> From this program's official reporting, quote its delivery **target** (with unit and
> year) and the **actual** delivered to date. Give both figures exactly.
**Then apply the rubric yourself:** pct = round(actual ÷ target × 100); grade by
A ≥95 · B ≥80 · C ≥60 · D ≥40 · F <40 (active programs are pace-adjusted vs % of
timeline elapsed — see §13). **PASS:** target + actual both quoted. Record the grade +
note "rubric is HIVE methodology".

---

## Verdict log — fill as you go

| # | Figure | NB | Traced? | Cited passage (paste the quote) | Verdict | Note / fix |
|---|---|---|---|---|---|---|
| A1 | $137k gap (50/50 NSW 2-bed) | A | partial | recomputed $136,949 | 🟡 **NSW defensible (Rawlinsons basis)** | = NSW floor; other states $180–520k |
| A1b | build rate $4,200/m² | A | triangulated | AHURI-Rawl 2017 esc → $4,080–4,760; $501,849/unit → $3,793–4,780 | 🟡 Rawlinsons-basis, not directly quoted | Koste/ABS basis → $3,175–3,771 |
| A2 | $55,451 HAFF grant | A | partial | 40,000-home target confirmed; total not quoted | 🟡 | HAFF $10B / $500M-min confirmed |
| A3 | 5.5% rate / 1.10 DSCR | A | no | "not published; performance-based" | 🟡 indicative | note date |
| A4 | social rent $264 → income$150+CRA$110 | A | ✅ via CRA | AHURI income $129–164 + CRA | ✅ CHP-received basis | fixed weak "50% median" derivation |
| A5 | $730 Sydney market rent | A | ✅ | "median metro Sydney $730 (2024)" | ✅ confirmed | |
| A6 | HIVE assumptions (8/12/6%, land) | A | n/a | (document, don't validate) | | write rationale in §5 |
| B1 | 1.31M / 640k rental stress | B | | | | |
| B2 | 213k waitlist | B | | | | ⚠️ check year + definition |
| B3 | 122,494 homeless | B | | | | |
| B4 | 740k core need | B | | | | |
| B5 | SHS over-rep (7× / 2.3×) | B | | | | |
| C1 | 152 / 13 extreme (inputs) | C | | | | weights = documented method |
| C2 | climate hazard weights | C | n/a | (document) | | write rationale in §8 |
| D1 | 681 / 5,059 | D | | | | live count — ask Claude |
| D2 | scorecard grades | D | | | | rubric = HIVE method |

**When the log is full:** every ✅ → promote that page 🟡→✅ in `DATA_MANUAL.md`.
Every 🔴 → fix the constant in `lib/data/*.ts` **before** any marketing traffic hits
that number (VALIDATION_SPEC rule: *marketing is the last switch you flip*).
