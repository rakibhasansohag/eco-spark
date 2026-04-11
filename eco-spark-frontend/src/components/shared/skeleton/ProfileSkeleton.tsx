export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm">
        <div className="absolute inset-y-[-60%] left-[-35%] z-10 w-[52%] rotate-[20deg] bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-3xl animate-beam-skeleton" />
        
        <div className="relative z-20 space-y-3">
          <div className="h-3 w-32 animate-pulse rounded bg-muted/40" />
          <div className="h-9 w-48 animate-pulse rounded-md bg-muted/60" />
          <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-muted/40" />
          
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-lg border bg-background p-3">
                <div className="h-3 w-20 animate-pulse rounded bg-muted/40" />
                <div className="mt-2 h-6 w-16 animate-pulse rounded bg-muted/60" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid gap-5 xl:grid-cols-12 2xl:gap-6">
        {/* Left Column: Form Skeleton */}
        <div className="rounded-xl border bg-card p-6 shadow-sm xl:col-span-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="size-20 animate-pulse rounded-full bg-muted/40" />
               <div className="space-y-2">
                 <div className="h-4 w-32 animate-pulse rounded bg-muted/60" />
                 <div className="h-3 w-48 animate-pulse rounded bg-muted/40" />
               </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-24 animate-pulse rounded bg-muted/40" />
                  <div className="h-10 animate-pulse rounded-md bg-muted/20" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-muted/40" />
              <div className="h-24 animate-pulse rounded-md bg-muted/20" />
            </div>
            <div className="flex justify-end">
              <div className="h-10 w-32 animate-pulse rounded-md bg-primary/20" />
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Skeleton */}
        <aside className="space-y-3 xl:col-span-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="size-4 animate-pulse rounded bg-muted/60" />
                <div className="h-4 w-32 animate-pulse rounded bg-muted/60" />
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-muted/40" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-muted/40" />
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  )
}
