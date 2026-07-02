/**
 * Policy Outcome Ledger data — ported from Python ledger/seeder.py
 * Sources: AHURI, Treasury, and government reports
 */

export interface ProgramTarget {
  metric: string
  target_value: number
  target_unit: string
  target_year?: number
  source: string
}

export interface ProgramOutcome {
  metric: string
  actual_value: number
  actual_unit: string
  measurement_year?: number
  confidence: "High" | "Medium" | "Low"
  source_report: string
  notes: string
}

export interface Program {
  name: string
  short_name: string
  announced_year: number
  implemented_year: number
  end_year: number | null
  funding_committed_bn: number
  funding_drawn_bn: number | null
  administering_agency: string
  program_type: string
  geographic_scope: string
  status: string
  description: string
  source_url: string
  targets: ProgramTarget[]
  outcomes: ProgramOutcome[]
}

export const PROGRAMS: Program[] = [
  {
    name: "Social Housing Initiative (Nation Building Economic Stimulus)",
    short_name: "SHI / Nation Building",
    announced_year: 2008,
    implemented_year: 2009,
    end_year: 2012,
    funding_committed_bn: 5.6,
    funding_drawn_bn: 5.3,
    administering_agency: "DFAHSIA / State Housing Authorities",
    program_type: "Public Housing Construction",
    geographic_scope: "Federal",
    status: "Completed",
    description: "Australia's largest ever single investment in social housing. Part of the Rudd Government's economic stimulus response to the GFC. Funded new construction and repair of public housing dwellings across all states.",
    source_url: "https://www.aihw.gov.au/reports/housing-assistance/housing-assistance-in-australia",
    targets: [
      { metric: "New social housing dwellings", target_value: 20000, target_unit: "dwellings", target_year: 2012, source: "2008 Budget announcement" },
      { metric: "Existing dwellings repaired/upgraded", target_value: 80000, target_unit: "dwellings", target_year: 2012, source: "DFAHSIA program guidelines" },
    ],
    outcomes: [
      { metric: "New social housing dwellings", actual_value: 19300, actual_unit: "dwellings", measurement_year: 2013, confidence: "High", source_report: "AIHW Housing Assistance in Australia 2013", notes: "97% of target delivered. Shortfall due to construction cost overruns in remote areas." },
      { metric: "Existing dwellings repaired/upgraded", actual_value: 80100, actual_unit: "dwellings", measurement_year: 2013, confidence: "High", source_report: "DFAHSIA Final Program Report 2013", notes: "Target met. Fast-tracked delivery within 18 months." },
      { metric: "Jobs created (estimated)", actual_value: 15000, actual_unit: "jobs", measurement_year: 2011, confidence: "Medium", source_report: "Treasury stimulus review", notes: "Estimated direct and indirect construction employment." },
      { metric: "% allocated to community housing (vs public)", actual_value: 5, actual_unit: "%", measurement_year: 2013, confidence: "High", source_report: "AHURI Final Report", notes: "Critical gap: CHP sector received ~5% despite evidence CHPs deliver better outcomes per dollar." },
    ],
  },
  {
    name: "National Rental Affordability Scheme",
    short_name: "NRAS",
    announced_year: 2008,
    implemented_year: 2009,
    end_year: 2026,
    funding_committed_bn: 4.5,
    funding_drawn_bn: 3.1,
    administering_agency: "DSS / DFAHSIA",
    program_type: "Affordable Rental Supply",
    geographic_scope: "Federal",
    status: "Closed (running down)",
    description: "Provided annual incentives ($8,000–$11,000 per dwelling) to investors/developers to offer dwellings at 20% below market rent to eligible tenants. New allocations ceased in 2014 after change of government. Existing dwellings running to 2026.",
    source_url: "https://www.dss.gov.au/housing-support/national-rental-affordability-scheme",
    targets: [
      { metric: "Affordable dwellings", target_value: 50000, target_unit: "dwellings", target_year: 2014, source: "2008 Budget announcement" },
    ],
    outcomes: [
      { metric: "Affordable dwellings delivered", actual_value: 36000, actual_unit: "dwellings", measurement_year: 2014, confidence: "High", source_report: "DSS NRAS Review 2014", notes: "72% of original target. Program closed before full delivery." },
      { metric: "Dwellings shortfall vs target", actual_value: 14000, actual_unit: "dwellings", measurement_year: 2014, confidence: "High", source_report: "DSS NRAS Review 2014", notes: "Program abolished by Abbott Government in 2014 budget." },
      { metric: "Below-market rent discount delivered", actual_value: 20, actual_unit: "%", measurement_year: 2020, confidence: "High", source_report: "AHURI NRAS evaluation", notes: "Discount maintained as required. Tenant income mix skewed to moderate incomes rather than very low." },
      { metric: "% allocated to very low income households", actual_value: 35, actual_unit: "%", measurement_year: 2013, confidence: "Medium", source_report: "AHURI evaluation of NRAS", notes: "Intended for moderate to low income — less effective for those in greatest housing stress." },
    ],
  },
  {
    name: "National Housing Finance and Investment Corporation",
    short_name: "NHFIC / Housing Australia",
    announced_year: 2017,
    implemented_year: 2018,
    end_year: null,
    funding_committed_bn: 1.0,
    funding_drawn_bn: null,
    administering_agency: "Housing Australia (formerly NHFIC)",
    program_type: "Bond Aggregation / CHP Finance",
    geographic_scope: "Federal",
    status: "Ongoing",
    description: "Bond aggregator providing cheaper long-term finance to registered community housing providers. Aggregates demand across CHPs to access wholesale bond markets at lower rates than individual CHPs can achieve. Transformed the CHP sector's access to capital. Renamed Housing Australia in 2023.",
    source_url: "https://www.housingaustralia.gov.au",
    targets: [
      { metric: "Loans to community housing providers", target_value: 1.0, target_unit: "$B", target_year: 2022, source: "NHFIC establishment legislation" },
    ],
    outcomes: [
      { metric: "AHBA loans approved to CHPs", actual_value: 5.0, actual_unit: "$B", measurement_year: 2025, confidence: "High", source_report: "Housing Australia Annual Report 2024-25", notes: "Far exceeded the initial $1B target. Funded via $2.8B of social/sustainability bonds (7 issuances); ~$860M interest savings for the CHP sector. Corrected from 6.3 (which conflated total HA finance across facilities)." },
      { metric: "Interest rate saving vs market", actual_value: 0.8, actual_unit: "% per annum", measurement_year: 2023, confidence: "Medium", source_report: "NHFIC Impact Report", notes: "Estimated 80bps saving on average loan — material for CHP development viability." },
      { metric: "New dwellings enabled", actual_value: 15000, actual_unit: "dwellings", measurement_year: 2024, confidence: "Medium", source_report: "Housing Australia Annual Report 2023-24", notes: "Estimated social and affordable dwellings supported through NHFIC finance." },
    ],
  },
  {
    name: "Housing Australia Future Fund",
    short_name: "HAFF",
    announced_year: 2022,
    implemented_year: 2024,
    end_year: null,
    funding_committed_bn: 10.0,
    funding_drawn_bn: 0.5,
    administering_agency: "Housing Australia",
    program_type: "Social & Affordable Housing Fund",
    geographic_scope: "Federal",
    status: "Active",
    description: "A $10B off-budget endowment fund whose returns (not principal) fund social and affordable housing. Managed by Future Fund; distributes ~$500M/year to Housing Australia for allocation to CHPs and states via competitive rounds. Target: 40,000 new dwellings (20,000 social + 20,000 affordable) by 2029. Rounds 1–2 contracted 18,650 homes; Round 3 in application phase targeting 21,350 more. Source: Housing Australia 3 Jul 2025.",
    source_url: "https://www.housingaustralia.gov.au/housing-australia-future-fund",
    targets: [
      { metric: "Total homes (social + affordable)", target_value: 40000, target_unit: "dwellings", target_year: 2029, source: "HAFF legislation 2023; Housing Australia" },
      { metric: "Social housing dwellings", target_value: 20000, target_unit: "dwellings", target_year: 2029, source: "HAFF legislation 2023" },
      { metric: "Affordable housing dwellings", target_value: 20000, target_unit: "dwellings", target_year: 2029, source: "HAFF legislation 2023" },
    ],
    outcomes: [
      { metric: "Homes contracted (Rounds 1+2)", actual_value: 18650, actual_unit: "dwellings", measurement_year: 2025, confidence: "High", source_report: "Housing Australia media release 3 Jul 2025", notes: "R1: 13,649 homes (Sep 2024). R2: 5,001 social homes (Jul 2025). Round 3 targeting 21,350 more; applications open Jan 2026." },
      { metric: "% of 5-year target contracted", actual_value: 47, actual_unit: "%", measurement_year: 2025, confidence: "High", source_report: "Housing Australia 3 Jul 2025", notes: "18,650 ÷ 40,000 = 46.6%. Full delivery requires flawless Round 3 execution by 2029." },
    ],
  },
  {
    name: "National Housing Accord",
    short_name: "Housing Accord",
    announced_year: 2022,
    implemented_year: 2024,
    end_year: 2029,
    funding_committed_bn: 3.5,
    funding_drawn_bn: null,
    administering_agency: "Treasury / Housing Australia",
    program_type: "Housing Supply Target",
    geographic_scope: "Federal + States",
    status: "Active",
    description: "Agreement between federal government, states, territories, and local government to deliver 1.2 million new well-located homes over 5 years from July 2024. Includes planning reform incentives, $3B Housing Support Program for states, and density bonuses. Currently tracking below target.",
    source_url: "https://treasury.gov.au/policy-topics/housing",
    targets: [
      { metric: "New homes", target_value: 1200000, target_unit: "dwellings", target_year: 2029, source: "National Housing Accord 2022" },
      { metric: "Annual housing completions required", target_value: 240000, target_unit: "dwellings per year", target_year: 2029, source: "National Housing Accord" },
    ],
    outcomes: [
      { metric: "Annual completions (2023-24 actual)", actual_value: 177000, actual_unit: "dwellings", measurement_year: 2024, confidence: "High", source_report: "ABS Building Activity 2023-24", notes: "26% below the 240,000 annual rate needed. Driven by construction cost inflation, labour shortages, planning delays." },
      { metric: "Gap to target (annual)", actual_value: 63000, actual_unit: "dwellings per year", measurement_year: 2024, confidence: "High", source_report: "ABS / HIA analysis", notes: "Structural supply gap. Industry consensus is 1.2M target is unachievable without major planning reform." },
    ],
  },
  {
    name: "HomeBuilder Grant",
    short_name: "HomeBuilder",
    announced_year: 2020,
    implemented_year: 2020,
    end_year: 2021,
    funding_committed_bn: 2.5,
    funding_drawn_bn: 2.3,
    administering_agency: "Treasury / State Revenue Offices",
    program_type: "Construction Stimulus",
    geographic_scope: "Federal",
    status: "Completed",
    description: "COVID-19 economic response. Provided $25,000 grants (later $15,000) to owner-occupiers building new homes or substantially renovating. Aimed at supporting the construction industry. Created significant demand surge but critics argue it inflated house prices and benefited middle-income households.",
    source_url: "https://www.treasury.gov.au/homebuilder",
    targets: [
      { metric: "Grant recipients", target_value: 27000, target_unit: "households", target_year: 2021, source: "Treasury HomeBuilder design" },
    ],
    outcomes: [
      { metric: "Grant applications approved", actual_value: 136939, actual_unit: "households", measurement_year: 2021, confidence: "High", source_report: "Treasury HomeBuilder Final Report 2021", notes: "5x more than expected. Extension required due to demand. Significant construction pipeline surge." },
      { metric: "Total cost to government", actual_value: 2.3, actual_unit: "$B", measurement_year: 2022, confidence: "High", source_report: "Budget 2022-23", notes: "" },
      { metric: "House price inflation contribution", actual_value: 3, actual_unit: "% (estimated)", measurement_year: 2021, confidence: "Low", source_report: "RBA analysis", notes: "Contested — difficult to isolate HomeBuilder effect from broader COVID-era price surge." },
      { metric: "% benefiting low-income households", actual_value: 12, actual_unit: "%", measurement_year: 2021, confidence: "Medium", source_report: "AHURI HomeBuilder analysis", notes: "Program primarily benefited middle-income owner-occupiers. Negligible impact on housing affordability for renters or social housing waitlist." },
    ],
  },
  {
    name: "National Partnership on Remote Indigenous Housing",
    short_name: "NPARIH",
    announced_year: 2008,
    implemented_year: 2008,
    end_year: 2018,
    funding_committed_bn: 5.5,
    funding_drawn_bn: 5.1,
    administering_agency: "NIAA / State Housing Authorities",
    program_type: "Indigenous Housing",
    geographic_scope: "Remote communities (NT, WA, QLD, SA)",
    status: "Completed",
    description: "10-year investment in new housing and upgrades in remote Indigenous communities. Followed the NT Intervention. Transferred housing assets and management to NT Government. Significant investment but overcrowding in remote communities remains severe.",
    source_url: "https://www.niaa.gov.au/indigenous-affairs/housing",
    targets: [
      { metric: "New houses in remote communities", target_value: 4200, target_unit: "houses", target_year: 2018, source: "NPARIH agreement 2008" },
      { metric: "Houses refurbished/upgraded", target_value: 4876, target_unit: "houses", target_year: 2018, source: "NPARIH agreement 2008" },
    ],
    outcomes: [
      { metric: "New houses built", actual_value: 3900, actual_unit: "houses", measurement_year: 2018, confidence: "Medium", source_report: "ANAO audit 2017", notes: "Short of target. Remote construction costs, land tenure issues, and community consultation delays cited." },
      { metric: "Houses refurbished", actual_value: 4500, actual_unit: "houses", measurement_year: 2018, confidence: "Medium", source_report: "ANAO audit 2017", notes: "" },
      { metric: "Overcrowding rate improvement", actual_value: 8, actual_unit: "% reduction", measurement_year: 2018, confidence: "Low", source_report: "ABS Census comparison 2011-2016", notes: "Despite large investment, overcrowding remained at crisis levels (5x national average). Population growth offset housing gains." },
    ],
  },
  {
    name: "First Home Loan Deposit Scheme",
    short_name: "FHLDS / HGS",
    announced_year: 2019,
    implemented_year: 2020,
    end_year: null,
    funding_committed_bn: 0.5,
    funding_drawn_bn: 0.4,
    administering_agency: "Housing Australia",
    program_type: "Homeownership Assistance",
    geographic_scope: "Federal",
    status: "Ongoing (now Home Guarantee Scheme)",
    description: "Government guarantees up to 15% of home loan deposit, allowing eligible first home buyers to purchase with 5% deposit. Expanded to Home Guarantee Scheme with multiple streams including Regional, Family, and Indigenous Home Guarantees. 50,000 places per year from 2022.",
    source_url: "https://www.housingaustralia.gov.au/support-buy-home",
    targets: [
      { metric: "Scheme places per year", target_value: 10000, target_unit: "places", target_year: 2020, source: "2019 election commitment" },
      { metric: "Scheme places per year (expanded)", target_value: 50000, target_unit: "places", target_year: 2023, source: "Budget 2022-23" },
    ],
    outcomes: [
      { metric: "Guarantees issued (cumulative to 2024)", actual_value: 140000, actual_unit: "households", measurement_year: 2024, confidence: "High", source_report: "Housing Australia HGS Trends Report 2023-24", notes: "Strong take-up. Majority in capital cities and major regional centres." },
      { metric: "Median property value purchased", actual_value: 630000, actual_unit: "$", measurement_year: 2023, confidence: "High", source_report: "Housing Australia HGS Trends Report 2023-24", notes: "Buyers not concentrated at bottom of market — scheme accessible to moderate-income purchasers." },
      { metric: "Impact on house prices (contested)", actual_value: 1, actual_unit: "% uplift (estimated)", measurement_year: 2022, confidence: "Low", source_report: "RBA/NHFIC research", notes: "Marginal price effect — scheme size too small relative to market to drive significant inflation." },
    ],
  },
]
