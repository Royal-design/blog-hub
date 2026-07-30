import * as React from "react"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen } from "lucide-react"
import { Link } from "react-router"

import { BrandVisual } from "@/components/auth/brand-visual"

interface AuthLayoutProps {
  children: React.ReactNode
  brandBadgeText?: string
  brandHeadline?: string
  brandSubheadline?: string
}

export function AuthLayout({
  children,
  brandBadgeText,
  brandHeadline,
  brandSubheadline,
}: AuthLayoutProps) {
  return (
    <div className="relative min-h-svh w-full overflow-hidden bg-background text-foreground flex items-center justify-center p-3 sm:p-6 lg:p-8 selection:bg-primary selection:text-primary-foreground">
      {/* Background Layered Visual Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top-Right Glowing Orb */}
        <motion.div
          animate={{
            x: [0, 25, 0],
            y: [0, -15, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-32 -top-32 size-[500px] rounded-full bg-primary/10 dark:bg-primary/20 blur-[120px]"
        />

        {/* Bottom-Left Glowing Orb */}
        <motion.div
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
            scale: [1.08, 1, 1.08],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-32 -bottom-32 size-[500px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px]"
        />

        {/* Subdued Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"
        />
      </div>

      {/* Main Split Screen Container */}
      <div className="relative z-10 grid w-full max-w-7xl min-h-[85vh] grid-cols-1 overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-background/60 dark:bg-slate-950/60 backdrop-blur-3xl shadow-2xl lg:grid-cols-12">
        {/* Left Side: Desktop Branding Section (42% -> 5 cols) */}
        <div className="hidden lg:col-span-5 lg:block relative border-r border-slate-200/60 dark:border-slate-800/60">
          <BrandVisual
            badgeText={brandBadgeText}
            headline={brandHeadline}
            subheadline={brandSubheadline}
          />
        </div>

        {/* Right Side: Form Container (58% -> 7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between p-3 sm:p-8 lg:p-12 relative">
          {/* Top Bar Navigation (Back to Home & Mobile Logo) */}
          <div className="flex items-center justify-between w-full mb-6 lg:mb-4">
            {/* Mobile Header Logo */}
            <div className="flex items-center gap-2.5 lg:hidden">
              <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20">
                <BookOpen className="size-4" aria-hidden />
              </div>
              <span className="font-bold tracking-tight text-foreground text-base">
                Blog Hub
              </span>
            </div>

            {/* Back to Home Button */}
            <Link
              to="/"
              className="ml-auto inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-foreground bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 transition-all duration-200 group"
            >
              <ArrowLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
              Back to Home
            </Link>
          </div>

          {/* Centered Form Wrapper */}
          <div className="my-auto flex items-center justify-center py-4 sm:py-6 w-full">
            {children}
          </div>

          {/* Mobile Footer Notice */}
          <div className="text-center text-xs text-muted-foreground pt-4 lg:hidden">
            &copy; {new Date().getFullYear()} Blog Hub. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  )
}
