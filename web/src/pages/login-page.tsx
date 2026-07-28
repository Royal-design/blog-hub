import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Loader2, Lock, Mail } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { Link, Navigate, useLocation } from "react-router"

import { AuthCard } from "@/components/auth/auth-card"
import { AuthInput } from "@/components/auth/auth-input"
import { AuthLayout } from "@/components/auth/auth-layout"
import { useLogin } from "@/hooks/use-auth"
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema"
import { useAuthStore } from "@/store/auth.store"

export function LoginPage() {
  const user = useAuthStore((state) => state.user)
  const login = useLogin()
  const location = useLocation()
  const from = location.state?.from ?? "/"

  const [rememberMe, setRememberMe] = React.useState(true)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  if (user) {
    return <Navigate to={from} replace />
  }

  return (
    <AuthLayout
      brandBadgeText="Blog Hub Platform"
      brandHeadline="Discover stories that inspire."
      brandSubheadline="Create, publish, and manage your content with Blog Hub. Join thousands of writers and readers today."
    >
      <AuthCard
        title="Welcome Back"
        description="Sign in to continue reading, writing, and managing your content on Blog Hub."
        footer={
          <p className="text-center text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-primary hover:underline transition-colors ml-0.5"
            >
              Create an account
            </Link>
          </p>
        }
      >
        <form
          id="login-form"
          onSubmit={form.handleSubmit((values) => login.mutate(values))}
          className="space-y-4"
        >
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <AuthInput
                {...field}
                label="Email address"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                leadingIcon={<Mail className="size-4 stroke-[2]" />}
                error={fieldState.error?.message}
                isValid={!fieldState.invalid && Boolean(field.value)}
                disabled={login.isPending}
              />
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <AuthInput
                {...field}
                label="Password"
                isPassword
                placeholder="••••••••"
                autoComplete="current-password"
                leadingIcon={<Lock className="size-4 stroke-[2]" />}
                error={fieldState.error?.message}
                isValid={!fieldState.invalid && Boolean(field.value)}
                disabled={login.isPending}
              />
            )}
          />

          <div className="flex items-center justify-between pt-1 text-xs sm:text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-4 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary/30 accent-primary cursor-pointer"
              />
              <span className="font-semibold">Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="font-bold text-primary hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <motion.button
            type="submit"
            form="login-form"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={login.isPending}
            className="relative flex h-12 w-full items-center justify-center rounded-xl bg-primary px-6 font-bold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/95 focus:outline-none focus:ring-4 focus:ring-primary/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer overflow-hidden group"
          >
            {login.isPending ? (
              <span className="flex items-center gap-2 text-sm font-bold">
                <Loader2 className="size-4 animate-spin stroke-[2.5]" />
                Signing in...
              </span>
            ) : (
              <span className="text-sm font-bold">Sign in</span>
            )}
          </motion.button>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
