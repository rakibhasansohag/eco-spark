"use client"

import { useQuery } from "@tanstack/react-query"
import { getIdeaList } from "@/services/idea.services"
import { IIdea } from "@/types/idea.types"
import { Quote } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { BeamHoverCard } from "@/components/shared/interactive/BeamHoverCard"

export function TestimonialsSection() {
  const params = { limit: "3", sortBy: "createdAt", sortOrder: "asc" }
  
  const { data } = useQuery({
    queryKey: ["public-ideas", params],
    queryFn: () => getIdeaList(params),
  })

  const ideas = data?.data ?? []

  if (ideas.length === 0) return null

  return (
    <section className="space-y-8 py-10 rounded-2xl bg-muted/40 px-6 sm:px-12 items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Top High-Impact Projects</h2>
        <p className="mt-2 text-base text-muted-foreground max-w-2xl mx-auto">
          Hear from our community members and see the most loved sustainability initiatives that are creating real change.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mx-auto">
        {ideas.map((idea: IIdea) => {
          // type override to grab nested details if present in backend query
          const authorName = idea.author?.name || "Anonymous Catalyst"
          const categoryName = idea.category?.name || "General"

          return (
            <BeamHoverCard 
              key={idea.id} 
              className={cn(
                "h-full flex flex-col rounded-2xl border bg-card shadow-sm",
                "transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              )}
              style={{ height: '100%' }}
            >
              <Link 
                href={`/ideas/${idea.id}`}
                className="relative flex h-full flex-col p-6"
              >
                <Quote className="absolute right-6 top-6 size-12 text-primary/10" />
                <div className="mb-4 relative z-10">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider">
                    {categoryName}
                  </span>
                </div>
                <h3 className="mb-3 text-lg font-bold leading-tight relative z-10">{idea.title}</h3>
                <p className="line-clamp-4 text-sm text-muted-foreground flex-1 italic relative z-10">
                  &quot;{idea.problemStatement}&quot;
                </p>
                
                <div className="mt-6 flex flex-col pt-4 relative z-10">
                  <p className="text-sm font-semibold text-foreground/90">{authorName}</p>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5">Top Contributor</p>
                </div>
              </Link>
            </BeamHoverCard>
          )
        })}
      </div>
    </section>
  )
}
