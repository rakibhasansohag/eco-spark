"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { AppRole } from "@/lib/authUtils"
import { getCommonProtectedNavItems, getRoleNavItems } from "@/lib/navItems"

interface SidebarContentProps {
  role: AppRole
  onNavigate?: () => void
}

export function SidebarContent({ role, onNavigate }: SidebarContentProps) {
  const pathname = usePathname()
  const navItems = [...getRoleNavItems(role), ...getCommonProtectedNavItems()]

  return (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
