import "server-only"

import { Pool } from "pg"

import { env } from "@/env.mjs"

declare global {
  var globalDbPool: Pool | undefined
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value || !/^\d+$/.test(value)) return fallback
  const parsed = parseInt(value, 10)
  return parsed > 0 ? parsed : fallback
}

/**
 * Global singleton instance of the PostgreSQL connection pool.
 * Prevents connection exhaustion during development (hot reloading)
 * and across serverless function invocations where the process isn't terminated.
 */
const isExistingPool = !!global.globalDbPool

export const dbPool =
  global.globalDbPool ||
  new Pool({
    connectionString: env.DATABASE_URL,
    connectionTimeoutMillis: parsePositiveInt(process.env.DB_CONN_TIMEOUT_MS, 2000),
    max: parsePositiveInt(process.env.DB_POOL_MAX, 5),
    ssl:
      process.env.NODE_ENV === "production"
        ? true
        : {
            rejectUnauthorized: false,
          },
  })

if (!isExistingPool) {
  dbPool.on("error", (err) => {
    console.error("Unexpected error on idle database client:", err)
  })
  if (process.env.NODE_ENV !== "production") {
    global.globalDbPool = dbPool
  }
}
