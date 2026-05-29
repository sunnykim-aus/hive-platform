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
              <strong style={{ color: "#666" }}>Intellectual Property.</strong>{" "}
              HIVE Intelligence is a product of{" "}
              <a href="https://impactanalyticsaustralia.com.au/" target="_blank" rel="noopener noreferrer" style={{ color: "#666", textDecoration: "none" }}>Impact Analytics Australia</a>.
              {" "}All platform design, data synthesis, analysis, visualisations, and AI-generated content are the intellectual property of Impact Analytics Australia. HIVE draws on publicly available publications from ABS, AIHW, AHURI, Housing Australia, Treasury, and the Productivity Commission; copyright in those underlying works remains with their respective owners.
            </p>
            <p style={{ fontSize: "0.72rem", color: "#555", lineHeight: 1.8, marginBottom: 10 }}>
              <strong style={{ color: "#666" }}>Subscription Licence.</strong>{" "}
              Access to HIVE is granted under a personal, non-transferable subscription licence to the named subscriber or organisation. Subscribers may use platform outputs — including analysis, charts, and exports — in internal reports, briefings, grant applications, and public submissions. Redistribution, resale, or sharing of platform outputs or data exports to third parties outside your organisation is prohibited without prior written consent from Impact Analytics Australia. To request a licence extension or commercial use approval, contact{" "}
              <a href="https://impactanalyticsaustralia.com.au/#contact" target="_blank" rel="noopener noreferrer" style={{ color: "#f6c90e", textDecoration: "none", fontWeight: 600 }}>Impact Analytics Australia</a>.
            </p>
            <p style={{ fontSize: "0.72rem", color: "#555", lineHeight: 1.8, marginBottom: 10 }}>
              <strong style={{ color: "#666" }}>No Professional Advice.</strong>{" "}
              Content on this platform is provided for informational and research purposes only. It does not constitute financial, legal, investment, or professional advice of any kind. Subscribers should independently verify data before relying on it for material decisions. Impact Analytics Australia accepts no responsibility for decisions made on the basis of platform content.
            </p>
            <p style={{ fontSize: "0.72rem", color: "#555", lineHeight: 1.8 }}>
              <strong style={{ color: "#666" }}>Limitation of Liability.</strong>{" "}
              While HIVE endeavours to ensure information is accurate and current, no warranty is made as to the completeness, accuracy, or fitness for purpose of any content. To the maximum extent permitted by Australian law, Impact Analytics Australia excludes all liability for loss or damage arising from use of this platform, including reliance on any analysis, data, or synthesis provided. This platform is governed by the laws of New South Wales, Australia.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
