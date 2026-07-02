"use client"
import { useState } from "react"
import {
  HOUSEHOLD_TYPES, TENURE_TYPES, RENTAL_STRESS_BY_QUINTILE, STRESS_SUMMARY,
  VULNERABLE_COHORTS, SHS_CLIENT_PROFILE, SHS_PRESENTING_REASONS,
  TYPOLOGY_MISMATCH, HOMELESSNESS_LAYERS, ABS_CENSUS_HOMELESS_TOTAL,
} from "@/lib/data/housing-need"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from "recharts"
import ProUpgradePanel from "@/components/ProUpgradePanel"
import { useTier } from "@/lib/useTier"
import { meetsTier } from "@/lib/entitlements"

// ── Shared styles ────────────────────────────────────────────
const sectionHeader = {
  fontSize: "1.1rem", fontWeight: 800, color: "#fff",
  letterSpacing: "-0.3px", marginBottom: 8,
} as const

const JUMP_SECTIONS = [
  { id: "scale",      label: "Unmet Need" },
  { id: "tenure",     label: "How Australia Lives" },
  { id: "stress",     label: "Rental Stress" },
  { id: "cohorts",    label: "Six Cohorts" },
  { id: "shs",        label: "SHS Profile" },
  { id: "mismatch",   label: "Structural Mismatch" },
  { id: "iceberg",    label: "Hidden Homeless" },
  { id: "built",      label: "What to Build" },
]

const divider = {
  border: "none", borderTop: "1px solid #1e2d40", margin: "36px 0",
} as const

// ── Reusable components ──────────────────────────────────────
function Analysis({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "#111827", border: "1px solid #1e2d40",
      borderRadius: 8, padding: "14px 18px", marginTop: 14,
      fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.85,
    }}>
      <span style={{
        fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e",
        letterSpacing: "1.5px", textTransform: "uppercase",
        display: "block", marginBottom: 8,
      }}>🐝 HIVE Analysis</span>
      {children}
    </div>
  )
}

function StatBar({ label, value, max, color, sublabel }: {
  label: string; value: number; max: number; color: string; sublabel?: string
}) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: "0.85rem" }}>
        <span style={{ color: "#cbd5e1" }}>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{value.toLocaleString()}</span>
      </div>
      <div style={{ height: 22, background: "#1e1e36", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, minWidth: pct > 0 ? 4 : 0, transition: "width 0.6s ease" }} />
      </div>
      {sublabel && <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 3 }}>{sublabel}</div>}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "0.88rem", color: "#94a3b8", marginBottom: 20, lineHeight: 1.65 }}>
      {children}
    </p>
  )
}

