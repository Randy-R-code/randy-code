import { expect, test } from "@playwright/test";

test.describe("landing page", () => {
  test("loads with the hero, form, and quick examples", async ({ page }) => {
    await page.goto("/tools/infralens");
    await expect(
      page.getByRole("heading", { name: /inspect a website/i }),
    ).toBeVisible();
    await expect(
      page.locator("#hero").getByRole("button", { name: /analyze website/i }),
    ).toBeVisible();
    await expect(
      page.locator("#hero").getByRole("button", { name: "example.com" }),
    ).toBeVisible();
    // ToolPageShell is now applied per-page rather than via layout.tsx (so
    // the 404 page can skip it) — confirm the landing page still gets it.
    await expect(
      page.getByRole("link", { name: "Retour aux outils" }),
    ).toBeVisible();
  });

  test("a quick-example chip fills a full, submittable URL", async ({
    page,
  }) => {
    // Regression test: the chips used to set the bare hostname
    // ("example.com"), which fails the input's URL validity check and
    // silently blocks submission — no error shown, nothing happens. Fixed
    // by having the chip set a full https:// URL instead.
    await page.goto("/tools/infralens");
    await page
      .locator("#hero")
      .getByRole("button", { name: "example.com" })
      .click();

    const input = page.locator("#url-input");
    await expect(input).toHaveValue("https://example.com");
    await expect(input).toHaveJSProperty("validity.valid", true);
  });

  test("typing a bare hostname (no scheme) is still a valid, submittable input", async ({
    page,
  }) => {
    // Regression test: the same silent-block bug also hit anyone typing
    // "example.com" directly, since the app's own handleSubmit already
    // normalizes a bare hostname to https:// — the native type="url"
    // constraint was rejecting input the app was designed to accept.
    await page.goto("/tools/infralens");
    const input = page.locator("#url-input");
    // pressSequentially (real per-character keystrokes) rather than fill()
    // — WebKit-on-Linux (this project's mobile project) has a known
    // Playwright/React reliability quirk where fill() can leave a
    // controlled input's React state out of sync with its DOM value,
    // which isn't the thing this test is trying to verify.
    await input.pressSequentially("example.com");
    await expect(input).toHaveValue("example.com");
    await expect(input).toHaveJSProperty("validity.valid", true);
  });

  test("navigates to the docs and privacy pages", async ({ page }) => {
    await page.goto("/tools/infralens");
    await page.getByRole("link", { name: /read the documentation/i }).click();
    await expect(page).toHaveURL(/\/docs$/);
    await expect(
      page.getByRole("heading", { name: "Documentation" }),
    ).toBeVisible();

    await page.goto("/tools/infralens/privacy");
    await expect(page.getByRole("heading", { name: "Privacy" })).toBeVisible();
  });

  test("shows a 404 page for an unknown route", async ({ page }) => {
    const response = await page.goto(
      "/tools/infralens/this-route-does-not-exist",
    );
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("link", { name: /back to infralens/i }),
    ).toBeVisible();
    // Deliberately skips ToolPageShell's "Retour aux outils" link (unlike
    // every other InfraLens page) — a single, page-specific CTA instead of
    // a redundant second "back" affordance.
    await expect(
      page.getByRole("link", { name: "Retour aux outils" }),
    ).toHaveCount(0);
  });
});
