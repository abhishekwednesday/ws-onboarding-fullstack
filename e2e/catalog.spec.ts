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
    const searchInput = page.getByPlaceholder(/search for tracks, artists/i)
    await expect(searchInput).toBeVisible()

    // Search for something that won't exist
    await searchInput.fill("nonexistentqueryxyz123")

    // Wait for the debounce and loading state (skeleton grid)
    await expect(page.locator(".grid").first()).toBeVisible()

    // Eventually should show empty state
    await expect(page.getByText(/no results found/i)).toBeVisible({ timeout: 20000 })

    // Clear search and verify return to default state
    await page.getByLabel("Clear search").click()
    await expect(page.getByText(/provided courtesy of iTunes/i).first()).toBeVisible({ timeout: 15000 })
  })
})
