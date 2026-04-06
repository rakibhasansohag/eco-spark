import { redirect } from "next/navigation"
import { getAccessToken } from "@/lib/tokenUtils"
import { decodeAccessToken } from "@/lib/jwtUtils"
import { getMyProfile } from "@/services/user.services"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = await getAccessToken()
  const decoded = decodeAccessToken(token)
  let role = decoded?.role

  if (!role) {
    try {
      const profile = await getMyProfile()
      role = profile.data.role
    } catch {
      redirect("/login")
    }
  }

  if (role !== "ADMIN") {
    redirect("/member/dashboard")
  }

  return <div className="space-y-6">{children}</div>
}
