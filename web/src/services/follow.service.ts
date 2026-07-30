import { api } from "@/api/axios"
import type { ApiSuccess } from "@/types/api"
import type { FollowerResponse, FollowingResponse } from "@/types/follow"

export const followService = {
  async getFollowers(userId: string, params?: { page?: number; page_size?: number }) {
    const response = await api.get<ApiSuccess<FollowerResponse[]>>(`/follows/followers/${userId}`, { params })
    return response.data
  },

  async getFollowing(userId: string, params?: { page?: number; page_size?: number }) {
    const response = await api.get<ApiSuccess<FollowingResponse[]>>(`/follows/following/${userId}`, { params })
    return response.data
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
