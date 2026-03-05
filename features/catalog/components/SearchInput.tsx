"use client"

import { LoaderCircle, Search, X } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { cn } from "@/lib/utils"
import { type SearchInputPropsType } from "../types/catalog-types"

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = "Search for tracks, artists...",
  isPending = false,
}: SearchInputPropsType) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="group relative w-full max-w-md">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        {isPending ? (
          <LoaderCircle className="text-primary h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Search
            className="text-muted-foreground group-focus-within:text-foreground h-4 w-4 transition-colors"
            aria-hidden="true"
          />
        )}
      </div>
      <Input
        type="text"
        className={cn(
          "border-border/50 bg-background/40 block w-full rounded-2xl border py-6 pr-12 pl-12 shadow-sm backdrop-blur-md transition-all duration-300",
          "placeholder:text-muted-foreground/50",
          "focus:border-primary/50 focus:bg-background/80 focus:ring-primary/10 focus:ring-4 sm:text-base sm:leading-6"
        )}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        aria-label="Search for tracks, artists..."
      />
      {value && (
        <div className="absolute inset-y-0 right-2 flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-accent hover:text-foreground h-8 w-8 rounded-full transition-all"
            onClick={onClear}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
