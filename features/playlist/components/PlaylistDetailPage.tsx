"use client"

import { ArrowLeft, Clock, Music, Play, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { trackTrackSelected } from "@/lib/analytics/events"
import { formatDuration } from "@/lib/utils/track-formatters"
import { usePlaylistDetail } from "../hooks/usePlaylistDetail"

/**
 * Client component for displaying a single playlist's details and tracks.
 */
export function PlaylistDetailPage({ playlistId }: { playlistId: string }) {
  const router = useRouter()
  const { playlist, isLoading, isError, error, refetch, removeTrack, isRemoving } = usePlaylistDetail(playlistId)

  if (isLoading) return <PlaylistDetailSkeleton />

  if (isError || !playlist) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-bold text-rose-500">
          {isError ? "Error Loading Playlist" : "Playlist Not Found"}
        </h2>
        <p className="text-muted-foreground mt-2 max-w-md">
          {error?.message || "The playlist you're looking for might have been deleted or moved."}
        </p>
        <div className="mt-8 flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/playlists">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Playlists
            </Link>
          </Button>
          {isError && <Button onClick={() => refetch()}>Try Again</Button>}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-8 py-8 duration-500 md:py-12">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:gap-8">
        <div className="from-primary/30 to-primary/10 flex aspect-square w-48 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-[1.02] md:w-64">
          {playlist.isLiked ? (
            <Music className="text-primary h-24 w-24 opacity-80 drop-shadow-lg md:h-32 md:w-32" />
          ) : (
            <Music className="text-muted-foreground/40 h-20 w-20 drop-shadow-sm md:h-28 md:w-28" />
          )}
        </div>

        <div className="flex flex-col justify-end gap-2 md:pb-2">
          <span className="text-primary text-xs font-bold tracking-widest uppercase shadow-sm">
            {playlist.isLiked ? "System Playlist" : "Private Playlist"}
          </span>
          <h1 className="text-foreground font-serif text-5xl font-bold tracking-tight drop-shadow-md sm:text-6xl md:text-7xl">
            {playlist.name}
          </h1>
          {playlist.description && (
            <p className="text-muted-foreground mt-2 max-w-2xl text-lg font-medium sm:text-xl">
              {playlist.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-4 text-sm font-medium">
            <span className="text-foreground">{playlist.tracks.length} tracks</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Updated {new Date(playlist.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-2 flex items-center gap-4">
        {/* TODO: Wire to a play-all handler once audio playback is implemented */}
        <Button
          size="lg"
          disabled
          className="hover:shadow-primary/25 h-16 rounded-full px-10 text-[17px] font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Play className="mr-3 h-6 w-6 fill-current" />
          Play All
        </Button>
        {/* TODO: Wire to an add-track modal once track search within playlist is implemented */}
        <Button
          variant="outline"
          size="icon"
          disabled
          className="border-border/40 bg-background/50 hover:bg-accent glass-card h-16 w-16 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98]"
          aria-label="Add track"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Tracks List */}
      <div className="glass-card border-border/40 mt-4 overflow-hidden rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
        <div className="text-muted-foreground border-border/30 bg-muted/10 grid grid-cols-[60px_1fr_120px] gap-4 border-b px-6 py-4 text-xs font-bold tracking-widest uppercase">
          <span className="text-center">#</span>
          <span>Title / Artist</span>
          <span className="flex items-center justify-end text-right">
            <Clock className="mr-1 h-3 w-3" />
            Time
          </span>
        </div>

        <ScrollArea className="h-full">
          <div className="flex flex-col">
            {playlist.tracks.length > 0 ? (
              playlist.tracks.map((track, index) => {
                const handleTrackClick = () => {
                  try {
                    trackTrackSelected(track)
                  } catch {
                    /* best-effort analytics */
                  }
                  router.push(`/catalog/${track.id}`)
                }

                return (
                  <div
                    key={track.id}
                    className="group border-border/10 grid cursor-pointer grid-cols-[60px_1fr_120px] gap-4 border-b px-6 py-3.5 transition-colors last:border-0 hover:bg-white/5 data-[state=open]:bg-white/5"
                    onClick={handleTrackClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        if (e.target !== e.currentTarget) return
                        if (e.key === " ") e.preventDefault()
                        handleTrackClick()
                      }
                    }}
                  >
                    <div className="text-muted-foreground/60 group-hover:text-primary flex items-center justify-center text-sm font-medium transition-colors">
                      <span className="group-hover:hidden">{index + 1}</span>
                      <Play className="hidden h-5 w-5 fill-current group-hover:block" />
                    </div>

                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="bg-muted/30 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/5 shadow-sm transition-transform duration-300 group-hover:scale-105">
                        {track.artworkUrl ? (
                          <Image
                            src={track.artworkUrl}
                            alt={track.title}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Music className="h-5 w-5 opacity-40" />
                        )}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-foreground truncate font-semibold">{track.title}</span>
                        <span className="text-muted-foreground group-hover:text-foreground/80 truncate text-xs transition-colors">
                          {track.artist}
                        </span>
                      </div>
                    </div>

                    <div className="text-muted-foreground group-hover:text-foreground flex items-center justify-end gap-2 text-sm transition-colors">
                      {formatDuration(track.duration || 0)}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-rose-500/10 hover:text-rose-500 focus-visible:opacity-100"
                        disabled={isRemoving}
                        onClick={(e) => {
                          e.stopPropagation()
                          removeTrack(track.id)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.stopPropagation()
                          }
                        }}
                        aria-label="Remove track"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Music className="text-muted-foreground/20 h-12 w-12" />
                <p className="text-muted-foreground mt-4">This playlist is currently empty.</p>
                <Button variant="link" asChild className="text-primary mt-2">
                  <Link href="/catalog">Go to Catalog</Link>
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

function PlaylistDetailSkeleton() {
  return (
    <div className="flex flex-col gap-8 py-8 md:py-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end">
        <Skeleton className="aspect-square w-48 rounded-2xl md:w-64" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-20 w-80 md:w-[600px]" />
          <Skeleton className="h-6 w-48" />
        </div>
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-14 w-40 rounded-full" />
        <Skeleton className="h-14 w-14 rounded-full" />
      </div>
      <div className="border-border bg-card/40 space-y-4 rounded-2xl border p-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  )
}
