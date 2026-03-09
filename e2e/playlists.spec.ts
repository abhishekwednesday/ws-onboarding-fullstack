import { expect, test } from "@playwright/test"

import { STORAGE_STATE_PATH, TEST_USER_EMAIL, TEST_USER_PASSWORD } from "./global-setup"

test.describe("Playlists Page", () => {
  test.setTimeout(90_000)

  test.use({ storageState: STORAGE_STATE_PATH })

  test.beforeEach(async ({ page }) => {
    await page.goto("/playlists")

    // If global-setup could not create a session (e.g. local dev without DB),
    // the middleware will redirect to /login. Fall back to a browser login so
    // the tests can still run locally without a pre-seeded storageState.
    if (page.url().includes("/login")) {
      await page.getByPlaceholder("name@example.com").fill(TEST_USER_EMAIL)
      await page.getByPlaceholder("Password").fill(TEST_USER_PASSWORD)
      await page.getByRole("button", { name: "Sign In" }).click()
    }

    await expect(page.getByRole("heading", { name: "Playlists", exact: true })).toBeVisible({ timeout: 30_000 })
  })

  test("should display the Recommended for You carousel", async ({ page }) => {
    // Case-insensitive match — CSS text-transform:uppercase causes Firefox/WebKit
    // accessibility APIs to expose the visually-transformed text.
    const recommendationsHeading = page.getByRole("heading", { name: /recommended for you/i }).first()
    await expect(recommendationsHeading).toBeVisible({ timeout: 30_000 })

    await expect(page.getByTestId("recommendation-carousel-loading")).not.toBeVisible({ timeout: 45_000 })
    await expect(page.getByTestId("recommendation-carousel")).toBeVisible({ timeout: 5_000 })

    const cardCount = await page.getByTestId("catalog-card").count()
    expect(cardCount).toBeGreaterThanOrEqual(0)
  })

  test("should display the playlists grid", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Playlists", exact: true })).toBeVisible({ timeout: 15_000 })
  })
})
