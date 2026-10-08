import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="pb-28 lg:pb-8" role="status" aria-label="Chargement du produit">
      <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-12 lg:px-8 lg:pt-14">
        <div className="lg:flex lg:flex-row-reverse lg:gap-4">
          <Skeleton className="aspect-[4/5] w-full rounded-none lg:flex-1 lg:rounded-[4px]" />
          <div className="hidden w-20 shrink-0 flex-col gap-3 lg:flex">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] w-full" />
            ))}
          </div>
        </div>
        <div className="space-y-4 px-4 pt-6 lg:px-0 lg:pt-4">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-9 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="grid grid-cols-2 gap-3 pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
          <Skeleton className="mt-4 h-14 w-full rounded-full" />
        </div>
      </div>
      <span className="sr-only">Chargement…</span>
    </div>
  );
}
