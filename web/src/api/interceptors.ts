import { AxiosError, type InternalAxiosRequestConfig } from "axios"

import { api } from "@/api/axios"
import { authService } from "@/services/auth.service"
import { useAuthStore } from "@/store/auth.store"
import type { ApiError } from "@/types/api"
import type { AuthResponse } from "@/types/auth"

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

let isRefreshing = false
let refreshPromise: Promise<AuthResponse> | null = null

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

      // Do not attempt refresh on auth endpoints (login, refresh, logout)
      if (
        originalRequest.url?.includes("/auth/refresh") ||
        originalRequest.url?.includes("/auth/logout") ||
        originalRequest.url?.includes("/auth/login")
      ) {
        if (originalRequest.url?.includes("/auth/refresh")) {
          useAuthStore.getState().clearAuth()
        }
        return Promise.reject(error)
      }

      if (!refreshToken) {
        useAuthStore.getState().clearAuth()
        return Promise.reject(error)
      }

      originalRequest._retry = true

      // If a refresh operation is already in progress, wait for it
      if (isRefreshing && refreshPromise) {
        try {
          const auth = await refreshPromise
          originalRequest.headers.Authorization = `Bearer ${auth.access_token}`
          return api(originalRequest)
        } catch (queueError) {
          return Promise.reject(queueError)
        }
      }

      // Initiate single-flight refresh call
      isRefreshing = true
      refreshPromise = authService
        .refresh(refreshToken)
        .then((auth) => {
          useAuthStore.getState().setAuth(auth)
          return auth
        })
        .catch((refreshError) => {
          useAuthStore.getState().clearAuth()
          throw refreshError
        })
        .finally(() => {
          isRefreshing = false
          refreshPromise = null
        })

      try {
        const auth = await refreshPromise
        originalRequest.headers.Authorization = `Bearer ${auth.access_token}`
        return api(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }
  )
}

