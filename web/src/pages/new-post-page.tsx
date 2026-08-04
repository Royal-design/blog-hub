import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Eye, FileText, Loader2, Send } from "lucide-react"
import * as React from "react"
import { useForm, useWatch } from "react-hook-form"
import { useNavigate } from "react-router"
import { toast } from "sonner"

import { FormImageUpload } from "@/components/forms/form-image-upload"
import { FormInput } from "@/components/forms/form-input"
import {
  FormMultiImageUpload,
  type MultiImageItem,
} from "@/components/forms/form-multi-image-upload"
import { FormSelect } from "@/components/forms/form-select"
import { FormTextarea } from "@/components/forms/form-textarea"
import { TagMultiSelect } from "@/components/forms/tag-multi-select"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { queryKeys, useCategories, useTags } from "@/hooks/use-posts"
import { postSchema, type PostFormValues } from "@/schemas/post.schema"
import { postService } from "@/services/post.service"
import { getErrorMessage } from "@/utils/error"
import { getReadingTime } from "@/utils/reading-time"

export function NewPostPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const categoriesQuery = useCategories()
  const tagsQuery = useTags()

  const [tagIds, setTagIds] = React.useState<string[]>([])
  const [coverImageFile, setCoverImageFile] = React.useState<File | null>(null)
  const [coverImageUrl, setCoverImageUrl] = React.useState("")
  const [multiImages, setMultiImages] = React.useState<MultiImageItem[]>([])
  const [isPreviewMode, setIsPreviewMode] = React.useState(false)

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      category_id: "",
      status: "Published",
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

  const onSubmit = (values: PostFormValues) => {
    const formData = new FormData()
    formData.append("title", values.title.trim())
    if (values.excerpt?.trim()) {
      formData.append("excerpt", values.excerpt.trim())
    }
    formData.append("category_id", values.category_id)
    formData.append("status", values.status)
    formData.append("content", values.content.trim())

    if (coverImageFile) {
      formData.append("cover_image", coverImageFile)
    } else if (coverImageUrl.trim()) {
      formData.append("cover_image_url", coverImageUrl.trim())
    }

    tagIds.forEach((tagId) => {
      formData.append("tag_ids", tagId)
    })

    // Append file-based gallery images
    let position = 1
    multiImages.forEach((item) => {
      if (item.file) {
        formData.append("images", item.file)
        formData.append("image_alt_texts", item.altText || `Image ${position}`)
        formData.append("image_positions", String(position))
        position += 1
      }
    })

    // Append URL-based gallery images
    multiImages.forEach((item) => {
      if (item.url) {
        formData.append("image_urls", item.url)
        formData.append(
          "image_url_alt_texts",
          item.altText || `Image ${position}`
        )
        formData.append("image_url_positions", String(position))
        position += 1
      }
    })

    createPost.mutate(formData)
  }

  const categoryOptions =
    categoriesQuery.data?.map((c) => ({
      value: c.id,
      label: c.name,
    })) || []

  const statusOptions = [
    { value: "Published", label: "Published" },
    { value: "Draft", label: "Draft" },
  ]

  const watchTitle = useWatch({ control: form.control, name: "title" })
  const watchContent = useWatch({ control: form.control, name: "content" })
  const watchCategoryId = useWatch({
    control: form.control,
    name: "category_id",
  })
  const selectedCategoryName =
    categoriesQuery.data?.find((c) => c.id === watchCategoryId)?.name ||
    "Uncategorized"

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 pb-12">
      {/* Page Title & View Switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-wider text-primary uppercase">
            Story Editor
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
            Write a new story
          </h1>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
          <button
            type="button"
            onClick={() => setIsPreviewMode(false)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              !isPreviewMode
                ? "bg-white text-foreground shadow-xs dark:bg-slate-900"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="mr-1.5 inline size-3.5" />
            Editor
          </button>
          <button
            type="button"
            onClick={() => setIsPreviewMode(true)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              isPreviewMode
                ? "bg-white text-foreground shadow-xs dark:bg-slate-900"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="mr-1.5 inline size-3.5" />
            Preview
          </button>
        </div>
      </div>

      {isPreviewMode ? (
        <Card className="rounded-2xl border border-slate-200/80 p-6 shadow-md sm:p-8 dark:border-slate-800/80">
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {selectedCategoryName}
            </span>
            <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-foreground sm:text-5xl">
              {watchTitle || "Untitled Story"}
            </h1>
            <p className="text-xs font-semibold text-muted-foreground">
              Reading time: {getReadingTime(watchContent || "")}
            </p>
            <div className="border-t border-slate-200 pt-4 text-base leading-8 whitespace-pre-wrap text-foreground dark:border-slate-800">
              {watchContent ||
                "Start typing in the editor tab to preview your story content..."}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="rounded-2xl border border-slate-200/80 shadow-md dark:border-slate-800/80">
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
                description="Upload an image or paste a URL to display at the top of your story."
                onFileSelect={(file) => setCoverImageFile(file)}
                onUrlSelect={(url) => setCoverImageUrl(url ?? "")}
              />

              <FormMultiImageUpload
                label="Additional Story Images"
                description="Add multiple images for your article content."
                images={multiImages}
                onChange={setMultiImages}
              />

              <TagMultiSelect
                label="Tags"
                tags={tagsQuery.data || []}
                selectedTagIds={tagIds}
                onChange={setTagIds}
                placeholder="Select story tags from dropdown..."
                disabled={createPost.isPending || tagsQuery.isLoading}
              />

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
                  className="gap-2 rounded-xl font-bold shadow-md"
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
