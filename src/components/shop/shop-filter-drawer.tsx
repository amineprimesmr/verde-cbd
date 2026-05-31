"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types";

const SORT_OPTIONS = [
  { value: "", label: "Pertinence" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "name", label: "Nom A → Z" },
] as const;

interface ShopFilterDrawerProps {
  categories: { id: ProductCategory; name: string }[];
  activeCategory?: ProductCategory;
}

export function ShopFilterDrawer({
  categories,
  activeCategory,
}: ShopFilterDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [sort, setSort] = useState(searchParams.get("sort") ?? "");

  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
    setSort(searchParams.get("sort") ?? "");
  }, [searchParams]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function applyFilters(category?: ProductCategory | null) {
    const params = new URLSearchParams();
    const cat = category === null ? undefined : category ?? activeCategory;
    if (cat) params.set("category", cat);
    if (search.trim()) params.set("search", search.trim());
    if (sort) params.set("sort", sort);
    const qs = params.toString();
    router.push(qs ? `/boutique?${qs}` : "/boutique");
    setOpen(false);
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-5 pt-8">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pointer-events-auto inline-flex items-center gap-2.5 rounded-full bg-[#2b2b2b] px-7 py-3.5 text-sm font-medium text-white shadow-[0_8px_32px_rgba(0,0,0,0.22)] transition-transform active:scale-[0.98]"
        >
          <SlidersHorizontal className="h-[18px] w-[18px] stroke-[1.75]" />
          Filtrer et trier
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full pointer-events-none"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Filtrer et trier"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-black/[0.06] bg-white px-5 py-4">
          <h2 className="text-base font-bold text-black">Filtrer et trier</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-8 px-5 py-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-black/45">
              Recherche
            </p>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="mt-3 w-full border-b border-black/15 bg-transparent py-2.5 text-sm text-black outline-none placeholder:text-black/35 focus:border-black"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-black/45">
              Catégorie
            </p>
            <div className="mt-3 space-y-1">
              <button
                type="button"
                onClick={() => applyFilters(null)}
                className={cn(
                  "block w-full py-2.5 text-left text-sm",
                  !activeCategory ? "font-bold text-black" : "text-black/65"
                )}
              >
                Tous les produits
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => applyFilters(cat.id)}
                  className={cn(
                    "block w-full py-2.5 text-left text-sm",
                    activeCategory === cat.id
                      ? "font-bold text-black"
                      : "text-black/65"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-black/45">
              Trier par
            </p>
            <div className="mt-3 space-y-1">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSort(option.value)}
                  className={cn(
                    "block w-full py-2.5 text-left text-sm",
                    sort === option.value
                      ? "font-bold text-black"
                      : "text-black/65"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-black/[0.06] bg-white px-5 py-4 pb-8">
          <button
            type="button"
            onClick={() => applyFilters()}
            className="w-full rounded-full bg-black py-3.5 text-sm font-semibold text-white"
          >
            Appliquer
          </button>
          {(activeCategory || searchParams.get("search") || searchParams.get("sort")) && (
            <Link
              href="/boutique"
              onClick={() => setOpen(false)}
              className="mt-3 block text-center text-sm text-black/55 underline"
            >
              Réinitialiser les filtres
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
