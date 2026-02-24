"use client"

import { Play } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type CatalogItemType } from "../types/catalog-types"

interface CatalogCardPropsType {
  item: CatalogItemType
}

export function CatalogCard({ item }: CatalogCardPropsType) {
  const handlePlayClick = () => {
    if (item.previewUrl) {
      window.open(item.previewUrl, "_blank")
    }
  }

  return (
    <Card className="group hover:border-primary/50 overflow-hidden py-0 transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className="relative aspect-square w-full overflow-hidden">
          {item.artworkUrl ? (
            <img
              src={item.artworkUrl.replace("100x100bb.jpg", "400x400bb.jpg")}
              alt={item.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="bg-muted flex h-full w-full items-center justify-center">
              <span className="text-muted-foreground">No Artwork</span>
            </div>
          )}
          <div className="bg-background/40 absolute inset-0 flex items-center justify-center opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <Button
              size="icon"
              variant="secondary"
              className="h-12 w-12 rounded-full shadow-lg"
              onClick={handlePlayClick}
              aria-label={`Play ${item.title}`}
            >
              <Play className="fill-current" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="line-clamp-1 text-base font-bold">{item.title}</CardTitle>
        <p className="text-muted-foreground line-clamp-1 text-sm">{item.artist}</p>
        {item.album && <p className="text-muted-foreground/60 line-clamp-1 text-xs italic">{item.album}</p>}
      </CardContent>
      <CardFooter className="flex flex-col space-y-3 p-4 pt-0">
        <div className="flex w-full items-center justify-between">
          <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase">
            {item.genre || "Music"}
          </span>
          {item.duration && (
            <span className="text-muted-foreground text-[10px]">
              {Math.floor(item.duration / 60000)}:
              {Math.floor((item.duration % 60000) / 1000)
                .toString()
                .padStart(2, "0")}
            </span>
          )}
        </div>
        <div className="flex w-full flex-col items-center space-y-2 border-t pt-3">
          <p className="text-muted-foreground/60 text-[9px] italic">provided courtesy of iTunes</p>
          {item.trackViewUrl && (
            <a
              href={item.trackViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img src="/images/branding/itunes-badge.png" alt="Listen on Apple Music" className="h-8 w-auto" />
            </a>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
