"use client"

import { useEffect, useState, useCallback } from "react"

type Tier = "free" | "pro" | "enterprise" | "government"
const TIERS: Tier[] = ["free", "pro", "enterprise", "government"]
const SEAT_HINT: Record<Tier, string> = {
  free: "1",
  pro: "3",
  enterprise: "10",
  government: "blank = unlimited",
}

type Org = {
  id: string
  name: string
  tier: Tier
  seat_limit: number | null
  email_domains: string[]
  members: number
}
type User = {
  id: string
  email: string
  org_id: string | null
  organisations: { name: string; tier: Tier } | null
}

const card: React.CSSProperties = {
  background: "#0c1829",
  border: "1px solid #1e2d40",
  borderRadius: 10,
  padding: 18,
}
const input: React.CSSProperties = {
  background: "#070d18",
  border: "1px solid #1e2d40",
  borderRadius: 6,
  padding: "7px 10px",
  color: "#fff",
  fontSize: "0.85rem",
  outline: "none",
}
const btn: React.CSSProperties = {
  background: "#f6c90e",
  color: "#0b1220",
  fontWeight: 700,
  border: "none",
  borderRadius: 6,
  padding: "7px 14px",
  fontSize: "0.82rem",
  cursor: "pointer",
}
const ghost: React.CSSProperties = {
  background: "transparent",
  color: "#c8d8e8",
  border: "1px solid #1e2d40",
  borderRadius: 6,
  padding: "7px 12px",
  fontSize: "0.8rem",
  cursor: "pointer",
}
const label: React.CSSProperties = { color: "#6b8aa0", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.4px", display: "block", marginBottom: 4 }

export default function AdminPanel({ adminEmail }: { adminEmail: string }) {
  const [orgs, setOrgs] = useState<Org[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState("")

  // create-org form
  const [name, setName] = useState("")
  const [tier, setTier] = useState<Tier>("pro")
  const [seats, setSeats] = useState("")
  const [domains, setDomains] = useState("")

  // attach-user form
  const [attachEmail, setAttachEmail] = useState("")
  const [attachOrg, setAttachOrg] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    const [o, u] = await Promise.all([
      fetch("/api/admin/orgs").then((r) => r.json()),
      fetch("/api/admin/users").then((r) => r.json()),
    ])
    setOrgs(o.orgs ?? [])
    setUsers(u.users ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function createOrg(e: React.FormEvent) {
    e.preventDefault()
    setMsg("")
    const res = await fetch("/api/admin/orgs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        tier,
        seat_limit: seats,
        email_domains: domains.split(",").map((d) => d.trim().toLowerCase()).filter(Boolean),
      }),
    })
    const j = await res.json()
    if (!res.ok) { setMsg(`Error: ${j.error}`); return }
    setName(""); setSeats(""); setDomains("")
    setMsg("Organisation created ✓")
    load()
  }

  async function saveOrg(o: Org) {
    setMsg("")
    const res = await fetch("/api/admin/orgs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: o.id, name: o.name, tier: o.tier,
        seat_limit: o.seat_limit, email_domains: o.email_domains,
      }),
    })
    const j = await res.json()
    setMsg(res.ok ? "Saved ✓" : `Error: ${j.error}`)
    if (res.ok) load()
  }

  async function deleteOrg(o: Org) {
    if (!confirm(`Delete "${o.name}"? Members (${o.members}) will revert to free. This cannot be undone.`)) return
    setMsg("")
    const res = await fetch("/api/admin/orgs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: o.id }),
    })
    const j = await res.json()
    setMsg(res.ok ? "Organisation deleted ✓" : `Error: ${j.error}`)
    if (res.ok) load()
  }

  async function attachUser(e: React.FormEvent) {
    e.preventDefault()
    setMsg("")
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: attachEmail.trim(), org_id: attachOrg || null }),
    })
    const j = await res.json()
    if (!res.ok) { setMsg(`Error: ${j.error}`); return }
    setAttachEmail(""); setAttachOrg("")
    setMsg("User updated ✓")
    load()
  }

  function patchOrg(id: string, patch: Partial<Org>) {
    setOrgs((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)))
  }

  return (
    <div style={{ minHeight: "100vh", background: "#070d18", color: "#c8d8e8", padding: "32px 24px" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: "1.5em" }}>🐝</span>
            <span style={{ fontWeight: 900, color: "#f6c90e", letterSpacing: "2px", fontSize: "1.2rem" }}>HIVE ADMIN</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "0.78rem", color: "#6b8aa0" }}>{adminEmail}</span>
            <a href="/" style={ghost as React.CSSProperties}>← App</a>
          </div>
        </div>

        {msg && (
          <div style={{ ...card, padding: "10px 16px", marginBottom: 16, borderColor: "#2a3d52", fontSize: "0.85rem" }}>{msg}</div>
        )}

        {/* Create org */}
        <h2 style={{ color: "#fff", fontSize: "1rem", margin: "0 0 12px" }}>Create organisation</h2>
        <form onSubmit={createOrg} style={{ ...card, display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 2fr auto", gap: 12, alignItems: "end", marginBottom: 28 }}>
          <div><span style={label}>Name</span><input style={{ ...input, width: "100%" }} value={name} onChange={(e) => setName(e.target.value)} placeholder="Big CHP" required /></div>
          <div><span style={label}>Tier</span>
            <select style={{ ...input, width: "100%" }} value={tier} onChange={(e) => setTier(e.target.value as Tier)}>
              {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div><span style={label}>Seats ({SEAT_HINT[tier]})</span><input style={{ ...input, width: "100%" }} value={seats} onChange={(e) => setSeats(e.target.value)} placeholder={SEAT_HINT[tier]} /></div>
          <div><span style={label}>Email domains (comma sep)</span><input style={{ ...input, width: "100%" }} value={domains} onChange={(e) => setDomains(e.target.value)} placeholder="bigchp.org.au, bigchp.com.au" /></div>
          <button type="submit" style={btn}>Create</button>
        </form>

        {/* Org list */}
        <h2 style={{ color: "#fff", fontSize: "1rem", margin: "0 0 12px" }}>Organisations {loading ? "…" : `(${orgs.length})`}</h2>
        <div style={{ display: "grid", gap: 10, marginBottom: 28 }}>
          {orgs.map((o) => (
            <div key={o.id} style={{ ...card, display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 2fr auto", gap: 12, alignItems: "end" }}>
              <div><span style={label}>Name</span><input style={{ ...input, width: "100%" }} value={o.name} onChange={(e) => patchOrg(o.id, { name: e.target.value })} /></div>
              <div><span style={label}>Tier</span>
                <select style={{ ...input, width: "100%" }} value={o.tier} onChange={(e) => patchOrg(o.id, { tier: e.target.value as Tier })}>
                  {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div><span style={label}>Seats {o.members}/{o.seat_limit ?? "∞"}</span>
                <input style={{ ...input, width: "100%" }} value={o.seat_limit ?? ""} placeholder="∞" onChange={(e) => patchOrg(o.id, { seat_limit: e.target.value === "" ? null : Number(e.target.value) })} />
              </div>
              <div><span style={label}>Domains</span><input style={{ ...input, width: "100%" }} value={o.email_domains.join(", ")} onChange={(e) => patchOrg(o.id, { email_domains: e.target.value.split(",").map((d) => d.trim().toLowerCase()).filter(Boolean) })} /></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button onClick={() => saveOrg(o)} style={btn}>Save</button>
                <button onClick={() => deleteOrg(o)} style={{ ...ghost, color: "#f87171", borderColor: "#3a2030", padding: "5px 12px" }}>Delete</button>
              </div>
            </div>
          ))}
          {!loading && orgs.length === 0 && <p style={{ color: "#6b8aa0", fontSize: "0.85rem" }}>No organisations yet.</p>}
        </div>

        {/* Attach user */}
        <h2 style={{ color: "#fff", fontSize: "1rem", margin: "0 0 12px" }}>Attach a user to an org</h2>
        <p style={{ color: "#6b8aa0", fontSize: "0.78rem", margin: "0 0 10px" }}>For people whose email domain doesn&apos;t auto-match. They must have signed in at least once.</p>
        <form onSubmit={attachUser} style={{ ...card, display: "grid", gridTemplateColumns: "2fr 2fr auto", gap: 12, alignItems: "end", marginBottom: 28 }}>
          <div><span style={label}>User email</span><input style={{ ...input, width: "100%" }} value={attachEmail} onChange={(e) => setAttachEmail(e.target.value)} placeholder="consultant@gmail.com" required /></div>
          <div><span style={label}>Organisation</span>
            <select style={{ ...input, width: "100%" }} value={attachOrg} onChange={(e) => setAttachOrg(e.target.value)}>
              <option value="">— none (free) —</option>
              {orgs.map((o) => <option key={o.id} value={o.id}>{o.name} ({o.tier})</option>)}
            </select>
          </div>
          <button type="submit" style={btn}>Attach</button>
        </form>

        {/* Users */}
        <h2 style={{ color: "#fff", fontSize: "1rem", margin: "0 0 12px" }}>Users {loading ? "…" : `(${users.length})`}</h2>
        <div style={{ ...card, padding: 0, overflow: "hidden" }}>
          {users.map((u, i) => (
            <div key={u.id} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr", gap: 12, padding: "10px 16px", borderTop: i ? "1px solid #1e2d40" : "none", fontSize: "0.84rem" }}>
              <span>{u.email}</span>
              <span style={{ color: "#6b8aa0" }}>{u.organisations?.name ?? "— no org —"}</span>
              <span style={{ color: u.organisations?.tier === "free" || !u.organisations ? "#6b8aa0" : "#5aad8a", fontWeight: 600 }}>{u.organisations?.tier ?? "free"}</span>
            </div>
          ))}
          {!loading && users.length === 0 && <p style={{ color: "#6b8aa0", fontSize: "0.85rem", padding: 16 }}>No users yet.</p>}
        </div>
      </div>
    </div>
  )
}
