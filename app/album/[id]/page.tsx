import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { itunesAlbumLookupAction } from "@/features/catalog/api/catalog-actions"
import { FavoriteButton } from "@/features/catalog/components/FavoriteButton"
import { LoadingState } from "@/features/catalog/components/LoadingState"
import { ChevronLeft, Play, Clock, Hash } from "lucide-react"

interface AlbumPageProps {
    params: { id: string }
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
    } catch (error) {
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
                    className="flex w-fit items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back to Catalog
                </Link>

                {/* Hero Section */}
                <div className="flex flex-col gap-8 md:flex-row md:items-end">
                    <div className="relative aspect-square w-full max-w-[300px] overflow-hidden rounded-2xl shadow-2xl glass-card">
                        {highResArtwork ? (
                            <Image
                                src={highResArtwork}
                                alt={album.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-muted">
                                <span className="text-muted-foreground">No Artwork</span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-1 flex-col space-y-4">
                        <span className="w-fit rounded-full border border-border/50 bg-background/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground backdrop-blur-md">
                            Album
                        </span>
                        <div className="space-y-2">
                            <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-6xl text-foreground">
                                {album.title}
                            </h1>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/artist/${album.artistId}`}
                                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                                >
                                    {album.artist}
                                </Link>
                                <span className="text-muted-foreground/40">•</span>
                                <span className="text-muted-foreground">{album.genre}</span>
                                {items.length > 0 && (
                                    <>
                                        <span className="text-muted-foreground/40">•</span>
                                        <span className="text-muted-foreground">{items.length} tracks</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-4 pt-4">
                            <button className="flex h-14 items-center gap-2 rounded-2xl bg-primary px-8 font-bold text-primary-foreground transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] active:scale-95">
                                <Play className="h-5 w-5 fill-current" />
                                Play Album
                            </button>
                            <FavoriteButton
                                track={album}
                                className="h-14 w-14 rounded-2xl border-border/50 bg-background/40 backdrop-blur-md"
                            />
                        </div>
                    </div>
                </div>

                {/* Tracklist Section */}
                <div className="border-t border-border/40 pt-10">
                    <h2 className="mb-6 font-serif text-2xl font-bold text-foreground">Tracks</h2>
                    <div className="overflow-hidden rounded-3xl border border-border/40 glass-card">
                        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-border/20 bg-background/20 px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            <span className="flex w-8 justify-center items-center">
                                <Hash className="h-3 w-3" />
                            </span>
                            <span>Title</span>
                            <span className="flex w-12 justify-end items-center">
                                <Clock className="h-3 w-3" />
                            </span>
                        </div>
                        <div className="divide-y divide-border/10">
                            {items.map((track, index) => (
                                <Link
                                    key={track.id}
                                    href={`/catalog/${track.id}`}
                                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-4 transition-colors hover:bg-white/5 active:bg-white/10"
                                >
                                    <span className="flex w-8 justify-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                                        {index + 1}
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                            {track.title}
                                        </span>
                                        <span className="text-xs text-muted-foreground line-clamp-1">
                                            {track.artist}
                                        </span>
                                    </div>
                                    <span className="flex w-12 justify-end text-sm text-muted-foreground font-mono">
                                        {track.duration
                                            ? `${Math.floor(track.duration / 60000)}:${String(Math.floor((track.duration % 60000) / 1000)).padStart(2, '0')}`
                                            : "--:--"}
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
