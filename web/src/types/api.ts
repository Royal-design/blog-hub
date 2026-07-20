export type ApiMeta = {
  total?: number
  page?: number
  page_size?: number
  total_pages?: number
}

export type ApiSuccess<T> = {
  message: string
  data: T
  meta?: ApiMeta
}

export type ApiError = {
  message: string
  error_code?: string
  detail?: string
}

export type PaginatedResult<T> = {
  data: T[]
  meta?: ApiMeta
}
