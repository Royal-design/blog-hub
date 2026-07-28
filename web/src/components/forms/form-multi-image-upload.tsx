import { ImagePlus, Images, Trash2 } from "lucide-react"
import * as React from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"

export interface MultiImageItem {
  id: string
  file: File
  previewUrl: string
  altText: string
}

export interface FormMultiImageUploadProps {
  label: string
  description?: string
  images: MultiImageItem[]
  onChange: (images: MultiImageItem[]) => void
  containerClassName?: string
}

export function FormMultiImageUpload({
  label,
  description,
  images,
  onChange,
  containerClassName,
}: FormMultiImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (!selectedFiles.length) return

    const newItems: MultiImageItem[] = selectedFiles.map((file, idx) => ({
      id: `${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      altText: file.name.replace(/\.[^/.]+$/, ""),
    }))

    onChange([...images, ...newItems])
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const handleRemove = (id: string) => {
    onChange(images.filter((img) => img.id !== id))
  }

  const handleAltChange = (id: string, altText: string) => {
    onChange(images.map((img) => (img.id === id ? { ...img, altText } : img)))
  }

  return (
    <Field className={cn("w-full space-y-2", containerClassName)}>
      <div className="flex items-center justify-between">
        <FieldLabel className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-800 uppercase dark:text-slate-100">
          <Images className="size-4 text-primary" />
          {label}
        </FieldLabel>
        <span className="text-xs font-semibold text-muted-foreground">
          {images.length} Image{images.length === 1 ? "" : "s"} added
        </span>
      </div>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {/* Images Grid Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
          {images.map((item, index) => (
            <div
              key={item.id}
              className="group relative space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-950">
                <img
                  src={item.previewUrl}
                  alt={item.altText}
                  className="size-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-2 right-2 cursor-pointer rounded-xl bg-rose-600 p-1.5 text-white shadow-md transition-colors hover:bg-rose-700"
                  title="Remove image"
                >
                  <Trash2 className="size-3.5" />
                </button>
                <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
                  Image #{index + 1}
                </span>
              </div>

              <input
                type="text"
                value={item.altText}
                onChange={(e) => handleAltChange(item.id, e.target.value)}
                placeholder="Alt text / description..."
                className="h-8 w-full rounded-lg border border-slate-300 bg-background px-2.5 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/25 dark:border-slate-700"
              />
            </div>
          ))}
        </div>
      )}

      {/* Upload Drop Area */}
      <div
        onClick={() => inputRef.current?.click()}
        className="group relative flex cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-white/50 p-4 text-center transition-all duration-200 hover:border-primary/80 hover:bg-primary/5 dark:border-slate-700 dark:bg-secondary dark:hover:border-primary/80"
      >
        <div className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-primary/10 group-hover:text-primary dark:bg-slate-800 dark:text-slate-400">
          <ImagePlus className="size-5 stroke-[1.75]" />
        </div>
        <div className="text-left">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Click to add story gallery images
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Select multiple PNG, JPG, or WEBP images
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFilesSelect}
        className="hidden"
      />
    </Field>
  )
}
