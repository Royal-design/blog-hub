import { FileQuestion } from "lucide-react"
import { useNavigate } from "react-router"

import { EmptyState } from "@/components/common/empty-state"

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <EmptyState
      icon={FileQuestion}
      title="Page not found"
      description="The page you opened does not exist in Blog Hub."
      actionLabel="Go home"
      onAction={() => navigate("/")}
    />
  )
}
