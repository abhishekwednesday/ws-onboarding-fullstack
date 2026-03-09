import "server-only"

import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"
import { testUtils } from "better-auth/plugins"

import { env } from "@/env.mjs"
import { dbPool } from "@/lib/db/pool"

/**
 * Better Auth server-side instance.
 * Configured with Supabase (PostgreSQL) via 'pg' pool.
 */
export const auth = betterAuth({
  database: dbPool,
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies(), ...(process.env.NODE_ENV === "test" ? [testUtils()] : [])],
})
