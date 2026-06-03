// ─────────────────────────────────────────────────────────────────────────────
// HIVE access entitlements — single source of truth for tier gating.
//
// Tier ordering (ascending): free < pro < enterprise < government.
// Higher tiers inherit everything below them.
//
// This file is plain TypeScript with no framework imports so it can be used
// from middleware, server components, and client components alike.
// ─────────────────────────────────────────────────────────────────────────────

export type Tier = "free" | "pro" | "enterprise" | "government"

export const TIER_ORDER: Tier[] = ["free", "pro", "enterprise", "government"]

export const TIER_LABEL: Record<Tier, string> = {
  free: "Starter",
  pro: "CHP Pro",
  enterprise: "CHP Enterprise",
  government: "Government / HA",
}

export function tierRank(t: Tier): number {
  return TIER_ORDER.indexOf(t)
}

/** True if `userTier` meets or exceeds `requiredTier`. */
export function meetsTier(userTier: Tier, requiredTier: Tier): boolean {
  return tierRank(userTier) >= tierRank(requiredTier)
}

// ── Route gating ─────────────────────────────────────────────────────────────
// Minimum tier required to OPEN each route. Sub-pages inherit the tier set here.
// Anything not listed falls back to DEFAULT_ROUTE_TIER (fail closed), so a new
// paid page is locked by default until it is explicitly opened up.

export const ROUTE_MIN_TIER: Record<string, Tier> = {
  "/": "free",
  "/legal": "free",

  // ── Auth surfaces — must always be public, or login itself gets gated ──
  "/login": "free",
  "/locked": "free",
  "/auth": "free", // covers /auth/callback and /auth/signout
  "/admin": "free", // page self-guards to super-admins (see app/admin/page.tsx)

  // ── Free (Starter) — substantive pages ──
  "/live-dashboard": "free",      // Housing Data
  "/housing-need": "free",        // national overview free; cohort detail gated in-page
  "/state-demand-supply": "free", // state-level free; full pipeline gated in-page
  "/research": "free",            // Evidence & Policy; full RAG search gated in-page
  "/population": "free",          // demographic sub-page

  // ── Redirect stubs ──
  // These pages only redirect to a real page. Keep them open ("free") so the
  // redirect passes through; the destination page then enforces its own tier.
  "/ask-research": "free",        // → /research  (full RAG gated in-page on /research)
  "/reports": "free",             // → /research
  "/policy-impact": "free",       // → /research  (policy work lives in Evidence & Policy)
  "/policy-timeline": "free",     // → /research
  "/chp-sector": "free",          // → /funding-sector (gated there)
  "/funding-navigator": "free",   // → /funding-sector (gated there)

  // ── CHP Pro — substantive paid pages ──
  "/feasibility": "pro",          // Development Viability modeller
  "/haff": "pro",                 // HAFF modeller (Enterprise adds the submission-pack feature)
  "/funding-sector": "pro",       // Funding & Programs
  "/sustainability": "pro",       // Sustainability suite (+ children below)
  "/climate-risk": "pro",
  "/building-energy": "pro",
  "/livable-housing": "pro",
  "/esg-impact": "pro",
  "/asset-intelligence": "pro",   // compound risk
  "/my-portfolio": "pro",         // portfolio personalisation

  // Note: there is no Enterprise/Government-exclusive *route*. Those tiers are
  // differentiated by FEATURES (branded export, briefing packs, custom data
  // feeds, seat count) — see FEATURE_MIN_TIER below.
}

/** Fail closed: unlisted routes require Pro at minimum. */
export const DEFAULT_ROUTE_TIER: Tier = "pro"

/** Resolve the minimum tier for a pathname (exact, then first-segment prefix). */
export function routeMinTier(pathname: string): Tier {
  if (pathname in ROUTE_MIN_TIER) return ROUTE_MIN_TIER[pathname]
  const seg = "/" + (pathname.split("/")[1] ?? "")
  return ROUTE_MIN_TIER[seg] ?? DEFAULT_ROUTE_TIER
}

/** True if a user on `userTier` may open `pathname`. */
export function canAccessRoute(userTier: Tier, pathname: string): boolean {
  return meetsTier(userTier, routeMinTier(pathname))
}

// ── Feature flags ────────────────────────────────────────────────────────────
// Capabilities that are not whole routes — exports, branding, data feeds, etc.

export type Feature =
  | "export"                 // PDF / Excel export
  | "brandedExport"          // logo-branded report exports
  | "priorityData"           // priority data refresh cadence
  | "haffSubmissionPack"     // HAFF Round submission pack
  | "customDataFeeds"        // custom data feeds
  | "waitlistSupplyGapExport"// waitlist & supply-gap exports
  | "briefingPack"           // ministerial / state briefing pack

export const FEATURE_MIN_TIER: Record<Feature, Tier> = {
  export: "pro",
  brandedExport: "enterprise",
  priorityData: "enterprise",
  haffSubmissionPack: "enterprise",
  customDataFeeds: "government",
  waitlistSupplyGapExport: "government",
  briefingPack: "government",
}

export function hasFeature(userTier: Tier, feature: Feature): boolean {
  return meetsTier(userTier, FEATURE_MIN_TIER[feature])
}

// ── In-page gated sections ───────────────────────────────────────────────────
// Premium sections shown to lower tiers as a locked overlay ("Unlock with Pro").

export type GatedSection =
  | "housingNeedCohortDetail" // cohort selector + detail panel on /housing-need
  | "supplyFullPipeline"      // full demand-supply detail on /state-demand-supply
  | "researchFullSearch"      // full RAG search on /research

export const SECTION_MIN_TIER: Record<GatedSection, Tier> = {
  housingNeedCohortDetail: "pro",
  supplyFullPipeline: "pro",
  researchFullSearch: "pro",
}

export function canSeeSection(userTier: Tier, section: GatedSection): boolean {
  return meetsTier(userTier, SECTION_MIN_TIER[section])
}

// ── Seats ────────────────────────────────────────────────────────────────────

export const TIER_SEATS: Record<Tier, number> = {
  free: 1,
  pro: 3,
  enterprise: 10,
  government: Infinity,
}
