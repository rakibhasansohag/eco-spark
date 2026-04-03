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
    <div className="rounded-xl border bg-card p-6 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)]">
      {Icon ? <Icon className="mb-2 size-5 text-muted-foreground" aria-hidden /> : null}
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="mt-2 text-4xl leading-none font-bold tracking-tight tabular-nums">{value}</p>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}
