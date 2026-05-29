"use client"
import { useState } from "react"

const REPORTS = [
  { title: "AHURI Final Report No. 409: Social housing supply and demand", agency: "AHURI", year: "2024", type: "Research", url: "https://www.ahuri.edu.au/research/final-reports/409" },
  { title: "Housing Assistance in Australia 2023", agency: "AIHW", year: "2023", type: "Government", url: "https://www.aihw.gov.au/reports/housing-assistance/housing-assistance-in-australia" },
  { title: "Specialist Homelessness Services Annual Report 2022-23", agency: "AIHW", year: "2023", type: "Government", url: "https://www.aihw.gov.au/reports/homelessness-services/specialist-homelessness-services-annual-report" },
  { title: "National Housing Finance and Investment Corporation Annual Report 2023-24", agency: "Housing Australia", year: "2024", type: "Government", url: "https://www.housingaustralia.gov.au" },
  { title: "Building Approvals, Australia (ABS 8731.0)", agency: "ABS", year: "2024", type: "Statistical", url: "https://www.abs.gov.au/statistics/industry/building-and-construction/building-approvals-australia/latest-release" },
  { title: "Population Projections, Australia (ABS 3222.0)", agency: "ABS", year: "2023", type: "Statistical", url: "https://www.abs.gov.au/statistics/people/population/population-projections-australia/latest-release" },
  { title: "AHURI Final Report No. 378: The adequacy of social housing in Australia", agency: "AHURI", year: "2022", type: "Research", url: "https://www.ahuri.edu.au/research/final-reports/378" },
  { title: "AHURI Research Insights: Inclusionary zoning for social and affordable housing", agency: "AHURI", year: "2022", type: "Research", url: "https://www.ahuri.edu.au" },
  { title: "HAFF Round 1 Allocation Outcomes Report", agency: "Housing Australia", year: "2024", type: "Government", url: "https://www.housingaustralia.gov.au/housing-australia-future-fund" },
  { title: "National Housing Accord — First Year Progress Report", agency: "Treasury", year: "2024", type: "Government", url: "https://treasury.gov.au/policy-topics/housing" },
  { title: "Social Housing Futures — UNSW City Futures Research Centre", agency: "UNSW City Futures", year: "2023", type: "Research", url: "https://cityfutures.ada.unsw.edu.au" },
  { title: "AHURI Research Paper: Rental affordability in Australia", agency: "AHURI", year: "2023", type: "Research", url: "https://www.ahuri.edu.au" },
  { title: "National Rental Affordability Scheme Evaluation", agency: "DSS", year: "2014", type: "Government", url: "https://www.dss.gov.au" },
  { title: "HomeBuilder Scheme Final Report", agency: "Treasury", year: "2022", type: "Government", url: "https://www.treasury.gov.au/homebuilder" },
  { title: "ANAO Performance Audit: National Partnership on Remote Indigenous Housing", agency: "ANAO", year: "2017", type: "Audit", url: "https://www.anao.gov.au" },
  { title: "Australian Demographic Statistics (ABS 3101.0)", agency: "ABS", year: "2024", type: "Statistical", url: "https://www.abs.gov.au/statistics/people/population/national-state-and-territory-population/latest-release" },
  { title: "AHURI: Planning reform and housing supply in Australian cities", agency: "AHURI", year: "2023", type: "Research", url: "https://www.ahuri.edu.au" },
  { title: "ACOSS Rental Stress Report 2024", agency: "ACOSS", year: "2024", type: "Advocacy", url: "https://www.acoss.org.au" },
  { title: "HIA Housing Report: Construction Pipeline 2024", agency: "HIA", year: "2024", type: "Industry", url: "https://hia.com.au" },
  { title: "Power Housing Australia: CHP Capacity & Funding Gap Report 2024", agency: "Power Housing Australia", year: "2024", type: "Industry", url: "https://powerhousing.com.au" },
]

const TYPES = ["All", "Research", "Government", "Statistical", "Audit", "Advocacy", "Industry"]

export default function ReportsPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")

  const filtered = REPORTS.filter((r) => {
    const matchesSearch = search === "" || r.title.toLowerCase().includes(search.toLowerCase()) || r.agency.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === "All" || r.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div style={{ background: "#0f0f1a", minHeight: "100vh" }}>
      <div className="page-container">

        <div className="page-header">
          <h1 className="page-title">Research Reports</h1>
          <p className="page-subtitle">
            Key Australian housing research reports indexed in HIVE. Browse 20 foundational documents from AHURI, AIHW, ABS, Housing Australia, and more.
          </p>
        </div>

        {/* Search + filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            className="hive-input"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: "1 1 280px", padding: "10px 14px", fontSize: "0.88rem" }}
          />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {TYPES.map((t) => (
              <button
                key={t}
                className={`tab-pill ${typeFilter === t ? "active" : ""}`}
                onClick={() => setTypeFilter(t)}
                style={{ padding: "6px 12px", fontSize: "0.72rem" }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: "0.75rem", color: "#555", marginBottom: 16 }}>
          {filtered.length} report{filtered.length !== 1 ? "s" : ""} {search || typeFilter !== "All" ? "matching filters" : ""}
        </div>

        {/* Report list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((r, i) => (
            <div key={i} className="hive-card hive-card-hover" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ minWidth: 50, textAlign: "center" }}>
                <div style={{ fontWeight: 700, color: "#666", fontSize: "0.82rem" }}>{r.year}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 4, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 600, color: "#fff", fontSize: "0.88rem", flex: 1 }}>{r.title}</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.75rem", color: "#888" }}>{r.agency}</span>
                  <span className="badge badge-grey" style={{ fontSize: "0.6rem" }}>{r.type}</span>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "0.72rem", color: "#3498db", textDecoration: "none" }}
                  >
                    View source →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: "#555" }}>
            No reports match your search. Try different keywords.
          </div>
        )}

      </div>
    </div>
  )
}
