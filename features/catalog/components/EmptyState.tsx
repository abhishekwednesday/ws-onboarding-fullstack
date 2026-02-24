import { Search } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"

interface EmptyStatePropsType {
  title?: string
  description?: string
  onReset?: () => void
}

/**
 * Component to display when no search results are found or when the catalog is empty.
 */
export function EmptyState({
  title = "No results found",
  description = "We couldn't find what you're looking for. Please try a different search term.",
  onReset,
}: EmptyStatePropsType) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
      <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
        <Search className="text-muted-foreground h-10 w-10" />
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground max-w-[400px] text-sm">{description}</p>
      {onReset && (
        <Button onClick={onReset} variant="outline" className="mt-4">
          Clear Search
        </Button>
      )}
    </div>
  )
}
