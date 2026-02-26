"use client"

import { Check, ListMusic, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { type CatalogItemType } from "@/features/catalog/types/catalog-types"
import { cn } from "@/lib/utils"
import { usePlaylistDetail } from "../hooks/usePlaylistDetail"
import { usePlaylists } from "../hooks/usePlaylists"
import { usePlaylistStore } from "../store/usePlaylistStore"

/**
 * Content for the Add to Playlist popover.
 * Lists user playlists and handles the addition logic.
 */
export function AddToPlaylistPopover({ track, onClose }: { track: CatalogItemType; onClose?: () => void }) {
  const { playlists, isLoading: isPlaylistsLoading } = usePlaylists()
  const { addTrack, isAdding } = usePlaylistDetail()
  const { isTrackInPlaylist } = usePlaylistStore()

  const handleAddToPlaylist = async (playlistId: string) => {
    try {
      // Small optimization: we use a custom hook for the specific playlist context
      // but the addTrack function itself handles the mutation.
      // We pass the playlistId explicitly if the hook doesn't have it,
      // but our usePlaylistDetail usually takes playlistId in the constructor.
      // However, addTrackToPlaylistAction takes playlistId as first arg.
      // Our usePlaylistDetail.addTrack is currently tied to a specific playlistId from its params.
      // We need a more generic way or just call the action directly,
      // but let's stick to the mutation logic.
      // I'll update usePlaylistDetail to allow passing playlistId to addTrack or
      // just use a temporary instance.
      // Better: let's use a simpler approach for the popover where we just call the action
      // OR I can just initialize usePlaylistDetail with the target playlistId.
      // For now, I'll rely on the fact that addTrack inside the popover
      // needs to be dynamic. I will use the mutation directly or adjust the hook.
      // Re-reading usePlaylistDetail: it takes playlistId as an optional param.
    } catch (error) {
      console.error("Error adding to playlist:", error)
    }
  }

  // Helper component for the playlist item to scoped mutation state
  const PlaylistItem = ({ playlist }: { playlist: (typeof playlists)[0] }) => {
    const { addTrack: addTrackToThis, isAdding: isAddingToThis } = usePlaylistDetail(playlist.id)
    const alreadyAdded = isTrackInPlaylist(playlist.id, track.id)

    return (
      <button
        key={playlist.id}
        onClick={async (e) => {
          e.stopPropagation()
          if (alreadyAdded || isAddingToThis) return
          await addTrackToThis(track)
          // We don't close immediately to let them see the success state
        }}
        disabled={isAddingToThis}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
          alreadyAdded
            ? "bg-primary/10 text-primary cursor-default"
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

        {isAddingToThis ? (
          <Loader2 className="text-primary h-4 w-4 animate-spin" />
        ) : alreadyAdded ? (
          <Check className="text-primary h-4 w-4" />
        ) : (
          <Plus className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </button>
    )
  }

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
            playlists.map((playlist) => <PlaylistItem key={playlist.id} playlist={playlist} />)
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
              <ListMusic className="text-muted-foreground/20 h-8 w-8" />
              <p className="text-muted-foreground text-xs">You don't have any playlists yet.</p>
              <Button
                variant="link"
                size="sm"
                className="text-primary h-auto p-0"
                onClick={() => {
                  // This is a bit tricky to trigger the dialog from here,
                  // for now just guide them.
                  window.location.href = "/playlists"
                }}
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
