import { z } from "zod"

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
})

export const registerSchema = z
  .object({
    first_name: z
      .string()
      .min(2, "First name must be at least 2 characters."),
    last_name: z
      .string()
      .min(2, "Last name must be at least 2 characters."),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters.")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Use letters, numbers, and underscores only."
      ),
    email: z.email("Enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters."),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  })

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address."),
})

export const resetPasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters."),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  })

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
