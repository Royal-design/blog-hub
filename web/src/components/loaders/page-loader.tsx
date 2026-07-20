import { Loader2 } from "lucide-react"

export function PageLoader() {
  return (
    <div className="grid min-h-80 place-items-center">
      <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
      <span className="sr-only">Loading</span>
    </div>
  )
}
