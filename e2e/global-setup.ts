import { request } from "@playwright/test"

/**
 * Registers the shared test user before any E2E tests run.
 * Idempotent — silently succeeds if the user already exists.
 */
export default async function globalSetup() {
  const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000"
  const ctx = await request.newContext({ baseURL })

  try {
    const response = await ctx.post("/api/auth/sign-up/email", {
      data: {
        email: "test@test.com",
        password: "testpass",
        name: "Test User",
      },
    })

    if (response.ok()) {
      console.log("Global setup: test user created")
    } else {
      const body = await response.text()
      console.log(`Global setup: sign-up returned ${response.status()} — ${body}`)
    }
  } catch (err) {
    console.warn("Global setup: could not seed test user —", err)
  } finally {
    await ctx.dispose()
  }
}
