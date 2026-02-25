export function TrackDetailCompliance({ trackViewUrl }: { trackViewUrl?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 border-t border-white/10 pt-5">
      <p className="text-muted-foreground/40 text-xs italic">Preview provided courtesy of iTunes</p>
      {trackViewUrl && (
        <a
          href={trackViewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-50 transition-opacity hover:opacity-90"
        >
          <img src="/images/branding/itunes-badge.png" alt="Listen on Apple Music" className="h-8 w-auto" />
        </a>
      )}
    </div>
  )
}
