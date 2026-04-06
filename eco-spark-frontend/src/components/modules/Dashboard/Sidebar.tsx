import Link from "next/link"
import { Leaf } from "lucide-react"
import { AppRole } from "@/lib/authUtils"
import { getAccessToken } from "@/lib/tokenUtils"
import { decodeAccessToken } from "@/lib/jwtUtils"
import { getMyProfile } from "@/services/user.services"
import { SidebarContent } from "./SidebarContent"

const resolveRole = async (): Promise<AppRole> => {
  const accessToken = await getAccessToken()
  const decoded = decodeAccessToken(accessToken)
  if (decoded?.role) {
    return decoded.role === "ADMIN" ? "ADMIN" : "MEMBER"
  }

  try {
    const profile = await getMyProfile()
    return profile.data.role === "ADMIN" ? "ADMIN" : "MEMBER"
  } catch {
    return "MEMBER"
  }
}

export async function Sidebar() {
  const role = await resolveRole()
  const canChangePassword = await getMyProfile()
    .then((res) => res.data.canChangePassword !== false)
    .catch(() => true)

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-background md:flex">
      <div className="flex h-14 shrink-0 items-center border-b px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold transition-opacity hover:opacity-80"
        >
          <Leaf className="size-4 text-primary" />
          <span>EcoSpark Hub</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <SidebarContent role={role} canChangePassword={canChangePassword} />
      </div>
    </aside>
  )
}
