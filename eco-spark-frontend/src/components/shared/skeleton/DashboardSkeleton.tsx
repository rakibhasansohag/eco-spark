export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-52 animate-pulse rounded-md bg-muted" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-lg border bg-card p-4">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-8 w-16 animate-pulse rounded bg-muted" />
            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="h-52 animate-pulse rounded-lg border bg-card" />
    </div>
  )
}
