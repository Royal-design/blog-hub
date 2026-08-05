import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { keepPreviousData } from "@tanstack/react-query"
import type { LucideIcon } from "lucide-react"
import {
  Check,
  FileText,
  FolderOpen,
  Pencil,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  Tag as TagIcon,
  Trash2,
  UserCheck,
  Users,
  UserX,
  X,
} from "lucide-react"
import * as React from "react"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { EmptyState } from "@/components/common/empty-state"
import { ErrorState } from "@/components/common/error-state"
import { OptimizedImage } from "@/components/common/optimized-image"
import { PageLoader } from "@/components/loaders/page-loader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import { queryKeys, useCategories, usePosts, useTags } from "@/hooks/use-posts"
import { categoryService } from "@/services/category.service"
import { postService } from "@/services/post.service"
import { tagService } from "@/services/tag.service"
import { userService } from "@/services/user.service"
import { useAuthStore } from "@/store/auth.store"
import type { UserRole } from "@/types/auth"
import type { Post } from "@/types/post"
import { getErrorMessage } from "@/utils/error"
import { getInitials } from "@/utils/initials"

// ─── Reusable CRUD List Component ─────────────────────────────────────────────

type CrudItem = { id: string; name: string; slug: string }

type CrudListProps = {
  items: CrudItem[] | undefined
  isLoading: boolean
  isError: boolean
  error: unknown
  emptyIcon: LucideIcon
  emptyTitle: string
  emptyDescription: string
  addPlaceholder: string
  onAdd: (name: string) => void
  onUpdate: (id: string, name: string) => void
  onDelete: (id: string) => void
  isAdding: boolean
  isUpdating: boolean
  isDeleting: boolean
}

function CrudList({
  items,
  isLoading,
  isError,
  error,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  addPlaceholder,
  onAdd,
  onUpdate,
  onDelete,
  isAdding,
  isUpdating,
  isDeleting,
}: CrudListProps) {
  const [newName, setNewName] = React.useState("")
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editName, setEditName] = React.useState("")
  const [deleteTarget, setDeleteTarget] = React.useState<CrudItem | null>(null)

  const handleAdd = () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setNewName("")
  }

  const handleEditStart = (item: CrudItem) => {
    setEditingId(item.id)
    setEditName(item.name)
  }

  const handleEditSave = () => {
    const trimmed = editName.trim()
    if (!trimmed || !editingId) return
    onUpdate(editingId, trimmed)
    setEditingId(null)
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditName("")
  }

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name, slug: name })
  }

  return (
    <div className="space-y-4">
      {/* Add New Row */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder={addPlaceholder}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-1 rounded-xl border bg-background px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
        />
        <Button
          type="button"
          size="sm"
          onClick={handleAdd}
          disabled={isAdding || !newName.trim()}
          className="gap-1.5 rounded-xl font-bold"
        >
          <Plus className="size-3.5" />
          {isAdding ? "Adding…" : "Add"}
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <PageLoader />
      ) : isError ? (
        <ErrorState description={getErrorMessage(error)} />
      ) : !items?.length ? (
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-card shadow-xs dark:border-slate-800/80">
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
              >
                {editingId === item.id ? (
                  /* Inline edit mode */
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleEditSave()
                        if (e.key === "Escape") handleEditCancel()
                      }}
                      autoFocus
                      className="flex-1 rounded-lg border bg-background px-2.5 py-1.5 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleEditSave}
                      disabled={isUpdating || !editName.trim()}
                      className="text-emerald-600 hover:bg-emerald-500/10"
                    >
                      <Check className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleEditCancel}
                      className="text-muted-foreground hover:bg-slate-500/10"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ) : (
                  /* Normal display mode */
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold text-foreground">
                        {item.name}
                      </p>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        /{item.slug}
                      </p>
                    </div>
                  </div>
                )}

                {editingId !== item.id && (
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleEditStart(item)}
                      className="text-slate-500 hover:bg-blue-500/10 hover:text-blue-600"
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(item.id, item.name)}
                      disabled={isDeleting}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        title="Delete item?"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
            : ""
        }
        isConfirming={isDeleting}
        onConfirm={() => {
          if (deleteTarget) {
            onDelete(deleteTarget.id)
            setDeleteTarget(null)
          }
        }}
      />
    </div>
  )
}

