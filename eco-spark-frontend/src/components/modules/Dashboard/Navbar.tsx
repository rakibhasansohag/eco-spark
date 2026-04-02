import { getAccessToken } from "@/lib/tokenUtils"
import { decodeAccessToken } from "@/lib/jwtUtils"
import { NavbarContent } from "./NavbarContent"

export async function Navbar() {
  const accessToken = await getAccessToken()
  const decoded = decodeAccessToken(accessToken)

  const role = decoded?.role === "ADMIN" ? "ADMIN" : "MEMBER"
  const name = decoded?.name ?? "EcoSpark User"

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center justify-end px-4">
        <NavbarContent role={role} name={name} />
      </div>
    </header>
  )
}
