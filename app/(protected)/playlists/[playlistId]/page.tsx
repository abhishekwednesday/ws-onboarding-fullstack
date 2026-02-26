import { PlaylistDetailPage } from "@/features/playlist/components/PlaylistDetailPage"

interface PageProps {
  params: Promise<{ playlistId: string }>
}

/**
 * Dynamic route for individual playlist details.
 * Passes the playlistId to the client component.
 */
export default async function Page({ params }: PageProps) {
  const { playlistId } = await params
  return <PlaylistDetailPage playlistId={playlistId} />
}
