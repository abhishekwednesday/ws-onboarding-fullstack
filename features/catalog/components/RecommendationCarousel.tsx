"use client"

import { Loader2 } from "lucide-react"

import { CatalogCard } from "@/features/catalog/components/CatalogCard"
import { useRecommendations } from "@/features/catalog/hooks/useRecommendations"

export function RecommendationCarousel() {
  const { recommendations, isLoading, isError } = useRecommendations()

  if (isLoading) {
    return (
      <section className="space-y-3" aria-label="Recommendations loading">
        <SectionHeader />
        <div
          className="border-border/50 flex h-36 items-center justify-center gap-3 rounded-xl border"
          data-testid="recommendation-carousel-loading"
        >
          <Loader2 className="text-primary h-5 w-5 animate-spin" />
          <p className="text-muted-foreground text-sm">Finding tracks for you...</p>
        </div>
      </section>
    )
  }

  if (isError || !recommendations || recommendations.length === 0) {
    return null
  }

  return (
    <section
      aria-labelledby="recommendations-heading"
      className="animate-in fade-in space-y-3 duration-500"
      data-testid="recommendation-carousel"
    >
      <SectionHeader />

      <div className="relative">
        <div className="from-background pointer-events-none absolute top-0 left-0 z-10 h-full w-12 bg-gradient-to-r to-transparent" />
        <div className="from-background pointer-events-none absolute top-0 right-0 z-10 h-full w-12 bg-gradient-to-l to-transparent" />

        <div className="no-scrollbar flex gap-4 overflow-x-auto px-1">
          {recommendations.map((track) => (
            <div key={track.id} className="w-[180px] shrink-0 sm:w-[200px]">
              <CatalogCard item={track} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SectionHeader() {
  return (
    <h2 id="recommendations-heading" className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
      Recommended for You
    </h2>
  )
}
