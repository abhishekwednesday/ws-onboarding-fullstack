"use server"

import { headers } from "next/headers"
import type { PoolClient } from "pg"

import { auth } from "@/lib/auth/auth"
import { dbPool } from "@/lib/db/pool"

/**
 * Retrieves the current authenticated user's ID from the Better Auth session.
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    return session?.user?.id ?? null
  } catch {
    return null
  }
}

/**
 * Runs a database operation within a dedicated client connection
 * that has the session's current_user_id set for RLS policies.
 * Uses an explicit session-local transaction to ensure RLS context persistence.
 */
export async function withAuthenticatedClient<T>(
  userId: string,
  operation: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await dbPool.connect()
  try {
    await client.query("BEGIN")
    // Set RLS session context using parameterized set_config for safety
    await client.query("SELECT set_config('app.current_user_id', $1, true)", [userId])

    const result = await operation(client)

    await client.query("COMMIT")
    return result
  } catch (err) {
    try {
      await client.query("ROLLBACK")
    } catch (rollbackErr) {
      console.error("Rollback failed after query error:", rollbackErr)
    }
    throw err
  } finally {
    client.release()
  }
}
