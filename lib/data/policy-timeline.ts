export interface PolicyEvent {
  year: number
  event: string
  amount_bn: number
  type: string
}

// Corrected 2026-07-02: merged the 2008 stimulus announcement + 2009 SHI rows (same $5.6B —
// SHI was the housing component of Nation Building; double-counted before). Accord 10.0 → 3.5
// (10.0 was HAFF's figure; federal Accord commitment per programs.ts = $3.5B). NRAS year
// 2011 → 2008 (2008-09 Budget). HomeBuilder 2021 → 2020 (announced Jun 2020).
export const POLICY_TIMELINE: PolicyEvent[] = [
  { year: 2008, event: "Nation Building stimulus — Social Housing Initiative (20,000 new + 80,000 repaired dwellings)", amount_bn: 5.6, type: "public_housing" },
  { year: 2008, event: "National Rental Affordability Scheme (NRAS) — 50,000 dwellings target", amount_bn: 4.5, type: "affordable_rental" },
  { year: 2012, event: "National Affordable Housing Agreement (NAHA) reform", amount_bn: 1.3, type: "agreement" },
  { year: 2018, event: "National Housing Finance and Investment Corporation (NHFIC) established", amount_bn: 1.0, type: "financing" },
  { year: 2019, event: "First Home Loan Deposit Scheme launched", amount_bn: 0.5, type: "homeownership" },
  { year: 2020, event: "HomeBuilder scheme (COVID response)", amount_bn: 2.5, type: "construction" },
  { year: 2022, event: "Housing Accord — 1.2 million new homes target by 2029", amount_bn: 3.5, type: "supply" },
  { year: 2023, event: "Housing Australia Future Fund — $10B for social/affordable housing", amount_bn: 10.0, type: "social_housing" },
  // Updated 2026-07-02 (Round 2 F4): $5.5B was the pre-2025-26-Budget level; +$800M added to
  // lift price/income caps -> $6.3B current. Legislated Nov 2024; Program Directions registered
  // 13 Jun 2025; operational launch late 2025. 40,000 households; equity up to 30% existing /
  // 40% new; 2% deposit.
  { year: 2024, event: "Help to Buy shared equity scheme (now $6.3B after 2025-26 Budget top-up)", amount_bn: 6.3, type: "homeownership" },
]

export const TYPE_COLORS: Record<string, string> = {
  construction:     "#c49a3a",   // amber — stimulus / demand-side
  public_housing:   "#4d7fb5",   // primary blue — government delivery
  affordable_rental: "#7aaad4",  // lighter blue — affordable supply
  agreement:        "#6b8aa0",   // blue-slate — federal agreements
  financing:        "#4d7fb5",   // blue — financing vehicles
  homeownership:    "#6b8aa0",   // slate — homeownership (lower social housing relevance)
  supply:           "#f6c90e",   // gold — major supply targets
  social_housing:   "#5aad8a",   // green — social/affordable (positive)
}

export const TYPE_LABELS: Record<string, string> = {
  construction: "Construction Stimulus",
  public_housing: "Public Housing",
  affordable_rental: "Affordable Rental",
  agreement: "Federal Agreement",
  financing: "Financing",
  homeownership: "Homeownership",
  supply: "Supply Target",
  social_housing: "Social Housing",
}
