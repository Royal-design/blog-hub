import { ImagePlus, X } from "lucide-react"
import * as React from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"

export interface FormImageUploadProps {
  label: string
  description?: string
  previewUrl?: string | null
  onFileSelect: (file: File | null) => void
  accept?: string
  containerClassName?: string
}

export function FormImageUpload({
  label,
  description,
  previewUrl,
  onFileSelect,
  accept = "image/*",
  containerClassName,
}: FormImageUploadProps) {
  const [internalPreview, setInternalPreview] = React.useState<string | null>(
    null
  )
  const inputRef = React.useRef<HTMLInputElement>(null)

  const activePreview = previewUrl || internalPreview

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      const url = URL.createObjectURL(file)
      setInternalPreview(url)
      onFileSelect(file)
    }
  }

  const handleClear = () => {
    setInternalPreview(null)
    onFileSelect(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <Field className={cn("w-full space-y-1.5", containerClassName)}>
      <FieldLabel className="text-xs font-bold tracking-wider text-slate-800 uppercase dark:text-slate-100">
        {label}
      </FieldLabel>

      {activePreview ? (
        <div className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-slate-300 bg-slate-950 sm:aspect-[21/9] dark:border-slate-700">
          <img
            src={activePreview}
            alt="Upload preview"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-xl bg-white/90 px-3.5 py-1.5 text-xs font-bold text-slate-900 shadow-md transition-colors hover:bg-white"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl bg-rose-600 p-1.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-rose-700"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white/50 p-6 text-center transition-all duration-200 hover:border-primary/80 hover:bg-primary/5 dark:border-slate-700 dark:bg-secondary dark:hover:border-primary/80"
        >
          <div className="mb-2 grid size-12 place-items-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-primary/10 group-hover:text-primary dark:bg-slate-800 dark:text-slate-400">
            <ImagePlus className="size-6 stroke-[1.75]" />
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Click to upload cover image
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            PNG, JPG, WEBP up to 5MB
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
    </Field>
  )
}
