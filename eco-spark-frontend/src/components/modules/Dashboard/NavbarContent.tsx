"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"
import { UserMenu } from "./UserMenu"
import { SidebarContent } from "./SidebarContent"

interface NavbarContentProps {
  name: string
  role: "ADMIN" | "MEMBER"
}

export function NavbarContent({ name, role }: NavbarContentProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {/* Mobile sidebar trigger — hidden on md+ since the aside handles it */}
      <div className="md:hidden">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open sidebar">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation menu</SheetTitle>
            </SheetHeader>
            <div className="flex h-14 items-center border-b px-4">
              <Link
                href="/"
                className="flex items-center gap-2 font-semibold"
                onClick={() => setSidebarOpen(false)}
              >
                <Leaf className="size-4 text-primary" />
                <span>EcoSpark Hub</span>
              </Link>
            </div>
            <SidebarContent role={role} onNavigate={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* UserMenu — always visible, pushed to right */}
      <div className="ml-auto">
        <UserMenu name={name} role={role} />
      </div>
    </>
  )
}
