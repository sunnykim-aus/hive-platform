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
        <footer style={{ background: "#0a0a14", borderTop: "1px solid #1a1a2e", padding: "36px 28px 28px", textAlign: "center" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ fontSize: "0.88rem", color: "#888", marginBottom: 16, fontWeight: 500 }}>
              🐝 HIVE Intelligence — Research &amp; Policy Analysis &nbsp;|&nbsp; Platform by{" "}
              <a href="https://www.linkedin.com/in/sunny-kim-58a780100/" target="_blank" rel="noopener noreferrer" style={{ color: "#f6c90e", textDecoration: "none", fontWeight: 700 }}>
                Sunny Kim
              </a>
              , Housing Data Lead
            </div>
            <p style={{ fontSize: "0.72rem", color: "#555", lineHeight: 1.8, marginBottom: 10 }}>
              HIVE synthesises publicly available research and government data — including ABS, AIHW, AHURI, Housing Australia, Treasury, and the Productivity Commission — into a single intelligence platform for the Australian housing sector. Analysis, visualisations, and synthesis produced by HIVE may be used in subscriber reports, submissions, briefings, and presentations. Where citing specific statistics, we recommend referencing the underlying source alongside HIVE (e.g. <em>&quot;Source: ABS Cat. 8731.0, via HIVE Intelligence&quot;</em>).
            </p>
            <p style={{ fontSize: "0.72rem", color: "#555", lineHeight: 1.8 }}>
              HIVE is a subscription platform. Access is licensed to individual subscribers and organisations. Redistribution of platform outputs or data exports outside your organisation requires written permission. For licensing enquiries, partnerships, or custom research, contact{" "}
              <a href="https://impactanalyticsaustralia.com.au/#contact" target="_blank" rel="noopener noreferrer" style={{ color: "#f6c90e", textDecoration: "none", fontWeight: 700 }}>
                Impact Analytics Australia
              </a>.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
