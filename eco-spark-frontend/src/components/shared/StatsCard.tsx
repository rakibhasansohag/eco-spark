"use client"

interface StatsCardProps {
  title: string
  value: number | string
  description?: string
}

export function StatsCard({ title, value, description }: StatsCardProps) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {description ? (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}
