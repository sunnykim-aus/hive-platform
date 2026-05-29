/**
 * Monthly building approvals data (ABS Cat. 8731.0)
 * Approximate values — updated via monthly pipeline
 * Values peak around 2021 (HomeBuilder) ~20k/month, then dip to ~14-15k by 2023-24
 */

export interface BuildingApprovalsRecord {
  date: string
  total_aus: number
  houses_aus: number
  other_aus: number
}

export const BUILDING_APPROVALS: BuildingApprovalsRecord[] = [
  // 2020 — COVID begins, slight dip then HomeBuilder surge
  { date: "2020-01-01", total_aus: 15842, houses_aus: 8620, other_aus: 7222 },
  { date: "2020-02-01", total_aus: 14980, houses_aus: 8100, other_aus: 6880 },
  { date: "2020-03-01", total_aus: 13420, houses_aus: 7800, other_aus: 5620 },
  { date: "2020-04-01", total_aus: 11250, houses_aus: 6900, other_aus: 4350 },
  { date: "2020-05-01", total_aus: 12180, houses_aus: 7200, other_aus: 4980 },
  { date: "2020-06-01", total_aus: 14800, houses_aus: 8600, other_aus: 6200 }, // HomeBuilder launches
  { date: "2020-07-01", total_aus: 15900, houses_aus: 9200, other_aus: 6700 },
  { date: "2020-08-01", total_aus: 16800, houses_aus: 9800, other_aus: 7000 },
  { date: "2020-09-01", total_aus: 17200, houses_aus: 10200, other_aus: 7000 },
  { date: "2020-10-01", total_aus: 17800, houses_aus: 10600, other_aus: 7200 },
  { date: "2020-11-01", total_aus: 18200, houses_aus: 11200, other_aus: 7000 },
  { date: "2020-12-01", total_aus: 18900, houses_aus: 11800, other_aus: 7100 },
  // 2021 — HomeBuilder peak, strong demand
  { date: "2021-01-01", total_aus: 19800, houses_aus: 12600, other_aus: 7200 },
  { date: "2021-02-01", total_aus: 20200, houses_aus: 13100, other_aus: 7100 },
  { date: "2021-03-01", total_aus: 20800, houses_aus: 13400, other_aus: 7400 }, // Peak
  { date: "2021-04-01", total_aus: 20100, houses_aus: 13000, other_aus: 7100 },
  { date: "2021-05-01", total_aus: 19600, houses_aus: 12800, other_aus: 6800 },
  { date: "2021-06-01", total_aus: 18900, houses_aus: 12200, other_aus: 6700 },
  { date: "2021-07-01", total_aus: 18400, houses_aus: 11900, other_aus: 6500 },
  { date: "2021-08-01", total_aus: 17800, houses_aus: 11400, other_aus: 6400 },
  { date: "2021-09-01", total_aus: 17200, houses_aus: 11000, other_aus: 6200 },
  { date: "2021-10-01", total_aus: 16800, houses_aus: 10600, other_aus: 6200 },
  { date: "2021-11-01", total_aus: 16400, houses_aus: 10300, other_aus: 6100 },
  { date: "2021-12-01", total_aus: 16200, houses_aus: 10100, other_aus: 6100 },
  // 2022 — Cost inflation bites, approvals declining
  { date: "2022-01-01", total_aus: 16000, houses_aus: 9900, other_aus: 6100 },
  { date: "2022-02-01", total_aus: 15800, houses_aus: 9700, other_aus: 6100 },
  { date: "2022-03-01", total_aus: 15600, houses_aus: 9500, other_aus: 6100 },
  { date: "2022-04-01", total_aus: 15400, houses_aus: 9300, other_aus: 6100 },
  { date: "2022-05-01", total_aus: 15200, houses_aus: 9100, other_aus: 6100 },
  { date: "2022-06-01", total_aus: 14900, houses_aus: 8900, other_aus: 6000 },
  { date: "2022-07-01", total_aus: 14700, houses_aus: 8700, other_aus: 6000 },
  { date: "2022-08-01", total_aus: 14500, houses_aus: 8600, other_aus: 5900 },
  { date: "2022-09-01", total_aus: 14400, houses_aus: 8500, other_aus: 5900 },
  { date: "2022-10-01", total_aus: 14300, houses_aus: 8400, other_aus: 5900 },
  { date: "2022-11-01", total_aus: 14200, houses_aus: 8300, other_aus: 5900 },
  { date: "2022-12-01", total_aus: 14100, houses_aus: 8200, other_aus: 5900 },
  // 2023 — Continued weakness
  { date: "2023-01-01", total_aus: 14100, houses_aus: 8200, other_aus: 5900 },
  { date: "2023-02-01", total_aus: 14000, houses_aus: 8100, other_aus: 5900 },
  { date: "2023-03-01", total_aus: 13800, houses_aus: 8000, other_aus: 5800 },
  { date: "2023-04-01", total_aus: 13700, houses_aus: 7900, other_aus: 5800 },
  { date: "2023-05-01", total_aus: 13600, houses_aus: 7800, other_aus: 5800 },
  { date: "2023-06-01", total_aus: 13500, houses_aus: 7700, other_aus: 5800 },
  { date: "2023-07-01", total_aus: 13400, houses_aus: 7600, other_aus: 5800 },
  { date: "2023-08-01", total_aus: 13500, houses_aus: 7700, other_aus: 5800 },
  { date: "2023-09-01", total_aus: 13600, houses_aus: 7800, other_aus: 5800 },
  { date: "2023-10-01", total_aus: 13700, houses_aus: 7900, other_aus: 5800 },
  { date: "2023-11-01", total_aus: 13800, houses_aus: 8000, other_aus: 5800 },
  { date: "2023-12-01", total_aus: 14000, houses_aus: 8100, other_aus: 5900 },
  // 2024 — Slow recovery
  { date: "2024-01-01", total_aus: 14100, houses_aus: 8200, other_aus: 5900 },
  { date: "2024-02-01", total_aus: 14200, houses_aus: 8300, other_aus: 5900 },
  { date: "2024-03-01", total_aus: 14300, houses_aus: 8400, other_aus: 5900 },
  { date: "2024-04-01", total_aus: 14400, houses_aus: 8500, other_aus: 5900 },
  { date: "2024-05-01", total_aus: 14500, houses_aus: 8500, other_aus: 6000 },
  { date: "2024-06-01", total_aus: 14600, houses_aus: 8600, other_aus: 6000 },
  { date: "2024-07-01", total_aus: 14700, houses_aus: 8700, other_aus: 6000 },
  { date: "2024-08-01", total_aus: 14800, houses_aus: 8800, other_aus: 6000 },
  { date: "2024-09-01", total_aus: 14900, houses_aus: 8900, other_aus: 6000 },
  { date: "2024-10-01", total_aus: 15000, houses_aus: 9000, other_aus: 6000 },
  { date: "2024-11-01", total_aus: 15100, houses_aus: 9100, other_aus: 6000 },
  { date: "2024-12-01", total_aus: 15200, houses_aus: 9200, other_aus: 6000 },
]

export interface BuildingApprovalsSummary {
  latest_monthly: number
  annual_run_rate: number
  accord_target: number
  gap_to_target: number
  pct_of_target: number
  yoy_change_pct: number
  latest_date: string
}

export function getBuildingApprovalsSummary(): BuildingApprovalsSummary {
  const latest = BUILDING_APPROVALS[BUILDING_APPROVALS.length - 1]
  const twelveMonthsAgo = BUILDING_APPROVALS[BUILDING_APPROVALS.length - 13]
  const annual_run_rate = latest.total_aus * 12
  const accord_target = 240000
  const gap_to_target = accord_target - annual_run_rate
  const pct_of_target = Math.round((annual_run_rate / accord_target) * 100)
  const yoy_change_pct = Math.round(((latest.total_aus - twelveMonthsAgo.total_aus) / twelveMonthsAgo.total_aus) * 100 * 10) / 10

  return {
    latest_monthly: latest.total_aus,
    annual_run_rate,
    accord_target,
    gap_to_target,
    pct_of_target,
    yoy_change_pct,
    latest_date: latest.date,
  }
}
