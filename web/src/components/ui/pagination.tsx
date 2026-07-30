import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, total, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5
    const half = Math.floor(maxVisible / 2)

    let start = page - half
    let end = page + half

    if (start < 1) {
      start = 1
      end = Math.min(totalPages, maxVisible)
    }

    if (end > totalPages) {
      end = totalPages
      start = Math.max(1, totalPages - maxVisible + 1)
    }

    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push("...")
    }

    for (let i = start; i <= end; i++) pages.push(i)

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...")
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800/80 pt-4">
      <p className="text-xs font-medium text-muted-foreground">
        {total} item{total !== 1 ? "s" : ""}
      </p>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="size-4" />
        </Button>

        {pageNumbers.map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="flex size-7 items-center justify-center text-xs text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <Button
              key={p}
              type="button"
              variant={p === page ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => onPageChange(p as number)}
              className={cn("text-xs font-bold", p === page && "shadow-xs")}
            >
              {p}
            </Button>
          )
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
