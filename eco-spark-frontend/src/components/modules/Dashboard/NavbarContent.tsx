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
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { NotificationBell } from "./NotificationBell"

interface NavbarContentProps {
  name: string
  role: "ADMIN" | "MEMBER"
  canChangePassword: boolean
}

export function NavbarContent({ name, role, canChangePassword }: NavbarContentProps) {
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
            <SidebarContent
              role={role}
              canChangePassword={canChangePassword}
              onNavigate={() => setSidebarOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Right slot: theme toggle + user menu */}
      <div className="ml-auto flex items-center gap-1">
        <NotificationBell />
        <ThemeToggle />
        <UserMenu name={name} role={role} canChangePassword={canChangePassword} />
      </div>
    </>
  )
}
