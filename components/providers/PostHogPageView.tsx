"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

import { trackPageView } from "@/lib/analytics/events"

/**
 * Captures a PostHog `$pageview` event on every App Router navigation.
 * Must be rendered inside {@link PostHogProvider} and a `<Suspense>` boundary
 * (required by `useSearchParams` in the Next.js App Router).
 */
export function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")
    trackPageView(url)
  }, [pathname, searchParams])

  return null
}
