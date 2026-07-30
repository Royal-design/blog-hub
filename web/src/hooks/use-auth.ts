import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { authService } from "@/services/auth.service"
import { useAuthStore } from "@/store/auth.store"
import type { GoogleAuthPayload, LoginPayload, RegisterPayload } from "@/types/auth"
import { getErrorMessage } from "@/utils/error"

export function useLogin() {
  const queryClient = useQueryClient()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: ({ rememberMe, ...payload }: LoginPayload & { rememberMe: boolean }) =>
      authService.login(payload).then((auth) => ({ auth, rememberMe })),
    onSuccess: ({ auth, rememberMe }) => {
      setAuth(auth, rememberMe)
      queryClient.invalidateQueries()
      toast.success(`Welcome back, ${auth.user.first_name}.`)
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (auth) => {
      setAuth(auth)
      queryClient.invalidateQueries()
      toast.success("Your Blog Hub account is ready.")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useGoogleLoginMutation() {
  const queryClient = useQueryClient()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: (payload: GoogleAuthPayload) => authService.googleLogin(payload),
    onSuccess: (auth) => {
      setAuth(auth)
      queryClient.invalidateQueries()
      toast.success(`Welcome, ${auth.user.first_name}.`)
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const refreshToken = useAuthStore((state) => state.refreshToken)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  return useMutation({
    mutationFn: () => authService.logout(refreshToken),
    onSettled: () => {
      // Navigate to home BEFORE clearing auth so ProtectedRoute
      // doesn't record the current protected page as the "from" location.
      // This prevents the post-login redirect from going back to a protected page.
      window.location.replace("/")
      clearAuth()
      queryClient.clear()
      toast.success("Signed out.")
    },
  })
}
