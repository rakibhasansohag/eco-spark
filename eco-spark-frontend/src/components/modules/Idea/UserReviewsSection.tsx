"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Star, TrendingUp, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/lib/formatUtils"
import { getReviews, createReviewAction } from "@/services/review.services"
import { IReview } from "@/types/review.types"

interface UserReviewsSectionProps {
  ideaId: string
  isLoggedIn: boolean
  canReview: boolean
}

// ─── Star Rating Component ──────────────────────────────────────────────────
function StarRating({
  value,
  onChange,
  max = 10,
  color = "text-yellow-400",
  label,
}: {
  value: number
  onChange?: (v: number) => void
  max?: number
  color?: string
  label?: string
}) {
  const [hovered, setHovered] = useState(0)
  const display = hovered || value

  return (
    <div className="space-y-1.5">
      {label && <p className="text-xs font-medium text-muted-foreground">{label}</p>}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => {
          const starVal = i + 1
          return (
            <button
              key={i}
              type="button"
              className={`transition-transform duration-100 ${onChange ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
              onMouseEnter={() => onChange && setHovered(starVal)}
              onMouseLeave={() => onChange && setHovered(0)}
              onClick={() => onChange?.(starVal)}
            >
              <Star
                className={`size-5 transition-colors ${starVal <= display ? `${color} fill-current` : "text-muted-foreground/30"}`}
              />
            </button>
          )
        })}
        <span className={`ml-2 text-sm font-semibold tabular-nums ${color}`}>
          {value}<span className="text-muted-foreground font-normal">/{max}</span>
        </span>
      </div>
    </div>
  )
}

// ─── Main Section ───────────────────────────────────────────────────────────
export function UserReviewsSection({ ideaId, isLoggedIn }: UserReviewsSectionProps) {
  const qc = useQueryClient()
  const [experience, setExperience] = useState("")
  const [rating, setRating] = useState<number>(0)
  const [effectiveness, setEffectiveness] = useState<number>(0)

  const { data } = useQuery({
    queryKey: ["idea-reviews", ideaId],
    queryFn: async () => {
      const res = await getReviews(ideaId)
      return res.data
    },
  })

  const reviews: IReview[] = data || []

  const addMutation = useMutation({
    mutationFn: async () => {
      if (rating === 0) throw new Error("Please select an overall rating")
      if (effectiveness === 0) throw new Error("Please select an effectiveness rating")
      if (experience.trim().length === 0) throw new Error("Please write your experience")
      const res = await createReviewAction({ ideaId, experience, rating, effectiveness })
      if (!res.success) throw new Error(res.message)
      return res
    },
    onSuccess: () => {
      toast.success("Review submitted successfully!")
      setExperience("")
      setRating(0)
      setEffectiveness(0)
      qc.invalidateQueries({ queryKey: ["idea-reviews", ideaId] })
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to submit review")
    },
  })

  // compute averages
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null
  const avgEffectiveness = reviews.length
    ? (reviews.reduce((s, r) => s + r.effectiveness, 0) / reviews.length).toFixed(1)
    : null

  return (
    <section className="mt-10 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 border-b pb-3">
        <div className="flex items-center gap-2">
          <Star className="size-5 fill-yellow-400 text-yellow-400" />
          <h2 className="text-lg font-bold tracking-tight">Community Experiences &amp; Reviews</h2>
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
        </span>
        {avgRating && (
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1 text-yellow-500 font-semibold">
              <Star className="size-3.5 fill-yellow-400" /> {avgRating}/10 avg
            </span>
            <span className="flex items-center gap-1 text-green-600 font-semibold">
              <TrendingUp className="size-3.5" /> {avgEffectiveness}/10 effectiveness
            </span>
          </div>
        )}
      </div>

      {/* Submit Form */}
      {!canReview ? (
        <div className="rounded-xl border border-dashed bg-muted/20 p-5 text-center">
          <p className="text-sm text-muted-foreground">
            {isLoggedIn 
              ? "You must unlock this premium idea to share your experience." 
              : "Log in and unlock this idea to share your experience."}
          </p>
        </div>
      ) : isLoggedIn ? (
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold">Share Your Experience</h3>

          <div className="grid gap-5 sm:grid-cols-2">
            <StarRating
              value={rating}
              onChange={setRating}
              label="Overall Rating (1–10)"
              color="text-yellow-400"
            />
            <StarRating
              value={effectiveness}
              onChange={setEffectiveness}
              label="Practical Effectiveness (1–10)"
              color="text-green-500"
            />
          </div>

          <Textarea
            placeholder="Share your practical experience applying this idea..."
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="resize-none"
            rows={3}
          />
          <Button
            onClick={() => addMutation.mutate()}
            disabled={addMutation.isPending || rating === 0 || effectiveness === 0 || experience.trim().length === 0}
            size="sm"
          >
            {addMutation.isPending ? "Submitting…" : "Post Review"}
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed bg-muted/20 p-5 text-center">
          <p className="text-sm text-muted-foreground">
            Log in to share your experience with this idea.
          </p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">No experiences shared yet. Be the first!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4 border-b pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                    <UserRound className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{review.user?.name ?? "Community Member"}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</div>
                  </div>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap items-center gap-5">
                <StarRating value={review.rating} label="Rating" color="text-yellow-400" />
                <StarRating value={review.effectiveness} label="Effectiveness" color="text-green-500" />
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed italic">
                &quot;{review.experience}&quot;
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
