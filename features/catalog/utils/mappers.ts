import { type ItunesItemType } from "@/lib/api/schemas"
import { type CatalogItemType } from "../types/catalog-types"

/**
 * Mapper function to transform any Itunes item to CatalogItemType.
 */
export function mapItunesItemToCatalogItem(item: ItunesItemType): CatalogItemType | null {
    // If we have a trackId, it's likely a track.
    // Otherwise we map collectionId or artistId as the main ID for broader media types.
    const idValue =
        "trackId" in item && typeof item.trackId === "number"
            ? item.trackId
            : "collectionId" in item && typeof item.collectionId === "number"
                ? item.collectionId
                : "artistId" in item && typeof item.artistId === "number"
                    ? item.artistId
                    : null

    if (idValue === null) return null

    const titleValue =
        "trackName" in item && typeof item.trackName === "string"
            ? item.trackName
            : "collectionName" in item && typeof item.collectionName === "string"
                ? item.collectionName
                : "artistName" in item && typeof item.artistName === "string"
                    ? item.artistName
                    : "Unknown"

    return {
        id: idValue,
        title: titleValue,
        artist: "artistName" in item && typeof item.artistName === "string" ? item.artistName : "Unknown Artist",
        artistId: "artistId" in item && typeof item.artistId === "number" ? item.artistId : undefined,
        album: "collectionName" in item && typeof item.collectionName === "string" ? item.collectionName : undefined,
        collectionId: "collectionId" in item && typeof item.collectionId === "number" ? item.collectionId : undefined,
        artworkUrl: "artworkUrl100" in item && typeof item.artworkUrl100 === "string" ? item.artworkUrl100 : undefined,
        previewUrl: "previewUrl" in item && typeof item.previewUrl === "string" ? item.previewUrl : undefined,
        genre: "primaryGenreName" in item && typeof item.primaryGenreName === "string" ? item.primaryGenreName : undefined,
        duration: "trackTimeMillis" in item && typeof item.trackTimeMillis === "number" ? item.trackTimeMillis : undefined,
        trackViewUrl: "trackViewUrl" in item && typeof item.trackViewUrl === "string" ? item.trackViewUrl : undefined,
    }
}
