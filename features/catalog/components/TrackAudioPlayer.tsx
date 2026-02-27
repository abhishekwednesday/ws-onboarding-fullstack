import * as React from "react"
import { useEffect, useState } from "react"

import {
  AudioPlayerButton,
  AudioPlayerDuration,
  AudioPlayerProgress,
  AudioPlayerProvider,
  AudioPlayerTime,
  useAudioPlayer,
} from "@/components/ui/audio-player"
import { FavoriteButton } from "./FavoriteButton"
import { type CatalogItemType } from "../types/catalog-types"

/**
 * A sub-component to observe and sync the ElevenLabs audio player state
 * back up to the parent component (for animating the artwork).
 */
function PlayerStateObserver({ onPlayingChange }: { onPlayingChange: (isPlaying: boolean) => void }) {
  const { isPlaying } = useAudioPlayer()

  useEffect(() => {
    onPlayingChange(isPlaying)
  }, [isPlaying, onPlayingChange])

  return null
}

export function TrackAudioPlayer({
  item,
  onPlayingChange,
}: {
  item: CatalogItemType
  onPlayingChange: (isPlaying: boolean) => void
}) {
  const [trackItem, setTrackItem] = useState({
    id: item.id.toString(),
    src: item.previewUrl || "",
    data: { title: item.title, artist: item.artist },
  })

  // Update track when item changes
  useEffect(() => {
    setTrackItem({
      id: item.id.toString(),
      src: item.previewUrl || "",
      data: { title: item.title, artist: item.artist },
    })
  }, [item])

  if (!item.previewUrl) {
    return (
      <div className="mb-8 flex justify-center">
        <p className="text-muted-foreground/40 text-sm">No preview available</p>
      </div>
    )
  }

  return (
    <div className="mt-8 mb-12 w-full space-y-6 px-4 sm:px-0">
      <AudioPlayerProvider>
        <PlayerStateObserver onPlayingChange={onPlayingChange} />

        <div className="flex w-full flex-col gap-6">
          {/* Player Progress */}
          <div className="w-full space-y-2">
            <AudioPlayerProgress className="h-2 w-full cursor-pointer transition-all hover:h-3" />
            <div className="text-muted-foreground flex justify-between px-1 font-mono text-xs font-medium">
              <AudioPlayerTime />
              <AudioPlayerDuration />
            </div>
          </div>

          {/* Primary Controls */}
          <div className="flex items-center justify-center gap-8 px-4">
            {/* Left side secondary controls (Like) */}
            <FavoriteButton
              track={item}
              className="bg-background/30 hover:bg-accent border-border/30 h-12 w-12 rounded-full border shadow-sm backdrop-blur-md transition-transform hover:scale-105"
            />

            {/* Main Play Button */}
            <div className="relative">
              {/* Glow effect behind play button when playing */}
              {trackItem.src && (
                <div className="bg-primary/20 absolute inset-0 rounded-full blur-xl transition-opacity duration-700 data-[playing=false]:opacity-0 data-[playing=true]:opacity-100" />
              )}
              <AudioPlayerButton
                item={trackItem}
                className="relative z-10 h-20 w-20 rounded-full border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-[1.05] active:scale-[0.95]"
              />
            </div>

            {/* Right side spacer for symmetry (could be volume/speed in future) */}
            <div className="h-12 w-12 border border-transparent" />
          </div>
        </div>
      </AudioPlayerProvider>
    </div>
  )
}
