import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    globals: true,
    include: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**", ".next/**"],
    env: {
      DATABASE_URL: "postgres://postgres:postgres@localhost:5432/postgres",
      BETTER_AUTH_SECRET: "a_very_long_secret_for_testing_purposes_at_least_32_chars",
      BETTER_AUTH_URL: "http://localhost:3000",
      NEXT_PUBLIC_BETTER_AUTH_URL: "http://localhost:3000",
    },
  },
})
