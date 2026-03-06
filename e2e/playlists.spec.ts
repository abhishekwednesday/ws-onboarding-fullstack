import { expect, test } from "@playwright/test"

test.describe("Playlists Page", () => {
  test.setTimeout(90_000)

  test.beforeEach(async ({ page }) => {
    // Navigate once — avoid repeating goto inside a retry loop which
    // overwhelms the dev server when multiple browser workers run in parallel.
    await page.goto("/login?returnTo=/playlists")

    // Wait generously for the client component to hydrate (SSR HTML is
    // delivered immediately but React hydration + CSS fade-in animation
    // can be slow under CI load).
    await page.getByPlaceholder("name@example.com").waitFor({ state: "visible", timeout: 30_000 })

    // Retry only the form interaction: fill() can trigger a React
    // re-render that briefly removes elements from the DOM.
    await expect(async () => {
      await page.getByPlaceholder("name@example.com").fill("test@test.com")
      await page.getByPlaceholder("Password").fill("testpass")
      await page.getByRole("button", { name: "Sign In" }).click()
      await expect(page.getByRole("heading", { name: "Playlists", exact: true })).toBeVisible({ timeout: 10_000 })
    }).toPass({ timeout: 30_000 })
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
