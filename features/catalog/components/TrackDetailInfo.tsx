"use client"

import { Clock } from "lucide-react"
import * as React from "react"

import { FLAG_AI_SUMMARIES, useFeatureFlag } from "@/lib/feature-flags/flags"
import { formatDuration } from "@/lib/utils/track-formatters"
import { FavoriteButton } from "./FavoriteButton"
import { type CatalogItemType } from "../types/catalog-types"

export function TrackDetailInfo({ item }: { item: CatalogItemType }) {
  const [isMounted, setIsMounted] = React.useState(false)
  const flagEnabled = useFeatureFlag(FLAG_AI_SUMMARIES)
  const isAiSummariesEnabled = isMounted && flagEnabled

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="mb-6 flex flex-col items-center space-y-4 text-center">
      <div className="w-full space-y-1.5 px-4">
        <h1 className="text-foreground font-serif text-4xl leading-tight font-bold tracking-tight text-balance drop-shadow-sm sm:text-5xl">
          {item.title}
        </h1>
        <p className="text-muted-foreground text-xl font-medium drop-shadow-sm sm:text-2xl">{item.artist}</p>
        {item.album && <p className="text-muted-foreground/60 text-sm italic">{item.album}</p>}
      </div>
      {item.genre && (
        <div className="pt-2">
          <span className="text-muted-foreground border-border/30 bg-background/20 rounded-full border px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase shadow-sm backdrop-blur-md">
            {item.genre}
          </span>
        </div>
      )}

      {isAiSummariesEnabled && (
        <div className="bg-background/20 mt-4 inline-flex items-center gap-2 rounded-full border border-white/5 px-4 py-1.5 backdrop-blur-md">
          <span className="text-primary text-[10px]">✨</span>
          <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
            AI Summary Coming Soon
          </p>
        </div>
      )}
    </div>
  )
}
