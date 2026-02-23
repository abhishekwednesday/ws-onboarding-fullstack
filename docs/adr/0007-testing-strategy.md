# ADR 0007: Unit Testing Strategy for MusicStream

## Context

A robust testing strategy is essential to ensure the reliability of the MusicStream service, especially for API interactions and core UI components.

## Decision

We decided to:

1. Use **Vitest** as the test runner for its speed and compatibility with Vite-based projects.
2. Use **React Testing Library** for testing UI components, focusing on user-centric behavior.
3. Use **Zod** for data validation and test schemas to ensure data integrity.
4. Use **mocks** for external API calls (`fetch`) to ensure tests are isolated and reliable.
5. Follow a pattern of testing:
   - **API Client**: Mocking network responses and verifying URL construction.
   - **Schemas**: Validating data structures.
   - **Components**: Verifying rendering, branding, and navigation.
   - **Utilities**: Testing pure functions.

## Rationale

- **Speed**: Vitest provides a fast feedback loop during development.
- **Maintainability**: Clear testing patterns for different modules make it easier for the team to add new tests as the feature set grows.
- **Reliability**: Mocking external dependencies prevents flaky tests caused by network issues.

## Consequences

- Increased confidence in the correctness of core functionality.
- Faster detection of regressions during refactoring or feature additions.
- Clear documentation of expected component behavior through tests.
