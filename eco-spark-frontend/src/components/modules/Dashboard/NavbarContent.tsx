"use client"

import { Badge } from "@/components/ui/badge"

interface NavbarContentProps {
  name: string
  role: "ADMIN" | "MEMBER"
}

export function NavbarContent({ name, role }: NavbarContentProps) {
  return (
    <div className="flex items-center gap-3">
      <Badge variant="secondary">{role}</Badge>
      <p className="text-sm text-muted-foreground">{name}</p>
    </div>
  )
}
