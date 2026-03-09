import { ChevronLeft, Clock, Hash, Play } from "lucide-react"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { itunesAlbumLookupAction } from "@/features/catalog/api/catalog-actions"
import { FavoriteButton } from "@/features/catalog/components/FavoriteButton"
import { LoadingState } from "@/features/catalog/components/LoadingState"
import { cn } from "@/lib/utils"
import { formatDuration } from "@/lib/utils/track-formatters"

interface AlbumPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
  try {
    const { id } = await params
    const albumId = parseInt(id)
    if (isNaN(albumId)) return { title: "Album Not Found" }
    const { album } = await itunesAlbumLookupAction(albumId)
    return {
      title: `${album.title} by ${album.artist} - MusicStream`,
      description: `Listen to ${album.title} by ${album.artist} on MusicStream.`,
    }
  } catch {
    return { title: "Album Not Found" }
  }
}

async function AlbumContent({ id }: { id: number }) {
  try {
    const { album, items } = await itunesAlbumLookupAction(id)
    const highResArtwork = album.artworkUrl?.replace("100x100bb.jpg", "600x600bb.jpg")

    return (
      <div className="space-y-10 py-10">
        <Link
          href="/catalog"
          className="text-muted-foreground hover:text-foreground flex w-fit items-center text-sm font-medium transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Catalog
        </Link>

        {/* Hero Section */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end">
          <div className="glass-card relative aspect-square w-full max-w-[300px] overflow-hidden rounded-2xl shadow-2xl">
            {highResArtwork ? (
              <Image src={highResArtwork} alt={album.title} fill className="object-cover" priority />
            ) : (
              <div className="bg-muted flex h-full w-full items-center justify-center">
                <span className="text-muted-foreground">No Artwork</span>
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col space-y-4">
            <span className="border-border/50 bg-background/40 text-muted-foreground w-fit rounded-full border px-3 py-1 text-[10px] font-bold tracking-widest uppercase backdrop-blur-md">
              Album
            </span>
            <div className="space-y-2">
              <h1 className="text-foreground font-serif text-4xl font-bold tracking-tight sm:text-6xl">
                {album.title}
              </h1>
              <div className="flex items-center gap-2">
                {album.artistId ? (
                  <Link
                    href={`/artist/${album.artistId}`}
                    className="text-muted-foreground hover:text-primary text-lg font-medium transition-colors"
                  >
                    {album.artist}
                  </Link>
                ) : (
                  <span className="text-muted-foreground text-lg font-medium">{album.artist}</span>
                )}
                {album.genre && (
                  <>
                    <span className="text-muted-foreground/40">•</span>
                    <span className="text-muted-foreground">{album.genre}</span>
                  </>
                )}
                {items.length > 0 && (
                  <>
                    <span className="text-muted-foreground/40">•</span>
                    <span className="text-muted-foreground">{items.length} tracks</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <Link
                href={items.length > 0 ? `/catalog/${items[0]!.id}` : "#"}
                aria-disabled={items.length === 0}
                className={cn(
                  "bg-primary text-primary-foreground flex h-14 items-center gap-2 rounded-2xl px-8 font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] active:scale-95",
                  items.length === 0 && "pointer-events-none opacity-50"
                )}
              >
                <Play className="h-5 w-5 fill-current" />
                Play Album
              </Link>
              <FavoriteButton
                track={album}
                className="border-border/50 bg-background/40 h-14 w-14 rounded-2xl backdrop-blur-md"
              />
            </div>
          </div>
        </div>

        {/* Tracklist Section */}
        <div className="border-border/40 border-t pt-10">
          <h2 className="text-foreground mb-6 font-serif text-2xl font-bold">Tracks</h2>
          <div className="border-border/40 glass-card overflow-hidden rounded-3xl border">
            <div className="border-border/20 bg-background/20 text-muted-foreground grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b px-6 py-4 text-xs font-bold tracking-wider uppercase">
              <span className="flex w-8 items-center justify-center">
                <Hash className="h-3 w-3" />
              </span>
              <span>Title</span>
              <span className="flex w-12 items-center justify-end">
                <Clock className="h-3 w-3" />
              </span>
            </div>
            <div className="divide-border/10 divide-y">
              {items.map((track, index) => (
                <Link
                  key={track.id}
                  href={`/catalog/${track.id}`}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-4 transition-colors hover:bg-white/5 active:bg-white/10"
                >
                  <span className="text-muted-foreground group-hover:text-primary flex w-8 justify-center text-sm font-medium transition-colors">
                    {index + 1}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-foreground group-hover:text-primary line-clamp-1 font-medium transition-colors">
                      {track.title}
                    </span>
                    <span className="text-muted-foreground line-clamp-1 text-xs">{track.artist}</span>
                  </div>
                  <span className="text-muted-foreground flex w-12 justify-end font-mono text-sm">
                    {track.duration ? formatDuration(track.duration) : "--:--"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Album Content Error:", error)
    notFound()
  }
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { id } = await params
  const albumId = parseInt(id)
  if (isNaN(albumId)) notFound()

  return (
    <Suspense fallback={<LoadingState />}>
      <AlbumContent id={albumId} />
    </Suspense>
  )
}
