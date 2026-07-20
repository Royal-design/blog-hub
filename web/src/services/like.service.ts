import { api } from "@/api/axios"

export const likeService = {
  async likePost(postId: string) {
    const response = await api.post(`/likes/posts/${postId}`)
    return response.data
  },

  async unlikePost(postId: string) {
    const response = await api.delete(`/likes/posts/${postId}`)
    return response.data
  },
}
