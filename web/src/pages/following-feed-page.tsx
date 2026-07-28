import { useQuery } from "@tanstack/react-query"
import { Users, UserPlus } from "lucide-react"
import { Link } from "react-router"

import { PostCard } from "@/components/cards/post-card"
import { EmptyState } from "@/components/common/empty-state"
import { ErrorState } from "@/components/common/error-state"
import { LeftSidebar } from "@/components/layout/left-sidebar"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { PostCardSkeleton } from "@/components/skeletons/post-card-skeleton"
import { usePosts } from "@/hooks/use-posts"
import { followService } from "@/services/follow.service"
import { useAuthStore } from "@/store/auth.store"
import { getErrorMessage } from "@/utils/error"

export function FollowingFeedPage() {
  const user = useAuthStore((state) => state.user)
  const postsQuery = usePosts()

  const followingQuery = useQuery({
    queryKey: ["following", user?.id],
    queryFn: () => followService.getFollowing(user?.id ?? ""),
    enabled: Boolean(user?.id),
    staleTime: 60_000,
  })

  const followedUserIds = new Set(
    followingQuery.data?.map((f) => f.following_id) ?? []
  )

  // Filter only published posts from followed authors
  const followingPosts =
    postsQuery.data?.filter(
      (post) => post.status === "Published" && followedUserIds.has(post.author_id)
    ) ?? []

  const isLoading = postsQuery.isLoading || followingQuery.isLoading

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_300px] pb-12">
      {/* Left Sidebar */}
      <div className="hidden lg:block">
        <LeftSidebar />
      </div>

      {/* Main Feed Content */}
      <main className="space-y-6 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="size-5 text-primary" />
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Following Feed
              </h1>
            </div>
            <p className="mt-1 text-xs text-muted-foreground font-medium">
              Published articles from authors you follow.
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20">
            {followingPosts.length} Stories
          </span>
        </div>

        {/* Following Posts Feed */}
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <PostCardSkeleton key={index} />
            ))}
          </div>
        ) : postsQuery.isError ? (
          <ErrorState
            description={getErrorMessage(postsQuery.error)}
            onRetry={() => void postsQuery.refetch()}
          />
        ) : followingPosts.length ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {followingPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={UserPlus}
            title="No posts from authors you follow"
            description="Follow active writers and creators in the community to see their latest published stories here."
            actionLabel="Discover Authors"
            onAction={() => window.location.assign("/explore")}
          />
        )}
      </main>

      {/* Right Sidebar */}
      <div className="hidden xl:block">
        <RightSidebar />
      </div>
    </div>
  )
}
