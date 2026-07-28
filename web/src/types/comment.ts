export type CommentUser = {
  id: string
  first_name: string
  last_name: string
  username: string
  avatar?: string | null
}

export type Comment = {
  id: string
  content: string
  user_id: string
  post_id: string
  parent_id?: string | null
  created_at: string
  updated_at: string
  user: CommentUser
  replies?: Comment[]
}

export type CommentCreatePayload = {
  content: string
  post_id: string
  parent_id?: string | null
}

export type CommentUpdatePayload = {
  content: string
}
