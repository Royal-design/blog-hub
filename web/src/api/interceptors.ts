import { AxiosError, type InternalAxiosRequestConfig } from "axios"

import { api } from "@/api/axios"
import { authService } from "@/services/auth.service"
import { useAuthStore } from "@/store/auth.store"
import type { ApiError } from "@/types/api"

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

export function setupApiInterceptors() {
  api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiError>) => {
      const originalRequest = error.config as RetryableRequestConfig | undefined
      const status = error.response?.status
      const refreshToken = useAuthStore.getState().refreshToken

      if (status !== 401 || !originalRequest || originalRequest._retry) {
        return Promise.reject(error)
      }

      if (!refreshToken || originalRequest.url?.includes("/auth/refresh")) {
        useAuthStore.getState().clearAuth()
        return Promise.reject(error)
      }

      originalRequest._retry = true

      try {
        const auth = await authService.refresh(refreshToken)
        useAuthStore.getState().setAuth(auth)
        originalRequest.headers.Authorization = `Bearer ${auth.access_token}`
        return api(originalRequest)
      } catch (refreshError) {
        useAuthStore.getState().clearAuth()
        return Promise.reject(refreshError)
      }
    }
  )
}
