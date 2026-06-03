"use client"

import React from "react"

// ── Inline formatting: **bold**, [n] citations → anchors, [text](url) links ──
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  const regex = /(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))|(\[\d+(?:\s*,\s*\d+)*\])/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    const tok = m[0]
    if (tok.startsWith("**")) {
      nodes.push(
        <strong key={`${keyPrefix}-b${i}`} style={{ color: "#eaf1f8", fontWeight: 700 }}>
          {tok.slice(2, -2)}
        </strong>
      )
    } else if (tok.startsWith("[") && tok.includes("](")) {
      const mm = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok)!
      nodes.push(
        <a key={`${keyPrefix}-l${i}`} href={mm[2]} target="_blank" rel="noopener noreferrer"
          style={{ color: "#4d7fb5", textDecoration: "none" }}>
          {mm[1]}
        </a>
      )
    } else {
      // citation token like [3] or [2, 4] → one anchor per number
      const nums = tok.slice(1, -1).split(",").map(s => s.trim()).filter(Boolean)
      nodes.push(
        <span key={`${keyPrefix}-c${i}`}>
          {nums.map((n, j) => (
            <a key={j} href={`#hive-source-${n}`}
              style={{ color: "#f6c90e", fontWeight: 700, textDecoration: "none" }}>
              [{n}]
            </a>
          ))}
        </span>
      )
    }
    last = m.index + tok.length
    i++
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

const isHeading = (l: string) => /^#{1,4}\s+/.test(l)
const isUl = (l: string) => /^[-*]\s+/.test(l)
const isOl = (l: string) => /^\d+\.\s+/.test(l)

export default function Markdown({ text }: { text: string }) {
  const lines = (text || "").replace(/\r/g, "").split("\n")
  const blocks: React.ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const trimmed = lines[i].trim()
    if (trimmed === "") { i++; continue }

    // Heading
    const h = /^(#{1,4})\s+(.*)$/.exec(trimmed)
    if (h) {
      const level = h[1].length
      const style: React.CSSProperties =
        level === 1 ? { fontSize: "1.15rem", fontWeight: 800, color: "#ffffff", margin: "2px 0 12px", letterSpacing: "-0.2px" }
        : level === 2 ? { fontSize: "0.98rem", fontWeight: 800, color: "#f6c90e", textTransform: "uppercase", letterSpacing: "0.5px", margin: "22px 0 8px" }
        : { fontSize: "0.9rem", fontWeight: 700, color: "#c8d8e8", margin: "16px 0 6px" }
      blocks.push(<div key={key++} style={style}>{renderInline(h[2], `h${key}`)}</div>)
      i++
      continue
    }

    // Unordered list
    if (isUl(trimmed)) {
      const items: React.ReactNode[] = []
      while (i < lines.length && isUl(lines[i].trim())) {
        items.push(
          <li key={items.length} style={{ marginBottom: 6 }}>
            {renderInline(lines[i].trim().replace(/^[-*]\s+/, ""), `ul${key}-${items.length}`)}
          </li>
        )
        i++
      }
      blocks.push(
        <ul key={key++} style={{ margin: "8px 0 14px", paddingLeft: 20, color: "#c8d8e8", lineHeight: 1.7, fontSize: "0.88rem" }}>
          {items}
        </ul>
      )
      continue
    }

    // Ordered list
    if (isOl(trimmed)) {
      const items: React.ReactNode[] = []
      while (i < lines.length && isOl(lines[i].trim())) {
        items.push(
          <li key={items.length} style={{ marginBottom: 6 }}>
            {renderInline(lines[i].trim().replace(/^\d+\.\s+/, ""), `ol${key}-${items.length}`)}
          </li>
        )
        i++
      }
      blocks.push(
        <ol key={key++} style={{ margin: "8px 0 14px", paddingLeft: 22, color: "#c8d8e8", lineHeight: 1.7, fontSize: "0.88rem" }}>
          {items}
        </ol>
      )
      continue
    }

    // Paragraph (gather consecutive non-empty, non-block lines)
    const para: string[] = []
    while (i < lines.length) {
      const t = lines[i].trim()
      if (t === "" || isHeading(t) || isUl(t) || isOl(t)) break
      para.push(t)
      i++
    }
    blocks.push(
      <p key={key++} style={{ margin: "0 0 13px", color: "#c8d8e8", lineHeight: 1.8, fontSize: "0.88rem" }}>
        {renderInline(para.join(" "), `p${key}`)}
      </p>
    )
  }

  return <div>{blocks}</div>
}
