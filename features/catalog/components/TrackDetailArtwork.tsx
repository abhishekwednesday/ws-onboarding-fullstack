import { Music } from "lucide-react"
import Image from "next/image"
import * as React from "react"

export function TrackDetailArtwork({
  title,
  artworkUrl,
  isPlaying,
}: {
  title: string
  artworkUrl?: string
  isPlaying: boolean
}) {
  const highResArtwork = artworkUrl?.replace("100x100bb.jpg", "600x600bb.jpg")

  return (
    <>
      {/* Full-viewport immersive background */}
      {highResArtwork && (
        <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
          <Image
            src={highResArtwork}
            alt=""
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center",
              filter: "blur(120px) saturate(1.5)",
              transform: "scale(1.2)",
              opacity: 0.2,
            }}
          />
          <div className="bg-background/80 absolute inset-0" />
          <div className="from-background/90 to-background absolute inset-0 bg-gradient-to-b via-transparent" />
        </div>
      )}

      {/* Primary Artwork Card */}
      <div
        className={`relative mx-auto mb-12 w-full max-w-[320px] transition-all duration-[800ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] sm:max-w-[400px] ${
          isPlaying ? "scale-105" : "scale-100"
        }`}
      >
        {highResArtwork && (
          <div
            className="absolute -inset-6 rounded-3xl blur-3xl"
            style={{
              backgroundImage: `url(${highResArtwork})`,
              backgroundSize: "cover",
              opacity: isPlaying ? 0.7 : 0.4,
              transition: "opacity 0.8s",
            }}
          />
        )}
        {highResArtwork ? (
          <Image
            src={highResArtwork}
            alt={`${title} artwork`}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-2xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
          />
        ) : (
          <div className="bg-muted relative flex aspect-square w-full items-center justify-center rounded-3xl">
            <Music className="text-muted-foreground h-20 w-20" />
          </div>
        )}
      </div>
    </>
  )
}
