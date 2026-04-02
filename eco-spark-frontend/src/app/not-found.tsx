import Link from "next/link"

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="rounded-lg border bg-background p-6 text-center">
        <h1 className="text-xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
        >
          Go to home
        </Link>
      </div>
    </main>
  )
}
