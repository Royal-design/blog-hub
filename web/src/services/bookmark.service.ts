import { api } from "@/api/axios"

export const bookmarkService = {
  async getMyBookmarks() {
    const response = await api.get("/bookmarks/me")
    return response.data
  },

  async bookmarkPost(postId: string) {
    const response = await api.post(`/bookmarks/posts/${postId}`)
    return response.data
  },

  async removeBookmark(postId: string) {
    const response = await api.delete(`/bookmarks/posts/${postId}`)
    return response.data
  },
}
