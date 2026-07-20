import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"

type ErrorStateProps = {
  title?: string
  description: string
  onRetry?: () => void
}

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
        <div>
          <h2 className="font-semibold text-destructive">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          {onRetry ? (
            <Button
              className="mt-4"
              size="sm"
              variant="outline"
              onClick={onRetry}
            >
              Retry
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
