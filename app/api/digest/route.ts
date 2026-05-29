import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { getSHSSummary } from "@/lib/data/shs"
import { getBuildingApprovalsSummary } from "@/lib/data/building-approvals"
import { getHaffSummary } from "@/lib/data/haff"
import { getAllStatesLatest } from "@/lib/data/state-analysis"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST() {
  try {
    // Gather key stats
    const shs = getSHSSummary()
    const approvals = getBuildingApprovalsSummary()
    const haff = getHaffSummary()
    const states = getAllStatesLatest()

    const dataContext = `
## Current Housing Sector Indicators — Australia

### Building Approvals (ABS 8731.0)
- Latest monthly total: ${approvals.latest_monthly.toLocaleString()} dwellings
- Annual run rate: ${approvals.annual_run_rate.toLocaleString()} dwellings/year
- National Housing Accord target: ${approvals.accord_target.toLocaleString()} dwellings/year
- Gap to target: ${approvals.gap_to_target.toLocaleString()} dwellings/year shortfall
- % of target being met: ${approvals.pct_of_target}%
- Year-on-year change: ${approvals.yoy_change_pct > 0 ? "+" : ""}${approvals.yoy_change_pct}%

### Specialist Homelessness Services (AIHW, ${shs.latest_year})
- Total clients: ${shs.total_clients.toLocaleString()}
- Unmet requests: ${shs.unassisted_requests.toLocaleString()} (${shs.unmet_need_rate}% unmet rate)
- Needing housing: ${shs.needing_housing.toLocaleString()}
- Got housing: ${shs.got_housing.toLocaleString()} (${shs.housing_success_rate}% success rate)
- Client change YoY: ${shs.client_change_yoy > 0 ? "+" : ""}${shs.client_change_yoy}%
- Unassisted change YoY: ${shs.unassisted_change_yoy > 0 ? "+" : ""}${shs.unassisted_change_yoy}%

### Housing Australia Future Fund (HAFF)
- Total homes announced (3 rounds): ${haff.total_homes.toLocaleString()}
- Social homes: ${haff.total_social.toLocaleString()}
- Affordable homes: ${haff.total_affordable.toLocaleString()}
- % of 5-year target (30,000 homes): ${haff.pct_of_5yr_target}%
- Remaining to target: ${haff.remaining_to_target.toLocaleString()} homes

### State Housing Waitlists (2024)
${states.map((s) => `- ${s.state}: ${s.waitlist.toLocaleString()} applicants`).join("\n")}
- National total (5 major states): ${states.reduce((sum, s) => sum + s.waitlist, 0).toLocaleString()} applicants
`

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1200,
      messages: [{
        role: "user",
        content: `You are HIVE — an Australian housing intelligence platform. Write a weekly digest for housing sector professionals.

Use the data below to write a concise, professional briefing. Format as:

**HIVE Weekly Digest — [current approximate date]**

**Supply Pipeline**
[2-3 sentences on building approvals vs target]

**Demand Pressure**
[2-3 sentences on SHS data and what it means]

**HAFF Delivery**
[1-2 sentences on HAFF progress]

**State Waitlists**
[1-2 sentences on state-level waitlist picture]

**Analyst Note**
[2-3 sentences of synthesis: the key tension/dynamic in the sector right now]

Keep the tone factual and professional. Use specific numbers from the data. Highlight the biggest risks and signals.

Current data:
${dataContext}`,
      }],
    })

    const digest = message.content[0].type === "text" ? message.content[0].text : ""

    return NextResponse.json({
      digest,
      generated_at: new Date().toISOString(),
    })

  } catch (err: unknown) {
    console.error("Digest error:", err)
    return NextResponse.json({ error: "Digest generation failed" }, { status: 500 })
  }
}
