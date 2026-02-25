"use client"

import { LoaderCircle, Search, X } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
    <div className="relative w-full max-w-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {isPending ? (
          <LoaderCircle className="text-primary h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Search className="text-muted-foreground h-4 w-4" aria-hidden="true" />
        )}
      </div>
      <Input
        type="text"
        className="focus:ring-primary block w-full rounded-md border-0 py-1.5 pr-10 pl-10 ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
      />
      {value && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-gray-400 hover:text-gray-500"
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
