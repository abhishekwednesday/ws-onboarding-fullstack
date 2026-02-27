"use client"

import { ArrowRight, Calendar, ListMusic, Music } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type PlaylistType } from "../types/playlist-types"

/**
 * Responsive grid of playlist cards.
 */
export function PlaylistGrid({ playlists }: { playlists: PlaylistType[] }) {
  if (playlists.length === 0) {
    return (
      <div className="border-muted-foreground/20 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-20 text-center">
        <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Music className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="text-xl font-semibold">No playlists yet</h3>
        <p className="text-muted-foreground mt-2 max-w-[300px]">
          Create your first playlist and start curating your favorite tracks.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {playlists.map((playlist) => (
        <PlaylistCard key={playlist.id} playlist={playlist} />
      ))}
    </div>
  )
}

function PlaylistCard({ playlist }: { playlist: PlaylistType }) {
  const formattedDate = new Date(playlist.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Link href={`/playlists/${playlist.id}`} className="group block h-full">
      <Card className="border-border bg-card/40 group-hover:border-border group-hover:bg-card/60 flex h-full flex-col overflow-hidden py-0 transition-all duration-300 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <CardHeader className="relative pt-6 pb-0">
          <div className="from-primary/20 to-primary/5 mb-4 flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br transition-transform duration-500 group-hover:scale-105">
            {playlist.isLiked ? (
              <ListMusic className="text-primary h-20 w-20 opacity-80" />
            ) : (
              <Music className="text-muted-foreground/40 group-hover:text-primary h-16 w-16 transition-colors duration-300" />
            )}
          </div>
          {playlist.isLiked && (
            <Badge className="bg-primary/20 text-primary border-primary/20 absolute top-6 right-6 backdrop-blur-md">
              System
            </Badge>
          )}
          <CardTitle className="group-hover:text-primary line-clamp-1 transition-colors">{playlist.name}</CardTitle>
          <CardDescription className="line-clamp-2 h-10">
            {playlist.description || "No description provided."}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-auto flex-none pt-4 pb-4">
          <div className="text-muted-foreground flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-primary border-border bg-muted/30 group-hover:bg-muted/50 border-t py-3 text-xs font-semibold transition-colors">
          <span className="flex w-full items-center justify-between">
            View Details
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}
