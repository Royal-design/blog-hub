import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { FileText, Sparkles, TrendingUp } from "lucide-react"
import { Link } from "react-router"

import { PostCard } from "@/components/cards/post-card"
import { EmptyState } from "@/components/common/empty-state"
import { ErrorState } from "@/components/common/error-state"
import { LeftSidebar } from "@/components/layout/left-sidebar"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { PostCardSkeleton } from "@/components/skeletons/post-card-skeleton"
import { buttonVariants } from "@/components/ui/button-variants"
import { usePosts } from "@/hooks/use-posts"
import { useAuthStore } from "@/store/auth.store"
import { getErrorMessage } from "@/utils/error"

export function HomePage() {
  const user = useAuthStore((state) => state.user)
  const postsQuery = usePosts()

  // Unauthenticated Hero Section
  if (!user) {
    return (
      <section className="grid min-h-[calc(100svh-8rem)] items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary border border-primary/20">
            <Sparkles className="size-3.5" /> Modern Social Publishing
          </span>
          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl leading-[1.1]">
            Where great ideas find their voice & thoughtful audience.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
            Connect with creators, publish rich articles, build your follower network, and engage with top stories across tech, design, and engineering.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/login" className={buttonVariants({ size: "lg" })}>
              Sign in to feed
            </Link>
            <Link
              to="/register"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Create account
            </Link>
          </div>
        </motion.div>
        <div className="grid gap-4">
          {[
            { label: "Published Feed", desc: "Clean chronological feed of verified articles" },
            { label: "Social Connections", desc: "Follow authors, bookmark posts, and build community" },
            { label: "Rich Editor", desc: "Write stories with cover photos, galleries, and tags" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-card p-6 shadow-sm">
              <p className="text-base font-extrabold text-foreground">{item.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
              <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-2/3 rounded-full bg-primary" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // Filter ONLY Published posts (strictly excluding Drafts and Archived)
  const publishedPosts =
    postsQuery.data?.filter((post) => post.status === "Published") ?? []

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_300px] pb-12">
      {/* Left Navigation & Profile Sidebar */}
      <div className="hidden lg:block">
        <LeftSidebar />
      </div>

      {/* Center Main Feed Column */}
      <main className="space-y-6 min-w-0">
        {/* Top Feed Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Home Feed
            </h1>
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              Latest published stories from community authors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/posts/new"
              className={buttonVariants({ size: "sm" })}
            >
              Write Story
            </Link>
          </div>
        </div>

        {/* Feed Posts */}
        {postsQuery.isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 6 }, (_, index) => (
              <PostCardSkeleton key={index} />
            ))}
          </div>
        ) : postsQuery.isError ? (
          <ErrorState
            description={getErrorMessage(postsQuery.error)}
            onRetry={() => void postsQuery.refetch()}
          />
        ) : publishedPosts.length ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {publishedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No published stories yet"
            description="Be the first creator to publish an article to the home feed!"
            actionLabel="Write First Post"
            onAction={() => window.location.assign("/posts/new")}
          />
        )}
      </main>

      {/* Right Discovery Sidebar */}
      <div className="hidden xl:block">
        <RightSidebar />
      </div>
    </div>
  )
}
