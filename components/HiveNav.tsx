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
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#f6c90e", letterSpacing: "-0.5px" }}>
            🐝 HIVE Intelligence
          </span>
          <span style={{ fontSize: "0.75rem", color: "#666", display: "none" }} className="sm-show">
            Housing Intelligence &amp; Evidence
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: "0.75rem", color: "#666" }}>
          <span style={{ background: "#1a1a2e", border: "1px solid #2a2a4e", borderRadius: 20, padding: "3px 10px" }}>
            681 reports · Live data
          </span>
          <a
            href="https://www.linkedin.com/in/sunny-kim"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#f6c90e", textDecoration: "none", fontWeight: 600 }}
          >
            Sunny Kim
          </a>
        </div>
      </div>

      {/* Page pills */}
      <div style={{ borderTop: "1px solid #1a1a2e", overflowX: "auto" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 16px", display: "flex", gap: 4, whiteSpace: "nowrap" }}>
          {PAGES.map((page) => {
            const isActive = pathname === page.href || (page.href !== "/" && pathname.startsWith(page.href))
            return (
              <Link
                key={page.href}
                href={page.href}
                style={{
                  display: "inline-block",
                  padding: "8px 14px",
                  fontSize: "0.78rem",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#fff" : "#888",
                  border: isActive ? "1px solid #f6c90e" : "1px solid transparent",
                  borderBottom: "none",
                  borderRadius: "6px 6px 0 0",
                  textDecoration: "none",
                  background: isActive ? "rgba(246,201,14,0.08)" : "transparent",
                  transition: "all 0.15s",
                  marginTop: 4,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.color = "#ccc"
                    el.style.borderColor = "#3a3a5e"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.color = "#888"
                    el.style.borderColor = "transparent"
                  }
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
