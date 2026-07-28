import { api } from "@/api/axios"
import type { ApiSuccess } from "@/types/api"
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth"

export type ChangePasswordPayload = {
  current_password: string
  new_password: string
  confirm_password: string
}

export const authService = {
  async register(payload: RegisterPayload) {
    const response = await api.post<ApiSuccess<AuthResponse>>(
      "/auth/register",
      payload
    )
    return response.data.data
  },

  async login(payload: LoginPayload) {
    const response = await api.post<AuthResponse>("/auth/login", payload)
    return response.data
  },

  async refresh(refreshToken: string) {
    const response = await api.post<AuthResponse>("/auth/refresh", {
      refresh_token: refreshToken,
    })
    return response.data
  },

  async logout(refreshToken?: string | null) {
    await api.post("/auth/logout", {
      refresh_token: refreshToken,
    })
  },

  async forgotPassword(email: string) {
    await api.post("/auth/forgot-password", { email })
  },

  async resetPassword(token: string, newPassword: string) {
    await api.post("/auth/reset-password", {
      token,
      new_password: newPassword,
    })
  },

  async changePassword(payload: ChangePasswordPayload) {
    await api.post("/auth/change-password", payload)
  },
}
