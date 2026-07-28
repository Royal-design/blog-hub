import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, ChevronDown } from "lucide-react"
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
> extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "name"> {
  control: Control<TFieldValues>
  name: TName
  label: string
  options: FormSelectOption[]
  placeholder?: string
  containerClassName?: string
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
  id,
  className,
  disabled,
  ...props
}: FormSelectProps<TFieldValues, TName>) {
  const selectId = id || `form-select-${name}`

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const isInvalid = Boolean(fieldState.error)

        return (
          <Field
            data-invalid={isInvalid}
            className={cn("w-full space-y-1.5", containerClassName)}
          >
            <FieldLabel
              htmlFor={selectId}
              className="text-xs font-bold tracking-wider text-slate-800 dark:text-slate-100 uppercase"
            >
              {label}
            </FieldLabel>

            <div className="relative flex items-center">
              <select
                {...field}
                id={selectId}
                value={field.value ?? ""}
                disabled={disabled}
                aria-invalid={isInvalid}
                className={cn(
                  "w-full h-12 appearance-none rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50 text-sm font-semibold pl-4 pr-10 transition-all duration-200 outline-none shadow-xs cursor-pointer",
                  !field.value && "text-slate-400 dark:text-slate-500 font-normal",
                  isInvalid &&
                    "border-rose-600 ring-4 ring-rose-600/20 text-rose-950 dark:text-rose-100 dark:border-rose-500 dark:ring-rose-500/25",
                  disabled &&
                    "opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800",
                  className
                )}
                {...props}
              >
                <option value="" disabled className="text-slate-400">
                  {placeholder}
                </option>
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value} className="text-slate-900 dark:text-slate-100">
                    {opt.label}
                  </option>
                ))}
              </select>

              <ChevronDown className="absolute right-3.5 size-4 pointer-events-none text-slate-500 dark:text-slate-400 stroke-[2]" />
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
