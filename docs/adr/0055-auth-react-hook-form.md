# ADR 0055: Refactoring Auth Forms to React Hook Form

## Context

The authentication forms (`LoginForm`, `RegisterForm`) previously relied on manual state management (`useState`) for all form fields as well as manual, imperative validation checks upon submission. While functional for simple use cases, this approach does not scale well:

- It requires duplicating manual validation rules that are already defined inside the Zod schemas (`LoginSchema`, `RegisterSchema`).
- It can lead to bloated component files and poor separation of concerns.
- Granular error reporting (per-field errors) is difficult and verbose to implement without a robust form library.

## Decision

We refactored the authentication components to use standard form library patterns:

- **`react-hook-form`**: Used to manage form state and submission handling, replacing local `useState` variables for distinct fields.
- **`@hookform/resolvers/zod`**: Used to connect our existing Zod schemas to `react-hook-form`, ensuring validation is defined in one place (`auth-types.ts`) and executed automatically on submission (or blur).

Additionally, the `logout` function within `useAuth` was updated to support an `onError` callback, mirroring the pattern established in the `login` and `register` functions. This helps surface action-layer errors directly to the user (e.g., via `sonner` toasts) without relying on silent failures or top-level redirects.

## Status

Accepted

## Consequences

- **Pros**:

  - Eliminates duplicated validation logic by leveraging existing Zod schemas.
  - Improves UX by easily allowing field-specific error messages.
  - Centralizes form state management.
  - Makes error handling during logout explicitly visible to users.

- **Cons**:
  - Adds two small new dependencies (`react-hook-form` and `@hookform/resolvers`) to the client bundle.
