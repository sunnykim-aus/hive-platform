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
        <footer style={{ background: "#0a0a14", borderTop: "1px solid #1a1a2e", padding: "28px", textAlign: "center" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ fontSize: "0.85rem", color: "#555", marginBottom: 10, fontWeight: 500 }}>
              🐝 HIVE Intelligence — Research &amp; Policy Analysis &nbsp;|&nbsp;{" "}
              <a href="https://impactanalyticsaustralia.com.au/" target="_blank" rel="noopener noreferrer" style={{ color: "#666", textDecoration: "none" }}>
                Impact Analytics Australia
              </a>
            </div>
            <div style={{ fontSize: "0.72rem", color: "#3a3a5a", display: "flex", gap: 20, justifyContent: "center", alignItems: "center" }}>
              <span>© 2026 Impact Analytics Australia</span>
              <span>·</span>
              <a href="/legal" style={{ color: "#555", textDecoration: "none" }}>Terms &amp; Legal</a>
              <span>·</span>
              <a href="https://impactanalyticsaustralia.com.au/#contact" target="_blank" rel="noopener noreferrer" style={{ color: "#555", textDecoration: "none" }}>Contact</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
