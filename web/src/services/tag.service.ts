import { api } from "@/api/axios"
import type { ApiSuccess } from "@/types/api"
import type { Tag } from "@/types/post"

export const tagService = {
  async getTags() {
    const response = await api.get<ApiSuccess<Tag[]>>("/tags/")
    return response.data.data
  },

  async createTag(name: string) {
    const response = await api.post<ApiSuccess<Tag>>("/tags/", { name })
    return response.data.data
  },

  async updateTag(id: string, name: string) {
    const response = await api.put<ApiSuccess<Tag>>(`/tags/${id}`, { name })
    return response.data.data
  },

  async deleteTag(id: string) {
    const response = await api.delete<ApiSuccess<Tag>>(`/tags/${id}`)
    return response.data.data
  },
}
