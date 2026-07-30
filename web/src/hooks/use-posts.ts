import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { categoryService } from "@/services/category.service"
import { postService } from "@/services/post.service"
import { tagService } from "@/services/tag.service"
import { useAuthStore } from "@/store/auth.store"

export const queryKeys = {
  posts: ["posts"] as const,
  categories: ["categories"] as const,
  tags: ["tags"] as const,
}

export function usePosts(page: number = 1, pageSize: number = 10) {
  const isAuthenticated = Boolean(useAuthStore((state) => state.accessToken))

  return useQuery({
    queryKey: [...queryKeys.posts, { page, pageSize }],
    queryFn: () => postService.getPosts({ page, page_size: pageSize }),
    enabled: isAuthenticated,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  })
}

export function useCategories() {
  const isAuthenticated = Boolean(useAuthStore((state) => state.accessToken))

  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoryService.getCategories,
    enabled: isAuthenticated,
    staleTime: 5 * 60_000,
  })
}

export function useTags() {
  const isAuthenticated = Boolean(useAuthStore((state) => state.accessToken))

  return useQuery({
    queryKey: queryKeys.tags,
    queryFn: tagService.getTags,
    enabled: isAuthenticated,
    staleTime: 5 * 60_000,
  })
}
