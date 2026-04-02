import { AppRole } from "@/lib/authUtils"
import { getAccessToken } from "@/lib/tokenUtils"
import { decodeAccessToken } from "@/lib/jwtUtils"
import { SidebarContent } from "./SidebarContent"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

const resolveRole = async (): Promise<AppRole> => {
  const accessToken = await getAccessToken()
  const decoded = decodeAccessToken(accessToken)
  return decoded?.role === "ADMIN" ? "ADMIN" : "MEMBER"
}

export async function Sidebar() {
  const role = await resolveRole()

  return (
    <>
      <aside className="hidden w-72 shrink-0 border-r bg-background md:flex md:flex-col">
        <div className="border-b px-4 py-4 text-lg font-semibold">EcoSpark Hub</div>
        <SidebarContent role={role} />
      </aside>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon-sm">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader>
              <SheetTitle>EcoSpark Hub</SheetTitle>
            </SheetHeader>
            <SidebarContent role={role} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
