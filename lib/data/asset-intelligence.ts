/**
 * Asset Intelligence — Compound Risk Assessment
 *
 * Combines Climate Risk + Building Energy + Livable Housing + CHP Coverage
 * into a single compound vulnerability score per suburb.
 *
 * The "triple failure" — high climate risk + poor energy performance + low LHD compliance
 * — identifies the social housing stock at most urgent risk nationally.
 *
 * Compound Risk Score (0-100):
 *   Climate Risk:    40% weight  (from climate-risk.ts suburb scores)
 *   Energy Gap:      35% weight  (7 - state avg NatHERS, normalised)
 *   LHD Gap:         25% weight  (100 - state pct meeting Silver)
 */

import { CLIMATE_RISK_SUBURBS, RISK_COLORS, type ClimateRiskSuburb } from "./climate-risk"
import { STATE_ENERGY_DATA, type StateEnergyData } from "./building-energy"
import { STATE_COMPLIANCE, type StateCompliance } from "./livable-housing"
import { getScoredRegions, type SA4Scored } from "./sa4-opportunity"

// ── Compound Risk ─────────────────────────────────────────────────────────────

export type CompoundRiskBand = "Extreme" | "Critical" | "High" | "Moderate" | "Low"

export interface CompoundRiskResult {
  suburb: ClimateRiskSuburb
  state_energy: StateEnergyData
  state_lhd: StateCompliance
  sa4_opportunity: SA4Scored | null

  // Component scores (0–100)
  climate_score: number
  energy_gap_score: number      // higher = worse energy performance
  lhd_gap_score: number         // higher = worse LHD compliance

  // Compound score
  compound_score: number
  compound_band: CompoundRiskBand
  compound_color: string

  // Financial implications
  annual_tenant_extra_energy_cost: number    // extra vs 7-star home
  upgrade_to_silver_cost_k: number           // LHD upgrade per dwelling
  upgrade_to_5star_energy_cost_k: number     // energy upgrade per dwelling
  total_fix_cost_k: number                   // combined per dwelling

  // HAFF readiness
  haff_round4_ready: boolean
  haff_gaps: string[]

  // Key insight
  primary_failure: string
  compound_narrative: string
}

export const COMPOUND_RISK_COLORS: Record<CompoundRiskBand, string> = {
  Extreme:  "#8b1a1a",
  Critical: "#c0614a",
  High:     "#c49a3a",
  Moderate: "#4d7fb5",
  Low:      "#5aad8a",
}

function getCompoundBand(score: number): CompoundRiskBand {
  if (score >= 85) return "Extreme"    // genuine triple-failure — all three dimensions severe
  if (score >= 72) return "Critical"   // two dimensions severe + one high
  if (score >= 58) return "High"       // one severe + others significant
  if (score >= 42) return "Moderate"   // manageable with targeted intervention
  return "Low"
}

