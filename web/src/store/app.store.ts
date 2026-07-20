import { create } from "zustand"
import { persist } from "zustand/middleware"

type AppState = {
  isMobileNavOpen: boolean
  notificationsEnabled: boolean
  compactMode: boolean
  searchQuery: string
  setMobileNavOpen: (isOpen: boolean) => void
  setNotificationsEnabled: (enabled: boolean) => void
  setCompactMode: (enabled: boolean) => void
  setSearchQuery: (query: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isMobileNavOpen: false,
      notificationsEnabled: true,
      compactMode: false,
      searchQuery: "",
      setMobileNavOpen: (isOpen) => set({ isMobileNavOpen: isOpen }),
      setNotificationsEnabled: (enabled) =>
        set({ notificationsEnabled: enabled }),
      setCompactMode: (enabled) => set({ compactMode: enabled }),
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: "blog-hub-app",
      partialize: (state) => ({
        notificationsEnabled: state.notificationsEnabled,
        compactMode: state.compactMode,
      }),
    }
  )
)
