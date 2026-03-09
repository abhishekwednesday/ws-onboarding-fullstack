import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col gap-8 py-8 md:py-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end">
        <Skeleton className="aspect-square w-48 rounded-2xl md:w-64" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-20 w-80 md:w-[600px]" />
          <Skeleton className="h-6 w-48" />
        </div>
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-16 w-40 rounded-full" />
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
      <div className="border-border bg-card/40 space-y-4 rounded-2xl border p-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  )
}
