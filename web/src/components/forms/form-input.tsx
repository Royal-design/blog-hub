import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import * as React from "react"
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  control: Control<TFieldValues>
  name: TName
  label: string
  description?: string
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  containerClassName?: string
}

export function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  leadingIcon,
  trailingIcon,
  containerClassName,
  id,
  type = "text",
  className,
  disabled,
  ...props
}: FormInputProps<TFieldValues, TName>) {
  const inputId = id || `form-input-${name}`

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const isInvalid = Boolean(fieldState.error)
        const isValid = !isInvalid && Boolean(field.value)

        return (
          <Field
            data-invalid={isInvalid}
            className={cn("w-full space-y-1.5", containerClassName)}
          >
            <FieldLabel
              htmlFor={inputId}
              className="text-xs font-bold tracking-wider text-slate-800 uppercase dark:text-slate-100"
            >
              {label}
            </FieldLabel>

            <div className="group relative flex items-center">
              {leadingIcon && (
                <div
                  className={cn(
                    "pointer-events-none absolute left-3.5 flex items-center justify-center text-slate-500 transition-colors duration-200 dark:text-slate-400",
                    isInvalid && "text-rose-600 dark:text-rose-400"
                  )}
                >
                  {leadingIcon}
                </div>
              )}

              <Input
                {...field}
                id={inputId}
                type={type}
                value={field.value ?? ""}
                disabled={disabled}
                aria-invalid={isInvalid}
                className={cn(
                  "h-12 w-full rounded-xl border border-slate-300 bg-white/90 text-sm font-semibold text-slate-900 shadow-xs transition-all duration-200 outline-none placeholder:font-normal placeholder:text-slate-400 dark:border-slate-700 dark:text-slate-50 dark:placeholder:text-slate-500",
                  leadingIcon ? "pl-11" : "pl-4",
                  trailingIcon || isValid ? "pr-11" : "pr-4",
                  isInvalid &&
                    "border-rose-600 text-rose-950 ring-4 ring-rose-600/20 dark:border-rose-500 dark:text-rose-100 dark:ring-rose-500/25",
                  disabled &&
                    "cursor-not-allowed bg-slate-100 opacity-60 dark:bg-slate-800",
                  className
                )}
                {...props}
              />

              {trailingIcon ? (
                <div className="absolute right-3.5 flex items-center justify-center text-slate-500 dark:text-slate-400">
                  {trailingIcon}
                </div>
              ) : (
                isValid && (
                  <div className="pointer-events-none absolute right-3.5 flex items-center text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-4 stroke-[2.5]" />
                  </div>
                )
              )}
            </div>

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
