import { api } from "@/api/axios"

export const followService = {
  async followUser(userId: string) {
    const response = await api.post(`/follows/${userId}`)
    return response.data
  },

  async unfollowUser(userId: string) {
    const response = await api.delete(`/follows/${userId}`)
    return response.data
  },
}
