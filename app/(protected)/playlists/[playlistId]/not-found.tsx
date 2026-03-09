import { ArrowLeft, Music } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="bg-muted mb-6 flex h-20 w-20 items-center justify-center rounded-full">
        <Music className="text-muted-foreground h-10 w-10" />
      </div>
      <h2 className="text-2xl font-bold">Playlist Not Found</h2>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">
        The playlist you&apos;re looking for doesn&apos;t exist or may have been deleted.
      </p>
      <Button asChild variant="outline" className="mt-8">
        <Link href="/playlists">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Playlists
        </Link>
      </Button>
    </div>
  )
}
