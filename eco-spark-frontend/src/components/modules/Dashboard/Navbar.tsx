import { getAccessToken } from "@/lib/tokenUtils"
import { decodeAccessToken } from "@/lib/jwtUtils"
import { getMyProfile } from "@/services/user.services"
import { NavbarContent } from "./NavbarContent"

export async function Navbar() {
  const accessToken = await getAccessToken()
  const decoded = decodeAccessToken(accessToken)
  let role: "ADMIN" | "MEMBER" = decoded?.role === "ADMIN" ? "ADMIN" : "MEMBER"
  let name = decoded?.name ?? "EcoSpark User"
  let canChangePassword = true

  try {
    const profile = await getMyProfile()
    role = profile.data.role === "ADMIN" ? "ADMIN" : "MEMBER"
    name = profile.data.name
    canChangePassword = profile.data.canChangePassword !== false
  } catch {}

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center gap-2 px-4">
        <NavbarContent role={role} name={name} canChangePassword={canChangePassword} />
      </div>
    </header>
  )
}
