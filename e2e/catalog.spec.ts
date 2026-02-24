import { expect, test } from "@playwright/test"

test.describe("Music Catalog Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the catalog page
    await page.goto("/catalog")
  })

  test("should display the catalog title and description", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Music Catalog" })).toBeVisible({ timeout: 15000 })
    await expect(page.getByText("Discover and explore millions of tracks").first()).toBeVisible()
  })

  test("should render music items in a grid", async ({ page }) => {
    // Wait for the main heading first
    await expect(page.getByRole("heading", { name: "Music Catalog" })).toBeVisible({ timeout: 15000 })

    // Check for the grid container
    const grid = page.locator("div.grid").first()
    await expect(grid).toBeVisible({ timeout: 20000 })

    // Check for at least one card's attribution
    await expect(page.getByText(/provided courtesy of iTunes/i).first()).toBeVisible({ timeout: 25000 })
  })

  test("should show compliance elements on each card", async ({ page }) => {
    await expect(page.getByText(/provided courtesy of iTunes/i).first()).toBeVisible({ timeout: 20000 })
    const badge = page.getByRole("link", { name: /listen on apple music/i }).first()
    await expect(badge).toBeVisible()
    await expect(badge).toHaveAttribute("target", "_blank")
  })

  test("should handle search and show empty state for non-existent terms", async ({ page }) => {
    // Wait for initial data so we know the page has fully loaded
    await expect(page.getByText(/provided courtesy of iTunes/i).first()).toBeVisible({ timeout: 30000 })

    const searchInput = page.getByPlaceholder(/search for tracks, artists/i)
    await expect(searchInput).toBeVisible()

    // Search for something that won't exist
    await searchInput.fill("nonexistentqueryxyz123")

    // Wait for the current results to clear (confirms the search reset triggered)
    await expect(page.getByText(/provided courtesy of iTunes/i).first()).not.toBeVisible({ timeout: 15000 })

    // Eventually should show empty state (give enough time for debounce + fetch + render)
    await expect(page.getByText(/no results found/i)).toBeVisible({ timeout: 30000 })

    // Clear search and verify return to default state
    await page.getByLabel("Clear search").click()
    await expect(page.getByText(/provided courtesy of iTunes/i).first()).toBeVisible({ timeout: 15000 })
  })

  test("should load more items on scroll", async ({ page }) => {
    // Wait for the initial data to load
    await expect(page.getByText(/provided courtesy of iTunes/i).first()).toBeVisible({ timeout: 30000 })

    // Count initial cards using the iTunes attribution text as a reliable marker
    const initialCount = await page.getByText(/provided courtesy of iTunes/i).count()
    expect(initialCount).toBeGreaterThan(0)

    // Scroll to the bottom to trigger infinite scroll
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Wait for more items to load
    await expect
      .poll(
        async () => {
          return await page.getByText(/provided courtesy of iTunes/i).count()
        },
        {
          message: "Expected more items to load after scrolling",
          timeout: 20000,
        }
      )
      .toBeGreaterThan(initialCount)
  })
})
