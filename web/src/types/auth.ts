export type UserRole = "user" | "admin"
export type AuthProvider = "credentials" | "google"

export type User = {
  id: string
  first_name: string
  last_name: string
  username: string
  email: string
  bio?: string | null
  avatar?: string | null
  role: UserRole
  provider: AuthProvider
  is_active: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
}

export type AuthResponse = {
  user: User
  access_token: string
  refresh_token: string
  token_type: "bearer"
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  first_name: string
  last_name: string
  username: string
  email: string
  password: string
}
