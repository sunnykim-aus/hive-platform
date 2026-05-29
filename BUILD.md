# HIVE Platform — Build Log
**Date:** 29 May 2026  
**Project:** hive.impactanalyticsaustralia.com.au  
**Stack:** Next.js 16 · TypeScript · Recharts · Vercel  
**Repo:** github.com/sunnykim-aus/hive-platform  
**Local dev:** http://localhost:3003  

---

## What Was Built

HIVE (Housing Intelligence & Evidence) is a Next.js website that presents Australian housing data and evidence for community housing professionals, policy advocates, and investors. It is the public-facing, always-on version of the HIVE intelligence platform — the data mirrors the Streamlit research app but runs as a standalone Next.js site deployed on Vercel.

---

## Session Overview — 29 May 2026

This document captures every step taken to get the platform from initial scaffold to its current deployed state.

---

## Phase 1 — Initial Scaffold (commit: `335462a`)

Started as a basic Next.js search app wired to Pinecone + Claude. Single-page proof of concept. No design, no data pages.

---

## Phase 2 — Full Platform Rebuild (commit: `b204c25`)

Rebuilt from scratch as a 12-page platform. All pages ported from the Streamlit research app into Next.js/TypeScript.

**Pages created:**
| Route | Page |
|-------|------|
| `/` | Homepage — crisis overview, capabilities, data sources |
| `/live-dashboard` | Live housing demand dashboard |
| `/state-demand-supply` | State-by-state demand & supply analysis |
| `/population` | Population projections to 2044 |
| `/conditions` | Construction costs & housing conditions |
| `/haff` | Housing Australia Future Fund (Rounds 1–3) |
| `/ask-research` | AI research query interface |
| `/policy-impact` | Policy impact analysis |
| `/outcome-ledger` | Program outcomes tracker |
| `/policy-timeline` | 20 years of federal housing policy |
| `/reports` | Report index |
| `/digest` | Weekly digest |

**Data modules created in `lib/data/`:**
| File | Source | Contents |
|------|--------|----------|
| `building-approvals.ts` | ABS Cat. 8731.0 | Monthly approvals, annual run rate calculation |
| `shs.ts` | AIHW SHS Annual Report | Clients, unmet requests, housing success rate, waitlists |
| `construction.ts` | ABS 6427.0, Rawlinsons, AIHW, UNSW | Cost index, global events, stock condition, govt responses |
| `population.ts` | ABS 3101.0, 3412.0, 3222.0, SQM, CoreLogic | Historical population, NOM, projections to 2044 |
| `haff.ts` | Housing Australia media releases | Rounds 1–3 full data, state breakdowns, delivery pipeline |
| `state-analysis.ts` | State housing authority reports | Waitlists, approvals, completions, demographics by state |
| `programs.ts` | AIHW, Treasury, AHURI, ledger seeder | 8 major federal programs with targets vs outcomes |
| `policy-timeline.ts` | Federal Budget Papers, Housing Australia | 10 policy events 2008–2024 |

---

## Phase 3 — Design & Branding Alignment (commits: `43df25b` → `c8b983e`)

Goal: make the Next.js site match the Streamlit app's design and content exactly.

### Nav bar (`components/HiveNav.tsx`)
- **Brand updated** to: `🐝 HIVE | Housing Intelligence & Evidence`
  - Removed the box/border around the logo
  - Pipe `|` separator between bee icon and tagline
  - No personal branding (removed "Housing Data Lead · Sunny Kim · LinkedIn")
- **Nav pills** made more visible: `fontSize: "0.88rem"`, `padding: "6px 16px"`, inactive colour `#aaa`
- **Fixed build error**: duplicate `padding` property in style object caused TypeScript compile failure — removed the duplicate

### Hero section (`app/page.tsx`)
- `minHeight: 520` for taller hero
- Content pinned to left 55%: `maxWidth: "55%"`, `textAlign: "left"`
- Order: H1 heading → subtitle paragraph → badge row
- **H1:** "Housing Intelligence & Evidence"
- **Subtitle:** "681 indexed reports. Live government data. 10 years of population history. AI-powered synthesis. Built for the people making the case for community housing investment in Australia."
- **Badges:** gold `badge-gold` for "681 Reports Indexed"; grey `badge-grey` for data sources, projections, AI synthesis
- Badges fixed: `font-size: 0.78rem`, removed `text-transform: uppercase`, `letter-spacing: 0`, better contrast (`color: #ccc` not `#888`)

### Homepage content blocks
All content rewritten to match the Streamlit app exactly:

**Research index stats bar:**
- 683 reports · 5,059 chunks · ● Live & Indexed · May 2024
- Flex row with `1px #2a2a4e` vertical dividers between stats

**Why This Exists (3 cards):**
- 📋 The Problem — "Every week, sector professionals need evidence fast..."
- 📚 The Evidence Base — "681 reports across AHURI, ABS, AIHW, Treasury..."
- ⚡ The Solution — "HIVE connects the evidence base to live data and AI synthesis..."

