# ADR 0008: Project-Specific E2E Testing Strategy

## Context

The initial boilerplate Playwright tests (`example.spec.ts`) were failing due to a title mismatch after branding updates. Additionally, the existing tests were generic and did not provide project-specific coverage for the MusicStream application.

## Decision

We decided to:

1. **Rename** the boilerplate test file from `e2e/example.spec.ts` to `e2e/landing-page.spec.ts` to better reflect its purpose.
2. **Replace** generic tests with project-specific E2E tests covering:
   - **Landing Page Branding**: Verifying the page title and hero section content.
   - **Navigation & Layout**: Ensuring the Navbar branding, Catalog link, and search input are visible and functional.
   - **Footer Branding**: Verifying the presence of MusicStream branding and the correct copyright year.
3. **Validate across browsers**: Ensure tests pass in Chromium, Firefox, and Webkit.

## Rationale

- **Relevance**: E2E tests should reflect actual user-facing features and branding to be effective.
- **Maintainability**: Clear file naming and project-specific tests make the test suite easier to maintain as the application evolves.
- **Reliability**: Validating across all major browsers ensures a consistent experience for all users.

## Consequences

- The CI pipeline now accurately reflects the state of the MusicStream application.
- Improved coverage for critical layout and branding elements from a user's perspective.
- A more descriptive and organized E2E test folder structure.
