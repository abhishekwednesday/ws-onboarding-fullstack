import { expect, test } from "@playwright/test"

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("should have the correct title and meta description", async ({ page }) => {
    await expect(page).toHaveTitle(/MusicStream - Your World of Music/)
  })

  test("should render the hero section with branding", async ({ page }) => {
    const heading = page.getByRole("heading", { name: /Your World of Music, Streamed\./i })
    await expect(heading).toBeVisible()

    const subtext = page.getByText(/Access millions of tracks, albums, and artists/i)
    await expect(subtext).toBeVisible()
  })

  test("should have functional hero call-to-action buttons", async ({ page }) => {
    const exploreButton = page.getByRole("link", { name: /Explore Catalog/i })
    await expect(exploreButton).toBeVisible()
    await expect(exploreButton).toHaveAttribute("href", "/catalog")

    const howItWorksButton = page.getByRole("link", { name: /How it works/i })
    await expect(howItWorksButton).toBeVisible()
    await expect(howItWorksButton).toHaveAttribute("href", "/about")
  })
})

test.describe("Navigation & Layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("should verify Navbar branding and links", async ({ page }) => {
    const navbar = page.locator("nav")
    await expect(navbar.getByText("MusicStream")).toBeVisible()

    const catalogLink = navbar.getByRole("link", { name: /Catalog/i })
    await expect(catalogLink).toBeVisible()
    await expect(catalogLink).toHaveAttribute("href", "/catalog")
  })

  test("should have a search input in the Navbar", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search artists, tracks\.\.\./i)
    await expect(searchInput).toBeVisible()
  })

  test("should verify Footer content", async ({ page }) => {
    const footer = page.locator("footer")
    const currentYear = new Date().getFullYear().toString()
    await expect(footer.getByText(new RegExp(currentYear))).toBeVisible()
    await expect(footer.getByText(/MusicStream\. All rights reserved\./i)).toBeVisible()
  })
})
