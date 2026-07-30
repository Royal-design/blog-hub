import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useGoogleLogin } from "@react-oauth/google"
import { motion } from "framer-motion"
import { Loader2, Lock, Mail } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link, Navigate, useLocation } from "react-router"
import { toast } from "sonner"

import { AuthCard } from "@/components/auth/auth-card"
import { AuthLayout } from "@/components/auth/auth-layout"
import { FormInput } from "@/components/forms/form-input"
import { FormPasswordInput } from "@/components/forms/form-password-input"
import { useGoogleLoginMutation, useLogin } from "@/hooks/use-auth"
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema"
import { useAuthStore } from "@/store/auth.store"

export function LoginPage() {
  const user = useAuthStore((state) => state.user)
  const login = useLogin()
  const location = useLocation()
  const from = location.state?.from ?? "/"
  const [rememberMe, setRememberMe] = React.useState(true)

  const googleLogin = useGoogleLoginMutation()

  const googleAuth = useGoogleLogin({
    flow: "implicit",
    onSuccess: (response) => {
      const idToken = (response as { id_token?: string }).id_token
      if (idToken) {
        googleLogin.mutate({
          id_token: idToken,
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        })
      }
    },
    onError: () => toast.error("Google sign-in failed"),
  })

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
        description="Sign in to your account to continue."
        footer={
          <p className="text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-primary hover:text-primary/80 hover:underline transition-all ml-0.5"
            >
              Create one
            </Link>
          </p>
        }
      >
        {/* Google Sign-In — first, prominent */}
        <div className="w-full min-w-0">
          <motion.button
            type="button"
            onClick={() => googleAuth()}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={googleLogin.isPending}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 font-semibold text-sm text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {googleLogin.isPending ? (
              <>
                <Loader2 className="size-5 animate-spin stroke-[2.5] shrink-0" />
                <span>Signing in with Google...</span>
              </>
            ) : (
              <>
                <svg className="size-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white dark:bg-slate-900 px-3 font-bold text-muted-foreground">
              OR
            </span>
          </div>
        </div>

        {/* Sign In Form */}
        <form
          id="login-form"
          onSubmit={form.handleSubmit((values) =>
            login.mutate({ ...values, rememberMe })
          )}
          className="space-y-4"
        >
          <FormInput
            control={form.control}
            name="email"
            label="Email address"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            leadingIcon={<Mail className="size-4 stroke-[2]" />}
            disabled={login.isPending}
          />

          <FormPasswordInput
            control={form.control}
            name="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="current-password"
            leadingIcon={<Lock className="size-4 stroke-[2]" />}
            disabled={login.isPending}
          />

          <div className="flex items-center justify-between pt-1 text-xs sm:text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-4 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary/30 accent-primary cursor-pointer"
              />
              <span className="font-medium select-none">Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="font-bold text-primary hover:text-primary/80 hover:underline transition-all shrink-0"
            >
              Forgot password?
            </Link>
          </div>

          <motion.button
            type="submit"
            form="login-form"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={login.isPending || googleLogin.isPending}
            className="relative flex h-12 w-full items-center justify-center rounded-xl bg-primary px-6 font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer overflow-hidden"
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
