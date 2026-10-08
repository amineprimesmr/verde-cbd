"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, ShoppingBag, RotateCcw, Truck, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { FreeShippingBar } from "@/components/shop/free-shipping-bar";
import { CartLine } from "@/components/shop/upsell/cart-line";
import { CompleteYourOrder } from "@/components/shop/upsell/complete-your-order";
import { useCatalog } from "@/components/shop/upsell/use-catalog";
import { pickComplementaryProducts } from "@/components/shop/upsell/recommendations";

const EASE = [0.16, 1, 0.3, 1] as const;

function EmptyCart({ onClose }: { onClose: () => void }) {
  const catalog = useCatalog();
  const bestsellers = pickComplementaryProducts(
    catalog.filter((p) => p.is_featured).length >= 2
      ? catalog.filter((p) => p.is_featured)
      : catalog,
    { limit: 3, perCategory: 1 }
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE, delay: 0.1 }}
      className="flex flex-1 flex-col overflow-y-auto px-6 py-10"
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream">
          <ShoppingBag className="h-7 w-7 stroke-[1.5] text-foreground/60" />
        </div>
        <p className="mt-5 text-lg font-bold text-foreground">Votre panier est vide</p>
        <p className="mt-1.5 max-w-[260px] text-sm text-foreground/55">
          Pre-rolls, résines et vapes CBD testés en laboratoire, livrés en toute discrétion.
        </p>
        <Link
          href="/boutique"
          onClick={onClose}
          className="mt-6 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-85"
        >
          Découvrir la boutique
        </Link>
      </div>
      {bestsellers.length > 0 && (
        <div className="mt-10 space-y-2">
          <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-foreground/50">
            Pour commencer
          </p>
          {bestsellers.map((p) => (
            <Link
              key={p.id}
              href={`/produit/${p.slug}`}
              onClick={onClose}
              className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:border-foreground/30"
            >
              <span className="font-semibold text-foreground">{p.name}</span>
              <span className="text-foreground/60">{formatPrice(p.price_cents)}</span>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const lastAddedId = useCartStore((s) => s.lastAddedId);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const compareSubtotal = useCartStore((s) => s.getCompareSubtotal());
  const itemCount = useCartStore((s) => s.getItemCount());
  const catalog = useCatalog();
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  const savings = compareSubtotal - subtotal;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110]" role="dialog" aria-modal="true" aria-label="Panier">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
            onClick={closeCart}
            aria-label="Fermer le panier"
          />

          <motion.aside
            ref={panelRef}
            tabIndex={-1}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38, mass: 0.9 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-background shadow-2xl outline-none"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-sm font-bold tracking-[0.12em] text-foreground">
                PANIER{" "}
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 1.4 }}
                    animate={{ scale: 1 }}
                    className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] text-primary-foreground"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/5"
                aria-label="Fermer"
              >
                <X className="h-5 w-5 stroke-[1.5]" />
              </button>
            </div>

            {items.length === 0 ? (
              <EmptyCart onClose={closeCart} />
            ) : (
              <>
                <FreeShippingBar
                  subtotalCents={subtotal}
                  className="shrink-0 border-b border-border px-5 py-4"
                />

                <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
                  <div className="space-y-3">
                    <AnimatePresence initial={false} mode="popLayout">
                      {items.map(({ product, quantity }) => (
                        <CartLine
                          key={product.id}
                          product={product}
                          quantity={quantity}
                          highlight={product.id === lastAddedId}
                          onNavigate={closeCart}
                        />
                      ))}
                    </AnimatePresence>
                  </div>

                  <CompleteYourOrder
                    catalog={catalog}
                    onNavigate={closeCart}
                    className="mt-7"
                  />
                </div>

                <div className="shrink-0 border-t border-border bg-card px-5 pb-5 pt-4">
                  {savings > 0 && (
                    <div className="flex justify-between text-[13px] text-primary">
                      <span>Vous économisez</span>
                      <span className="font-semibold">−{formatPrice(savings)}</span>
                    </div>
                  )}
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-sm font-bold text-foreground">
                      Sous-total ({itemCount} article{itemCount !== 1 ? "s" : ""})
                    </span>
                    <span className="text-lg font-bold text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-foreground/50">
                    TVA incluse. Livraison calculée à l&apos;étape suivante.
                  </p>

                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <Lock className="h-4 w-4" />
                    Commander · {formatPrice(subtotal)}
                  </Link>
                  <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-foreground/55">
                    <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" />Paiement sécurisé</span>
                    <span className="inline-flex items-center gap-1"><Truck className="h-3.5 w-3.5" />Envoi discret</span>
                    <span className="inline-flex items-center gap-1"><RotateCcw className="h-3.5 w-3.5" />Retours 14 jours</span>
                  </div>
                  <Link
                    href="/panier"
                    onClick={closeCart}
                    className="mt-2 block text-center text-[12px] text-foreground/50 underline underline-offset-2 hover:text-foreground"
                  >
                    Voir le panier complet
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
