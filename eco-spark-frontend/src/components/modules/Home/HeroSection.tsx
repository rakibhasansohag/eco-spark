import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-background to-muted/50 px-6 py-14 md:px-10">
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">
          Sustainable Innovation Platform
        </p>
        <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
          Turn Climate Challenges into Practical Ideas
        </h1>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          EcoSpark Hub helps members share actionable sustainability ideas,
          collaborate through comments and votes, and unlock premium knowledge
          through paid idea access.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Button asChild>
            <Link href="/ideas">Explore Ideas</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/member/dashboard/create-idea">Submit an Idea</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
