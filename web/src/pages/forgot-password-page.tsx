import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { Link } from "react-router"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
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
    <div className="mx-auto grid min-h-[calc(100svh-8rem)] w-full max-w-md place-items-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>
            Enter your email and Blog Hub will send the reset link through the
            backend.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="forgot-password-form" onSubmit={form.handleSubmit(submit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="forgot-password-email">
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      id="forgot-password-email"
                      type="email"
                      autoComplete="email"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-4">
          <Button
            type="submit"
            form="forgot-password-form"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : null}
            Send reset link
          </Button>
          <Link
            className="text-center text-sm text-primary hover:underline"
            to="/login"
          >
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
