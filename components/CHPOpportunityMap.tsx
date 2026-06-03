"use client"
// Leaflet CSS is imported globally in globals.css

import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Rectangle, Tooltip, useMap } from "react-leaflet"
import type { SA4Scored } from "@/lib/data/sa4-opportunity"
import { OPPORTUNITY_COLORS } from "@/lib/data/sa4-opportunity"

// Approximate SA4 bounding boxes [SW corner, NE corner]
const SA4_BOUNDS: Record<string, [[number, number], [number, number]]> = {
  "nsw-sydney-inner":         [[-33.95, 151.15], [-33.82, 151.29]],
  "nsw-sydney-parramatta":    [[-33.87, 150.94], [-33.77, 151.09]],
  "nsw-sydney-southwest":     [[-34.15, 150.65], [-33.92, 150.95]],
  "nsw-sydney-blacktown":     [[-33.84, 150.83], [-33.72, 150.97]],
  "nsw-sydney-outer-west":    [[-33.86, 150.48], [-33.58, 150.84]],
  "nsw-newcastle":            [[-33.07, 151.54], [-32.83, 151.88]],
  "nsw-central-coast":        [[-33.65, 151.14], [-33.22, 151.53]],
  "nsw-hunter-valley":        [[-32.88, 150.90], [-32.20, 151.59]],
  "vic-melbourne-inner":      [[-37.88, 144.88], [-37.75, 145.04]],
  "vic-melbourne-west":       [[-38.02, 144.57], [-37.78, 144.89]],
  "vic-melbourne-north-west": [[-37.80, 144.75], [-37.61, 144.97]],
  "vic-melbourne-south-east": [[-38.22, 145.06], [-37.82, 145.50]],
  "vic-geelong":              [[-38.38, 144.03], [-37.98, 144.53]],
  "vic-gippsland":            [[-38.65, 145.82], [-37.57, 147.88]],
  "qld-brisbane-south":       [[-27.82, 152.91], [-27.50, 153.18]],
  "qld-brisbane-east":        [[-27.70, 153.07], [-27.40, 153.32]],
  "qld-gold-coast-north":     [[-28.15, 153.26], [-27.79, 153.52]],
  "qld-townsville":           [[-20.00, 146.30], [-18.77, 147.40]],
  "qld-cairns":               [[-17.47, 145.47], [-16.52, 146.26]],
  "qld-outback-north":        [[-23.00, 138.50], [-19.00, 144.50]],
  "wa-perth-inner":           [[-32.07, 115.74], [-31.87, 115.97]],
  "wa-perth-north-west":      [[-31.83, 115.63], [-31.47, 115.86]],
  "wa-perth-south-east":      [[-32.36, 115.82], [-32.00, 116.14]],
  "wa-outback-north":         [[-23.00, 117.50], [-17.00, 125.50]],
  "sa-adelaide-north":        [[-34.91, 138.51], [-34.57, 138.76]],
  "sa-adelaide-central":      [[-35.09, 138.51], [-34.88, 138.73]],
  "sa-adelaide-south":        [[-35.35, 138.42], [-35.00, 138.68]],
  "sa-outback":               [[-32.50, 129.50], [-24.50, 141.00]],
}

function MapInvalidator() {
  const map = useMap()
  useEffect(() => {
    // Simple invalidation — only needed for minor layout shifts after init
    const t = setTimeout(() => map.invalidateSize({ animate: false }), 100)
    return () => clearTimeout(t)
  }, [map])
  return null
}

interface Props { regions: SA4Scored[] }

export default function CHPOpportunityMap({ regions }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  // Only render the Leaflet map once the container is on screen
  // This ensures Leaflet initialises with correct dimensions every time
  useEffect(() => {
    if (!wrapperRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(wrapperRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={wrapperRef} style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #2a3d52" }}>
      {!visible ? (
        <div style={{ height: 520, background: "#0d1825", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#2a3d52", fontSize: "0.78rem" }}>Loading map…</span>
        </div>
      ) : (
        <MapContainer
          center={[-27.5, 133.8]}
          zoom={4}
          style={{ height: 520, width: "100%", display: "block" }}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <MapInvalidator />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
            subdomains="abcd"
            maxZoom={18}
          />

          {regions.map(r => {
            const bounds = SA4_BOUNDS[r.id]
            if (!bounds) return null
            const color = OPPORTUNITY_COLORS[r.opportunity_band]

            return (
              <Rectangle
                key={r.id}
                bounds={bounds}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.40, weight: 2, opacity: 0.9 }}
              >
                <Tooltip sticky direction="top" offset={[0, -6]} className="hive-map-tip">
                  <div style={{
                    background: "#0d1825",
                    border: `1px solid ${color}55`,
                    borderLeft: `3px solid ${color}`,
                    borderRadius: 8,
                    padding: "12px 16px",
                    minWidth: 220,
                    fontFamily: "Inter, sans-serif",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
                  }}>
                    <div style={{ fontWeight: 800, fontSize: "0.88rem", color: "#e8edf2", marginBottom: 2 }}>{r.name}</div>
                    <div style={{ fontSize: "0.65rem", color: "#4a5a6a", marginBottom: 10 }}>
                      {r.key_lgas.slice(0, 3).join(" · ")}{r.key_lgas.length > 3 ? ` +${r.key_lgas.length - 3}` : ""}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #1e2d40" }}>
                      <div style={{ fontSize: "2rem", fontWeight: 900, color, lineHeight: 1 }}>{r.opportunity_score}</div>
                      <div>
                        <div style={{ fontSize: "0.7rem", fontWeight: 800, color, textTransform: "uppercase" }}>{r.opportunity_band}</div>
                        <div style={{ fontSize: "0.62rem", color: "#4a5a6a" }}>opportunity score / 100</div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", fontSize: "0.72rem", marginBottom: 8 }}>
                      {([["Population", `${(r.population/1000).toFixed(0)}k`], ["Rental stress", `${r.rental_stress_pct}%`], ["Coverage", r.coverage_rating], ["Tier 1 CHPs", String(r.tier1_chps.length)]] as [string,string][]).map(([l, v]) => (
                        <div key={l}><div style={{ color: "#4a5a6a", fontSize: "0.62rem" }}>{l}</div><div style={{ color: "#c8d8e8", fontWeight: 700 }}>{v}</div></div>
                      ))}
                    </div>
                    {r.tier1_chps.length > 0
                      ? <div style={{ fontSize: "0.68rem", color: "#7aaad4" }}>{r.tier1_chps.slice(0, 3).join(" · ")}{r.tier1_chps.length > 3 ? ` +${r.tier1_chps.length - 3}` : ""}</div>
                      : <div style={{ fontSize: "0.68rem", color: "#c0614a", fontWeight: 700 }}>⚠ No Tier 1 CHP in this region</div>
                    }
                  </div>
                </Tooltip>
              </Rectangle>
            )
          })}
        </MapContainer>
      )}
    </div>
  )
}
