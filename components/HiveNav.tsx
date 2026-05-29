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
    <nav style={{ background: "#0f0f1a", borderBottom: "1px solid #2a2a4e" }}>
      {/* Top bar */}
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
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: "1.4em", lineHeight: 1 }}>🐝</span>
            <span style={{ fontSize: "1.15em", fontWeight: 900, color: "#f6c90e", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              HIVE
            </span>
          </div>
          <span style={{ color: "#2a2a4e", fontSize: "1.2em" }}>|</span>
          <span style={{ fontSize: "0.82rem", color: "#aaa", fontWeight: 400 }}>
            Housing Intelligence &amp; Evidence
          </span>
        </div>
        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.78rem", color: "#888" }}>
          <span>Housing Data Lead | Sunny Kim</span>
          <a
            href="https://www.linkedin.com/in/sunny-kim"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "#1a1a2e",
              border: "1px solid #2a2a4e",
              color: "#0e76a8",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: 700,
            }}
          >
            in
          </a>
        </div>
      </div>

      {/* Pill nav */}
      <div style={{ borderTop: "1px solid #1a1a2e", overflowX: "auto", paddingBottom: 8 }}>
        <div style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "6px 16px 0",
          display: "flex",
          gap: 4,
          whiteSpace: "nowrap",
        }}>
          {PAGES.map((page) => {
            const isActive = pathname === page.href || (page.href !== "/" && pathname.startsWith(page.href))
            return (
              <Link
                key={page.href}
                href={page.href}
                style={{
                  display: "inline-block",
                  padding: "5px 14px",
                  fontSize: "0.78rem",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#fff" : "#888",
                  border: `1px solid ${isActive ? "rgba(246,201,14,0.5)" : "#2a2a4e"}`,
                  borderRadius: 20,
                  textDecoration: "none",
                  background: isActive ? "rgba(246,201,14,0.1)" : "transparent",
                  transition: "all 0.15s",
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
