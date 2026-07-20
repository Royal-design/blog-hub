import { api } from "@/api/axios"
import type { ApiSuccess } from "@/types/api"
import type { User } from "@/types/auth"

export const profileService = {
  async getProfile() {
    const response = await api.get<User>("/profile/profile")
    return response.data
  },

  async updateProfile(payload: FormData) {
    const response = await api.put<ApiSuccess<User>>(
      "/profile/profile",
      payload,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    )
    return response.data.data
  },
}
