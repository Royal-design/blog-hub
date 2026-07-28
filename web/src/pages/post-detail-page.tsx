import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { ArrowLeft, MessageSquare, Send, Share2, Sparkles } from "lucide-react"
import { Link, useParams } from "react-router"
import { toast } from "sonner"

import { BookmarkButton } from "@/components/common/bookmark-button"
import { CommentItem } from "@/components/common/comment-item"
import { ErrorState } from "@/components/common/error-state"
import { FollowButton } from "@/components/common/follow-button"
import { LikeButton } from "@/components/common/like-button"
import { PageLoader } from "@/components/loaders/page-loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { commentService } from "@/services/comment.service"
import { postService } from "@/services/post.service"
import { useAuthStore } from "@/store/auth.store"
import type { Comment } from "@/types/comment"
import { getErrorMessage } from "@/utils/error"
import { getInitials } from "@/utils/initials"
import { getReadingTime } from "@/utils/reading-time"

export function PostDetailPage() {
  const { slug } = useParams()
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)

  const [commentText, setCommentText] = React.useState("")

  const postQuery = useQuery({
    queryKey: ["post", slug],
    queryFn: () => postService.getPostBySlug(slug ?? ""),
    enabled: Boolean(slug),
    staleTime: 60_000,
  })

  const commentsQuery = useQuery({
    queryKey: ["comments", postQuery.data?.id],
    queryFn: () => commentService.getPostComments(postQuery.data?.id ?? ""),
    enabled: Boolean(postQuery.data?.id),
  })

  const createCommentMutation = useMutation({
    mutationFn: (content: string) =>
      commentService.createComment({
        content,
        post_id: postQuery.data?.id ?? "",
      }),
    onSuccess: (newComment) => {
      queryClient.setQueryData<Comment[]>(
        ["comments", postQuery.data?.id],
        (old = []) => [...old, newComment]
      )
      setCommentText("")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  if (postQuery.isLoading) {
    return <PageLoader />
  }

  if (postQuery.isError || !postQuery.data) {
    return (
      <ErrorState
        description={getErrorMessage(postQuery.error)}
        onRetry={() => void postQuery.refetch()}
      />
    )
  }

  const post = postQuery.data
  const publishedDate = post.published_at ?? post.created_at
  const comments = commentsQuery.data ?? []
  // Top-level comments (where parent_id is null)
  const rootComments = comments.filter((c) => !c.parent_id)

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return
    createCommentMutation.mutate(commentText.trim())
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Story link copied to clipboard!")
    }
  }

  return (
    <article className="mx-auto max-w-4xl space-y-10 pb-16">
      {/* Top Back Link */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to stories
        </Link>
      </div>

      {/* Header Metadata */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            {post.category.name}
          </span>
          {post.tags?.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            >
              #{tag.name}
            </span>
          ))}
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl leading-tight">
          {post.title}
        </h1>

        {/* Author Card & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-b border-slate-200/80 dark:border-slate-800/80 py-4">
          <div className="flex items-center gap-3">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt=""
                className="size-11 rounded-full object-cover border-2 border-primary/20"
              />
            ) : (
              <div className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary font-extrabold text-sm tracking-wider">
                {getInitials(
                  post.author.name,
                  post.author.first_name,
                  post.author.last_name,
                  post.author.username
                )}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-foreground text-sm">
                  {post.author.first_name} {post.author.last_name}
                </span>
                <FollowButton userId={post.author_id} size="sm" />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <time dateTime={publishedDate}>
                  {format(new Date(publishedDate), "MMM d, yyyy")}
                </time>
                <span aria-hidden>•</span>
                <span>{getReadingTime(post.content)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LikeButton postId={post.id} size="default" />
            <BookmarkButton postId={post.id} size="default" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="rounded-xl font-bold gap-1.5 border-slate-300 dark:border-slate-700"
            >
              <Share2 className="size-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {post.cover_image ? (
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg">
          <img
            src={post.cover_image}
            alt=""
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      ) : null}

      {/* Post Body Content */}
      <div className="max-w-none whitespace-pre-wrap text-base sm:text-lg leading-8 sm:leading-9 text-slate-800 dark:text-slate-200 font-normal">
        {post.content}
      </div>

      {/* Interactive Bottom Actions Bar */}
      <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-4">
          <LikeButton postId={post.id} size="default" />
          <BookmarkButton postId={post.id} size="default" />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="rounded-xl font-bold gap-1.5 border-slate-300 dark:border-slate-700"
        >
          <Share2 className="size-4" />
          Share Story
        </Button>
      </div>

      {/* Comments Section */}
      <div className="pt-8 space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
            <MessageSquare className="size-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-foreground">
              Discussion ({comments.length})
            </h2>
            <p className="text-xs text-muted-foreground font-medium">
              Join the conversation and share your feedback.
            </p>
          </div>
        </div>

        {/* Comment Form */}
        {user ? (
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleCommentSubmit} className="space-y-3">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts on this story..."
                  rows={3}
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-background p-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/25 placeholder:text-muted-foreground"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={createCommentMutation.isPending || !commentText.trim()}
                    className="rounded-xl font-extrabold gap-1.5 shadow-md"
                  >
                    <Send className="size-3.5" />
                    Post Comment
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 text-center text-xs font-semibold text-muted-foreground">
            Please <Link to="/login" className="text-primary underline font-bold">sign in</Link> to post comments.
          </div>
        )}

        {/* Comments List */}
        {rootComments.length ? (
          <div className="space-y-4 pt-2">
            {rootComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={post.id}
                allComments={comments}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            <Sparkles className="size-8 text-slate-400 mx-auto mb-2 stroke-[1.5]" />
            <p className="text-sm font-bold text-foreground">No comments yet</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Be the first to share your perspectives on this story!
            </p>
          </div>
        )}
      </div>
    </article>
  )
}
