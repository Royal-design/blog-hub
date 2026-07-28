import type { Post } from "./post"

export type Like = {
  user_id: string
  post_id: string
}

export type LikedPost = Like & {
  post: Post
}
