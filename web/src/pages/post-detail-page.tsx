import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { Bookmark, Share2, ThumbsUp } from "lucide-react"
import { useParams } from "react-router"

import { ErrorState } from "@/components/common/error-state"
import { PageLoader } from "@/components/loaders/page-loader"
import { Button } from "@/components/ui/button"
import { postService } from "@/services/post.service"
import { getErrorMessage } from "@/utils/error"
import { getReadingTime } from "@/utils/reading-time"

export function PostDetailPage() {
  const { slug } = useParams()
  const postQuery = useQuery({
    queryKey: ["post", slug],
    queryFn: () => postService.getPostBySlug(slug ?? ""),
    enabled: Boolean(slug),
    staleTime: 60_000,
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

  return (
    <article className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_220px]">
      <div className="min-w-0">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">{post.category.name}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-6xl">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>
              {post.author.first_name} {post.author.last_name}
            </span>
            <span aria-hidden>•</span>
            <time dateTime={publishedDate}>
              {format(new Date(publishedDate), "MMM d, yyyy")}
            </time>
            <span aria-hidden>•</span>
            <span>{getReadingTime(post.content)}</span>
          </div>
        </div>
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt=""
            className="mb-8 aspect-[16/9] w-full rounded-lg object-cover"
          />
        ) : null}
        <div className="max-w-none whitespace-pre-wrap text-base leading-8 text-foreground">
          {post.content}
        </div>
      </div>
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-3">
          <Button className="w-full justify-start" variant="outline">
            <ThumbsUp data-icon="inline-start" />
            Like
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <Bookmark data-icon="inline-start" />
            Bookmark
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <Share2 data-icon="inline-start" />
            Share
          </Button>
        </div>
      </aside>
    </article>
  )
}