export function computeCompoundRisk(suburb: ClimateRiskSuburb): CompoundRiskResult {
  const stateEnergy = STATE_ENERGY_DATA.find(s => s.state === suburb.state)
    ?? STATE_ENERGY_DATA.find(s => s.state === "NSW")!
  const stateLHD = STATE_COMPLIANCE.find(s => s.state === suburb.state)
    ?? STATE_COMPLIANCE.find(s => s.state === "NSW")!
  const sa4Data = getScoredRegions().find(s => s.id.startsWith(suburb.state.toLowerCase()) && suburb.sa4_name.includes(s.state))
    ?? null

  // Climate score — direct from suburb data
  const climateScore = suburb.overall_score

  // Energy gap score — how far below 7-star is this state's social stock?
  // Use 6-star scale (1★ to 7★ = 6 star max gap), cap at 100
  const energyGapScore = Math.min(100, Math.round(((7 - stateEnergy.avg_nathers_stars) / 6) * 100))

  // LHD gap score — how far below 100% Silver compliance?
  // Scale: 0% Silver = 100 gap, 20% Silver = 80 gap (diminishing returns above 20%)
  const lhdGapScore = Math.min(100, Math.round(100 - stateLHD.pct_meeting_silver))

  // Compound score
  const compoundScore = Math.round(
    climateScore * 0.40 +
    energyGapScore * 0.35 +
    lhdGapScore * 0.25
  )

  const band = getCompoundBand(compoundScore)
  const color = COMPOUND_RISK_COLORS[band]

  // Financial implications
  const energyExtra = stateEnergy.avg_annual_energy_bill - 1400   // vs 7-star baseline
  const lhdUpgrade = stateLHD.upgrade_cost_to_silver_bn * 1000 / stateLHD.total_social_dwellings   // $k per dwelling
  const energyUpgrade = 13  // avg 2-star to 5-star per dwelling $k (from building-energy data)
  const totalFix = Math.round(lhdUpgrade + energyUpgrade)

  // HAFF Round 4 readiness — only flag genuine compliance gaps, not broad state averages
  // Thresholds set low enough to only flag states significantly behind
  const haffGaps: string[] = []
  if (stateEnergy.haff_pipeline_7star_pct < 72) {
    haffGaps.push(`State energy pipeline: ${stateEnergy.haff_pipeline_7star_pct}% at 7-star — below 72% threshold`)
  }
  if (stateLHD.haff_pipeline_compliant_pct < 70) {
    haffGaps.push(`State LHD pipeline: ${stateLHD.haff_pipeline_compliant_pct}% Silver-compliant — below 70% threshold`)
  }
  if (suburb.insurance_status === "effectively_uninsurable" || suburb.insurance_status === "withdrawal_risk") {
    haffGaps.push("Insurance withdrawal zone — climate resilience design required for project viability")
  }
  const haffReady = haffGaps.length === 0

  // Primary failure
  const scores = [
    { name: "Climate exposure", score: climateScore },
    { name: "Energy performance gap", score: energyGapScore },
    { name: "LHD compliance gap", score: lhdGapScore },
  ]
  const primary = scores.reduce((max, s) => s.score > max.score ? s : max)

  // Narrative
  const narratives: string[] = []
  if (climateScore >= 65) narratives.push(`${suburb.suburb_name} has ${suburb.overall_level.toLowerCase()} climate risk (${climateScore}/100)`)
  if (energyGapScore >= 60) narratives.push(`${suburb.state} social housing averages only ${stateEnergy.avg_nathers_stars}★ NatHERS — ${energyGapScore}% below 7-star standard`)
  if (lhdGapScore >= 85) narratives.push(`only ${100 - lhdGapScore}% of ${suburb.state} social stock meets Silver LHD standard`)

  const compoundNarrative = narratives.length >= 2
    ? `Triple failure: ${narratives.join('; ')}. Tenants face compound physical risk, energy poverty, and inaccessibility.`
    : narratives.length === 1
    ? `${narratives[0]}. Additional risk factors amplify overall vulnerability.`
    : `Moderate compound risk — individual hazards manageable but require monitoring.`

  return {
    suburb, state_energy: stateEnergy, state_lhd: stateLHD, sa4_opportunity: sa4Data,
    climate_score: climateScore, energy_gap_score: energyGapScore, lhd_gap_score: lhdGapScore,
    compound_score: compoundScore, compound_band: band, compound_color: color,
    annual_tenant_extra_energy_cost: Math.max(0, energyExtra),
    upgrade_to_silver_cost_k: Math.round(lhdUpgrade),
    upgrade_to_5star_energy_cost_k: energyUpgrade,
    total_fix_cost_k: totalFix,
    haff_round4_ready: haffReady, haff_gaps: haffGaps,
    primary_failure: primary.name,
    compound_narrative: compoundNarrative,
  }
}

// Compute for all suburbs
export function getAllCompoundRisks(): CompoundRiskResult[] {
  return CLIMATE_RISK_SUBURBS
    .map(computeCompoundRisk)
    .sort((a, b) => b.compound_score - a.compound_score)
}

export function getCompoundByState(state: string): CompoundRiskResult[] {
  return getAllCompoundRisks().filter(r => r.suburb.state === state)
}

// Summary stats
export function getCompoundStats() {
  const all = getAllCompoundRisks()
  return {
    extreme:       all.filter(r => r.compound_band === "Extreme").length,
    critical:      all.filter(r => r.compound_band === "Critical").length,
    high:          all.filter(r => r.compound_band === "High").length,
    total_high_plus: all.filter(r => ["Extreme","Critical","High"].includes(r.compound_band)).length,
    worst:         all[0],
    avg_fix_cost_k: Math.round(all.reduce((s,r) => s + r.total_fix_cost_k, 0) / all.length),
    haff_not_ready: all.filter(r => !r.haff_round4_ready).length,
  }
}
