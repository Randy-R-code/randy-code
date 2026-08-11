# Security Policy

InfraLens takes a small attack surface seriously precisely because it stays small on purpose: no accounts, no billing, no persistent server-side storage. Please help keep it that way by reporting issues privately.

## Supported Versions

Only the latest version on `main` / the latest published release is supported. There is no long-term-support branch — please update before reporting an issue that might already be fixed.

## Reporting a Vulnerability

**Please do not open a public GitHub issue for a security vulnerability.**

Use GitHub's private reporting instead: go to the [Security tab](https://github.com/Randy-R-code/infralens/security) of this repository and select **"Report a vulnerability"**. This opens a private advisory visible only to the maintainer until it's resolved.

Please include:

- what the issue is and why it matters (impact)
- steps to reproduce, or a minimal proof of concept
- affected version/commit

You'll get an acknowledgment as soon as possible. There's no bug bounty — this is a small open-source project — but genuine reports are taken seriously and credited in the fix's changelog entry unless you'd prefer otherwise.

## Scope

**In scope:**

- SSRF / target-validation bypasses (reaching private, loopback, or link-local ranges; DNS-rebinding around the resolve-then-pin logic)
- Anything that would make InfraLens itself perform an active/intrusive action against a target rather than a passive, read-only check
- Information disclosure from InfraLens's own server (logs, error messages, or responses leaking more than a hostname, error category, and duration)
- Rate-limit or abuse-prevention bypasses
- Dependency vulnerabilities with a demonstrated path to impact in this project

**Out of scope:**

- Findings _about_ a third-party site that InfraLens merely reports on (e.g. "example.com is missing HSTS") — that's the tool working as intended, not a vulnerability in InfraLens
- Denial of service via sheer request volume against a self-hosted instance you don't operate
- Missing security headers on `randy-code.dev` itself — report those separately, this file is for the InfraLens codebase

## Disclosure

Once a fix is available, a summary will be published in [CHANGELOG.md](CHANGELOG.md) — high-level findings only ("SSRF protection hardened for X"), never step-by-step reproduction of a gap that existed in a shipped version.
