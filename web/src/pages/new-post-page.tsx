import * as React from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Eye, FileText, Loader2, Send } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { useNavigate } from "react-router"
import { toast } from "sonner"

import { FormImageUpload } from "@/components/forms/form-image-upload"
import { FormInput } from "@/components/forms/form-input"
import { FormSelect } from "@/components/forms/form-select"
import { FormTextarea } from "@/components/forms/form-textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { queryKeys, useCategories, useTags } from "@/hooks/use-posts"
import { postService } from "@/services/post.service"
import type { PostStatus } from "@/types/post"
import { getErrorMessage } from "@/utils/error"
import { getReadingTime } from "@/utils/reading-time"

interface NewPostFormValues {
  title: string
  excerpt: string
  category_id: string
  status: PostStatus
  content: string
}

export function NewPostPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const categoriesQuery = useCategories()
  const tagsQuery = useTags()

  const [tagIds, setTagIds] = React.useState<string[]>([])
  const [coverImageFile, setCoverImageFile] = React.useState<File | null>(null)
  const [isPreviewMode, setIsPreviewMode] = React.useState(false)

  const form = useForm<NewPostFormValues>({
    defaultValues: {
      title: "",
      excerpt: "",
      category_id: "",
      status: "PUBLISHED",
      content: "",
    },
  })

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

  const onSubmit = (values: NewPostFormValues) => {
    if (!values.category_id) {
      toast.error("Please select a category.")
      return
    }

    const formData = new FormData()
    formData.append("title", values.title)
    formData.append("excerpt", values.excerpt)
    formData.append("category_id", values.category_id)
    formData.append("status", values.status)
    formData.append("content", values.content)

    if (coverImageFile) {
      formData.append("cover_image", coverImageFile)
    }

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

  const categoryOptions =
    categoriesQuery.data?.map((c) => ({
      value: c.id,
      label: c.name,
    })) || []

  const statusOptions = [
    { value: "PUBLISHED", label: "Published" },
    { value: "DRAFT", label: "Draft" },
  ]

  const watchTitle = useWatch({ control: form.control, name: "title" })
  const watchContent = useWatch({ control: form.control, name: "content" })
  const watchCategoryId = useWatch({ control: form.control, name: "category_id" })
  const selectedCategoryName =
    categoriesQuery.data?.find((c) => c.id === watchCategoryId)?.name ||
    "Uncategorized"

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      {/* Page Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Story Editor
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
            Write a new story
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setIsPreviewMode(false)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !isPreviewMode
                ? "bg-white dark:bg-slate-900 text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="size-3.5 inline mr-1.5" />
            Editor
          </button>
          <button
            type="button"
            onClick={() => setIsPreviewMode(true)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isPreviewMode
                ? "bg-white dark:bg-slate-900 text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="size-3.5 inline mr-1.5" />
            Preview
          </button>
        </div>
      </div>

      {isPreviewMode ? (
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-md">
          <div className="space-y-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              {selectedCategoryName}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              {watchTitle || "Untitled Story"}
            </h1>
            <p className="text-xs text-muted-foreground font-semibold">
              Reading time: {getReadingTime(watchContent)}
            </p>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 whitespace-pre-wrap text-base leading-8 text-foreground">
              {watchContent || "Start typing in the editor tab to preview your story content..."}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Story Details</CardTitle>
            <CardDescription className="text-xs font-medium">
              Fill out the publication details below and send your story live.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              id="new-post-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormInput
                control={form.control}
                name="title"
                label="Story Title"
                placeholder="Enter a compelling title..."
                maxLength={160}
                disabled={createPost.isPending}
              />

              <FormTextarea
                control={form.control}
                name="excerpt"
                label="Short Excerpt"
                placeholder="A brief preview summary for readers..."
                rows={3}
                disabled={createPost.isPending}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormSelect
                  control={form.control}
                  name="category_id"
                  label="Category"
                  options={categoryOptions}
                  placeholder="Select category"
                  disabled={createPost.isPending || categoriesQuery.isLoading}
                />

                <FormSelect
                  control={form.control}
                  name="status"
                  label="Publish Status"
                  options={statusOptions}
                  disabled={createPost.isPending}
                />
              </div>

              <FormImageUpload
                label="Cover Image"
                description="Upload an image to display at the top of your story."
                onFileSelect={(file) => setCoverImageFile(file)}
              />

              {tagsQuery.data?.length ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold tracking-wider text-slate-800 dark:text-slate-100 uppercase">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {tagsQuery.data.map((tag) => {
                      const checked = tagIds.includes(tag.id)

                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => toggleTag(tag.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            checked
                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          <span>{checked ? "✓" : "+"}</span>
                          <span>{tag.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : null}

              <FormTextarea
                control={form.control}
                name="content"
                label="Content"
                placeholder="Write your story content here..."
                rows={14}
                disabled={createPost.isPending}
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="submit"
                  form="new-post-form"
                  size="lg"
                  disabled={createPost.isPending}
                  className="font-bold rounded-xl shadow-md gap-2"
                >
                  {createPost.isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin stroke-[2.5]" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="size-4 stroke-[2.5]" />
                      Publish Story
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
