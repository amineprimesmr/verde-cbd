"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FreeShippingBar } from "@/components/shop/free-shipping-bar";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { FadeIn } from "@/components/ui/motion";

export function CartContent() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  if (items.length === 0) {
    return (
      <FadeIn className="flex flex-col items-center py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="mt-6 font-display text-2xl font-semibold text-foreground">
          Votre panier est vide
        </p>
        <p className="mt-2 text-muted-foreground">
          Découvrez notre sélection de produits CBD premium
        </p>
        <Link href="/boutique">
          <Button className="mt-6" size="lg">
            Découvrir la boutique
          </Button>
        </Link>
      </FadeIn>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <FreeShippingBar subtotalCents={subtotal} />

        <AnimatePresence mode="popLayout">
          {items.map(({ product, quantity }) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-4 rounded-2xl border border-border bg-white p-4 transition-shadow hover:shadow-md"
            >
              <Link
                href={`/produit/${product.slug}`}
                className="img-zoom relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-warm"
              >
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <Link
                  href={`/produit/${product.slug}`}
                  className="font-display font-semibold text-foreground transition-colors hover:text-primary"
                >
                  {product.name}
                </Link>
                <p className="text-xs text-muted-foreground">{product.sku}</p>
                <p className="mt-auto font-semibold text-primary">
                  {formatPrice(product.price_cents * quantity)}
                </p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-red-500"
                  onClick={() => removeItem(product.id)}
                  aria-label="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1 rounded-full border border-border bg-cream p-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="h-fit rounded-2xl border border-border bg-white p-6 shadow-sm lg:sticky lg:top-24"
      >
        <h2 className="font-display text-xl font-semibold">Récapitulatif</h2>
        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sous-total</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Livraison</span>
            <span className="text-muted-foreground">
              {subtotal >= 8000 ? (
                <span className="font-medium text-primary">Gratuite</span>
              ) : (
                "Calculée au checkout"
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">TVA (20%)</span>
            <span className="text-muted-foreground">Calculée au checkout</span>
          </div>
          <div className="border-t border-border pt-3">
            <div className="flex justify-between text-base">
              <span className="font-semibold">Total estimé</span>
              <span className="font-display text-lg font-semibold text-primary">
                {formatPrice(subtotal)}
              </span>
            </div>
          </div>
        </div>
        <Link href="/checkout" className="mt-6 block">
          <Button size="lg" className="w-full">
            Passer commande
          </Button>
        </Link>
        <Link
          href="/boutique"
          className="mt-3 block text-center text-sm text-primary hover:underline"
        >
          Continuer mes achats
        </Link>
      </motion.div>
    </div>
  );
}
