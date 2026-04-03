"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/lib/formatUtils"
import { createComment, deleteComment } from "@/services/comment.services"
import { IComment } from "@/types/comment.types"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { Trash2 } from "lucide-react"

interface IdeaCommentSectionProps {
  ideaId: string
  initialComments: IComment[]
  isLoggedIn: boolean
  currentUserId?: string
}

function CommentItem({
  comment,
  canDelete,
  onDeleted,
}: {
  comment: IComment
  canDelete: boolean
  onDeleted: (id: string) => void
}) {
  const handleDelete = async () => {
    await deleteComment(comment.id)
    onDeleted(comment.id)
  }

  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium uppercase">
        {comment.authorId.slice(0, 2)}
      </div>
      <div className="flex-1 rounded-lg border bg-card p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
          {canDelete ? (
            <ConfirmDialog
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="-mr-1 size-6 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3" />
                </Button>
              }
              title="Delete Comment"
              description="This will permanently delete your comment."
              confirmLabel="Delete"
              onConfirm={handleDelete}
            />
          ) : null}
        </div>
        <p className="mt-1 text-sm">{comment.content}</p>
      </div>
    </div>
  )
}

export function IdeaCommentSection({
  ideaId,
  initialComments,
  isLoggedIn,
  currentUserId,
}: IdeaCommentSectionProps) {
  const [comments, setComments] = useState<IComment[]>(initialComments)
  const [content, setContent] = useState("")
  const qc = useQueryClient()

  const addMutation = useMutation({
    mutationFn: () => createComment({ content, ideaId }),
    onSuccess: (result) => {
      setComments((prev) => [result.data, ...prev])
      setContent("")
      toast.success("Comment added")
      qc.invalidateQueries({ queryKey: ["idea-comments", ideaId] })
    },
    onError: () => toast.error("Failed to add comment"),
  })

  const handleDelete = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id))
    toast.success("Comment deleted")
  }

  return (
    <section className="mt-6 space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="size-4" />
        <h2 className="text-base font-semibold">
          Comments{comments.length > 0 ? ` (${comments.length})` : ""}
        </h2>
      </div>

      {isLoggedIn ? (
        <div className="flex gap-3">
          <Textarea
            placeholder="Share your thoughts…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <Button
            size="icon"
            className="mt-1 shrink-0"
            onClick={() => addMutation.mutate()}
            disabled={addMutation.isPending || content.trim().length === 0}
            aria-label="Post comment"
          >
            <Send className="size-4" />
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          <a href="/login" className="font-medium text-primary hover:underline">
            Log in
          </a>{" "}
          to leave a comment.
        </p>
      )}

      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              canDelete={isLoggedIn && comment.authorId === currentUserId}
              onDeleted={handleDelete}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No comments yet. Be the first to share.</p>
      )}
    </section>
  )
}
