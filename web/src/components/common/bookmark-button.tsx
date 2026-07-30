import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Bookmark } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { bookmarkService } from "@/services/bookmark.service"
import { useAuthStore } from "@/store/auth.store"

export interface BookmarkButtonProps {
  postId: string
  className?: string
  size?: "sm" | "default" | "lg"
}

export function BookmarkButton({
  postId,
  className,
  size = "default",
}: BookmarkButtonProps) {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)

  const myBookmarksQuery = useQuery({
    queryKey: ["bookmarks", "me"],
    queryFn: bookmarkService.getMyBookmarks,
    enabled: Boolean(user),
    staleTime: 60_000,
  })

  const isBookmarkedServer = Boolean(
    myBookmarksQuery.data?.data?.some((item) => item.post_id === postId)
  )

  const [isBookmarked, setIsBookmarked] = React.useState(isBookmarkedServer)

  React.useEffect(() => {
    setIsBookmarked(isBookmarkedServer)
  }, [isBookmarkedServer])

  const toggleMutation = useMutation({
    mutationFn: async (currentlyBookmarked: boolean) => {
      if (currentlyBookmarked) {
        await bookmarkService.removeBookmark(postId)
      } else {
        await bookmarkService.bookmarkPost(postId)
      }
    },
    onMutate: async (currentlyBookmarked: boolean) => {
      setIsBookmarked(!currentlyBookmarked)
      return { previousBookmarked: currentlyBookmarked }
    },
    onError: (_err, _vars, context) => {
      if (context) {
        setIsBookmarked(context.previousBookmarked)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks", "me"] })
    },
  })

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!user || toggleMutation.isPending) return
    toggleMutation.mutate(isBookmarked)
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size={size === "sm" ? "icon-sm" : "sm"}
      onClick={handleToggle}
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark story"}
      className={cn(
        "group relative rounded-xl transition-all duration-200 cursor-pointer select-none",
        isBookmarked
          ? "text-primary hover:bg-primary/10"
          : "text-muted-foreground hover:text-primary hover:bg-primary/10",
        className
      )}
    >
      <motion.div
        animate={isBookmarked ? { scale: [1, 1.25, 0.95, 1] } : { scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <Bookmark
          className={cn(
            "size-4 transition-colors duration-200 stroke-[2.2]",
            isBookmarked && "fill-primary text-primary"
          )}
        />
      </motion.div>
    </Button>
  )
}
