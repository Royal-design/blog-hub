import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { AtSign, Loader2, Lock, Mail, User } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link, Navigate } from "react-router"

import { AuthCard } from "@/components/auth/auth-card"
import { AuthLayout } from "@/components/auth/auth-layout"
import { FormInput } from "@/components/forms/form-input"
import { FormPasswordInput } from "@/components/forms/form-password-input"
import { useRegister } from "@/hooks/use-auth"
import {
  registerSchema,
  type RegisterFormValues,
} from "@/schemas/auth.schema"
import { useAuthStore } from "@/store/auth.store"

interface ExtendedRegisterFormValues extends RegisterFormValues {
  confirm_password?: string
}

export function RegisterPage() {
  const user = useAuthStore((state) => state.user)
  const register = useRegister()

  const form = useForm<ExtendedRegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  })

  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = (values: ExtendedRegisterFormValues) => {
    if (values.confirm_password && values.confirm_password !== values.password) {
      form.setError("confirm_password", {
        type: "manual",
        message: "Passwords do not match.",
      })
      return
    }

    const payload = {
      first_name: values.first_name,
      last_name: values.last_name,
      username: values.username,
      email: values.email,
      password: values.password,
    }
    register.mutate(payload)
  }

  return (
    <AuthLayout
      brandBadgeText="Join the Movement"
      brandHeadline="Start Writing & Inspiring Readers Worldwide"
      brandSubheadline="Create your account to unlock full access to original articles, save favorites, and share your unique voice."
    >
      <AuthCard
        title="Create your account"
        description="Join Blog Hub and start sharing your stories with the world."
        className="max-w-[520px]"
        footer={
          <p className="text-center text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-primary hover:underline transition-colors ml-0.5"
            >
              Sign in
            </Link>
          </p>
        }
      >
        <form
          id="register-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormInput
              control={form.control}
              name="first_name"
              label="First name"
              placeholder="John"
              autoComplete="given-name"
              leadingIcon={<User className="size-4 stroke-[2]" />}
              disabled={register.isPending}
            />

            <FormInput
              control={form.control}
              name="last_name"
              label="Last name"
              placeholder="Doe"
              autoComplete="family-name"
              leadingIcon={<User className="size-4 stroke-[2]" />}
              disabled={register.isPending}
            />
          </div>

          <FormInput
            control={form.control}
            name="username"
            label="Username"
            placeholder="johndoe"
            autoComplete="username"
            leadingIcon={<AtSign className="size-4 stroke-[2]" />}
            disabled={register.isPending}
          />

          <FormInput
            control={form.control}
            name="email"
            label="Email address"
            type="email"
            placeholder="john@example.com"
            autoComplete="email"
            leadingIcon={<Mail className="size-4 stroke-[2]" />}
            disabled={register.isPending}
          />

          <FormPasswordInput
            control={form.control}
            name="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="new-password"
            leadingIcon={<Lock className="size-4 stroke-[2]" />}
            showStrengthMeter
            disabled={register.isPending}
          />

          <FormPasswordInput
            control={form.control}
            name="confirm_password"
            label="Confirm password"
            placeholder="••••••••"
            autoComplete="new-password"
            leadingIcon={<Lock className="size-4 stroke-[2]" />}
            disabled={register.isPending}
          />

          <motion.button
            type="submit"
            form="register-form"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={register.isPending}
            className="relative flex h-12 w-full items-center justify-center rounded-xl bg-primary px-6 font-bold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/95 focus:outline-none focus:ring-4 focus:ring-primary/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer overflow-hidden group mt-2"
          >
            {register.isPending ? (
              <span className="flex items-center gap-2 text-sm font-bold">
                <Loader2 className="size-4 animate-spin stroke-[2.5]" />
                Creating account...
              </span>
            ) : (
              <span className="text-sm font-bold">Create account</span>
            )}
          </motion.button>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
