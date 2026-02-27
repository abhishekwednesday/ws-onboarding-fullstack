"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"
import { useState } from "react"

import { ErrorState } from "./ErrorState"
import { TrackAudioPlayer } from "./TrackAudioPlayer"
import { TrackDetailArtwork } from "./TrackDetailArtwork"
import { TrackDetailCompliance } from "./TrackDetailCompliance"
import { TrackDetailInfo } from "./TrackDetailInfo"
import { TrackDetailSkeleton } from "./TrackDetailSkeleton"
import { useTrackDetail } from "../hooks/useTrackDetail"
import { type TrackDetailPagePropsType } from "../types/catalog-types"

/**
 * Immersive detail page for a single music track.
 * Modularized into focused sub-components for artwork, info, audio, and compliance.
 */
export function TrackDetailPage({ id }: TrackDetailPagePropsType) {
  const router = useRouter()
  const { data: item, isLoading, isError, error, refetch } = useTrackDetail(id)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleBack = () => {
    router.back()
  }

  if (isLoading) return <TrackDetailSkeleton />
  if (isError) {
    return <ErrorState message={error?.message ?? "Failed to load track details."} onRetry={() => refetch()} />
  }

  return (
    <div className="flex min-h-[calc(100dvh-120px)] flex-col py-8 pb-32">
      {item && (
        <>
          {/* Back Action - Top of page context */}
          <div className="mx-auto mb-10 flex w-full max-w-xl justify-start px-4">
            <button
              onClick={handleBack}
              className="text-muted-foreground hover:bg-accent hover:text-foreground bg-background/30 border-border/30 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm shadow-sm backdrop-blur-xl transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Catalog
            </button>
          </div>

          <div className="mx-auto mt-2 flex w-full max-w-xl flex-1 flex-col items-center px-4 sm:px-0">
            <TrackDetailArtwork title={item.title} artworkUrl={item.artworkUrl} isPlaying={isPlaying} />

            <TrackDetailInfo item={item} />

            <TrackAudioPlayer item={item} onPlayingChange={setIsPlaying} />

            <TrackDetailCompliance trackViewUrl={item.trackViewUrl} />
          </div>
        </>
      )}
    </div>
  )
}
