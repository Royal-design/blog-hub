import * as React from "react"

import { formatDistanceToNow } from "date-fns"
import { motion } from "framer-motion"
import { Image, MessageCircle, Share2, Tag as TagIcon } from "lucide-react"
import { Link } from "react-router"
import { toast } from "sonner"

import { BookmarkButton } from "@/components/common/bookmark-button"
import { LikeButton } from "@/components/common/like-button"
import { OptimizedImage } from "@/components/common/optimized-image"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"
import type { Post } from "@/types/post"
import { getInitials } from "@/utils/initials"
import { getReadingTime } from "@/utils/reading-time"

export interface PostCardProps {
  post: Post
  layout?: "grid" | "list"
}

export function PostCard({ post, layout = "grid" }: PostCardProps) {
  const authorName =
    post.author?.name ||
    `${post.author?.first_name || ""} ${post.author?.last_name || ""}`.trim() ||
    post.author?.username ||
    "Anonymous"
  const initials = getInitials(
    post.author?.name,
    post.author?.first_name,
    post.author?.last_name,
    post.author?.username
  )
  const date = post.published_at ?? post.created_at

  const galleryImages = React.useMemo(
    () =>
      post.images && post.images.length > 0
        ? [...post.images].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
        : [],
    [post.images],
  )

  const hasGallery = galleryImages.length > 0
  const [galleryIndex, setGalleryIndex] = React.useState(0)
  const galleryRef = React.useRef<HTMLDivElement>(null)

  const handleGalleryScroll = React.useCallback(() => {
    if (galleryRef.current) {
      const index = Math.round(
        galleryRef.current.scrollLeft / galleryRef.current.clientWidth,
      )
      setGalleryIndex(Math.min(index, galleryImages.length - 1))
    }
  }, [galleryImages.length])

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/posts/${post.slug}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard!")
    }
  }

  if (layout === "list") {
    return (
      <motion.article
        whileHover={{ y: -2 }}
        className="group flex flex-col sm:flex-row gap-5 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-card shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200"
      >
        <div className="flex-1 space-y-3">
          {/* Author info row */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {post.author?.avatar ? (
              <OptimizedImage
                src={post.author.avatar}
                alt=""
                className="size-6 shrink-0 rounded-full ring-1 ring-primary/20"
                fallback={
                  <span className="grid size-full place-items-center rounded-full bg-primary/15 text-[10px] font-extrabold tracking-wider text-primary">
                    {initials}
                  </span>
                }
              />
            ) : (
              <div className="grid size-6 place-items-center rounded-full bg-primary/15 text-[10px] font-extrabold text-primary shrink-0 tracking-wider">
                {initials}
              </div>
            )}
            <span className="font-bold text-foreground truncate">{authorName}</span>
            {post.author?.username && (
              <span className="text-muted-foreground/70 hidden sm:inline">@{post.author.username}</span>
            )}
            <span aria-hidden>•</span>
            <time dateTime={date} className="shrink-0">
              {formatDistanceToNow(new Date(date), { addSuffix: true })}
            </time>
          </div>

          {/* Title & Excerpt */}
          <div>
            <Link to={`/posts/${post.slug}`}>
              <h2 className="line-clamp-2 text-base sm:text-lg font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors leading-snug">
                {post.title}
              </h2>
            </Link>
            {post.excerpt && (
              <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Category & Tags */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary border border-primary/20">
              {post.category.name}
            </span>
            {post.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300"
              >
                <TagIcon className="size-2.5 text-primary" />
                {tag.name}
              </span>
            ))}
          </div>

          {/* Action bar */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <span className="font-semibold">{getReadingTime(post.content)}</span>
            <div className="flex items-center gap-1">
              <LikeButton postId={post.id} initialCount={post.like_count ?? 0} size="sm" showCount={true} />
              <Link
                to={`/posts/${post.slug}`}
                className={cn(buttonVariants({ size: "icon-sm", variant: "ghost" }), "rounded-xl gap-1 text-xs font-semibold")}
                aria-label="View comments"
              >
                <MessageCircle className="size-4" />
                {(post.comment_count ?? 0) > 0 && <span>{post.comment_count}</span>}
              </Link>
              <BookmarkButton postId={post.id} size="sm" />
              <button
                type="button"
                onClick={handleShare}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                title="Share article link"
              >
                <Share2 className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Gallery / Cover image side thumbnail */}
        {(hasGallery || post.cover_image) && (
          <Link to={`/posts/${post.slug}`} className="shrink-0">
            <div className="relative aspect-[16/10] sm:w-44 rounded-xl overflow-hidden bg-muted">
              {hasGallery ? (
                <>
                  <div
                    ref={galleryRef}
                    onScroll={handleGalleryScroll}
                    className="flex h-full overflow-x-auto snap-x snap-mandatory scrollbar-none"
                  >
                    {galleryImages.map((img) => (
                      <div
                        key={img.id}
                        className="snap-start shrink-0 w-full h-full"
                      >
                        <OptimizedImage
                          src={img.image_url}
                          alt={img.alt_text}
                          sizes="(max-width: 640px) 92vw, 26rem"
                        />
                      </div>
                    ))}
                  </div>
                  {galleryImages.length > 1 && (
                    <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                      <Image className="size-2.5" />
                      {galleryIndex + 1}/{galleryImages.length}
                    </div>
                  )}
                </>
              ) : (
                <OptimizedImage
                  src={post.cover_image}
                  alt=""
                  sizes="(max-width: 640px) 92vw, 11rem"
                  imgClassName="transition duration-300 group-hover:scale-105"
                />
              )}
            </div>
          </Link>
        )}
      </motion.article>
    )
  }

  return (
    <motion.article
      className="group overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-card shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md flex flex-col justify-between"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/posts/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {hasGallery ? (
            <>
              <div
                ref={galleryRef}
                onScroll={handleGalleryScroll}
                className="flex h-full overflow-x-auto snap-x snap-mandatory scrollbar-none"
              >
                {galleryImages.map((img) => (
                  <div
                    key={img.id}
                    className="snap-start shrink-0 w-full h-full"
                  >
                    <OptimizedImage
                      src={img.image_url}
                      alt={img.alt_text}
                      sizes="(max-width: 640px) 92vw, 26rem"
                    />
                  </div>
                ))}
              </div>
              {galleryImages.length > 1 && (
                <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
                  <Image className="size-3" />
                  {galleryIndex + 1}/{galleryImages.length}
                </div>
              )}
            </>
          ) : post.cover_image ? (
            <OptimizedImage
              src={post.cover_image}
              alt=""
              sizes="(max-width: 640px) 92vw, 26rem"
              imgClassName="transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="size-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-sky-500" />
          )}
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[11px] font-bold tracking-tight text-foreground backdrop-blur border border-slate-200/50 dark:border-slate-700/50 shadow-xs">
            {post.category.name}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between space-y-4 p-5">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {post.author?.avatar ? (
              <OptimizedImage
                src={post.author.avatar}
                alt=""
                className="size-6 shrink-0 rounded-full ring-1 ring-primary/20"
                fallback={
                  <span className="grid size-full place-items-center rounded-full bg-primary/15 text-[10px] font-extrabold tracking-wider text-primary">
                    {initials}
                  </span>
                }
              />
            ) : (
              <div className="grid size-6 place-items-center rounded-full bg-primary/15 text-[10px] font-extrabold text-primary shrink-0 tracking-wider">
                {initials}
              </div>
            )}
            <span className="font-bold text-foreground truncate">{authorName}</span>
            <span aria-hidden>•</span>
            <time dateTime={date}>
              {formatDistanceToNow(new Date(date), { addSuffix: true })}
            </time>
          </div>

          <div>
            <Link to={`/posts/${post.slug}`}>
              <h2 className="line-clamp-2 text-base font-extrabold leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors">
                {post.title}
              </h2>
            </Link>
            {post.excerpt && (
              <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300"
                >
                  <TagIcon className="size-2.5 text-primary" />
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <span className="font-semibold">{getReadingTime(post.content)}</span>
          <div className="flex items-center gap-1">
            <LikeButton postId={post.id} initialCount={post.like_count ?? 0} size="sm" showCount={true} />
            <Link
              to={`/posts/${post.slug}`}
              className={cn(buttonVariants({ size: "icon-sm", variant: "ghost" }), "rounded-xl gap-1 text-xs font-semibold")}
              aria-label="View comments"
            >
              <MessageCircle className="size-4" />
              {(post.comment_count ?? 0) > 0 && <span>{post.comment_count}</span>}
            </Link>
            <BookmarkButton postId={post.id} size="sm" />
            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
              title="Share article link"
            >
              <Share2 className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
