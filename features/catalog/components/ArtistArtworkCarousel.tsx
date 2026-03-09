"use client"

import * as React from "react"
import Image from "next/image"
import { Users } from "lucide-react"

interface ArtistArtworkCarouselProps {
    artworks: string[]
    artistName: string
}

export function ArtistArtworkCarousel({ artworks, artistName }: ArtistArtworkCarouselProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0)

    // Use unique artworks to avoid showing the same image twice if an artist has multiple 
    // items with the same collection image or just a few albums
    const uniqueArtworks = React.useMemo(() => {
        return Array.from(new Set(artworks)).filter(Boolean)
    }, [artworks])

    React.useEffect(() => {
        setCurrentIndex(0)

        if (uniqueArtworks.length <= 1) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % uniqueArtworks.length)
        }, 4000)

        return () => clearInterval(interval)
    }, [uniqueArtworks])

    if (uniqueArtworks.length === 0) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-muted">
                <Users className="h-16 w-16 text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="relative h-full w-full">
            {uniqueArtworks.map((url, index) => (
                <div
                    key={url}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    <Image
                        src={url.replace("100x100bb.jpg", "600x600bb.jpg")}
                        alt={`${artistName} artwork ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                    />
                </div>
            ))}

            {/* Subtle overlay gradient for depth */}
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
    )
}
