import { Outlet } from "react-router"

import { MobileNav } from "@/components/layout/mobile-nav"
import { SiteHeader } from "@/components/layout/site-header"

export function AppShell() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  )
}
