import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { motion } from "framer-motion"
import {
  ArrowUpRight,
  Bookmark,
  Eye,
  FileText,
  Heart,
  Pencil,
  Plus,
  Trash2,
  Users,
  type LucideIcon,
} from "lucide-react"
// import * as React from "react"
import { Link } from "react-router"
import { toast } from "sonner"

import { EmptyState } from "@/components/common/empty-state"
import { ConfirmDialog } from "@/components/common/confirm-dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import { queryKeys, usePosts } from "@/hooks/use-posts"
import { bookmarkService } from "@/services/bookmark.service"
import { followService } from "@/services/follow.service"
import { likeService } from "@/services/like.service"
import { postService } from "@/services/post.service"
import { useAuthStore } from "@/store/auth.store"
import type { Post, PostStatus } from "@/types/post"
import { getErrorMessage } from "@/utils/error"
import { getReadingTime } from "@/utils/reading-time"

const ITEMS_PER_PAGE = 10

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const [page, setPage] = useState(1)
  const postsQuery = usePosts(1, 100)
  const queryClient = useQueryClient()

  const myPosts = useMemo(
    () => postsQuery.data?.data?.filter((post) => post.author_id === user?.id) ?? [],
    [postsQuery.data?.data, user?.id]
  )

  const publishedCount = myPosts.filter((p) => p.status === "Published").length
  const draftCount = myPosts.filter((p) => p.status === "Draft").length

  const bookmarksQuery = useQuery({
    queryKey: ["bookmarks", "me", "all"],
    queryFn: () => bookmarkService.getMyBookmarks({ page_size: 100 }),
    enabled: Boolean(user),
    staleTime: 60_000,
  })

  const likesQuery = useQuery({
    queryKey: ["likes", "me", "all"],
    queryFn: () => likeService.getMyLikes({ page_size: 100 }),
    enabled: Boolean(user),
    staleTime: 60_000,
  })

  const followersQuery = useQuery({
    queryKey: ["followers", user?.id, "all"],
    queryFn: () => followService.getFollowers(user?.id ?? "", { page_size: 100 }),
    enabled: Boolean(user?.id),
    staleTime: 60_000,
  })

  const followingQuery = useQuery({
    queryKey: ["following", user?.id, "all"],
    queryFn: () => followService.getFollowing(user?.id ?? "", { page_size: 100 }),
    enabled: Boolean(user?.id),
    staleTime: 60_000,
  })

  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return myPosts.slice(start, start + ITEMS_PER_PAGE)
  }, [myPosts, page])

  const totalPages = Math.max(1, Math.ceil(myPosts.length / ITEMS_PER_PAGE))

  const deletePostMutation = useMutation({
    mutationFn: postService.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts })
      toast.success("Post deleted successfully.")
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })

  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null)

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      post,
      newStatus,
    }: {
      post: Post
      newStatus: PostStatus
    }) => {
      const formData = new FormData()
      formData.append("title", post.title)
      formData.append("content", post.content)
      if (post.excerpt) formData.append("excerpt", post.excerpt)
      formData.append("category_id", post.category_id)
      formData.append("status", newStatus)

      return postService.updatePost(post.id, formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts })
      toast.success("Post status updated successfully.")
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back, {user?.first_name || "Creator"} 👋
          </h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            Your publishing & analytics command center.
          </p>
        </div>
        <Link
          to="/posts/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200 hover:bg-primary/95"
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
          value={publishedCount}
          subtitle={`${draftCount} draft${draftCount === 1 ? "" : "s"}`}
          color="text-primary"
          bg="bg-primary/10"
        />
        <MetricCard
          icon={Bookmark}
          label="Saved Bookmarks"
          value={bookmarksQuery.data?.data?.length ?? 0}
          subtitle="Saved stories"
          color="text-indigo-500"
          bg="bg-indigo-500/10"
        />
        <MetricCard
          icon={Heart}
          label="Liked Stories"
          value={likesQuery.data?.data?.length ?? 0}
          subtitle="Liked stories"
          color="text-rose-500"
          bg="bg-rose-500/10"
        />
        <MetricCard
          icon={Users}
          label="Followers / Following"
          value={`${followersQuery.data?.data?.length ?? 0} / ${followingQuery.data?.data?.length ?? 0}`}
          subtitle="Community network"
          color="text-emerald-500"
          bg="bg-emerald-500/10"
        />
      </div>

      {/* Table Section */}
      <Card className="rounded-2xl border border-slate-200/80 shadow-md dark:border-slate-800/80">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-200/60 pb-4 dark:border-slate-800/60">
          <div>
            <CardTitle className="text-xl font-bold">Your Stories</CardTitle>
            <CardDescription className="text-xs font-medium">
              Manage, view, and update status of your articles.
            </CardDescription>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {myPosts.length} Total
          </span>
        </CardHeader>

        <CardContent className="p-0">
          {myPosts.length ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200/60 bg-slate-50/50 text-xs font-bold text-slate-600 uppercase dark:border-slate-800/60 dark:bg-slate-900/50 dark:text-slate-400">
                    <tr>
                      <th className="px-6 py-3.5">Title</th>
                      <th className="px-6 py-3.5">Category</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5">Date</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                    {paginatedPosts.map((post) => (
                      <tr
                        key={post.id}
                        className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-900/40"
                      >
                        <td className="px-6 py-4 font-semibold text-foreground">
                          <div className="max-w-md truncate">
                            <Link
                              to={`/posts/${post.slug}`}
                              className="group flex items-center gap-1.5 transition-colors hover:text-primary"
                            >
                              <span>{post.title}</span>
                              <ArrowUpRight className="size-3.5 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                            </Link>
                            <p className="mt-0.5 text-xs font-normal text-muted-foreground">
                              {getReadingTime(post.content)}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                            {post.category.name}
                          </span>
                        </td>

                        {/* Status Dropdown Select */}
                        <td className="px-6 py-4">
                          <select
                            disabled={updateStatusMutation.isPending}
                            value={post.status}
                            onChange={(e) => {
                              const newStatus = e.target.value as PostStatus
                              if (newStatus !== post.status) {
                                updateStatusMutation.mutate({ post, newStatus })
                              }
                            }}
                            className={`cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-bold transition-all outline-none ${
                              post.status === "Published"
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                                : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                            }`}
                          >
                            <option value="Published" className="bg-background text-foreground font-semibold">
                              Published
                            </option>
                            <option value="Draft" className="bg-background text-foreground font-semibold">
                              Draft
                            </option>
                          </select>
                        </td>

                        <td className="px-6 py-4 text-xs font-medium whitespace-nowrap text-muted-foreground">
                          {format(new Date(post.created_at), "MMM d, yyyy")}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/posts/${post.slug}/edit`}
                              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-200/60 hover:text-foreground dark:hover:bg-slate-800"
                              title="Edit story"
                            >
                              <Pencil className="size-4" />
                            </Link>
                            <Link
                              to={`/posts/${post.slug}`}
                              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-slate-200/60 hover:text-foreground dark:hover:bg-slate-800"
                              title="View story"
                            >
                              <Eye className="size-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Are you sure you want to delete "${post.title}"?`
                                  )
                                ) {
                                  deletePostMutation.mutate(post.id)
                                }
                              }}
                              className="cursor-pointer rounded-lg p-1.5 text-rose-500 transition-colors hover:bg-rose-500/10 hover:text-rose-700"
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
              {totalPages > 1 && (
                <div className="px-6 py-4">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    total={myPosts.length}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
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
  subtitle: string
  color: string
  bg: string
}

function MetricCard({
  icon: Icon,
  label,
  value,
  subtitle,
  color,
  bg,
}: MetricProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="space-y-3 rounded-2xl border border-slate-200/80 bg-card p-5 shadow-sm dark:border-slate-800/80"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
          {label}
        </span>
        <div
          className={`grid size-9 place-items-center rounded-xl ${bg} ${color}`}
        >
          <Icon className="size-4 stroke-[2.5]" aria-hidden />
        </div>
      </div>
      <div>
        <p className="text-3xl font-extrabold tracking-tight text-foreground">
          {value}
        </p>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {subtitle}
        </p>
      </div>
    </motion.div>
  )
}
