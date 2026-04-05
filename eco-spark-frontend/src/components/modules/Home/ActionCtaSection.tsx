import Link from "next/link"
import { Button } from "@/components/ui/button"

export function ActionCtaSection() {
  return (
    <section className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)] md:p-8">
      <div className="absolute -top-20 -right-20 size-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight">Ready to Contribute Sustainable Solutions?</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground md:text-base">
            Explore community-validated ideas or publish your own implementation roadmap and get
            meaningful feedback.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild className="h-10 rounded-xl px-5">
            <Link href="/ideas">Browse Ideas</Link>
          </Button>
          <Button asChild variant="secondary" className="h-10 rounded-xl px-5">
            <Link href="/member/dashboard/create-idea">Create an Idea</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
