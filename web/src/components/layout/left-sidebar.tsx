import { useQuery } from "@tanstack/react-query"
import {
  Bookmark,
  Compass,
  FileText,
  FolderOpen,
  Home,
  ShieldCheck,
  Tag as TagIcon,
  Users,
} from "lucide-react"
import { NavLink } from "react-router"

import { useCategories, usePosts, useTags } from "@/hooks/use-posts"
import { followService } from "@/services/follow.service"
import { useAuthStore } from "@/store/auth.store"
import { getInitials } from "@/utils/initials"
import { cn } from "@/lib/utils"

export function LeftSidebar() {
  const user = useAuthStore((state) => state.user)
  const categoriesQuery = useCategories()
  const tagsQuery = useTags()
  const postsQuery = usePosts(1, 100)

  const followersQuery = useQuery({
    queryKey: ["followers", user?.id, "sidebar"],
    queryFn: () => followService.getFollowers(user?.id ?? "", { page_size: 100 }),
    enabled: Boolean(user?.id),
    staleTime: 60_000,
  })

  const followingQuery = useQuery({
    queryKey: ["following", user?.id, "sidebar"],
    queryFn: () => followService.getFollowing(user?.id ?? "", { page_size: 100 }),
    enabled: Boolean(user?.id),
    staleTime: 60_000,
  })

  const myPosts = postsQuery.data?.data?.filter((p) => p.author_id === user?.id) ?? []

  const navItems = [
    { label: "Home Feed", href: "/", icon: Home },
    { label: "Explore", href: "/explore", icon: Compass },
    { label: "Following Feed", href: "/following", icon: Users },
    { label: "Bookmarked Posts", href: "/bookmarks", icon: Bookmark },
    { label: "My Stories", href: "/dashboard", icon: FileText, badge: myPosts.length },
    ...(user?.role === "admin"
      ? [{ label: "Admin Panel", href: "/admin", icon: ShieldCheck, badgeLabel: "ADMIN" }]
      : []),
  ]

  const userInitials = getInitials(
    user ? `${user.first_name || ""} ${user.last_name || ""}` : null,
    user?.first_name,
    user?.last_name,
    user?.username
  )

  return (
    <aside className="space-y-6">
      {/* User Profile Summary */}
      {user && (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.first_name}
                className="size-12 rounded-full object-cover ring-2 ring-primary/20"
              />
            ) : (
              <div className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary font-extrabold text-sm border border-primary/20 tracking-wider">
                {userInitials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-extrabold text-foreground truncate">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-xs font-semibold text-primary">@{user.username}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 text-center border-t border-slate-100 dark:border-slate-800/80">
            <NavLink to="/followers" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <p className="text-base font-extrabold text-foreground">
                {followersQuery.data?.data?.length ?? 0}
              </p>
              <p className="text-[11px] font-semibold text-muted-foreground">Followers</p>
            </NavLink>
            <NavLink to="/following-list" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <p className="text-base font-extrabold text-foreground">
                {followingQuery.data?.data?.length ?? 0}
              </p>
              <p className="text-[11px] font-semibold text-muted-foreground">Following</p>
            </NavLink>
          </div>
        </div>
      )}

      {/* Main Navigation Links */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-card p-3 shadow-sm space-y-1">
        <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Navigation
        </p>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary font-extrabold shadow-xs"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                )
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {"badgeLabel" in item && item.badgeLabel && (
                <span className="rounded-md bg-violet-600 px-2 py-0.5 text-[9px] font-black tracking-wider text-white shadow-sm">
                  {item.badgeLabel}
                </span>
              )}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-extrabold text-primary">
                  {item.badge}
                </span>
              )}
            </NavLink>
          )
        })}
      </div>

      {/* Topics / Categories */}
      {categoriesQuery.data?.length ? (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-card p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <FolderOpen className="size-3.5 text-primary" />
            <span>Categories</span>
          </div>
          <div className="space-y-1">
            {categoriesQuery.data.slice(0, 6).map((cat) => (
              <NavLink
                key={cat.id}
                to={`/search?category=${cat.id}`}
                className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span>{cat.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      ) : null}

      {/* Trending Tags */}
      {tagsQuery.data?.length ? (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-card p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <TagIcon className="size-3.5 text-primary" />
            <span>Trending Tags</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tagsQuery.data.slice(0, 8).map((tag) => (
              <NavLink
                key={tag.id}
                to={`/search?tag=${tag.id}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors border border-slate-200/60 dark:border-slate-700/60"
              >
                #{tag.name}
              </NavLink>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  )
}
