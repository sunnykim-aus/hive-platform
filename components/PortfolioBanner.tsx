"use client"
import { usePortfolio } from "@/lib/usePortfolio"
import { STREAM_LABELS, STREAM_HAFF_TIER, type HousingStream } from "@/lib/portfolio"
import { getAllCompoundRisks } from "@/lib/data/asset-intelligence"
import { useMemo } from "react"

export default function PortfolioBanner() {
  const { portfolio, insights, hasPortfolio, loaded } = usePortfolio()

  const stateRisk = useMemo(() => {
    if (!portfolio?.primary_state || portfolio.primary_state === "All") return null
    const all = getAllCompoundRisks()
    const stateSuburbs = all.filter(r => r.suburb.state === portfolio.primary_state)
    return {
      total:    stateSuburbs.length,
      extreme:  stateSuburbs.filter(r => r.compound_band === "Extreme").length,
      critical: stateSuburbs.filter(r => r.compound_band === "Critical").length,
      worst:    stateSuburbs[0] ?? null,
    }
  }, [portfolio?.primary_state])

  if (!loaded || !hasPortfolio || !portfolio) return null

  const goldStreams = portfolio.housing_streams.filter(
    s => STREAM_HAFF_TIER[s as HousingStream] === "Gold mandatory"
  )
  const platStreams = portfolio.housing_streams.filter(
    s => STREAM_HAFF_TIER[s as HousingStream] === "Platinum / SDA"
  )

  return (
    <div style={{
      background: "#111827", border: "1px solid #f6c90e33",
      borderLeft: "3px solid #f6c90e",
      borderRadius: "0 10px 10px 0", padding: "14px 20px", marginBottom: 20,
      display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap",
    }}>
      {/* Identity */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "#4a5a6a", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>Your organisation</div>
        <div style={{ fontWeight: 800, color: "#f6c90e", fontSize: "0.88rem" }}>{portfolio.org_name}</div>
        <div style={{ fontSize: "0.68rem", color: "#4a5a6a" }}>
          {portfolio.org_type === "tier1" ? "Tier 1" : portfolio.org_type === "tier2" ? "Tier 2" : portfolio.org_type === "tier3" ? "Tier 3" : "Government HA"} ·{" "}
          {portfolio.primary_state === "All" ? "National" : portfolio.primary_state} ·{" "}
          {portfolio.managed_dwellings > 0 ? `${portfolio.managed_dwellings.toLocaleString()} managed` : "Portfolio not set"}
        </div>
      </div>

      {/* State risk */}
      {stateRisk && (
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "#4a5a6a", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>
            {portfolio.primary_state} compound risk
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#8b1a1a", lineHeight: 1 }}>{stateRisk.extreme}</div>
              <div style={{ fontSize: "0.58rem", color: "#4a5a6a" }}>Extreme</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#c0614a", lineHeight: 1 }}>{stateRisk.critical}</div>
              <div style={{ fontSize: "0.58rem", color: "#4a5a6a" }}>Critical</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#6b8aa0", lineHeight: 1 }}>{stateRisk.total}</div>
              <div style={{ fontSize: "0.58rem", color: "#4a5a6a" }}>Total</div>
            </div>
          </div>
        </div>
      )}

      {/* HAFF stream alerts */}
      {(goldStreams.length > 0 || platStreams.length > 0) && (
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "#4a5a6a", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>HAFF Round 3 — your stream requirements</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {goldStreams.map(s => (
              <span key={s} style={{ fontSize: "0.65rem", padding: "2px 8px", borderRadius: 4, background: "rgba(246,201,14,0.1)", color: "#f6c90e", border: "1px solid rgba(246,201,14,0.25)", fontWeight: 600 }}>
                {STREAM_LABELS[s as HousingStream]} → <strong>Gold mandatory</strong>
              </span>
            ))}
            {platStreams.map(s => (
              <span key={s} style={{ fontSize: "0.65rem", padding: "2px 8px", borderRadius: 4, background: "rgba(200,224,244,0.1)", color: "#c8e0f4", border: "1px solid rgba(200,224,244,0.25)", fontWeight: 600 }}>
                {STREAM_LABELS[s as HousingStream]} → <strong>Platinum / SDA</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div style={{ flexShrink: 0, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        {portfolio.primary_state !== "All" && (
          <a href={`/climate-risk`} style={{ fontSize: "0.68rem", color: "#c0614a", fontWeight: 700, textDecoration: "none", background: "rgba(192,97,74,0.08)", border: "1px solid rgba(192,97,74,0.25)", borderRadius: 6, padding: "4px 10px" }}>
            {portfolio.primary_state} climate risk →
          </a>
        )}
        <a href="/asset-intelligence" style={{ fontSize: "0.68rem", color: "#c49a3a", fontWeight: 700, textDecoration: "none", background: "rgba(196,154,58,0.08)", border: "1px solid rgba(196,154,58,0.25)", borderRadius: 6, padding: "4px 10px" }}>
          Asset intelligence →
        </a>
        <a href="/my-portfolio" style={{ fontSize: "0.65rem", color: "#4a5a6a", textDecoration: "none" }}>Edit →</a>
      </div>
    </div>
  )
}
