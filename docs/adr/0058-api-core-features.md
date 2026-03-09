# ADR: Core API Features (Schemas, Client, Geolocation)

## Context

The application needs to support advanced search capabilities against the iTunes API. Initially planned as separate branches, bandwidth constraints led us to merge the first three phases into a single foundational branch (`feat/ONB-8-api-core-features`).
This combined phase covers three main objectives:

1. Hardening the API schemas (`lib/api/schemas.ts`) by replacing generic types with Enums and strict Option interfaces.
2. Refactoring the core fetch client (`lib/api/itunes.ts`) to easily ingest those Option parameters instead of hardcoded variables.
3. Automatically injecting IP-based geolocation data via middleware so that users see their region's storefront by default.

## Decision

- We created `CatalogMediaType` and `CatalogExplicitType` enums and an extensible `SearchOptions` interface.
- We updated `searchItunes` and `lookupItunes` to dynamically build `URLSearchParams` from these structured options.
- We modified Next.js Edge Runtime `middleware.ts` to inspect `request.geo.country` or the `x-vercel-ip-country` header. This value is persisted as an `x-user-country` cookie on the response so that client-side and server-side components can easily retrieve it later.
- We removed the previous partial ADR (`ONB-8-api-schemas.md`) and combined the rationale into this document.

## Consequences

- **Positive:** Passing search options is now type-safe and scalable. The application has passive geolocation support out-of-the-box via the Next.js `middleware.ts`.
- **Negative:** Checking the `cookie` via `request.cookies.has("x-user-country")` adds a negligible microsecond overhead to all non-static page requests.
