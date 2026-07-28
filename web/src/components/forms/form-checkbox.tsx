import * as React from "react"
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { Field, FieldError } from "@/components/ui/field"
import { cn } from "@/lib/utils"

export interface FormCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "type"> {
  control: Control<TFieldValues>
  name: TName
  label: string
  description?: string
  containerClassName?: string
}

export function FormCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  containerClassName,
  id,
  className,
  disabled,
  ...props
}: FormCheckboxProps<TFieldValues, TName>) {
  const checkboxId = id || `form-checkbox-${name}`

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const isInvalid = Boolean(fieldState.error)

        return (
          <Field
            data-invalid={isInvalid}
            className={cn("w-full space-y-1", containerClassName)}
          >
            <label
              htmlFor={checkboxId}
              className="flex cursor-pointer items-start gap-2.5 text-slate-800 transition-colors hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
            >
              <input
                {...field}
                id={checkboxId}
                type="checkbox"
                checked={Boolean(field.value)}
                onChange={(e) => field.onChange(e.target.checked)}
                disabled={disabled}
                className={cn(
                  "mt-0.5 size-4 shrink-0 cursor-pointer rounded border-slate-300 text-primary accent-primary focus:ring-primary/30 dark:border-slate-700",
                  className
                )}
                {...props}
              />
              <div className="space-y-0.5">
                <span className="text-sm font-semibold select-none">
                  {label}
                </span>
                {description && (
                  <p className="text-xs font-normal text-slate-500 dark:text-slate-400">
                    {description}
                  </p>
                )}
              </div>
            </label>

            {isInvalid && (
              <div className="pt-0.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                <FieldError errors={[fieldState.error]} />
              </div>
            )}
          </Field>
        )
      }}
    />
  )
}
