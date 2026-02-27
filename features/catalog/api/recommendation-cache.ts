import { type CatalogItemType } from "@/features/catalog/types/catalog-types"

const CACHE_TTL_MS = 5 * 60 * 1000
const MAX_CACHE_ENTRIES = 200
const SWEEP_INTERVAL_MS = 60 * 1000

interface CacheEntry {
  data: CatalogItemType[]
  timestamp: number
}

const recommendationCache = new Map<string, CacheEntry>()

function evictStaleEntries(): void {
  const now = Date.now()
  recommendationCache.forEach((entry, key) => {
    if (now - entry.timestamp >= CACHE_TTL_MS) {
      recommendationCache.delete(key)
    }
  })
}

function evictOldestUntilWithinLimit(): void {
  while (recommendationCache.size > MAX_CACHE_ENTRIES) {
    const oldestKey = recommendationCache.keys().next().value
    if (oldestKey === undefined) break
    recommendationCache.delete(oldestKey)
  }
}

// Periodic sweep to prevent stale entries from accumulating
if (typeof setInterval !== "undefined") {
  setInterval(evictStaleEntries, SWEEP_INTERVAL_MS).unref?.()
}

export function getCachedRecommendations(userId: string): CatalogItemType[] | null {
  const cached = recommendationCache.get(userId)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data
  }
  if (cached) {
    recommendationCache.delete(userId)
  }
  return null
}

export function setCachedRecommendations(userId: string, data: CatalogItemType[]): void {
  recommendationCache.set(userId, { data, timestamp: Date.now() })
  evictOldestUntilWithinLimit()
}

/** Test-only helper — clears the entire recommendation cache. */
export function _clearRecommendationCache(): void {
  recommendationCache.clear()
}
