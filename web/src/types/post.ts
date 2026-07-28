export type PostStatus = "Draft" | "Published" | "Archived"

export type PostAuthor = {
  id: string
  first_name: string
  last_name: string
  username: string
  avatar?: string | null
  name?: string
}

export type PostCategory = {
  id: string
  name: string
  slug: string
}

export type PostTag = {
  id: string
  name: string
  slug: string
}

export type PostImage = {
  id: string
  image_url: string
  alt_text: string
  position?: number | null
  created_at: string
}

export type Post = {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  cover_image?: string | null
  status: PostStatus
  author_id: string
  category_id: string
  author: PostAuthor
  category: PostCategory
  tags: PostTag[]
  images: PostImage[]
  published_at?: string | null
  created_at: string
  updated_at: string
}

export type Category = PostCategory & {
  created_at?: string
  updated_at?: string
}

export type Tag = PostTag & {
  created_at?: string
  updated_at?: string
}
