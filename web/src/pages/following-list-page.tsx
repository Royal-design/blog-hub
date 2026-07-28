import { useQuery } from "@tanstack/react-query"
import { Users } from "lucide-react"

import { UserCard } from "@/components/cards/user-card"
import { EmptyState } from "@/components/common/empty-state"
import { ErrorState } from "@/components/common/error-state"
import { LeftSidebar } from "@/components/layout/left-sidebar"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { followService } from "@/services/follow.service"
import { useAuthStore } from "@/store/auth.store"
import type { FollowingResponse } from "@/types/follow"
import { getErrorMessage } from "@/utils/error"

export function FollowingListPage() {
  const user = useAuthStore((state) => state.user)

  const followingQuery = useQuery({
    queryKey: ["following", user?.id],
    queryFn: () => followService.getFollowing(user?.id ?? ""),
    enabled: Boolean(user?.id),
    staleTime: 60_000,
  })

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
                Following List
              </h1>
            </div>
            <p className="mt-1 text-xs text-muted-foreground font-medium">
              Authors and creators you follow across the platform.
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20">
            {followingQuery.data?.length ?? 0} Following
          </span>
        </div>

        {/* Following List */}
        {followingQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-28 rounded-2xl animate-pulse bg-card border border-slate-200/80 dark:border-slate-800/80" />
            ))}
          </div>
        ) : followingQuery.isError ? (
          <ErrorState
            description={getErrorMessage(followingQuery.error)}
            onRetry={() => void followingQuery.refetch()}
          />
        ) : followingQuery.data?.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {followingQuery.data.map((item: FollowingResponse) => (
              <UserCard key={item.following_id} user={item.following} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="You are not following anyone yet"
            description="Discover great writers and follow them to build your personal feed."
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
