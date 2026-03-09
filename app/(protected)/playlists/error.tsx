"use client"

import { Button } from "@/components/ui/button"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-lg font-semibold text-rose-500">Failed to load playlists</p>
      <p className="text-muted-foreground mt-1 max-w-md text-sm">{error.message || "Please try again later."}</p>
      <Button variant="link" onClick={reset} className="text-primary mt-3 text-sm">
        Try again
      </Button>
    </div>
  )
}
