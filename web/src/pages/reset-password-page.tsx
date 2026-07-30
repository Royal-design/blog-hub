import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, Lock, ShieldCheck } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link, useSearchParams } from "react-router"
import { toast } from "sonner"

import { AuthCard } from "@/components/auth/auth-card"
import { AuthLayout } from "@/components/auth/auth-layout"
import { FormPasswordInput } from "@/components/forms/form-password-input"
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/schemas/auth.schema"
import { authService } from "@/services/auth.service"
import { getErrorMessage } from "@/utils/error"

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  })

  async function submit(values: ResetPasswordFormValues) {
    if (!token) {
      toast.error("Invalid or missing reset token.")
      return
    }
    setIsSubmitting(true)
    try {
      await authService.resetPassword(token, values.new_password)
      setIsSuccess(true)
      toast.success("Password reset successfully.")
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!token) {
    return (
      <AuthLayout
        brandBadgeText="Invalid Link"
        brandHeadline="This reset link is invalid or expired"
        brandSubheadline="Please request a new password reset link from the forgot password page."
      >
        <AuthCard
          title="Invalid Token"
          description="The password reset link you used is missing or invalid."
          footer={
            <p className="text-center text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
              <Link
                to="/forgot-password"
                className="font-bold text-primary hover:underline transition-colors inline-flex items-center gap-1"
              >
                <ArrowLeft className="size-3.5" />
                Request new reset link
              </Link>
            </p>
          }
        >
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <ShieldCheck className="size-12 text-destructive/70" />
            <p className="text-sm text-muted-foreground">
              The reset token was not found in the URL. Please check your email
              link and try again.
            </p>
          </div>
        </AuthCard>
      </AuthLayout>
    )
  }

  if (isSuccess) {
    return (
      <AuthLayout
        brandBadgeText="Password Updated"
        brandHeadline="Your password has been reset successfully"
        brandSubheadline="You can now sign in with your new password."
      >
        <AuthCard
          title="Password Changed"
          description="Your password has been updated successfully."
          footer={
            <p className="text-center text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
              <Link
                to="/login"
                className="font-bold text-primary hover:underline transition-colors inline-flex items-center gap-1"
              >
                <ArrowLeft className="size-3.5" />
                Back to sign in
              </Link>
            </p>
          }
        >
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <ShieldCheck className="size-12 text-emerald-500" />
            <p className="text-sm text-muted-foreground">
              Your password has been reset. Sign in with your new credentials.
            </p>
            <Link
              to="/login"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-6 font-bold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/95 transition-all"
            >
              Sign in
            </Link>
          </div>
        </AuthCard>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      brandBadgeText="Create New Password"
      brandHeadline="Set a strong new password for your account"
      brandSubheadline="Choose a password that is unique and secure. Do not reuse passwords from other sites."
    >
      <AuthCard
        title="Reset your password"
        description="Enter your new password below."
        footer={
          <p className="text-center text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
            <Link
              to="/login"
              className="font-bold text-primary hover:underline transition-colors inline-flex items-center gap-1 ml-0.5"
            >
              <ArrowLeft className="size-3.5" />
              Back to sign in
            </Link>
          </p>
        }
      >
        <form
          id="reset-password-form"
          onSubmit={form.handleSubmit(submit)}
          className="space-y-5"
        >
          <FormPasswordInput
            control={form.control}
            name="new_password"
            label="New password"
            placeholder="••••••••"
            autoComplete="new-password"
            leadingIcon={<Lock className="size-4 stroke-[2]" />}
            disabled={isSubmitting}
          />

          <FormPasswordInput
            control={form.control}
            name="confirm_password"
            label="Confirm password"
            placeholder="••••••••"
            autoComplete="new-password"
            leadingIcon={<Lock className="size-4 stroke-[2]" />}
            disabled={isSubmitting}
          />

          <motion.button
            type="submit"
            form="reset-password-form"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className="relative flex h-12 w-full items-center justify-center rounded-xl bg-primary px-6 font-bold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/95 focus:outline-none focus:ring-4 focus:ring-primary/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer overflow-hidden group"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2 text-sm font-bold">
                <Loader2 className="size-4 animate-spin stroke-[2.5]" />
                Resetting password...
              </span>
            ) : (
              <span className="text-sm font-bold">Reset password</span>
            )}
          </motion.button>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
