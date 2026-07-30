import { create } from "zustand"

import type { AuthResponse, User } from "@/types/auth"

const STORAGE_KEY = "blog-hub-auth"

type PersistedData = {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  rememberMe: boolean
}

type AuthState = {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  hasHydrated: boolean
  setAuth: (auth: AuthResponse, rememberMe?: boolean) => void
  setAccessToken: (token: string) => void
  clearAuth: () => void
  setHasHydrated: (value: boolean) => void
}

function persistToStorage(data: PersistedData): void {
  const json = JSON.stringify(data)
  if (data.rememberMe) {
    localStorage.setItem(STORAGE_KEY, json)
    sessionStorage.removeItem(STORAGE_KEY)
  } else {
    sessionStorage.setItem(STORAGE_KEY, json)
    localStorage.removeItem(STORAGE_KEY)
  }
}

function readFromStorage(): PersistedData | null {
  const raw =
    localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as PersistedData
  } catch {
    return null
  }
}

function removeFromStorage(): void {
  localStorage.removeItem(STORAGE_KEY)
  sessionStorage.removeItem(STORAGE_KEY)
}

const saved = readFromStorage()

export const useAuthStore = create<AuthState>()((set) => ({
  user: saved?.user ?? null,
  accessToken: saved?.accessToken ?? null,
  refreshToken: saved?.refreshToken ?? null,
  hasHydrated: true,
  setAuth: (auth, rememberMe = true) => {
    const data = {
      user: auth.user,
      accessToken: auth.access_token,
      refreshToken: auth.refresh_token,
      rememberMe,
    }
    set(data)
    persistToStorage(data)
  },
  setAccessToken: (token) => set({ accessToken: token }),
  clearAuth: () => {
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
    })
    removeFromStorage()
  },
  setHasHydrated: (value) => set({ hasHydrated: value }),
}))
