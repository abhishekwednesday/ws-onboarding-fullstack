import { ChevronLeft, Music2 } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { itunesArtistLookupAction } from "@/features/catalog/api/catalog-actions"
import { ArtistArtworkCarousel } from "@/features/catalog/components/ArtistArtworkCarousel"
import { CatalogCard } from "@/features/catalog/components/CatalogCard"
import { LoadingState } from "@/features/catalog/components/LoadingState"

interface ArtistPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ArtistPageProps): Promise<Metadata> {
  try {
    const { id } = await params
    const artistId = parseInt(id)
    if (isNaN(artistId)) return { title: "Artist Not Found" }
    const { artist } = await itunesArtistLookupAction(artistId)
    return {
      title: `${artist.artist} - MusicStream`,
      description: `Explore albums and top tracks by ${artist.artist} on MusicStream.`,
    }
  } catch {
    return { title: "Artist Not Found" }
  }
}

async function ArtistContent({ id }: { id: number }) {
  try {
    const { artist, albums } = await itunesArtistLookupAction(id)
    const allArtworks = albums.map((a) => a.artworkUrl).filter((url): url is string => !!url)

    return (
      <div className="space-y-10 py-10">
        <Link
          href="/catalog"
          className="text-muted-foreground hover:text-foreground flex w-fit items-center text-sm font-medium transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Catalog
        </Link>

        {/* Artist Header */}
        <div className="space-y-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="border-border/50 bg-background/40 relative h-48 w-48 overflow-hidden rounded-3xl border shadow-xl backdrop-blur-md">
              <ArtistArtworkCarousel artworks={allArtworks} artistName={artist.artist} />
            </div>
            <div className="space-y-2">
              <span className="border-border/50 bg-background/40 text-muted-foreground w-fit rounded-full border px-3 py-1 text-[10px] font-bold tracking-widest uppercase backdrop-blur-md">
                Artist
              </span>
              <h1 className="text-foreground font-serif text-5xl font-bold tracking-tight sm:text-7xl">
                {artist.artist}
              </h1>
              <div className="text-muted-foreground flex items-center gap-2">
                <Music2 className="h-4 w-4" />
                <span className="font-medium">{artist.genre || "Music"}</span>
                {albums.length > 0 && (
                  <>
                    <span className="text-muted-foreground/40">•</span>
                    <span>{albums.length} albums</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Albums Grid */}
        <div className="border-border/40 border-t pt-10">
          <h2 className="text-foreground mb-8 font-serif text-2xl font-bold">Albums</h2>
          {albums.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {albums.map((album) => (
                <CatalogCard key={album.id} item={album} />
              ))}
            </div>
          ) : (
            <div className="border-border/10 bg-background/20 flex min-h-[200px] flex-col items-center justify-center rounded-3xl border py-10 text-center">
              <p className="text-muted-foreground font-medium">No albums found for this artist.</p>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Artist Content Error:", error)
    notFound()
  }
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { id } = await params
  const artistId = parseInt(id)
  if (isNaN(artistId)) notFound()

  return (
    <Suspense fallback={<LoadingState />}>
      <ArtistContent id={artistId} />
    </Suspense>
  )
}
