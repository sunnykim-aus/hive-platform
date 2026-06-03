import { NextRequest, NextResponse } from "next/server"
import { Pinecone } from "@pinecone-database/pinecone"
import Anthropic from "@anthropic-ai/sdk"

const pc        = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()
    if (!query?.trim()) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // ── 1. Search Pinecone ────────────────────────────────────────────────────
    const index   = pc.index(process.env.PINECONE_INDEX!)
    const namespacedIndex = index.namespace(process.env.PINECONE_NAMESPACE!)
    const results = await namespacedIndex.searchRecords({
      query: { inputs: { text: query }, topK: 14 },
      fields: ["text", "title", "source_url", "source_agency", "authors", "year"],
    })

    // Dedupe to unique reports — keep the best-scoring chunk per source, cap at 8
    const rawHits = (results as any).result?.hits ?? []
    const seen = new Set<string>()
    const hits: any[] = []
    for (const h of rawHits) {
      const f = h.fields ?? {}
      const k = String(f.source_url || f.title || "").trim().toLowerCase()
      if (!k || seen.has(k)) continue
      seen.add(k)
      hits.push(h)
      if (hits.length >= 8) break
    }

    if (hits.length === 0) {
      return NextResponse.json({
        answer: "No relevant research found for that query. Try rephrasing or using different keywords.",
        sources: [],
      })
    }

    // ── 2. Build context for Claude ───────────────────────────────────────────
    const context = hits.map((h: any, i: number) => {
      const f = h.fields ?? {}
      return `[${i + 1}] ${f.title ?? "Untitled"} (${f.source_agency ?? ""}, ${f.year ?? ""})
${f.text ?? ""}`
    }).join("\n\n---\n\n")

    // ── 3. Synthesise with Claude ─────────────────────────────────────────────
    const message = await anthropic.messages.create({
      model:      "claude-haiku-4-5",
      max_tokens: 1600,
      messages: [{
        role:    "user",
        content: `You are HIVE — a research analyst for Australian community and social housing professionals (CHPs, developers, housing authorities, investors, policymakers).

Using ONLY the numbered research excerpts below, write a sharp evidence brief answering the question.

Write it in Markdown with this structure:
- Open with a 2–3 sentence executive summary giving the bottom-line answer first (no heading).
- Then 3–5 themed sections, each with a "## " heading, ordered by importance.
- Close with a "## What this means" section: 2–3 crisp implications for someone making a decision.

Rules:
- Synthesise across sources in your own analytical voice. Do NOT stitch quotes together; use a short quote only when the exact wording matters.
- Where the evidence gives figures (dollars, counts, %, gaps, timeframes), lead with the number.
- Cover the breadth of the question. If the excerpts skew to one sub-topic, say so explicitly rather than presenting it as the whole picture.
- Cite every claim inline as [1], [2], matching the excerpt numbers. Never invent sources or facts beyond the excerpts.
- If the evidence is thin, mixed, or one-sided, state that plainly.
- Do NOT include a sources list — sources are displayed separately.

Question: ${query}

Numbered research excerpts:
${context}`,
      }],
    })

    const answer = message.content[0].type === "text" ? message.content[0].text : ""

    // ── 4. Format sources ─────────────────────────────────────────────────────
    const sources = hits.map((h: any, i: number) => {
      const f = h.fields ?? {}
      return {
        index:   i + 1,
        title:   f.title   ?? "Untitled",
        agency:  f.source_agency ?? "",
        year:    f.year    ?? "",
        url:     f.source_url ?? "",
        authors: f.authors ?? "",
        score:   h._score  ?? 0,
      }
    })

    return NextResponse.json({ answer, sources })

  } catch (err: any) {
    console.error("Search error:", err)
    return NextResponse.json({ error: "Search failed. Please try again." }, { status: 500 })
  }
}
