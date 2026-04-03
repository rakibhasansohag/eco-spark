interface TableSkeletonProps {
  rows?: number
}

export function TableSkeleton({ rows = 5 }: TableSkeletonProps) {
  return (
    <div className="space-y-3">
      <div className="h-9 w-full max-w-sm animate-pulse rounded-md bg-muted" />
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="h-10 animate-pulse bg-muted/60" />
        <div className="divide-y">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
