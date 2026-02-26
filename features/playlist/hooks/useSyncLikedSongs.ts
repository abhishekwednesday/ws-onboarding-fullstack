"use client"

import { useEffect, useRef } from "react"
import { useFavoritesStore } from "@/features/catalog/store/useFavoritesStore"
import { useSession } from "@/lib/auth/auth-client"
import { getLikedSongsAction } from "../api/playlist-actions"

/**
 * Hydrates the client-side `useFavoritesStore` from the server's
 * "Liked Songs" playlist when an authenticated session is detected.
 *
 * Mount this hook once in a layout or provider that wraps authenticated pages.
 * It runs once per session to avoid redundant fetches.
 */
export function useSyncLikedSongs() {
  const { data: session } = useSession()
  const syncedUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    const userId = session?.user?.id
    if (!userId || syncedUserIdRef.current === userId) return

    async function hydrate() {
      try {
        const result = await getLikedSongsAction()
        if (result.success && result.data) {
          useFavoritesStore.getState().replaceFavorites(result.data)
          syncedUserIdRef.current = userId!
        }
      } catch {
        // Best-effort — don't crash the app if hydration fails; retry allowed on next render
      }
    }

    hydrate()
  }, [session])
}
