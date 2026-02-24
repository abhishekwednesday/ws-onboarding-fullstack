import { expect, test } from "@playwright/test"

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("should have the correct title and meta description", async ({ page }) => {
    await expect(page).toHaveTitle(/MusicStream/)
  })

  test("should render the hero section with branding", async ({ page }) => {
    const heading = page.getByRole("heading", { name: /Find music/i })
    await expect(heading).toBeVisible()
    await expect(heading).toContainText(/you'll love/i)

    const subtext = page.getByText(/Search tracks, artists, and albums/i)
    await expect(subtext).toBeVisible()
  })

  test("should have functional hero call-to-action buttons", async ({ page }) => {
    const browseButton = page.getByRole("link", { name: /Browse the catalog/i })
    await expect(browseButton).toBeVisible()
    await expect(browseButton).toHaveAttribute("href", "/catalog")
  })
})

test.describe("Navigation & Layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("should verify Navbar branding and links", async ({ page }) => {
    const navbar = page.locator("nav")
    await expect(navbar.getByText("MusicStream")).toBeVisible()

    const catalogLink = navbar.getByRole("link", { name: /Catalog/i }).first()
    await expect(catalogLink).toBeVisible()
    await expect(catalogLink).toHaveAttribute("href", "/catalog")
  })

  test("should have a theme toggle in the Navbar", async ({ page }) => {
    const navbar = page.locator("nav")
    const themeToggle = navbar.getByRole("button", { name: /toggle theme/i }).first()
    await expect(themeToggle).toBeVisible()
  })

  test("should verify Footer content", async ({ page }) => {
    const footer = page.locator("footer")
    const currentYear = new Date().getFullYear().toString()
    await expect(footer.getByText(new RegExp(currentYear))).toBeVisible()
    await expect(footer.getByText(/MusicStream/i)).toBeVisible()
    await expect(footer.getByText(/All rights reserved/i)).toBeVisible()
  })
})
