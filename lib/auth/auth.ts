import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"
import { Pool } from "pg"

import { env } from "@/env.mjs"

/**
 * Better Auth server-side instance.
 * Configured with Supabase (PostgreSQL) via 'pg' pool.
 */
export const auth = betterAuth({
  database: new Pool({
    connectionString: env.DATABASE_URL,
    connectionTimeoutMillis: 2000,
    max: 5,
    ssl:
      process.env.NODE_ENV === "production"
        ? true
        : {
            rejectUnauthorized: false, // Required for development with Supabase direct connections
          },
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
})
