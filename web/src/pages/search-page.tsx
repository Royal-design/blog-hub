import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { FileText, Search, Users } from "lucide-react"
import { useSearchParams } from "react-router"

import { PostCard } from "@/components/cards/post-card"
import { UserCard } from "@/components/cards/user-card"
import { EmptyState } from "@/components/common/empty-state"
import { FormSearch } from "@/components/forms/form-search"
import { LeftSidebar } from "@/components/layout/left-sidebar"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { PostCardSkeleton } from "@/components/skeletons/post-card-skeleton"
import { Pagination } from "@/components/ui/pagination"
import { useCategories, usePosts } from "@/hooks/use-posts"
import { userService } from "@/services/user.service"
import { useAppStore } from "@/store/app.store"
import { useAuthStore } from "@/store/auth.store"

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = useAppStore((state) => state.searchQuery)
  const setQuery = useAppStore((state) => state.setSearchQuery)

  const activeTab = searchParams.get("tab") === "users" ? "users" : "stories"
  const currentUser = useAuthStore((state) => state.user)

  const [page, setPage] = React.useState(1)
  const postsQuery = usePosts(page)
  const categoriesQuery = useCategories()
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | null>(null)
  const [usersPage, setUsersPage] = React.useState(1)

  const usersQuery = useQuery({
    queryKey: ["search-users", query, usersPage],
    queryFn: () => userService.getUsers({ search: query.trim() || undefined, page: usersPage, page_size: 30 }),
    enabled: Boolean(currentUser),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  })

  const normalizedQuery = query.trim().toLowerCase()

  // Filter posts
  const posts =
    postsQuery.data?.data?.filter((post) => {
      const matchesCategory = selectedCategoryId
        ? post.category_id === selectedCategoryId
        : true

      if (!normalizedQuery) {
        return matchesCategory
      }

      const matchesText = [
        post.title,
        post.excerpt,
        post.content,
        post.category?.name,
        post.author?.first_name,
        post.author?.last_name,
        post.author?.username,
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedQuery))

      return matchesCategory && matchesText
    }) ?? []

  // Filter users
  const users =
    usersQuery.data?.data?.filter((u) => {
      if (u.id === currentUser?.id) return false
      if (!normalizedQuery) return true
      const fullName = `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase()
      return (
        fullName.includes(normalizedQuery) ||
        u.username.toLowerCase().includes(normalizedQuery) ||
        u.email.toLowerCase().includes(normalizedQuery) ||
        (u.bio && u.bio.toLowerCase().includes(normalizedQuery))
      )
    }) ?? []

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_300px] pb-12">
      {/* Left Sidebar */}
      <div className="hidden lg:block sticky top-20 h-fit">
        <LeftSidebar />
      </div>

      {/* Center Search Main View */}
      <main className="space-y-6 min-w-0">
        {/* Header & Search Input */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Search Hub
            </h1>
            <p className="mt-1 text-xs text-muted-foreground font-medium">
              Find stories, topics, authors, and users to follow across the community.
            </p>
          </div>

          <FormSearch
            value={query}
            onChange={(val) => setQuery(val)}
            onClear={() => setQuery("")}
            placeholder="Type to search stories, creators, topics..."
          />

          {/* Search Tabs: Stories | Authors */}
          <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-3 pt-1">
            <button
              type="button"
              onClick={() => setSearchParams({ tab: "stories" })}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "stories"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <FileText className="size-4" />
              <span>Stories ({posts.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setSearchParams({ tab: "users" })}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "users"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <Users className="size-4" />
              <span>Authors & Users ({users.length})</span>
            </button>
          </div>

          {/* Category Filter Pills (when on stories tab) */}
          {activeTab === "stories" && categoriesQuery.data?.length ? (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSelectedCategoryId(null)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategoryId === null
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                All Categories
              </button>
              {categoriesQuery.data.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setSelectedCategoryId((prev) => (prev === cat.id ? null : cat.id))
                  }
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCategoryId === cat.id
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Tab 1: Stories Results */}
        {activeTab === "stories" && (
          postsQuery.isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, index) => (
                <PostCardSkeleton key={index} />
              ))}
            </div>
          ) : posts.length ? (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              {postsQuery.data?.meta && (
                <Pagination
                  page={page}
                  totalPages={postsQuery.data.meta.total_pages ?? 1}
                  total={postsQuery.data.meta.total ?? 0}
                  onPageChange={setPage}
                />
              )}
            </>
          ) : (
            <EmptyState
              icon={Search}
              title="No matching stories found"
              description="Try adjusting your keywords or clearing category filters."
            />
          )
        )}

        {/* Tab 2: Users & Authors Results */}
        {activeTab === "users" && (
          usersQuery.isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="h-28 rounded-2xl animate-pulse bg-card border border-slate-200/80 dark:border-slate-800/80"
                />
              ))}
            </div>
          ) : users.length ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                {users.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
              {usersQuery.data?.meta && (
                <Pagination
                  page={usersPage}
                  totalPages={usersQuery.data.meta.total_pages ?? 1}
                  total={usersQuery.data.meta.total ?? 0}
                  onPageChange={setUsersPage}
                />
              )}
            </>
          ) : (
            <EmptyState
              icon={Users}
              title="No authors found"
              description="Search by name, username, or email to find people to follow."
            />
          )
        )}
      </main>

      {/* Right Sidebar */}
      <div className="hidden xl:block sticky top-20 h-fit">
        <RightSidebar />
      </div>
    </div>
  )
}
