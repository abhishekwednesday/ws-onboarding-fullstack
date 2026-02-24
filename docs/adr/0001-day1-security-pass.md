# ADR 0001: Day 1 Security and Quality Pass

**Date:** 2026-02-23

---

## Context

Initial `npm audit` on the `next-enterprise` repo revealed **85 vulnerabilities** (6 low, 11 moderate, 68 high). Two categories were prioritized for immediate resolution:

- `next@15.3.8` — 5 high CVEs (SSRF, DoS, cache key confusion, content injection).
- `minimatch <10.2.1` — high severity ReDoS vulnerability in the `typescript-eslint` chain.

Furthermore, the repository lacked automated gatekeeping for code quality and security. Linting (`eslint`) and formatting (`prettier`) were only manual scripts, risking "broken window" syndrome and accidental secret exposure.

## Decision

### 1. Security and Compatibility Upgrades

Upgraded critical packages to resolve high-severity CVEs and ensure toolchain compatibility:

| Package                            | From    | To       | Fixes                                             |
| ---------------------------------- | ------- | -------- | ------------------------------------------------- |
| `next`                             | 15.3.8  | ^15.5.12 | 5 high CVEs in Next.js itself                     |
| `eslint`                           | ^9.26.0 | ^9.21.0  | Ensured plugin compatibility; `minimatch` ^10.2.1 |
| `typescript-eslint`                | ^8.32.0 | latest   | `minimatch` ^10.2.1 internally                    |
| `@typescript-eslint/eslint-plugin` | 8.21.0  | latest   | `minimatch` ^10.2.1 internally                    |

Result: **85 → 81 vulnerabilities** (4 high severity cleared).

### 2. Automated Gatekeeping

Implemented a multi-layered pre-commit validation strategy:

- **Husky**: Orchestrates git hooks.
- **Lint-Staged**: Ensures only changed files are linted (`eslint --fix`) and formatted (`prettier --write`).
- **Commitlint**: Enforces [Conventional Commits](https://www.conventionalcommits.org/).
- **Secretlint**: Scans for sensitive data exposure before it enters git history.

Updated ESLint configuration to ignore build-specific scripts (`report-bundle-size.js`) that use legacy patterns.

Used `--legacy-peer-deps` during installation to resolve upstream Radix UI conflicts in a predictable manner.

## Alternatives Considered

- **`npm audit fix --force`**: Rejected. Indiscriminate version bumps are high-risk; surgical upgrades are safer and reviewable.
- **Ignoring Tooling Hooks**: Rejected. Manual checks are prone to human error; automated hooks ensure a baseline state for all contributors.

## Consequences

- **Risks Cleared**: All 5 high-severity Next.js CVEs and the `minimatch` ReDoS vulnerability are resolved.
- **Developer Experience**: Stricter commit requirements ensure clean history and high code quality, though they require familiarity with Conventional Commits.
- **Breaking Changes**: None to application logic; some upgrade paths (e.g., `fetch-mock`, `@semantic-release/npm`) were deferred due to potential breaking changes.

## Follow-ups

- Upgrade `webpack` to ^5.105.2.
- Monitor `node-polyfill-webpack-plugin` for `crypto-browserify` removal.
