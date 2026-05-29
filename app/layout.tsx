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
        <footer style={{ background: "#0a0a14", borderTop: "1px solid #1a1a2e", padding: "16px 24px", textAlign: "center", fontSize: "0.72rem", color: "#555" }}>
          HIVE — Housing Intelligence &amp; Evidence · Research synthesis platform for Australian social &amp; affordable housing · Data from AHURI, AIHW, ABS, Housing Australia
        </footer>
      </body>
    </html>
  )
}
