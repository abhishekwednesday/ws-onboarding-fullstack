# ADR 0002: Day 1 CI and Toolchain Stability

**Date:** 2026-02-23

---

## Context

Following the initial security pass, several technical blockers emerged that hindered the development workflow and CI/CD pipelines:

1.  **Package Manager Mismatch**: Mixing `npm` and `pnpm` commands created a `package-lock.json` and caused `pnpm-lock.yaml` to drift, breaking CI installation steps.
2.  **Linting Regression**: The release of ESLint v10 introduced breaking changes that were incompatible with the project's current plugin suite (specifically `@typescript-eslint/utils`), leading to `Class extends value undefined` errors.
3.  **CI Permission Denied**: The GitHub Actions workflow for bundle analysis failed with a `403 Forbidden` error when attempting to post PR comments due to restricted `GITHUB_TOKEN` permissions.

## Decision

Implemented a series of stabilizing measures to harden the toolchain:

- **Lockfile Consolidation**: Standardized on `pnpm` by removing `package-lock.json` and synchronizing `pnpm-lock.yaml`.
- **Toolchain Compatibility**: Forced ESLint to `^9.21.0` to maintain compatibility with the existing plugin architecture while ensuring all security patches are applied.
- **Workflow Elevation**: Explicitly granted `pull-requests: write` and `contents: read` permissions to the `nextjs_bundle_analysis.yml` workflow to enable automated feedback.
- **Config Refinement**: Updated `eslint.config.mjs` to ignore legacy build scripts (`report-bundle-size.js`) that do not conform to current project standards.

## Alternatives Considered

- **Migrating to npm**: Rejected. The repository's existing infrastructure (GitHub workflows, `packageManager` field) is built for `pnpm`.
- **Upgrading all Plugins to ESLint v10**: Rejected for Day 1. This would require a significant refactor of the linting rules and potential community fix waits. Stability was prioritized.
- **Using personal access tokens for GHA**: Rejected. Scoped `permissions` within the workflow file is the more secure and maintainable path.

## Consequences

- **Stable Environment**: Local and CI environments are now perfectly in sync.
- **Automated Feedback**: PRs will now correctly receive bundle analysis comments.
- **Predictable Linting**: Linting errors are now actionable rather than toolchain failures.

## Follow-ups

- Monitor `@typescript-eslint` releases for native ESLint v10 support to eventually move forward.
- Audit other GitHub workflows for similar permission requirements.
