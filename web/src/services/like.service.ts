import { api } from "@/api/axios"
import type { ApiSuccess } from "@/types/api"
import type { Like, LikedPost } from "@/types/like"

export const likeService = {
  async getMyLikes(params?: { page?: number; page_size?: number }) {
    const response = await api.get<ApiSuccess<LikedPost[]>>("/likes/me", { params })
    return response.data
  },

  async likePost(postId: string) {
    const response = await api.post<ApiSuccess<Like>>(`/likes/posts/${postId}`)
    return response.data.data
  },

  async unlikePost(postId: string) {
    await api.delete(`/likes/posts/${postId}`)
  },
}
