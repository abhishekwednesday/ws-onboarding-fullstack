# ADR 0003: Setup Shadcn/UI

## Context

The project requires a modern, accessible, and customizable UI component library. The initial evaluation included the use of `next-themes` for dark mode support, but it was decided to focus solely on the base component library setup for now.

## Decision

We decided to:

1. Initialize **shadcn/ui** as the primary component library.
2. Use **Tailwind CSS v4** for styling.
3. Configure **tsconfig.json** with import aliases (`@/*`, `~/*`) to support shadcn components.

## Rationale

- **Shadcn/UI**: Provides high-quality, accessible components that are fully customizable as the source code resides within the project. It integrates seamlessly with Tailwind CSS v4.
- **Tailwind CSS v4**: Offers better performance and a more modern development experience.
- **Customizability**: By owning the component code, we can easily adapt and extend components to fit specific project needs.

## Consequences

- Developers should use `pnpm dlx shadcn@latest add [component]` to add new components.
- Components will be created in the `components/ui/` directory.
- `styles/tailwind.css` includes necessary shadcn variables and theme overrides.
- Import aliases `@/*` and `~/*` are used for clean and consistent imports.
