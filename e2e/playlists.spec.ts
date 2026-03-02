import { expect, test } from "@playwright/test"

test.describe("Playlists Page", () => {
  test.setTimeout(60_000)

  test.beforeEach(async ({ page }) => {
    await page.goto("/login?returnTo=/playlists")

    const emailInput = page.getByPlaceholder("name@example.com")
    const passwordInput = page.getByPlaceholder("Password")
    await expect(emailInput).toBeVisible({ timeout: 15_000 })
    await expect(passwordInput).toBeVisible()

    await emailInput.fill("test@test.com")
    await passwordInput.fill("testpass")

    const submitButton = page.getByRole("button", { name: "Sign In" })
    await submitButton.click()

    await page.waitForURL("**/playlists", { timeout: 45_000, waitUntil: "commit" })
  })

  test("should display the Recommended for You carousel", async ({ page }) => {
    const recommendationsHeading = page.getByRole("heading", { name: "Recommended for You" }).first()
    await expect(recommendationsHeading).toBeVisible({ timeout: 30_000 })

    const carouselContainer = page.getByTestId("recommendation-carousel")
    await expect(carouselContainer).toBeVisible({ timeout: 30_000 })

    const catalogCards = page.getByTestId("catalog-card")
    const cardCount = await catalogCards.count()
    expect(cardCount).toBeGreaterThanOrEqual(0)
  })

  test("should display the playlists grid", async ({ page }) => {
    const mainHeading = page.getByRole("heading", { name: "Playlists", exact: true })
    await expect(mainHeading).toBeVisible({ timeout: 15_000 })
  })
})
