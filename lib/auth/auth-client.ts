import { createAuthClient } from "better-auth/react"

import { env } from "@/env.mjs"

/**
 * Better Auth client-side instance.
 * Used for authentication hooks and actions in the browser.
 */
export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
})

export const { signIn, signUp, useSession, signOut } = authClient
