/**
 * Specialist Homelessness Services (SHS) data — ported from Python shs_feed.py
 * Source: AIHW Specialist Homelessness Services Annual Reports
 */

export interface SHSRecord {
  year: string
  clients: number
  unassisted: number
  needing_housing: number
  got_housing: number
}

export interface WaitlistRecord {
  state: string
  year: number
  applicants: number
  source: string
}

export const SHS_DATA: SHSRecord[] = [
  { year: "2016-17", clients: 290600, unassisted: 71200, needing_housing: 158300, got_housing: 41800 },
  { year: "2017-18", clients: 290500, unassisted: 71100, needing_housing: 157900, got_housing: 43200 },
  { year: "2018-19", clients: 292000, unassisted: 72900, needing_housing: 160200, got_housing: 44100 },
  { year: "2019-20", clients: 290800, unassisted: 74200, needing_housing: 158400, got_housing: 43600 },
  { year: "2020-21", clients: 294000, unassisted: 74800, needing_housing: 159200, got_housing: 44000 },
  { year: "2021-22", clients: 278900, unassisted: 68500, needing_housing: 150200, got_housing: 42000 },
  { year: "2022-23", clients: 284300, unassisted: 71800, needing_housing: 155200, got_housing: 43100 },
  { year: "2023-24", clients: 301200, unassisted: 79600, needing_housing: 163400, got_housing: 44800 },
  // 2024-25: AIHW SHS Annual Report 2024-25 (published Feb 2026)
  // clients + unassisted: confirmed. needing_housing = 56% citing accommodation issues.
  // got_housing: estimated from homeless cohort outcomes (~29% housed rate applied to needing_housing).
  { year: "2024-25", clients: 289000, unassisted: 129000, needing_housing: 160000, got_housing: 46500 },
]

export const WAITLIST_DATA: WaitlistRecord[] = [
  { state: "NSW", year: 2019, applicants: 57800, source: "FACS Annual Report" },
  { state: "NSW", year: 2020, applicants: 58200, source: "FACS Annual Report" },
  { state: "NSW", year: 2021, applicants: 58900, source: "FACS Annual Report" },
  { state: "NSW", year: 2022, applicants: 59600, source: "FACS Annual Report" },
  { state: "NSW", year: 2023, applicants: 60800, source: "FACS Annual Report" },
  { state: "NSW", year: 2024, applicants: 61500, source: "FACS Annual Report" },
  { state: "VIC", year: 2019, applicants: 38200, source: "DFFH Housing Register" },
  { state: "VIC", year: 2020, applicants: 41000, source: "DFFH Housing Register" },
  { state: "VIC", year: 2021, applicants: 46200, source: "DFFH Housing Register" },
  { state: "VIC", year: 2022, applicants: 55200, source: "DFFH Housing Register" },
  { state: "VIC", year: 2023, applicants: 60400, source: "DFFH Housing Register" },
  { state: "VIC", year: 2024, applicants: 63200, source: "DFFH Housing Register" },
  { state: "QLD", year: 2019, applicants: 21400, source: "DCHDE Register" },
  { state: "QLD", year: 2020, applicants: 22800, source: "DCHDE Register" },
  { state: "QLD", year: 2021, applicants: 24600, source: "DCHDE Register" },
  { state: "QLD", year: 2022, applicants: 27900, source: "DCHDE Register" },
  { state: "QLD", year: 2023, applicants: 32100, source: "DCHDE Register" },
  { state: "QLD", year: 2024, applicants: 35800, source: "DCHDE Register" },
  { state: "WA",  year: 2021, applicants: 17600, source: "DPLH Register" },
  { state: "WA",  year: 2022, applicants: 20200, source: "DPLH Register" },
  { state: "WA",  year: 2023, applicants: 22400, source: "DPLH Register" },
  { state: "WA",  year: 2024, applicants: 24600, source: "DPLH Register" },
  { state: "SA",  year: 2022, applicants: 15800, source: "SAHT Register" },
  { state: "SA",  year: 2023, applicants: 17200, source: "SAHT Register" },
  { state: "SA",  year: 2024, applicants: 18400, source: "SAHT Register" },
  { state: "TAS", year: 2022, applicants: 3200,  source: "Housing Tasmania Register" },
  { state: "TAS", year: 2023, applicants: 3400,  source: "Housing Tasmania Register" },
  { state: "TAS", year: 2024, applicants: 3500,  source: "Housing Tasmania Register" },
  { state: "NT",  year: 2022, applicants: 2600,  source: "NT Housing Register" },
  { state: "NT",  year: 2023, applicants: 2700,  source: "NT Housing Register" },
  { state: "NT",  year: 2024, applicants: 2800,  source: "NT Housing Register" },
  { state: "ACT", year: 2022, applicants: 3100,  source: "ACT Housing Registrar" },
  { state: "ACT", year: 2023, applicants: 3200,  source: "ACT Housing Registrar" },
  { state: "ACT", year: 2024, applicants: 3200,  source: "ACT Housing Registrar" },
]

export interface SHSSummary {
  latest_year: string
  total_clients: number
  unassisted_requests: number
  needing_housing: number
  got_housing: number
  housing_success_rate: number
  unmet_need_rate: number
  client_change_yoy: number
  unassisted_change_yoy: number
}

export function getSHSSummary(): SHSSummary {
  const latest = SHS_DATA[SHS_DATA.length - 1]
  const prev = SHS_DATA[SHS_DATA.length - 2]

  const client_change_yoy = ((latest.clients - prev.clients) / prev.clients) * 100
  const unassisted_change_yoy = ((latest.unassisted - prev.unassisted) / prev.unassisted) * 100
  const unmet_rate = (latest.unassisted / latest.clients) * 100

  return {
    latest_year: latest.year,
    total_clients: latest.clients,
    unassisted_requests: latest.unassisted,
    needing_housing: latest.needing_housing,
    got_housing: latest.got_housing,
    housing_success_rate: Math.round((latest.got_housing / latest.needing_housing) * 100 * 10) / 10,
    unmet_need_rate: Math.round(unmet_rate * 10) / 10,
    client_change_yoy: Math.round(client_change_yoy * 10) / 10,
    unassisted_change_yoy: Math.round(unassisted_change_yoy * 10) / 10,
  }
}
