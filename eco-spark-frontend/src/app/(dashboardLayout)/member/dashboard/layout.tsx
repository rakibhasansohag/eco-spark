import { redirect } from "next/navigation"
import { getAccessToken } from "@/lib/tokenUtils"
import { decodeAccessToken } from "@/lib/jwtUtils"

export default async function MemberDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = await getAccessToken()
  const decoded = decodeAccessToken(token)

  if (!decoded?.role) {
    redirect("/login")
  }

  if (decoded.role === "ADMIN") {
    redirect("/admin/dashboard")
  }

  return <div className="space-y-4">{children}</div>
}
