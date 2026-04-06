import { getAccessToken } from "@/lib/tokenUtils"
import { decodeAccessToken } from "@/lib/jwtUtils"
import { getMyProfile } from "@/services/user.services"
import { NavbarContent } from "./NavbarContent"

export async function Navbar() {
  const accessToken = await getAccessToken()
  const decoded = decodeAccessToken(accessToken)

  const role = decoded?.role === "ADMIN" ? "ADMIN" : "MEMBER"
  const name = decoded?.name ?? "EcoSpark User"
  const canChangePassword = await getMyProfile()
    .then((res) => res.data.canChangePassword !== false)
    .catch(() => true)

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center gap-2 px-4">
        <NavbarContent role={role} name={name} canChangePassword={canChangePassword} />
      </div>
    </header>
  )
}
