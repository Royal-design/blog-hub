import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, Mail } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link } from "react-router"
import { toast } from "sonner"

import { AuthCard } from "@/components/auth/auth-card"
import { AuthLayout } from "@/components/auth/auth-layout"
import { FormInput } from "@/components/forms/form-input"
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/schemas/auth.schema"
import { authService } from "@/services/auth.service"
import { getErrorMessage } from "@/utils/error"

export function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  })

  async function submit(values: ForgotPasswordFormValues) {
    setIsSubmitting(true)
    try {
      await authService.forgotPassword(values.email)
      toast.success("If the account exists, a reset link has been sent.")
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      brandBadgeText="Account Recovery"
      brandHeadline="Reset Your Password Quickly & Securely"
      brandSubheadline="Enter your registered email address below, and we will send you a secure link to reset your account password."
    >
      <AuthCard
        title="Reset your password"
        description="Enter your email and Blog Hub will send the reset link through the backend."
        footer={
          <p className="text-center text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
            Remembered your password?{" "}
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
          id="forgot-password-form"
          onSubmit={form.handleSubmit(submit)}
          className="space-y-5"
        >
          <FormInput
            control={form.control}
            name="email"
            label="Email address"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            leadingIcon={<Mail className="size-4 stroke-[2]" />}
            disabled={isSubmitting}
          />

          <motion.button
            type="submit"
            form="forgot-password-form"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className="relative flex h-12 w-full items-center justify-center rounded-xl bg-primary px-6 font-bold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/95 focus:outline-none focus:ring-4 focus:ring-primary/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer overflow-hidden group"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2 text-sm font-bold">
                <Loader2 className="size-4 animate-spin stroke-[2.5]" />
                Sending reset link...
              </span>
            ) : (
              <span className="text-sm font-bold">Send reset link</span>
            )}
          </motion.button>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
