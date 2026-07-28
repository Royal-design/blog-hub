import * as React from "react"
import { Search } from "lucide-react"

import { PostCard } from "@/components/cards/post-card"
import { EmptyState } from "@/components/common/empty-state"
import { FormSearch } from "@/components/forms/form-search"
import { PostCardSkeleton } from "@/components/skeletons/post-card-skeleton"
import { useCategories, usePosts } from "@/hooks/use-posts"
import { useAppStore } from "@/store/app.store"

export function SearchPage() {
  const query = useAppStore((state) => state.searchQuery)
  const setQuery = useAppStore((state) => state.setSearchQuery)
  const postsQuery = usePosts()
  const categoriesQuery = useCategories()
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | null>(null)

  const normalizedQuery = query.trim().toLowerCase()

  const posts =
    postsQuery.data?.filter((post) => {
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

  return (
    <div className="space-y-8">
      {/* Header & Search Bar */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Search Stories & Perspectives
          </h1>
          <p className="mt-1 text-sm text-muted-foreground font-medium">
            Explore articles by title, content keywords, author, or categories.
          </p>
        </div>

        <FormSearch
          value={query}
          onChange={(val) => setQuery(val)}
          onClear={() => setQuery("")}
          placeholder="Type to search stories, authors, topics..."
        />

        {/* Category Pills */}
        {categoriesQuery.data?.length ? (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setSelectedCategoryId(null)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategoryId === null
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategoryId === cat.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Results Grid */}
      {postsQuery.isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </div>
      ) : posts.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No matching posts found"
          description="Try adjusting your search query or clearing the category filter."
        />
      )}
    </div>
  )
}
