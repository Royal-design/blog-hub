import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { likeService } from "@/services/like.service"
import { useAuthStore } from "@/store/auth.store"

export interface LikeButtonProps {
  postId: string
  initialCount?: number
  className?: string
  showCount?: boolean
  size?: "sm" | "default" | "lg"
}

export function LikeButton({
  postId,
  initialCount = 0,
  className,
  showCount = true,
  size = "default",
}: LikeButtonProps) {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)

  // Query user's likes to determine if current post is liked
  const myLikesQuery = useQuery({
    queryKey: ["likes", "me"],
    queryFn: () => likeService.getMyLikes(),
    enabled: Boolean(user),
    staleTime: 60_000,
  })

  const isLikedServer = Boolean(
    myLikesQuery.data?.data?.some((item) => item.post_id === postId)
  )

  const [optimisticState, setOptimisticState] = React.useState<{
    isLiked: boolean
    likeCount: number
  } | null>(null)

  const isLiked = optimisticState?.isLiked ?? isLikedServer
  const likeCount = optimisticState?.likeCount ?? initialCount

  const toggleMutation = useMutation({
    mutationFn: async (currentlyLiked: boolean) => {
      if (currentlyLiked) {
        await likeService.unlikePost(postId)
      } else {
        await likeService.likePost(postId)
      }
    },
    onMutate: async (currentlyLiked: boolean) => {
      const nextState = !currentlyLiked
      const nextCount = nextState ? likeCount + 1 : Math.max(0, likeCount - 1)
      setOptimisticState({ isLiked: nextState, likeCount: nextCount })
      return { previousLiked: currentlyLiked, previousCount: likeCount }
    },
    onError: (_err, _currentlyLiked, context) => {
      if (context) {
        setOptimisticState({
          isLiked: context.previousLiked,
          likeCount: context.previousCount,
        })
      }
    },
    onSettled: () => {
      setOptimisticState(null)
      queryClient.invalidateQueries({ queryKey: ["likes", "me"] })
      queryClient.invalidateQueries({ queryKey: ["posts", postId] })
    },
  })

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!user || toggleMutation.isPending) return
    toggleMutation.mutate(isLiked)
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size={size === "sm" ? "icon-sm" : "sm"}
      onClick={handleToggle}
      aria-label={isLiked ? "Unlike story" : "Like story"}
      className={cn(
        "group relative rounded-xl transition-all duration-200 gap-1.5 font-bold cursor-pointer select-none",
        isLiked
          ? "text-rose-600 dark:text-rose-500 hover:bg-rose-500/10"
          : "text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10",
        className
      )}
    >
      <motion.div
        animate={isLiked ? { scale: [1, 1.35, 0.95, 1] } : { scale: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative grid place-items-center"
      >
        <Heart
          className={cn(
            "size-4 transition-colors duration-200 stroke-[2.2]",
            isLiked && "fill-rose-600 dark:fill-rose-500 text-rose-600 dark:text-rose-500"
          )}
        />
        {isLiked && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0.8, 1.4, 0], opacity: [1, 0.8, 0] }}
            transition={{ duration: 0.4 }}
            className="absolute size-5 rounded-full bg-rose-500/30 -z-10 pointer-events-none"
          />
        )}
      </motion.div>

      {showCount && (
        <span className="text-xs tracking-tight tabular-nums">
          {likeCount}
        </span>
      )}
    </Button>
  )
}
