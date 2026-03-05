import { Metadata } from "next"
import * as React from "react"

import { itunesLookupSingleAction } from "@/features/catalog/api/catalog-actions"
import { TrackDetailPage } from "@/features/catalog/components/TrackDetailPage"

interface PagePropsType {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PagePropsType): Promise<Metadata> {
  const { id } = await params

  try {
    const item = await itunesLookupSingleAction(Number(id))
    if (item) {
      return {
        title: `${item.title} by ${item.artist} - MusicStream`,
        description: `Listen to ${item.title} by ${item.artist}.`,
      }
    }
  } catch (error) {
    console.error(`Failed to generate metadata for track ${id}:`, error)
  }

  return {
    title: `Track #${id} - MusicStream`,
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
