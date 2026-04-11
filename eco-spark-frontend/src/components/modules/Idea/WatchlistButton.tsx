"use client"

import { Bookmark, BookmarkCheck } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { getWatchlist, toggleWatchlistAction } from "@/services/watchlist.services"

interface WatchlistButtonProps {
  ideaId: string
  isLoggedIn: boolean
  userRole?: string
}

export function WatchlistButton({ ideaId, isLoggedIn, userRole }: WatchlistButtonProps) {
  const qc = useQueryClient()
  const isAdmin = userRole === "ADMIN"

  const { data: watchlists } = useQuery({
    queryKey: ["watchlist", ideaId],
    queryFn: async () => {
      if (!isLoggedIn || isAdmin) return []
      const res = await getWatchlist(ideaId)
      return res.data
    },
    enabled: isLoggedIn && !isAdmin,
  })

  const userWatchlistRecord = watchlists && watchlists.length > 0 ? watchlists[0] : null
  const isWatchlisted = !!userWatchlistRecord

  const toggleMutation = useMutation({
    mutationFn: async () => {
      if (isAdmin) return
      const res = await toggleWatchlistAction(ideaId, isWatchlisted, userWatchlistRecord?.id)
      if (!res.success) throw new Error(res.message)
      return res
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["watchlist", ideaId] })
      qc.invalidateQueries({ queryKey: ["my-watchlist-all"] })
      toast.success(isWatchlisted ? "Removed from Watchlist" : "Added to Watchlist")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update watchlist")
    }
  })

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5 h-8"
      onClick={() => {
        if (!isLoggedIn) {
          toast.error("Please log in to save ideas.")
          return
        }
        if (isAdmin) {
          toast.error("Admins cannot save ideas to watchlist.")
          return
        }
        toggleMutation.mutate()
      }}
      disabled={toggleMutation.isPending || isAdmin}
      title={isAdmin ? "Admins cannot save ideas" : ""}
    >
      {isWatchlisted ? <BookmarkCheck className="size-3.5 text-primary" /> : <Bookmark className="size-3.5" />}
      <span>{isWatchlisted ? "Saved" : "Save"}</span>
    </Button>
  )
}
