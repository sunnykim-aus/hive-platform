import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { isAdminEmail } from "@/lib/admin"
import AdminPanel from "@/components/AdminPanel"

export default async function AdminPage() {
  const session = await getSession()
  if (!session.userId) redirect("/login?next=/admin")
  if (!isAdminEmail(session.email)) redirect("/")
  return <AdminPanel adminEmail={session.email!} />
}
