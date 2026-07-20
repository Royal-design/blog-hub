import { Search } from "lucide-react"

import { EmptyState } from "@/components/common/empty-state"
import { PostCard } from "@/components/cards/post-card"
import { usePosts } from "@/hooks/use-posts"
import { useAppStore } from "@/store/app.store"

export function SearchPage() {
  const query = useAppStore((state) => state.searchQuery)
  const setQuery = useAppStore((state) => state.setSearchQuery)
  const postsQuery = usePosts()
  const normalizedQuery = query.trim().toLowerCase()
  const posts =
    postsQuery.data?.filter((post) => {
      if (!normalizedQuery) {
        return true
      }

      return [post.title, post.excerpt, post.content, post.category.name]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedQuery))
    }) ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Search</h1>
        <div className="mt-4 flex h-12 items-center gap-3 rounded-lg border bg-card px-4">
          <Search className="size-4 text-muted-foreground" aria-hidden />
          <input
            aria-label="Search posts"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            placeholder="Search posts"
          />
        </div>
      </div>
      {posts.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No matching posts"
          description="Try another search term or clear the search field."
        />
      )}
    </div>
  )
}
