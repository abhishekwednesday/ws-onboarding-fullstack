"use client"

import { Check, ListMusic, Loader2, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { type CatalogItemType } from "@/features/catalog/types/catalog-types"
import { cn } from "@/lib/utils"
import { usePlaylistDetail } from "../hooks/usePlaylistDetail"
import { usePlaylists } from "../hooks/usePlaylists"
import { usePlaylistStore } from "../store/usePlaylistStore"

interface PlaylistItemProps {
  playlist: { id: string; name: string }
  track: CatalogItemType
  isTrackInPlaylist: (playlistId: string, trackId: number) => boolean
}

function PlaylistItem({ playlist, track, isTrackInPlaylist }: PlaylistItemProps) {
  const {
    addTrack: addTrackToThis,
    removeTrack: removeTrackFromThis,
    isAdding: isAddingToThis,
    isRemoving: isRemovingFromThis,
  } = usePlaylistDetail(playlist.id, { skipQuery: true })
  const alreadyAdded = isTrackInPlaylist(playlist.id, track.id)

  const isWorking = isAddingToThis || isRemovingFromThis

  return (
    <button
      onClick={async (e) => {
        e.stopPropagation()
        if (isWorking) return
        if (alreadyAdded) {
          await removeTrackFromThis(track.id)
        } else {
          await addTrackToThis(track)
        }
      }}
      disabled={isWorking}
      aria-pressed={alreadyAdded}
      aria-label={`${alreadyAdded ? "Remove from" : "Add to"} playlist: ${playlist.name}`}
      className={cn(
        "group flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
        alreadyAdded
          ? "bg-primary/10 text-primary cursor-pointer"
          : "text-foreground/80 hover:text-foreground hover:bg-white/10"
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded bg-white/5",
            alreadyAdded && "bg-primary/20"
          )}
        >
          <ListMusic className={cn("h-4 w-4", alreadyAdded ? "text-primary" : "text-muted-foreground")} />
        </div>
        <span className="truncate font-medium">{playlist.name}</span>
      </div>
      {isWorking ? (
        <Loader2 className="text-primary h-4 w-4 animate-spin" />
      ) : alreadyAdded ? (
        <Check className="text-primary h-4 w-4" />
      ) : (
        <Plus className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </button>
  )
}

/**
 * Content for the Add to Playlist popover.
 * Lists user playlists and handles the addition logic.
 */
export function AddToPlaylistPopover({ track, onClose }: { track: CatalogItemType; onClose?: () => void }) {
  const router = useRouter()
  const { playlists, isLoading: isPlaylistsLoading } = usePlaylists()
  const { isTrackInPlaylist } = usePlaylistStore()

  return (
    <div className="flex flex-col gap-2 p-1">
      <div className="px-3 py-2">
        <h4 className="text-sm leading-none font-bold tracking-tight">Add to Playlist</h4>
        <p className="text-muted-foreground mt-1 text-xs">Choose a playlist for this track.</p>
      </div>

      <ScrollArea className="h-[250px] px-1">
        <div className="flex flex-col gap-1 pb-2">
          {isPlaylistsLoading ? (
            <div className="flex flex-col gap-1 p-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-white/5" />
              ))}
            </div>
          ) : playlists.length > 0 ? (
            playlists.map((playlist) => (
              <PlaylistItem key={playlist.id} playlist={playlist} track={track} isTrackInPlaylist={isTrackInPlaylist} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
              <ListMusic className="text-muted-foreground/20 h-8 w-8" />
              <p className="text-muted-foreground text-xs">You don't have any playlists yet.</p>
              <Button
                variant="link"
                size="sm"
                className="text-primary h-auto p-0"
                onClick={() => router.push("/playlists")}
              >
                Create one now
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
