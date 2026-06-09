import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { createAdminClient } from "@/lib/supabase/admin"

// List organisations with member counts.
export async function GET() {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }
  const db = createAdminClient()
  const { data: orgs, error } = await db
    .from("organisations")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const { data: profiles } = await db.from("profiles").select("org_id")
  const counts: Record<string, number> = {}
  for (const p of profiles ?? []) {
    if (p.org_id) counts[p.org_id] = (counts[p.org_id] ?? 0) + 1
  }

  return NextResponse.json({
    orgs: (orgs ?? []).map((o) => ({ ...o, members: counts[o.id] ?? 0 })),
  })
}

// Create an organisation.
export async function POST(req: Request) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }
  const { name, tier, seat_limit, email_domains } = await req.json()
  if (!name || !tier) {
    return NextResponse.json({ error: "name and tier are required" }, { status: 400 })
  }
  const db = createAdminClient()
  const { error } = await db.from("organisations").insert({
    name,
    tier,
    seat_limit: seat_limit === "" || seat_limit == null ? null : Number(seat_limit),
    email_domains: email_domains ?? [],
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}

// Delete an organisation. Attached profiles fall back to free
// (profiles.org_id is ON DELETE SET NULL).
export async function DELETE(req: Request) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const db = createAdminClient()
  const { error } = await db.from("organisations").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}

// Update an organisation's tier / seats / domains / name.
export async function PATCH(req: Request) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }
  const { id, name, tier, seat_limit, email_domains } = await req.json()
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const patch: Record<string, unknown> = {}
  if (name !== undefined) patch.name = name
  if (tier !== undefined) patch.tier = tier
  if (seat_limit !== undefined)
    patch.seat_limit = seat_limit === "" || seat_limit == null ? null : Number(seat_limit)
  if (email_domains !== undefined) patch.email_domains = email_domains
  const db = createAdminClient()
  const { error } = await db.from("organisations").update(patch).eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
