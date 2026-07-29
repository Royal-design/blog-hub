import * as React from "react"
import { BookOpen, LogOut, Moon, Plus, Search, Sun } from "lucide-react"
import { Link, NavLink, useNavigate } from "react-router"

import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { useLogout } from "@/hooks/use-auth"
import { useAppStore } from "@/store/app.store"
import { useAuthStore } from "@/store/auth.store"
import { useThemeStore } from "@/store/theme.store"
import { getInitials } from "@/utils/initials"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "Following", href: "/following" },
  { label: "Bookmarks", href: "/bookmarks" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Profile", href: "/profile" },
]

export function SiteHeader() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const searchQuery = useAppStore((state) => state.searchQuery)
  const setSearchQuery = useAppStore((state) => state.setSearchQuery)
  const logout = useLogout()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate("/search")
    }
  }

  return (
    <header
      className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/75 dark:bg-slate-950/75 backdrop-blur-xl backdrop-saturate-150 transition-colors"
      style={{
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        backdropFilter: "blur(16px) saturate(180%)",
      }}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-foreground hover:opacity-90 transition-opacity">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
            <BookOpen className="size-4 stroke-[2.5]" aria-hidden />
          </span>
          <span className="text-lg tracking-tight font-extrabold">Blog Hub</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3.5 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors",
                  isActive && "bg-slate-100 dark:bg-slate-800 text-foreground font-bold"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="hidden min-w-48 max-w-xs flex-1 items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-3 md:flex shadow-xs focus-within:ring-2 focus-within:ring-primary/25">
          <Search className="size-4 text-slate-500 dark:text-slate-400 shrink-0 stroke-[2]" aria-hidden />
          <input
            aria-label="Search posts"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-9 min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal"
            placeholder="Search stories, authors..."
          />
        </form>

        {/* Actions & Theme Toggle */}
        <div className="flex items-center gap-2.5">
          <Button
            size="icon"
            variant="ghost"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="rounded-xl"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          {user ? (
            <div className="flex items-center gap-2.5">
              <Link
                to="/posts/new"
                className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex rounded-xl font-bold gap-1.5 shadow-sm")}
              >
                <Plus className="size-4 stroke-[2.5]" />
                Write
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={`${user.first_name} ${user.last_name}`}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt=""
                    className="size-8 rounded-lg object-cover ring-1 ring-primary/20"
                  />
                ) : (
                  <div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary font-extrabold text-xs uppercase border border-primary/20 tracking-wider">
                    {getInitials(
                      `${user.first_name || ""} ${user.last_name || ""}`,
                      user.first_name,
                      user.last_name,
                      user.username
                    )}
                  </div>
                )}
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                className="rounded-xl font-semibold border-slate-300 dark:border-slate-700"
              >
                <LogOut className="size-3.5 mr-1" />
                Sign out
              </Button>
            </div>
          ) : (
            <Link to="/login" className={cn(buttonVariants({ size: "sm" }), "rounded-xl font-bold")}>
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
