export default function RootLoading() {
  return (
    <main className="container mx-auto px-4 py-10 md:px-6">
      <div className="h-56 animate-pulse rounded-2xl bg-muted" />
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </main>
  )
}
