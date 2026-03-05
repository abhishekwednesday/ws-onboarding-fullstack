import { Metadata } from "next"
import * as React from "react"

import { TrackDetailPage } from "@/features/catalog/components/TrackDetailPage"
import { type CatalogItemType } from "@/features/catalog/types/catalog-types"
import { MOCK_CATALOG_ITEMS } from "@/features/catalog/utils/mock-data"

interface PagePropsType {
  params: Promise<{ id: string }>
}

const getItemById = (id: string): CatalogItemType | undefined => MOCK_CATALOG_ITEMS.find((i) => String(i.id) === id)

export async function generateMetadata({ params }: PagePropsType): Promise<Metadata> {
  const { id } = await params
  const item = getItemById(id)
  return {
    title: item ? `${item.title} by ${item.artist} - MusicStream` : `Track #${id} - MusicStream`,
    description: "Track detail page.",
  }
}

/**
 * Route handler for /catalog/[id].
 * Delegates data fetching to the TrackDetailPage client component via React Query.
 */
export default async function Page({ params }: PagePropsType) {
  const { id } = await params
  const numericId = Number(id)

  return <TrackDetailPage id={numericId} />
}
