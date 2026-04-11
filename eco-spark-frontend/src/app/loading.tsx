export default function RootLoading() {
  return (
    <main className="container mx-auto max-w-7xl px-4 py-10 md:px-6">
      {/* Hero Skeleton */}
      <div className="relative overflow-hidden rounded-xl border bg-card p-10 shadow-sm md:p-16">
        <div className="absolute inset-y-[-60%] left-[-35%] z-10 w-[52%] rotate-[20deg] bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-3xl animate-beam-skeleton" />
        <div className="relative z-20 space-y-4">
          <div className="h-4 w-48 animate-pulse rounded bg-muted/40" />
          <div className="h-10 w-full max-w-2xl animate-pulse rounded-md bg-muted/60" />
          <div className="h-10 w-3/4 max-w-xl animate-pulse rounded-md bg-muted/60 md:hidden" />
          <div className="h-4 w-full max-w-3xl animate-pulse rounded bg-muted/40" />
          <div className="h-4 w-2/3 max-w-2xl animate-pulse rounded bg-muted/40" />
          <div className="flex gap-3 pt-4">
            <div className="h-10 w-32 animate-pulse rounded-xl bg-primary/20" />
            <div className="h-10 w-32 animate-pulse rounded-xl bg-muted/40" />
          </div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm">
            <div className="absolute inset-y-[-60%] left-[-35%] z-10 w-[52%] rotate-[20deg] bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-2xl animate-beam-skeleton" />
            <div className="relative z-20 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="h-5 w-20 animate-pulse rounded bg-muted/40" />
                <div className="h-3 w-16 animate-pulse rounded bg-muted/30" />
              </div>
              <div className="h-5 w-full animate-pulse rounded bg-muted/60" />
              <div className="space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-muted/30" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-muted/30" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
