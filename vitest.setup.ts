import "@testing-library/jest-dom"
import { vi } from "vitest"

// Skip environment validation during tests to allow them to run without a .env file
process.env.SKIP_ENV_VALIDATION = "true"

// Mock Next.js navigation hooks — the app router is not mounted in jsdom
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Next.js Link to render a plain anchor in tests
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) =>
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("react").createElement("a", { href, ...props }, children),
}))
