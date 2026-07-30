import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Users } from "lucide-react"

import { UserCard } from "@/components/cards/user-card"
import { EmptyState } from "@/components/common/empty-state"
import { ErrorState } from "@/components/common/error-state"
import { LeftSidebar } from "@/components/layout/left-sidebar"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { Pagination } from "@/components/ui/pagination"
import { followService } from "@/services/follow.service"
import { useAuthStore } from "@/store/auth.store"
import type { FollowerResponse } from "@/types/follow"
import { getErrorMessage } from "@/utils/error"

export function FollowersPage() {
  const user = useAuthStore((state) => state.user)
  const [page, setPage] = useState(1)

  const followersQuery = useQuery({
    queryKey: ["followers", user?.id, page],
    queryFn: () => followService.getFollowers(user?.id ?? "", { page, page_size: 10 }),
    enabled: Boolean(user?.id),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
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
                Followers
              </h1>
            </div>
            <p className="mt-1 text-xs text-muted-foreground font-medium">
              People who follow your stories and activity.
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20">
            {followersQuery.data?.data?.length ?? 0} Followers
          </span>
        </div>

        {/* Followers List */}
        {followersQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-28 rounded-2xl animate-pulse bg-card border border-slate-200/80 dark:border-slate-800/80" />
            ))}
          </div>
        ) : followersQuery.isError ? (
          <ErrorState
            description={getErrorMessage(followersQuery.error)}
            onRetry={() => void followersQuery.refetch()}
          />
        ) : followersQuery.data?.data?.length ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              {followersQuery.data.data.map((item: FollowerResponse) => (
                <UserCard key={item.follower_id} user={item.follower} />
              ))}
            </div>
            {followersQuery.data?.meta && (
              <Pagination
                page={page}
                totalPages={followersQuery.data.meta.total_pages ?? 1}
                total={followersQuery.data.meta.total ?? 0}
                onPageChange={setPage}
              />
            )}
          </>
        ) : (
          <EmptyState
            icon={Users}
            title="No followers yet"
            description="Publish engaging stories to build your reading audience."
            actionLabel="Write New Post"
            onAction={() => window.location.assign("/posts/new")}
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
