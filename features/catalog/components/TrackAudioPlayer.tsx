import { Pause, Play } from "lucide-react"
import * as React from "react"
import { useEffect, useRef, useState } from "react"

import { formatSeconds } from "@/lib/utils/track-formatters"
import { FavoriteButton } from "./FavoriteButton"
import { type CatalogItemType } from "../types/catalog-types"

export function TrackAudioPlayer({
  item,
  onPlayingChange,
}: {
  item: CatalogItemType
  onPlayingChange: (isPlaying: boolean) => void
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)

  // Sync internal isPlaying with parent
  useEffect(() => {
    onPlayingChange(isPlaying)
  }, [isPlaying, onPlayingChange])

  // Reset player when track changes
  useEffect(() => {
    setIsPlaying(false)
    setProgress(0)
    setCurrentTime(0)
    audioRef.current?.pause()
  }, [item.id])

  const handleTogglePreview = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    }
  }

  const handleAudioEnd = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    setProgress(0)
    setCurrentTime(0)
  }

  const handleTimeUpdate = () => {
    const a = audioRef.current
    if (a) {
      setCurrentTime(a.currentTime)
      setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) setAudioDuration(audioRef.current.duration)
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration
  }

  if (!item.previewUrl) {
    return (
      <div className="mb-8 flex justify-center">
        <p className="text-muted-foreground/40 text-sm">No preview available</p>
      </div>
    )
  }

  return (
    <div className="mb-8 space-y-4">
      <audio
        ref={audioRef}
        src={item.previewUrl}
        onEnded={handleAudioEnd}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        preload="none"
      />

      <div>
        <div
          className="relative h-1.5 w-full cursor-pointer overflow-hidden rounded-full bg-white/10"
          onClick={handleProgressClick}
          role="slider"
          aria-label="Preview progress"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-white/80 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-white/30">
          <span>{formatSeconds(currentTime)}</span>
          <span>{audioDuration ? formatSeconds(audioDuration) : "0:30"} · preview</span>
        </div>
      </div>

      <div className="relative flex justify-center">
        <button
          onClick={handleTogglePreview}
          aria-label={isPlaying ? "Pause preview" : "Play 30-second preview"}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-xl transition-transform hover:scale-105 active:scale-95"
        >
          {isPlaying ? <Pause className="h-7 w-7 fill-current" /> : <Play className="ml-0.5 h-7 w-7 fill-current" />}
        </button>
        <div className="absolute top-1/2 right-0 translate-x-12 -translate-y-1/2">
          <FavoriteButton track={item} className="h-12 w-12 bg-white/5 backdrop-blur-md hover:bg-white/10" />
        </div>
      </div>
    </div>
  )
}
