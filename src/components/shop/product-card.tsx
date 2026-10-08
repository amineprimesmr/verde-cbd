"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Check } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import { CATEGORY_LABELS } from "@/types";

interface ProductCardProps {
  product: Product;
  className?: string;
  /** Précharge l'image (cartes au-dessus de la ligne de flottaison). */
  priority?: boolean;
  /** Attribut sizes de next/image — à ajuster selon la grille parente. */
  sizes?: string;
}

function hasTag(product: Product, tag: string): boolean {
  return product.tags.some((t) => t.toLowerCase() === tag);
}

export function getDiscountPercent(product: Product): number | null {
  const compare = product.compare_at_price_cents;
  if (!compare || compare <= product.price_cents) return null;
  return Math.round(((compare - product.price_cents) / compare) * 100);
}

export function ProductCard({
  product,
  className,
  priority = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  const discount = getDiscountPercent(product);
  const isNew = hasTag(product, "nouveau");
  const isBestSeller = hasTag(product, "best-seller") || product.is_featured;
  const outOfStock = product.stock <= 0;
  const primary = product.images[0] ?? product.image_url;
  const secondary = product.images[1];
  const href = `/produit/${product.slug}`;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addItem(product);
    setAdded(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1800);
  }

  const badge = outOfStock
    ? { label: "Épuisé", tone: "bg-foreground/80 text-background" }
    : discount
      ? { label: `−${discount} %`, tone: "bg-[#8a3b2a] text-white" }
      : isNew
        ? { label: "Nouveau", tone: "bg-card text-foreground" }
        : isBestSeller
          ? { label: "Best-seller", tone: "bg-primary text-primary-foreground" }
          : null;

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-cream">
        <Link href={href} className="absolute inset-0 block" tabIndex={-1} aria-hidden>
          <Image
            src={primary}
            alt=""
            fill
            preload={priority}
            sizes={sizes}
            className={cn(
              "object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]",
              secondary && "md:group-hover:opacity-0"
            )}
          />
          {secondary && (
            <Image
              src={secondary}
              alt=""
              fill
              sizes={sizes}
              className="hidden object-cover opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:block md:group-hover:scale-[1.03] md:group-hover:opacity-100"
            />
          )}
        </Link>

        {badge && (
          <span
            className={cn(
              "pointer-events-none absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] sm:left-3 sm:top-3",
              badge.tone
            )}
          >
            {badge.label}
          </span>
        )}

        {/* Ajout rapide */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          aria-label={
            added ? `${product.name} ajouté au panier` : `Ajouter ${product.name} au panier`
          }
          className={cn(
            "absolute bottom-2.5 right-2.5 z-10 flex h-10 items-center justify-center gap-2 rounded-full bg-card/95 px-3 text-[13px] font-medium text-foreground shadow-[0_4px_16px_rgb(31_35_30/0.12)] backdrop-blur transition-[opacity,transform,background-color,color] duration-300 hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-0 sm:bottom-3 sm:right-3",
            "md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:translate-y-0 md:focus-visible:opacity-100",
            added && "bg-primary text-primary-foreground md:translate-y-0 md:opacity-100"
          )}
        >
          {added ? (
            <Check className="h-4 w-4" aria-hidden />
          ) : (
            <Plus className="h-4 w-4" aria-hidden />
          )}
          <span className="hidden md:inline">{added ? "Ajouté" : "Ajout rapide"}</span>
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-3.5 sm:pt-4">
        <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:text-[11px]">
          {CATEGORY_LABELS[product.category]}
        </p>
        <h3 className="mt-1.5 text-sm leading-snug text-foreground sm:text-[15px]">
          <Link
            href={href}
            className="line-clamp-2 after:absolute after:inset-0 after:content-['']"
          >
            {product.name}
          </Link>
        </h3>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-sm font-medium tabular-nums text-foreground sm:text-[15px]">
            {formatPrice(product.price_cents)}
          </span>
          {discount && product.compare_at_price_cents && (
            <span className="text-xs tabular-nums text-muted-foreground line-through decoration-foreground/30 sm:text-[13px]">
              <span className="sr-only">Prix initial&nbsp;:</span>
              {formatPrice(product.compare_at_price_cents)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
