import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/types";

interface ShopProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

/** Carte de la grille boutique — même rendu que les autres listes produits. */
export function ShopProductCard({ product, className, priority }: ShopProductCardProps) {
  return (
    <ProductCard
      product={product}
      className={className}
      priority={priority}
      sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
    />
  );
}
