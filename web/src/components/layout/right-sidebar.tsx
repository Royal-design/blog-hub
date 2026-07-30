import { useQuery } from "@tanstack/react-query"
import { Compass, Flame, Sparkles, UserPlus } from "lucide-react"
import { Link } from "react-router"

import { UserCard } from "@/components/cards/user-card"
import { useCategories, useTags } from "@/hooks/use-posts"
import { userService } from "@/services/user.service"
import { useAuthStore } from "@/store/auth.store"

export function RightSidebar() {
  const currentUser = useAuthStore((state) => state.user)
  const categoriesQuery = useCategories()
  const tagsQuery = useTags()

  const usersQuery = useQuery({
    queryKey: ["suggested-users"],
    queryFn: () => userService.getUsers({ page_size: 10 }),
    enabled: Boolean(currentUser),
    staleTime: 5 * 60_000,
  })

  const suggestedUsers =
    usersQuery.data?.data?.filter((u) => u.id !== currentUser?.id).slice(0, 4) ?? []

  return (
    <aside className="space-y-6">
      {/* Suggested Users Section */}
      {suggestedUsers.length > 0 && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-card p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <UserPlus className="size-3.5 text-primary" />
              <span>Suggested Authors</span>
            </div>
            <Link to="/explore" className="text-[11px] font-bold text-primary hover:underline">
              See all
            </Link>
          </div>

          <div className="space-y-2.5">
            {suggestedUsers.map((user) => (
              <UserCard key={user.id} user={user} compact />
            ))}
          </div>
        </div>
      )}

      {/* Discover Topics / Trending Categories */}
      {categoriesQuery.data?.length ? (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-card p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Compass className="size-3.5 text-primary" />
            <span>Discover Topics</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {categoriesQuery.data.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                to={`/search?category=${cat.id}`}
                className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-primary/10 hover:text-primary transition-colors shadow-2xs"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {/* Trending Tags */}
      {tagsQuery.data?.length ? (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-card p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Flame className="size-3.5 text-rose-500" />
            <span>Popular Tags</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {tagsQuery.data.slice(0, 8).map((tag) => (
              <Link
                key={tag.id}
                to={`/search?tag=${tag.id}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {/* Community Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-violet-600/90 via-indigo-600/90 to-sky-600/90 p-5 text-white shadow-md space-y-2 relative overflow-hidden">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider opacity-90">
          <Sparkles className="size-3.5" />
          <span>Publish & Connect</span>
        </div>
        <h4 className="text-base font-extrabold leading-tight">
          Share your voice with thousands of readers.
        </h4>
        <p className="text-xs opacity-80 leading-relaxed">
          Create rich articles with cover photos, gallery images, custom tags, and interactive reader signals.
        </p>
        <Link
          to="/posts/new"
          className="inline-block mt-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-900 shadow-sm hover:bg-slate-100 transition-colors"
        >
          Start Writing Now
        </Link>
      </div>
    </aside>
  )
}
