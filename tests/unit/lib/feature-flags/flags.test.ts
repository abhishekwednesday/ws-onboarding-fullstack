import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { renderHook } from "@testing-library/react"

vi.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: vi.fn(),
}))

import { useFeatureFlagEnabled } from "posthog-js/react"
import { FLAG_AI_SUMMARIES, FLAG_NEW_CATALOG_LAYOUT, useFeatureFlag } from "@/lib/feature-flags/flags"

describe("useFeatureFlag", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns false when the flag is disabled", () => {
    vi.mocked(useFeatureFlagEnabled).mockReturnValue(false)
    const { result } = renderHook(() => useFeatureFlag(FLAG_NEW_CATALOG_LAYOUT))
    expect(result.current).toBe(false)
    expect(vi.mocked(useFeatureFlagEnabled)).toHaveBeenCalledWith(FLAG_NEW_CATALOG_LAYOUT)
    expect(vi.mocked(useFeatureFlagEnabled)).toHaveBeenCalledTimes(1)
  })

  it("returns true when the flag is enabled", () => {
    vi.mocked(useFeatureFlagEnabled).mockReturnValue(true)
    const { result } = renderHook(() => useFeatureFlag(FLAG_NEW_CATALOG_LAYOUT))
    expect(result.current).toBe(true)
    expect(vi.mocked(useFeatureFlagEnabled)).toHaveBeenCalledWith(FLAG_NEW_CATALOG_LAYOUT)
    expect(vi.mocked(useFeatureFlagEnabled)).toHaveBeenCalledTimes(1)
  })

  it("returns false when PostHog has not resolved the flag (undefined)", () => {
    vi.mocked(useFeatureFlagEnabled).mockReturnValue(undefined)
    const { result } = renderHook(() => useFeatureFlag(FLAG_AI_SUMMARIES))
    expect(result.current).toBe(false)
    expect(vi.mocked(useFeatureFlagEnabled)).toHaveBeenCalledWith(FLAG_AI_SUMMARIES)
    expect(vi.mocked(useFeatureFlagEnabled)).toHaveBeenCalledTimes(1)
  })
})
