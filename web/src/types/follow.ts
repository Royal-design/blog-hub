import type { User } from "./auth"

export type Follow = {
  follower_id: string
  following_id: string
  created_at: string
}

export type FollowerResponse = Follow & {
  follower: User
}

export type FollowingResponse = Follow & {
  following: User
}
