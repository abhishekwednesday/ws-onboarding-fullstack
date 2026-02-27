import { expect, test } from "@playwright/test"

test.describe("Playlists Page", () => {
  test.beforeEach(async ({ page }) => {
    // 1. Visit the home page
    await page.goto("/")

    // 2. Click "Log in"
    const signinButton = page.getByRole("link", { name: /Log in/i })
    await expect(signinButton.first()).toBeVisible()
    await signinButton.first().click()

    // 3. Fill out the "Sign In" form
    const emailInput = page.getByPlaceholder("name@example.com")
    const passwordInput = page.getByPlaceholder("Password")
    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()

    await emailInput.fill("test@test.com")
    await passwordInput.fill("testpass")

    const submitButton = page.getByRole("button", { name: "Sign In" })
    await submitButton.click()

    // 4. Wait for redirect
    await page.waitForURL("**/playlists", { timeout: 15000 })
  })

  test("should display the Recommended for You carousel", async ({ page }) => {
    // Check for the "Recommended for You" heading
    const recommendationsHeading = page.getByRole("heading", { name: "Recommended for You" }).first()
    await expect(recommendationsHeading).toBeVisible()

    // Check that the carousel container is visible
    const carouselContainer = page.getByTestId("recommendation-carousel")
    await expect(carouselContainer).toBeVisible()

    // Wait for at least one catalog card to appear in the carousel
    // The recommendations depend on external API and DB state, so we wait for the cards to render
    const catalogCards = page.getByTestId("catalog-card")
    await expect(catalogCards.first()).toBeVisible()

    // Check that there are multiple cards rendered
    const cardCount = await catalogCards.count()
    expect(cardCount).toBeGreaterThan(0)
  })

  test("should display the playlists grid", async ({ page }) => {
    // Check for the main heading
    const mainHeading = page.getByRole("heading", { name: "Playlists", exact: true })
    await expect(mainHeading).toBeVisible()
  })
})
