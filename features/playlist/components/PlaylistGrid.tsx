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
      <Card className="glass-card border-border/40 hover:border-primary/30 group-hover:bg-card/40 flex h-full flex-col overflow-hidden rounded-3xl py-0 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
        <CardHeader className="relative pt-6 pb-0">
          <div className="from-primary/20 to-primary/5 mb-6 flex h-56 w-full items-center justify-center rounded-2xl bg-gradient-to-br transition-all duration-700 group-hover:scale-[1.03] group-hover:shadow-lg md:h-48 lg:h-40 xl:h-48">
            {playlist.isLiked ? (
              <ListMusic className="text-primary h-20 w-20 opacity-80 drop-shadow-md" />
            ) : (
              <Music className="text-muted-foreground/40 group-hover:text-primary h-16 w-16 drop-shadow-sm transition-colors duration-500" />
            )}
          </div>
          {playlist.isLiked && (
            <Badge className="bg-primary/20 text-primary border-primary/20 absolute top-8 right-8 shadow-sm backdrop-blur-md">
              System
            </Badge>
          )}
          <CardTitle className="group-hover:text-primary line-clamp-1 font-serif text-2xl font-bold tracking-tight transition-colors">
            {playlist.name}
          </CardTitle>
          <CardDescription className="mt-1 line-clamp-2 h-10 text-sm">
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
        <CardFooter className="text-primary border-border/30 bg-muted/10 group-hover:bg-muted/30 border-t py-4 text-xs font-bold tracking-wider uppercase transition-colors">
          <span className="flex w-full items-center justify-between">
            View Details
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}
