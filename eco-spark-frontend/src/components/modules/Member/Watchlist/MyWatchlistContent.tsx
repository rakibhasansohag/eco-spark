"use client"

import { useQuery } from "@tanstack/react-query"
import { getWatchlist } from "@/services/watchlist.services"
import { IWatchlist } from "@/types/watchlist.types"
import { IIdea } from "@/types/idea.types"
import { IdeaCard } from "@/components/shared/card/IdeaCard"
import { EmptyState } from "@/components/shared/EmptyState"
import { Bookmark } from "lucide-react"

export default function MyWatchlistContent() {
  const { data, isLoading } = useQuery({
    queryKey: ["my-watchlist-all"],
    queryFn: async () => {
      const res = await getWatchlist("")  // empty ideaId = fetch all for current user
      return res.data as (IWatchlist & { idea?: IIdea })[]
    },
  })

  const items = data ?? []

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 rounded-lg border bg-muted/30 animate-pulse" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="No saved ideas yet"
        description="Browse ideas and click the bookmark icon to save them here."
        icon={Bookmark}
      />
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) =>
        item.idea ? (
          <IdeaCard key={item.id} idea={item.idea} href={`/ideas/${item.idea.id}`} />
        ) : null
      )}
    </div>
  )
}
