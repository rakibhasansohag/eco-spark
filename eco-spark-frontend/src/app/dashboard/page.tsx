import { redirect } from "next/navigation"
import { getAccessToken } from "@/lib/tokenUtils"
import { decodeAccessToken } from "@/lib/jwtUtils"
import { getDefaultDashboardRoute } from "@/lib/authUtils"

export default async function DashboardEntryPage() {
  const token = await getAccessToken()
  const decoded = decodeAccessToken(token)

  if (!decoded?.role) {
    redirect("/login")
  }

  const role = decoded.role === "ADMIN" ? "ADMIN" : "MEMBER"
  redirect(getDefaultDashboardRoute(role))
}
