import { createAuthClient } from "better-auth/react"

/**
 * Better Auth client-side instance.
 * Used for authentication hooks and actions in the browser.
 */
export const authClient = createAuthClient({
  /**
   * Base URL of the auth server.
   * On client-side, we can omit if same domain, but explicitly providing it from env for clarity.
   */
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || window.location.origin,
})

export const { signIn, signUp, useSession, signOut } = authClient
