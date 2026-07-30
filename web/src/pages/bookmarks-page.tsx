import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Bookmark } from "lucide-react"

import { PostCard } from "@/components/cards/post-card"
import { EmptyState } from "@/components/common/empty-state"
import { ErrorState } from "@/components/common/error-state"
import { LeftSidebar } from "@/components/layout/left-sidebar"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { PostCardSkeleton } from "@/components/skeletons/post-card-skeleton"
import { Pagination } from "@/components/ui/pagination"
import { bookmarkService } from "@/services/bookmark.service"
import { useAuthStore } from "@/store/auth.store"
import { getErrorMessage } from "@/utils/error"

export function BookmarksPage() {
  const user = useAuthStore((state) => state.user)
  const [page, setPage] = useState(1)

  const bookmarksQuery = useQuery({
    queryKey: ["bookmarks", "me", page],
    queryFn: () => bookmarkService.getMyBookmarks({ page, page_size: 10 }),
    enabled: Boolean(user),
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
              <Bookmark className="size-5 text-primary" />
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Saved Articles
              </h1>
            </div>
            <p className="mt-1 text-xs text-muted-foreground font-medium">
              Your personal library of bookmarked posts for reading later.
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20">
            {bookmarksQuery.data?.data?.length ?? 0} Saved
          </span>
        </div>

        {/* Bookmarked Posts List */}
        {bookmarksQuery.isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <PostCardSkeleton key={index} />
            ))}
          </div>
        ) : bookmarksQuery.isError ? (
          <ErrorState
            description={getErrorMessage(bookmarksQuery.error)}
            onRetry={() => void bookmarksQuery.refetch()}
          />
        ) : bookmarksQuery.data?.data?.length ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              {bookmarksQuery.data.data.map((item) => (
                <PostCard key={item.post_id} post={item.post} />
              ))}
            </div>
            {bookmarksQuery.data?.meta && (
              <Pagination
                page={page}
                totalPages={bookmarksQuery.data.meta.total_pages ?? 1}
                total={bookmarksQuery.data.meta.total ?? 0}
                onPageChange={setPage}
              />
            )}
          </>
        ) : (
          <EmptyState
            icon={Bookmark}
            title="No bookmarked posts yet"
            description="Save interesting stories to read them anytime from your bookmarks library."
            actionLabel="Explore Articles"
            onAction={() => window.location.assign("/")}
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
