import { api } from "@/api/axios"
import type { ApiSuccess } from "@/types/api"
import type { Post } from "@/types/post"

export const postService = {
  async getPosts() {
    const response = await api.get<ApiSuccess<Post[]>>("/posts/")
    return response.data.data
  },

  async getPostById(postId: string) {
    const response = await api.get<ApiSuccess<Post>>(`/posts/${postId}`)
    return response.data.data
  },

  async getPostBySlug(slug: string) {
    const response = await api.get<ApiSuccess<Post>>(`/posts/slug/${slug}`)
    return response.data.data
  },

  async createPost(payload: FormData) {
    const response = await api.post<ApiSuccess<Post>>("/posts/", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data.data
  },
}
