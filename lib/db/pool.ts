import { Pool } from "pg"

import { env } from "@/env.mjs"

declare global {
  var globalDbPool: Pool | undefined
}

function parseIntWithDefault(value: string | undefined, fallback: number): number {
  if (!value) return fallback
  const parsed = parseInt(value, 10)
  return Number.isNaN(parsed) ? fallback : parsed
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
    connectionTimeoutMillis: parseIntWithDefault(process.env.DB_CONN_TIMEOUT_MS, 2000),
    max: parseIntWithDefault(process.env.DB_POOL_MAX, 5),
    ssl:
      process.env.NODE_ENV === "production"
        ? true
        : {
            rejectUnauthorized: false,
          },
  })

dbPool.on("error", (err) => {
  console.error("Unexpected error on idle database client:", err)
})

if (process.env.NODE_ENV !== "production") {
  global.globalDbPool = dbPool
}
