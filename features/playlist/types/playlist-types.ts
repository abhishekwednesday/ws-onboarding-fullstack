import { z } from "zod"

import { type CatalogItemType } from "@/features/catalog/types/catalog-types"

/**
 * Zod schema for creating a new playlist.
 */
export const CreatePlaylistSchema = z.object({
  name: z.string().min(1, "Playlist name is required").max(100, "Name must be 100 characters or less"),
  description: z.string().max(500, "Description must be 500 characters or less").optional(),
})

export type CreatePlaylistInput = z.infer<typeof CreatePlaylistSchema>

/**
 * Represents a playlist owned by the current user.
 */
export type PlaylistType = {
  id: string
  userId: string
  name: string
  description: string | null
  isLiked: boolean
  trackCount: number
  createdAt: string
  updatedAt: string
}

/**
 * A track stored inside a playlist, extended with the timestamp it was added.
 */
export type PlaylistTrackType = CatalogItemType & {
  addedAt: string
}

/**
 * A playlist with its full list of tracks (used on the detail page).
 */
export type PlaylistDetailType = PlaylistType & {
  tracks: PlaylistTrackType[]
}
