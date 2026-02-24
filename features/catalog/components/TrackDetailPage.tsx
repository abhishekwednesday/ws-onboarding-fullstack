"use client"

import { ArrowLeft, Clock, Music } from "lucide-react"
import Link from "next/link"
import * as React from "react"

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
 * Fetches live track data from iTunes via React Query.
 * Works on page refresh — independent of catalog list state.
 */
export function TrackDetailPage({ id }: TrackDetailPagePropsType) {
  const { data: item, isLoading, isError, error, refetch } = useTrackDetail(id)

  return (
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

      {isError && <ErrorState message={error?.message ?? "Failed to load track details."} onRetry={() => refetch()} />}

      {item && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16">
          {/* Artwork */}
          <div className="aspect-square w-full overflow-hidden rounded-xl shadow-2xl">
            {item.artworkUrl ? (
              <img
                src={item.artworkUrl.replace("100x100bb.jpg", "600x600bb.jpg")}
                alt={`${item.title} artwork`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="bg-muted flex h-full w-full items-center justify-center">
                <Music className="text-muted-foreground h-24 w-24" />
              </div>
            )}
          </div>

          {/* Track metadata */}
          <div className="flex flex-col justify-center space-y-6">
            {item.genre && (
              <span className="bg-primary/10 text-primary w-fit rounded-full px-3 py-1 text-xs font-medium tracking-wider uppercase">
                {item.genre}
              </span>
            )}

            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{item.title}</h1>
              <p className="text-muted-foreground text-xl font-medium">{item.artist}</p>
              {item.album && <p className="text-muted-foreground/70 text-base italic">{item.album}</p>}
            </div>

            {item.duration && (
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(item.duration)}</span>
              </div>
            )}

            <hr className="border-border" />

            {/* iTunes compliance */}
            <div className="space-y-3">
              <p className="text-muted-foreground/60 text-xs italic">Preview provided courtesy of iTunes</p>
              {item.trackViewUrl && (
                <a
                  href={item.trackViewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-opacity hover:opacity-80"
                >
                  <img src="/images/branding/itunes-badge.png" alt="Listen on Apple Music" className="h-10 w-auto" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
