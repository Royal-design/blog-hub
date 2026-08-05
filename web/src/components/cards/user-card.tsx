import { motion } from "framer-motion"

import { FollowButton } from "@/components/common/follow-button"
import { OptimizedImage } from "@/components/common/optimized-image"
import type { User } from "@/types/auth"
import { getInitials } from "@/utils/initials"

export interface UserCardProps {
  user: User
  followersCount?: number
  compact?: boolean
}

export function UserCard({
  user,
  followersCount,
  compact = false,
}: UserCardProps) {
  const fullName =
    `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username
  const initials = getInitials(
    fullName,
    user.first_name,
    user.last_name,
    user.username
  )

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/60 bg-card p-3 transition-colors hover:bg-slate-50/80 dark:border-slate-800/60 dark:hover:bg-slate-900/40">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {user.avatar && user.avatar !== "string" ? (
            <OptimizedImage
              src={user.avatar}
              alt={fullName}
              className="size-10 shrink-0 rounded-full ring-2 ring-primary/20"
              fallback={
                <span className="grid size-full place-items-center rounded-full border border-primary/20 bg-primary/10 text-xs font-extrabold tracking-wider text-primary">
                  {initials}
                </span>
              }
            />
          ) : (
            <div className="grid size-10 shrink-0 place-items-center rounded-full border border-primary/20 bg-primary/10 text-xs font-extrabold tracking-wider text-primary">
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-xs font-bold text-foreground">
              {fullName}
            </h4>
            <p className="truncate text-[11px] text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </div>
        <FollowButton userId={user.id} size="sm" />
      </div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800/80"
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          {user.avatar && user.avatar !== "string" ? (
            <OptimizedImage
              src={user.avatar}
              alt={fullName}
              className="size-14 rounded-full ring-2 ring-primary/20"
              fallback={
                <span className="grid size-full place-items-center rounded-full border border-primary/20 bg-primary/10 text-base font-extrabold tracking-wider text-primary">
                  {initials}
                </span>
              }
            />
          ) : (
            <div className="grid size-14 place-items-center rounded-full border border-primary/20 bg-primary/10 text-base font-extrabold tracking-wider text-primary">
              {initials}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="truncate text-sm font-extrabold text-foreground">
            {fullName}
          </h3>
          <p className="text-xs font-semibold text-primary">@{user.username}</p>
          {user.bio ? (
            <p className="line-clamp-2 pt-0.5 text-xs leading-relaxed text-muted-foreground">
              {user.bio}
            </p>
          ) : (
            <p className="pt-0.5 text-xs text-muted-foreground/60 italic">
              No bio provided
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800/80">
        <span className="text-xs font-semibold text-muted-foreground">
          {followersCount !== undefined
            ? `${followersCount} followers`
            : "Creator"}
        </span>
        <FollowButton userId={user.id} size="sm" />
      </div>
    </motion.div>
  )
}
