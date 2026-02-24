import { AlertCircle } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"

interface ErrorStatePropsType {
  title?: string
  message?: string
  onRetry?: () => void
}

/**
 * Component to display when an API error occurs.
 * Includes a retry button as a primary action.
 */
export function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while fetching the catalog. Please try again.",
  onRetry,
}: ErrorStatePropsType) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
      <div className="bg-destructive/10 flex h-20 w-20 items-center justify-center rounded-full">
        <AlertCircle className="text-destructive h-10 w-10" />
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground max-w-[400px] text-sm">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="default" className="mt-4">
          Try Again
        </Button>
      )}
    </div>
  )
}
