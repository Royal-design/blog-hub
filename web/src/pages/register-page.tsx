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
import { registerSchema, type RegisterFormValues } from "@/schemas/auth.schema"
import { useAuthStore } from "@/store/auth.store"

export function RegisterPage() {
  const user = useAuthStore((state) => state.user)
  const register = useRegister()

  const form = useForm<RegisterFormValues>({
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

  const handleSubmit = (values: RegisterFormValues) => {
    register.mutate({
      first_name: values.first_name,
      last_name: values.last_name,
      username: values.username,
      email: values.email,
      password: values.password,
    })
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
          <p className="text-center text-xs font-medium text-slate-700 sm:text-sm dark:text-slate-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="ml-0.5 font-bold text-primary transition-colors hover:underline"
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
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
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
            className="group relative mt-2 flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary px-6 font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-200 hover:bg-primary/95 focus:ring-4 focus:ring-primary/25 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
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
