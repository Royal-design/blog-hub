import { api } from "@/api/axios"
import type { ApiSuccess } from "@/types/api"
import type { Category } from "@/types/post"

export const categoryService = {
  async getCategories() {
    const response = await api.get<ApiSuccess<Category[]>>("/categories/")
    return response.data.data
  },

  async createCategory(name: string) {
    const response = await api.post<ApiSuccess<Category>>("/categories/", { name })
    return response.data.data
  },

  async updateCategory(id: string, name: string) {
    const response = await api.put<ApiSuccess<Category>>(`/categories/${id}`, { name })
    return response.data.data
  },

  async deleteCategory(id: string) {
    const response = await api.delete<ApiSuccess<Category>>(`/categories/${id}`)
    return response.data.data
  },
}
