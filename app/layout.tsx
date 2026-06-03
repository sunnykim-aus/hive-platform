import type { Metadata } from "next"
import "./globals.css"
import HiveNav from "@/components/HiveNav"

export const metadata: Metadata = {
  title: "HIVE — Housing Intelligence & Evidence",
  description: "AI-powered research synthesis for Australian community housing. Search 681 indexed reports, live government data, and policy documents.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <HiveNav />
        <main className="flex-1">
          {children}
        </main>
        <footer style={{ background: "#070d18", borderTop: "1px solid #1e2d40", padding: "32px 28px", textAlign: "center" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            {/* Brand line */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: "1.1rem" }}>🐝</span>
              <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "#f6c90e", letterSpacing: "1.5px", textTransform: "uppercase" }}>HIVE</span>
              <span style={{ color: "#1e2d40", fontSize: "1rem" }}>|</span>
              <span style={{ fontSize: "0.82rem", color: "#7a8fa8", fontWeight: 500 }}>Australian Housing Intelligence Platform</span>
            </div>
            {/* Tagline */}
            <div style={{ fontSize: "0.75rem", color: "#4a5a6a", marginBottom: 16 }}>
              Built by{" "}
              <a href="https://impactanalyticsaustralia.com.au/" target="_blank" rel="noopener noreferrer"
                style={{ color: "#6b8aa0", textDecoration: "none", fontWeight: 600 }}>
                Impact Analytics Australia
              </a>
              {" "}· Evidence-based intelligence for the housing sector
            </div>
            {/* Legal row */}
            <div style={{ fontSize: "0.7rem", color: "#2a3d52", display: "flex", gap: 20, justifyContent: "center", alignItems: "center" }}>
              <span>© 2026 Impact Analytics Australia</span>
              <span>·</span>
              <a href="/legal" style={{ color: "#3a5068", textDecoration: "none" }}>Terms &amp; Legal</a>
              <span>·</span>
              <a href="https://impactanalyticsaustralia.com.au/#contact" target="_blank" rel="noopener noreferrer"
                style={{ color: "#3a5068", textDecoration: "none" }}>Contact</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
