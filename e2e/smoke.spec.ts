import { expect, test } from "@playwright/test";

test("home page loads with title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/./);
  await expect(page.locator("h1").first()).toBeVisible();
});

for (const route of ["/projects", "/apps", "/lab", "/about", "/blog"]) {
  test(`${route} loads with a visible title`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("h1").first()).toBeVisible();
  });
}

test("about page has a working contact form", async ({ page }) => {
  await page.goto("/about");

  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('textarea[name="message"]')).toBeVisible();
  await expect(page.getByRole("button", { name: /envoyer/i })).toBeVisible();
});

test("a blog post page renders", async ({ page }) => {
  await page.goto("/blog/liflow-refonte-souvenirs-familiaux");

  await expect(page.locator("h1")).toBeVisible();
  // 2 scripts: the root layout's Person schema + this page's Article schema.
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(
    2,
  );
});

test("404 page is branded", async ({ page }) => {
  await page.goto("/page-qui-nexiste-pas");

  await expect(page.getByText("404")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /retour à la carte/i }),
  ).toBeVisible();
});
