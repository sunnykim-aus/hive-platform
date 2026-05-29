import HiveSearch from "@/components/HiveSearch"

export default function AskResearchPage() {
  return (
    <div style={{ background: "#0f0f1a", minHeight: "100vh" }}>
      <div className="page-container">

        <div className="page-header">
          <h1 className="page-title">Ask Research</h1>
          <p className="page-subtitle">
            Search 681 indexed reports from AHURI, AIHW, ABS, Housing Australia, Treasury, and state housing authorities. Ask any question about Australian housing policy, data, or evidence.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid-4" style={{ marginBottom: 28 }}>
          {[
            { value: "681", label: "Reports indexed" },
            { value: "5,059", label: "Searchable chunks" },
            { value: "20+", label: "Source organisations" },
            { value: "2004–2025", label: "Publication range" },
          ].map(({ value, label }) => (
            <div key={label} className="kpi-card">
              <div className="kpi-label">{label}</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#f6c90e" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Search component */}
        <HiveSearch />

        {/* Example queries */}
        <div style={{ marginTop: 32 }}>
          <div className="section-label">Example Research Questions</div>
          <div className="grid-2">
            {[
              "What does the evidence say about community land trusts in Australia?",
              "How effective has NRAS been at housing very low income households?",
              "What are the main drivers of construction cost inflation since 2020?",
              "What proportion of social housing applicants are single people?",
              "What does AHURI say about planning reform and housing supply?",
              "How does Australia's social housing stock compare internationally?",
            ].map((q) => (
              <div key={q} className="hive-card hive-card-hover" style={{ cursor: "pointer", fontSize: "0.82rem", color: "#888" }}>
                &quot;{q}&quot;
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
