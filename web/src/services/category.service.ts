import { api } from "@/api/axios"
import type { ApiSuccess } from "@/types/api"
import type { Category } from "@/types/post"

export const categoryService = {
  async getCategories() {
    const response = await api.get<ApiSuccess<Category[]>>("/categories/")
    return response.data.data
  },
}