**Insight quote:**
- SK avatar (gold circle, initials)
- Italic quote with full attribution: "Sunny Kim · Housing Data Lead · Community Housing Professional, Australia"

**Platform stats bar:**
- 12 modules | 681+ reports | 10 yrs history | +58% construction costs | 2044 projections
- Flex with dividers

**Housing Crisis in Numbers (4 KPI cards — dynamic data):**
- Dwellings Built Per Year → `approvals.annual_run_rate`
- Annual Supply Shortfall → `approvals.gap_to_target`
- Unmet Housing Requests → `shs.unassisted_requests`
- Housing Success Rate → `shs.housing_success_rate`

**Insight callout box:**
- Full narrative with inline citations (ABS 8731.0, AIHW SHS, ABS 3412.0, ABS 6427.0)
- Dynamic values: `{approvals.pct_of_target}%`, `{approvals.gap_to_target.toLocaleString()}`, `{shs.unassisted_requests.toLocaleString()}`
- Hardcoded verified figures: 203,500 waitlist, 518,000 NOM, 48% rent rise, 3,226 → 1,786 homes per $1B

---

## Phase 4 — Vercel Deployment

- **Repo:** github.com/sunnykim-aus/hive-platform
- **Domain:** hive.impactanalyticsaustralia.com.au
- **Auto-deploy:** every push to `main` branch triggers a Vercel rebuild
- **Build error encountered and fixed:** duplicate `padding` key in nav pill style object — TypeScript rejected it
- **Force redeploy:** used empty commit (`git commit --allow-empty`) when Vercel wasn't picking up changes

---

## Phase 5 — Data Synchronisation Audit (commits: `43d05a0` → `8a35217`)

**Problem discovered:** The Next.js site and Streamlit app were showing different numbers for the same metrics. Root cause: two independently maintained data sources that had never been synchronised.

### Audit results

| Data file | Status | Notes |
|-----------|--------|-------|
| `building-approvals.ts` | ❌ Outdated + wrong method | Only had data to Dec 2024; used `latest × 12` not ABS standard |
| `shs.ts` | ✅ Matched | All 8 years of SHS data identical to Python |
| `construction.ts` | ✅ Matched | Cost index, stock condition, govt responses identical |
| `population.ts` | ✅ Matched | Historical, NOM, projections identical |
| `haff.ts` | ✅ Matched | All 3 rounds, state breakdowns identical |
| `state-analysis.ts` | ✅ Matched | Waitlists, approvals, completions identical |
| `programs.ts` | ✅ Matched | All 8 programs, same figures |
| `policy-timeline.ts` | ✅ Matched | All 10 entries identical |

### Building approvals fix
- **Old data:** hardcoded approximate values ending December 2024
- **New data:** actual ABS figures from live cache, April 2021 → March 2026 (60 months)
- **Old calculation:** `latest month × 12` = 182,400
- **Interim calculation:** `3-month avg × 12` = 188,408 (matched Streamlit but unstable)
- **Final calculation:** trailing 12-month sum = **197,971** (ABS standard — see Phase 6)

### Population constant correction
- `CURRENT_ANNUAL_APPROVALS` in `population.ts` serves the Population page supply-gap chart
- Kept at `163,000` — matches Python `population_data.py` which uses a separate snapshot value for that chart
- Homepage and Live Dashboard use `getBuildingApprovalsSummary()` (live calculated), not this constant
- These are intentionally different contexts within the same platform

---

## Phase 6 — Methodology Decision & Documentation (commit: `2e0d68b`)

### Decision: trailing 12-month sum vs 3-month average × 12

| Method | Figure | Gap | % of target | Risk |
|--------|--------|-----|-------------|------|
| 3-month avg × 12 | 188,408 | 51,592 | 79% | Jan 2026 (10,637) is a seasonal outlier — drags average down by ~9,500 annualised |
| **Trailing 12-month sum** | **197,971** | **42,029** | **82%** | Stable, ABS standard, unassailable in formal submissions |

**Chosen: trailing 12-month sum** — ABS's own standard for annual totals. Absorbs seasonal variation across 12 data points. Directly matches what ABS publishes as their headline annual figure. Still clearly below the 240,000 Accord target (82% of target, 42,029 shortfall).

### Methodology documented in code

Full methodology block written directly into `lib/data/building-approvals.ts`:

```
Annual run rate  = trailing 12-month sum of total dwellings approved nationally.
Supply gap       = National Housing Accord target (240,000/yr) minus annual run rate.
% of target      = annual run rate ÷ 240,000 × 100.
YoY change       = latest month vs same calendar month in prior year.
Coverage         = houses + other residential (semi-detached, townhouses, flats,
                   apartments). All sectors. Australia total.
```

### Verified data sources & figures

