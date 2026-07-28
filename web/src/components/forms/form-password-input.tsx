import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, ArrowUp, Eye, EyeOff } from "lucide-react"
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { PasswordStrengthMeter } from "@/components/auth/password-strength-meter"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface FormPasswordInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "type"> {
  control: Control<TFieldValues>
  name: TName
  label: string
  leadingIcon?: React.ReactNode
  showStrengthMeter?: boolean
  containerClassName?: string
}

export function FormPasswordInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  leadingIcon,
  showStrengthMeter = false,
  containerClassName,
  id,
  className,
  disabled,
  ...props
}: FormPasswordInputProps<TFieldValues, TName>) {
  const [showPassword, setShowPassword] = React.useState(false)
  const [isCapsLockOn, setIsCapsLockOn] = React.useState(false)
  const inputId = id || `form-password-input-${name}`

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCapsLockOn(e.getModifierState("CapsLock"))
    props.onKeyDown?.(e)
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCapsLockOn(e.getModifierState("CapsLock"))
    props.onKeyUp?.(e)
  }

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
            <div className="flex items-center justify-between">
              <FieldLabel
                htmlFor={inputId}
                className="text-xs font-bold tracking-wider text-slate-800 dark:text-slate-100 uppercase"
              >
                {label}
              </FieldLabel>

              {isCapsLockOn && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30"
                >
                  <ArrowUp className="size-3 stroke-[2.5]" />
                  Caps Lock ON
                </motion.span>
              )}
            </div>

            <div className="relative flex items-center group">
              {leadingIcon && (
                <div
                  className={cn(
                    "absolute left-3.5 flex items-center justify-center pointer-events-none transition-colors duration-200 text-slate-500 dark:text-slate-400",
                    isInvalid && "text-rose-600 dark:text-rose-400"
                  )}
                >
                  {leadingIcon}
                </div>
              )}

              <Input
                {...field}
                id={inputId}
                type={showPassword ? "text" : "password"}
                value={field.value ?? ""}
                disabled={disabled}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                aria-invalid={isInvalid}
                className={cn(
                  "w-full h-12 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50 text-sm font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal transition-all duration-200 outline-none shadow-xs pr-11",
                  leadingIcon ? "pl-11" : "pl-4",
                  isInvalid &&
                    "border-rose-600 ring-4 ring-rose-600/20 text-rose-950 dark:text-rose-100 dark:border-rose-500 dark:ring-rose-500/25",
                  disabled &&
                    "opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800",
                  className
                )}
                {...props}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {showPassword ? (
                  <EyeOff className="size-4 stroke-[2]" aria-hidden />
                ) : (
                  <Eye className="size-4 stroke-[2]" aria-hidden />
                )}
              </button>
            </div>

            {showStrengthMeter && (
              <PasswordStrengthMeter password={field.value ?? ""} />
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
