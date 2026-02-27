"use client"

import { Heart, ListMusic, Music } from "lucide-react"
import Link from "next/link"
import { type PlaylistType } from "../types/playlist-types"

export function PlaylistGrid({ playlists }: { playlists: PlaylistType[] }) {
  if (playlists.length === 0) {
    return (
      <div className="border-border/50 flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
        <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
          <Music className="text-muted-foreground h-5 w-5" />
        </div>
        <p className="text-foreground font-medium">No playlists yet</p>
        <p className="text-muted-foreground mt-1 max-w-[260px] text-sm">
          Create your first playlist to start curating tracks.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {playlists.map((playlist) => (
        <PlaylistCard key={playlist.id} playlist={playlist} />
      ))}
    </div>
  )
}

function PlaylistCard({ playlist }: { playlist: PlaylistType }) {
  const formattedDate = new Date(playlist.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
  const trackLabel = playlist.trackCount === 1 ? "track" : "tracks"

  return (
    <Link href={`/playlists/${playlist.id}`} className="group block">
      <div className="border-border/50 hover:border-border bg-card/30 hover:bg-card/60 flex flex-col rounded-xl border p-5 transition-all duration-200 hover:shadow-md">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 group-hover:bg-primary/15 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-colors">
            {playlist.isLiked ? (
              <Heart className="text-primary h-5 w-5 fill-current" />
            ) : (
              <ListMusic className="text-primary/70 h-5 w-5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-foreground group-hover:text-primary truncate font-semibold transition-colors">
              {playlist.name}
            </h3>
            <p className="text-muted-foreground mt-0.5 truncate text-sm">
              {playlist.description || `${playlist.trackCount} ${trackLabel}`}
            </p>
          </div>
        </div>
        <div className="text-muted-foreground mt-4 flex items-center justify-between text-xs">
          <span className="tabular-nums">
            {playlist.trackCount} {trackLabel}
          </span>
          <span>Updated {formattedDate}</span>
        </div>
      </div>
    </Link>
  )
}
