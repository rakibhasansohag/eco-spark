import { redirect } from "next/navigation"
import { getAccessToken } from "@/lib/tokenUtils"
import { decodeAccessToken } from "@/lib/jwtUtils"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = await getAccessToken()
  const decoded = decodeAccessToken(token)

  if (!decoded?.role) {
    redirect("/login")
  }

  if (decoded.role !== "ADMIN") {
    redirect("/member/dashboard")
  }

  return <div className="space-y-6">{children}</div>
}
