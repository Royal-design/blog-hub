import { api } from "@/api/axios"
import type { ApiSuccess } from "@/types/api"

export type Comment = {
  id: string
  content: string
  user_id: string
  post_id: string
  parent_id?: string | null
  created_at: string
  updated_at: string
}

export const commentService = {
  async getPostComments(postId: string) {
    const response = await api.get<ApiSuccess<Comment[]>>("/comments/", {
      params: { post_id: postId },
    })
    return response.data.data
  },
}
