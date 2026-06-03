/**
 * My Portfolio — localStorage-based user portfolio store
 *
 * No auth required for Level 1. Persists to browser localStorage.
 * Personalises: Home Situation Room, Climate Risk, Asset Intelligence, HAFF requirements.
 *
 * Level 2 upgrade path: swap localStorage for Supabase + NextAuth
 */

export type HousingStream =
  | "general_social"
  | "womens_safety"
  | "first_nations"
  | "older_persons"
  | "disability_ndis"
  | "key_worker"
  | "homelessness"

export type CHPTier = "tier1" | "tier2" | "tier3" | "government_ha"

export interface UserPortfolio {
  // Organisation identity
  org_name: string
  org_type: CHPTier

  // Geographic focus
  primary_state: string           // "NSW", "VIC" etc. or "All"
  focus_suburbs: string[]         // suburb ids from climate-risk.ts

  // Portfolio size
  managed_dwellings: number
  owned_dwellings: number
  leased_dwellings: number

  // Housing streams active
  housing_streams: HousingStream[]

  // HAFF participation
  haff_applicant: boolean
  last_haff_round: string         // "Round 1" | "Round 2" | "Round 3" | "Not applied"

  // Sustainability — self-reported
  avg_nathers_rating: number | null  // 1.0–10.0 stars, null = not set
  pct_solar: number | null           // 0–100%
  pct_7star_compliant: number | null // 0–100% of owned stock meeting NCC 2022

  // NHR
  nhr_registered: boolean
  nhr_tier: number | null         // 1, 2, or 3

  // Timestamps
  created_at: string
  updated_at: string
}

export const PORTFOLIO_KEY = "hive_portfolio_v1"

export const DEFAULT_PORTFOLIO: UserPortfolio = {
  org_name: "",
  org_type: "tier2",
  primary_state: "All",
  focus_suburbs: [],
  managed_dwellings: 0,
  owned_dwellings: 0,
  leased_dwellings: 0,
  housing_streams: ["general_social"],
  haff_applicant: false,
  last_haff_round: "Not applied",
  avg_nathers_rating: null,
  pct_solar: null,
  pct_7star_compliant: null,
  nhr_registered: false,
  nhr_tier: null,
  created_at: "",
  updated_at: "",
}

export const STREAM_LABELS: Record<HousingStream, string> = {
  general_social:   "General Social & Affordable",
  womens_safety:    "Women & Children Fleeing Violence",
  first_nations:    "First Nations Housing",
  older_persons:    "Older Persons (65+)",
  disability_ndis:  "Disability / NDIS",
  key_worker:       "Key Worker Affordable",
  homelessness:     "Specialist Homelessness",
}

export const STREAM_HAFF_TIER: Record<HousingStream, string> = {
  general_social:   "Silver minimum",
  womens_safety:    "Gold mandatory",
  first_nations:    "Gold mandatory",
  older_persons:    "Gold mandatory",
  disability_ndis:  "Platinum / SDA",
  key_worker:       "Silver minimum",
  homelessness:     "Silver minimum",
}

export const CHP_TIER_LABELS: Record<CHPTier, string> = {
  tier1:         "Tier 1 CHP (2,000+ dwellings)",
  tier2:         "Tier 2 CHP (mid-size)",
  tier3:         "Tier 3 CHP (small / specialist)",
  government_ha: "Government Housing Authority",
}

// Client-side only — guards against SSR
export function loadPortfolio(): UserPortfolio | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(PORTFOLIO_KEY)
    if (!raw) return null
    return JSON.parse(raw) as UserPortfolio
  } catch {
    return null
  }
}

export function savePortfolio(p: UserPortfolio): void {
  if (typeof window === "undefined") return
  const updated = { ...p, updated_at: new Date().toISOString() }
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(updated))
}

export function clearPortfolio(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(PORTFOLIO_KEY)
}

export function hasPortfolio(): boolean {
  if (typeof window === "undefined") return false
  return !!localStorage.getItem(PORTFOLIO_KEY) && !!loadPortfolio()?.org_name
}

// Derive insights from portfolio
export function getPortfolioInsights(p: UserPortfolio) {
  const haffTiers = [...new Set(p.housing_streams.map(s => STREAM_HAFF_TIER[s]))]
  const needsGold = haffTiers.includes("Gold mandatory")
  const needsPlatinum = haffTiers.includes("Platinum / SDA")
  const minTier = needsPlatinum ? "Platinum" : needsGold ? "Gold" : "Silver"

  return {
    min_lhd_tier: minTier,
    needs_gold_streams: p.housing_streams.filter(s => STREAM_HAFF_TIER[s] === "Gold mandatory"),
    needs_platinum_streams: p.housing_streams.filter(s => STREAM_HAFF_TIER[s] === "Platinum / SDA"),
    total_managed: p.managed_dwellings,
    primary_state: p.primary_state,
    is_haff_eligible: p.nhr_registered && (p.nhr_tier === 1 || p.nhr_tier === 2),
  }
}
