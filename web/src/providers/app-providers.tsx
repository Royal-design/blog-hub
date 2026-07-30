import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { GoogleOAuthProvider } from "@react-oauth/google"
import * as React from "react"
import { BrowserRouter } from "react-router"
import { Toaster, toast } from "sonner"

import { setupApiInterceptors } from "@/api/interceptors"
import { ThemeProvider } from "@/components/theme-provider"
import { useNetworkStatus } from "@/hooks/use-network-status"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
})

setupApiInterceptors()

type AppProvidersProps = {
  children: React.ReactNode
}

function NetworkStatusNotifier() {
  const isOnline = useNetworkStatus()
  const hasMounted = React.useRef(false)

  React.useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }

    if (isOnline) {
      toast.success("You are back online.")
      return
    }

    toast.warning("You are offline. Some actions may be unavailable.")
  }, [isOnline])

  return null
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ""

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter>
            {children}
            <NetworkStatusNotifier />
            <Toaster richColors position="top-right" />
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  )
}
