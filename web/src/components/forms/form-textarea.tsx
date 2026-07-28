import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle } from "lucide-react"
import * as React from "react"
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export interface FormTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> {
  control: Control<TFieldValues>
  name: TName
  label: string
  description?: string
  containerClassName?: string
}

export function FormTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  containerClassName,
  id,
  rows = 4,
  className,
  disabled,
  maxLength,
  ...props
}: FormTextareaProps<TFieldValues, TName>) {
  const textareaId = id || `form-textarea-${name}`

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const isInvalid = Boolean(fieldState.error)
        const currentLength = (field.value ?? "").length

        return (
          <Field
            data-invalid={isInvalid}
            className={cn("w-full space-y-1.5", containerClassName)}
          >
            <div className="flex items-center justify-between">
              <FieldLabel
                htmlFor={textareaId}
                className="text-xs font-bold tracking-wider text-slate-800 uppercase dark:text-slate-100"
              >
                {label}
              </FieldLabel>

              {maxLength && (
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {currentLength}/{maxLength}
                </span>
              )}
            </div>

            <Textarea
              {...field}
              id={textareaId}
              rows={rows}
              value={field.value ?? ""}
              disabled={disabled}
              maxLength={maxLength}
              aria-invalid={isInvalid}
              className={cn(
                "max-h-[200px] min-h-24 w-full resize-none rounded-xl border border-slate-300 bg-white/90 p-3.5 text-sm font-medium text-slate-900 shadow-xs transition-all duration-200 outline-none placeholder:font-normal placeholder:text-slate-400 dark:border-slate-700 dark:text-slate-50 dark:placeholder:text-slate-500",
                isInvalid &&
                  "border-rose-600 text-rose-950 ring-4 ring-rose-600/20 dark:border-rose-500 dark:text-rose-100 dark:ring-rose-500/25",
                disabled &&
                  "cursor-not-allowed bg-slate-100 opacity-60 dark:bg-slate-800",
                className
              )}
              {...props}
            />

            {description && !isInvalid && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {description}
              </p>
            )}

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
