import { Metadata } from "next"
import * as React from "react"

import { CatalogPage } from "@/features/catalog/components/CatalogPage"

export const metadata: Metadata = {
  title: "Catalog - MusicStream",
  description: "Browse and discover music in our extensive catalog.",
}

/**
 * Route handler for the /catalog page.
 */
export default function Page() {
  return <CatalogPage />
}
