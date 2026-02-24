# ADR 0014: CI Performance Optimization

## Context

Running End-to-End (E2E) and Storybook tests in the CI pipeline involves installing Playwright browser binaries, which is a time-consuming and resource-heavy process. This leads to slow feedback cycles for developers.

## Decision

We decided to:

1. **Implement Playwright Browser Caching**: Use `actions/cache@v4` in GitHub Actions to cache the `~/.cache/ms-playwright` directory.
2. **Conditional Installation**:
   - On a cache miss: Install browsers and system dependencies using `pnpm playwright install --with-deps`.
   - On a cache hit: Only install system dependencies (which cannot be cached across runners) using `pnpm playwright install-deps`.
3. **Key Strategy**: Use the OS and the `pnpm-lock.yaml` file hash to invalidate the cache.

## Rationale

- **Efficiency**: Reducing the time spent downloading and extracting multi-hundred megabyte browser binaries significantly speeds up the CI pipeline.
- **Reliability**: Still installing system dependencies (`install-deps`) ensures that the environment is always capable of running the cached browsers, even if the OS-level libraries are updated on the runner.
- **Cost Reduction**: Faster CI runs consume fewer GitHub Actions minutes.

## Consequences

- Playwright installation time should drop from minutes to seconds on cache hits.
- Improved developer experience through faster pull request checks.
- Mandatory system dependency check ensures consistent execution across different runner instances.
