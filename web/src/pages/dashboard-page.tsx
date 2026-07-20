import { BarChart3, Bookmark, FileText, Users, type LucideIcon } from "lucide-react"

import { EmptyState } from "@/components/common/empty-state"
import { usePosts } from "@/hooks/use-posts"
import { useAuthStore } from "@/store/auth.store"

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const postsQuery = usePosts()
  const myPosts =
    postsQuery.data?.filter((post) => post.author_id === user?.id) ?? []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your publishing command center.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={FileText} label="My Posts" value={myPosts.length} />
        <Metric icon={Bookmark} label="Bookmarks" value="Live soon" />
        <Metric icon={Users} label="Followers" value="Live soon" />
        <Metric icon={BarChart3} label="Analytics" value="Live soon" />
      </div>
      {myPosts.length ? (
        <div className="rounded-lg border bg-card">
          {myPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between gap-4 border-b p-4 last:border-b-0"
            >
              <div>
                <p className="font-medium">{post.title}</p>
                <p className="text-sm text-muted-foreground">{post.status}</p>
              </div>
              <span className="text-sm text-muted-foreground">
                {post.category.name}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No posts from you yet"
          description="Your drafted and published posts will appear here once they exist in the backend."
        />
      )}
    </div>
  )
}

type MetricProps = {
  icon: LucideIcon
  label: string
  value: string | number
}

function Metric({ icon: Icon, label, value }: MetricProps) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <Icon className="size-4 text-primary" aria-hidden />
      <p className="mt-4 text-2xl font-semibold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
