"use client"

import { Filter, Globe, Music2, ShieldAlert, X } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CatalogExplicitType, CatalogMediaType } from "@/lib/api/schemas"

interface CatalogFiltersProps {
    media: string
    setMedia: (val: string) => void
    country: string | undefined
    setCountry: (val: string | undefined) => void
    explicit: string
    setExplicit: (val: string) => void
    onClear: () => void
}

const COUNTRIES = [
    { code: "", name: "All Countries" },
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "IN", name: "India" },
    { code: "JP", name: "Japan" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
]

const MEDIA_TYPES = [
    { value: "", label: "All Media" },
    { value: CatalogMediaType.MUSIC, label: "Music" },
    { value: CatalogMediaType.PODCAST, label: "Podcasts" },
    { value: CatalogMediaType.AUDIOBOOK, label: "Audiobooks" },
    { value: CatalogMediaType.MOVIE, label: "Movies" },
    { value: CatalogMediaType.TV_SHOW, label: "TV Shows" },
]

export function CatalogFilters({
    media,
    setMedia,
    country,
    setCountry,
    explicit,
    setExplicit,
    onClear,
}: CatalogFiltersProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    const hasActiveFilters = media || country || explicit

    return (
        <div className="relative z-30">
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "h-14 rounded-2xl border-border/50 bg-background/40 px-6 backdrop-blur-md transition-all duration-300",
                        isOpen ? "border-primary/50 bg-background/80 ring-4 ring-primary/10" : "hover:bg-background/60",
                        hasActiveFilters && !isOpen && "border-primary/30 bg-primary/5"
                    )}
                >
                    <Filter className={cn("mr-2 h-4 w-4 transition-colors", hasActiveFilters ? "text-primary" : "text-muted-foreground")} />
                    <span className="font-medium">Filters</span>
                    {hasActiveFilters && (
                        <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                            {[media, country, explicit].filter(Boolean).length}
                        </span>
                    )}
                </Button>

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClear}
                        className="h-14 w-14 rounded-2xl border border-border/50 bg-background/40 text-muted-foreground hover:bg-background/60 hover:text-foreground backdrop-blur-md"
                        aria-label="Clear all filters"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                )}
            </div>

            {isOpen && (
                <div className="glass-card absolute top-full left-0 mt-4 w-[320px] overflow-hidden rounded-3xl border border-border/50 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 sm:w-[450px]">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-3">
                            <label htmlFor="media-filter" className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                                Media Type
                            </label>
                            <select
                                id="media-filter"
                                value={media}
                                onChange={(e) => setMedia(e.target.value as CatalogMediaType)}
                                className="w-full rounded-xl border border-border/40 bg-background/50 px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                            >
                                {MEDIA_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1">
                            <label htmlFor="country-filter" className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                                Store Country
                            </label>
                            <select
                                id="country-filter"
                                value={country || ""}
                                onChange={(e) => setCountry(e.target.value || undefined)}
                                className="w-full rounded-xl border border-border/40 bg-background/50 px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                            >
                                {COUNTRIES.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-3 sm:col-span-2">
                            <label className="flex items-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                <ShieldAlert className="mr-2 h-3 w-3" />
                                Content Filtering
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { value: "", label: "All Content" },
                                    { value: CatalogExplicitType.NO, label: "Clean Only" },
                                    { value: CatalogExplicitType.YES, label: "Include Explicit" },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setExplicit(option.value)}
                                        className={cn(
                                            "flex-1 rounded-xl border px-4 py-2 text-xs font-medium transition-all",
                                            explicit === option.value
                                                ? "border-primary/50 bg-primary/10 text-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                                                : "border-border/50 bg-background/20 text-muted-foreground hover:border-border hover:bg-background/40"
                                        )}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 border-t border-border/20 pt-6">
                        <Button
                            variant="ghost"
                            onClick={() => setIsOpen(false)}
                            className="rounded-xl text-xs font-bold uppercase tracking-widest"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
