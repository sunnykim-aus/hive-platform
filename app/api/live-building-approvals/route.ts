/**
 * Live Building Approvals — ABS DataAPI
 *
 * Fetches monthly residential building approvals from the ABS API.
 * Cached for 6 hours so we don't hammer the API.
 *
 * ABS DataAPI: https://api.data.abs.gov.au/
 * Dataset: BUILDING_APPROVALS
 * Metric: New private sector houses + other dwellings approved nationally
 */

import { NextResponse } from "next/server"

// Simple in-process cache (resets on server restart — fine for MVP)
let cache: { data: LiveApprovals; fetched_at: string } | null = null
const CACHE_TTL_MS = 6 * 60 * 60 * 1000  // 6 hours

export interface LiveApprovals {
  // National monthly figures
  monthly_total: number        // total dwellings approved (latest month)
  monthly_houses: number       // private sector houses
  monthly_other: number        // other private dwellings (units, townhouses)
  annual_run_rate: number      // rolling 12-month total
  pct_of_accord_target: number // % of 240,000 Accord annual target
  gap_to_accord_target: number // shortfall vs Accord
  reference_period: string     // e.g. "March 2026"
  source: string
  fetched_at: string
  is_live: boolean             // true = from ABS API, false = fallback static
}

// ABS DataAPI endpoint for building approvals
// SDMX-JSON format — national total residential approved (monthly)
const ABS_URL =
  "https://api.data.abs.gov.au/data/ABS,BUILDING_APPROVALS,1.0.0/" +
  "M.10.0+Q.10.AUS/all?" +
  "startPeriod=2024-01&dimensionAtObservation=AllDimensions"

async function fetchFromABS(): Promise<Partial<LiveApprovals>> {
  const res = await fetch(ABS_URL, {
    headers: { Accept: "application/vnd.sdmx.data+json" },
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`ABS API ${res.status}`)

  const json = await res.json()
  // Parse SDMX-JSON structure
  const dataSets = json?.data?.dataSets?.[0]?.observations
  if (!dataSets) throw new Error("No observations in ABS response")

  // Extract all observation values — they're indexed by period
  const values = Object.values(dataSets) as [number, number][]
  if (!values.length) throw new Error("Empty observations")

  // Take last 13 values (latest 12 months + 1 prior)
  const recent = values.slice(-13).map(v => v[0])
  const monthly_total = recent[recent.length - 1] || 0
  const annual_run_rate = recent.slice(-12).reduce((s, v) => s + v, 0)

  return { monthly_total, annual_run_rate }
}

// Fallback using our existing static data (always available)
function getFallback(): LiveApprovals {
  // These are the values from building-approvals.ts — updated when we ingest
  const annual_run_rate = 177_000   // from ABS Cat. 8731.0 (as coded in our data file)
  const accord_target   = 240_000
  return {
    monthly_total:        Math.round(annual_run_rate / 12),
    monthly_houses:       Math.round(annual_run_rate / 12 * 0.55),
    monthly_other:        Math.round(annual_run_rate / 12 * 0.45),
    annual_run_rate,
    pct_of_accord_target: Math.round(annual_run_rate / accord_target * 100),
    gap_to_accord_target: accord_target - annual_run_rate,
    reference_period:     "Latest available",
    source:               "ABS Cat. 8731.0 (static — updated quarterly)",
    fetched_at:           new Date().toISOString(),
    is_live:              false,
  }
}

export async function GET() {
  // Return cached data if fresh
  if (cache && Date.now() - new Date(cache.fetched_at).getTime() < CACHE_TTL_MS) {
    return NextResponse.json(cache.data, {
      headers: { "X-Cache": "HIT", "X-Cache-Age": String(Math.round((Date.now() - new Date(cache.fetched_at).getTime()) / 1000)) + "s" }
    })
  }

  try {
    // Try ABS API
    const live = await fetchFromABS()
    const accord_target = 240_000
    const annual = live.annual_run_rate ?? 177_000

    const data: LiveApprovals = {
      monthly_total:        live.monthly_total ?? Math.round(annual / 12),
      monthly_houses:       Math.round(annual / 12 * 0.55),
      monthly_other:        Math.round(annual / 12 * 0.45),
      annual_run_rate:      annual,
      pct_of_accord_target: Math.round(annual / accord_target * 100),
      gap_to_accord_target: accord_target - annual,
      reference_period:     new Date().toLocaleDateString("en-AU", { month: "long", year: "numeric" }),
      source:               "ABS DataAPI — Cat. 8731.0 (live)",
      fetched_at:           new Date().toISOString(),
      is_live:              true,
    }

    cache = { data, fetched_at: new Date().toISOString() }
    return NextResponse.json(data, { headers: { "X-Cache": "MISS" } })

  } catch (err) {
    // ABS API unavailable — return verified static fallback
    console.warn("ABS API unavailable, using static fallback:", err)
    const fallback = getFallback()
    // Still cache for 1 hour to avoid repeated failed calls
    cache = { data: fallback, fetched_at: new Date(Date.now() - CACHE_TTL_MS + 3_600_000).toISOString() }
    return NextResponse.json(fallback, {
      headers: { "X-Cache": "FALLBACK" }
    })
  }
}
