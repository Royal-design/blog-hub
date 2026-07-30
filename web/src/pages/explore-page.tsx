import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Compass, Flame, FolderOpen, Sparkles, Users } from "lucide-react"
import { Link } from "react-router"

import { PostCard } from "@/components/cards/post-card"
import { UserCard } from "@/components/cards/user-card"
import { ErrorState } from "@/components/common/error-state"
import { LeftSidebar } from "@/components/layout/left-sidebar"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { PostCardSkeleton } from "@/components/skeletons/post-card-skeleton"
import { Pagination } from "@/components/ui/pagination"
import { useCategories, usePosts, useTags } from "@/hooks/use-posts"
import { userService } from "@/services/user.service"
import { useAuthStore } from "@/store/auth.store"
import { getErrorMessage } from "@/utils/error"

export function ExplorePage() {
  const currentUser = useAuthStore((state) => state.user)
  const [page, setPage] = useState(1)
  const postsQuery = usePosts(page)
  const categoriesQuery = useCategories()
  const tagsQuery = useTags()

  const usersQuery = useQuery({
    queryKey: ["suggested-users-all"],
    queryFn: () => userService.getUsers({ page_size: 20 }),
    enabled: Boolean(currentUser),
    staleTime: 5 * 60_000,
  })

  // Only published posts for explore feed
  const publishedPosts =
    postsQuery.data?.data?.filter((p) => p.status === "Published") ?? []

  const suggestedUsers =
    usersQuery.data?.data?.filter((u) => u.id !== currentUser?.id) ?? []

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_300px] pb-12">
      {/* Left Sidebar */}
      <div className="hidden lg:block sticky top-20 h-fit">
        <LeftSidebar />
      </div>

      {/* Main Explore Content */}
      <main className="space-y-10 min-w-0">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <Compass className="size-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Explore Community
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground font-medium">
            Discover trending articles, active authors, categories, and tags.
          </p>
        </div>

        {/* Featured Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 p-6 sm:p-8 text-white shadow-xl">
          <div className="max-w-xl space-y-3 relative z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur border border-white/20">
              <Sparkles className="size-3.5" /> Featured Stories
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Dive deep into fresh perspectives and knowledge.
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Explore handpicked stories across tech, design, engineering, and creative writing.
            </p>
          </div>
        </div>

        {/* Popular Authors Grid */}
        {suggestedUsers.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="size-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Popular Authors</h2>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {suggestedUsers.slice(0, 4).map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </section>
        )}

        {/* Topics & Categories */}
        {categoriesQuery.data?.length ? (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="size-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Browse by Category</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categoriesQuery.data.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/search?category=${cat.id}`}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-card hover:bg-primary/5 hover:border-primary/40 transition-all duration-200 group shadow-2xs"
                >
                  <span className="text-xs font-extrabold text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {/* Trending Tags */}
        {tagsQuery.data?.length ? (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Flame className="size-5 text-rose-500" />
              <h2 className="text-lg font-bold text-foreground">Trending Tags</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {tagsQuery.data.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/search?tag=${tag.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 hover:bg-primary/10 hover:text-primary transition-all border border-slate-200/60 dark:border-slate-700/60 shadow-2xs"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {/* Trending Articles Feed */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Trending Articles</h2>
            </div>
          </div>

          {postsQuery.isLoading ? (
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
          ) : publishedPosts.length ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {publishedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : null}

          {postsQuery.data?.meta && (
            <Pagination
              page={page}
              totalPages={postsQuery.data.meta.total_pages ?? 1}
              total={postsQuery.data.meta.total ?? 0}
              onPageChange={setPage}
            />
          )}
        </section>
      </main>

      {/* Right Sidebar */}
      <div className="hidden xl:block sticky top-20 h-fit">
        <RightSidebar />
      </div>
    </div>
  )
}
