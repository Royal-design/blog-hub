import { AxiosError } from "axios"

import type { ApiError } from "@/types/api"

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as (ApiError & { detail?: unknown }) | undefined

    if (data?.message) {
      return data.message
    }

    if (typeof data?.detail === "string") {
      return data.detail
    }

    if (Array.isArray(data?.detail)) {
      return (data.detail as unknown[])
        .map((item) =>
          typeof item === "string"
            ? item
            : (item as { msg?: string })?.msg || JSON.stringify(item)
        )
        .join(", ")
    }

    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Something went wrong. Please try again."
}
