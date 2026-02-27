"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RecommendationCarousel } from "@/features/catalog/components/RecommendationCarousel"
import { CreatePlaylistDialog } from "@/features/playlist/components/CreatePlaylistDialog"
import { PlaylistGrid } from "@/features/playlist/components/PlaylistGrid"
import { usePlaylists } from "@/features/playlist/hooks/usePlaylists"

export default function PlaylistsPage() {
  const { playlists, isLoading, isError, error, refetch } = usePlaylists()

  return (
    <div className="animate-in fade-in relative flex flex-col gap-10 py-6 duration-500 md:py-10">
      <header className="flex items-center justify-between">
        <h1 className="text-foreground font-serif text-3xl font-bold tracking-tight sm:text-4xl">Playlists</h1>
        <CreatePlaylistDialog />
      </header>

      <RecommendationCarousel />

      {isLoading ? (
        <PlaylistSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-semibold text-rose-500">Failed to load playlists</p>
          <p className="text-muted-foreground mt-1 text-sm">{error?.message || "Please try again later."}</p>
          <Button variant="link" onClick={() => refetch()} className="text-primary mt-3 text-sm">
            Try again
          </Button>
        </div>
      ) : (
        <PlaylistGrid playlists={playlists} />
      )}
    </div>
  )
}

function PlaylistSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border-border/50 rounded-xl border p-5">
          <div className="flex items-start gap-4">
            <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  )
}
