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
  // UNIT NOTE (fixed 2026-07): `unassisted` from 2021-22 onward = unassisted REQUESTS
  // (AIHW's lead measure: 105k → 108k → 110k → 129k). Rows 2016-17..2020-21 are the older
  // unassisted-PEOPLE basis (~71-75k) — retained for history, not charted, don't mix in YoY.
  { year: "2021-22", clients: 278900, unassisted: 105000, needing_housing: 150200, got_housing: 42000 },
  { year: "2022-23", clients: 284300, unassisted: 108000, needing_housing: 155200, got_housing: 43100 },
  { year: "2023-24", clients: 301200, unassisted: 110000, needing_housing: 163400, got_housing: 44800 },
  // 2024-25: AIHW SHS Annual Report 2024-25 (published Feb 2026)
  // clients + unassisted requests (~350/day): confirmed. needing_housing = 56% citing accommodation issues.
  // got_housing: estimated from homeless cohort outcomes (~29% housed rate applied to needing_housing).
  { year: "2024-25", clients: 289000, unassisted: 129000, needing_housing: 160000, got_housing: 46500 },
]

// REBUILT 2026-07-02 from primary sources — the prior series (sum 213,000 at 2024;
// long smooth 2005-2024 histories) was not traceable to any published register and
// materially overstated QLD/SA (+26-33%) while understating TAS/NT (-32-49%).
// Verified basis, UNIT = HOUSEHOLDS on the PUBLIC HOUSING waiting list, at 30 June:
//   2025: RoGS 2026 Table 18A.29 (all states). 2024: derived from RoGS 2026
//   "change from 2024". NSW 2019-2023: AIHW Households.27 (national administrative
//   equivalent). Other states' pre-2024 history: not yet source-verified -> omitted.
// SOMIH waitlist is SEPARATE (RoGS 18A.31: 17,478 households nationally, Jun 2025;
// QLD 7,375 / NSW 4,601). Community housing: no national waitlist aggregate exists;
// jurisdictions use integrated registers, so summing program lists double-counts.
// National public-housing waitlist: 140,578 (2018) -> 168,552 (2024) -> 189,536 (2025).
export const WAITLIST_DATA: WaitlistRecord[] = [
  { state: "NSW", year: 2019, applicants: 49325, source: "AIHW Households.27 (via RoGS/NSW chart)" },
  { state: "NSW", year: 2020, applicants: 49674, source: "AIHW Households.27 (via RoGS/NSW chart)" },
  { state: "NSW", year: 2021, applicants: 48239, source: "AIHW Households.27 (via RoGS/NSW chart)" },
  { state: "NSW", year: 2022, applicants: 55693, source: "AIHW Households.27 (via RoGS/NSW chart)" },
  { state: "NSW", year: 2023, applicants: 54134, source: "AIHW Households.27 (via RoGS/NSW chart)" },
  { state: "NSW", year: 2024, applicants: 50726, source: "RoGS 2026 Table 18A.29" },
  { state: "NSW", year: 2025, applicants: 59077, source: "RoGS 2026 Table 18A.29" },
  { state: "VIC", year: 2024, applicants: 51380, source: "RoGS 2026 Table 18A.29" },
  { state: "VIC", year: 2025, applicants: 56230, source: "RoGS 2026 Table 18A.29" },
  { state: "QLD", year: 2024, applicants: 18818, source: "RoGS 2026 Table 18A.29" },
  { state: "QLD", year: 2025, applicants: 24112, source: "RoGS 2026 Table 18A.29" },
  { state: "WA", year: 2024, applicants: 20294, source: "RoGS 2026 Table 18A.29" },
  { state: "WA", year: 2025, applicants: 22409, source: "RoGS 2026 Table 18A.29" },
  { state: "SA", year: 2024, applicants: 14043, source: "RoGS 2026 Table 18A.29" },
  { state: "SA", year: 2025, applicants: 13687, source: "RoGS 2026 Table 18A.29" },
  { state: "TAS", year: 2024, applicants: 4709, source: "RoGS 2026 Table 18A.29" },
  { state: "TAS", year: 2025, applicants: 5152, source: "RoGS 2026 Table 18A.29" },
  { state: "NT", year: 2024, applicants: 5423, source: "RoGS 2026 Table 18A.29" },
  { state: "NT", year: 2025, applicants: 5467, source: "RoGS 2026 Table 18A.29" },
  { state: "ACT", year: 2024, applicants: 3159, source: "RoGS 2026 Table 18A.29" },
  { state: "ACT", year: 2025, applicants: 3402, source: "RoGS 2026 Table 18A.29" },
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
