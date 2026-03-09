import Image from "next/image"

export function TrackDetailCompliance({ trackViewUrl }: { trackViewUrl?: string }) {
  return (
    <div className="border-border flex flex-col items-center gap-2 border-t pt-5">
      <p className="text-muted-foreground/40 text-xs italic">Preview provided courtesy of iTunes</p>
      {trackViewUrl && (
        <a
          href={trackViewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-50 transition-opacity hover:opacity-90"
        >
          <Image
            src="/images/branding/itunes-badge.png"
            alt="Listen on Apple Music"
            width={80}
            height={32}
            className="h-8 w-auto"
          />
        </a>
      )}
    </div>
  )
}
