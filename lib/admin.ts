// Super-admin gate for the /admin panel and /api/admin/* routes.
// Admins are listed by email in the ADMIN_EMAILS env var (comma-separated).
import { getSession, type Session } from "@/lib/auth"

export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return adminEmails().includes(email.toLowerCase())
}

/** Throws if the current user is not a super-admin. Use in API routes. */
export async function requireAdmin(): Promise<Session> {
  const session = await getSession()
  if (!isAdminEmail(session.email)) {
    throw new Error("Forbidden: admin only")
  }
  return session
}
