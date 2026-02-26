"use client"

import { useSyncLikedSongs } from "@/features/playlist/hooks/useSyncLikedSongs"

/**
 * Client component that runs global sync effects.
 * Mounted once in the root layout to hydrate stores from server state.
 */
export function GlobalSyncProvider() {
  useSyncLikedSongs()
  return null
}
