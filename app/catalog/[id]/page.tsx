import { Metadata } from "next"
import { notFound } from "next/navigation"
import * as React from "react"

import { TrackDetailPage } from "@/features/catalog/components/TrackDetailPage"
import { MOCK_CATALOG_ITEMS } from "@/features/catalog/types/catalog-types"

interface PagePropsType {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return MOCK_CATALOG_ITEMS.map((item) => ({ id: String(item.id) }))
}

export async function generateMetadata({ params }: PagePropsType): Promise<Metadata> {
  const { id } = await params
  const item = MOCK_CATALOG_ITEMS.find((i) => String(i.id) === id)
  if (!item) {
    return { title: "Track Not Found - MusicStream" }
  }
  return {
    title: `${item.title} by ${item.artist} - MusicStream`,
    description: `Listen to ${item.title} by ${item.artist} on MusicStream.`,
  }
}

/**
 * Route handler for /catalog/[id].
 * Renders a static detail view for a track from the mock catalog.
 */
export default async function Page({ params }: PagePropsType) {
  const { id } = await params
  const item = MOCK_CATALOG_ITEMS.find((i) => String(i.id) === id)

  if (!item) {
    notFound()
  }

  return <TrackDetailPage item={item} />
}
