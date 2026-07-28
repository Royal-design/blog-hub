import * as React from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { AnimatePresence, motion } from "framer-motion"
import { CornerDownRight, Edit2, Reply, Send, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { commentService } from "@/services/comment.service"
import { useAuthStore } from "@/store/auth.store"
import type { Comment } from "@/types/comment"
import { getInitials } from "@/utils/initials"

export interface CommentItemProps {
  comment: Comment
  postId: string
  allComments: Comment[]
}

export function CommentItem({ comment, postId, allComments }: CommentItemProps) {
  const queryClient = useQueryClient()
  const currentUser = useAuthStore((state) => state.user)

  const [isReplying, setIsReplying] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [replyText, setReplyText] = React.useState("")
  const [editText, setEditText] = React.useState(comment.content)

  const isOwner = currentUser?.id === comment.user_id

  // Find child replies for nested comment support
  const replies = allComments.filter((item) => item.parent_id === comment.id)

  // Create Reply Mutation
  const replyMutation = useMutation({
    mutationFn: (content: string) =>
      commentService.createComment({
        content,
        post_id: postId,
        parent_id: comment.id,
      }),
    onSuccess: (newReply) => {
      queryClient.setQueryData<Comment[]>(["comments", postId], (old = []) => [
        ...old,
        newReply,
      ])
      setReplyText("")
      setIsReplying(false)
    },
  })

  // Edit Comment Mutation
  const editMutation = useMutation({
    mutationFn: (content: string) =>
      commentService.updateComment(comment.id, { content }),
    onSuccess: (updated) => {
      queryClient.setQueryData<Comment[]>(["comments", postId], (old = []) =>
        old.map((c) => (c.id === comment.id ? { ...c, content: updated.content } : c))
      )
      setIsEditing(false)
    },
  })

  // Delete Comment Mutation
  const deleteMutation = useMutation({
    mutationFn: () => commentService.deleteComment(comment.id),
    onSuccess: () => {
      queryClient.setQueryData<Comment[]>(["comments", postId], (old = []) =>
        old.filter((c) => c.id !== comment.id)
      )
    },
  })

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return
    replyMutation.mutate(replyText.trim())
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editText.trim()) return
    editMutation.mutate(editText.trim())
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteMutation.mutate()
    }
  }

  const authorName = comment.user
    ? `${comment.user.first_name} ${comment.user.last_name}`.trim() || comment.user.username
    : "User"

  return (
    <div className="space-y-3">
      <div className="group relative rounded-2xl border border-slate-200/70 dark:border-slate-800/70 p-4 bg-white/60 dark:bg-slate-900/60 shadow-xs space-y-3 transition-all">
        {/* Comment Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            {comment.user?.avatar ? (
              <img
                src={comment.user.avatar}
                alt=""
                className="size-7 rounded-full object-cover"
              />
            ) : (
              <div className="grid size-7 place-items-center rounded-full bg-primary/10 text-primary font-extrabold text-[10px] tracking-wider">
                {getInitials(
                  `${comment.user?.first_name || ""} ${comment.user?.last_name || ""}`,
                  comment.user?.first_name,
                  comment.user?.last_name,
                  comment.user?.username
                )}
              </div>
            )}
            <div>
              <h4 className="text-xs font-extrabold text-foreground">{authorName}</h4>
              <p className="text-[10px] text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
            {currentUser && (
              <button
                type="button"
                onClick={() => setIsReplying((prev) => !prev)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                title="Reply"
              >
                <Reply className="size-3.5" />
                <span className="hidden sm:inline">Reply</span>
              </button>
            )}

            {isOwner && (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing((prev) => !prev)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition-colors cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-500/10 text-xs transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Comment Body or Edit Form */}
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="space-y-2 pt-1">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-background p-2.5 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/25"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => setIsEditing(false)}
                className="rounded-lg text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="xs"
                disabled={editMutation.isPending}
                className="rounded-lg font-bold text-xs"
              >
                Save
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            {comment.content}
          </p>
        )}

        {/* Reply Form */}
        <AnimatePresence>
          {isReplying && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleReplySubmit}
              className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800/80"
            >
              <div className="flex items-center gap-2">
                <CornerDownRight className="size-3.5 text-primary shrink-0" />
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${authorName}...`}
                  className="flex-1 h-9 rounded-xl border border-slate-300 dark:border-slate-700 bg-background px-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/25"
                />
                <Button
                  type="submit"
                  size="xs"
                  disabled={replyMutation.isPending || !replyText.trim()}
                  className="rounded-xl font-bold gap-1 shrink-0"
                >
                  <Send className="size-3" />
                  Reply
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Nested Replies */}
      {replies.length > 0 && (
        <div className="pl-4 sm:pl-8 space-y-3 border-l-2 border-slate-200/60 dark:border-slate-800/60 ml-3">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              allComments={allComments}
            />
          ))}
        </div>
      )}
    </div>
  )
}
