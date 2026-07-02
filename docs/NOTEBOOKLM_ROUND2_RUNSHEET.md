# NotebookLM Round 2 — Low-Risk Double-Check Run Sheet

Collected from the §2 · §3 · §6 · §13 validation sweep (2026-07-02).
**None of these block anything** — the pages are already 🟢 with these items
flagged in DATA_MANUAL. This round either upgrades them to ✅ or produces
small corrections.

**How to use (same as Round 1):**
1. Create a notebook per group (D·E·F below) and upload the listed sources.
2. Paste prompts **in order**, one at a time.
3. For each answer, note: the figure NotebookLM gives · the exact source/page it cites.
4. Bring the results back — I'll apply corrections and mark the tracker.

**Verdict rule (unchanged):** two independent sources agreeing = ✅.
One source only = 🟡 (keep HIVE value, cite the one source).
Contradiction = 🔴 (I correct the code).

---

## Notebook D — State registers & sector series (§2·§3)

**Upload sources:**
- AIHW *Housing Assistance in Australia 2025* (aihw.gov.au — the web report's PDF export, or the "Social housing waiting lists" section)
- Each state's latest annual report if you have them (any subset is fine):
  Homes NSW / DCJ Annual Report 2023-24 · Homes Victoria Annual Report 2023-24 ·
  QLD Dept of Housing Annual Report 2023-24 · WA Dept of Communities 2023-24 ·
  SA Housing Trust 2023-24 · Homes Tasmania 2023-24 · NT + ACT if available
- AIHW social housing dwellings data (stock time series)

### D1 — Per-state waitlist values (HIVE 2024: NSW 61,500 · VIC 63,200 · QLD 35,800 · WA 24,600 · SA 18,400 · TAS 3,500 · NT 2,800 · ACT 3,200; sum 213,000)
```
For each Australian state and territory, what is the most recent social housing
waiting list figure in these sources, and — critically — what UNIT does each
register count (applications, households, or people)? Give one line per state:
state / figure / unit / as-at date / source. Note any state where the register
includes community housing applicants vs public housing only.
```

### D2 — Waitlist basis reconciliation
```
Do these sources explain why the sum of state register waitlists (~213,000)
differs from AIHW's national count of households on public housing + SOMIH
waiting lists (~165,500)? What are the main methodological differences?
```

### D3 — Community housing 2013 baseline (HIVE: 62k → 119k, "+92% in 11 years")
```
What was the number of community housing dwellings in Australia in 2013,
and what is it in the most recent year? Quote the exact figures and years.
```

### D4 — HAFF completions to date (HIVE: ~1,100 as at May 2026)
```
Do these sources state how many HAFF-funded homes have been COMPLETED
(not contracted) to date? Quote the figure and date.
```

### D5 — Social/affordable share of building approvals (HIVE: ~12,000 of ~198k ≈ 6%)
```
What share of annual dwelling approvals or completions in Australia is social
or affordable housing? Is a figure near 6% (roughly 12,000 of 198,000 annual
approvals) supported? Quote state-level figures if given (HIVE cites NSW 3.8%,
VIC 9.8%, QLD 3.5%).
```

### D6 — Sector trend series (SECTOR_TRENDS: public declining ~330k→281k, community rising 62k→119k)
```
Trace the public housing and community housing dwelling counts by year over the
last decade. Do they match a decline from ~330k to ~281k (public) and growth
from ~62k to ~119k (community)? Quote the series you find.
```

---

## Notebook E — Funding program sizes (§6)

**Upload sources:**
- Housing Australia Annual Report 2024-25 (and 2023-24 if you have it)
- Treasury Budget Paper No. 2 (2023-24 and 2024-25) — housing measures sections
- Housing Australia "Funding under the HAFF" page (print to PDF)
- NHIF program guidelines (housingaustralia.gov.au → print to PDF)
- State budget/housing program pages if handy (VIC Big Housing Build, QLD, WA, NSW, SA)

### E1 — NHIF size (HIVE: $3.0B "concessional and equity streams")
```
What is the total size of the National Housing Infrastructure Facility (NHIF),
and how has it changed since establishment? Does $3 billion match the current
facility size? Quote the figure, date, and what the facility can fund.
```

### E2 — Housing Support Program (HIVE: $3.0B — possible conflation)
```
Distinguish between the "Housing Support Program" and the "New Homes Bonus"
under the National Housing Accord. What is the dollar size of EACH? Is the
Housing Support Program $500 million, and the New Homes Bonus $3 billion?
```

### E3 — HA Bond Aggregator / liability cap (HIVE: $10B program size, "$6.3B issued")
```
What is Housing Australia's (formerly NHFIC's) current liability cap for the
Affordable Housing Bond Aggregator, and how much has been issued in loans to
CHPs to date? Quote both figures with dates.
```

### E4 — State program sizes (HIVE: VIC $5.3B · QLD $1.1B · WA $2.4B · NSW $2.0B · SA $0.4B)
```
Confirm the headline funding size of each of these state housing programs:
Victoria Big Housing Build; Queensland Housing Investment Growth Initiative;
WA social housing investment; NSW (LAHC / Building Homes for NSW); South
Australia's public housing program. One line each: program / $ size / source.
```

### E5 — HAFF R1 grant component (HIVE: $561.8M upfront grants, R1)
```
Do these sources break down HAFF/NHAF Round 1 funding by instrument —
availability payments vs concessional loans vs upfront capital grants?
Is a figure near $562M identifiable as the Round 1 grant component?
(Context: HA's total R1+R2 commitment is $14.0B over 25 years.)
```

### E6 — Per-home build cost basis (HIVE: $310k in 2019 → $560k in 2025, drives "45% fewer homes per $1B" and "$10B ≈ $5.5B effective")
```
What do these sources say a new social housing dwelling cost to deliver in
2019 vs 2024-25? Are figures near $310,000 (2019) and $560,000 (now)
supportable as national averages? Quote any per-dwelling development cost
figures with year and geography.
```

### E7 — Top CHP portfolio sizes (spot check)
```
List the largest Australian community housing providers by dwellings under
management with figures from these sources. Quote the top 5-10 with numbers
(HIVE's list is led by the usual Tier 1s — I want to verify magnitudes).
```

---

## Notebook F — Program scorecard history (§13)

**Upload sources:**
- AIHW *Housing Assistance in Australia 2013* (SHI chapter) or DFAHSIA SHI Final Report
- DSS NRAS Evaluation / Review (2014) + AHURI NRAS evaluation
- Housing Australia Annual Report 2023-24 (NHFIC outcomes)
- Treasury Help to Buy materials / Budget Paper measure

### F1 — SHI delivery (HIVE: 19,300 new of 20,000 target; 80,100 repairs of 80,000)
```
How many new social housing dwellings did the Social Housing Initiative
(Nation Building Economic Stimulus) actually deliver, against what target?
And how many repairs/upgrades? Quote exact figures.
```

### F2 — NRAS delivery (HIVE: 36,000 of 50,000 target, "72%")
```
How many NRAS incentives/dwellings were actually delivered against the
original 50,000 target? Quote the final count and the year the program
was closed to new allocations.
```

### F3 — NHFIC dwellings enabled (HIVE: 15,000 by 2024)
```
How many social and affordable dwellings does Housing Australia/NHFIC report
its finance has supported or enabled? Quote the figure and reporting period.
```

### F4 — Help to Buy size (HIVE: $5.5B, 2024)
```
What is the total government commitment to the Help to Buy shared equity
scheme, and when did it commence? Is $5.5 billion supported?
```

---

## Where results go
- ✅/🟡/🔴 per item → I update `DATA_MANUAL.md` (§2/§3/§6/§13 status blocks) and
  `VALIDATION_TRACKER.md`, and correct code where 🔴.
- Items with no source coverage stay flagged as HIVE estimates (same doctrine as §9/§11).
