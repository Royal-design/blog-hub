import { z } from "zod"

export const postSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters.")
    .max(160, "Title cannot exceed 160 characters."),
  excerpt: z.string().optional(),
  category_id: z.string().min(1, "Please select a category."),
  status: z.enum(["Published", "Draft"], {
    message: "Status must be PUBLISHED or DRAFT.",
  }),
  content: z.string().min(10, "Content must be at least 10 characters long."),
})

export type PostFormValues = z.infer<typeof postSchema>
