import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "line",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: /infralens\//,
    },
    {
      // InfraLens E2E, kept as its own desktop + mobile project pair rather
      // than folded into "chromium". CI never has Upstash credentials, so
      // the rate limiter (src/lib/rate-limit) runs allow-all there — but
      // `pnpm start` still loads `.env.local` like any other Next.js run,
      // so a developer who added real Upstash credentials locally (e.g. to
      // exercise rate limiting manually) will hit the genuine "infralens"
      // policy here. Staying serialized keeps that case safe without
      // needing to know which case is active. Run via `pnpm e2e:infralens`,
      // never as part of the default `pnpm e2e` (which only targets
      // "chromium").
      name: "infralens-desktop",
      testDir: "./e2e/infralens",
      fullyParallel: false,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      // Mirrors the source repo's mobile project: skips analysis.spec.ts,
      // which makes one real analysis request already covered by the
      // desktop project — running it twice would collide if a real quota
      // is active (see the desktop project's comment above).
      name: "infralens-mobile",
      testDir: "./e2e/infralens",
      fullyParallel: false,
      use: { ...devices["iPhone 13"] },
      testIgnore: /analysis\.spec\.ts/,
    },
  ],
  webServer: {
    command: "pnpm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