export function AdminDashboardPage() {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const [activeTab, setActiveTab] = React.useState<
    "users" | "posts" | "categories" | "tags"
  >("users")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [usersPage, setUsersPage] = React.useState(1)
  const [postsPage, setPostsPage] = React.useState(1)

  const isAdmin = user?.role === "admin"

  const usersQuery = useQuery({
    queryKey: ["admin", "users", searchQuery, usersPage],
    queryFn: () => userService.getUsers({ search: searchQuery, page: usersPage, page_size: 20 }),
    staleTime: 30_000,
    enabled: isAdmin,
    placeholderData: keepPreviousData,
  })

  const postsQuery = usePosts(postsPage, 20)
  const categoriesQuery = useCategories()
  const tagsQuery = useTags()

  // Separate queries for metrics (count all items)
  const allUsersQuery = useQuery({
    queryKey: ["admin", "users", "all"],
    queryFn: () => userService.getUsers({ page_size: 1000 }),
    staleTime: 30_000,
    enabled: isAdmin,
  })

  const allPostsQuery = useQuery({
    queryKey: ["posts", "all"],
    queryFn: () => postService.getPosts({ page_size: 1000 }),
    staleTime: 60_000,
    enabled: isAdmin,
    placeholderData: keepPreviousData,
  })

  // ── User Role Mutation ──
  const roleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      userService.updateUserRole(userId, role),
    onSuccess: (updatedUser) => {
      toast.success(
        `Role for ${updatedUser.username} updated to ${updatedUser.role}`
      )
      if (user && updatedUser.id === user.id) {
        useAuthStore.setState({ user: updatedUser })
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: () => {
      toast.success("User removed successfully")
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  // ── Category Mutations ──
  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => categoryService.createCategory(name),
    onSuccess: (cat) => {
      toast.success(`Category "${cat.name}" created`)
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      categoryService.updateCategory(id, name),
    onSuccess: (cat) => {
      toast.success(`Category updated to "${cat.name}"`)
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: (cat) => {
      toast.success(`Category "${cat.name}" deleted`)
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  // ── Tag Mutations ──
  const createTagMutation = useMutation({
    mutationFn: (name: string) => tagService.createTag(name),
    onSuccess: (tag) => {
      toast.success(`Tag "${tag.name}" created`)
      queryClient.invalidateQueries({ queryKey: ["tags"] })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const updateTagMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      tagService.updateTag(id, name),
    onSuccess: (tag) => {
      toast.success(`Tag updated to "${tag.name}"`)
      queryClient.invalidateQueries({ queryKey: ["tags"] })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const deleteTagMutation = useMutation({
    mutationFn: (id: string) => tagService.deleteTag(id),
    onSuccess: (tag) => {
      toast.success(`Tag "${tag.name}" deleted`)
      queryClient.invalidateQueries({ queryKey: ["tags"] })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  // ── Post Mutations ──
  const deletePostMutation = useMutation({
    mutationFn: postService.deletePost,
    onSuccess: () => {
      toast.success("Post deleted successfully")
      queryClient.invalidateQueries({ queryKey: queryKeys.posts })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const [deletePostTarget, setDeletePostTarget] = React.useState<Post | null>(
    null
  )
  const [deleteUserTarget, setDeleteUserTarget] = React.useState<{
    id: string
    username: string
  } | null>(null)

  // ── Access Guard (after all hooks) ──
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <Card className="border-destructive/30 bg-destructive/10 p-8 text-center">
          <ShieldAlert className="mx-auto size-12 text-destructive" />
          <h2 className="mt-4 text-xl font-black text-destructive">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You do not have administrative privileges to view this area.
          </p>
        </Card>
      </div>
    )
  }

  const totalUsers = allUsersQuery.data?.data?.length ?? 0
  const totalPosts = allPostsQuery.data?.data?.length ?? 0
  const totalCategories = categoriesQuery.data?.length ?? 0
  const totalTags = tagsQuery.data?.length ?? 0

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-3xl bg-slate-900 p-8 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/20 px-3 py-1 text-xs font-bold text-primary-foreground dark:text-white">
            <ShieldCheck className="size-3.5" />
            <span>Admin Operations</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            System Management
          </h1>
          <p className="text-sm font-medium text-slate-400">
            Control user roles, moderate content, and oversee BlogHub system
            metrics.
          </p>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="rounded-2xl border border-slate-200/80 p-5 shadow-xs dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-blue-500/10 text-blue-600">
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">
                {totalUsers}
              </p>
              <p className="text-xs font-bold text-muted-foreground">
                Total Users
              </p>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 p-5 shadow-xs dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <FileText className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">
                {totalPosts}
              </p>
              <p className="text-xs font-bold text-muted-foreground">
                Total Stories
              </p>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 p-5 shadow-xs dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-purple-500/10 text-purple-600">
              <FolderOpen className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">
                {totalCategories}
              </p>
              <p className="text-xs font-bold text-muted-foreground">
                Categories
              </p>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 p-5 shadow-xs dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
              <TagIcon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">{totalTags}</p>
              <p className="text-xs font-bold text-muted-foreground">
                Active Tags
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs Header */}
      <div className="flex flex-wrap items-center gap-2 border-b pb-2">
        <Button
          type="button"
          variant={activeTab === "users" ? "default" : "ghost"}
          onClick={() => setActiveTab("users")}
          className="gap-2 rounded-xl font-extrabold"
        >
          <Users className="size-4" />
          Manage Users
        </Button>
        <Button
          type="button"
          variant={activeTab === "posts" ? "default" : "ghost"}
          onClick={() => setActiveTab("posts")}
          className="gap-2 rounded-xl font-extrabold"
        >
          <FileText className="size-4" />
          Stories
        </Button>
        <Button
          type="button"
          variant={activeTab === "categories" ? "default" : "ghost"}
          onClick={() => setActiveTab("categories")}
          className="gap-2 rounded-xl font-extrabold"
        >
          <FolderOpen className="size-4" />
          Categories
        </Button>
        <Button
          type="button"
          variant={activeTab === "tags" ? "default" : "ghost"}
          onClick={() => setActiveTab("tags")}
          className="gap-2 rounded-xl font-extrabold"
        >
          <TagIcon className="size-4" />
          Tags
        </Button>
      </div>

      {/* Tab: Users & Roles Management */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border bg-background py-2 pr-4 pl-9 text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          {usersQuery.isLoading ? (
            <PageLoader />
          ) : usersQuery.isError ? (
            <ErrorState description={getErrorMessage(usersQuery.error)} />
          ) : !usersQuery.data?.data?.length ? (
            <EmptyState
              icon={Users}
              title="No users found"
              description="Try adjusting your search filter."
            />
          ) : (
            <>
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-card shadow-xs dark:border-slate-800/80">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold">
                    <thead className="border-b bg-slate-50 tracking-wider text-muted-foreground uppercase dark:bg-slate-900/50">
                      <tr>
                        <th className="p-4">User</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Current Role</th>
                        <th className="p-4 text-right">Role Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {usersQuery.data.data.map((u) => {
                        const isSelf = Boolean(user && u.id === user.id)
                        return (
                          <tr
                            key={u.id}
                            className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                {u.avatar && u.avatar !== "string" ? (
                                  <OptimizedImage
                                    src={u.avatar}
                                    alt=""
                                    className="size-9 rounded-full"
                                  />
                                ) : (
                                  <div className="grid size-9 place-items-center rounded-full bg-primary/10 font-bold text-primary">
                                    {getInitials(
                                      `${u.first_name || ""} ${u.last_name || ""}`,
                                      u.first_name,
                                      u.last_name,
                                      u.username
                                    )}
                                  </div>
                                )}
                                <div>
                                  <p className="font-extrabold text-foreground">
                                    {u.first_name} {u.last_name}
                                  </p>
                                  <p className="text-[11px] text-muted-foreground">
                                    @{u.username}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 font-mono text-slate-600 dark:text-slate-400">
                              {u.email}
                            </td>
                            <td className="p-4">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${
                                  u.role === "admin"
                                    ? "border border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400"
                                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                }`}
                              >
                                {u.role === "admin" && (
                                  <ShieldCheck className="size-3" />
                                )}
                                {u.role.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {u.role === "user" ? (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={roleMutation.isPending}
                                    onClick={() =>
                                      roleMutation.mutate({
                                        userId: u.id,
                                        role: "admin",
                                      })
                                    }
                                    className="rounded-xl border-purple-200 font-bold text-purple-600 hover:bg-purple-500/10 dark:text-purple-400"
                                  >
                                    <UserCheck className="size-3.5" />
                                    Make Admin
                                  </Button>
                                ) : (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={isSelf || roleMutation.isPending}
                                    onClick={() =>
                                      roleMutation.mutate({
                                        userId: u.id,
                                        role: "user",
                                      })
                                    }
                                    className="rounded-xl font-bold text-slate-600"
                                  >
                                    <UserX className="size-3.5" />
                                    Demote to User
                                  </Button>
                                )}

                                {!isSelf && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    disabled={deleteUserMutation.isPending}
                                    onClick={() =>
                                      setDeleteUserTarget({ id: u.id, username: u.username })
                                    }
                                    className="text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {usersQuery.data?.meta && (
                <Pagination
                  page={usersPage}
                  totalPages={usersQuery.data.meta.total_pages ?? 1}
                  total={usersQuery.data.meta.total ?? 0}
                  onPageChange={setUsersPage}
                />
              )}
            </>
          )}
        </div>
      )}

      {/* Tab: Posts Overview */}
      {activeTab === "posts" && (
        <div className="space-y-4">
          {postsQuery.isLoading ? (
            <PageLoader />
          ) : !postsQuery.data?.data?.length ? (
            <EmptyState
              icon={FileText}
              title="No posts yet"
              description="No stories have been published yet."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {postsQuery.data.data.map((p) => (
                  <Card
                    key={p.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200/80 p-0 shadow-xs transition-shadow hover:shadow-md dark:border-slate-800/80"
                  >
                    {/* Cover Image */}
                    <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      {p.cover_image ? (
                        <OptimizedImage
                          src={p.cover_image}
                          alt={p.title}
                          sizes="(max-width: 640px) 100vw, 400px"
                          className="size-full"
                          imgClassName="transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <FileText className="size-10 text-slate-300 dark:text-slate-600" />
                        </div>
                      )}
                      {/* Status badge overlaid on image */}
                      <span
                        className={`absolute top-2 right-2 rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-sm ${
                          p.status === "Published"
                            ? "bg-emerald-500/90 text-white"
                            : p.status === "Draft"
                              ? "bg-slate-700/80 text-white"
                              : "bg-amber-500/90 text-white"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="space-y-1.5 p-4">
                      <h4 className="line-clamp-2 text-sm leading-snug font-extrabold text-foreground">
                        {p.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        By{" "}
                        <span className="font-bold text-foreground">
                          @{p.author?.username}
                        </span>{" "}
                        • <span className="font-medium">{p.category?.name}</span>
                      </p>
                      <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-slate-800">
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          {new Date(p.created_at).toLocaleDateString()}
                        </span>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          disabled={deletePostMutation.isPending}
                          onClick={() => setDeletePostTarget(p)}
                          className="gap-1.5 rounded-lg text-[11px] font-bold"
                        >
                          <Trash2 className="size-3.5" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              {postsQuery.data?.meta && (
                <Pagination
                  page={postsPage}
                  totalPages={postsQuery.data.meta.total_pages ?? 1}
                  total={postsQuery.data.meta.total ?? 0}
                  onPageChange={setPostsPage}
                />
              )}
            </>
          )}
        </div>
      )}

      {/* Tab: Categories Management */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-black text-foreground">Categories</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Add, rename, or delete post categories. Changes take effect
              immediately.
            </p>
          </div>
          <CrudList
            items={categoriesQuery.data}
            isLoading={categoriesQuery.isLoading}
            isError={categoriesQuery.isError}
            error={categoriesQuery.error}
            emptyIcon={FolderOpen}
            emptyTitle="No categories yet"
            emptyDescription="Create your first category to help users organise their stories."
            addPlaceholder="New category name…"
            onAdd={(name) => createCategoryMutation.mutate(name)}
            onUpdate={(id, name) => updateCategoryMutation.mutate({ id, name })}
            onDelete={(id) => deleteCategoryMutation.mutate(id)}
            isAdding={createCategoryMutation.isPending}
            isUpdating={updateCategoryMutation.isPending}
            isDeleting={deleteCategoryMutation.isPending}
          />
        </div>
      )}

      {/* Tab: Tags Management */}
      {activeTab === "tags" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-black text-foreground">Tags</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Add, rename, or delete tags. Tags help readers discover relevant
              content.
            </p>
          </div>
          <CrudList
            items={tagsQuery.data}
            isLoading={tagsQuery.isLoading}
            isError={tagsQuery.isError}
            error={tagsQuery.error}
            emptyIcon={TagIcon}
            emptyTitle="No tags yet"
            emptyDescription="Create your first tag to help categorise content."
            addPlaceholder="New tag name…"
            onAdd={(name) => createTagMutation.mutate(name)}
            onUpdate={(id, name) => updateTagMutation.mutate({ id, name })}
            onDelete={(id) => deleteTagMutation.mutate(id)}
            isAdding={createTagMutation.isPending}
            isUpdating={updateTagMutation.isPending}
            isDeleting={deleteTagMutation.isPending}
          />
        </div>
      )}

      <ConfirmDialog
        open={deletePostTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeletePostTarget(null)
        }}
        title="Delete story?"
        description={
          deletePostTarget
            ? `Are you sure you want to delete "${deletePostTarget.title}"? This cannot be undone and will remove the story for everyone.`
            : ""
        }
        confirmLabel="Delete story"
        isConfirming={deletePostMutation.isPending}
        onConfirm={() => {
          if (deletePostTarget) {
            deletePostMutation.mutate(deletePostTarget.id)
            setDeletePostTarget(null)
          }
        }}
      />

      <ConfirmDialog
        open={deleteUserTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteUserTarget(null)
        }}
        title="Delete user?"
        description={
          deleteUserTarget
            ? `Are you sure you want to delete "${deleteUserTarget.username}"? This action cannot be undone and will remove the user and their content.`
            : ""
        }
        confirmLabel="Delete user"
        isConfirming={deleteUserMutation.isPending}
        onConfirm={() => {
          if (deleteUserTarget) {
            deleteUserMutation.mutate(deleteUserTarget.id)
            setDeleteUserTarget(null)
          }
        }}
      />
    </div>
  )
}
