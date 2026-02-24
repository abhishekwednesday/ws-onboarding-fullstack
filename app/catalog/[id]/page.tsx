import { Metadata } from "next"
import * as React from "react"

import { TrackDetailPage } from "@/features/catalog/components/TrackDetailPage"

interface PagePropsType {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PagePropsType): Promise<Metadata> {
  const { id } = await params
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
