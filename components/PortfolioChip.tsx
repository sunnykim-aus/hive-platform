"use client"
import { useState, useEffect } from "react"
import { loadPortfolio, hasPortfolio, type UserPortfolio } from "@/lib/portfolio"

export default function PortfolioChip() {
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setPortfolio(loadPortfolio())
    // Re-check when storage changes (e.g. after saving)
    const handler = () => setPortfolio(loadPortfolio())
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  }, [])

  if (!mounted) return null

  if (!portfolio?.org_name) {
    return (
      <a href="/my-portfolio" style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "rgba(246,201,14,0.08)", border: "1px solid rgba(246,201,14,0.25)",
        borderRadius: 20, padding: "3px 12px", textDecoration: "none",
        fontSize: "0.65rem", fontWeight: 600, color: "#c9a820",
        transition: "all 0.15s",
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a820", display: "inline-block" }} />
        Set up portfolio →
      </a>
    )
  }

  return (
    <a href="/my-portfolio" style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: "rgba(246,201,14,0.1)", border: "1px solid rgba(246,201,14,0.35)",
      borderRadius: 20, padding: "3px 12px", textDecoration: "none",
      fontSize: "0.65rem", fontWeight: 700, color: "#f6c90e",
      transition: "all 0.15s",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f6c90e", display: "inline-block", boxShadow: "0 0 4px #f6c90e" }} />
      {portfolio.org_name.length > 22 ? portfolio.org_name.slice(0, 20) + "…" : portfolio.org_name}
      {portfolio.primary_state !== "All" && ` · ${portfolio.primary_state}`}
    </a>
  )
}
