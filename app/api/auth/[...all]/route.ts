import { toNextJsHandler } from "better-auth/next-js"

import { auth } from "@/lib/auth/auth"

/**
 * Catch-all route handler for Better Auth requests.
 * Handles GET and POST for /api/auth/*.
 */
export const { POST, GET } = toNextJsHandler(auth)
