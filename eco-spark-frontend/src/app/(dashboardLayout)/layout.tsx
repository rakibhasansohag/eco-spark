import { redirect } from "next/navigation"
import { Navbar } from "@/components/modules/Dashboard/Navbar"
import { Sidebar } from "@/components/modules/Dashboard/Sidebar"
import { getAccessToken } from "@/lib/tokenUtils"
import { decodeAccessToken } from "@/lib/jwtUtils"
import { getMyProfile } from "@/services/user.services"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side auth check to prevent flicker
  const accessToken = await getAccessToken()
  let decoded = decodeAccessToken(accessToken)
  
  // If no token in cookies, try to fetch profile (maybe session-based)
  if (!decoded) {
    try {
      const profile = await getMyProfile()
      decoded = {
        userId: profile.data.id,
        role: profile.data.role,
        email: profile.data.email,
        name: profile.data.name
      }
    } catch {
      // Not logged in at all
      redirect("/login")
    }
  }

  // Double check login
  if (!decoded) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-muted/20">
      <Sidebar />
      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden md:ml-64">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
