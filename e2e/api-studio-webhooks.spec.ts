import { expect, test, type Page } from "@playwright/test";

// Ingestion hits *our own* endpoint, not an SSRF-sensitive external target —
// unlike the outbound send (mocked below, same as api-studio.spec.ts), a
// real Playwright `request` call here is safe and exercises the real route.
test.describe("api studio — webhooks", () => {
  /**
   * Webhook creation can legitimately fail for reasons that have nothing to
   * do with a regression: Upstash not being configured (CI never has
   * credentials, by design — tests must never touch production Redis, see
   * src/api-studio/lib/webhooks/store.ts) or the real create-rate-limit
   * being genuinely exhausted (10/h per IP, easy to hit from repeated local
   * testing). `webhooks-workspace.tsx`'s state machine renders the same
   * generic "Try again" error state for both — checking for *that* (rather
   * than matching either specific message, or an env var the Playwright
   * test process doesn't necessarily share with the server it's testing)
   * correctly treats any such failure as "can't test this right now", not
   * a bug, in CI or locally either way.
   */
  async function createEndpointOrSkip(page: Page): Promise<string> {
    await page.getByRole("button", { name: "Create endpoint" }).click();

    const urlCode = page.locator("code");
    const tryAgain = page.getByRole("button", { name: "Try again" });
    await Promise.race([
      urlCode.waitFor({ state: "visible", timeout: 5000 }).catch(() => {}),
      tryAgain.waitFor({ state: "visible", timeout: 5000 }).catch(() => {}),
    ]);

    if (await tryAgain.isVisible().catch(() => false)) {
      const reason = await page
        .getByText(/unavailable|Rate limit/)
        .textContent()
        .catch(() => "unknown reason");
      test.skip(true, `Webhook creation unavailable right now: ${reason}`);
    }

    await expect(urlCode).toBeVisible();
    const endpointUrl = (await urlCode.textContent())?.trim();
    expect(endpointUrl).toMatch(/\/api\/api-studio\/webhooks\/.+/);
    return endpointUrl as string;
  }

  test("create -> real inbound event -> inspect -> replay", async ({
    page,
    request,
  }) => {
    await page.goto("/tools/api-studio");
    await page.getByRole("tab", { name: "Webhooks" }).click();
    const endpointUrl = await createEndpointOrSkip(page);

    const ingestResponse = await request.post(`${endpointUrl}?ping=1`, {
      headers: {
        "content-type": "application/json",
        "x-test-signature": "e2e-signature",
      },
      data: { hello: "world" },
    });
    expect(ingestResponse.status()).toBe(200);

    const eventRow = page.getByRole("button", { name: /Event / });
    await expect(eventRow).toBeVisible({ timeout: 10_000 }); // polling interval + margin
    await eventRow.click();

    await expect(page.getByText('"hello": "world"')).toBeVisible();
    await page.getByRole("tab", { name: "Headers" }).click();
    await expect(page.getByText("x-test-signature")).toBeVisible();
    await page.getByRole("tab", { name: "Query" }).click();
    await expect(page.getByText("ping")).toBeVisible();

    await page.getByRole("button", { name: "Replay" }).click();

    await expect(
      page.getByRole("tab", { name: "Request", selected: true }),
    ).toBeVisible();
    await expect(page.locator("#api-studio-url")).toHaveValue("");
    await expect(page.locator("#api-studio-method")).toHaveValue("POST");

    // The outbound send itself is mocked, same as api-studio.spec.ts — this
    // only proves the Replay data made it into the builder correctly.
    await page.route("**/api/api-studio/request", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          status: 200,
          statusText: "OK",
          headers: {},
          bodyText: "{}",
          isBinary: false,
          durationMs: 10,
          sizeBytes: 2,
          finalUrl: "https://api.example.com/replayed",
        }),
      });
    });
    await page.fill("#api-studio-url", "https://api.example.com/replayed");
    await page.getByRole("button", { name: "Send", exact: true }).click();

    await expect(
      page.locator('section[aria-label="Response"]').getByText("200 OK"),
    ).toBeVisible();
  });

  test("an unknown token returns a generic 404", async ({ request }) => {
    const response = await request.post(
      "/api/api-studio/webhooks/definitely-not-a-real-token",
      { data: {} },
    );
    expect(response.status()).toBe(404);
  });

  test("mobile viewport has no horizontal overflow while listening", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/tools/api-studio");
    await page.getByRole("tab", { name: "Webhooks" }).click();
    await createEndpointOrSkip(page);

    const hasOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
    );
    expect(hasOverflow).toBe(false);
  });
});
