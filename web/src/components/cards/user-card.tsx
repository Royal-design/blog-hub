import { motion } from "framer-motion"
import { Link } from "react-router"

import { FollowButton } from "@/components/common/follow-button"
import type { User } from "@/types/auth"
import { getInitials } from "@/utils/initials"

export interface UserCardProps {
  user: User
  followersCount?: number
  compact?: boolean
}

export function UserCard({ user, followersCount, compact = false }: UserCardProps) {
  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username
  const initials = getInitials(fullName, user.first_name, user.last_name, user.username)

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-card hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
        <Link to="/profile" className="flex items-center gap-3 min-w-0 flex-1 group">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={fullName}
              className="size-10 rounded-full object-cover shrink-0 ring-2 ring-primary/20"
              loading="lazy"
            />
          ) : (
            <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary font-extrabold text-xs shrink-0 border border-primary/20 tracking-wider">
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
              {fullName}
            </h4>
            <p className="text-[11px] text-muted-foreground truncate">@{user.username}</p>
          </div>
        </Link>
        <FollowButton userId={user.id} size="sm" />
      </div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="flex flex-col justify-between p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-card shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <Link to="/profile" className="shrink-0 group">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={fullName}
              className="size-14 rounded-full object-cover ring-2 ring-primary/20 group-hover:scale-105 transition-transform"
              loading="lazy"
            />
          ) : (
            <div className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary font-extrabold text-base border border-primary/20 group-hover:scale-105 transition-transform tracking-wider">
              {initials}
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1 space-y-1">
          <Link to="/profile">
            <h3 className="text-sm font-extrabold text-foreground truncate hover:text-primary transition-colors">
              {fullName}
            </h3>
          </Link>
          <p className="text-xs font-semibold text-primary">@{user.username}</p>
          {user.bio ? (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed pt-0.5">
              {user.bio}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground/60 italic pt-0.5">No bio provided</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80">
        <span className="text-xs font-semibold text-muted-foreground">
          {followersCount !== undefined ? `${followersCount} followers` : "Creator"}
        </span>
        <FollowButton userId={user.id} size="sm" />
      </div>
    </motion.div>
  )
}
