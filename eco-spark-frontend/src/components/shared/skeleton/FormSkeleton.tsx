interface FormSkeletonProps {
  fields?: number
}

export function FormSkeleton({ fields = 4 }: FormSkeletonProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-6 rounded-xl border bg-card p-6 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)] md:p-8">
      <div className="space-y-2">
        <div className="h-7 w-48 animate-pulse rounded-md bg-muted/40" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted/30" />
      </div>
      <div className="space-y-6">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-4 w-28 animate-pulse rounded bg-muted/50" />
            <div className="h-11 animate-pulse rounded-lg border bg-muted/20" />
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-2">
        <div className="h-11 w-36 animate-pulse rounded-lg bg-primary/20" />
      </div>
    </div>
  )
}
