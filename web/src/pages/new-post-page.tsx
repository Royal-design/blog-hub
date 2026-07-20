import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ImagePlus, Loader2, Send } from "lucide-react"
import * as React from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { queryKeys, useCategories, useTags } from "@/hooks/use-posts"
import { postService } from "@/services/post.service"
import type { PostStatus } from "@/types/post"
import { getErrorMessage } from "@/utils/error"

export function NewPostPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const categoriesQuery = useCategories()
  const tagsQuery = useTags()
  const [tagIds, setTagIds] = React.useState<string[]>([])
  const [status, setStatus] = React.useState<PostStatus>("PUBLISHED")

  const createPost = useMutation({
    mutationFn: postService.createPost,
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts })
      toast.success("Post created successfully.")
      navigate(`/posts/${post.slug}`)
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    formData.set("status", status)
    formData.delete("tag_ids")

    tagIds.forEach((tagId) => {
      formData.append("tag_ids", tagId)
    })

    createPost.mutate(formData)
  }

  function toggleTag(tagId: string) {
    setTagIds((current) =>
      current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId]
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">New post</p>
        <h1 className="mt-2 text-3xl font-semibold">Write a story</h1>
      </div>

      <form
        id="new-post-form"
        className="rounded-lg border bg-card p-5 sm:p-6"
        onSubmit={handleSubmit}
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="post-title">Title</FieldLabel>
            <Input id="post-title" name="title" required maxLength={160} />
          </Field>

          <Field>
            <FieldLabel htmlFor="post-excerpt">Excerpt</FieldLabel>
            <Textarea
              id="post-excerpt"
              name="excerpt"
              rows={3}
              placeholder="A short preview for readers"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="post-category">Category</FieldLabel>
              <select
                id="post-category"
                name="category_id"
                required
                disabled={categoriesQuery.isLoading}
                className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select category</option>
                {categoriesQuery.data?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field>
              <FieldLabel htmlFor="post-status">Status</FieldLabel>
              <select
                id="post-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as PostStatus)}
                className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
              </select>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="post-cover">Cover image</FieldLabel>
            <div className="flex items-center gap-3">
              <Input
                id="post-cover"
                name="cover_image"
                type="file"
                accept="image/*"
              />
              <ImagePlus className="size-4 shrink-0 text-muted-foreground" />
            </div>
          </Field>

          {tagsQuery.data?.length ? (
            <Field>
              <FieldLabel>Tags</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {tagsQuery.data.map((tag) => {
                  const checked = tagIds.includes(tag.id)

                  return (
                    <label
                      key={tag.id}
                      className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm transition-colors has-checked:border-primary has-checked:bg-primary/10"
                    >
                      <input
                        type="checkbox"
                        className="size-3.5"
                        checked={checked}
                        onChange={() => toggleTag(tag.id)}
                      />
                      {tag.name}
                    </label>
                  )
                })}
              </div>
            </Field>
          ) : null}

          <Field>
            <FieldLabel htmlFor="post-content">Content</FieldLabel>
            <Textarea id="post-content" name="content" rows={14} required />
          </Field>

          <Field orientation="horizontal">
            <FieldContent>
              <FieldDescription>
                The post will be sent to the FastAPI create endpoint.
              </FieldDescription>
            </FieldContent>
            <Button type="submit" disabled={createPost.isPending}>
              {createPost.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Send />
              )}
              Publish
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
