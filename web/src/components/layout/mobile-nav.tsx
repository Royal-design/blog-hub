import * as React from "react"
import {
  Bookmark,
  Compass,
  FileText,
  Home,
  Grid,
  Plus,
  User,
  Users,
  UserCheck,
  Search,
  ShieldCheck,
  X,
} from "lucide-react"
import { NavLink } from "react-router"

import { useAuthStore } from "@/store/auth.store"
import { cn } from "@/lib/utils"

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
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md md:hidden animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-3xl border-t border-slate-200 dark:border-slate-800 bg-background/90 dark:bg-slate-950/90 backdrop-blur-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Grid className="size-5 text-primary" />
                <h3 className="font-extrabold text-base text-foreground">Menu Navigation</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid size-8 place-items-center rounded-full bg-slate-100 dark:bg-slate-800 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {moreNavLinks.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 p-3 rounded-2xl border text-xs font-bold transition-all",
                        isActive
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "bg-slate-50/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
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
        className="fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-background/70 dark:bg-slate-950/75 px-2 py-1.5 shadow-2xl shadow-black/20 backdrop-blur-xl backdrop-saturate-150 md:hidden"
        aria-label="Mobile navigation"
      >
        <div className={cn("grid items-center gap-1", isAdmin ? "grid-cols-6" : "grid-cols-5")}>
          <MobileNavItem label="Home" href="/" icon={Home} />
          <MobileNavItem label="Explore" href="/explore" icon={Compass} />

          <NavLink
            to="/posts/new"
            aria-label="Create post"
            className="mx-auto grid size-11 -translate-y-3 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition hover:scale-105"
          >
            <Plus className="size-5" aria-hidden />
          </NavLink>

          <MobileNavItem label="Bookmarks" href="/bookmarks" icon={Bookmark} />

          {isAdmin && (
            <MobileNavItem label="Admin" href="/admin" icon={ShieldCheck} />
          )}

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={cn(
              "grid h-11 place-items-center rounded-xl text-muted-foreground transition cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/60",
              isOpen && "bg-primary/10 text-primary shadow-[0_0_24px_rgba(79,70,229,0.25)]"
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
          isActive && "bg-primary/10 text-primary shadow-[0_0_24px_rgba(79,70,229,0.25)]"
        )
      }
      aria-label={label}
      title={label}
    >
      <Icon className="size-5" aria-hidden />
    </NavLink>
  )
}


