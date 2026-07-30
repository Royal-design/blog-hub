import { api } from "@/api/axios"
import type { ApiSuccess } from "@/types/api"
import type { Comment, CommentCreatePayload, CommentUpdatePayload } from "@/types/comment"

export const commentService = {
  async getPostComments(postId: string, params?: { page?: number; page_size?: number }) {
    const response = await api.get<ApiSuccess<Comment[]>>("/comments/", {
      params: { post_id: postId, ...params },
    })
    return response.data
  },

  async createComment(payload: CommentCreatePayload) {
    const response = await api.post<ApiSuccess<Comment>>("/comments/", payload)
    return response.data.data
  },

  async updateComment(commentId: string, payload: CommentUpdatePayload) {
    const response = await api.put<ApiSuccess<Comment>>(`/comments/${commentId}`, payload)
    return response.data.data
  },

  async deleteComment(commentId: string) {
    await api.delete(`/comments/${commentId}`)
  },
}
