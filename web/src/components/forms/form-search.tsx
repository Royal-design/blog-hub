import * as React from "react"
import { motion } from "framer-motion"
import { Search, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface FormSearchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  placeholder?: string
  shortcutHint?: string
  containerClassName?: string
}

export function FormSearch({
  value,
  onChange,
  onClear,
  placeholder = "Search posts, topics, or authors...",
  shortcutHint = "⌘K",
  containerClassName,
  className,
  ...props
}: FormSearchProps) {
  const [isFocused, setIsFocused] = React.useState(false)

  return (
    <div
      className={cn(
        "relative flex h-12 w-full items-center rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 px-3.5 shadow-xs transition-all duration-200",
        isFocused &&
          "border-primary ring-4 ring-primary/20 dark:border-primary dark:ring-primary/25 shadow-md shadow-primary/10",
        containerClassName
      )}
    >
      <Search
        className={cn(
          "size-4 shrink-0 transition-colors duration-200 text-slate-500 dark:text-slate-400",
          isFocused && "text-primary dark:text-primary"
        )}
        aria-hidden
      />

      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={cn(
          "h-full border-0 bg-transparent px-3 text-sm font-semibold text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal focus-visible:ring-0 shadow-none outline-none",
          className
        )}
        {...props}
      />

      {value ? (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => {
            onChange("")
            onClear?.()
          }}
          aria-label="Clear search"
          className="p-1 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="size-3.5 stroke-[2.5]" />
        </motion.button>
      ) : shortcutHint ? (
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-[10px] font-semibold text-slate-500 dark:text-slate-400">
          {shortcutHint}
        </kbd>
      ) : null}
    </div>
  )
}
