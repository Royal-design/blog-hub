export function PostCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-card shadow-sm">
      {/* Cover image skeleton */}
      <div className="aspect-[16/9] animate-pulse bg-muted" />

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Author row */}
        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded-full animate-pulse bg-muted" />
          <div className="h-3 w-24 animate-pulse rounded-full bg-muted" />
          <div className="h-3 w-3 animate-pulse rounded-full bg-muted" />
          <div className="h-3 w-20 animate-pulse rounded-full bg-muted" />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <div className="h-5 w-full animate-pulse rounded-lg bg-muted" />
          <div className="h-5 w-4/5 animate-pulse rounded-lg bg-muted" />
        </div>

        {/* Excerpt */}
        <div className="space-y-1.5">
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
        </div>

        {/* Tags */}
        <div className="flex gap-2">
          <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
          <div className="h-5 w-12 animate-pulse rounded-full bg-muted" />
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          <div className="flex items-center gap-2">
            <div className="h-7 w-12 animate-pulse rounded-xl bg-muted" />
            <div className="h-7 w-12 animate-pulse rounded-xl bg-muted" />
            <div className="h-7 w-7 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function PostCardSkeletonFeed() {
  return (
    <div className="flex gap-4 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-card shadow-sm">
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-full animate-pulse bg-muted" />
          <div className="h-3 w-24 animate-pulse rounded-full bg-muted" />
          <div className="h-3 w-3 animate-pulse rounded-full bg-muted" />
          <div className="h-3 w-16 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="space-y-1.5">
          <div className="h-5 w-full animate-pulse rounded-lg bg-muted" />
          <div className="h-5 w-4/5 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-2">
            <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
            <div className="h-5 w-10 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="flex gap-2">
            <div className="h-6 w-10 animate-pulse rounded-xl bg-muted" />
            <div className="h-6 w-10 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </div>
      <div className="hidden sm:block shrink-0 size-24 animate-pulse rounded-xl bg-muted" />
    </div>
  )
}
