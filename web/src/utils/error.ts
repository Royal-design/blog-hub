import { AxiosError } from "axios"

import type { ApiError } from "@/types/api"

export function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError | undefined
    return data?.message ?? data?.detail ?? error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Something went wrong. Please try again."
}
