import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "HIVE — Housing Intelligence & Evidence",
  description: "AI-powered research synthesis for Australian community housing. Search 681 indexed reports, live government data, and policy documents.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
