"use client"

import { Loader2 } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { CatalogList } from "./CatalogList"
import { useCatalogQuery } from "../hooks/useCatalogQuery"

export function CatalogPage() {
  const { data: items, isLoading, isError, error, refetch } = useCatalogQuery()

  return (
    <div className="space-y-8 py-10">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Music Catalog</h1>
        <p className="text-muted-foreground max-w-[700px] text-lg">
          Discover and explore millions of tracks, albums, and artists from the iTunes library. Start your musical
          journey today.
        </p>
      </div>

      <div className="border-t pt-10">
        {isLoading && (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        )}

        {isError && (
          <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
            <p className="text-destructive text-lg font-medium">Something went wrong while fetching the catalog.</p>
            <p className="text-muted-foreground text-sm">{(error as Error)?.message || "Please try again later."}</p>
            <Button onClick={() => refetch()} variant="outline">
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !isError && items && <CatalogList items={items} />}
      </div>
    </div>
  )
}
