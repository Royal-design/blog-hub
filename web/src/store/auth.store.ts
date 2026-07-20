import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { AuthResponse, User } from "@/types/auth"

type AuthState = {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  hasHydrated: boolean
  setAuth: (auth: AuthResponse) => void
  setAccessToken: (token: string) => void
  clearAuth: () => void
  setHasHydrated: (value: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      hasHydrated: false,
      setAuth: (auth) =>
        set({
          user: auth.user,
          accessToken: auth.access_token,
          refreshToken: auth.refresh_token,
        }),
      setAccessToken: (token) => set({ accessToken: token }),
      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "blog-hub-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
