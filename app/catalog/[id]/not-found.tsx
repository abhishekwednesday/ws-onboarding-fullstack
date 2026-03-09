import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h2 className="text-2xl font-bold">Track Not Found</h2>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">
        The track you&apos;re looking for doesn&apos;t exist or may have been removed from iTunes.
      </p>
      <Button asChild variant="outline" className="mt-8">
        <Link href="/catalog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Catalog
        </Link>
      </Button>
    </div>
  )
}
