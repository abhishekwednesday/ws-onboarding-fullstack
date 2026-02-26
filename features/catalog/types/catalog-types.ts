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

/**
 * Mock data for the initial static catalog layout.
 */
export const MOCK_CATALOG_ITEMS: CatalogItemType[] = [
  {
    id: 1,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    artworkUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/4a/df/7a/4adf7a2f-12c1-22e7-0347-6644d673173d/00602567227498.rgb.jpg/100x100bb.jpg",
    genre: "Rock",
    duration: 354000,
  },
  {
    id: 2,
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    artworkUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/71/84/86/7184869c-2f91-8840-798d-e448377759b8/20UMGIM13920.rgb.jpg/100x100bb.jpg",
    genre: "Pop",
    duration: 200000,
  },
  {
    id: 3,
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "÷ (Deluxe)",
    artworkUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/f4/01/24/f401249b-7524-817e-9762-ca21272fca3b/825646337854.jpg/100x100bb.jpg",
    genre: "Pop",
    duration: 233000,
  },
  {
    id: 4,
    title: "Stay",
    artist: "The Kid LAROI & Justin Bieber",
    album: "F*CK LOVE 3: OVER YOU",
    artworkUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/31/58/e1/3158e174-8898-0524-2c67-64047a052846/886449339097.jpg/100x100bb.jpg",
    genre: "Pop",
    duration: 141000,
  },
]
