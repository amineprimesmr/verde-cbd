"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShopProductCard } from "@/components/shop/shop-product-card";
import { ShopFilterDrawer } from "@/components/shop/shop-filter-drawer";
import { ActiveSearchChip, CategoryPills, ShopFilters } from "@/components/shop/shop-filters";
import type { ShopQuery } from "@/components/shop/shop-query";
import type { Product, ProductCategory, VapeSubcategory } from "@/types";

interface ShopCatalogProps {
  products: Product[];
  categories: { id: ProductCategory; name: string; description?: string }[];
  vapeSubcategories?: { id: VapeSubcategory; name: string }[];
  activeCategory?: ProductCategory;
  activeSubcategory?: VapeSubcategory;
  query?: string;
  sort?: string;
}

const ease = [0.16, 1, 0.3, 1] as const;

export function ShopCatalog({
  products,
  categories,
  vapeSubcategories,
  activeCategory,
  activeSubcategory,
  query,
  sort,
}: ShopCatalogProps) {
  const current = useMemo<ShopQuery>(
    () => ({ category: activeCategory, subcategory: activeSubcategory, q: query, sort }),
    [activeCategory, activeSubcategory, query, sort]
  );

  const activeCat = categories.find((c) => c.id === activeCategory);
  const title = query
    ? "Résultats de recherche"
    : activeCat?.name ?? "Tous nos produits";
  const intro = query
    ? null
    : activeCat?.description ??
      "Pre-rolls, résines, vapes et accessoires, sélectionnés en Europe et analysés en laboratoire.";

  // Clé de liste : relance l'animation d'apparition à chaque changement de filtre.
  const listKey = `${activeCategory ?? "all"}-${activeSubcategory ?? ""}-${query ?? ""}-${sort ?? ""}`;

  return (
    <div className="pb-32 lg:pb-24">
      <header className="container-x pb-8 pt-10 sm:pt-14 lg:pb-10 lg:pt-16">
        <p className="eyebrow">Boutique</p>
        <h1 className="mt-3 font-display text-[2.25rem] leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{intro}</p>
        )}
        {query && (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <ActiveSearchChip current={current} />
            <span className="text-[13px] text-muted-foreground lg:hidden" aria-live="polite">
              {products.length} produit{products.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </header>

      <div className="container-x space-y-6">
        <CategoryPills categories={categories} vapeSubcategories={vapeSubcategories} current={current} />
        <ShopFilters current={current} resultCount={products.length} />
        {!query && (
          <p className="text-[13px] text-muted-foreground lg:hidden" aria-live="polite">
            {products.length} produit{products.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="container-x mt-8 lg:mt-10">
        {products.length === 0 ? (
          <div className="mx-auto max-w-md py-20 text-center">
            <p className="font-display text-2xl text-foreground">Aucun produit trouvé</p>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              {query
                ? `Aucun résultat pour « ${query} ». Vérifiez l'orthographe ou essayez un terme plus général.`
                : "Cette sélection est vide pour le moment. Explorez les autres catégories."}
            </p>
            <Link
              href="/boutique"
              className="mt-8 inline-flex h-12 items-center rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground hover:bg-primary-light"
            >
              Voir tous les produits
            </Link>
          </div>
        ) : (
          <ul
            key={listKey}
            className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:gap-y-14 xl:grid-cols-4"
          >
            {products.map((product, i) => (
              <motion.li
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: Math.min(i, 8) * 0.04, ease }}
              >
                <ShopProductCard product={product} priority={i < 2} />
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      <ShopFilterDrawer categories={categories} vapeSubcategories={vapeSubcategories} current={current} />
    </div>
  );
}
