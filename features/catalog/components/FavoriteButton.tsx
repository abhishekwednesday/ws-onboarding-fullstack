"use client"

import { Heart } from "lucide-react"
import { useOptimistic, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { likeTrackAction, unlikeTrackAction } from "@/features/playlist/api/playlist-actions"
import { trackFavoriteAdded, trackFavoriteRemoved } from "@/lib/analytics/events"
import { useSession } from "@/lib/auth/auth-client"
import { cn } from "@/lib/utils"
import { useFavoritesStore } from "../store/useFavoritesStore"
import { type FavoriteButtonPropsType } from "../types/catalog-types"

export function FavoriteButton({ track, className, iconOnly = false }: FavoriteButtonPropsType) {
  const { data: session } = useSession()
  const isFav = useFavoritesStore((state) => state.isFavorite(track.id))
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)
  const [isPending, startTransition] = useTransition()

  // useOptimistic to provide instant feedback if there's any lag or to follow user request
  const [optimisticFav, addOptimisticFav] = useOptimistic(isFav, (_state, newState: boolean) => newState)

  const handleToggle = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    if (isPending) return
    const nextState = !optimisticFav

    startTransition(async () => {
      addOptimisticFav(nextState)
      toggleFavorite(track)

      // Analytics
      if (nextState) {
        trackFavoriteAdded(track)
      } else {
        trackFavoriteRemoved(track)
      }

      if (session?.user) {
        try {
          const result = nextState ? await likeTrackAction(track) : await unlikeTrackAction(track.id)
          if (!result.success) {
            toggleFavorite(track)
          }
        } catch {
          toggleFavorite(track)
        }
      }
    })
  }

  const HeartIcon = (
    <Heart
      className={cn(
        "h-5 w-5 transition-all duration-300",
        optimisticFav ? "scale-110 fill-rose-500 text-rose-500" : "text-muted-foreground",
        isPending && "animate-pulse opacity-70"
      )}
    />
  )

  if (iconOnly) {
    return (
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={cn(
          "group flex items-center justify-center rounded-full p-2 transition-colors hover:bg-rose-500/10",
          className
        )}
        aria-label={optimisticFav ? "Remove from favorites" : "Add to favorites"}
      >
        {HeartIcon}
      </button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "rounded-full transition-all duration-200 hover:bg-rose-500/10",
        optimisticFav && "hover:bg-rose-500/20",
        className
      )}
      aria-label={optimisticFav ? "Remove from favorites" : "Add to favorites"}
    >
      {HeartIcon}
    </Button>
  )
}
