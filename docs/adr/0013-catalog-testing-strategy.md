# ADR 0013: Catalog Testing Strategy

## Context

The Music Catalog feature involves complex data transformations, asynchronous state management via React Query, and mandatory legal compliance elements. A robust testing strategy is required to ensure reliability and prevent regressions.

## Decision

We decided to:

1. **Implement Multi-Layer Testing**:
   - **Unit Tests (Vitest)**: Cover server actions (`actions/`), custom hooks (`hooks/`), and individual UI components (`components/`).
   - **E2E Tests (Playwright)**: Cover the full user journey from navigation to rendering and compliance verification.
2. **Mock Asynchronous Dependencies**:
   - Use `vi.mock` to isolate server actions and API clients during unit tests.
   - Use `QueryClientProvider` to test hooks that rely on TanStack Query.
3. **Verify Compliance via Tests**:
   - Explicitly test for the presence of "provided courtesy of iTunes" attribution and the iTunes store badge in both unit and E2E tests.
4. **Standardized Test Organization**:
   - Keep unit tests in `tests/unit/features/catalog/` mimicking the feature structure.
   - Keep E2E tests in the root `e2e/` directory.

## Rationale

- **Data Integrity**: Unit testing server actions and hooks ensures that data is fetched and mapped correctly before reaching the UI.
- **Compliance Assurance**: Automated tests for legal attribution mitigate the risk of accidental removal, ensuring ongoing compliance with iTunes rules.
- **User Experience**: E2E tests verify that the user sees a polished interface with appropriate loading and empty states in a real browser environment.

## Consequences

- High confidence in the correctness of the catalog feature and its compliance status.
- Faster regression testing during future feature development or refactors.
- Clear documentation of testing patterns for future onboarded developers.
