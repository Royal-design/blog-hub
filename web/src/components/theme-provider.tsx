import * as React from "react"

import { useThemeStore } from "@/store/theme.store"

type ThemeProviderProps = {
  children: React.ReactNode
}

function disableTransitionsTemporarily() {
  const style = document.createElement("style")
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;transition:none!important}"
    )
  )
  document.head.appendChild(style)

  return () => {
    window.getComputedStyle(document.body)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        style.remove()
      })
    })
  }
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useThemeStore((state) => state.theme)

  React.useEffect(() => {
    const root = document.documentElement
    const restoreTransitions = disableTransitionsTemporarily()

    root.classList.remove("light", "dark")
    root.classList.add(theme)
    restoreTransitions()
  }, [theme])

  return children
}
