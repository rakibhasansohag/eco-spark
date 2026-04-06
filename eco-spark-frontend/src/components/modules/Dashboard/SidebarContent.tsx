"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { AppRole } from "@/lib/authUtils"
import { getCommonProtectedNavItems, getRoleNavItems } from "@/lib/navItems"

interface SidebarContentProps {
  role: AppRole
  canChangePassword?: boolean
  onNavigate?: () => void
}

export function SidebarContent({ role, canChangePassword = true, onNavigate }: SidebarContentProps) {
  const pathname = usePathname()
  const roleItems = getRoleNavItems(role)
  const commonItems = getCommonProtectedNavItems().filter(
    (item) => canChangePassword || item.href !== "/change-password",
  )
  const allItems = [...roleItems, ...commonItems]

  const activeHref =
    allItems
      .map((item) => item.href)
      .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
      .sort((a, b) => b.length - a.length)[0] ?? null

  const linkClass = (href: string) => {
    const active = href === activeHref
    return cn(
      "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
      active
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-accent hover:text-foreground",
    )
  }

  return (
    <nav className="flex flex-col gap-1 p-3">
      {roleItems.map((item) => (
        <Link key={item.href} href={item.href} onClick={onNavigate} className={linkClass(item.href)}>
          <item.icon className="size-4 shrink-0" />
          {item.label}
        </Link>
      ))}

      <div className="my-2 h-px bg-border" />

      {commonItems.map((item) => (
        <Link key={item.href} href={item.href} onClick={onNavigate} className={linkClass(item.href)}>
          <item.icon className="size-4 shrink-0" />
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
