"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SORT_OPTIONS, buildShopHref, type ShopQuery } from "@/components/shop/shop-query";
import type { ProductCategory, VapeSubcategory } from "@/types";

interface ShopFiltersProps {
  categories: { id: ProductCategory; name: string }[];
  vapeSubcategories?: { id: VapeSubcategory; name: string }[];
  current: ShopQuery;
  resultCount: number;
}

const pill =
  "inline-flex h-10 shrink-0 items-center rounded-full border px-4 text-[13px] transition-colors";
const pillIdle = "border-border bg-card text-foreground/75 hover:border-foreground/40 hover:text-foreground";
const pillActive = "border-primary bg-primary text-primary-foreground";

export function CategoryPills({
  categories,
  vapeSubcategories = [],
  current,
}: Omit<ShopFiltersProps, "resultCount">) {
  const showSub = current.category === "vapes" && vapeSubcategories.length > 0;
  return (
    <div className="space-y-3">
      <nav aria-label="Catégories" className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <ul className="flex gap-2">
          <li>
            <Link
              href={buildShopHref(current, { category: null, subcategory: null })}
              aria-current={!current.category ? "page" : undefined}
              className={cn(pill, !current.category ? pillActive : pillIdle)}
              scroll={false}
            >
              Tout
            </Link>
          </li>
          {categories.map((cat) => {
            const active = current.category === cat.id;
            return (
              <li key={cat.id}>
                <Link
                  href={buildShopHref(current, { category: cat.id, subcategory: null })}
                  aria-current={active ? "page" : undefined}
                  className={cn(pill, active ? pillActive : pillIdle)}
                  scroll={false}
                >
                  {cat.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {showSub && (
        <nav aria-label="Types de vape" className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <ul className="flex gap-4 border-b border-border">
            {[{ id: null, name: "Toutes" }, ...vapeSubcategories].map((sub) => {
              const active = (current.subcategory ?? null) === sub.id;
              return (
                <li key={sub.id ?? "all"}>
                  <Link
                    href={buildShopHref(current, { subcategory: sub.id })}
                    aria-current={active ? "page" : undefined}
                    scroll={false}
                    className={cn(
                      "-mb-px inline-block whitespace-nowrap border-b py-2.5 text-[13px]",
                      active
                        ? "border-foreground text-foreground"
                        : "border-transparent text-foreground/60 hover:text-foreground"
                    )}
                  >
                    {sub.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}

/** Barre d'outils desktop : recherche + tri + compteur. */
export function ShopFilters({ current, resultCount }: Pick<ShopFiltersProps, "current" | "resultCount">) {
  const router = useRouter();
  const [search, setSearch] = useState(current.q ?? "");
  const sortId = useId();
  const searchId = useId();

  const [previousQuery, setPreviousQuery] = useState(current.q);
  if (previousQuery !== current.q) {
    setPreviousQuery(current.q);
    setSearch(current.q ?? "");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(buildShopHref(current, { q: search }), { scroll: false });
  }

  return (
    <div className="hidden items-center justify-between gap-6 border-y border-border py-3 lg:flex">
      <p className="text-[13px] text-muted-foreground" aria-live="polite">
        {resultCount} produit{resultCount !== 1 ? "s" : ""}
      </p>
      <div className="flex items-center gap-6">
        <form role="search" onSubmit={submit} className="relative">
          <label htmlFor={searchId} className="sr-only">
            Rechercher dans la boutique
          </label>
          <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" aria-hidden />
          <input
            id={searchId}
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher…"
            className="h-9 w-56 border-b border-transparent bg-transparent pl-6 text-[13px] text-foreground outline-none placeholder:text-foreground/45 focus:border-foreground focus-visible:outline-none"
          />
        </form>
        <div className="relative flex items-center gap-2">
          <label htmlFor={sortId} className="text-[13px] text-muted-foreground">
            Trier par
          </label>
          <select
            id={sortId}
            value={current.sort ?? ""}
            onChange={(e) => router.push(buildShopHref(current, { sort: e.target.value || null }), { scroll: false })}
            className="h-9 cursor-pointer appearance-none bg-transparent pr-6 text-[13px] font-medium text-foreground"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-0 h-4 w-4 text-foreground/60" aria-hidden />
        </div>
      </div>
    </div>
  );
}

export function ActiveSearchChip({ current }: { current: ShopQuery }) {
  if (!current.q) return null;
  return (
    <Link
      href={buildShopHref(current, { q: null })}
      scroll={false}
      className="inline-flex h-9 items-center gap-2 rounded-full bg-accent-soft px-4 text-[13px] text-foreground hover:bg-sand"
      aria-label={`Effacer la recherche « ${current.q} »`}
    >
      «&nbsp;{current.q}&nbsp;»
      <X className="h-3.5 w-3.5" aria-hidden />
    </Link>
  );
}
