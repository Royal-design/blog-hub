import { motion } from "framer-motion"
import { FileText, Tags, Users, type LucideIcon } from "lucide-react"
import { Link } from "react-router"

import { EmptyState } from "@/components/common/empty-state"
import { ErrorState } from "@/components/common/error-state"
import { PostCard } from "@/components/cards/post-card"
import { PostCardSkeleton } from "@/components/skeletons/post-card-skeleton"
import { buttonVariants } from "@/components/ui/button-variants"
import { useCategories, usePosts, useTags } from "@/hooks/use-posts"
import { useAuthStore } from "@/store/auth.store"
import { getErrorMessage } from "@/utils/error"

export function HomePage() {
  const user = useAuthStore((state) => state.user)
  const postsQuery = usePosts()
  const categoriesQuery = useCategories()
  const tagsQuery = useTags()

  if (!user) {
    return (
      <section className="grid min-h-[calc(100svh-8rem)] items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-sm font-medium text-primary">Blog Hub</p>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-normal sm:text-6xl">
            A focused home for publishing, reading, and growing a thoughtful
            audience.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
            Sign in to load live posts, categories, tags, and your publishing
            workspace from the FastAPI backend.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/login" className={buttonVariants({ size: "lg" })}>
              Sign in
            </Link>
            <Link
              to="/register"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Create account
            </Link>
          </div>
        </motion.div>
        <div className="grid gap-3">
          {["Editorial workflow", "Reader signals", "Author network"].map(
            (label) => (
              <div key={label} className="rounded-lg border bg-card p-5">
                <p className="text-sm font-medium">{label}</p>
                <div className="mt-4 h-2 rounded-full bg-muted">
                  <div className="h-full w-2/3 rounded-full bg-primary" />
                </div>
              </div>
            )
          )}
        </div>
      </section>
    )
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-lg border bg-card p-6 sm:p-8">
          <p className="text-sm font-medium text-primary">
            Welcome back, {user.first_name}
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold sm:text-5xl">
            Discover the latest stories from your Blog Hub community.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            Posts, tags, and categories below are loaded from your FastAPI
            backend with TanStack Query caching.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <StatCard icon={FileText} label="Posts" value={postsQuery.data?.length} />
          <StatCard
            icon={Users}
            label="Categories"
            value={categoriesQuery.data?.length}
          />
          <StatCard icon={Tags} label="Tags" value={tagsQuery.data?.length} />
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Latest Posts</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fresh stories from the API.
            </p>
          </div>
          <Link to="/posts/new" className={buttonVariants({ variant: "outline" })}>
            Write
          </Link>
        </div>

        {postsQuery.isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <PostCardSkeleton key={index} />
            ))}
          </div>
        ) : postsQuery.isError ? (
          <ErrorState
            description={getErrorMessage(postsQuery.error)}
            onRetry={() => void postsQuery.refetch()}
          />
        ) : postsQuery.data?.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {postsQuery.data.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No posts yet"
            description="Create the first story to start filling the home feed."
          />
        )}
      </section>
    </div>
  )
}

type StatCardProps = {
  icon: LucideIcon
  label: string
  value?: number
}

function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <Icon className="size-4 text-primary" aria-hidden />
      <p className="mt-3 text-2xl font-semibold">{value ?? "..."}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
