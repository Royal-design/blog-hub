import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, Check, ChevronDown } from "lucide-react"
import * as React from "react"
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"

export interface FormSelectOption {
  value: string
  label: string
}

export interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  label: string
  options: FormSelectOption[]
  placeholder?: string
  containerClassName?: string
  className?: string
  disabled?: boolean
}

export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  options,
  placeholder = "Select an option",
  containerClassName,
  className,
  disabled,
}: FormSelectProps<TFieldValues, TName>) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Handle click outside to close dropdown
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

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const isInvalid = Boolean(fieldState.error)
        const selectedOption = options.find((opt) => opt.value === field.value)

        return (
          <Field
            data-invalid={isInvalid}
            className={cn("w-full space-y-1.5", containerClassName)}
          >
            <FieldLabel className="text-xs font-bold tracking-wider text-slate-800 uppercase dark:text-slate-100">
              {label}
            </FieldLabel>

            <div ref={containerRef} className="relative w-full">
              {/* Trigger Button */}
              <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setIsOpen((prev) => !prev)}
                className={cn(
                  "flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border border-slate-300 bg-white/90 px-4 text-left text-sm font-semibold text-slate-900 shadow-xs transition-all duration-200 outline-none dark:border-slate-700 dark:bg-secondary dark:text-slate-50",
                  !field.value &&
                    "font-normal text-slate-400 dark:text-slate-500",
                  isOpen && "border-primary ring-2 ring-primary/25",
                  isInvalid &&
                    "border-rose-600 text-rose-950 ring-4 ring-rose-600/20 dark:border-rose-500 dark:text-rose-100 dark:ring-rose-500/25",
                  disabled &&
                    "cursor-not-allowed bg-slate-100 opacity-60 dark:bg-slate-800",
                  className
                )}
              >
                <span className="truncate">
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-slate-500 transition-transform duration-200",
                    isOpen && "rotate-180 text-primary"
                  )}
                />
              </button>

              {/* Options Popover List */}
              <AnimatePresence>
                {isOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: 4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute z-50 mt-1.5 max-h-60 w-full overflow-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95"
                  >
                    {options.length ? (
                      options.map((opt) => {
                        const isSelected = opt.value === field.value

                        return (
                          <li
                            key={opt.value}
                            onClick={() => {
                              field.onChange(opt.value)
                              setIsOpen(false)
                            }}
                            className={cn(
                              "flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors",
                              isSelected
                                ? "bg-primary/10 font-extrabold text-primary"
                                : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                            )}
                          >
                            <span className="truncate">{opt.label}</span>
                            {isSelected && (
                              <Check className="size-4 shrink-0 text-primary" />
                            )}
                          </li>
                        )
                      })
                    ) : (
                      <li className="p-3 text-center text-xs text-muted-foreground italic">
                        No options available
                      </li>
                    )}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              {isInvalid && (
                <motion.div
                  initial={{ opacity: 0, y: -4, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -4, height: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="flex items-center gap-1.5 pt-0.5 text-xs font-bold text-rose-600 dark:text-rose-400"
                >
                  <AlertCircle className="size-4 shrink-0 stroke-[2.5]" />
                  <FieldError errors={[fieldState.error]} />
                </motion.div>
              )}
            </AnimatePresence>
          </Field>
        )
      }}
    />
  )
}
