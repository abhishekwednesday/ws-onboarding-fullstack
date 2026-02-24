"use client"

import { ArrowLeft, Clock, Music, Pause, Play } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { ErrorState } from "./ErrorState"
import { TrackDetailSkeleton } from "./TrackDetailSkeleton"
import { useTrackDetail } from "../hooks/useTrackDetail"

interface TrackDetailPagePropsType {
  id: number
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

/**
 * Client component for the /catalog/[id] detail page.
 * Minimal aesthetic: blurred artwork fills page as atmospheric background.
 * Includes an inline 30-second preview player.
 */
export function TrackDetailPage({ id }: TrackDetailPagePropsType) {
  const { data: item, isLoading, isError, error, refetch } = useTrackDetail(id)
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)

  const highResArtwork = item?.artworkUrl?.replace("100x100bb.jpg", "600x600bb.jpg")

  const togglePreview = () => {
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

  // Reset player when track changes
  React.useEffect(() => {
    setIsPlaying(false)
    audioRef.current?.pause()
  }, [id])

  return (
    <div>
      {/* Full-width blurred artwork hero — atmospheric background */}
      {highResArtwork && (
        <div className="pointer-events-none absolute top-0 left-0 -z-10 h-[480px] w-full overflow-hidden">
          <img
            src={highResArtwork}
            alt=""
            aria-hidden="true"
            className="h-full w-full scale-110 object-cover object-center opacity-25 blur-3xl"
          />
          <div className="via-background/70 to-background absolute inset-0 bg-gradient-to-b from-transparent" />
        </div>
      )}

      <div className="space-y-8 py-10">
        {/* Back navigation */}
        <Link
          href="/catalog"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalog
        </Link>

        {isLoading && <TrackDetailSkeleton />}

        {isError && (
          <ErrorState message={error?.message ?? "Failed to load track details."} onRetry={() => refetch()} />
        )}

        {item && (
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-16">
            {/* Hidden audio element for preview */}
            {item.previewUrl && (
              <audio ref={audioRef} src={item.previewUrl} onEnded={() => setIsPlaying(false)} preload="none" />
            )}

            {/* Artwork */}
            <div className="mx-auto w-56 shrink-0 md:mx-0 md:w-72">
              {highResArtwork ? (
                <img
                  src={highResArtwork}
                  alt={`${item.title} artwork`}
                  className="aspect-square w-full rounded-2xl object-cover shadow-2xl ring-1 ring-white/10"
                />
              ) : (
                <div className="bg-muted flex aspect-square w-full items-center justify-center rounded-2xl">
                  <Music className="text-muted-foreground h-16 w-16" />
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="flex flex-col justify-center space-y-5 pt-2">
              {item.genre && (
                <span className="text-muted-foreground w-fit rounded-full border px-3 py-0.5 text-xs font-medium tracking-wider uppercase">
                  {item.genre}
                </span>
              )}

              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{item.title}</h1>
                <p className="text-muted-foreground text-lg">{item.artist}</p>
                {item.album && <p className="text-muted-foreground/60 text-sm italic">{item.album}</p>}
              </div>

              {item.duration && (
                <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatDuration(item.duration)}</span>
                </div>
              )}

              {/* Preview player */}
              {item.previewUrl ? (
                <div className="flex items-center gap-3 pt-1">
                  <Button
                    onClick={togglePreview}
                    variant="secondary"
                    className="gap-2 rounded-full px-6"
                    aria-label={isPlaying ? "Pause preview" : "Play preview"}
                  >
                    {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                    {isPlaying ? "Pause" : "Play Preview"}
                  </Button>
                  <span className="text-muted-foreground text-xs">30s preview</span>
                </div>
              ) : (
                <p className="text-muted-foreground/50 text-xs">No preview available</p>
              )}

              {/* iTunes compliance */}
              <div className="space-y-2 pt-2">
                <p className="text-muted-foreground/50 text-xs italic">Preview provided courtesy of iTunes</p>
                {item.trackViewUrl && (
                  <a
                    href={item.trackViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block opacity-70 transition-opacity hover:opacity-100"
                  >
                    <img src="/images/branding/itunes-badge.png" alt="Listen on Apple Music" className="h-9 w-auto" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
