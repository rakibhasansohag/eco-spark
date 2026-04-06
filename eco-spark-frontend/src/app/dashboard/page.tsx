import { redirect } from "next/navigation"
import { getAccessToken } from "@/lib/tokenUtils"
import { decodeAccessToken } from "@/lib/jwtUtils"
import { getDefaultDashboardRoute } from "@/lib/authUtils"
import { getMyProfile } from "@/services/user.services"

export default async function DashboardEntryPage() {
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

  const appRole = role === "ADMIN" ? "ADMIN" : "MEMBER"
  redirect(getDefaultDashboardRoute(appRole))
}
