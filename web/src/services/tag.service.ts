import { api } from "@/api/axios"
import type { ApiSuccess } from "@/types/api"
import type { Tag } from "@/types/post"

export const tagService = {
  async getTags() {
    const response = await api.get<ApiSuccess<Tag[]>>("/tags/")
    return response.data.data
  },
}
