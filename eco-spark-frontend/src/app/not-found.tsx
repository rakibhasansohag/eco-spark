import Link from "next/link"
import { Home, Leaf, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="max-w-md">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
          <Leaf className="size-8 text-primary" aria-hidden />
        </div>

        <p className="mt-5 text-7xl font-extrabold tracking-tight text-primary/20">404</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you are looking for doesn't exist or may have been moved.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="gap-2">
            <Link href="/">
              <Home className="size-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/ideas">
              <Search className="size-4" />
              Browse Ideas
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
