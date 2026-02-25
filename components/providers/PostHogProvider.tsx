"use client"

import { PostHogProvider as PostHogReactProvider } from "posthog-js/react"
import * as React from "react"

import { initPostHog, posthogClient } from "@/lib/analytics/posthog-client"

/**
 * Initialises PostHog once on mount and provides the PostHog React context.
 * When `NEXT_PUBLIC_POSTHOG_KEY` is absent the provider still renders but PostHog remains inactive.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    initPostHog()
  }, [])

  return <PostHogReactProvider client={posthogClient}>{children}</PostHogReactProvider>
}
