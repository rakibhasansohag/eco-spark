"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Star, TrendingUp, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/lib/formatUtils"
import httpClient from "@/lib/axios/httpClient"

interface UserReviewsSectionProps {
  ideaId: string
  isLoggedIn: boolean
}

interface IReview {
  id: string
  rating: number
  effectiveness: number
  experience: string
  userId: string
  createdAt: string
  // User expand details might not be populated securely by default generic `genReview.js`, but we'll adapt.
  user?: { name?: string, image?: string }
}

export function UserReviewsSection({ ideaId, isLoggedIn }: UserReviewsSectionProps) {
  const qc = useQueryClient()
  const [experience, setExperience] = useState("")
  const [rating, setRating] = useState<number>(5)
  const [effectiveness, setEffectiveness] = useState<number>(5)

  const { data } = useQuery({
    queryKey: ["idea-reviews", ideaId],
    queryFn: async () => {
      // Direct call since we don't have review.services.ts generated 
      const res: any = await httpClient.get(`/reviews?ideaId=${ideaId}`)
      return res.data?.data || []
    },
  })

  const reviews: IReview[] = data || []

  const addMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ideaId,
        experience,
        rating,
        effectiveness,
      }
      return httpClient.post("/reviews", payload)
    },
    onSuccess: () => {
      toast.success("Review submitted successfully!")
      setExperience("")
      setRating(5)
      setEffectiveness(5)
      qc.invalidateQueries({ queryKey: ["idea-reviews", ideaId] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to submit review")
    },
  })

  return (
    <section className="mt-10 space-y-6">
      <div className="flex items-center gap-2 border-b pb-2">
        <Star className="size-5 fill-primary text-primary" />
        <h2 className="text-lg font-bold tracking-tight">Community Experiences & Reviews</h2>
        <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
          {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
        </span>
      </div>

      {isLoggedIn ? (
        <div className="rounded-lg border bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold">Share Your Experience</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Overall Rating (1-10)</label>
              <input 
                type="range" min="1" max="10" 
                value={rating} onChange={e => setRating(Number(e.target.value))} 
                className="w-full accent-primary" 
              />
              <div className="text-xs font-semibold">{rating} / 10</div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Practical Effectiveness (1-10)</label>
              <input 
                type="range" min="1" max="10" 
                value={effectiveness} onChange={e => setEffectiveness(Number(e.target.value))} 
                className="w-full accent-green-500" 
              />
              <div className="text-xs font-semibold text-green-600">{effectiveness} / 10</div>
            </div>
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
            disabled={addMutation.isPending || experience.trim().length === 0}
            size="sm"
          >
            {addMutation.isPending ? "Submitting..." : "Post Review"}
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed bg-muted/20 p-5 text-center">
          <p className="text-sm text-muted-foreground">Log in to share your experience with this idea.</p>
        </div>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">No experiences shared yet. Be the first!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between gap-4 border-b pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                    <UserRound className="size-4 text-muted-foreground" />
                  </div>
                  <div className="text-sm font-medium">Community Member</div>
                </div>
                <div className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</div>
              </div>
              
              <div className="mb-3 flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-1">
                  <Star className="size-3.5 text-primary" />
                  <span>Rating: {review.rating}/10</span>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="size-3.5" />
                  <span>Effectiveness: {review.effectiveness}/10</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed italic">&quot;{review.experience}&quot;</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
