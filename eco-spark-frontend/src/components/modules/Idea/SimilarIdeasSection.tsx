"use client"

import { useQuery } from "@tanstack/react-query"
import { getSimilarIdeas } from "@/services/idea.services"
import { IdeaCard } from "@/components/shared/card/IdeaCard"

export function SimilarIdeasSection({ ideaId }: { ideaId: string }) {
  const { data: similarIdeas, isLoading } = useQuery({
    queryKey: ["similar-ideas", ideaId],
    queryFn: async () => {
      const res = await getSimilarIdeas(ideaId)
      return res.data || []
    },
  })

  // We can skip showing the section if no similar ideas found
  if (!isLoading && (!similarIdeas || similarIdeas.length === 0)) {
    return null
  }

  return (
    <div className="mt-12 space-y-6 border-t pt-8">
      <h3 className="text-2xl font-bold">Similar Ideas</h3>
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-xl border bg-muted/30 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {similarIdeas?.map((idea: any) => (
            <IdeaCard key={idea.id} idea={idea} href={`/ideas/${idea.id}`} />
          ))}
        </div>
      )}
    </div>
  )
}
