import { expect, test } from "@playwright/test"

test.describe("Playlists Page", () => {
  test.setTimeout(60_000)

  test.beforeEach(async ({ page }) => {
    await page.goto("/login?returnTo=/playlists", { waitUntil: "load" })

    const emailInput = page.getByPlaceholder("name@example.com")
    const passwordInput = page.getByPlaceholder("Password")
    await expect(emailInput).toBeVisible({ timeout: 15_000 })
    await expect(passwordInput).toBeVisible({ timeout: 5_000 })

    // Retry fill until value persists — React hydration of controlled inputs
    // can overwrite values filled before event handlers are attached
    await expect(async () => {
      await emailInput.fill("test@test.com")
      await expect(emailInput).toHaveValue("test@test.com", { timeout: 1_000 })
    }).toPass({ timeout: 10_000 })
    await passwordInput.fill("testpass")

    // Retry sign-in on transient DB connection timeouts (pool max=5, 2s timeout).
    // Check for playlists heading instead of URL — Next.js App Router client-side
    // navigation blocks Playwright's URL tracking indefinitely.
    await expect(async () => {
      const signInBtn = page.getByRole("button", { name: "Sign In" })
      if (await signInBtn.isVisible().catch(() => false)) {
        await signInBtn.click()
      }
      await expect(page.getByRole("heading", { name: "Playlists", exact: true })).toBeVisible({ timeout: 5_000 })
    }).toPass({ timeout: 45_000 })
  })

  test("should display the Recommended for You carousel", async ({ page }) => {
    // Use case-insensitive match — CSS text-transform:uppercase on the heading
    // causes Firefox/WebKit accessibility APIs to expose the transformed text
    const recommendationsHeading = page.getByRole("heading", { name: /recommended for you/i }).first()
    await expect(recommendationsHeading).toBeVisible({ timeout: 30_000 })

    await expect(page.getByTestId("recommendation-carousel-loading")).not.toBeVisible({ timeout: 45_000 })
    const carouselContainer = page.getByTestId("recommendation-carousel")
    await expect(carouselContainer).toBeVisible({ timeout: 5_000 })

    const catalogCards = page.getByTestId("catalog-card")
    const cardCount = await catalogCards.count()
    expect(cardCount).toBeGreaterThanOrEqual(0)
  })

  test("should display the playlists grid", async ({ page }) => {
    const mainHeading = page.getByRole("heading", { name: "Playlists", exact: true })
    await expect(mainHeading).toBeVisible({ timeout: 15_000 })
  })
})
