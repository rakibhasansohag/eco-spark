"use client"

import { BeamHoverCard } from "@/components/shared/interactive/BeamHoverCard"

interface StatsCardProps {
  title: string
  value: number | string
  description?: string
  icon?: React.ReactNode
}

export function StatsCard({ title, value, description, icon }: StatsCardProps) {
  return (
    <BeamHoverCard className="rounded-xl border bg-card p-6 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)]">
      {icon ? <div className="mb-2 text-muted-foreground">{icon}</div> : null}
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="mt-2 text-4xl leading-none font-bold tracking-tight tabular-nums">{value}</p>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      ) : null}
    </BeamHoverCard>
  )
}
