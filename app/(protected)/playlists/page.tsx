import { GripVertical, LayoutList, Music } from "lucide-react"

export const metadata = {
  title: "Your Playlists",
  description: "Manage and listen to your custom playlists.",
}

// Mock data for the playlists page
const MOCK_PLAYLISTS = [
  { id: 1, name: "Chill Vibes", trackCount: 42, lastUpdated: "2 days ago" },
  { id: 2, name: "Workout Mix HQ", trackCount: 18, lastUpdated: "5 hours ago" },
  { id: 3, name: "Focus & Flow", trackCount: 56, lastUpdated: "1 week ago" },
  { id: 4, name: "Weekend Party", trackCount: 112, lastUpdated: "Just now" },
]

export default function PlaylistsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-8 py-8 duration-500 md:py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Your Playlists</h1>
          <p className="text-muted-foreground mt-2 text-lg">Curate your perfect soundtrack.</p>
        </div>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 rounded-full px-6 py-2.5 font-semibold shadow-sm transition-all active:scale-95">
          <LayoutList className="h-5 w-5" />
          Create Playlist
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MOCK_PLAYLISTS.map((playlist) => (
          <div
            key={playlist.id}
            className="group relative flex cursor-pointer flex-col gap-4 rounded-xl border border-white/5 bg-white/5 p-4 transition-all hover:border-white/10 hover:bg-white/10"
          >
            {/* Playlist Cover Mock */}
            <div className="bg-secondary/50 group-hover:bg-secondary/70 flex aspect-square items-center justify-center rounded-lg border border-white/5 transition-colors">
              <Music className="text-muted-foreground/50 group-hover:text-primary/50 h-12 w-12 transition-transform group-hover:scale-110" />
            </div>

            {/* Playlist Info */}
            <div className="flex flex-col gap-1">
              <h3 className="group-hover:text-primary font-semibold tracking-tight transition-colors">
                {playlist.name}
              </h3>
              <div className="text-muted-foreground flex items-center justify-between text-sm">
                <span>{playlist.trackCount} tracks</span>
                <span className="text-xs opacity-70">{playlist.lastUpdated}</span>
              </div>
            </div>

            {/* Drag Handle Mock */}
            <div className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
              <GripVertical className="text-muted-foreground/50 h-5 w-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
