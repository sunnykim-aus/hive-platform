# HIVE Number Validation Spec  (Phase 2A)

**Goal:** every headline figure HIVE publishes is *defensible on the spot* —
source-cited, method-reproducible, and re-run-matching. Fill the `TODO` cells.

Pairs with `DATA_REFRESH_MATRIX.md` (source + cadence per dataset) — this doc
adds the **calculation method** and **validation status** on top.

---

## The pass/fail bar

A number is **VALIDATED** only when **all three** hold:
1. **Cited** — exact source named (agency · dataset · Cat no. · release/year).
2. **Reproducible** — the method is written so a stranger could redo it and land the same number.
3. **Matches re-run** — pulling the source fresh reproduces the figure (within a stated tolerance).

Status values: `✅ Validated` · `🟡 Partial` (cited but method or re-run gap) · `🔴 Unverified`.

---

## Inventory  (draft — confirm + complete tomorrow)

> Sources below are best-guess from the data files / marketing copy; verify each.

| # | Figure (where it appears) | Primary source(s) — exact dataset + release | Calculation method (reproducible) | Cadence + re-run trigger | Status |
|---|---|---|---|---|---|
| 1 | **$137k per-dwelling funding gap** (Development Viability, marketing) | Rawlinsons Cost Guide 2025 (TDC) · Housing Australia lending guidelines (debt) · Treasury HAFF (grant) · ABS/AIHW (social rents) | NSW 2-bed apt, **50/50 tenure**, R1-3avg: TDC $587,660 − HAFF $55k − debt $195k − land $200k = **$136,949**. Debt sized on CHP rent = income $150 + **CRA $110**. | Rawlinsons annual · ABS rents quarterly | 🟡 **NSW defensible (Rawlinsons basis)** — mkt rent ✅, social+CRA ✅, build-rate 🟡 triangulated, grant/rate 🟡 not-quoted. ⚠️ $137k = NSW **floor**; other states $180–520k, all 🔴 (see VALIDATION_TRACKER). |
| 2 | **213,000 households on waitlists** (Housing Need) | 8 state/territory social-housing registers | Sum of "greatest need / eligible waiting" across 8 registers; dedup rule = TODO | per-register (~annual) | TODO |
| 3 | **152 suburbs compound risk** / 13 extreme (Asset Intelligence) | ABS Census 2021 + AIHW + state HA (climate × energy × accessibility) | Triple-failure composite score: define each axis 0–N + combine formula | Census 5-yearly | TODO |
| 4 | **681 reports / 5,059 indexed passages** (Evidence & Policy) | AHURI·AIHW·ABS·Housing Aus·Treasury·PC·Power Housing·DSS (crawled) | Count of crawled reports / Pinecone vector_count(namespace=research) | ✅ monthly auto (research-pipeline) | TODO |
| 5 | **National shortfall 137,684 dwellings** / 47,000/yr × 20yr | AHURI core-need + AIHW (cited in Ask Research output) | Benchmark (e.g. 5%) need − current stock; annualised over 20yr | annual | TODO |
| 6 | **Viability / feasibility outputs** (per state, typology, tenure) | Rawlinsons 2025 state cost index · ABS PPI 6427.0 · Turner & Townsend | Cost model: base $/m² × state index × typology × tenure mix | Rawlinsons annual · ABS 6427 quarterly | TODO |
| 7 | **Rental stress 1.31M / 640k severe** (Housing Need) | ABS Census/SIH (30% & 50% income thresholds) | Households paying >30% / >50% of income on rent, bottom quintiles | Census 5-yr / SIH | TODO |
| 8 | **Program Scorecard grades** (Evidence & Policy) | Treasury/Housing Aus program data + AIHW outcomes | Delivery-vs-target, pace-adjusted A–F rubric (define thresholds) | annual (budget) | TODO |
| _… add any remaining headline figures from `lib/data/*.ts` here …_ |  |  |  | TODO |

---

## NotebookLM double-reference check (the validation engine)

NotebookLM only answers from uploaded sources and cites the passage — it can't
hallucinate beyond them, so it's a trustworthy "second checker."

**Per figure (or per batch):**
1. Upload the **primary source originals** (the actual ABS release / AIHW report /
   Rawlinsons / state register extract) into a NotebookLM notebook.
2. Paste the figure + its claimed method.
3. Ask: *"Does this number trace to these sources? Quote the exact passage/table.
   If it doesn't reconcile, say where it diverges."*
4. NotebookLM's cited passage = the **double reference**.
5. **Two independent sources agreeing** → strong `✅`. No trace / mismatch → `🔴`, fix.

> Tip: keep one notebook per domain (housing supply, funding, risk) so sources
> stay grouped; re-run the check whenever the underlying dataset refreshes.

---

## Tomorrow's battle order

1. **Finalise the figure list** — grep `lib/data/*.ts` + the marketing case studies; add every published headline number to the table above.
2. **Source** — fill exact dataset + release/Cat no. for each (cross-check `DATA_REFRESH_MATRIX.md`).
3. **Method** — write each calculation reproducibly (formula + inputs + any assumptions).
4. **NotebookLM check** — upload sources, trace each figure, record the cited passage.
5. **Status** — mark ✅ / 🟡 / 🔴. Fix every 🔴 (swap source or correct the formula) before driving any marketing traffic.

**Rule (from the plan):** marketing is the last switch you flip — don't send demos to numbers you can't back on the spot.
