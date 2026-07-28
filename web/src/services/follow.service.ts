import { api } from "@/api/axios"

export const followService = {
  async getFollowers(userId: string) {
    const response = await api.get(`/follows/followers/${userId}`)
    return response.data.data
  },

  async getFollowing(userId: string) {
    const response = await api.get(`/follows/following/${userId}`)
    return response.data.data
  },

  async followUser(userId: string) {
    const response = await api.post(`/follows/${userId}`)
    return response.data
  },

  async unfollowUser(userId: string) {
    const response = await api.delete(`/follows/${userId}`)
    return response.data
  },
}
