import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="animate-in fade-in relative flex flex-col gap-10 py-6 duration-500 md:py-10">
      <header className="flex items-center justify-between">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-40 rounded-full" />
      </header>

      <div className="space-y-3">
        <Skeleton className="h-4 w-48" />
        <div className="border-border/50 flex h-36 items-center justify-center rounded-xl border">
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-border/50 rounded-xl border p-5">
            <div className="flex items-start gap-4">
              <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
