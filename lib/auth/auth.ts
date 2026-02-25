import { betterAuth } from "better-auth"
import { Pool } from "pg"

import { env } from "@/env.mjs"

/**
 * Better Auth server-side instance.
 * Configured with Supabase (PostgreSQL) via 'pg' pool.
 */
export const auth = betterAuth({
  database: new Pool({
    connectionString: env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for Supabase in many environments
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
})
