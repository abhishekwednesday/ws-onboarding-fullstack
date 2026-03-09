// Storybook runs in a browser (Webpack) context, not a Next.js server context.
// server-only throws at import time outside a server environment, which breaks
// any story that transitively imports a module guarded by it.
// This empty mock satisfies the import without throwing.
export {}
