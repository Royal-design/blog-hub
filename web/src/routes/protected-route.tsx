import type * as React from "react"
import { Navigate, useLocation } from "react-router"

import { PageLoader } from "@/components/loaders/page-loader"
import { useAuthStore } from "@/store/auth.store"

type ProtectedRouteProps = {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const location = useLocation()

  if (!hasHydrated) {
    return <PageLoader />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
