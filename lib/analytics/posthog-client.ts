import posthog from "posthog-js"

import { env } from "@/env.mjs"

/**
 * Initialises the PostHog JS singleton.
 * Called once at application startup via {@link PostHogProvider}.
 * When `NEXT_PUBLIC_POSTHOG_KEY` is absent this is a no-op.
 */
export function initPostHog(): void {
  if (!env.NEXT_PUBLIC_POSTHOG_KEY) return

  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: true,
    debug: process.env.NODE_ENV === "development",
  })
}

export { posthog as posthogClient }
