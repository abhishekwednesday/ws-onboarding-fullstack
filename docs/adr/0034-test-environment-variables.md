# ADR 0034 — Unified Test Environment Variables

**Date:** 2026-02-25

## Context

During the implementation of robust authentication and database connections, several environment variables became critical for the application to boot (e.g., `DATABASE_URL`, `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_BETTER_AUTH_URL`). The application enforces strict validation of these variables using Zod in `env.mjs`.

For testing (both unit tests via Vitest and E2E tests via Playwright) and continuous integration (GitHub Actions), we needed mock values for these variables to allow the test suites to run without requiring a live production database or secret keys.

Previously, these mock values were hardcoded in multiple locations:

- Inside `vitest.config.ts` under the `test.env` object.
- Within the `env:` blocks of various GitHub Actions workflow files (`check.yml`, `playwright.yml`).
- A `.env.test` file existed but was ignored by the tooling.

This duplication created a maintenance burden and a risk of divergence between local testing environments and CI.

## Decision

To establish a single, unified source of truth for test configuration:

1.  **Centralize Stubs:** We centralized all test environment variable stubs exclusively within the `.env.test` file.
2.  **Native Tool Integration:** We installed `dotenv` as a dev dependency to allow our Node.js-based configuration files to manually parse and load these variables natively.
3.  **Refactor Configs:**
    - Removed hardcoded `env` stubs from `vitest.config.ts` and loaded `.env.test` via `dotenv.config()`.
    - Removed hardcoded values from `playwright.config.ts` and similarly enforced `dotenv.config()`.
4.  **CI Synchronization:** Removed hardcoded `env:` arrays from `.github/workflows/check.yml` and `playwright.yml`. Instead, we introduced a pre-computation shell step (`grep -v '^#' .env.test >> $GITHUB_ENV`) to dynamically parse the central `.env.test` file and inject its values into the GitHub Actions runner environment.

## Consequences

- **Single Source of Truth:** Any newly introduced mock variable, or changes to existing stubs, now only require a single edit in `.env.test`.
- **Consistency:** Complete symmetry is guaranteed between the local Vitest/Playwright runs and the remote GitHub Actions CI pipelines.
- **Maintainability:** Tooling configurations (`vitest.config.ts`, `playwright.yml`) remain clean, agnostic, and strictly focused on test execution architecture rather than hardcoded string management.
