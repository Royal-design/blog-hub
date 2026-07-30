import type {
  GsiButtonConfiguration,
  IdConfiguration,
  PromptMomentNotification,
} from "@react-oauth/google"

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: IdConfiguration) => void
          prompt: (momentListener?: (moment: PromptMomentNotification) => void) => void
          renderButton: (parent: HTMLElement, options: GsiButtonConfiguration) => void
          cancel: () => void
          disableAutoSelect: () => void
        }
      }
    }
  }
}
