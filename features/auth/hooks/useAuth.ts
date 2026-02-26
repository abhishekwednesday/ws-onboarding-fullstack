"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { useFavoritesStore } from "@/features/catalog/store/useFavoritesStore"
import { syncLikedSongsAction } from "@/features/playlist/api/playlist-actions"
import { loginAction, logoutAction, registerAction } from "../api/auth-actions"
import { type LoginFormData, type RegisterFormData } from "../types/auth-types"

/**
 * React Hook for handling authentication state via Server Actions.
 * Provides login, register, logout functions and exposes an isPending state
 * for UI loading indicators.
 */
export function useAuth() {
  const [isPending, startTransition] = useTransition()
  const { favorites, clearFavorites } = useFavoritesStore()

  const login = (data: LoginFormData, redirectTo = "/playlists", onError?: (msg: string) => void) => {
    startTransition(async () => {
      const res = await loginAction(data)
      if (res.success) {
        // Sync local liked songs to DB on successful login
        const tracks = Object.values(favorites)
        if (tracks.length > 0) {
          try {
            const syncRes = await syncLikedSongsAction(tracks)
            if (syncRes.success) {
              clearFavorites()
            } else {
              console.error("Failed to sync liked songs:", syncRes.error)
              toast.error("Could not sync your favorites to the server.")
            }
          } catch (err) {
            console.error("Sync error during login:", err)
            toast.error("An error occurred while syncing your favorites.")
          }
        }
        // Force a hard navigation so the better-auth client state (useSession) re-initializes with the new cookie
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
        // Sync local liked songs to DB on successful registration
        const tracks = Object.values(favorites)
        if (tracks.length > 0) {
          try {
            const syncRes = await syncLikedSongsAction(tracks)
            if (syncRes.success) {
              clearFavorites()
            } else {
              console.error("Failed to sync liked songs:", syncRes.error)
              toast.error("Could not sync your favorites to the server.")
            }
          } catch (err) {
            console.error("Sync error during registration:", err)
            toast.error("An error occurred while syncing your favorites.")
          }
        }
        window.location.href = redirectTo
      } else {
        if (onError) onError(res.error)
      }
    })
  }

  const logout = () => {
    startTransition(async () => {
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
