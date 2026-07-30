import { api } from "@/api/axios"
import type { ApiSuccess } from "@/types/api"
import type { LikedPost } from "@/types/like"

export const bookmarkService = {
  async getMyBookmarks(params?: { page?: number; page_size?: number }) {
    const response = await api.get<ApiSuccess<LikedPost[]>>("/bookmarks/me", { params })
    return response.data
  },

  async bookmarkPost(postId: string) {
    const response = await api.post(`/bookmarks/posts/${postId}`)
    return response.data
  },

  async removeBookmark(postId: string) {
    await api.delete(`/bookmarks/posts/${postId}`)
  },
}
