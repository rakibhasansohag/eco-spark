import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-background via-primary/5 to-cyan-50/35 px-6 py-14 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)] md:px-10 md:py-16">
      <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-28 left-0 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-primary">
          Sustainable Innovation Platform
        </p>
        <h1 className="mt-3 text-4xl leading-tight font-bold tracking-tight md:text-5xl">
          Turn Climate Challenges into Practical Ideas
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
          EcoSpark Hub helps members share actionable sustainability ideas,
          collaborate through comments and votes, and unlock premium knowledge
          through paid idea access.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild className="h-10 rounded-xl px-5">
            <Link href="/ideas">Explore Ideas</Link>
          </Button>
          <Button variant="outline" asChild className="h-10 rounded-xl border-slate-300 bg-slate-100 px-5 text-slate-800 hover:bg-slate-200">
            <Link href="/member/dashboard/create-idea">Submit an Idea</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
