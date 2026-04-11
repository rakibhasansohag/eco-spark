export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* PageHeader Skeleton */}
      <div className="relative overflow-hidden rounded-xl border bg-muted/20 p-6 md:p-7">
        <div className="space-y-3">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-9 w-64 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-96 animate-pulse rounded bg-muted" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm"
          >
            {/* Beam Animation Placeholder */}
            <div className="absolute inset-y-[-60%] left-[-35%] z-10 w-[52%] rotate-[20deg] bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-2xl animate-beam-skeleton" />
            
            <div className="relative z-20 space-y-3">
              <div className="size-5 animate-pulse rounded bg-muted" />
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-9 w-16 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-[400px] animate-pulse rounded-xl border bg-muted/20" />
        <div className="h-[400px] animate-pulse rounded-xl border bg-muted/20" />
      </div>

      {/* Table Skeleton */}
      <div className="h-[350px] animate-pulse rounded-xl border bg-muted/20" />
    </div>
  )
}
