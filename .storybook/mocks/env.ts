/**
 * Lightweight stub for env.mjs used exclusively by Storybook.
 * Prevents @t3-oss/env-nextjs validation from running inside the
 * Storybook browser bundle where server-side env vars are unavailable.
 */
export const env = {
  NEXT_PUBLIC_POSTHOG_KEY: undefined,
  NEXT_PUBLIC_POSTHOG_HOST: "https://app.posthog.com",
  NEXT_PUBLIC_BETTER_AUTH_URL: "http://localhost:3000",
} as Record<string, string | undefined>
