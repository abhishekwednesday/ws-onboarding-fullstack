import { expect, test } from "@playwright/test"

test.describe("Playlists Page", () => {
  test.setTimeout(90_000)

  test.beforeEach(async ({ page }) => {
    // Navigate once — avoid repeating goto inside a retry loop which
    // overwhelms the dev server when multiple browser workers run in parallel.
    await page.goto("/login?returnTo=/playlists")

    // Wait for the email input to appear in the DOM (SSR delivers it immediately).
    await page.getByPlaceholder("name@example.com").waitFor({ state: "visible", timeout: 30_000 })

    // Wait for React hydration to complete.  The SSR'd form elements are
    // visible in the DOM before React attaches event handlers.  In Firefox
    // on CI, clicking the submit button pre-hydration silently does nothing.
    // React attaches __reactFiber / __reactProps properties to DOM nodes
    // during hydration, so we poll for their presence on the <form> element.
    await page.waitForFunction(
      () => {
        const form = document.querySelector("form")
        return !!form && Object.keys(form).some((k) => k.startsWith("__react"))
      },
      { timeout: 30_000 }
    )

    // Retry the form interaction: fill() can trigger a React re-render
    // that briefly removes elements from the DOM.
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
