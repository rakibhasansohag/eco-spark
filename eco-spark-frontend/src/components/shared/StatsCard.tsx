"use client"

import { type LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: number | string
  description?: string
  icon?: LucideIcon
}

export function StatsCard({ title, value, description, icon: Icon }: StatsCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      {Icon ? <Icon className="mb-2 size-5 text-muted-foreground" aria-hidden /> : null}
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="mt-1 text-3xl font-bold tabular-nums">{value}</p>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}
