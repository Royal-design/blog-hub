import { AnimatePresence, motion } from "framer-motion"
import {
  Bookmark,
  Compass,
  FileText,
  Grid,
  Home,
  LogOut,
  Plus,
  Search,
  ShieldCheck,
  User,
  UserCheck,
  UserPlus,
  Users,
  X,
  type LucideIcon,
} from "lucide-react"
import * as React from "react"
import { Link, NavLink, useLocation, useNavigate } from "react-router"

import { OptimizedImage } from "@/components/common/optimized-image"
import { useLogout } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/app.store"
import { useAuthStore } from "@/store/auth.store"
import { getInitials } from "@/utils/initials"

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

export function MobileNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const logout = useLogout()

  const isOpen = useAppStore((state) => state.isMobileNavOpen)
  const setMobileNavOpen = useAppStore((state) => state.setMobileNavOpen)
  const searchQuery = useAppStore((state) => state.searchQuery)
  const setSearchQuery = useAppStore((state) => state.setSearchQuery)

  const isAdmin = user?.role?.toLowerCase() === "admin"

  const closeNav = React.useCallback(() => setMobileNavOpen(false), [setMobileNavOpen])

  React.useEffect(() => {
    closeNav()
  }, [location.pathname, closeNav])

  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate("/search")
      closeNav()
    }
  }

  const discoverLinks: NavItem[] = [
    { label: "Home Feed", href: "/", icon: Home },
    { label: "Explore", href: "/explore", icon: Compass },
    { label: "Search", href: "/search", icon: Search },
    { label: "Following Feed", href: "/following", icon: Users },
  ]

  const libraryLinks: NavItem[] = [
    { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
    { label: "My Stories", href: "/dashboard", icon: FileText },
    ...(user
      ? [{ label: "Profile", href: "/profile", icon: User }]
      : []),
  ]

  const communityLinks: NavItem[] = user
    ? [
        { label: "Followers", href: "/followers", icon: UserPlus },
        { label: "Following List", href: "/following-list", icon: UserCheck },
      ]
    : []

  const userInitials = getInitials(
    user ? `${user.first_name || ""} ${user.last_name || ""}` : null,
    user?.first_name,
    user?.last_name,
    user?.username
  )

  return (
    <>
      {/* Slide-Up Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeNav}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className="fixed inset-x-0 bottom-0 z-50 flex max-h-[86dvh] flex-col overflow-hidden rounded-t-3xl border-t border-slate-200/80 bg-background shadow-2xl dark:border-slate-800/80"
              style={{
                paddingBottom: "env(safe-area-inset-bottom)",
              }}
            >
              {/* Drag handle */}
              <div className="flex shrink-0 justify-center pt-3">
                <div className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />
              </div>

              {/* Drawer header */}
              <div className="flex shrink-0 items-center justify-between px-5 pt-3 pb-1">
                <h3 className="flex items-center gap-2 text-base font-extrabold text-foreground">
                  <Grid className="size-5 text-primary" />
                  Menu
                </h3>
                <button
                  type="button"
                  onClick={closeNav}
                  aria-label="Close navigation"
                  className="grid size-9 place-items-center rounded-full bg-slate-100 text-muted-foreground transition hover:text-foreground dark:bg-slate-800"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* User summary / auth CTA */}
              <div className="shrink-0 px-5 pt-2">
                {user ? (
                  <Link
                    to="/profile"
                    onClick={closeNav}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 transition-colors hover:bg-slate-100 dark:border-slate-800/80 dark:bg-slate-900/60 dark:hover:bg-slate-800/60"
                  >
                    <OptimizedImage
                      src={user.avatar}
                      alt=""
                      eager
                      className="size-11 shrink-0 rounded-full ring-2 ring-primary/20"
                      fallback={
                        <span className="grid size-full place-items-center rounded-full bg-primary/10 text-sm font-extrabold tracking-wider text-primary">
                          {userInitials}
                        </span>
                      }
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-extrabold text-foreground">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="truncate text-xs font-semibold text-primary">
                        @{user.username}
                      </p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-primary">
                      Profile
                    </span>
                  </Link>
                ) : (
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-800/80 dark:bg-slate-900/60">
                    <p className="text-xs font-bold text-foreground">
                      Sign in to follow authors and bookmark stories.
                    </p>
                    <Link
                      to="/login"
                      onClick={closeNav}
                      className="shrink-0 rounded-xl bg-primary px-3.5 py-2 text-xs font-extrabold text-primary-foreground shadow-sm transition hover:bg-primary/90"
                    >
                      Sign in
                    </Link>
                  </div>
                )}
              </div>

              {/* Search shortcut */}
              <form
                onSubmit={handleSearchSubmit}
                className="shrink-0 px-5 pt-3"
              >
                <div className="flex items-center gap-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/80 px-3.5 dark:bg-slate-900/80 focus-within:ring-2 focus-within:ring-primary/25">
                  <Search className="size-4 shrink-0 text-slate-500 dark:text-slate-400" aria-hidden />
                  <input
                    aria-label="Search posts"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search stories, authors..."
                    className="h-11 min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-extrabold text-primary transition hover:bg-primary/20"
                  >
                    Go
                  </button>
                </div>
              </form>

              {/* Scrollable link groups */}
              <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8">
                <NavGroup title="Discover" links={discoverLinks} onNavigate={closeNav} />
                <NavGroup title="Your Space" links={libraryLinks} onNavigate={closeNav} />

                {communityLinks.length > 0 && (
                  <NavGroup title="Community" links={communityLinks} onNavigate={closeNav} />
                )}

                {isAdmin && (
                  <NavGroup
                    title="Admin"
                    links={[{ label: "Admin Panel", href: "/admin", icon: ShieldCheck }]}
                    onNavigate={closeNav}
                  />
                )}

                {/* Sign out */}
                {user && (
                  <div className="mt-6 border-t border-slate-200/80 pt-4 dark:border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => logout.mutate()}
                      disabled={logout.isPending}
                      className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-bold text-rose-500 transition-colors hover:bg-rose-500/10 disabled:opacity-50"
                    >
                      <span className="grid size-9 place-items-center rounded-xl bg-rose-500/10 text-rose-500">
                        <LogOut className="size-[18px]" />
                      </span>
                      {logout.isPending ? "Signing out..." : "Sign out"}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Bottom Dock */}
      <nav
        className="fixed inset-x-3 bottom-2 z-40 md:hidden"
        aria-label="Mobile navigation"
      >
        <div
          className="relative mx-auto grid max-w-md grid-cols-5 items-center rounded-3xl border border-slate-200/80 bg-white/85 px-2 pb-2 pt-2.5 shadow-2xl shadow-black/10 backdrop-blur-2xl backdrop-saturate-150 dark:border-slate-800/80 dark:bg-slate-950/85"
          style={{
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            backdropFilter: "blur(20px) saturate(180%)",
          }}
        >
          <DockLink href="/" label="Home" icon={Home} />
          <DockLink href="/explore" label="Explore" icon={Compass} />

          {/* Raised create FAB */}
          <div className="relative flex justify-center">
            <span className="grid size-12 place-items-center" aria-hidden />
            <Link
              to="/posts/new"
              aria-label="Write a new post"
              className="absolute top-0 left-1/2 grid size-13 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-sky-500 text-white shadow-lg shadow-indigo-500/40 transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              <Plus className="size-6 stroke-[2.5]" aria-hidden />
            </Link>
          </div>

          <DockLink href="/bookmarks" label="Bookmarks" icon={Bookmark} />

          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation menu"
            className={cn(
              "flex flex-col items-center gap-1 rounded-2xl px-2 py-1.5 transition-colors",
              isOpen
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span
              className={cn(
                "grid h-7 w-11 place-items-center rounded-full transition-colors",
                isOpen && "bg-primary/10"
              )}
            >
              <Grid className="size-5" strokeWidth={isOpen ? 2.5 : 2} aria-hidden />
            </span>
            <span className="text-[9px] font-bold tracking-wide">More</span>
          </button>
        </div>
      </nav>
    </>
  )
}

function DockLink({ href, label, icon: Icon }: NavItem) {
  return (
    <NavLink
      to={href}
      end={href === "/"}
      className="flex flex-col items-center gap-1 rounded-2xl px-2 py-1.5 transition-colors"
      aria-label={label}
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              "grid h-7 w-11 place-items-center rounded-full transition-colors",
              isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="size-5" strokeWidth={isActive ? 2.5 : 2} aria-hidden />
          </span>
          <span
            className={cn(
              "text-[9px] font-bold tracking-wide transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  )
}

type NavGroupProps = {
  title: string
  links: NavItem[]
  onNavigate: () => void
}

function NavGroup({ title, links, onNavigate }: NavGroupProps) {
  return (
    <div className="mb-5">
      <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="space-y-1">
        {links.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/"}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-bold transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "grid size-9 place-items-center rounded-xl transition-colors",
                      isActive
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="size-[18px]" />
                  </span>
                  <span className="truncate">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto size-1.5 rounded-full bg-primary" />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}
