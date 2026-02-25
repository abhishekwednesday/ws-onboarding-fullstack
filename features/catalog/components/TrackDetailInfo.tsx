import { Clock } from "lucide-react"
import * as React from "react"

import { FavoriteButton } from "./FavoriteButton"
import { type CatalogItemType } from "../types/catalog-types"
import { formatDuration } from "../utils/track-formatters"

export function TrackDetailInfo({ item }: { item: CatalogItemType }) {
  return (
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
  )
}
