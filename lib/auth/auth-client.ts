import { createAuthClient } from "better-auth/react"

/**
 * Better Auth client-side instance.
 * Used for authentication hooks and actions in the browser.
 */
export const authClient = createAuthClient({
  /**
   * Base URL of the auth server.
   * Driven by environment variable to ensure consistency and SSR safety.
   */
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
})

export const { signIn, signUp, useSession, signOut } = authClient
