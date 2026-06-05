"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import PortfolioChip from "./PortfolioChip"
import NavAuth from "./NavAuth"

const PAGES = [
  { label: "Home",                  href: "/" },
  { label: "Housing Data",          href: "/live-dashboard" },
  { label: "Housing Need",          href: "/housing-need" },
  { label: "Supply Pipeline",       href: "/state-demand-supply" },
  { label: "Development Viability", href: "/feasibility" },
  { label: "Funding & Programs",    href: "/funding-sector" },
  { label: "Sustainability",        href: "/sustainability" },
  { label: "Evidence & Policy",     href: "/research" },
  { label: "My Portfolio",          href: "/my-portfolio" },
]

// Sustainability sub-pages — highlight "Sustainability" pill when on any of these
const SUSTAINABILITY_CHILDREN = ["/climate-risk", "/building-energy", "/livable-housing", "/esg-impact", "/asset-intelligence"]

export default function HiveNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      background: "#070d18",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      {/* ── Brand bar ── */}
      <div style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "9px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "1.6em", lineHeight: 1 }}>🐝</span>
            <span style={{
              fontSize: "1.4em",
              fontWeight: 900,
              color: "#f6c90e",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
            }}>
              HIVE
            </span>
          </div>
          <span style={{ color: "#1e2d40", fontSize: "1.1em", fontWeight: 300 }}>|</span>
          <span style={{ fontSize: "0.82rem", color: "#6b8aa0", fontWeight: 400 }}>
            Housing Intelligence &amp; Evidence
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <PortfolioChip />
          <span style={{
            background: "rgba(90,173,138,0.08)",
            border: "1px solid rgba(90,173,138,0.25)",
            borderRadius: 4,
            padding: "3px 10px",
            color: "#5aad8a",
            fontSize: "0.67rem",
            fontWeight: 700,
            letterSpacing: "0.3px",
          }}>
            ● Live
          </span>
          <span style={{ fontSize: "0.67rem", color: "#2a3d52", fontWeight: 500 }}>
            681 reports · Updated monthly
          </span>
          <NavAuth />
        </div>
      </div>

      {/* ── Tab nav — flush to bottom border ── */}
      <div style={{
        borderTop: "1px solid #111e2e",
        borderBottom: "1px solid #1e2d40",
        overflowX: "auto",
        scrollbarWidth: "none",
      }}>
        <div style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 16px",
          display: "flex",
          gap: 0,
          whiteSpace: "nowrap",
          alignItems: "stretch",
          height: 38,
        }}>
          {PAGES.map((page) => {
            const isActive = pathname === page.href ||
              (page.href !== "/" && pathname.startsWith(page.href)) ||
              (page.href === "/sustainability" && SUSTAINABILITY_CHILDREN.some(c => pathname.startsWith(c)))
            return (
              <Link
                key={page.href}
                href={page.href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0 14px",
                  fontSize: "0.72rem",
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? "#0b1220" : "#c8d8e8",
                  textDecoration: "none",
                  background: isActive ? "#f6c90e" : "transparent",
                  borderRadius: isActive ? "4px 4px 0 0" : 0,
                  borderLeft: isActive ? "1px solid rgba(246,201,14,0.5)" : "1px solid transparent",
                  borderRight: isActive ? "1px solid rgba(246,201,14,0.5)" : "1px solid transparent",
                  borderTop: isActive ? "1px solid rgba(246,201,14,0.5)" : "1px solid transparent",
                  borderBottom: isActive ? "1px solid #f6c90e" : "1px solid transparent",
                  marginBottom: isActive ? -1 : 0,
                  transition: "all 0.12s",
                  letterSpacing: "0.1px",
                  whiteSpace: "nowrap",
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
