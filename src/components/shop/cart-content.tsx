"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, RotateCcw, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { FreeShippingBar } from "@/components/shop/free-shipping-bar";
import { CartLine } from "@/components/shop/upsell/cart-line";
import { CompleteYourOrder } from "@/components/shop/upsell/complete-your-order";
import { useCatalog } from "@/components/shop/upsell/use-catalog";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";
import type { Product } from "@/types";

export function CartContent({ catalog: initialCatalog }: { catalog?: Product[] }) {
  const items = useCartStore((s) => s.items);
  const lastAddedId = useCartStore((s) => s.lastAddedId);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const compareSubtotal = useCartStore((s) => s.getCompareSubtotal());
  const itemCount = useCartStore((s) => s.getItemCount());
  const catalog = useCatalog(initialCatalog);
  const savings = compareSubtotal - subtotal;

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center py-16 text-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream">
          <ShoppingBag className="h-8 w-8 stroke-[1.5] text-foreground/60" />
        </div>
        <p className="mt-6 text-2xl font-bold text-foreground">Votre panier est vide</p>
        <p className="mt-2 max-w-sm text-foreground/55">
          Pre-rolls, résines et vapes CBD testés en laboratoire, livrés en toute discrétion.
        </p>
        <Link
          href="/boutique"
          className="mt-6 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-85"
        >
          Découvrir la boutique
        </Link>
        <CompleteYourOrder
          catalog={catalog}
          layout="grid"
          title="Nos essentiels"
          className="mt-14 w-full max-w-2xl text-left"
        />
      </motion.div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <FreeShippingBar
          subtotalCents={subtotal}
          className="rounded-xl border border-border px-5 py-4"
        />

        <div className="space-y-3">
          <AnimatePresence initial={false} mode="popLayout">
            {items.map(({ product, quantity }) => (
              <CartLine
                key={product.id}
                product={product}
                quantity={quantity}
                highlight={product.id === lastAddedId}
                size="lg"
              />
            ))}
          </AnimatePresence>
        </div>

        <CompleteYourOrder catalog={catalog} layout="grid" className="pt-6" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24"
      >
        <h2 className="text-xl font-bold text-foreground">Récapitulatif</h2>
        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground/60">
              Sous-total ({itemCount} article{itemCount !== 1 ? "s" : ""})
            </span>
            <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
          </div>
          {savings > 0 && (
            <div className="flex justify-between text-primary">
              <span>Vos économies</span>
              <span className="font-medium">−{formatPrice(savings)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-foreground/60">Livraison</span>
            {subtotal >= FREE_SHIPPING_THRESHOLD ? (
              <span className="font-semibold text-primary">Offerte</span>
            ) : (
              <span className="text-foreground/60">Calculée à l&apos;étape suivante</span>
            )}
          </div>
          <div className="border-t border-border pt-3">
            <div className="flex items-baseline justify-between">
              <span className="font-semibold text-foreground">Total estimé</span>
              <span className="text-xl font-bold text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-foreground/50">TVA incluse</p>
          </div>
        </div>
        <Link
          href="/checkout"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Lock className="h-4 w-4" />
          Passer commande
        </Link>
        <Link
          href="/boutique"
          className="mt-3 block text-center text-sm text-foreground/60 underline underline-offset-2 hover:text-foreground"
        >
          Continuer mes achats
        </Link>
        <ul className="mt-6 space-y-2 border-t border-border pt-5 text-[13px] text-foreground/65">
          <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" />Paiement sécurisé par Mollie</li>
          <li className="flex items-center gap-2"><Truck className="h-4 w-4" />Envoi discret, offert dès {formatPrice(FREE_SHIPPING_THRESHOLD)}</li>
          <li className="flex items-center gap-2"><RotateCcw className="h-4 w-4" />Retours sous 14 jours</li>
        </ul>
      </motion.div>
    </div>
  );
}
