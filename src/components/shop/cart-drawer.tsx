"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, Lock } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/data/catalog";
import { cn } from "@/lib/utils";

const SAMPLE_GIFT_THRESHOLD = 10000;

function formatPriceGreen(cents: number) {
  return formatPrice(cents).replace(/\s/g, "");
}

function getProductSubtitle(product: {
  weight_grams: number | null;
  short_description: string;
}) {
  if (product.weight_grams) return `${product.weight_grams}g`;
  return product.short_description.split(",")[0]?.trim() ?? "";
}

function CartProgressBar({ subtotalCents }: { subtotalCents: number }) {
  const nextThreshold = SAMPLE_GIFT_THRESHOLD;
  const remaining = Math.max(0, nextThreshold - subtotalCents);
  const progress = Math.min(100, (subtotalCents / nextThreshold) * 100);
  const shippingReached = subtotalCents >= FREE_SHIPPING_THRESHOLD;
  const sampleReached = subtotalCents >= SAMPLE_GIFT_THRESHOLD;

  return (
    <div className="border-t border-[#eee] bg-white px-5 py-5">
      {!sampleReached && (
        <p className="text-center text-[13px] text-black/70">
          Plus que{" "}
          <span className="font-semibold text-black">
            {formatPrice(remaining).replace(/\s/g, "")}
          </span>{" "}
          pour débloquer l&apos;échantillon{" "}
          <span className="font-bold">OFFERT</span>
        </p>
      )}
      {sampleReached && (
        <p className="text-center text-[13px] font-semibold text-black">
          Échantillon offert débloqué !
        </p>
      )}

      <div className="relative mt-4">
        <div className="h-[3px] rounded-full bg-[#e8e8e8]">
          <motion.div
            className="h-full rounded-full bg-black"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-black bg-white"
          style={{ left: `calc(${progress}% - 6px)` }}
        />
      </div>

      <div className="mt-3 flex justify-between text-[11px] font-medium text-black/55">
        <span className={cn(shippingReached && "font-bold text-black")}>
          Livraison OFFERTE
        </span>
        <span className={cn(sampleReached && "font-bold text-black")}>
          Échantillon gratuit
        </span>
      </div>
    </div>
  );
}

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getItemCount,
  } = useCartStore();

  const subtotal = getSubtotal();
  const itemCount = getItemCount();
  const compareSubtotal = items.reduce(
    (sum, { product, quantity }) =>
      sum +
      (product.compare_at_price_cents ?? product.price_cents) * quantity,
    0
  );
  const hasDiscount = compareSubtotal > subtotal;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110]" role="dialog" aria-modal="true" aria-label="Panier">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40"
            onClick={closeCart}
            aria-label="Fermer le panier"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between px-5 py-4">
              <h2 className="text-sm font-bold tracking-[0.12em] text-black">
                PANIER
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5"
                aria-label="Fermer"
              >
                <X className="h-5 w-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Bannière membres */}
            <div className="shrink-0 bg-[#f3f3f3] px-4 py-3 text-center text-[13px] text-black/80">
              Rejoignez + de 2 000 clients Verde CBD
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <p className="text-base font-bold text-black">
                  Votre panier est vide
                </p>
                <p className="mt-2 text-sm text-black/55">
                  Découvrez nos produits CBD premium
                </p>
                <Link
                  href="/boutique"
                  onClick={closeCart}
                  className="mt-6 rounded-full bg-black px-8 py-3 text-sm font-semibold text-white"
                >
                  Découvrir la boutique
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <div className="space-y-4">
                    {items.map(({ product, quantity }) => {
                      const lineTotal = product.price_cents * quantity;
                      const lineCompare =
                        (product.compare_at_price_cents ?? product.price_cents) *
                        quantity;

                      return (
                        <div
                          key={product.id}
                          className="rounded-xl border border-[#e8e8e8] p-4"
                        >
                          <div className="flex gap-3">
                            <Link
                              href={`/produit/${product.slug}`}
                              onClick={closeCart}
                              className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-lg bg-[#f5f5f5]"
                            >
                              <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                className="object-contain p-1.5"
                                sizes="88px"
                              />
                            </Link>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <Link
                                    href={`/produit/${product.slug}`}
                                    onClick={closeCart}
                                    className="text-[15px] font-bold leading-snug text-black hover:underline"
                                  >
                                    {product.name}
                                  </Link>
                                  <p className="mt-0.5 text-[13px] text-black/55">
                                    {getProductSubtitle(product)}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeItem(product.id)}
                                  className="shrink-0 text-black/40 hover:text-black"
                                  aria-label="Supprimer"
                                >
                                  <Trash2 className="h-4 w-4 stroke-[1.5]" />
                                </button>
                              </div>

                              <div className="mt-4 flex items-end justify-between">
                                <div className="inline-flex items-stretch overflow-hidden rounded-lg border border-[#ddd]">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateQuantity(product.id, quantity - 1)
                                    }
                                    className="flex h-9 w-9 items-center justify-center text-black hover:bg-[#f5f5f5]"
                                    aria-label="Diminuer la quantité"
                                  >
                                    <Minus className="h-3.5 w-3.5" />
                                  </button>
                                  <span className="flex h-9 min-w-[2.25rem] items-center justify-center border-x border-[#ddd] text-sm font-medium">
                                    {quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateQuantity(product.id, quantity + 1)
                                    }
                                    disabled={quantity >= product.stock}
                                    className="flex h-9 w-9 items-center justify-center text-black hover:bg-[#f5f5f5] disabled:opacity-40"
                                    aria-label="Augmenter la quantité"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>
                                </div>

                                <div className="text-right">
                                  <span className="text-[15px] font-bold text-[#2d9a5f]">
                                    {formatPriceGreen(lineTotal)}
                                  </span>
                                  {lineCompare > lineTotal && (
                                    <span className="ml-1.5 text-[13px] text-black/35 line-through">
                                      {formatPriceGreen(lineCompare)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <CartProgressBar subtotalCents={subtotal} />

                <div className="shrink-0 border-t border-[#eee] bg-white px-5 py-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-bold text-black">
                      Sous-total ({itemCount} article
                      {itemCount !== 1 ? "s" : ""})
                    </span>
                    <div>
                      <span className="text-base font-bold text-[#2d9a5f]">
                        {formatPriceGreen(subtotal)}
                      </span>
                      {hasDiscount && (
                        <span className="ml-2 text-sm text-black/35 line-through">
                          {formatPriceGreen(compareSubtotal)}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-black py-4 text-sm font-bold text-white transition-opacity hover:opacity-90"
                  >
                    <Lock className="h-4 w-4" />
                    Passer ma commande
                  </Link>
                </div>
              </>
            )}

            <div className="shrink-0 bg-[#f3f3f3] px-4 py-3 text-center text-[11px] leading-relaxed text-black/60">
              Essayez sans risque : 30 jours satisfait ou remboursé | Paiements
              sécurisés
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
