import { getIdeaById } from "@/services/idea.services"
import { getVoteCounts } from "@/services/vote.services"
import { getCommentList } from "@/services/comment.services"
import { checkIdeaAccess } from "@/services/ideaAccess.services"
import { getAccessToken } from "@/lib/tokenUtils"
import { decodeAccessToken } from "@/lib/jwtUtils"
import { Badge } from "@/components/ui/badge"
import { BackLink } from "@/components/shared/BackLink"
import { IdeaVoteSection } from "@/components/modules/Idea/IdeaVoteSection"
import { IdeaCommentSection } from "@/components/modules/Idea/IdeaCommentSection"
import { IdeaBuyButton } from "@/components/modules/Idea/IdeaBuyButton"
import { humanizeStatus, formatDate } from "@/lib/formatUtils"

export default async function IdeaDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [ideaResult, accessToken] = await Promise.all([getIdeaById(id), getAccessToken()])

  const idea = ideaResult.data
  const decoded = decodeAccessToken(accessToken)
  const isLoggedIn = !!decoded
  const currentUserId = decoded?.userId
  const userRole = decoded?.role

  // Fetch vote counts and comments (server-side for SSR)
  const [voteResult, commentsResult] = await Promise.allSettled([
    isLoggedIn ? getVoteCounts(id) : Promise.resolve(null),
    getCommentList({ ideaId: id, limit: "30" }),
  ])

  const voteData = voteResult.status === "fulfilled" ? voteResult.value?.data ?? null : null
  const initialComments =
    commentsResult.status === "fulfilled" ? (commentsResult.value?.data ?? []) : []

  // Check paid access
  let hasAccess = false
  if (idea.isPaid && isLoggedIn) {
    const accessResult = await checkIdeaAccess(id).catch(() => ({ data: { hasAccess: false } }))
    hasAccess = accessResult.data.hasAccess
  }

  const contentLocked = idea.isPaid && !hasAccess

  return (
    <main className="container mx-auto px-4 py-10 md:px-6">
      <BackLink href="/ideas" label="All Ideas" />

      <article className="mt-4 rounded-lg border bg-card p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{humanizeStatus(idea.status)}</Badge>
          {idea.isPaid ? (
            <Badge variant="outline">Paid</Badge>
          ) : (
            <Badge variant="outline">Free</Badge>
          )}
          <span className="text-xs text-muted-foreground">{formatDate(idea.createdAt)}</span>
        </div>

        <h1 className="mt-3 text-2xl font-bold tracking-tight">{idea.title}</h1>

        {idea.rejectionFeedback ? (
          <div className="mt-3 rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3">
            <p className="text-sm font-medium text-destructive">Rejection feedback</p>
            <p className="mt-1 text-sm text-muted-foreground">{idea.rejectionFeedback}</p>
          </div>
        ) : null}

        <div className="mt-6 space-y-5">
          <div>
            <h2 className="text-base font-semibold">Problem Statement</h2>
            <p className="mt-1 text-sm text-muted-foreground">{idea.problemStatement}</p>
          </div>

          {contentLocked ? (
            <IdeaBuyButton
              ideaId={id}
              price={idea.price}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          ) : (
            <>
              {idea.proposedSolution ? (
                <div>
                  <h2 className="text-base font-semibold">Proposed Solution</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{idea.proposedSolution}</p>
                </div>
              ) : null}
              {idea.description ? (
                <div>
                  <h2 className="text-base font-semibold">Description</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{idea.description}</p>
                </div>
              ) : null}
            </>
          )}
        </div>
      </article>

      <IdeaVoteSection ideaId={id} initialVotes={voteData} isLoggedIn={isLoggedIn} />

      <IdeaCommentSection
        ideaId={id}
        initialComments={initialComments}
        isLoggedIn={isLoggedIn}
        currentUserId={currentUserId}
      />
    </main>
  )
}
