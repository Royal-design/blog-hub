import { useMutation } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { motion } from "framer-motion"
import { Bookmark, MessageCircle, ThumbsUp } from "lucide-react"
import * as React from "react"
import { Link } from "react-router"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"
import { bookmarkService } from "@/services/bookmark.service"
import { likeService } from "@/services/like.service"
import type { Post } from "@/types/post"
import { getErrorMessage } from "@/utils/error"
import { getReadingTime } from "@/utils/reading-time"

type PostCardProps = {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = React.useState(false)
  const [isBookmarked, setIsBookmarked] = React.useState(false)
  const authorName =
    post.author.name ??
    `${post.author.first_name} ${post.author.last_name}`.trim()
  const date = post.published_at ?? post.created_at

  const likeMutation = useMutation({
    mutationFn: () =>
      isLiked ? likeService.unlikePost(post.id) : likeService.likePost(post.id),
    onSuccess: () => {
      setIsLiked((current) => !current)
      toast.success(isLiked ? "Post unliked." : "Post liked.")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const bookmarkMutation = useMutation({
    mutationFn: () =>
      isBookmarked
        ? bookmarkService.removeBookmark(post.id)
        : bookmarkService.bookmarkPost(post.id),
    onSuccess: () => {
      setIsBookmarked((current) => !current)
      toast.success(isBookmarked ? "Bookmark removed." : "Post bookmarked.")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  return (
    <motion.article
      className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-colors hover:border-primary/40"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/posts/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {post.cover_image ? (
            <img
              src={post.cover_image}
              alt=""
              className="size-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="size-full bg-[linear-gradient(135deg,var(--primary),var(--accent))]" />
          )}
          <span className="absolute left-3 top-3 rounded-md bg-background/85 px-2.5 py-1 text-xs font-medium backdrop-blur">
            {post.category.name}
          </span>
        </div>
      </Link>
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {post.author.avatar ? (
            <img
              src={post.author.avatar}
              alt=""
              className="size-6 rounded-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="grid size-6 place-items-center rounded-full bg-primary/15 text-[10px] font-semibold text-primary">
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}
          <span>{authorName}</span>
          <span aria-hidden>•</span>
          <time dateTime={date}>
            {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </time>
        </div>
        <div>
          <Link to={`/posts/${post.slug}`}>
            <h2 className="line-clamp-2 text-lg font-semibold leading-tight">
              {post.title}
            </h2>
          </Link>
          {post.excerpt ? (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {post.excerpt}
            </p>
          ) : null}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{getReadingTime(post.content)}</span>
          <div className="flex items-center gap-1">
            <Button
              size="icon-sm"
              variant={isLiked ? "secondary" : "ghost"}
              aria-label={isLiked ? "Unlike post" : "Like post"}
              aria-pressed={isLiked}
              disabled={likeMutation.isPending}
              onClick={() => likeMutation.mutate()}
            >
              <ThumbsUp className={isLiked ? "fill-current" : undefined} />
            </Button>
            <Link
              to={`/posts/${post.slug}`}
              className={cn(buttonVariants({ size: "icon-sm", variant: "ghost" }))}
              aria-label="View comments"
            >
              <MessageCircle />
            </Link>
            <Button
              size="icon-sm"
              variant={isBookmarked ? "secondary" : "ghost"}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark post"}
              aria-pressed={isBookmarked}
              disabled={bookmarkMutation.isPending}
              onClick={() => bookmarkMutation.mutate()}
            >
              <Bookmark
                className={isBookmarked ? "fill-current" : undefined}
              />
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
