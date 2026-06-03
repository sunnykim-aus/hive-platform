export interface PolicyEvent {
  year: number
  event: string
  amount_bn: number
  type: string
}

export const POLICY_TIMELINE: PolicyEvent[] = [
  { year: 2008, event: "Nation Building Economic Stimulus Plan announced", amount_bn: 5.6, type: "construction" },
  { year: 2009, event: "Social Housing Initiative — 20,000 new public housing dwellings", amount_bn: 5.6, type: "public_housing" },
  { year: 2011, event: "National Rental Affordability Scheme (NRAS) — 50,000 dwellings target", amount_bn: 4.5, type: "affordable_rental" },
  { year: 2012, event: "National Affordable Housing Agreement (NAHA) reform", amount_bn: 1.3, type: "agreement" },
  { year: 2018, event: "National Housing Finance and Investment Corporation (NHFIC) established", amount_bn: 1.0, type: "financing" },
  { year: 2019, event: "First Home Loan Deposit Scheme launched", amount_bn: 0.5, type: "homeownership" },
  { year: 2021, event: "HomeBuilder scheme (COVID response)", amount_bn: 2.5, type: "construction" },
  { year: 2022, event: "Housing Accord — 1 million new homes target by 2029", amount_bn: 10.0, type: "supply" },
  { year: 2023, event: "Housing Australia Future Fund — $10B for social/affordable housing", amount_bn: 10.0, type: "social_housing" },
  { year: 2024, event: "Help to Buy shared equity scheme", amount_bn: 5.5, type: "homeownership" },
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
