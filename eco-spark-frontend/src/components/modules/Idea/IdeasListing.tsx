"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { getIdeaList } from "@/services/idea.services"
import { IIdea } from "@/types/idea.types"
import { SearchBar } from "@/components/shared/form/SearchBar"
import { Badge } from "@/components/ui/badge"

export default function IdeasListing({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const { data } = useQuery({
    queryKey: ["public-ideas-list", searchParams],
    queryFn: () => getIdeaList(searchParams),
  })

  const ideas = data?.data ?? []

  return (
    <section>
      <SearchBar searchParams={searchParams} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ideas.map((idea: IIdea) => (
          <Link
            key={idea.id}
            href={`/ideas/${idea.id}`}
            className="rounded-lg border bg-background p-4 transition hover:border-primary/30 hover:shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <Badge variant="secondary">{idea.status}</Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(idea.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h3 className="line-clamp-2 font-medium">{idea.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
              {idea.description ?? "Content preview locked"}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
