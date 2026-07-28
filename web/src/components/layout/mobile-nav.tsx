import { Bookmark, Compass, Home, LayoutDashboard, Plus, User } from "lucide-react"
import { NavLink } from "react-router"

import { cn } from "@/lib/utils"

const items = [
  { label: "Home", href: "/", icon: Home },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { label: "Profile", href: "/profile", icon: User },
]

export function MobileNav() {
  return (
    <nav
      className="fixed inset-x-4 bottom-4 z-50 rounded-2xl border bg-background/85 px-3 py-2 shadow-2xl shadow-black/30 backdrop-blur-xl md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-[1fr_1fr_56px_1fr_1fr] items-center gap-1">
        {items.slice(0, 2).map((item) => (
          <MobileNavItem key={item.href} {...item} />
        ))}
        <NavLink
          to="/posts/new"
          aria-label="Create post"
          className="mx-auto grid size-14 -translate-y-5 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition hover:scale-105"
        >
          <Plus className="size-6" aria-hidden />
        </NavLink>
        {items.slice(2).map((item) => (
          <MobileNavItem key={item.href} {...item} />
        ))}
      </div>
    </nav>
  )
}

type MobileNavItemProps = (typeof items)[number]

function MobileNavItem({ label, href, icon: Icon }: MobileNavItemProps) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          "grid h-12 place-items-center rounded-xl text-muted-foreground transition",
          isActive && "bg-primary/10 text-primary shadow-[0_0_24px_rgba(79,70,229,0.25)]"
        )
      }
      aria-label={label}
    >
      <Icon className="size-5" aria-hidden />
    </NavLink>
  )
}
