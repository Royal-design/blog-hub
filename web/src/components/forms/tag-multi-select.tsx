import { AnimatePresence, motion } from "framer-motion"
import { Check, ChevronDown, Tag as TagIcon, X } from "lucide-react"
import * as React from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import type { Tag } from "@/types/post"

export interface TagMultiSelectProps {
  label: string
  tags: Tag[]
  selectedTagIds: string[]
  onChange: (selectedIds: string[]) => void
  placeholder?: string
  disabled?: boolean
  containerClassName?: string
}

export function TagMultiSelect({
  label,
  tags,
  selectedTagIds,
  onChange,
  placeholder = "Select tags...",
  disabled,
  containerClassName,
}: TagMultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedTags = tags.filter((t) => selectedTagIds.includes(t.id))

  const toggleTag = (id: string) => {
    if (selectedTagIds.includes(id)) {
      onChange(selectedTagIds.filter((tId) => tId !== id))
    } else {
      onChange([...selectedTagIds, id])
    }
  }

  const removeTag = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(selectedTagIds.filter((tId) => tId !== id))
  }

  return (
    <Field className={cn("w-full space-y-1.5", containerClassName)}>
      <FieldLabel className="text-xs font-bold tracking-wider text-slate-800 uppercase dark:text-slate-100">
        {label}
      </FieldLabel>

      <div ref={containerRef} className="relative w-full">
        {/* Trigger */}
        <div
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className={cn(
            "flex min-h-12 w-full cursor-pointer flex-wrap items-center justify-between gap-1.5 rounded-xl border border-slate-300 bg-white/90 p-2.5 text-sm font-semibold text-slate-900 shadow-xs transition-all duration-200 dark:border-slate-700 dark:bg-secondary dark:text-slate-50",
            isOpen && "border-primary ring-2 ring-primary/25",
            disabled &&
              "cursor-not-allowed bg-slate-100 opacity-60 dark:bg-slate-800"
          )}
        >
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
            {selectedTags.length ? (
              selectedTags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary"
                >
                  <TagIcon className="size-3" />
                  {tag.name}
                  <button
                    type="button"
                    onClick={(e) => removeTag(tag.id, e)}
                    className="cursor-pointer rounded-full p-0.5 text-primary transition-colors hover:bg-primary/20"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))
            ) : (
              <span className="px-2 text-sm font-normal text-slate-400 dark:text-slate-500">
                {placeholder}
              </span>
            )}
          </div>
          <ChevronDown
            className={cn(
              "mr-1 size-4 shrink-0 text-slate-500 transition-transform duration-200",
              isOpen && "rotate-180 text-primary"
            )}
          />
        </div>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, y: 4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute z-50 mt-1.5 max-h-60 w-full overflow-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900"
            >
              {tags.length ? (
                tags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id)

                  return (
                    <li
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors",
                        isSelected
                          ? "bg-primary/10 font-extrabold text-primary"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <TagIcon className="size-3.5 text-slate-400" />
                        <span>{tag.name}</span>
                      </div>
                      {isSelected && (
                        <Check className="size-4 shrink-0 text-primary" />
                      )}
                    </li>
                  )
                })
              ) : (
                <li className="p-3 text-center text-xs text-muted-foreground italic">
                  No tags available
                </li>
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </Field>
  )
}
