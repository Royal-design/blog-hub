import * as React from "react"
import { ImagePlus, X } from "lucide-react"

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
  const [internalPreview, setInternalPreview] = React.useState<string | null>(null)
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
      <FieldLabel className="text-xs font-bold tracking-wider text-slate-800 dark:text-slate-100 uppercase">
        {label}
      </FieldLabel>

      {activePreview ? (
        <div className="relative rounded-2xl border border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-950 group aspect-video sm:aspect-[21/9] flex items-center justify-center">
          <img
            src={activePreview}
            alt="Upload preview"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-xl bg-white/90 text-slate-900 font-bold text-xs shadow-md hover:bg-white transition-colors"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md hover:bg-rose-700 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary/80 dark:hover:border-primary/80 rounded-2xl bg-white/50 dark:bg-slate-900/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer text-center group"
        >
          <div className="grid size-12 place-items-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors mb-2">
            <ImagePlus className="size-6 stroke-[1.75]" />
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Click to upload cover image
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      )}
    </Field>
  )
}
