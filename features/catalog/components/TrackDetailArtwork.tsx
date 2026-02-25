import { Music } from "lucide-react"
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
          <img
            src={highResArtwork}
            alt=""
            className="h-full w-full object-cover object-center"
            style={{ filter: "blur(80px) saturate(1.4)", transform: "scale(1.15)", opacity: 0.45 }}
          />
          <div className="bg-background/60 absolute inset-0" />
        </div>
      )}

      {/* Primary Artwork Card */}
      <div
        className={`relative mx-auto mb-8 w-full transition-all duration-700 ${
          isPlaying ? "scale-[1.03]" : "scale-100"
        }`}
      >
        {highResArtwork && (
          <div
            className="absolute -inset-6 rounded-3xl blur-3xl"
            style={{
              backgroundImage: `url(${highResArtwork})`,
              backgroundSize: "cover",
              opacity: isPlaying ? 0.6 : 0.35,
              transition: "opacity 0.6s",
            }}
          />
        )}
        {highResArtwork ? (
          <img
            src={highResArtwork}
            alt={`${title} artwork`}
            className="relative aspect-square w-full rounded-3xl object-cover shadow-2xl"
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
