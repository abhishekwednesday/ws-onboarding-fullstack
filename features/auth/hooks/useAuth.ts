"use client"

import { useTransition } from "react"
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
  const { favorites } = useFavoritesStore()

  const login = (data: LoginFormData, redirectTo = "/playlists", onError?: (msg: string) => void) => {
    startTransition(async () => {
      const res = await loginAction(data)
      if (res.success) {
        // Sync local liked songs to DB on successful login
        const tracks = Object.values(favorites)
        if (tracks.length > 0) {
          await syncLikedSongsAction(tracks)
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
          await syncLikedSongsAction(tracks)
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
