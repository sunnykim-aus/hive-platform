# NotebookLM Validation Runbook — step-by-step

Validate every flagged HIVE figure against its **primary source** using NotebookLM
as the "second checker". Pairs with `DATA_MANUAL.md` (the method) and
`VALIDATION_SPEC.md` (the pass/fail bar). Work top-to-bottom.

**Why NotebookLM:** it answers *only* from sources you upload and quotes the exact
passage — it can't invent a number. A figure that traces to a quoted passage =
**double reference** → ✅. No trace / mismatch → 🔴 (fix the source or the formula).

---

## The loop (same 5 steps for every figure)

1. **Open the right Notebook** (4 grouped notebooks below). Create it once.
2. **Upload the source doc(s)** listed for that figure (PDF, or the ABS table page → "Print → Save as PDF", or paste the URL as a website source).
3. **Paste the prompt** given for that figure (claim + method already filled in).
4. **Read NotebookLM's answer + its cited passage.** Copy the quoted passage.
5. **Record the verdict** in the table at the bottom: ✅ (traces, ≤ tolerance) / 🟡 (close, note the gap) / 🔴 (no trace / mismatch). Paste the cited passage as evidence.

> Tolerance rule: numbers that should match exactly (counts from a table) → exact.
> Modelled/rounded figures → within ~5%, and note it.

---

## Notebook A — Funding & Viability  ⭐ start here (marketing flagship)

**Create notebook:** "HIVE — Funding & Viability". Upload these sources once:
- **Rawlinsons Australian Construction Handbook 2025** (proprietary — you likely have it through work; upload the community-housing $/m² page, Table 1.3). ⚠️ If you can't upload it, mark cost figures 🟡 "source not independently checkable" and move on.
- **Housing Australia — HAFF program documents + latest Annual Report 2023-24** (housingaustralia.gov.au → Publications).
- **Treasury Budget Paper No.2 2023-24 to 2025-26** (budget.gov.au — search "HAFF").
- **PropTrack National Rental Report, latest quarter** (proptrack.com.au/insights-hub).
- **ABS Household Income and Wealth, Australia 2023-24** (abs.gov.au — search "6523.0" / "Household Income and Wealth").

### A1 · $137k per-dwelling funding gap  (VALIDATION_SPEC #1 · DATA_MANUAL §5)
**Prompt to paste:**
> I am checking a calculated figure against these sources. Claim: a new 2-bedroom
> community-housing dwelling in NSW, 100% social tenure, has a funding gap of about
> $137,000 *before land*, after a HAFF grant and Housing Australia debt. Method:
> Total Development Cost (hard cost = gross area × state-adjusted $/m² from
> Rawlinsons 2025, + 8% professional fees + 12% contingency + 6% finance + council
> + statutory charges) MINUS (HAFF grant ≈ $55k/home + NHFIC/HA debt sized from
> social rent at 5.5%/30yr, 1.10 DSCR, 30% opex + state land). For each input —
> the $/m² rate, the 5.5% lending rate, the 1.10 DSCR, the ~$55k HAFF grant, the
> social rent level — quote the exact passage in the sources that supports it, or
> say it is not supported.

**Record:** does each input trace? The gap is only as solid as its weakest input.

### A2 · $55,451 HAFF average grant/home
**Prompt:**
> Confirm from these sources: total HAFF grants committed to date and the home
> target. Claim: ≈ $2,223.6M committed ÷ 40,000 homes ≈ $55,451 per home. Quote the
> committed-funding figure and the home target, and compute the per-home value.

### A3 · NHFIC/HA lending rate 5.5% + DSCR 1.10
**Prompt:**
> From the Housing Australia documents: what is the published lending rate and the
> minimum Debt Service Coverage Ratio for mixed-tenure projects? Quote the passages.
> Claim: 5.5% indicative rate, DSCR 1.10 minimum.

---

## Notebook B — Housing Need & Demand

**Create notebook:** "HIVE — Housing Need". Upload:
- **ABS Census 2021** — Housing tenure & homelessness data (abs.gov.au → "Census 2021 housing"). For the homeless count: **ABS *Estimating Homelessness: Census 2021*** (Cat. 2049.0).
- **ABS Survey of Income and Housing 2021-22** (abs.gov.au → "6523.0" / "Survey of Income and Housing").
- **AIHW *Specialist Homelessness Services Annual Report* (latest)** (aihw.gov.au).
- **AHURI *Estimating need for social housing / core housing need*** report (ahuri.edu.au).
- **The 8 state/territory social-housing register annual reports** (for the 213k waitlist).

