import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-8 py-10">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-14 w-80 rounded-2xl" />
      </div>

      <div className="border-border/40 border-t pt-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="relative aspect-square w-full overflow-hidden rounded-2xl">
              <Skeleton className="absolute inset-0 h-full w-full" />
              <div className="absolute right-0 bottom-0 left-0 space-y-1.5 p-4">
                <Skeleton className="bg-muted h-3.5 w-2/3" />
                <Skeleton className="bg-muted h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
