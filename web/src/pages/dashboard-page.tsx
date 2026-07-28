import * as React from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { motion } from "framer-motion"
import {
  ArrowUpRight,
  BarChart3,
  Bookmark,
  Eye,
  FileText,
  Plus,
  Trash2,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react"
import { Link } from "react-router"
import { toast } from "sonner"

import { EmptyState } from "@/components/common/empty-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { queryKeys, usePosts } from "@/hooks/use-posts"
import { postService } from "@/services/post.service"
import { useAuthStore } from "@/store/auth.store"
import { getReadingTime } from "@/utils/reading-time"

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const postsQuery = usePosts()
  const queryClient = useQueryClient()

  const myPosts =
    postsQuery.data?.filter((post) => post.author_id === user?.id) ?? []

  const deletePostMutation = useMutation({
    mutationFn: postService.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts })
      toast.success("Post deleted successfully.")
    },
    onError: () => {
      toast.error("Failed to delete post.")
    },
  })

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back, {user?.first_name || "Creator"} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground font-medium">
            Your publishing & analytics command center.
          </p>
        </div>
        <Link
          to="/posts/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/95 transition-all duration-200"
        >
          <Plus className="size-4 stroke-[2.5]" />
          Create New Post
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={FileText}
          label="Published Stories"
          value={myPosts.length}
          trend="+12% from last month"
          color="text-primary"
          bg="bg-primary/10"
        />
        <MetricCard
          icon={Bookmark}
          label="Saved Bookmarks"
          value="24"
          trend="+4 new this week"
          color="text-indigo-500"
          bg="bg-indigo-500/10"
        />
        <MetricCard
          icon={Users}
          label="Total Subscribers"
          value="1,420"
          trend="+18% growth"
          color="text-emerald-500"
          bg="bg-emerald-500/10"
        />
        <MetricCard
          icon={BarChart3}
          label="Monthly Views"
          value="18.5k"
          trend="+32% engagement"
          color="text-amber-500"
          bg="bg-amber-500/10"
        />
      </div>

      {/* Table Section */}
      <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
          <div>
            <CardTitle className="text-xl font-bold">Your Stories</CardTitle>
            <CardDescription className="text-xs font-medium">
              Manage, view, and organize all your articles.
            </CardDescription>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {myPosts.length} Total
          </span>
        </CardHeader>

        <CardContent className="p-0">
          {myPosts.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 text-xs uppercase font-bold text-slate-600 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-3.5">Title</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                  {myPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-foreground">
                        <div className="max-w-md truncate">
                          <Link
                            to={`/posts/${post.slug}`}
                            className="hover:text-primary transition-colors flex items-center gap-1.5 group"
                          >
                            <span>{post.title}</span>
                            <ArrowUpRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                          </Link>
                          <p className="text-xs text-muted-foreground font-normal mt-0.5">
                            {getReadingTime(post.content)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                          {post.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            post.status === "PUBLISHED"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-muted-foreground whitespace-nowrap">
                        {format(new Date(post.created_at), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/posts/${post.slug}`}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                            title="View story"
                          >
                            <Eye className="size-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
                                deletePostMutation.mutate(post.id)
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-500/10 transition-colors"
                            title="Delete story"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8">
              <EmptyState
                icon={FileText}
                title="No posts from you yet"
                description="Your drafted and published posts will appear here once you create your first story."
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

type MetricProps = {
  icon: LucideIcon
  label: string
  value: string | number
  trend: string
  color: string
  bg: string
}

function MetricCard({ icon: Icon, label, value, trend, color, bg }: MetricProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-card p-5 shadow-sm space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <div className={`grid size-9 place-items-center rounded-xl ${bg} ${color}`}>
          <Icon className="size-4 stroke-[2.5]" aria-hidden />
        </div>
      </div>
      <div>
        <p className="text-3xl font-extrabold tracking-tight text-foreground">{value}</p>
        <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="size-3.5" />
          <span>{trend}</span>
        </div>
      </div>
    </motion.div>
  )
}