export default function HousingNeedPage() {
  const { tier, loaded: tierLoaded, gatingActive } = useTier()
  const proState: "loading" | "unlocked" | "locked" = !tierLoaded
    ? "loading"
    : !gatingActive || meetsTier(tier, "pro")
      ? "unlocked"
      : "locked"

  const [selectedCohort, setSelectedCohort] = useState("lone-person")
  const [genderTab, setGenderTab] = useState<"women" | "men">("women")

  const cohort = VULNERABLE_COHORTS.find(c => c.id === selectedCohort)!

  // Affordability gap
  const gap = STRESS_SUMMARY.median_market_rent_pw_2024 -
    Math.round(STRESS_SUMMARY.median_renter_income_k * 1000 / 52 * 0.3)
  const craCovers = Math.round(STRESS_SUMMARY.cra_max_single_pw / gap * 100)

  // Homelessness iceberg
  const absTotal = ABS_CENSUS_HOMELESS_TOTAL
  const ahuri = HOMELESSNESS_LAYERS.find(l => l.label.startsWith("Hidden"))!
  const coreNeed = HOMELESSNESS_LAYERS.find(l => l.label.startsWith("Core"))!
  const visibleLayers = HOMELESSNESS_LAYERS.filter(l => l.visibility !== "hidden")

  // Stress chart
  const stressChartData = RENTAL_STRESS_BY_QUINTILE.map(q => ({
    name: q.quintile,
    "In rental stress": q.stress_pct,
    "Severe stress": q.severe_stress_pct,
  }))

  // Radar for mismatch — scale need/supply pcts to 0-100
  const radarData = TYPOLOGY_MISMATCH.map(r => ({
    dimension: r.dimension.split(" ")[0],
    Need: r.need_pct,
    Supply: r.supply_pct,
  }))

  return (
    <div style={{ background: "#0b1220", minHeight: "100vh" }}>
      <div className="page-container">

        {/* ── Header ── */}
        <div className="page-header">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 className="page-title">Housing Need</h1>
              <p className="page-subtitle">
                The official public-housing waitlist has 189,536 households (RoGS, June 2025). The evidence points to 640,000 in core housing need — over 3× larger. The gap is not a measurement error. It&apos;s couch-surfers, overcrowded families, and people priced out of even applying. This is who actually needs housing, why the private market structurally cannot serve the bottom two income quintiles, and why building more of the same will not fix it.
              </p>
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "rgba(39,174,96,0.1)", border: "1px solid rgba(39,174,96,0.25)",
              borderRadius: 20, padding: "6px 14px", whiteSpace: "nowrap", flexShrink: 0,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#5aad8a", display: "inline-block", boxShadow: "0 0 6px #5aad8a" }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#5aad8a", letterSpacing: "1px" }}>
                ABS Census 2021 · AIHW SHS 2022-23 · AHURI 2023
              </span>
            </div>
          </div>
        </div>

        {/* ── Jump navigation ── */}
        <div style={{
          borderTop: "1px solid #1e2d40", borderBottom: "1px solid #1e2d40",
          background: "#070d18", marginBottom: 28,
          overflowX: "auto", scrollbarWidth: "none",
          position: "sticky", top: 76, zIndex: 50,
          margin: "0 -24px 28px",
        }}>
          <div style={{ display: "flex", gap: 4, padding: "7px 24px", whiteSpace: "nowrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#4a5a6a", marginRight: 8, letterSpacing: "1px", textTransform: "uppercase", flexShrink: 0 }}>JUMP TO</span>
            {JUMP_SECTIONS.map((sec) => (
              <a key={sec.id} href={`#${sec.id}`} style={{
                display: "inline-block", padding: "4px 12px",
                fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8",
                background: "rgba(255,255,255,0.04)", border: "1px solid #1e2d40",
                borderRadius: 4, textDecoration: "none",
              }}>
                {sec.label}
              </a>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            SECTION 1 — NATIONAL SNAPSHOT KPIs
        ══════════════════════════════════════════ */}
        <div id="scale" style={{ scrollMarginTop: 130 }}>
        <div style={sectionHeader}>The Scale of Unmet Need</div>
        <SectionLabel>
          Four headline numbers that reframe the housing crisis — from a supply story to a people story.
        </SectionLabel>

        <div className="grid-4" style={{ marginBottom: 8 }}>
          <div className="kpi-card">
            <div className="kpi-label">Households in Rental Stress</div>
            <div className="kpi-value" style={{ color: "#c0614a" }}>1.31M</div>
            <div className="kpi-delta">Paying &gt;30% of income on rent · ABS SIH 2021-22</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">In Severe Rental Stress</div>
            <div className="kpi-value" style={{ fontSize: "1.6rem", color: "#c49a3a" }}>640k</div>
            <div className="kpi-delta">Paying &gt;50% of income on rent — barely surviving</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Core Housing Need (AHURI)</div>
            <div className="kpi-value" style={{ fontSize: "1.6rem", color: "#c49a3a" }}>640k</div>
            <div className="kpi-delta">Households with no private market solution · AHURI 2023</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Estimated Hidden Homeless</div>
            <div className="kpi-value" style={{ fontSize: "1.6rem", color: "#c0614a" }}>400k+</div>
            <div className="kpi-delta">Couch-surfing, overcrowded, marginal housing · AHURI</div>
          </div>
        </div>

        <Analysis>
          Australia&apos;s housing crisis is usually framed as a supply problem — and it is. But behind every missing dwelling is a person.{" "}
          <strong style={{ color: "#fff" }}>1.31 million renter households</strong> — more than the entire population of Adelaide — spend more than 30% of their income on housing,
          the internationally recognised threshold for housing stress. Of those,{" "}
          <strong style={{ color: "#c0614a" }}>640,000 are in severe stress</strong>, spending more than half their income before they can pay for food, transport, or healthcare.
          <br /><br />
          The AHURI &ldquo;core housing need&rdquo; figure (640,000) is the most rigorous estimate of households with no viable private market solution:
          their housing is unsuitable, unaffordable, or unavailable — and their income cannot fix any of those three problems.
          This is the irreducible demand for social and community housing.
        </Analysis>
        </div>{/* end #scale */}

        <hr style={divider} />
        <div id="tenure" style={{ scrollMarginTop: 130 }}>

        {/* ══════════════════════════════════════════
            SECTION 2 — HOW AUSTRALIA LIVES
        ══════════════════════════════════════════ */}
        <div style={sectionHeader}>How Australia Actually Lives</div>
        <SectionLabel>
          Household composition and tenure type determine who is vulnerable. The 26% who rent privately are the primary at-risk population.
          Within that group, the bottom two income quintiles are structurally priced out of the market.
        </SectionLabel>

        <div className="grid-2" style={{ marginBottom: 8 }}>
          {/* Household types */}
          <div className="chart-container">
            <div className="chart-title">Household Composition — Australia 2021</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={HOUSEHOLD_TYPES}
                layout="vertical"
                margin={{ top: 0, right: 60, bottom: 0, left: 55 }}
              >
                <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false}
                  tickFormatter={v => `${v}%`} domain={[0, 40]} />
                <YAxis type="category" dataKey="label" tick={{ fill: "#ccc", fontSize: 12 }} tickLine={false} width={160} />
                <Tooltip
                  contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                  formatter={(v: unknown, name: unknown) => [`${v}%`, name as string]}
                />
                <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                  {HOUSEHOLD_TYPES.map((entry) => (
                    <Cell key={entry.label} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 10, fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.6 }}>
              Source: ABS Census of Population and Housing 2021, Table Builder
            </div>
          </div>

          {/* Tenure types — custom stacked bar (no SSR issues) */}
          <div className="chart-container">
            <div className="chart-title">Tenure Type — Australia 2021</div>
            {/* Stacked proportion bar */}
            <div style={{ display: "flex", height: 28, borderRadius: 6, overflow: "hidden", marginBottom: 16, gap: 1 }}>
              {TENURE_TYPES.map(t => (
                <div key={t.label} title={`${t.label}: ${t.pct}%`} style={{
                  width: `${t.pct}%`, background: t.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.9)",
                  overflow: "hidden", whiteSpace: "nowrap",
                }}>
                  {t.pct >= 10 ? `${t.pct}%` : ""}
                </div>
              ))}
            </div>
            {/* Legend rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {TENURE_TYPES.map(t => (
                <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ flexShrink: 0, width: 32, textAlign: "right", fontSize: "0.88rem", fontWeight: 800, color: t.color }}>{t.pct}%</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <div style={{ width: `${t.pct * 2}%`, minWidth: 4, height: 5, background: t.color, borderRadius: 3 }} />
                    </div>
                    <div>
                      <span style={{ fontSize: "0.8rem", color: "#cbd5e1", fontWeight: 600 }}>{t.label}</span>
                      <span style={{ fontSize: "0.72rem", color: "#6b8aa0", marginLeft: 8 }}>{t.stress_note}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Analysis>
          Australia&apos;s tenure breakdown reveals a structural fault line.{" "}
          <strong style={{ color: "#fff" }}>66% of households own their home</strong> — with or without a mortgage — and are largely insulated from housing instability.
          But the <strong style={{ color: "#c49a3a" }}>26% who rent privately</strong> — about 3.1 million households — have no security: rents can rise at lease renewal, landlords can decline to renew,
          and there is no right to remain.
          <br /><br />
          The <strong style={{ color: "#6b8aa0" }}>4% in social housing</strong> are the lucky ones who made it through the waitlist.
          Behind them, <strong style={{ color: "#fff" }}>189,536 waiting households</strong>{" "}(RoGS, Jun 2025) are queued — some for more than a decade — in that volatile 26%.
          The critical question is not &ldquo;how many social housing dwellings do we have?&rdquo; but &ldquo;how many households cannot survive in the private market?&rdquo;
          The evidence points to at least 640,000 in core housing need — more than 3× the current waitlist.
        </Analysis>
        </div>{/* end #tenure */}

        <hr style={divider} />
        <div id="stress" style={{ scrollMarginTop: 130 }}>

        {/* ══════════════════════════════════════════
            SECTION 3 — RENTAL STRESS SPECTRUM
        ══════════════════════════════════════════ */}
        <div style={sectionHeader}>The Rental Stress Spectrum — Who Can Actually Afford to Rent</div>
        <SectionLabel>
          Stress rates by income quintile expose why &ldquo;build more housing&rdquo; alone cannot solve the affordability crisis
          for the bottom 40% of income earners.
        </SectionLabel>

        {/* Affordability gap calculator */}
        <div style={{
          background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 12,
          padding: "20px 24px", marginBottom: 20,
        }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 16 }}>
            The Affordability Gap — 2024 Snapshot
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[
              { label: "Median renter income", value: `$${STRESS_SUMMARY.median_renter_income_k}k/yr`, sub: "ABS SIH 2021-22 adjusted", color: "#cbd5e1" },
              { label: "Affordable rent (30% rule)", value: `$${Math.round(STRESS_SUMMARY.median_renter_income_k * 1000 / 52 * 0.3)}/wk`, sub: "What they can afford", color: "#5aad8a" },
              { label: "Median capital city rent", value: `$${STRESS_SUMMARY.median_market_rent_pw_2024}/wk`, sub: "PropTrack 2024", color: "#c0614a" },
              { label: "Weekly gap", value: `$${gap}/wk`, sub: `CRA covers only ${craCovers}% of this gap`, color: "#c49a3a" },
            ].map(item => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.72rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: "1.8rem", fontWeight: 900, color: item.color, lineHeight: 1 }}>
                  {item.value}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: 6 }}>{item.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #1e2d40", fontSize: "0.82rem", color: "#94a3b8" }}>
            Rents have risen <strong style={{ color: "#c0614a" }}>{STRESS_SUMMARY.rent_increase_since_2019_pct}% since 2019</strong>.
            Commonwealth Rent Assistance (max ~${STRESS_SUMMARY.cra_max_single_pw}/wk for singles) bridges just{" "}
            <strong style={{ color: "#c49a3a" }}>{craCovers}%</strong> of the gap between what median renters can afford and what the market charges.
            For the bottom quintile (median income $25k/year), affordable rent is <strong style={{ color: "#c0614a" }}>$144/week</strong> — the market is charging 4× that.
          </div>
        </div>

        <div className="chart-container" style={{ marginBottom: 8 }}>
          <div className="chart-title">Rental Stress Rate by Income Quintile — % of Renters Paying &gt;30% of Income</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stressChartData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }} barCategoryGap="30%">
              <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: "#ccc", fontSize: 13 }} tickLine={false}
                label={{ value: "Income quintile (Q1 = lowest)", position: "insideBottom", offset: -4, fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} tickFormatter={v => `${v}%`} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                formatter={(v: unknown, name: unknown) => [`${v}%`, name as string]}
              />
              <Bar dataKey="In rental stress" radius={[3, 3, 0, 0]}>
                {RENTAL_STRESS_BY_QUINTILE.map(q => <Cell key={q.quintile} fill={q.color} />)}
              </Bar>
              <Bar dataKey="Severe stress" radius={[3, 3, 0, 0]} fill="#c0614a" opacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 20, marginTop: 10, fontSize: "0.78rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#94a3b8" }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: "#c0614a", display: "inline-block" }} />
              Rental stress (&gt;30%)
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#94a3b8" }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: "#c0614a", opacity: 0.5, display: "inline-block" }} />
              Severe stress (&gt;50%)
            </span>
          </div>
          <div style={{ marginTop: 14 }}>
            {RENTAL_STRESS_BY_QUINTILE.map(q => (
              <div key={q.quintile} style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 0", borderBottom: "1px solid #1e2d40", fontSize: "0.82rem" }}>
                <span style={{ fontWeight: 700, color: q.color, width: 24 }}>{q.quintile}</span>
                <span style={{ color: "#94a3b8", width: 180 }}>{q.label}</span>
                <span style={{ color: "#cbd5e1" }}>Income: ~${q.median_income_k}k/yr</span>
                <span style={{ color: "#5aad8a", marginLeft: "auto" }}>Can afford: ${q.affordable_rent_pw}/wk</span>
                <span style={{ color: "#c0614a", width: 100, textAlign: "right" }}>Stress rate: {q.stress_pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <Analysis>
          The stress chart has a cliff edge at Q3.{" "}
          <strong style={{ color: "#c0614a" }}>83% of renters in the bottom income quintile are in rental stress</strong> — this is not a personal failing,
          it is a mathematical impossibility: on $25,000/year, the 30% affordability threshold allows $144/week for rent.
          No capital city market offers median rents anywhere near that figure.
          <br /><br />
          The Q2 figure (55%) is equally damning — incomes of $31,000–$52,000 generate affordable rents of $179–$300/week,
          while the market starts at $500+/week for a studio in most cities.
          <strong style={{ color: "#fff" }}> The bottom two quintiles are simply priced out of the private market</strong> — not temporarily,
          but permanently, absent either a dramatic fall in rents (structurally impossible without oversupply) or a dramatic rise in income
          (not happening for those on Centrelink, aged pension, or DSP).
          Social and community housing is not a safety net for these households — it is the only viable option.
        </Analysis>
        </div>{/* end #stress */}

        <hr style={divider} />
        <div id="cohorts" style={{ scrollMarginTop: 130 }}>

        {/* ══════════════════════════════════════════
            SECTION 4 — VULNERABLE COHORTS
        ══════════════════════════════════════════ */}
        <div style={sectionHeader}>The Six Cohorts the Market Structurally Fails</div>
        <SectionLabel>
          Each group faces a specific combination of affordability, design, location, and tenure barriers
          that makes private market housing structurally inaccessible — not just unaffordable.
        </SectionLabel>

        {proState === "loading" && <div style={{ padding: 24, textAlign: "center", color: "#6b8aa0", fontSize: "0.85rem" }}>Loading…</div>}
        {proState === "locked" && (
          <ProUpgradePanel
            title="Cohort-level analysis is a Pro feature"
            body="Explore each of the six cohorts the market structurally fails — scale, key facts, what they need, and why the market fails them. The free plan includes the national overview above."
          />
        )}
        {proState === "unlocked" && (<>
        {/* Cohort selector — tab style, no icons */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16, borderBottom: "1px solid #1e2d40", paddingBottom: 12 }}>
          {VULNERABLE_COHORTS.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCohort(c.id)}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                fontSize: "0.78rem",
                fontWeight: selectedCohort === c.id ? 700 : 500,
                cursor: "pointer",
                border: `1px solid ${selectedCohort === c.id ? c.color : "#1e2d40"}`,
                background: selectedCohort === c.id ? `${c.color}18` : "rgba(255,255,255,0.02)",
                color: selectedCohort === c.id ? c.color : "#8899aa",
                transition: "all 0.15s",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Cohort detail card — 3-col, compact */}
        <div style={{
          background: "#0f1825", border: `1px solid ${cohort.color}33`,
          borderLeft: `3px solid ${cohort.color}`,
          borderRadius: "0 10px 10px 0",
          padding: "20px 24px", marginBottom: 24,
        }}>
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ fontSize: "1rem", fontWeight: 900, color: "#fff" }}>{cohort.label}</div>
            <div style={{ fontSize: "0.82rem", color: cohort.color, fontWeight: 600 }}>{cohort.scale}</div>
            <div style={{ fontSize: "0.78rem", color: "#7a8fa8" }}>{cohort.population}</div>
            {cohort.waitlist_share_pct && (
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: "1.6rem", fontWeight: 900, color: cohort.color, lineHeight: 1 }}>{cohort.waitlist_share_pct}%</span>
                <span style={{ fontSize: "0.72rem", color: "#7a8fa8" }}>of social waitlists</span>
              </div>
            )}
          </div>

          {/* 3-column body */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            {/* Key Facts */}
            <div>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>Key Facts</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {cohort.key_facts.map((f, i) => (
                  <li key={i} style={{ display: "flex", gap: 7, marginBottom: 6, fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.55 }}>
                    <span style={{ color: cohort.color, flexShrink: 0 }}>▸</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What They Need */}
            <div>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#5aad8a", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>What They Need</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {cohort.what_they_need.map((n, i) => (
                  <li key={i} style={{ display: "flex", gap: 7, marginBottom: 6, fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.55 }}>
                    <span style={{ color: "#5aad8a", flexShrink: 0 }}>✓</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Why market fails + HIVE Signal */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "#0b1220", borderRadius: 8, border: "1px solid #1e2d40", padding: "10px 14px" }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#c0614a", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Why the Market Fails Them</div>
                <p style={{ fontSize: "0.78rem", color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>{cohort.why_market_fails}</p>
              </div>
              <div style={{ background: `${cohort.color}0d`, borderRadius: 8, border: `1px solid ${cohort.color}2a`, padding: "10px 14px" }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: cohort.color, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>🐝 HIVE Signal</div>
                <p style={{ fontSize: "0.78rem", color: "#cbd5e1", margin: 0, lineHeight: 1.6 }}>{cohort.hive_signal}</p>
              </div>
            </div>
          </div>
        </div>

        <Analysis>
          What connects all six cohorts is not poverty alone — it is the{" "}
          <strong style={{ color: "#fff" }}>intersection of income, design need, and tenure requirement</strong> that the private market cannot profitably satisfy.
          A lone person on $45k/year can afford $260/week — the market starts at $450+ for a studio.
          A DV survivor needs a tenancy the perpetrator cannot find and cannot have ended — the private market offers neither.
          A person with disability needs an accessible bathroom — 97% of new housing doesn&apos;t have one.
          <br /><br />
          These are not market failures that can be fixed by building more of the same.{" "}
          <strong style={{ color: "#f6c90e" }}>They are structural mismatches</strong> between what the market is incentivised to build and what these cohorts need.
          Social and community housing is not a residual option — it is the primary solution for approximately 640,000 Australian households.
        </Analysis>
        </>)}
        </div>{/* end #cohorts */}

        <hr style={divider} />
        <div id="shs" style={{ scrollMarginTop: 130 }}>

        {/* ══════════════════════════════════════════
            SECTION 5 — SHS CLIENT PROFILE
        ══════════════════════════════════════════ */}
        <div style={sectionHeader}>Who Actually Turns Up at the Door — SHS Client Profile</div>
        <SectionLabel>
          The AIHW Specialist Homelessness Services data shows who reaches crisis point. The over-representation
          of First Nations people, people with disability, and DV survivors is consistent and severe.
        </SectionLabel>

        <div className="grid-2" style={{ marginBottom: 8 }}>
          {/* Client profile bars */}
          <div className="chart-container">
            <div className="chart-title">SHS Client Demographics — vs General Population (AIHW 2022-23)</div>
            <div style={{ marginTop: 12 }}>
              {SHS_CLIENT_PROFILE.map(stat => (
                <div key={stat.label} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: "0.85rem" }}>
                    <span style={{ color: "#cbd5e1", fontWeight: 600 }}>{stat.label}</span>
                    <span style={{ color: stat.color, fontWeight: 700 }}>{stat.pct}% of SHS clients</span>
                  </div>
                  <div style={{ position: "relative", height: 20, background: "#1e1e36", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${stat.pct}%`, height: "100%", background: stat.color, borderRadius: 4, opacity: 0.9 }} />
                    {stat.population_pct && (
                      <div style={{
                        position: "absolute", top: 0, left: `${stat.population_pct}%`,
                        width: 2, height: "100%", background: "#fff", opacity: 0.4,
                      }} />
                    )}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3, fontSize: "0.72rem" }}>
                    <span style={{ color: "#94a3b8" }}>{stat.note}</span>
                    {stat.population_pct && (
                      <span style={{ color: "#94a3b8" }}>Pop. baseline: {stat.population_pct}%</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Presenting reasons */}
          <div className="chart-container">
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {(["women", "men"] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setGenderTab(g)}
                  className={`tab-pill ${genderTab === g ? "active" : ""}`}
                >
                  {g === "women" ? "Women" : "Men"}
                </button>
              ))}
              <span style={{ fontSize: "0.72rem", color: "#94a3b8", alignSelf: "center", marginLeft: 4 }}>
                Primary reason for presenting to SHS
              </span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={SHS_PRESENTING_REASONS[genderTab]}
                layout="vertical"
                margin={{ top: 0, right: 20, bottom: 0, left: 55 }}
              >
                <CartesianGrid stroke="#1e2d40" strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="reason" tick={{ fill: "#ccc", fontSize: 12 }} tickLine={false} width={200} />
                <Tooltip
                  contentStyle={{ background: "#1f2937", border: "1px solid #1e2d40", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} labelStyle={{ color: "#e2e8f0", fontWeight: 600 }} itemStyle={{ color: "#e2e8f0" }}
                  formatter={(v: unknown) => [`${v}%`, "of presentations"]}
                />
                <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                  {SHS_PRESENTING_REASONS[genderTab].map(r => <Cell key={r.reason} fill={r.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <Analysis>
              {genderTab === "women" ? (
                <>
                  For women, <strong style={{ color: "#c0614a" }}>domestic violence (43%) is the dominant driver</strong> — nearly half of all female SHS presentations.
                  This is not a demographic curiosity: it means that nearly half of the women in crisis housing tonight are there because of violence,
                  not because of financial failure.{" "}
                  <strong style={{ color: "#fff" }}>Housing is a DV intervention.</strong>
                </>
              ) : (
                <>
                  For men, <strong style={{ color: "#c49a3a" }}>financial difficulty and housing crisis together account for 62%</strong> of presentations — a direct reflection
                  of rental market volatility, job insecurity, and the collapse of the private tenancy safety net.
                  DV (14%) is higher than widely acknowledged — male DV victims are the most under-served group in crisis accommodation.
                </>
              )}
            </Analysis>
          </div>
        </div>
        </div>{/* end #shs */}

        <hr style={divider} />
        <div id="mismatch" style={{ scrollMarginTop: 130 }}>

        {/* ══════════════════════════════════════════
            SECTION 6 — TYPOLOGY MISMATCH
        ══════════════════════════════════════════ */}
        <div style={sectionHeader}>The Structural Mismatch — What They Need vs What Gets Built</div>
        <SectionLabel>
          Even if supply doubled tomorrow, the wrong type of housing in the wrong place would fail to reduce
          waitlists. The mismatch across four dimensions explains why supply alone is not the answer.
        </SectionLabel>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 8 }}>
          {TYPOLOGY_MISMATCH.map(row => (
            <div key={row.dimension} style={{
              background: "#111827", border: "1px solid #1e2d40",
              borderRadius: 10, padding: "18px 20px",
            }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 }}>
                {row.dimension}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#5aad8a", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>
                    What the waitlist needs
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#cbd5e1", marginBottom: 8 }}>{row.need}</div>
                  <div style={{ height: 18, background: "#1e1e36", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${row.need_pct}%`, height: "100%", background: "#5aad8a", borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#5aad8a", marginTop: 3 }}>{row.need_pct}% of applicants</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#c0614a", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>
                    What the market delivers
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#cbd5e1", marginBottom: 8 }}>{row.supply}</div>
                  <div style={{ height: 18, background: "#1e1e36", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${row.supply_pct}%`, height: "100%", background: "#c0614a", borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#c0614a", marginTop: 3 }}>{row.supply_pct}% of new approvals</div>
                </div>
              </div>
              <div style={{ fontSize: "0.8rem", color: "#94a3b8", borderTop: "1px solid #1e2d40", paddingTop: 10, lineHeight: 1.6 }}>
                {row.gap_note}
              </div>
            </div>
          ))}
        </div>

        <Analysis>
          The mismatch data makes a critical point: <strong style={{ color: "#fff" }}>supply is necessary but not sufficient</strong>.
          Australia could approve 300,000 dwellings this year, and if they were all 4-bedroom detached houses in outer suburbs
          with no accessibility features, the waitlist would barely move — because those dwellings do not match the cohort that needs social housing.
          <br /><br />
          <strong style={{ color: "#f6c90e" }}>75% of the waitlist is lone persons and single parents</strong> who need 1–2 bedroom dwellings near services.{" "}
          <strong style={{ color: "#c0614a" }}>42% of SHS clients have a disability</strong> but only 3% of new stock is accessible.{" "}
          <strong style={{ color: "#4d7fb5" }}>78% of vulnerable cohorts need inner/middle ring locations</strong> — near health services, transport, schools —
          but the construction industry delivers 65% of volume in outer suburban greenfield.
          <br /><br />
          This is the argument for a <strong style={{ color: "#fff" }}>dedicated community housing pipeline</strong> with mandated typology mix —
          not a market correction, which will never arrive.
        </Analysis>
        </div>{/* end #mismatch */}

        <hr style={divider} />
        <div id="iceberg" style={{ scrollMarginTop: 130 }}>

        {/* ══════════════════════════════════════════
            SECTION 7 — HIDDEN HOMELESSNESS ICEBERG
        ══════════════════════════════════════════ */}
        <div style={sectionHeader}>The Hidden Homelessness Iceberg</div>
        <SectionLabel>
          The ABS Census night count (122,000) is the tip. Below the waterline, the scale is three to six times larger —
          hidden in couch-surfing networks, overcrowded dwellings, and marginal housing situations that don&apos;t show up in headline statistics.
        </SectionLabel>

        <div className="grid-2" style={{ marginBottom: 8 }}>
          {/* Iceberg visual */}
          <div className="chart-container">
            <div className="chart-title">From Visible Count to Estimated True Scale</div>
            <div style={{ marginTop: 8 }}>
              {/* Visible section */}
              <div style={{
                background: "rgba(52,152,219,0.1)", border: "1px solid rgba(52,152,219,0.3)",
                borderRadius: "8px 8px 0 0", padding: "12px 16px", marginBottom: 2,
              }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#4d7fb5", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>
                  Above the Surface — ABS Census Night Count
                </div>
                <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#4d7fb5" }}>
                  {absTotal.toLocaleString()}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: 2, marginBottom: 10 }}>Total counted as homeless — Census 2021</div>
                {visibleLayers.map(layer => (
                  <StatBar
                    key={layer.label}
                    label={layer.label}
                    value={layer.count}
                    max={absTotal}
                    color={layer.color}
                    sublabel={layer.description}
                  />
                ))}
              </div>

              {/* Hidden section */}
              <div style={{
                background: "rgba(231,76,60,0.08)", border: "1px solid rgba(231,76,60,0.25)",
                borderRadius: "0 0 8px 8px", padding: "12px 16px",
              }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#c0614a", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>
                  Below the Surface — AHURI Estimates
                </div>
                <StatBar
                  label={ahuri.label}
                  value={ahuri.count}
                  max={coreNeed.count}
                  color={ahuri.color}
                  sublabel={ahuri.description}
                />
                <StatBar
                  label={coreNeed.label}
                  value={coreNeed.count}
                  max={coreNeed.count}
                  color={coreNeed.color}
                  sublabel={coreNeed.description}
                />
              </div>
            </div>
          </div>

          {/* Why the count is wrong */}
          <div className="chart-container" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="chart-title">Why the Census Count Undercounts</div>
            {[
              {
                n: "01",
                title: "Census night methodology",
                body: "The ABS counts people at their location on one specific night. Someone couch-surfing may have been on someone's sofa that night — counted as housed. The next week they may be on the street.",
              },
              {
                n: "02",
                title: "Hidden homelessness is definitionally invisible",
                body: "Couch-surfing — the largest category (47,400 ABS count, but AHURI estimates 400,000+) — is invisible by definition. You have a roof but no security, no lease, and can be asked to leave at any time.",
              },
              {
                n: "03",
                title: "Overcrowding is excluded from the ABS definition",
                body: "A family of 8 in a 2-bedroom dwelling counts as housed. AHURI's suitability test captures this. The ABS definition does not — so overcrowded households never appear in the headline figure.",
              },
              {
                n: "04",
                title: "Core housing need — the policy-relevant metric",
                body: "AHURI's 640,000 estimate counts households whose housing fails at least one of three tests: suitability, affordability, or availability — and whose income cannot solve any of those problems in the private market.",
                highlight: true,
              },
            ].map(item => (
              <div key={item.title} style={{
                background: item.highlight ? "rgba(246,201,14,0.04)" : "#0f1825",
                borderRadius: 8,
                padding: "12px 14px",
                border: `1px solid ${item.highlight ? "rgba(246,201,14,0.15)" : "#1e2d40"}`,
              }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{
                    fontSize: "0.6rem", fontWeight: 800, color: item.highlight ? "#f6c90e" : "#4a6070",
                    letterSpacing: "0.5px", flexShrink: 0, marginTop: 3, minWidth: 20,
                  }}>{item.n}</span>
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: item.highlight ? "#f6c90e" : "#c8d8e8", marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.6 }}>{item.body}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Analysis>
          The gap between 122,000 and 640,000 is not a measurement error — it is a{" "}
          <strong style={{ color: "#fff" }}>definitional choice with policy consequences</strong>.
          If we accept the ABS Census count as the scale of the problem, we design policy for 122,000 people.
          If we accept AHURI&apos;s core housing need estimate, we design for 640,000.
          <br /><br />
          The evidence strongly supports the AHURI figure.{" "}
          <strong style={{ color: "#c0614a" }}>Couch-surfing is not housing security</strong> — it is one bad conversation away from a park bench.
          Overcrowded dwellings are not acceptable housing — they create health, safety, and educational disadvantage.
          The ~190,000 households on public housing waitlists are a subset of a much larger population with the same need and no pathway to meet it.
          <br /><br />
          For the housing sector, the 640,000 figure is the pipeline:{" "}
          <strong style={{ color: "#f6c90e" }}>every dwelling built is immediately absorbed by demand</strong> that already exists and is not being met.
          There is no risk of vacancy in a market with this level of structural undersupply.
        </Analysis>
        </div>{/* end #iceberg */}

        <hr style={divider} />
        <div id="built" style={{ scrollMarginTop: 130 }}>

        {/* ══════════════════════════════════════════
            SECTION 8 — WHAT NEEDS TO BE BUILT
        ══════════════════════════════════════════ */}
        <div style={sectionHeader}>What Needs to Be Built — Translating Need into Built Form</div>
        <SectionLabel>
          The demographic analysis converts into a clear brief for the housing sector.
          This is not a wish list — it is the logical output of the demand data.
        </SectionLabel>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 8 }}>
          {[
            {
              n: "01",
              title: "Typology: 60%+ should be 1–2 bedroom",
              color: "#f6c90e",
              points: [
                "Lone persons (27% of households, 52% of waitlists) need studios and 1BR",
                "Single parents (23% of waitlists) need 2–3BR, not 4BR family homes",
                "Aged cohort (growing to 23% of population by 2041) need compact, manageable 1–2BR",
                "Current social housing stock skews 3BR — this is the mismatch made concrete",
              ],
            },
            {
              n: "02",
              title: "Location: inner and middle ring, near services",
              color: "#4d7fb5",
              points: [
                "Within 800m of frequent public transport (not just a bus that runs twice a day)",
                "Within 2km of primary healthcare — GP, pharmacy, allied health",
                "Within 1km of a primary school for single-parent families",
                "Urban consolidation sites — infill, above-shop, transit-oriented development",
              ],
            },
            {
              n: "03",
              title: "Design: Livable Housing Level 2 as the minimum standard",
              color: "#6b8aa0",
              points: [
                "Step-free entry and internal access — non-negotiable for ageing stock",
                "Accessible bathroom: hobless shower, turning circle, grab rail provision",
                "Wider doorways (850mm) to accommodate wheelchairs and walkers",
                "Universal design now avoids costly retrofitting in 10–15 years",
              ],
            },
            {
              n: "04",
              title: "Integrated support: housing and services co-located",
              color: "#5aad8a",
              points: [
                "DV housing linked to DV case management — housing alone is not the solution",
                "NDIS coordination proximity for participants with high support needs",
                "Aged care step-down capacity — from hospital to community housing",
                "Mental health and AOD services within the development or within 500m",
              ],
            },
          ].map(card => (
            <div key={card.title} style={{
              background: "#0f1825", border: `1px solid ${card.color}2a`,
              borderLeft: `3px solid ${card.color}`,
              borderRadius: "0 8px 8px 0", padding: "16px 20px",
            }}>
              <div style={{ display: "flex", gap: 10, alignItems: "baseline", marginBottom: 12 }}>
                <span style={{ fontSize: "0.6rem", fontWeight: 800, color: card.color, letterSpacing: "0.5px", flexShrink: 0 }}>{card.n}</span>
                <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#c8d8e8", lineHeight: 1.35 }}>{card.title}</div>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {card.points.map((p, i) => (
                  <li key={i} style={{ display: "flex", gap: 8, marginBottom: 7, fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.6 }}>
                    <span style={{ color: card.color, flexShrink: 0 }}>›</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Analysis>
          The demand analysis produces a clear and consistent signal:{" "}
          <strong style={{ color: "#fff" }}>Australia needs more small dwellings, in established urban locations, designed for accessibility, linked to support services</strong> —
          and it needs them in the social and community housing sector, not the private market which cannot profitably deliver these characteristics at the income levels required.
          <br /><br />
          Community housing providers who are developing or acquiring stock should use this brief as a filter:
          every site assessment should ask whether the typology, location, and design match the demand profile of their region&apos;s waitlist.
          A 4-bedroom house in an outer suburb serves the market — a 1-bedroom accessible apartment 600m from a train station serves the waitlist.{" "}
          <strong style={{ color: "#f6c90e" }}>These are not the same product, and the market will not build the latter at social rents.</strong>
        </Analysis>
        </div>{/* end #built */}

        {/* ── Data footnote ── */}
        <div style={{ fontSize: "0.72rem", color: "#94a3b8", lineHeight: 1.8, borderTop: "1px solid #1f2937", paddingTop: 16, marginBottom: 8, marginTop: 36 }}>
          <strong style={{ color: "#94a3b8" }}>Sources:</strong>{" "}
          ABS Census of Population and Housing 2021 (household composition, tenure, homelessness) ·
          ABS Survey of Income and Housing 2021-22 (rental stress by income quintile) ·
          AIHW Specialist Homelessness Services 2022-23 (client demographics and presenting reasons) ·
          AHURI — Estimating Australia&apos;s core housing need (2023) ·
          NHSAC — State of the Housing System 2024 ·
          PropTrack Rental Report Q4 2024 ·
          AIHW Aboriginal and Torres Strait Islander people: housing 2024 ·
          ANROWS — Domestic violence and homelessness (2023) ·
          Productivity Commission Housing Report 2024.
          Updated May 2026.
        </div>

      </div>
    </div>
  )
}
