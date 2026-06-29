import { NextRequest, NextResponse } from "next/server"
import { Pinecone } from "@pinecone-database/pinecone"
import Anthropic from "@anthropic-ai/sdk"
import { getSession } from "@/lib/auth"
import { meetsTier } from "@/lib/entitlements"

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(req: NextRequest) {
  // Pro+ gate — enforce the same paywall the UI shows, so the endpoint
  // can't be called directly to bypass it.
  const session = await getSession()
  if (!meetsTier(session.tier, "pro")) {
    return NextResponse.json(
      { error: "AI policy analysis requires a CHP Pro plan." },
      { status: 403 },
    )
  }

  try {
    const { policyName, fundingAmount, year } = await req.json()

    if (!policyName?.trim()) {
      return NextResponse.json({ error: "Policy name is required" }, { status: 400 })
    }

    // ── 1. Search Pinecone ────────────────────────────────────────────────────
    const index = pc.index(process.env.PINECONE_INDEX!)
    const namespacedIndex = index.namespace(process.env.PINECONE_NAMESPACE!)
    const results = await namespacedIndex.searchRecords({
      query: { inputs: { text: `${policyName} housing policy impact outcomes results effectiveness evaluation` }, topK: 16 },
      fields: ["text", "title", "source_url", "source_agency", "authors", "year"],
    })

    // Dedupe to unique reports — keep best-scoring chunk per source, cap at 8
    const rawHits = ((results as { result?: { hits?: unknown[] } }).result?.hits ?? []) as { fields?: Record<string, string> }[]
    const seen = new Set<string>()
    const hits: { fields?: Record<string, string>; _score?: number }[] = []
    for (const h of rawHits) {
      const f = h.fields ?? {}
      const k = String(f.source_url || f.title || "").trim().toLowerCase()
      if (!k || seen.has(k)) continue
      seen.add(k)
      hits.push(h as { fields?: Record<string, string>; _score?: number })
      if (hits.length >= 8) break
    }

    if (hits.length === 0) {
      return NextResponse.json({
        answer: "No relevant research found for this policy. The evidence base may not include evaluations of this specific program.",
        sources: [],
      })
    }

    // ── 2. Build context ──────────────────────────────────────────────────────
    const context = (hits as { fields?: Record<string, string>; _score?: number }[]).map((h, i) => {
      const f = h.fields ?? {}
      return `[${i + 1}] ${f.title ?? "Untitled"} (${f.source_agency ?? ""}, ${f.year ?? ""})
${f.text ?? ""}`
    }).join("\n\n---\n\n")

    // ── 3. Synthesise with Claude ─────────────────────────────────────────────
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1600,
      messages: [{
        role: "user",
        content: `You are HIVE — an Australian housing policy analyst. Assess the impact of the policy below using ONLY the numbered research excerpts.

Policy: ${policyName}
Year announced: ${year}
Funding: $${fundingAmount}B

Write it in Markdown with this structure:
- Open with a 2–3 sentence verdict: what the policy set out to do and how effective it actually was (no heading).
- "## Intended design" — what it was meant to achieve.
- "## Outcomes vs targets" — actual results against goals; lead with figures (dollars, dwellings, %, timeframes) wherever the evidence gives them.
- "## What worked / what didn't" — be specific and balanced.
- "## Unintended consequences" — only if the evidence supports them.
- "## Effectiveness rating" — High / Medium / Low, with a one-line justification and a note on evidence confidence.
- "## What this means" — 2–3 implications for housing decision-makers today.

Rules:
- Synthesise in your own analytical voice; do not stitch quotes. Use a short quote only when exact wording matters.
- Cite every claim inline as [1], [2], matching the excerpt numbers. Never invent sources or facts beyond the excerpts.
- If evidence is limited, mixed, or one-sided, say so plainly. Do not extrapolate.
- Do NOT include a sources list — sources are displayed separately.

Numbered research excerpts:
${context}`,
      }],
    })

    const answer = message.content[0].type === "text" ? message.content[0].text : ""

    // ── 4. Format sources ─────────────────────────────────────────────────────
    const sources = (hits as { fields?: Record<string, string | number>; _score?: number }[]).map((h, i) => {
      const f = h.fields ?? {}
      return {
        index: i + 1,
        title: f.title ?? "Untitled",
        agency: f.source_agency ?? "",
        year: f.year ?? "",
        url: f.source_url ?? "",
        authors: f.authors ?? "",
        score: h._score ?? 0,
      }
    })

    return NextResponse.json({ answer, sources })

  } catch (err: unknown) {
    console.error("Policy impact error:", err)
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 })
  }
}
