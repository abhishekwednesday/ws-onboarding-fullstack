import { request } from "@playwright/test"
import fs from "fs"
import path from "path"

export const STORAGE_STATE_PATH = path.join(__dirname, ".auth", "user.json")

export const TEST_USER_EMAIL = "test@test.com"
export const TEST_USER_PASSWORD = "testpass123"
export const TEST_USER_NAME = "Test User"

/**
 * Creates the test user and obtains a valid session by calling Better Auth's
 * HTTP API directly against the already-running Next.js webServer.
 *
 * Flow:
 *   1. POST /api/auth/sign-up/email  → creates the user (ignored if already exists)
 *   2. POST /api/auth/sign-in/email  → authenticates and returns Set-Cookie headers
 *   3. Write the request context's storageState directly to disk for all test
 *      workers to reuse via test.use({ storageState }).
 *
 * Graceful degradation: any error is caught and logged; an empty placeholder
 * storageState is written so test.use({ storageState }) never throws ENOENT,
 * and the playlists tests fall back to the inline login path in their beforeEach.
 */
export default async function globalSetup() {
  const baseURL = process.env.BASE_URL ?? "http://localhost:3000"

  const dir = path.dirname(STORAGE_STATE_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  try {
    const apiContext = await request.newContext({ baseURL })

    // ── 1. Register the test user (idempotent — safe if already exists) ──
    const signUpRes = await apiContext.post("/api/auth/sign-up/email", {
      data: { email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD, name: TEST_USER_NAME },
      headers: { "Content-Type": "application/json" },
      failOnStatusCode: false,
    })

    if (signUpRes.ok()) {
      console.log("Global setup: test user registered")
    } else {
      const body = await signUpRes.text().catch(() => "(unreadable)")
      console.log(`Global setup: sign-up returned ${signUpRes.status()} (user likely already exists) — ${body}`)
    }

    // ── 2. Sign in to obtain session cookies ─────────────────────────────
    const signInRes = await apiContext.post("/api/auth/sign-in/email", {
      data: { email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD },
      headers: { "Content-Type": "application/json", Origin: baseURL },
      failOnStatusCode: false,
    })

    if (!signInRes.ok()) {
      const body = await signInRes.text().catch(() => "(unreadable)")
      throw new Error(`Sign-in failed with status ${signInRes.status()}: ${body}`)
    }

    console.log("Global setup: sign-in successful")

    // ── 3. Persist the session cookies for test workers ───────────────────
    // The request context already holds the Set-Cookie values from the
    // sign-in response, so we can write storageState directly — no browser
    // context required.
    await apiContext.storageState({ path: STORAGE_STATE_PATH })
    await apiContext.dispose()

    const { cookies } = JSON.parse(fs.readFileSync(STORAGE_STATE_PATH, "utf8")) as { cookies: unknown[] }

    if (cookies.length === 0) {
      throw new Error("Sign-in succeeded but no cookies were captured — session could not be established")
    }

    console.log(`Global setup: storageState saved with ${cookies.length} cookie(s) → ${STORAGE_STATE_PATH}`)
  } catch (err) {
    console.warn(
      "Global setup: could not save storageState (playlists tests will fall back to inline login) —",
      err instanceof Error ? err.message : err
    )
    // Write an empty-but-valid placeholder so test.use({ storageState }) never throws ENOENT.
    fs.writeFileSync(STORAGE_STATE_PATH, JSON.stringify({ cookies: [], origins: [] }))
  }
}
