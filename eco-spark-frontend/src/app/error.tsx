"use client"

export default function GlobalError() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="rounded-lg border bg-background p-6 text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please try again or refresh the page.
        </p>
      </div>
    </main>
  )
}
