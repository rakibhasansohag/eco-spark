import Link from "next/link"
import { ShieldAlert } from "lucide-react"
import { getAuthErrorMessage } from "@/lib/authErrorMessages"
import { Button } from "@/components/ui/button"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolved = await searchParams
  const raw = resolved.error
  const errorCode = Array.isArray(raw) ? raw[0] : raw
  const message = getAuthErrorMessage(errorCode) ?? "Sign-in could not be completed."

  return (
    <main className="container mx-auto flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-8">
      <section className="w-full max-w-md rounded-xl border bg-card p-6 text-center shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="h-6 w-6 text-destructive" />
        </div>
        <h1 className="mt-4 text-lg font-semibold">Sign-in issue detected</h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          If this keeps happening, contact support and include the error code.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <Button asChild>
            <Link href="/login">Try sign-in again</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
