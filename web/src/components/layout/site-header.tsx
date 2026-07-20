import { BookOpen, Moon, Plus, Search, Sun } from "lucide-react"
import { Link, NavLink } from "react-router"

import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { useLogout } from "@/hooks/use-auth"
import { useAppStore } from "@/store/app.store"
import { useAuthStore } from "@/store/auth.store"
import { useThemeStore } from "@/store/theme.store"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Profile", href: "/profile" },
]

export function SiteHeader() {
  const user = useAuthStore((state) => state.user)
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const searchQuery = useAppStore((state) => state.searchQuery)
  const setSearchQuery = useAppStore((state) => state.setSearchQuery)
  const logout = useLogout()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="size-4" aria-hidden />
          </span>
          <span>Blog Hub</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground",
                  isActive && "bg-muted text-foreground"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden min-w-64 max-w-sm flex-1 items-center gap-2 rounded-lg border bg-card px-3 md:flex">
          <Search className="size-4 text-muted-foreground" aria-hidden />
          <input
            aria-label="Search posts"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search stories, authors, tags"
          />
        </div>

        <Button
          size="icon"
          variant="ghost"
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>

        {user ? (
          <>
            <Link
              to="/posts/new"
              className={cn(buttonVariants(), "hidden sm:inline-flex")}
            >
                <Plus data-icon="inline-start" />
                Write
            </Link>
            <Button
              variant="outline"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              Sign out
            </Button>
          </>
        ) : (
          <Link to="/login" className={buttonVariants()}>
            Sign in
          </Link>
        )}
      </div>
    </header>
  )
}
