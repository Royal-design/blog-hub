import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { Bookmark, Heart, MessageSquare, Send, Share2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useParams } from "react-router"
import { toast } from "sonner"

import { ErrorState } from "@/components/common/error-state"
import { FormTextarea } from "@/components/forms/form-textarea"
import { PageLoader } from "@/components/loaders/page-loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { commentService } from "@/services/comment.service"
import { postService } from "@/services/post.service"
import { useAuthStore } from "@/store/auth.store"
import { getErrorMessage } from "@/utils/error"
import { getReadingTime } from "@/utils/reading-time"

interface CommentFormValues {
  content: string
}

export function PostDetailPage() {
  const { slug } = useParams()
  const user = useAuthStore((state) => state.user)
  const [liked, setLiked] = React.useState(false)
  const [bookmarked, setBookmarked] = React.useState(false)

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

  const form = useForm<CommentFormValues>({
    defaultValues: { content: "" },
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

  const handleCommentSubmit = (values: CommentFormValues) => {
    if (!values.content.trim()) return
    toast.success("Comment submitted.")
    form.reset()
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Story link copied to clipboard!")
    }
  }

  return (
    <article className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_240px]">
      <div className="min-w-0 space-y-8">
        {/* Header Metadata */}
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            {post.category.name}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl leading-tight">
            {post.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-medium text-muted-foreground pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt=""
                  className="size-8 rounded-full object-cover"
                />
              ) : (
                <div className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                  {post.author.first_name[0]}
                </div>
              )}
              <span className="font-bold text-foreground">
                {post.author.first_name} {post.author.last_name}
              </span>
            </div>
            <span aria-hidden>•</span>
            <time dateTime={publishedDate}>
              {format(new Date(publishedDate), "MMM d, yyyy")}
            </time>
            <span aria-hidden>•</span>
            <span>{getReadingTime(post.content)}</span>
          </div>
        </div>

        {/* Cover Image */}
        {post.cover_image ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md">
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

        {/* Comments Section */}
        <div className="pt-10 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">
              Comments ({commentsQuery.data?.length || 0})
            </h2>
          </div>

          {user && (
            <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
              <CardContent className="p-4 sm:p-6">
                <form
                  onSubmit={form.handleSubmit(handleCommentSubmit)}
                  className="space-y-3"
                >
                  <FormTextarea
                    control={form.control}
                    name="content"
                    label="Leave a comment"
                    placeholder="Share your thoughts on this story..."
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" className="rounded-xl font-bold gap-1.5">
                      <Send className="size-3.5" />
                      Post Comment
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {commentsQuery.data?.length ? (
            <div className="space-y-4">
              {commentsQuery.data.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-4 bg-slate-50/50 dark:bg-slate-900/50 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground">User {comment.user_id.slice(0, 6)}</span>
                    <span className="text-muted-foreground">{format(new Date(comment.created_at), "MMM d, yyyy")}</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No comments yet. Be the first to start the discussion!</p>
          )}
        </div>
      </div>

      {/* Side Toolbar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-3">
          <Button
            className={`w-full justify-start rounded-xl font-semibold gap-2 border-slate-300 dark:border-slate-700 ${
              liked ? "text-rose-600 border-rose-500 bg-rose-500/10" : ""
            }`}
            variant="outline"
            onClick={() => {
              setLiked((prev) => !prev)
              toast.success(liked ? "Unliked story" : "Liked story!")
            }}
          >
            <Heart className={`size-4 ${liked ? "fill-rose-600 text-rose-600" : ""}`} />
            {liked ? "Liked" : "Like"}
          </Button>

          <Button
            className={`w-full justify-start rounded-xl font-semibold gap-2 border-slate-300 dark:border-slate-700 ${
              bookmarked ? "text-primary border-primary bg-primary/10" : ""
            }`}
            variant="outline"
            onClick={() => {
              setBookmarked((prev) => !prev)
              toast.success(bookmarked ? "Removed bookmark" : "Story bookmarked!")
            }}
          >
            <Bookmark className={`size-4 ${bookmarked ? "fill-primary text-primary" : ""}`} />
            {bookmarked ? "Bookmarked" : "Bookmark"}
          </Button>

          <Button
            className="w-full justify-start rounded-xl font-semibold gap-2 border-slate-300 dark:border-slate-700"
            variant="outline"
            onClick={handleShare}
          >
            <Share2 className="size-4" />
            Share Story
          </Button>
        </div>
      </aside>
    </article>
  )
}
