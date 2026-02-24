# ADR 0021: Containerized CI Workflow for Playwright

## Context

The previous CI setup relied on host-level browser caching and installation (`pnpm playwright install --with-deps`). This led to several issues:

1. **Long Build Times**: Installing system dependencies (libs, codecs) was taking 10-15 minutes per run.
2. **Environment Drift**: Version mismatches between the host OS and the browser binaries sometimes caused flighty tests.
3. **Redundancy**: Multiple pipelines were duplicating the slow installation steps.

## Decision

We will unify all CI pipelines (`playwright.yml` and `check.yml`) to use the official **Playwright Docker container** (`mcr.microsoft.com/playwright`).

Specifically:

- Use the image version matching our `@playwright/test` dependency (v1.52.0).
- Run as `root` within the container to ensure permissions for browser execution.
- Enable **CI parallelism** (`workers: 2`) in `playwright.config.ts`.
- Remove host-level caching and `install-deps` steps.

## Consequences

- **Reduced Runtime**: Pipeline execution time is expected to drop from ~23 minutes to <10 minutes.
- **Improved Stability**: Tests run in an environment pre-configured by the Playwright team.
- **Maintenance**: We must ensures the Docker image version in `.github/workflows/*.yml` stays in sync with `package.json`.
