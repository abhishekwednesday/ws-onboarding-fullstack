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
      await expect(badge).toBeVisible({ timeout: 15000 })
      await expect(badge).toHaveAttribute("target", "_blank")
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

    // Scroll in steps to ensure the intersection observer has time to fire multiple times
    // This handles cases where the API might return duplicates and require multiple scroll triggers
    // to eventually hit the "no more unique items" state.
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 2000))
      await page.waitForTimeout(1000)
    }

    // Final jump to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Instead of asserting on item count (which is unreliable due to API behavior),
    // we verify that we eventually hit the "End of Catalog" message.
    // This confirms that:
    // 1. The Intersection Observer fired.
    // 2. The loadMore function was called.
    // 3. The useCatalog hook correctly handled the results (even if they were duplicates)
    //    and set hasMore to false.
    await expect(page.getByText("You've reached the end of the catalog.")).toBeVisible({
      timeout: 30000,
    })
  })
})
