import { ProductCardSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="pb-32 lg:pb-24" role="status" aria-label="Chargement des produits">
      <div className="container-x pb-8 pt-10 sm:pt-14 lg:pb-10 lg:pt-16">
        <Skeleton className="h-2.5 w-20" />
        <Skeleton className="mt-4 h-10 w-64 sm:h-12 sm:w-80" />
        <Skeleton className="mt-5 h-4 w-full max-w-md" />
      </div>
      <div className="container-x space-y-6">
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 shrink-0 rounded-full" />
          ))}
        </div>
        <Skeleton className="hidden h-12 w-full lg:block" />
      </div>
      <div className="container-x mt-8 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:mt-10 lg:gap-y-14 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
      <span className="sr-only">Chargement…</span>
    </div>
  );
}
