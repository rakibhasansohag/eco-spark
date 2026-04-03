"use client"

import { useState } from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { castOrSwitchVote, removeVote } from "@/services/vote.services"
import { IVoteCounts, VoteType } from "@/types/vote.types"

interface IdeaVoteSectionProps {
  ideaId: string
  initialVotes: IVoteCounts | null
  isLoggedIn: boolean
}

export function IdeaVoteSection({ ideaId, initialVotes, isLoggedIn }: IdeaVoteSectionProps) {
  const [votes, setVotes] = useState<IVoteCounts>(
    initialVotes ?? { upvotes: 0, downvotes: 0, userVote: null },
  )

  const castMutation = useMutation({
    mutationFn: (type: VoteType) => castOrSwitchVote({ ideaId, type }),
    onSuccess: (_, type) => {
      setVotes((prev) => {
        const wasVoted = prev.userVote === type
        if (wasVoted) return prev
        const oldVote = prev.userVote
        return {
          upvotes:
            type === "UPVOTE"
              ? prev.upvotes + 1
              : oldVote === "UPVOTE"
                ? prev.upvotes - 1
                : prev.upvotes,
          downvotes:
            type === "DOWNVOTE"
              ? prev.downvotes + 1
              : oldVote === "DOWNVOTE"
                ? prev.downvotes - 1
                : prev.downvotes,
          userVote: type,
        }
      })
    },
    onError: () => toast.error("Failed to cast vote"),
  })

  const removeMutation = useMutation({
    mutationFn: () => removeVote(ideaId),
    onSuccess: () => {
      setVotes((prev) => ({
        upvotes: prev.userVote === "UPVOTE" ? prev.upvotes - 1 : prev.upvotes,
        downvotes: prev.userVote === "DOWNVOTE" ? prev.downvotes - 1 : prev.downvotes,
        userVote: null,
      }))
    },
    onError: () => toast.error("Failed to remove vote"),
  })

  const handleVote = (type: VoteType) => {
    if (!isLoggedIn) {
      toast.error("Please log in to vote")
      return
    }
    if (votes.userVote === type) {
      removeMutation.mutate()
    } else {
      castMutation.mutate(type)
    }
  }

  const isPending = castMutation.isPending || removeMutation.isPending

  return (
    <div className="mt-6 flex items-center gap-3 rounded-lg border bg-card px-4 py-3">
      <span className="text-sm font-medium text-muted-foreground">Was this helpful?</span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-1.5",
            votes.userVote === "UPVOTE" && "border-primary bg-primary/10 text-primary",
          )}
          onClick={() => handleVote("UPVOTE")}
          disabled={isPending}
        >
          <ThumbsUp className="size-3.5" />
          <span>{votes.upvotes}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-1.5",
            votes.userVote === "DOWNVOTE" &&
              "border-destructive bg-destructive/10 text-destructive",
          )}
          onClick={() => handleVote("DOWNVOTE")}
          disabled={isPending}
        >
          <ThumbsDown className="size-3.5" />
          <span>{votes.downvotes}</span>
        </Button>
      </div>
      {!isLoggedIn ? (
        <span className="ml-auto text-xs text-muted-foreground">Log in to vote</span>
      ) : null}
    </div>
  )
}
