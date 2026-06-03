import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { createAdminClient } from "@/lib/supabase/admin"

// List all profiles with their org + tier.
export async function GET() {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }
  const db = createAdminClient()
  const { data, error } = await db
    .from("profiles")
    .select("id, email, org_id, role, created_at, organisations(name, tier)")
    .order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ users: data ?? [] })
}

// Attach (or detach, org_id=null) a user to an org by email.
export async function POST(req: Request) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }
  const { email, org_id } = await req.json()
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 })
  const db = createAdminClient()
  const { data, error } = await db
    .from("profiles")
    .update({ org_id: org_id || null })
    .eq("email", email)
    .select("id")
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: "No user with that email has signed in yet" },
      { status: 404 },
    )
  }
  return NextResponse.json({ ok: true })
}
