import { useFeatureFlagEnabled } from "posthog-js/react"

/** PostHog flag key for the new catalog grid layout experiment. */
export const FLAG_NEW_CATALOG_LAYOUT = "new-catalog-layout"

/** PostHog flag key for the AI-generated track summaries feature. */
export const FLAG_AI_SUMMARIES = "ai-summaries"

/**
 * Returns whether a PostHog feature flag is enabled for the current user.
 * Falls back to `false` when PostHog is uninitialised or the flag is not resolved.
 */
export function useFeatureFlag(flag: string): boolean {
  return useFeatureFlagEnabled(flag) ?? false
}
