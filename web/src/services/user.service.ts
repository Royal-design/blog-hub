import { api } from "@/api/axios"
import type { ApiSuccess } from "@/types/api"
import type { User, UserRole } from "@/types/auth"

export const userService = {
  async getUsers(params?: { search?: string; page?: number; page_size?: number }) {
    const response = await api.get<ApiSuccess<User[]>>("/users/users", { params })
    return response.data.data
  },

  async getUserById(userId: string) {
    // Use the get all users endpoint and find by id (backend uses /users/users)
    const response = await api.get<ApiSuccess<User[]>>("/users/users")
    const users = response.data.data
    return users.find((u) => u.id === userId) ?? null
  },

  async updateUserRole(userId: string, role: UserRole) {
    const response = await api.patch<ApiSuccess<User>>(`/users/users/${userId}/role`, { role })
    return response.data.data
  },

  async deleteUser(userId: string) {
    const response = await api.delete<ApiSuccess<User>>(`/users/users/${userId}`)
    return response.data.data
  },
}

