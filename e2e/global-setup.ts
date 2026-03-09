import { chromium } from "@playwright/test"
import fs from "fs"
import path from "path"

export const STORAGE_STATE_PATH = path.join(__dirname, ".auth", "user.json")

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
 * Registers the shared test user before any E2E tests run, then uses the
 * Better Auth testUtils plugin to generate a valid session cookie and saves
 * it to STORAGE_STATE_PATH.
 *
 * Why testUtils.getCookies instead of a browser login:
 *   - No browser process needed — no form interaction, no hydration races.
 *   - Cookies are constructed server-side with the correct domain, path,
 *     httpOnly, sameSite attributes that Playwright's storageState expects.
 *   - Fast: the entire setup completes in a single DB write.
 *
 * Graceful degradation: if the DB is unreachable (local dev without Docker)
 * the empty placeholder storageState stays on disk and the playlists tests
 * fall back to the inline login path defined in their beforeEach.
 */
export default async function globalSetup() {
  const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000"

  // Always guarantee the file exists so test.use({ storageState }) never
  // throws an ENOENT error regardless of whether setup succeeds.
  ensureEmptyStorageState()

  try {
    // Dynamically import the server-side auth instance.  Using a dynamic
    // import keeps this file decoupled from the Next.js module graph (which
    // requires a running Next.js environment) while still giving us direct
    // access to the auth context in Node.
    const { auth } = await import("../lib/auth/auth")
    const ctx = await auth.$context
    const test = ctx.test

    // ── 1. Ensure the test user exists ──────────────────────────────────
    const user = test.createUser({
      email: "test@test.com",
      name: "Test User",
      emailVerified: true,
    })
    await test.saveUser(user)
    console.log("Global setup: test user ready")

    // ── 2. Generate a session cookie for the user ────────────────────────
    // getCookies returns Playwright/Puppeteer-compatible cookie objects with
    // all fields (domain, path, httpOnly, sameSite, secure) populated so
    // they are accepted by browser contexts without modification.
    const cookies = await test.getCookies({
      userId: user.id,
      domain: "localhost",
    })

    // ── 3. Inject cookies into a temporary browser context and save ──────
    // We create a minimal browser context solely to write a valid
    // storageState file — no page navigation required.
    const browser = await chromium.launch()
    const context = await browser.newContext({ baseURL })
    await context.addCookies(cookies)
    await context.storageState({ path: STORAGE_STATE_PATH })
    await context.close()
    await browser.close()

    console.log("Global setup: storage state saved")
  } catch (err) {
    console.warn("Global setup: could not save storage state (playlists tests will fall back to inline login) —", err)
  }
}
