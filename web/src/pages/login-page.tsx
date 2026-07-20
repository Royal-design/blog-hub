import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { Link, Navigate, useLocation } from "react-router"

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
import { useLogin } from "@/hooks/use-auth"
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema"
import { useAuthStore } from "@/store/auth.store"

export function LoginPage() {
  const user = useAuthStore((state) => state.user)
  const login = useLogin()
  const location = useLocation()
  const from = location.state?.from ?? "/"
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  if (user) {
    return <Navigate to={from} replace />
  }

  return (
    <div className="mx-auto grid min-h-[calc(100svh-8rem)] w-full max-w-md place-items-center">
      <Card className="w-full shadow-xl shadow-black/10">
        <CardHeader>
          <CardTitle>Sign in to Blog Hub</CardTitle>
          <CardDescription>
            Continue to your reading and publishing workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="login-form"
            onSubmit={form.handleSubmit((values) => login.mutate(values))}
          >
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="login-email"
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
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
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
            form="login-form"
            size="lg"
            disabled={login.isPending}
          >
            {login.isPending ? <Loader2 className="animate-spin" /> : null}
            Sign in
          </Button>
          <div className="flex items-center justify-between text-sm">
            <Link className="text-primary hover:underline" to="/forgot-password">
              Forgot password?
            </Link>
            <Link
              className="text-muted-foreground hover:text-foreground"
              to="/register"
            >
              Create account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