| Indicator | Figure | Source | Verified |
|-----------|--------|--------|---------|
| Annual dwelling approvals | 197,971 | ABS Cat. 8731.0 (trailing 12m sum) | ✅ |
| National Accord target | 240,000/yr | National Housing Accord, Sep 2022 | ✅ |
| Annual supply shortfall | 42,029 | HIVE calculation | ✅ |
| % of Accord target | 82% | HIVE calculation | ✅ |
| Unmet housing requests | 79,600 | AIHW SHS Annual Report 2023–24 | ✅ |
| Housing success rate | 27.4% | AIHW SHS 2023–24 (44,800 ÷ 163,400) | ✅ |
| Waitlist — major states | 203,500 | State authority annual reports 2023–24 | ✅ |
| Net overseas migration (peak) | 518,000 | ABS Cat. 3412.0 (2022–23) | ✅ |
| Construction cost rise | +58.5% | ABS Cat. 6427.0 (Q4 2019 → Q1 2025) | ✅ |
| Maintenance backlog | $26.5B | UNSW City Futures Research Centre (2023) | ✅ |
| Homes per $1B (2019) | 3,226 | Rawlinsons ($310,000 avg cost) | ✅ |
| Homes per $1B (2025) | 1,786 | Rawlinsons ($560,000 avg cost) | ✅ |

---

## Phase 7 — Automated Monthly Data Refresh

### What was built

**`scripts/refresh-data.mjs`** — Node.js script (no Python, no external services):
1. Fetches ABS Building Approvals listing page (abs.gov.au)
2. Finds the latest Excel download URL for Table 8731009
3. Downloads and parses the Excel using `exceljs`
4. Locates the correct Australia-total columns by header name matching
5. Extracts last 60 months of data
6. Regenerates `lib/data/building-approvals.ts` with fresh data + full methodology documentation
7. Skips write if data is unchanged (idempotent)

**`npm run refresh`** — manual trigger from Terminal anytime.

**`.github/workflows/monthly-data-refresh.yml`** — GitHub Actions cron:
- Runs automatically on the **15th of every month at 9am AEST** (when ABS typically publishes)
- Can also be triggered manually from GitHub → Actions → Run workflow
- Runs `npm ci` → `npm run refresh` → commits if data changed → pushes to main
- Vercel detects the push and redeploys the live site automatically
- Node.js version: 24 (updated from 20 to avoid GitHub Actions deprecation warning)

### Test result
First manual run: **Success ✅** — 36 seconds total, fetched Mar 2026 data, confirmed 197,971 run rate.

### What refreshes automatically vs manually

| Dataset | Auto-refresh | Frequency |
|---------|-------------|-----------|
| ABS Building Approvals (8731.0) | ✅ GitHub Actions | Monthly — 15th |
| AIHW SHS unmet requests | Manual | Annual (July release) |
| State housing waitlists | Manual | Annual (Oct–Nov) |
| ABS Construction PPI (6427.0) | Manual | Quarterly |
| ABS Population Projections (3222.0) | Manual | Every few years |
| HAFF round data | Manual | As Housing Australia announces |

---

## Key Files Reference

```
hive-platform/
├── app/
│   ├── page.tsx                    Homepage — all dynamic KPIs + content
│   ├── live-dashboard/page.tsx     Live demand dashboard
│   ├── state-demand-supply/page.tsx
│   ├── population/page.tsx
│   ├── conditions/page.tsx
│   ├── haff/page.tsx
│   ├── outcome-ledger/page.tsx
│   ├── policy-timeline/page.tsx
│   ├── ask-research/page.tsx
│   ├── policy-impact/page.tsx
│   ├── reports/page.tsx
│   └── digest/page.tsx
├── components/
│   └── HiveNav.tsx                 Global navigation bar
├── lib/data/
│   ├── building-approvals.ts       ← AUTO-REFRESHED monthly by GitHub Actions
│   ├── shs.ts                      Manual update annually (AIHW, July)
│   ├── construction.ts             Manual update quarterly (ABS 6427.0)
│   ├── population.ts               Manual update annually (ABS 3222.0)
│   ├── haff.ts                     Manual update as rounds announced
│   ├── state-analysis.ts           Manual update annually
│   ├── programs.ts                 Manual update as programs complete
│   └── policy-timeline.ts          Manual update as policies announced
├── scripts/
│   └── refresh-data.mjs            Node.js ABS data fetcher — run with npm run refresh
├── .github/workflows/
│   └── monthly-data-refresh.yml   GitHub Actions cron — runs 15th of each month
├── app/globals.css                 Design tokens & shared utility classes
└── package.json                    npm run refresh added to scripts
```

---

## Commands Reference

```bash
# Local development
npm run dev -- --port 3003        # Start dev server on localhost:3003

# Data refresh
npm run refresh                   # Fetch latest ABS data & regenerate building-approvals.ts

# Build & deploy
npm run build                     # TypeScript compile check
git push origin main              # Triggers Vercel auto-deploy
```

---

## Local Dev Ports (to avoid conflicts)

| Port | Project |
|------|---------|
| 3000 | COMPASS |
| 3001 | MERIDIAN |
| 3002 | Impact Analytics |
| **3003** | **HIVE Platform ← this project** |

---

*Build log maintained by HIVE platform team. Last updated: 29 May 2026.*
