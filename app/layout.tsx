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
              All analysis, data synthesis, and visualisations produced by this platform are sourced from publicly available government and research publications — including the Australian Bureau of Statistics, AIHW, AHURI, Housing Australia, Treasury, and the Productivity Commission. When using findings from HIVE, please cite the underlying source directly (e.g. <em>&quot;ABS Building Approvals, Cat. 8731.0&quot;</em> or <em>&quot;AIHW SHS Annual Report 2023–24&quot;</em>) rather than the platform itself.
            </p>
            <p style={{ fontSize: "0.72rem", color: "#555", lineHeight: 1.8 }}>
              Content from this platform is intended to support evidence-based decision-making within the community housing sector. If you are considering sharing or publishing any analysis externally — including in reports, media, grant applications, or public submissions — please reach out to{" "}
              <a href="https://www.linkedin.com/in/sunny-kim-58a780100/" target="_blank" rel="noopener noreferrer" style={{ color: "#f6c90e", textDecoration: "none", fontWeight: 700 }}>
                Sunny Kim
              </a>{" "}
              before doing so, to ensure accuracy, appropriate context, and correct attribution.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
