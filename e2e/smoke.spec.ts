import { expect, test } from "@playwright/test";

test("home page loads with title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/./);
  await expect(page.locator("h1").first()).toBeVisible();
  await expect(
    page.getByRole("link", { name: /voir mes projets/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /me contacter/i })).toBeVisible();
});

for (const route of [
  "/projects",
  "/tools",
  "/articles",
  "/about",
  "/lab",
  "/contact",
]) {
  test(`${route} loads with a visible title`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("h1").first()).toBeVisible();
  });
}

test("contact page has a working contact form", async ({ page }) => {
  await page.goto("/contact");

  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('textarea[name="message"]')).toBeVisible();
  await expect(page.getByRole("button", { name: /envoyer/i })).toBeVisible();
});

test("an article page renders", async ({ page }) => {
  await page.goto("/articles/liflow-refonte-souvenirs-familiaux");

  await expect(page.locator("h1")).toBeVisible();
  // 2 scripts: the root layout's Person schema + this page's Article schema.
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(
    2,
  );
});

test("a project case study page renders", async ({ page }) => {
  await page.goto("/projects/liflow");

  await expect(page.locator("h1")).toHaveText("Liflow");
  await expect(
    page.getByRole("link", { name: /voir le produit/i }),
  ).toBeVisible();
});

test("security headers include a content security policy", async ({
  request,
}) => {
  const response = await request.get("/");

  expect(response.headers()["content-security-policy"]).toContain(
    "default-src 'self'",
  );
});

test("rss feed is valid and lists articles", async ({ request }) => {
  const response = await request.get("/rss.xml");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/rss+xml");
  const body = await response.text();
  expect(body).toContain("<rss");
  expect(body).toContain("liflow-refonte-souvenirs-familiaux");
});

test("404 page is branded", async ({ page }) => {
  await page.goto("/page-qui-nexiste-pas");

  await expect(page.getByText("404")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /retour à la carte/i }),
  ).toBeVisible();
});

test("old /apps route redirects to /projects", async ({ page }) => {
  await page.goto("/apps");

  await expect(page).toHaveURL(/\/projects$/);
});

test("old /blog post URL redirects to /articles", async ({ page }) => {
  await page.goto("/blog/liflow-refonte-souvenirs-familiaux");

  await expect(page).toHaveURL(
    /\/articles\/liflow-refonte-souvenirs-familiaux$/,
  );
});
