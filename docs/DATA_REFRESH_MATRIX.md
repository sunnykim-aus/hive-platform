# HIVE Data Refresh Matrix

Which structured dataset (`lib/data/*.ts`) comes from where, how often the source
publishes, whether it can be auto-crawled, and when to next refresh it. The
monthly "HIVE Data renew matrix" routine reads this to flag what's due.

> Two separate systems — don't confuse them:
> - **Research evidence base** (Pinecone `hive-research`) → the AI search/citations. Auto-refreshed monthly by `research-pipeline/` (new reports).
> - **Structured data** (this matrix, `lib/data/*.ts`) → dashboard numbers + calculators. Mostly static; only the rows marked ✅ auto-update.

## Cadence × automatability

| Dataset (`lib/data/`) | Source | Source cadence | Typical release | Auto-crawlable? | Current refresh |
|---|---|---|---|---|---|
| building-approvals.ts | ABS Cat 8731.0 | **Monthly** | ~1 month lag | ✅ ABS machine-readable | ✅ **Auto (monthly action)** |
| state-analysis.ts | AIHW SHS + state HAs | Annual | varies | ⚠️ semi | ✅ Auto (monthly action — overkill but harmless) |
| construction.ts | ABS Cat 6427.0 (+ Rawlinsons) | **Quarterly** (PPI) | ~6 wks after qtr | ✅ ABS / 🔴 Rawlinsons part | ❌ Manual |
| population.ts | ABS Cat 3101.0 (ERP) / 3222.0 | **Quarterly** (ERP) | ~6 mo lag | ✅ ABS | ❌ Manual |
| funding.ts | Treasury Budget Papers | **Annual** (+ MYEFO) | **May** (+ Dec) | ⚠️ semi (budget PDFs) | ❌ Manual |
| haff.ts | Treasury / Housing Australia | Annual / per HAFF round | May + round dates | ⚠️ semi | ❌ Manual |
| feasibility.ts | Rawlinsons Cost Guide (+ ABS) | Annual | yearly edition | 🔴 **Paid/proprietary** | ❌ Manual |
| chp-sector.ts | AIHW Housing Assistance | **Annual** | ~mid-year (Jun–Jul) | ⚠️ semi (annual report) | ❌ Manual |
| esg.ts | AIHW Housing Assistance | Annual | ~mid-year | ⚠️ semi | ❌ Manual |
| building-energy.ts | AIHW + NatHERS | Annual | ~mid-year | ⚠️ semi | ❌ Manual |
| livable-housing.ts | AIHW + AHURI | Annual / ad-hoc | varies | ⚠️ semi | ❌ Manual |
| shs.ts | AIHW Specialist Homelessness Svcs | **Annual** | ~Dec–Jan | ⚠️ semi | ❌ Manual |
| housing-need.ts | ABS Census + AIHW + AHURI | 5-yr (Census) / annual (AIHW) | Census→2027 | ⚠️ mixed | ❌ Manual |
| sa4-opportunity.ts | ABS Census + AIHW + state waitlists | 5-yr / annual | mixed | ⚠️ mixed | ❌ Manual |
| climate-risk.ts | ABS Census-derived | **5-yearly** (Census) | next 2027 | n/a | ❌ Manual (rarely changes) |
| asset-intelligence.ts | Composite/derived | — | recompute on input change | derived | ❌ Manual |
| policy-timeline.ts | Policy events | Ad-hoc | as announced | n/a | ❌ Manual (event-driven) |
| programs.ts | AHURI / Treasury | Ad-hoc / annual | varies | ⚠️ semi | ❌ Manual |

## What's due, by month (quick check for the routine)

- **Every month:** ABS Building Approvals (already auto). Nothing else strictly monthly.
- **Quarter ends (Jan, Apr, Jul, Oct → data lands the following weeks):** ABS Construction PPI (6427), ABS ERP population (3101).
- **May–Jun:** Federal Budget → funding.ts, haff.ts. AIHW Housing Assistance (mid-year) → chp-sector, esg, building-energy.
- **Dec–Jan:** AIHW SHS annual → shs.ts, state-analysis. MYEFO → funding.ts.
- **2027:** Census 2021→2026 data lands → housing-need, sa4-opportunity, climate-risk, population projections.

## Recommended automation priority

1. **construction.ts + population.ts (ABS, quarterly)** — same machine-readable pattern as building-approvals; highest ROI, lowest effort. *(not yet built)*
2. **AIHW annual sets** — only yearly; a once-a-year manual update is cheaper than a PDF-parsing crawler. Prefer a **reminder + assisted update** over full automation.
3. **Treasury (funding/haff)** — once a year post-budget; manual/assisted.
4. **Leave manual:** Rawlinsons (paid), Census (5-yearly), policy-timeline (event-driven), asset-intelligence (derived).

> Bottom line: automating the **2 quarterly ABS sets** covers most of the remaining "freshness" gap cheaply. The rest is annual/ad-hoc where a monthly *check + nudge* (this routine) beats building 16 crawlers.
