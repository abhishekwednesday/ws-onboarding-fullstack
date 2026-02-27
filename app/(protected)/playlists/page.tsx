"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CreatePlaylistDialog } from "@/features/playlist/components/CreatePlaylistDialog"
import { PlaylistGrid } from "@/features/playlist/components/PlaylistGrid"
import { usePlaylists } from "@/features/playlist/hooks/usePlaylists"

/**
 * Main playlists page for logged-in users.
 * Fetches and displays the user's collection of playlists.
 */
export default function PlaylistsPage() {
  const { playlists, isLoading, isError, error, refetch } = usePlaylists()

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 relative flex flex-col gap-8 py-8 duration-700 md:py-16">
      {/* Subtle ambient glow for the header */}
      <div className="pointer-events-none absolute top-0 left-0 -z-10 flex w-full items-start justify-center opacity-50">
        <div className="bg-primary/10 h-[300px] w-[600px] rounded-full blur-[120px]" />
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-foreground font-serif text-4xl font-bold tracking-tight drop-shadow-sm sm:text-5xl md:text-6xl">
            Your Playlists
          </h1>
          <p className="text-muted-foreground text-lg font-medium sm:text-xl">Curate your perfect soundtrack.</p>
        </div>
        <CreatePlaylistDialog />
      </div>

      <div className="min-h-[400px]">
        {isLoading ? (
          <PlaylistSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-xl font-semibold text-rose-500">Failed to load playlists</h3>
            <p className="text-muted-foreground mt-2">{error?.message || "Please try again later."}</p>
            <Button variant="link" onClick={() => refetch()} className="text-primary mt-6">
              Try again
            </Button>
          </div>
        ) : (
          <PlaylistGrid playlists={playlists} />
        )}
      </div>
    </div>
  )
}

function PlaylistSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border-border bg-card/40 flex flex-col gap-4 rounded-xl border p-6">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="border-border mt-4 border-t pt-4">
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}
