"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

import { posthogClient } from "@/lib/analytics/posthog-client"

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
    posthogClient.capture("$pageview", { $current_url: url })
  }, [pathname, searchParams])

  return null
}
