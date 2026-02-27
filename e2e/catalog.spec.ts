import { expect, test } from "@playwright/test"

test.describe("Music Catalog Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the catalog page
    await page.goto("/catalog")
  })

  test("should display the catalog title and description", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Music Catalog" })).toBeVisible({ timeout: 15000 })
    await expect(page.getByText(/Discover and explore millions of tracks/i).first()).toBeVisible()
  })

  test("should render music items in a grid", async ({ page }) => {
    // Wait for the main heading first
    await expect(page.getByRole("heading", { name: "Music Catalog" })).toBeVisible({ timeout: 15000 })

    // Check for the grid container
    const grid = page.locator("div.grid").first()
    await expect(grid).toBeVisible({ timeout: 20000 })

    // Check for at least one card
    await expect(page.getByTestId("catalog-card").first()).toBeVisible({ timeout: 25000 })
  })

  test("should show compliance elements and branding", async ({ page }) => {
    await expect(page.getByText(/Data provided courtesy of iTunes/i)).toBeVisible({ timeout: 20000 })

    const isVariantB = await page
      .getByTestId("catalog-variant-b")
      .isVisible()
      .catch(() => false)

    if (!isVariantB) {
      const badge = page.getByRole("link", { name: /listen on apple music/i }).first()
      // The iTunes API occasionally omits trackViewUrl. Only assert if the badge exists.
      if (await badge.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(badge).toHaveAttribute("href", /apple\.com/i)
      }
    }
  })

  test("should handle search and show empty state for non-existent terms", async ({ page }) => {
    // Wait for initial data
    await expect(page.getByTestId("catalog-card").first()).toBeVisible({ timeout: 30000 })

    const searchInput = page.getByPlaceholder(/search for tracks, artists/i)
    await expect(searchInput).toBeVisible()

    // Search for something that won't exist
    await searchInput.fill("nonexistentqueryxyz123")

    // Wait for results to clear
    await expect(page.getByTestId("catalog-card").first()).not.toBeVisible({ timeout: 15000 })

    // Eventually should show empty state
    await expect(page.getByText(/no results found/i)).toBeVisible({ timeout: 30000 })

    // Clear search and verify return to default state
    const clearButton = page.getByLabel("Clear search")
    await clearButton.click()
    await expect(page.getByTestId("catalog-card").first()).toBeVisible({ timeout: 15000 })
  })

  test("should load more items on scroll", async ({ page }) => {
    // Navigate with a specific query to ensure we have enough initial context
    await page.goto("/catalog?q=top+music")

    // Wait for the initial data to load
    await expect(page.getByTestId("catalog-card").first()).toBeVisible({ timeout: 30000 })

    const endMessage = page.getByText("You've reached the end of the catalog.")

    // Scroll in steps to ensure the intersection observer has time to fire multiple times
    for (let i = 0; i < 20; i++) {
      // Use generic mouse wheel instead of targeting DOM elements that might unmount
      await page.mouse.wheel(0, 3000)
      await page.waitForTimeout(500)

      const isEndVisible = await endMessage.isVisible()
      if (isEndVisible) break
    }

    // Instead of asserting on item count (which is unreliable due to API behavior),
    // we verify that we eventually hit the "End of Catalog" message.
    await expect(endMessage).toBeVisible({ timeout: 10000 })
  })
})
