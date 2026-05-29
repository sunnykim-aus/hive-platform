"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const PAGES = [
  { label: "Home", href: "/" },
  { label: "Live Dashboard", href: "/live-dashboard" },
  { label: "Demand & Supply", href: "/state-demand-supply" },
  { label: "Population", href: "/population" },
  { label: "Conditions", href: "/conditions" },
  { label: "HAFF", href: "/haff" },
  { label: "Ask Research", href: "/ask-research" },
  { label: "Policy Impact", href: "/policy-impact" },
  { label: "Outcomes", href: "/outcome-ledger" },
  { label: "Timeline", href: "/policy-timeline" },
  { label: "Reports", href: "/reports" },
  { label: "Digest", href: "/digest" },
]

export default function HiveNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      background: "#0d0d1a",
      borderBottom: "1px solid #252540",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      {/* ── Brand bar ── */}
      <div style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "10px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "1.7em", lineHeight: 1 }}>🐝</span>
            <span style={{
              fontSize: "1.45em",
              fontWeight: 900,
              color: "#f6c90e",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
            }}>
              HIVE
            </span>
          </div>
          <span style={{ color: "#333355", fontSize: "1.2em", fontWeight: 300 }}>|</span>
          <span style={{ fontSize: "0.92rem", color: "#aaa", fontWeight: 500 }}>
            Housing Intelligence &amp; Evidence
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            background: "rgba(39,174,96,0.12)",
            border: "1px solid rgba(39,174,96,0.3)",
            borderRadius: 20,
            padding: "3px 12px",
            color: "#27ae60",
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.5px",
          }}>
            ● Live
          </span>
          <span style={{ fontSize: "0.72rem", color: "#555", fontWeight: 500 }}>
            681 reports · Updated monthly
          </span>
        </div>
      </div>

      {/* ── Pill nav ── */}
      <div style={{
        borderTop: "1px solid #1a1a30",
        overflowX: "auto",
        scrollbarWidth: "none",
      }}>
        <div style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "8px 20px 10px",
          display: "flex",
          gap: 6,
          whiteSpace: "nowrap",
          alignItems: "center",
        }}>
          {PAGES.map((page) => {
            const isActive = pathname === page.href || (page.href !== "/" && pathname.startsWith(page.href))
            return (
              <Link
                key={page.href}
                href={page.href}
                style={{
                  display: "inline-block",
                  padding: "6px 16px",
                  fontSize: "0.82rem",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#0d0d1a" : "#b0b0c8",
                  border: `1px solid ${isActive ? "#f6c90e" : "#2a2a45"}`,
                  borderRadius: 20,
                  textDecoration: "none",
                  background: isActive ? "#f6c90e" : "rgba(255,255,255,0.04)",
                  transition: "all 0.15s",
                  letterSpacing: isActive ? "0.1px" : "0",
                }}
              >
                {page.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
