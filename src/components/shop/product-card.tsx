"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import { CATEGORY_LABELS } from "@/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const discount =
    product.compare_at_price_cents &&
    product.compare_at_price_cents > product.price_cents
      ? Math.round(
          ((product.compare_at_price_cents - product.price_cents) /
            product.compare_at_price_cents) *
            100
        )
      : null;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white card-hover",
        className
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-warm">
        <Link
          href={`/produit/${product.slug}`}
          className="img-zoom absolute inset-0 block"
        >
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>

        {discount && (
          <Badge className="pointer-events-none absolute left-3 top-3 border-0 bg-red-500 text-white shadow-sm">
            -{discount}%
          </Badge>
        )}
        {product.is_featured && (
          <Badge
            className="pointer-events-none absolute right-3 top-3 border-0 bg-primary text-white shadow-sm"
            variant="success"
          >
            Best-seller
          </Badge>
        )}

        <div className="absolute inset-x-3 bottom-3 z-10 flex translate-y-2 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            size="sm"
            className="flex-1 shadow-lg"
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            <AnimatePresence mode="wait">
              {added ? (
                <motion.span
                  key="added"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  Ajouté
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Ajouter
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
          <Link href={`/produit/${product.slug}`}>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/95 shadow-lg hover:bg-white"
              aria-label="Voir le produit"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 lg:p-5">
        <Badge variant="secondary" className="mb-2 w-fit text-[10px] uppercase tracking-wider">
          {CATEGORY_LABELS[product.category]}
        </Badge>
        <Link href={`/produit/${product.slug}`}>
          <h3 className="font-display text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-2 lg:text-lg">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {product.short_description}
        </p>
        <div className="mt-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          <span>CBD {product.cbd_percent}%</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>THC &lt; {product.thc_percent}%</span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            <span className="font-display text-lg font-semibold text-primary lg:text-xl">
              {formatPrice(product.price_cents)}
            </span>
            {product.compare_at_price_cents && (
              <span className="ml-2 text-sm text-muted-foreground line-through">
                {formatPrice(product.compare_at_price_cents)}
              </span>
            )}
          </div>
          <Button
            size="icon"
            variant="outline"
            className="h-9 w-9 shrink-0 lg:hidden"
            onClick={handleAdd}
            disabled={product.stock === 0}
            aria-label="Ajouter au panier"
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
