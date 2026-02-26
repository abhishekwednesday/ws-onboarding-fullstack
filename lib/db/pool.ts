import { Pool } from "pg"

import { env } from "@/env.mjs"

declare global {
  var globalDbPool: Pool | undefined
}

/**
 * Global singleton instance of the PostgreSQL connection pool.
 * Prevents connection exhaustion during development (hot reloading)
 * and across serverless function invocations where the process isn't terminated.
 */
export const dbPool =
  global.globalDbPool ||
  new Pool({
    connectionString: env.DATABASE_URL,
    connectionTimeoutMillis: 2000,
    max: 5,
    ssl:
      process.env.NODE_ENV === "production"
        ? true
        : {
            rejectUnauthorized: false, // Required for development with Supabase direct connections
          },
  })

if (process.env.NODE_ENV !== "production") {
  global.globalDbPool = dbPool
}
