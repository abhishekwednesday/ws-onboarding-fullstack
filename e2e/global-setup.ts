import { chromium, request } from "@playwright/test"
import fs from "fs"
import path from "path"

export const STORAGE_STATE_PATH = path.join(__dirname, ".auth", "user.json")

export const TEST_USER_EMAIL = "test@test.com"
export const TEST_USER_PASSWORD = "testpass123"
export const TEST_USER_NAME = "Test User"

/** Ensure the .auth directory exists and write an empty-but-valid state file. */
function ensureEmptyStorageState() {
  const dir = path.dirname(STORAGE_STATE_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(STORAGE_STATE_PATH)) {
    fs.writeFileSync(STORAGE_STATE_PATH, JSON.stringify({ cookies: [], origins: [] }))
  }
}

/**
 * Creates the test user and obtains a valid session by calling Better Auth's
 * HTTP API directly against the already-running Next.js webServer.
 *
 * Why HTTP instead of importing lib/auth/auth.ts:
 *   - Playwright's global-setup runs in plain Node.js without a TypeScript
 *     transpiler, so importing ESM TypeScript files throws a SyntaxError.
 *   - Using the HTTP API is simpler, more reliable, and mirrors what a real
 *     browser does — the resulting cookies are guaranteed to be valid.
 *
 * Flow:
 *   1. POST /api/auth/sign-up/email  → creates the user (ignored if already exists)
 *   2. POST /api/auth/sign-in/email  → authenticates and returns Set-Cookie headers
 *   3. Inject the session cookies into a temporary Playwright browser context
 *      and call storageState({ path }) to write a file that all test workers
 *      can reuse via test.use({ storageState }).
 *
 * Graceful degradation: any error is caught and logged; the empty placeholder
 * storageState that was written at the start stays on disk, and the playlists
 * tests fall back to the inline login path defined in their beforeEach.
 */
export default async function globalSetup() {
  const baseURL = process.env.BASE_URL ?? "http://localhost:3000"

  // Always guarantee the file exists so test.use({ storageState }) never
  // throws an ENOENT error regardless of whether setup succeeds.
  ensureEmptyStorageState()

  try {
    // Use Playwright's fetch client so we can inspect raw response headers.
    const apiContext = await request.newContext({ baseURL })

    // ── 1. Register the test user ──────────────────────────────────────────
    // We ignore 422 / 4xx responses here because the user may already exist
    // from a previous run on the same database.
    const signUpRes = await apiContext.post("/api/auth/sign-up/email", {
      data: {
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
        name: TEST_USER_NAME,
      },
      headers: { "Content-Type": "application/json" },
      // Don't throw on non-2xx — user may already exist.
      failOnStatusCode: false,
    })

    if (signUpRes.ok()) {
      console.log("Global setup: test user registered")
    } else {
      const body = await signUpRes.text().catch(() => "(unreadable)")
      console.log(`Global setup: sign-up returned ${signUpRes.status()} (user likely already exists) — ${body}`)
    }

    // ── 2. Sign in to obtain session cookies ──────────────────────────────
    const signInRes = await apiContext.post("/api/auth/sign-in/email", {
      data: {
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      },
      headers: { "Content-Type": "application/json", Origin: baseURL },
      failOnStatusCode: false,
    })

    if (!signInRes.ok()) {
      const body = await signInRes.text().catch(() => "(unreadable)")
      throw new Error(`Sign-in failed with status ${signInRes.status()}: ${body}`)
    }

    console.log("Global setup: sign-in successful")

    // ── 3. Extract the cookies from the API response context ──────────────
    // Playwright's request context automatically stores cookies that were set
    // via Set-Cookie headers.  We can retrieve them with storageState().
    const apiStorageState = await apiContext.storageState()
    await apiContext.dispose()

    if (!apiStorageState.cookies || apiStorageState.cookies.length === 0) {
      throw new Error("Sign-in succeeded but no cookies were returned — session could not be established")
    }

    console.log(`Global setup: captured ${apiStorageState.cookies.length} cookie(s) from sign-in response`)

    // ── 4. Inject cookies into a browser context and save storageState ────
    // A browser context is required to write a storageState file in the
    // format that Playwright's test.use({ storageState }) expects.
    // We ensure the cookie domain is set to the hostname Playwright uses
    // (localhost) so the browser sends them on every request to the app.
    const hostname = new URL(baseURL).hostname

    const browser = await chromium.launch()
    const context = await browser.newContext({ baseURL })

    const cookiesWithDomain = apiStorageState.cookies.map((cookie) => ({
      ...cookie,
      // Overwrite domain to match exactly what the browser context will use.
      domain: cookie.domain && cookie.domain !== "" ? cookie.domain : hostname,
      // Ensure path is set.
      path: cookie.path || "/",
    }))

    await context.addCookies(cookiesWithDomain)
    await context.storageState({ path: STORAGE_STATE_PATH })
    await context.close()
    await browser.close()

    // Verify the file was written with cookies.
    const written = JSON.parse(fs.readFileSync(STORAGE_STATE_PATH, "utf8")) as { cookies?: unknown[] }
    const cookieCount = written.cookies?.length ?? 0

    if (cookieCount === 0) {
      throw new Error("storageState was written but contains no cookies — something went wrong during injection")
    }

    console.log(`Global setup: storageState saved with ${cookieCount} cookie(s) → ${STORAGE_STATE_PATH}`)
  } catch (err) {
    console.warn(
      "Global setup: could not save storageState (playlists tests will fall back to inline login) —",
      err instanceof Error ? err.message : err
    )
  }
}
