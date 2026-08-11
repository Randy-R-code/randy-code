# Contributing to InfraLens

Thanks for considering a contribution. InfraLens is a small, focused tool — the fastest way to get a PR merged is to keep changes just as focused.

## Before you start

For anything beyond a small fix (a new check, a UI redesign, a behavior change), please open an issue first to discuss the approach. It saves everyone rework.

## Project rules that won't change

These aren't up for debate in a PR — they're the reason this project exists in its current shape:

- **No SaaS drift.** No accounts, no billing, no orgs, no persistent server-side storage of analysis results. Ephemeral server-side, capped local (`localStorage`) history only.
- **Passive analysis only.** No exploitation, no brute force, no port scanning, no injection, no deep crawling, no internal network access. If a check needs anything beyond reading what a normal visitor's browser or DNS resolver could already see, it doesn't belong here.
- **SSRF protection is never negotiable.** Every new outbound request to a user-supplied target must go through the existing validated/pinned resolution path (`src/lib/security/`). Never weaken or bypass it to make a test pass.
- **No invented certainty.** Heuristic findings (stack detection, WAF/CDN fingerprinting) must be labeled with their actual confidence and must never silently affect the score.

## Setup

```bash
git clone https://github.com/Randy-R-code/infralens.git
cd infralens
pnpm install
pnpm dev
```

Requires Node 22+ and pnpm — this project doesn't use npm or yarn.

## Making a change

1. Create a branch off `main`.
2. Keep the PR to one thing. A bug fix doesn't need a drive-by refactor; a new check doesn't need to touch five unrelated files.
3. Add or update tests alongside the change — `pnpm test`. Pure logic (scoring, parsing, formatting) should be unit tested; if you're touching a check, follow the existing pattern in `src/lib/checks/checks/*.test.ts`. If the change affects a real user flow (not just logic), add or update an E2E spec under `e2e/` — see below.
4. Run the full gate before opening the PR:
   ```bash
   pnpm check   # lint + typecheck + test + build — same as CI
   ```
5. Keep TypeScript strict — no `any` used to silence an error, no global ESLint-disable comments. A narrowly-scoped `eslint-disable-next-line` with a reason is fine when there's a real reason (see existing examples).

## E2E tests

```bash
pnpm exec playwright install --with-deps chromium webkit   # once
pnpm e2e
```

`e2e/` uses Playwright against a real dev server, deliberately not mocked — this project has a habit of finding real bugs this way that mocked unit tests can't catch (a silent HTML5 form-validation deadlock on the URL input, several false-positive security findings from live header fingerprinting, and others — see `CHANGELOG.md`). `workers: 1` is intentional: the analysis flow is rate-limited to one request per IP per 30 seconds, and parallel workers hitting the same local server would collide on that limit. Only `e2e/analysis.spec.ts` triggers a real analysis (against `example.com`) — keep it that way rather than adding a second spec that also does, or the two will race each other.

## Adding a new check

Each check is an independent module in `src/lib/checks/checks/`, implementing the shared `CheckRunner` interface (`src/lib/checks/types.ts`). Before adding one:

- Decide honestly whether it can be scored (`pass`/`warning`/`fail`) or is inherently a heuristic/informational signal (`info`, never affecting the score) — see `isScoredStatus` in `scoring-config.ts`.
- If a lookup can fail for a reason outside the target's control (a third-party API being down, a resolver timeout), that's `unavailable`, not `fail`. If the check itself throws, that's `error`, not a bad configuration.
- Add the check to the shared mock list in `run-checks.test.ts` if it does its own network/DNS calls — every check-level module doing independent I/O needs a matching mock there.
- Document it in `app/docs/page.tsx` in the same PR — a check without documentation isn't done.

## Commit style

Conventional commits, lowercase everywhere (type, subject, body bullets):

```
feat: short summary

- what changed and why it matters
- ...
```

## Reporting a security issue

Don't open a public issue for a vulnerability — see [SECURITY.md](SECURITY.md).

## Code of conduct

Be respectful, assume good faith, keep disagreements about the code, not the person.
