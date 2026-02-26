"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { useFavoritesStore } from "@/features/catalog/store/useFavoritesStore"
import { type CatalogItemType } from "@/features/catalog/types/catalog-types"
import { getLikedSongsAction, syncLikedSongsAction } from "@/features/playlist/api/playlist-actions"
import { loginAction, logoutAction, registerAction } from "../api/auth-actions"
import { type LoginFormData, type RegisterFormData } from "../types/auth-types"

async function syncFavoritesOnAuth(tracks: CatalogItemType[], context: string): Promise<void> {
  if (tracks.length === 0) return
  try {
    const syncRes = await syncLikedSongsAction(tracks)
    if (!syncRes.success) {
      console.error(`Failed to sync liked songs during ${context}:`, syncRes.error)
      toast.error("Could not sync your favorites to the server.")
    }
  } catch (err) {
    console.error(`Sync error during ${context}:`, err)
    toast.error("An error occurred while syncing your favorites.")
  }
}

/**
 * React Hook for handling authentication state via Server Actions.
 * Provides login, register, logout functions and exposes an isPending state
 * for UI loading indicators.
 */
export function useAuth() {
  const [isPending, startTransition] = useTransition()
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites)
  const replaceFavorites = useFavoritesStore((state) => state.replaceFavorites)

  const login = (data: LoginFormData, redirectTo = "/playlists", onError?: (msg: string) => void) => {
    startTransition(async () => {
      const res = await loginAction(data)
      if (res.success) {
        // 1. Push any local offline likes to the server
        const currentTracks = Object.values(useFavoritesStore.getState().favorites)
        await syncFavoritesOnAuth(currentTracks, "login")

        const serverLikes = await getLikedSongsAction()
        if (serverLikes.success && serverLikes.data) {
          replaceFavorites(serverLikes.data)
        } else {
          console.error("Failed to fetch liked songs after login:", serverLikes)
          toast.error("Your favorites may be out of sync. Try refreshing the page.")
        }

        window.location.href = redirectTo
      } else {
        if (onError) onError(res.error)
      }
    })
  }

  const register = (data: RegisterFormData, redirectTo = "/playlists", onError?: (msg: string) => void) => {
    startTransition(async () => {
      const res = await registerAction(data)
      if (res.success) {
        const currentTracks = Object.values(useFavoritesStore.getState().favorites)
        await syncFavoritesOnAuth(currentTracks, "registration")
        clearFavorites()

        window.location.href = redirectTo
      } else {
        if (onError) onError(res.error)
      }
    })
  }

  const logout = () => {
    startTransition(async () => {
      clearFavorites()
      const res = await logoutAction()
      if (res.success) {
        window.location.href = "/"
      }
    })
  }

  return {
    login,
    register,
    logout,
    isPending,
  }
}
