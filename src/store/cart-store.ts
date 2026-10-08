"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";
import {
  getCartSubtotalCents,
  getLineCompareCents,
  MAX_QUANTITY_PER_LINE,
} from "@/lib/pricing";

export interface CartLine {
  product: Product;
  quantity: number;
}

interface AddOptions {
  /** Ouvre le drawer après l'ajout (par défaut : oui). */
  open?: boolean;
}

interface CartStore {
  items: CartLine[];
  isOpen: boolean;
  /** Dernier produit ajouté — sert à l'animation de confirmation. */
  lastAddedId: string | null;
  addItem: (product: Product, quantity?: number, options?: AddOptions) => void;
  addItems: (products: Product[], options?: AddOptions) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  /** Met à jour prix / stock des articles à partir du catalogue serveur. */
  syncProducts: (products: Product[]) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getSubtotal: () => number;
  getCompareSubtotal: () => number;
  getItemCount: () => number;
}

function maxQty(product: Product) {
  return Math.max(0, Math.min(product.stock, MAX_QUANTITY_PER_LINE));
}

function mergeItem(items: CartLine[], product: Product, quantity: number): CartLine[] {
  const limit = maxQty(product);
  if (limit === 0) return items;
  const existing = items.find((i) => i.product.id === product.id);
  if (existing) {
    return items.map((i) =>
      i.product.id === product.id
        ? { ...i, quantity: Math.min(i.quantity + quantity, limit) }
        : i
    );
  }
  return [...items, { product, quantity: Math.min(quantity, limit) }];
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lastAddedId: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (product, quantity = 1, options) => {
        set((state) => ({
          items: mergeItem(state.items, product, quantity),
          lastAddedId: product.id,
          isOpen: options?.open ?? true,
        }));
      },

      addItems: (products, options) => {
        set((state) => ({
          items: products.reduce((acc, p) => mergeItem(acc, p, 1), state.items),
          lastAddedId: products[0]?.id ?? state.lastAddedId,
          isOpen: options?.open ?? true,
        }));
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId
              ? { ...i, quantity: Math.min(quantity, maxQty(i.product)) }
              : i
          ),
        }));
      },

      syncProducts: (products) => {
        const byId = new Map(products.map((p) => [p.id, p]));
        set((state) => {
          let changed = false;
          const items = state.items.flatMap((line) => {
            const fresh = byId.get(line.product.id);
            if (!fresh) return [line];
            const product: Product = {
              ...line.product,
              name: fresh.name,
              price_cents: fresh.price_cents,
              compare_at_price_cents: fresh.compare_at_price_cents,
              stock: fresh.stock,
              is_active: fresh.is_active,
              image_url: fresh.image_url || line.product.image_url,
            };
            const quantity = Math.min(line.quantity, maxQty(product));
            if (
              product.price_cents !== line.product.price_cents ||
              product.compare_at_price_cents !== line.product.compare_at_price_cents ||
              product.stock !== line.product.stock ||
              quantity !== line.quantity
            ) {
              changed = true;
            }
            return quantity > 0 && product.is_active ? [{ product, quantity }] : [];
          });
          if (!changed && items.length === state.items.length) return state;
          return { items };
        });
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => getCartSubtotalCents(get().items),

      getCompareSubtotal: () =>
        get().items.reduce(
          (sum, i) => sum + getLineCompareCents(i.product, i.quantity),
          0
        ),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "verde-cbd-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
