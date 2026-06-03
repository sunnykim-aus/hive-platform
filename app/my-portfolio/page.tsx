"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  loadPortfolio, savePortfolio, clearPortfolio,
  DEFAULT_PORTFOLIO, STREAM_LABELS, STREAM_HAFF_TIER,
  CHP_TIER_LABELS, getPortfolioInsights,
  type UserPortfolio, type HousingStream, type CHPTier,
} from "@/lib/portfolio"
import { ALL_STATES } from "@/lib/data/climate-risk"

const STREAMS: HousingStream[] = [
  "general_social", "womens_safety", "first_nations",
  "older_persons", "disability_ndis", "key_worker", "homelessness",
]

export default function MyPortfolioPage() {
  const router = useRouter()
  const [portfolio, setPortfolio] = useState<UserPortfolio>({
    ...DEFAULT_PORTFOLIO,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })
  const [saved, setSaved] = useState(false)
  const [isExisting, setIsExisting] = useState(false)

  useEffect(() => {
    const existing = loadPortfolio()
    if (existing) {
      setPortfolio(existing)
      setIsExisting(true)
    }
  }, [])

  function update<K extends keyof UserPortfolio>(key: K, value: UserPortfolio[K]) {
    setPortfolio(p => ({ ...p, [key]: value }))
    setSaved(false)
  }

  function toggleStream(stream: HousingStream) {
    const current = portfolio.housing_streams
    const next = current.includes(stream)
      ? current.filter(s => s !== stream)
      : [...current, stream]
    if (next.length === 0) return // keep at least one
    update("housing_streams", next)
  }

  function handleSave() {
    if (!portfolio.org_name.trim()) return
    savePortfolio(portfolio)
    setSaved(true)
    setTimeout(() => router.push("/"), 1500)
  }

  function handleClear() {
    if (confirm("Remove your portfolio? This will clear your saved preferences.")) {
      clearPortfolio()
      setPortfolio({ ...DEFAULT_PORTFOLIO, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      setIsExisting(false)
    }
  }

  const insights = portfolio.org_name ? getPortfolioInsights(portfolio) : null

  return (
    <div style={{ background: "#0b1220", minHeight: "100vh" }}>
      <div className="page-container" style={{ maxWidth: 820 }}>

        <div className="page-header" style={{ borderLeft: "3px solid #f6c90e" }}>
          <h1 className="page-title">My Portfolio</h1>
          <p className="page-subtitle">
            Set up your organisation profile to personalise HIVE across every page —
            your state, housing streams, and portfolio size will pre-filter Climate Risk,
            Asset Intelligence, HAFF requirements, and the Situation Room.
            {" "}<strong style={{ color: "#f6c90e" }}>Saved locally in your browser — no account needed.</strong>
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Organisation */}
          <div className="hive-card" style={{ padding: "22px 24px" }}>
            <div className="section-label">Your Organisation</div>
            <div className="grid-2" style={{ gap: 16 }}>
              <div>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#7a8fa8", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>Organisation name</div>
                <input
                  type="text" className="hive-input"
                  placeholder="e.g. Hume Community Housing"
                  value={portfolio.org_name}
                  onChange={e => update("org_name", e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", fontSize: "0.88rem" }}
                />
              </div>
              <div>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#7a8fa8", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>Organisation type</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {(Object.entries(CHP_TIER_LABELS) as [CHPTier, string][]).map(([key, label]) => (
                    <label key={key} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                      <input type="radio" name="org_type" value={key}
                        checked={portfolio.org_type === key}
                        onChange={() => update("org_type", key)}
                        style={{ accentColor: "#f6c90e" }} />
                      <span style={{ fontSize: "0.78rem", color: portfolio.org_type === key ? "#e8edf2" : "#7a8fa8" }}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Geography */}
          <div className="hive-card" style={{ padding: "22px 24px" }}>
            <div className="section-label">Primary Operating State</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["All", ...ALL_STATES].map(state => (
                <button key={state} onClick={() => update("primary_state", state)}
                  style={{
                    padding: "7px 16px", fontSize: "0.78rem", fontWeight: portfolio.primary_state === state ? 700 : 500,
                    color: portfolio.primary_state === state ? "#0b1220" : "#94a3b8",
                    background: portfolio.primary_state === state ? "#f6c90e" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${portfolio.primary_state === state ? "#f6c90e" : "#2a3d52"}`,
                    borderRadius: 20, cursor: "pointer", transition: "all 0.15s",
                  }}>
                  {state === "All" ? "National" : state}
                </button>
              ))}
            </div>
          </div>

          {/* Portfolio size */}
          <div className="hive-card" style={{ padding: "22px 24px" }}>
            <div className="section-label">Portfolio Size</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {([
                ["managed_dwellings", "Total Managed"],
                ["owned_dwellings", "Owned"],
                ["leased_dwellings", "Leased / Managed on behalf"],
              ] as [keyof UserPortfolio, string][]).map(([key, label]) => (
                <div key={key}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#7a8fa8", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
                  <input
                    type="number" min={0} className="hive-input"
                    placeholder="0"
                    value={portfolio[key] as number || ""}
                    onChange={e => update(key, parseInt(e.target.value) || 0)}
                    style={{ width: "100%", padding: "10px 14px", fontSize: "0.88rem" }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Housing streams */}
          <div className="hive-card" style={{ padding: "22px 24px" }}>
            <div className="section-label">Housing Streams</div>
            <div style={{ fontSize: "0.72rem", color: "#4a5a6a", marginBottom: 14 }}>Select all streams your organisation operates or is applying to in HAFF Round 3. This determines your minimum LHD tier requirement.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {STREAMS.map(stream => {
                const active = portfolio.housing_streams.includes(stream)
                const tierReq = STREAM_HAFF_TIER[stream]
                const tierColor = tierReq === "Platinum / SDA" ? "#c8e0f4" : tierReq === "Gold mandatory" ? "#f6c90e" : "#8899aa"
                return (
                  <label key={stream} style={{
                    display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                    padding: "10px 14px", borderRadius: 8,
                    background: active ? "rgba(246,201,14,0.05)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${active ? "rgba(246,201,14,0.25)" : "#1e2d40"}`,
                    transition: "all 0.15s",
                  }}>
                    <input type="checkbox"
                      checked={active}
                      onChange={() => toggleStream(stream)}
                      style={{ accentColor: "#f6c90e", width: 16, height: 16 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.82rem", fontWeight: 600, color: active ? "#e8edf2" : "#7a8fa8" }}>{STREAM_LABELS[stream]}</div>
                    </div>
                    <span style={{
                      fontSize: "0.62rem", fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                      background: `${tierColor}18`, color: tierColor, border: `1px solid ${tierColor}33`,
                      flexShrink: 0,
                    }}>HAFF R3: {tierReq}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* HAFF + NHR */}
          <div className="hive-card" style={{ padding: "22px 24px" }}>
            <div className="section-label">HAFF & NHR Status</div>
            <div className="grid-2" style={{ gap: 20 }}>
              <div>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#7a8fa8", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 10 }}>HAFF participation</div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={portfolio.haff_applicant}
                    onChange={e => update("haff_applicant", e.target.checked)}
                    style={{ accentColor: "#f6c90e" }} />
                  <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>We are applying / have applied to HAFF</span>
                </label>
                {portfolio.haff_applicant && (
                  <div>
                    <div style={{ fontSize: "0.65rem", color: "#4a5a6a", marginBottom: 6 }}>Last round applied</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {["Round 1", "Round 2", "Round 3", "Not applied"].map(r => (
                        <button key={r} onClick={() => update("last_haff_round", r)}
                          style={{
                            padding: "4px 12px", fontSize: "0.72rem", fontWeight: portfolio.last_haff_round === r ? 700 : 500,
                            color: portfolio.last_haff_round === r ? "#0b1220" : "#94a3b8",
                            background: portfolio.last_haff_round === r ? "#f6c90e" : "rgba(255,255,255,0.03)",
                            border: `1px solid ${portfolio.last_haff_round === r ? "#f6c90e" : "#2a3d52"}`,
                            borderRadius: 6, cursor: "pointer",
                          }}>{r}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#7a8fa8", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 10 }}>NHR registration</div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={portfolio.nhr_registered}
                    onChange={e => update("nhr_registered", e.target.checked)}
                    style={{ accentColor: "#f6c90e" }} />
                  <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>Registered on the National Housing Register</span>
                </label>
                {portfolio.nhr_registered && (
                  <div style={{ display: "flex", gap: 8 }}>
                    {[1, 2, 3].map(tier => (
                      <button key={tier} onClick={() => update("nhr_tier", tier)}
                        style={{
                          padding: "5px 16px", fontSize: "0.78rem", fontWeight: portfolio.nhr_tier === tier ? 700 : 500,
                          color: portfolio.nhr_tier === tier ? "#0b1220" : "#94a3b8",
                          background: portfolio.nhr_tier === tier ? "#f6c90e" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${portfolio.nhr_tier === tier ? "#f6c90e" : "#2a3d52"}`,
                          borderRadius: 6, cursor: "pointer",
                        }}>Tier {tier}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sustainability profile */}
          <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 10, padding: "18px 22px" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#1abc9c", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 14 }}>
              🌱 Sustainability Profile — Optional
            </div>
            <p style={{ fontSize: "0.78rem", color: "#6b8aa0", marginBottom: 16, lineHeight: 1.6 }}>
              Add your portfolio&apos;s energy performance data to get a personalised view on the Building Energy and ESG pages — showing your gap vs sector average.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              <div>
                <div style={{ fontSize: "0.65rem", color: "#7a8fa8", marginBottom: 6 }}>
                  Avg NatHERS Rating — <strong style={{ color: portfolio.avg_nathers_rating ? "#1abc9c" : "#4a5a6a" }}>{portfolio.avg_nathers_rating ? `${portfolio.avg_nathers_rating}★` : "Not set"}</strong>
                </div>
                <input type="range" min={1} max={10} step={0.1}
                  value={portfolio.avg_nathers_rating ?? 2.9}
                  onChange={e => update("avg_nathers_rating", parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: "#1abc9c" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", color: "#4a5a6a" }}>
                  <span>1★ Poor</span><span>Sector avg 2.9★</span><span>10★ Best</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.65rem", color: "#7a8fa8", marginBottom: 6 }}>
                  % Dwellings with Solar — <strong style={{ color: portfolio.pct_solar != null ? "#1abc9c" : "#4a5a6a" }}>{portfolio.pct_solar != null ? `${portfolio.pct_solar}%` : "Not set"}</strong>
                </div>
                <input type="range" min={0} max={100} step={1}
                  value={portfolio.pct_solar ?? 0}
                  onChange={e => update("pct_solar", parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: "#1abc9c" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", color: "#4a5a6a" }}>
                  <span>0%</span><span>Sector avg ~8%</span><span>100%</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.65rem", color: "#7a8fa8", marginBottom: 6 }}>
                  % Stock at 7-Star (NCC 2022) — <strong style={{ color: portfolio.pct_7star_compliant != null ? "#1abc9c" : "#4a5a6a" }}>{portfolio.pct_7star_compliant != null ? `${portfolio.pct_7star_compliant}%` : "Not set"}</strong>
                </div>
                <input type="range" min={0} max={100} step={1}
                  value={portfolio.pct_7star_compliant ?? 0}
                  onChange={e => update("pct_7star_compliant", parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: "#1abc9c" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", color: "#4a5a6a" }}>
                  <span>0%</span><span>Sector avg ~21%</span><span>100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Personalisation preview */}
          {insights && portfolio.org_name && (
            <div style={{ background: "#111827", border: "1px solid #1e2d40", borderRadius: 10, padding: "18px 22px" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f6c90e", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 }}>
                🐝 Your personalised HIVE experience
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                {[
                  { page: "Home — Situation Room", personalisation: `Pre-filtered to ${portfolio.primary_state === "All" ? "national" : portfolio.primary_state} data` },
                  { page: "Climate Risk", personalisation: `Opens to ${portfolio.primary_state === "All" ? "national view" : portfolio.primary_state + " state tab"}` },
                  { page: "Asset Intelligence", personalisation: `${portfolio.primary_state === "All" ? "National" : portfolio.primary_state} suburbs highlighted` },
                  { page: "Livable Housing / HAFF", personalisation: `${insights.min_lhd_tier} requirement shown for your streams` },
                  { page: "Development Viability", personalisation: `${portfolio.primary_state === "All" ? "NSW" : portfolio.primary_state} set as default state` },
                  { page: "ESG & Impact", personalisation: insights.is_haff_eligible ? "HAFF-eligible tier — green bond pathway shown" : "NHR not confirmed — HAFF eligibility not shown" },
                ].map(({ page, personalisation }) => (
                  <div key={page} style={{ padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 6, border: "1px solid #1e2d40" }}>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#c8d8e8", marginBottom: 2 }}>{page}</div>
                    <div style={{ fontSize: "0.68rem", color: "#5aad8a" }}>✓ {personalisation}</div>
                  </div>
                ))}
              </div>
              {insights.needs_gold_streams.length > 0 && (
                <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(246,201,14,0.05)", border: "1px solid rgba(246,201,14,0.2)", borderRadius: 6 }}>
                  <span style={{ fontSize: "0.72rem", color: "#f6c90e", fontWeight: 700 }}>HAFF Round 3 alert: </span>
                  <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                    {insights.needs_gold_streams.map(s => STREAM_LABELS[s as HousingStream]).join(", ")} require{insights.needs_gold_streams.length === 1 ? "s" : ""} Gold LHD — budget $12-22k extra per dwelling.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Save / Clear */}
          <div style={{ display: "flex", gap: 12, justifyContent: "space-between", alignItems: "center" }}>
            <div>
              {isExisting && (
                <button onClick={handleClear} style={{
                  background: "none", border: "1px solid #2a3d52", borderRadius: 8,
                  color: "#4a5a6a", padding: "10px 20px", fontSize: "0.78rem", cursor: "pointer",
                }}>
                  Clear portfolio
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {saved && <span style={{ fontSize: "0.75rem", color: "#5aad8a" }}>✓ Saved — redirecting…</span>}
              <button
                onClick={handleSave}
                disabled={!portfolio.org_name.trim()}
                className="hive-btn"
                style={{ padding: "11px 28px", fontSize: "0.88rem", borderRadius: 10 }}>
                {isExisting ? "Update portfolio" : "Save & personalise HIVE"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
