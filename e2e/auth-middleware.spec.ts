import { expect, test } from "@playwright/test"

test.describe("Auth Middleware Routing", () => {
  test("Unauthenticated user is redirected from protected /playlists route to /login", async ({ page }) => {
    // Attempt to access protected route directly
    await page.goto("/playlists")

    // The middleware should intercept and redirect to /login
    await expect(page).toHaveURL(/.*\/login/)
  })

  test("Navbar hides the Playlists link for unauthenticated users", async ({ page }) => {
    await page.goto("/")

    // The "Catalog" link should exist, but "Playlists" should not
    await expect(page.getByRole("link", { name: "Catalog" }).first()).toBeVisible()
    await expect(page.getByRole("link", { name: "Playlists" }).first()).not.toBeVisible()
  })
})
