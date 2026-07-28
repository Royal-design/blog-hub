import { api } from "@/api/axios"
import type { ApiSuccess } from "@/types/api"
import type { LikedPost } from "@/types/like"

export const bookmarkService = {
  async getMyBookmarks() {
    const response = await api.get<ApiSuccess<LikedPost[]>>("/bookmarks/me")
    return response.data.data
  },

  async bookmarkPost(postId: string) {
    const response = await api.post(`/bookmarks/posts/${postId}`)
    return response.data
  },

  async removeBookmark(postId: string) {
    await api.delete(`/bookmarks/posts/${postId}`)
  },
}
