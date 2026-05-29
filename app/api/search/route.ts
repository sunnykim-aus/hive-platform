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
      query: { inputs: { text: query }, topK: 8 },
      fields: ["text", "title", "source_url", "source_agency", "authors", "year"],
    })

    const hits = (results as any).result?.hits ?? []

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
      max_tokens: 1200,
      messages: [{
        role:    "user",
        content: `You are HIVE — an AI research assistant for Australian community housing professionals.

Answer the following question using ONLY the research excerpts below.
- Write in clear, professional prose
- Cite sources as [1], [2] etc inline
- If the evidence is mixed or limited, say so
- End with a "Key sources" list

Question: ${query}

Research excerpts:
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
