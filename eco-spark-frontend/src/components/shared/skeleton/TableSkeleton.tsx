interface TableSkeletonProps {
  rows?: number
}

export function TableSkeleton({ rows = 5 }: TableSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* SearchBar Skeleton */}
      <div className="h-10 w-full max-w-sm animate-pulse rounded-lg border bg-muted/20" />

      {/* Table Container Skeleton */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)]">
        <div className="h-12 border-b bg-muted/30" />
        <div className="divide-y divide-border">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4">
              <div className="size-8 animate-pulse rounded-full bg-muted/40" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-muted/60" />
                <div className="h-3 w-60 animate-pulse rounded bg-muted/40" />
              </div>
              <div className="h-4 w-20 animate-pulse rounded bg-muted/40" />
              <div className="h-4 w-24 animate-pulse rounded bg-muted/40" />
              <div className="h-8 w-16 animate-pulse rounded bg-muted/40" />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-end gap-2 pt-2">
        <div className="h-9 w-20 animate-pulse rounded bg-muted/20" />
        <div className="h-4 w-24 animate-pulse rounded bg-muted/20" />
        <div className="h-9 w-20 animate-pulse rounded bg-muted/20" />
      </div>
    </div>
  )
}
