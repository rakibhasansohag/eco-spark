"use client"

import { useState } from "react"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import httpClient from "@/lib/axios/httpClient"

interface WatchlistButtonProps {
  ideaId: string
  isLoggedIn: boolean
}

export function WatchlistButton({ ideaId, isLoggedIn }: WatchlistButtonProps) {
  const qc = useQueryClient()

  // We could implement getWatchlist endpoint in frontend services, but let's just make direct API call here
  const { data: watchlists } = useQuery({
    queryKey: ["watchlist", ideaId],
    queryFn: async () => {
      if (!isLoggedIn) return []
      const res: any = await httpClient.get(`/watchlists`, { params: { ideaId } })
      return res.data?.data || []
    },
    enabled: isLoggedIn,
  })

  const userWatchlistRecord = watchlists && watchlists.length > 0 ? watchlists[0] : null
  const isWatchlisted = !!userWatchlistRecord

  const toggleMutation = useMutation({
    mutationFn: async () => {
      if (isWatchlisted) {
        return httpClient.delete(`/watchlists/${userWatchlistRecord.id}`)
      } else {
        return httpClient.post("/watchlists", { ideaId })
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["watchlist", ideaId] })
      toast.success(isWatchlisted ? "Removed from Watchlist" : "Added to Watchlist")
    },
    onError: () => {
      toast.error("Failed to update watchlist")
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
        toggleMutation.mutate()
      }}
      disabled={toggleMutation.isPending}
    >
      {isWatchlisted ? <BookmarkCheck className="size-3.5 text-primary" /> : <Bookmark className="size-3.5" />}
      <span>{isWatchlisted ? "Saved" : "Save"}</span>
    </Button>
  )
}
