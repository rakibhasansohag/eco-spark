interface FormSkeletonProps {
  fields?: number
}

export function FormSkeleton({ fields = 4 }: FormSkeletonProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-5 rounded-lg border bg-card p-6">
      <div className="h-7 w-40 animate-pulse rounded-md bg-muted" />
      <div className="space-y-5">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-9 animate-pulse rounded-md bg-muted" />
          </div>
        ))}
      </div>
      <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />
    </div>
  )
}