### B1 · Rental stress 1.31M / 640k severe  (#7 · §1/§3)
**Prompt:**
> From the ABS Survey of Income and Housing / Census: how many renter households pay
> more than 30% of income on rent (rental stress) and more than 50% (severe)? Quote
> the table/passage. Claim: ~1.31 million in rental stress, ~640,000 in severe stress.

### B2 · 213,000 social-housing waitlist  (#2 · §1)
**Prompt:**
> From these state social-housing register reports, list the "greatest need / eligible
> waiting list" applicant count for each state and territory, with the quoted figure
> and report year for each. Then sum them. Claim: ~213,000 nationally.

> ⚠️ Note for me: are the state figures all the same year? households vs applicants?
> Flag any definitional mismatch — that is the main risk in this number.

### B3 · 122,494 homeless on Census night  (§7)
**Prompt:**
> From ABS *Estimating Homelessness: Census 2021*: what is the total homeless count
> on Census night, and the breakdown by category (rough sleeping, supported
> accommodation, boarding houses, severely crowded, etc.)? Quote each. Claim: 122,494
> total; categories 8,200 / 21,000 / 18,700 / 14,400 / 47,400.

### B4 · 740,000 core housing need  (§1/§2/§7)
**Prompt:**
> From the AHURI report: what is the estimated number of households in core housing
> need, and how is "core housing need" defined? Quote the figure and the definition.
> Claim: ~740,000 households.

---

## Notebook C — Risk & Asset (composite scores)

**Create notebook:** "HIVE — Climate & Asset Risk". Upload:
- **CSIRO/BOM *Climate Change in Australia* projections** (climatechangeinaustralia.gov.au).
- **CSIRO NatHERS rating distribution study 2023** + **AIHW social-housing energy data**.
- **Insurance Council of Australia** catastrophe data; **Geoscience Australia** coastal/SLR.

> For composite scores the question is **not** "is the score right" (the weights are
> HIVE's design choice) — it's "**are the input hazard sub-scores and energy/LHD
> inputs traceable to these agencies?**" Validate the inputs; document the weighting
> as a stated methodology.

### C1 · "152 suburbs compound risk / 13 extreme"  (#3 · §7)
**Prompt:**
> I am validating the *inputs* to a composite score, not the weighting. For a sample
> suburb, the model uses: (a) a climate hazard score from BOM/CSIRO projections,
> (b) the state average NatHERS star rating from CSIRO/AIHW, (c) the state % of social
> housing meeting Livable Housing Silver. For each input, quote the source passage
> that gives that value. Are these three inputs each independently supported?

**Record:** if inputs trace → the composite is "methodology-defensible" (mark ✅ on
inputs, and keep a one-line note: *"weights 40/35/25 are HIVE's analytical choice"*).

---

## Notebook D — Evidence Base & Programs

**Create notebook:** "HIVE — Programs & Evidence". Upload:
- **Treasury Budget Papers** (program funding committed/drawn).
- **Relevant AHURI / program evaluation reports** for any scorecard you want to defend.

### D1 · "681 reports / 5,059 indexed passages"  (#4 · §13)
> No NotebookLM needed — this is a **live system count**, not a published figure.
> Validate it directly against the index instead (ask me to run the Pinecone
> `vector_count` + report-ledger count). Record the live numbers + the date.

### D2 · Program Scorecard A–F grades  (#8 · §13)
**Prompt (per program you publish):**
> From this program's official reporting: what was the delivery target (with unit and
> year) and the actual delivered figure to date? Quote both. I will then apply a
> pace-adjusted grade.

**Record:** the grade *rubric* is HIVE's (A ≥95% etc.) — what NotebookLM validates is
the **target and actual** that go into it. Note the rubric as stated methodology.

---

## Verdict log  (fill as you go)

| Figure | Notebook | NotebookLM traced? | Cited passage (paste) | Verdict | Note |
|---|---|---|---|---|---|
| A1 $137k gap | A | | | | weakest input governs |
| A2 $55,451 grant | A | | | | |
| A3 5.5% / 1.10 DSCR | A | | | | |
| B1 1.31M / 640k stress | B | | | | |
| B2 213k waitlist | B | | | | year/def mismatch risk |
| B3 122,494 homeless | B | | | | |
| B4 740k core need | B | | | | |
| C1 152 / 13 extreme | C | | | | inputs only; weights = method |
| D1 681 / 5,059 | D | | | | live count, not NotebookLM |
| D2 scorecard grades | D | | | | target+actual only |

**After the log is filled:** for each ✅ promote the page in `DATA_MANUAL.md` 🟡→✅;
for each 🔴 fix the source or formula in `lib/data/*.ts` *before* sending any
marketing traffic to that number (VALIDATION_SPEC rule: marketing is the last switch).
