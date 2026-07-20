import * as React from "react"

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = React.useState(() => navigator.onLine)

  React.useEffect(() => {
    const updateOnline = () => setIsOnline(true)
    const updateOffline = () => setIsOnline(false)

    window.addEventListener("online", updateOnline)
    window.addEventListener("offline", updateOffline)

    return () => {
      window.removeEventListener("online", updateOnline)
      window.removeEventListener("offline", updateOffline)
    }
  }, [])

  return isOnline
}
