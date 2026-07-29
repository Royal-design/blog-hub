import {
  Bookmark,
  Compass,
  FileText,
  Grid,
  Home,
  Plus,
  Search,
  ShieldCheck,
  User,
  UserCheck,
  Users,
  X,
} from "lucide-react"
import * as React from "react"
import { NavLink } from "react-router"

import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/auth.store"

export function MobileNav() {
  const user = useAuthStore((state) => state.user)
  const [isOpen, setIsOpen] = React.useState(false)
  const isAdmin = user?.role?.toLowerCase() === "admin"

  const moreNavLinks = [
    { label: "Home Feed", href: "/", icon: Home },
    { label: "Explore", href: "/explore", icon: Compass },
    { label: "Following Feed", href: "/following", icon: Users },
    { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
    { label: "My Stories", href: "/dashboard", icon: FileText },
    { label: "Search", href: "/search", icon: Search },
    ...(isAdmin
      ? [{ label: "Admin Panel", href: "/admin", icon: ShieldCheck }]
      : []),
    ...(user
      ? [
          { label: "Followers", href: "/followers", icon: Users },
          { label: "Following List", href: "/following-list", icon: UserCheck },
          { label: "Profile", href: "/profile", icon: User },
        ]
      : []),
  ]

  return (
    <>
      {/* Slide-Up Drawer for Missing Nav Links */}
      {isOpen && (
        <div
          className="fixed inset-x-0 bottom-0 z-50 flex h-[50vh] animate-in flex-col rounded-t-3xl border-t border-slate-200 bg-background/85 shadow-2xl backdrop-blur-2xl duration-300 slide-in-from-bottom dark:border-slate-800 dark:bg-slate-950/85"
          style={{
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            backdropFilter: "blur(20px) saturate(180%)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Grid className="size-5 text-primary" />
              <h3 className="text-base font-extrabold text-foreground">
                Menu Navigation
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="grid size-9 place-items-center rounded-full bg-slate-100 text-muted-foreground transition hover:text-foreground dark:bg-slate-800"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 pt-5 pb-16">
            <div className="grid grid-cols-2 gap-2 pb-6">
              {moreNavLinks.map((item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-2xl border p-3 text-xs font-bold transition-all",
                        isActive
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-slate-200/80 bg-slate-50/80 text-slate-700 hover:bg-slate-100 dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800"
                      )
                    }
                  >
                    <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </div>

                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Nav Bar */}
      <nav
        className="fixed inset-x-3 bottom-1 z-50 rounded-2xl border border-slate-200/80 bg-white/70 px-2 py-2.5 shadow-2xl shadow-black/20 backdrop-blur-xl backdrop-saturate-150 md:hidden dark:border-slate-800/80 dark:bg-slate-950/75"
        style={{
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          backdropFilter: "blur(16px) saturate(180%)",
        }}
        aria-label="Mobile navigation"
      >
        <div className="grid grid-cols-5 items-center gap-1">
          <MobileNavItem label="Home" href="/" icon={Home} />
          <MobileNavItem label="Explore" href="/explore" icon={Compass} />

          <NavLink
            to="/posts/new"
            aria-label="Create post"
            className="mx-auto grid size-11 -translate-y-6 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition hover:scale-105"
          >
            <Plus className="size-5" aria-hidden />
          </NavLink>

          <MobileNavItem label="Bookmarks" href="/bookmarks" icon={Bookmark} />

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={cn(
              "grid h-11 cursor-pointer place-items-center rounded-xl text-muted-foreground transition hover:bg-slate-100 dark:hover:bg-slate-800/60",
              isOpen &&
                "bg-primary/10 text-primary shadow-[0_0_24px_rgba(79,70,229,0.25)]"
            )}
            aria-label="All Navigation"
          >
            <Grid className="size-5" aria-hidden />
          </button>
        </div>
      </nav>
    </>
  )
}

type MobileNavItemProps = {
  label: string
  href: string
  icon: React.ElementType
}

function MobileNavItem({ label, href, icon: Icon }: MobileNavItemProps) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          "grid h-11 place-items-center rounded-xl text-muted-foreground transition hover:bg-slate-100 dark:hover:bg-slate-800/60",
          isActive &&
            "bg-primary/10 text-primary shadow-[0_0_24px_rgba(79,70,229,0.25)]"
        )
      }
      aria-label={label}
      title={label}
    >
      <Icon className="size-5" aria-hidden />
    </NavLink>
  )
}
