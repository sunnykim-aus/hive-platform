"use client"

import { useState } from "react"
import Link from "next/link"

type Source = {
  index: number
  title: string
  agency: string
  year: string
  url: string
  authors: string
  score: number
}

type SearchResult = {
  answer: string
  sources: Source[]
}

const SUGGESTED = [
  "What does the evidence say about SDA supply gaps in regional Australia?",
  "What are the key barriers to community housing investment in Australia?",
  "How does supported housing affect outcomes for people with disability?",
  "What policy interventions have improved housing affordability?",
]

export default function HiveSearch() {
  const [query, setQuery]     = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState<SearchResult | null>(null)
  const [error, setError]     = useState("")

  const search = async (q: string) => {
    if (!q.trim()) return
    setLoading(true)
    setResult(null)
    setError("")
    setQuery(q)

    try {
      const res = await fetch("/api/search", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ query: q }),
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setResult(data)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    search(query)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--hive-midnight)" }}>

      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧠</span>
          <div>
            <p className="text-white font-black text-lg leading-none">HIVE</p>
            <p className="text-blue-400/70 text-[10px] font-bold tracking-widest uppercase">Housing Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/30 text-xs">681 reports · Live data</span>
          <a href="https://impactanalyticsaustralia.com.au"
            className="text-xs text-white/40 hover:text-white/70 transition-colors">
            Impact Analytics ↗
          </a>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">

        {!result && !loading && (
          <>
            {/* Hero */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-blue-300 text-xs font-bold tracking-wide uppercase">
                  681 Research Reports · AI-Powered Synthesis
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                Ask the evidence base.<br />
                <span style={{
                  background: "linear-gradient(135deg, #60a5fa, #93c5fd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  Get an answer in seconds.
                </span>
              </h1>
              <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
                HIVE searches 681 indexed research reports, policy documents, and government
                publications — then synthesises a cited answer with Claude AI.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-10 max-w-lg mx-auto">
              {[
                { value: "681", label: "Research reports" },
                { value: "5,059", label: "Indexed chunks" },
                { value: "10 yrs", label: "Population data" },
              ].map(s => (
                <div key={s.label} className="hive-card px-4 py-3 text-center">
                  <p className="text-white font-black text-lg tabular-nums">{s.value}</p>
                  <p className="text-white/40 text-[11px] font-medium mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Search bar */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="What does the research say about..."
              className="hive-input flex-1 px-5 py-4 text-base"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="hive-btn px-7 py-4 text-base whitespace-nowrap"
            >
              {loading ? "Searching…" : "Search →"}
            </button>
          </div>
        </form>

        {/* Suggested questions */}
        {!result && !loading && (
          <div className="space-y-2">
            <p className="text-white/30 text-xs font-bold uppercase tracking-wide mb-3">Try asking</p>
            {SUGGESTED.map(q => (
              <button
                key={q}
                onClick={() => search(q)}
                className="w-full text-left hive-card px-5 py-3.5 text-white/60 text-sm hover:text-white hover:border-blue-500/30 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-flex items-center gap-3 text-white/50">
              <div className="w-5 h-5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
              <span className="text-sm">Searching 681 reports and synthesising answer…</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="hive-card border-red-500/20 bg-red-500/5 px-5 py-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">

            {/* Back button */}
            <button
              onClick={() => { setResult(null); setQuery("") }}
              className="text-white/40 text-sm hover:text-white/70 transition-colors flex items-center gap-1"
            >
              ← New search
            </button>

            {/* Query echo */}
            <div className="hive-card px-5 py-3">
              <p className="text-white/40 text-xs font-bold uppercase tracking-wide mb-1">Your question</p>
              <p className="text-white font-semibold text-[15px]">{query}</p>
            </div>

            {/* Answer */}
            <div className="hive-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🧠</span>
                <p className="text-blue-300 text-xs font-bold uppercase tracking-wide">
                  AI Synthesis · {result.sources.length} sources
                </p>
              </div>
              <div className="text-white/85 text-[15px] leading-relaxed whitespace-pre-wrap">
                {result.answer}
              </div>
            </div>

            {/* Sources */}
            {result.sources.length > 0 && (
              <div>
                <p className="text-white/40 text-xs font-bold uppercase tracking-wide mb-3">
                  Sources retrieved ({result.sources.length})
                </p>
                <div className="space-y-3">
                  {result.sources.map(s => (
                    <div key={s.index} className="hive-card px-5 py-4 flex gap-4">
                      <span className="text-blue-400 font-black text-sm shrink-0 mt-0.5 w-6">
                        [{s.index}]
                      </span>
                      <div className="min-w-0">
                        <p className="text-white font-semibold text-sm leading-snug">{s.title}</p>
                        <p className="text-white/40 text-xs mt-1">
                          {s.agency}{s.year ? ` · ${s.year}` : ""}{s.authors ? ` · ${s.authors}` : ""}
                        </p>
                        {s.url && (
                          <a href={s.url} target="_blank" rel="noopener noreferrer"
                            className="text-blue-400/70 text-xs hover:text-blue-400 transition-colors mt-1 inline-block">
                            View source ↗
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-white/20 text-xs text-center pb-4">
              AI-synthesised from indexed research. Verify against primary sources before relying on for decisions.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
