/**
 * Shared props type for Next.js App Router error boundary components.
 * Used by catalog error.tsx files to type the error and reset callback.
 */
export interface ErrorPagePropsType {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Represent a catalog item in the UI.
 * Standardized format mapped from ITunes API response.
 */
export type CatalogItemType = {
  id: number
  title: string
  artist: string
  artistId?: number
  album?: string
  collectionId?: number
  artworkUrl?: string
  previewUrl?: string
  genre?: string
  duration?: number
  trackViewUrl?: string
}

export interface FavoritesStateType {
  favorites: Record<number, CatalogItemType>
  toggleFavorite: (track: CatalogItemType) => void
  isFavorite: (id: number) => boolean
  clearFavorites: () => void
  replaceFavorites: (tracks: CatalogItemType[]) => void
}

export interface FavoriteButtonPropsType {
  track: CatalogItemType
  className?: string
  iconOnly?: boolean
}

export interface CatalogCardPropsType {
  item: CatalogItemType
}

export interface TrackDetailPagePropsType {
  id: number
}

export interface SearchInputPropsType {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  placeholder?: string
  isPending?: boolean
}
