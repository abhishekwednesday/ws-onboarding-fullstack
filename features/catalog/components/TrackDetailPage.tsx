"use client"

import { ArrowLeft, Clock, Music, Pause, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import { ErrorState } from "./ErrorState"
import { FavoriteButton } from "./FavoriteButton"
import { TrackDetailSkeleton } from "./TrackDetailSkeleton"
import { useTrackDetail } from "../hooks/useTrackDetail"

import { type CatalogItemType, type TrackDetailPagePropsType } from "../types/catalog-types"

function formatDuration(ms: number): string {
  const m = Math.floor(ms / 1000 / 60)
  const s = Math.floor((ms / 1000) % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

function formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function TrackDetailPage({ id }: TrackDetailPagePropsType) {
  const router = useRouter()
  const { data: item, isLoading, isError, error, refetch } = useTrackDetail(id)
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [audioDuration, setAudioDuration] = React.useState(0)

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

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration
  }

  React.useEffect(() => {
    setIsPlaying(false)
    setProgress(0)
    setCurrentTime(0)
    audioRef.current?.pause()
  }, [id])

  return (
    <>
      {/* Full-viewport immersive background */}
      {highResArtwork && (
        <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
          <img
            src={highResArtwork}
            alt=""
            className="h-full w-full object-cover object-center"
            style={{ filter: "blur(80px) saturate(1.4)", transform: "scale(1.15)", opacity: 0.45 }}
          />
          <div className="bg-background/60 absolute inset-0" />
        </div>
      )}

      <div className="flex min-h-[calc(100dvh-120px)] flex-col py-6">
        {/* Back — uses router.back() so the catalog URL (with ?q=) is restored */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Catalog
          </button>
        </div>

        {isLoading && <TrackDetailSkeleton />}
        {isError && (
          <ErrorState message={error?.message ?? "Failed to load track details."} onRetry={() => refetch()} />
        )}

        {item && (
          <>
            {item.previewUrl && (
              <audio
                ref={audioRef}
                src={item.previewUrl}
                onEnded={() => {
                  setIsPlaying(false)
                  setProgress(0)
                  setCurrentTime(0)
                }}
                onTimeUpdate={() => {
                  const a = audioRef.current
                  if (a) {
                    setCurrentTime(a.currentTime)
                    setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0)
                  }
                }}
                onLoadedMetadata={() => {
                  if (audioRef.current) setAudioDuration(audioRef.current.duration)
                }}
                preload="none"
              />
            )}

            <div className="mx-auto w-full max-w-sm flex-1 flex-col items-center">
              {/* Artwork */}
              <div
                className={`relative mx-auto mb-8 w-full transition-all duration-700 ${
                  isPlaying ? "scale-[1.03]" : "scale-100"
                }`}
              >
                {highResArtwork && (
                  <div
                    className="absolute -inset-6 rounded-3xl blur-3xl"
                    style={{
                      backgroundImage: `url(${highResArtwork})`,
                      backgroundSize: "cover",
                      opacity: isPlaying ? 0.6 : 0.35,
                      transition: "opacity 0.6s",
                    }}
                  />
                )}
                {highResArtwork ? (
                  <img
                    src={highResArtwork}
                    alt={`${item.title} artwork`}
                    className="relative aspect-square w-full rounded-3xl object-cover shadow-2xl"
                  />
                ) : (
                  <div className="bg-muted relative flex aspect-square w-full items-center justify-center rounded-3xl">
                    <Music className="text-muted-foreground h-20 w-20" />
                  </div>
                )}
              </div>

              {/* Track info */}
              <div className="mb-6 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h1 className="truncate text-2xl font-bold tracking-tight">{item.title}</h1>
                    <p className="text-muted-foreground truncate text-base">{item.artist}</p>
                    {item.album && <p className="text-muted-foreground/50 truncate text-sm italic">{item.album}</p>}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {item.genre && (
                      <span className="text-muted-foreground shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wider uppercase">
                        {item.genre}
                      </span>
                    )}
                    <FavoriteButton track={item} className="h-9 w-9" />
                  </div>
                </div>
                {item.duration && (
                  <div className="text-muted-foreground/60 flex items-center gap-1 pt-0.5 text-xs">
                    <Clock className="h-3 w-3" />
                    <span>{formatDuration(item.duration)}</span>
                  </div>
                )}
              </div>

              {/* Player */}
              {item.previewUrl ? (
                <div className="mb-8 space-y-4">
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
                      onClick={togglePreview}
                      aria-label={isPlaying ? "Pause preview" : "Play 30-second preview"}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-xl transition-transform hover:scale-105 active:scale-95"
                    >
                      {isPlaying ? (
                        <Pause className="h-7 w-7 fill-current" />
                      ) : (
                        <Play className="ml-0.5 h-7 w-7 fill-current" />
                      )}
                    </button>
                    <div className="absolute top-1/2 right-0 translate-x-12 -translate-y-1/2">
                      <FavoriteButton
                        track={item}
                        className="h-12 w-12 bg-white/5 backdrop-blur-md hover:bg-white/10"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-8 flex justify-center">
                  <p className="text-muted-foreground/40 text-sm">No preview available</p>
                </div>
              )}

              {/* iTunes compliance */}
              <div className="flex flex-col items-center gap-2 border-t border-white/10 pt-5">
                <p className="text-muted-foreground/40 text-xs italic">Preview provided courtesy of iTunes</p>
                {item.trackViewUrl && (
                  <a
                    href={item.trackViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-50 transition-opacity hover:opacity-90"
                  >
                    <img src="/images/branding/itunes-badge.png" alt="Listen on Apple Music" className="h-8 w-auto" />
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
