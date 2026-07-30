import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { GoogleLogin } from "@react-oauth/google"
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
            <label className="flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-4 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary/30 accent-primary cursor-pointer"
              />
              <span className="font-semibold select-none">Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="font-bold text-primary hover:underline transition-colors shrink-0"
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

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-300 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-slate-900 px-3 font-bold text-muted-foreground">
                OR CONTINUE WITH
              </span>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <div className="flex justify-center">
            {googleLogin.isPending ? (
              <div className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 font-bold text-slate-800 dark:text-slate-200 shadow-sm">
                <Loader2 className="size-5 animate-spin stroke-[2.5]" />
                <span className="text-sm">Signing in...</span>
              </div>
            ) : (
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    googleLogin.mutate({
                      id_token: credentialResponse.credential,
                      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                    })
                  }
                }}
                onError={() => toast.error("Google sign-in failed")}
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
                width="400"
              />
            )}
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
