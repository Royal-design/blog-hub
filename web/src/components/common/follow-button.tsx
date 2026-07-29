import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { UserCheck, UserPlus, UserX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { followService } from "@/services/follow.service"
import { useAuthStore } from "@/store/auth.store"
import type { FollowingResponse } from "@/types/follow"

export interface FollowButtonProps {
  userId: string
  className?: string
  size?: "sm" | "default" | "lg"
}

export function FollowButton({
  userId,
  className,
  size = "sm",
}: FollowButtonProps) {
  const queryClient = useQueryClient()
  const currentUser = useAuthStore((state) => state.user)
  const [isHovered, setIsHovered] = React.useState(false)
  const [optimisticState, setOptimisticState] = React.useState<boolean | null>(null)

  const followingQuery = useQuery({
    queryKey: ["following", currentUser?.id],
    queryFn: () => followService.getFollowing(currentUser?.id ?? ""),
    enabled: Boolean(currentUser?.id),
    staleTime: 5 * 60_000,
  })

  const isFollowingServer = Boolean(
    followingQuery.data?.some((item: FollowingResponse) => item.following_id === userId)
  )

  const isFollowing = optimisticState ?? isFollowingServer

  const toggleMutation = useMutation({
    mutationFn: async (currentlyFollowing: boolean) => {
      if (currentlyFollowing) {
        await followService.unfollowUser(userId)
      } else {
        await followService.followUser(userId)
      }
    },
    onMutate: async (currentlyFollowing: boolean) => {
      setOptimisticState(!currentlyFollowing)
      return { previousState: currentlyFollowing }
    },
    onError: (_err, _currentlyFollowing, context) => {
      if (context) {
        setOptimisticState(context.previousState)
      }
    },
    onSettled: () => {
      setOptimisticState(null)
      queryClient.invalidateQueries({ queryKey: ["following", currentUser?.id] })
      queryClient.invalidateQueries({ queryKey: ["followers", userId] })
    },
  })

  // Don't render follow button if viewing own profile
  if (currentUser?.id === userId) {
    return null
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!currentUser || toggleMutation.isPending) return
    toggleMutation.mutate(isFollowing)
  }

  return (
    <Button
      type="button"
      size={size}
      variant={isFollowing ? "outline" : "default"}
      onClick={handleToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={toggleMutation.isPending}
      className={cn(
        "rounded-xl font-bold transition-all duration-200 gap-1.5 shadow-xs cursor-pointer select-none",
        isFollowing
          ? isHovered
            ? "border-rose-500/50 bg-rose-500/10 text-rose-600 dark:text-rose-400"
            : "border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          : "bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/20",
        className
      )}
    >
      {isFollowing ? (
        isHovered ? (
          <>
            <UserX className="size-3.5 stroke-[2.5]" />
            <span>Unfollow</span>
          </>
        ) : (
          <>
            <UserCheck className="size-3.5 stroke-[2.5]" />
            <span>Following</span>
          </>
        )
      ) : (
        <>
          <UserPlus className="size-3.5 stroke-[2.5]" />
          <span>Follow</span>
        </>
      )}
    </Button>
  )
}
