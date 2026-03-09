"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Playlist detail error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h2 className="text-2xl font-bold text-rose-500">Failed to load playlist</h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        {error.message || "Something went wrong while loading this playlist."}
      </p>
      <div className="mt-8 flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/playlists">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Playlists
          </Link>
        </Button>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  )
}
