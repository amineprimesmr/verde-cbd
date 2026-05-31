"use client";

import { Suspense } from "react";
import { ShopProductCard } from "@/components/shop/shop-product-card";
import { ShopFilterDrawer } from "@/components/shop/shop-filter-drawer";
import type { Product, ProductCategory } from "@/types";

interface ShopCatalogProps {
  products: Product[];
  categories: { id: ProductCategory; name: string }[];
  activeCategory?: ProductCategory;
}

export function ShopCatalog({
  products,
  categories,
  activeCategory,
}: ShopCatalogProps) {
  return (
    <div className="bg-white pb-28">
      <p className="py-5 text-center text-[13px] text-black/45">
        {products.length} produit{products.length !== 1 ? "s" : ""}
      </p>

      {products.length === 0 ? (
        <div className="px-4 py-20 text-center">
          <p className="text-base font-bold text-black">Aucun produit trouvé</p>
          <p className="mt-2 text-sm text-black/50">
            Essayez une autre catégorie ou modifiez votre recherche
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 px-3 sm:gap-x-4 sm:px-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5 lg:px-8">
          {products.map((product) => (
            <ShopProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <Suspense fallback={null}>
        <ShopFilterDrawer categories={categories} activeCategory={activeCategory} />
      </Suspense>
    </div>
  );
}
