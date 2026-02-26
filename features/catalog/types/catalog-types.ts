import { type ItunesTrackType } from "@/lib/api/schemas"

/**
 * Represent a catalog item in the UI.
 * Standardized format mapped from ITunes API response.
 */
export type CatalogItemType = {
  id: number
  title: string
  artist: string
  album?: string
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

/**
 * Mapper function to transform ItunesTrackType to CatalogItemType.
 */
export function mapItunesTrackToCatalogItem(track: ItunesTrackType): CatalogItemType {
  return {
    id: track.trackId,
    title: track.trackName,
    artist: track.artistName,
    album: track.collectionName,
    artworkUrl: track.artworkUrl100,
    previewUrl: track.previewUrl,
    genre: track.primaryGenreName,
    duration: track.trackTimeMillis,
    trackViewUrl: track.trackViewUrl,
  }
}
