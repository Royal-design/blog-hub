import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, ArrowUp, CheckCircle2, Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

export interface AuthInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  isValid?: boolean
  leadingIcon?: React.ReactNode
  isPassword?: boolean
  containerClassName?: string
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  (
    {
      label,
      error,
      isValid,
      leadingIcon,
      isPassword = false,
      containerClassName,
      id,
      type = "text",
      className,
      value,
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    const [isCapsLockOn, setIsCapsLockOn] = React.useState(false)

    const generatedId = React.useId()
    const inputId = id || generatedId
    const inputType = isPassword ? (showPassword ? "text" : "password") : type

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isPassword) {
        setIsCapsLockOn(e.getModifierState("CapsLock"))
      }
      props.onKeyDown?.(e)
    }

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isPassword) {
        setIsCapsLockOn(e.getModifierState("CapsLock"))
      }
      props.onKeyUp?.(e)
    }

    return (
      <div className={cn("space-y-1.5 w-full", containerClassName)}>
        <div className="flex items-center justify-between">
          <label
            htmlFor={inputId}
            className="text-xs font-bold tracking-wider text-slate-800 dark:text-slate-100 uppercase"
          >
            {label}
          </label>
          {isPassword && isCapsLockOn && (
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
                isFocused && "text-primary dark:text-primary",
                error && "text-rose-600 dark:text-rose-400"
              )}
            >
              {leadingIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            value={value}
            onChange={onChange}
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            className={cn(
              "w-full h-12 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50 text-sm font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal transition-all duration-200 outline-none shadow-xs",
              leadingIcon ? "pl-11" : "pl-4",
              isPassword ? "pr-11" : isValid ? "pr-10" : "pr-4",
              isFocused &&
                "border-primary ring-4 ring-primary/20 shadow-md shadow-primary/10 dark:border-primary dark:ring-primary/25",
              error &&
                "border-rose-600 ring-4 ring-rose-600/20 text-rose-950 dark:text-rose-100 dark:border-rose-500 dark:ring-rose-500/25",
              disabled && "opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800",
              className
            )}
            {...props}
          />

          {isPassword ? (
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
          ) : (
            isValid &&
            !error &&
            Boolean(value) && (
              <div className="absolute right-3.5 flex items-center pointer-events-none text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-4 stroke-[2.5]" />
              </div>
            )
          )}
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex items-center gap-1.5 pt-1 text-xs font-bold text-rose-600 dark:text-rose-400"
            >
              <AlertCircle className="size-4 shrink-0 stroke-[2.5]" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

AuthInput.displayName = "AuthInput"
