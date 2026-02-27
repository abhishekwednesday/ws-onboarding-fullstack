"use client"

import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { type CatalogItemType } from "@/features/catalog/types/catalog-types"
import { useSession } from "@/lib/auth/auth-client"
import { cn } from "@/lib/utils"
import { AddToPlaylistPopover } from "./AddToPlaylistPopover"

/**
 * Button that triggers the "Add to Playlist" popover.
 * Auth-gated: only shows for logged-in users.
 */
export function AddToPlaylistButton({
  track,
  className,
  iconOnly = false,
}: {
  track: CatalogItemType
  className?: string
  iconOnly?: boolean
}) {
  // We check session to hide the button for anonymous users
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  if (!session) return null

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Popover handles the open state, but we stop propagation to avoid
    // triggering card clicks.
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size={iconOnly ? "icon" : "default"}
          className={cn("transition-all active:scale-95", iconOnly && "h-11 w-11 rounded-full", className)}
          onClick={handleTriggerClick}
          aria-label="Add to playlist"
        >
          <PlusCircle className={cn(iconOnly ? "h-6 w-6" : "mr-2 h-4 w-4")} />
          {!iconOnly && "Add to Playlist"}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="border-border bg-popover w-[280px] p-0 shadow-2xl backdrop-blur-xl"
        align="end"
        onClick={(e) => e.stopPropagation()}
      >
        <AddToPlaylistPopover track={track} onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  )
}
