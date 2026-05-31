"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import {
  DEV_CHECKOUT_DEFAULTS,
  saveDevOrder,
} from "@/lib/dev-checkout";
import { formatPrice } from "@/lib/utils";

interface DevCheckoutPanelProps {
  shippingCents: number;
  totalCents: number;
  onFillForm: () => void;
}

export function DevCheckoutPanel({
  shippingCents,
  totalCents,
  onFillForm,
}: DevCheckoutPanelProps) {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  async function simulatePaidCheckout() {
    if (items.length === 0) return;

    setLoading(true);
    setError(null);
    onFillForm();

    try {
      const res = await fetch("/api/checkout/dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...DEV_CHECKOUT_DEFAULTS,
          items: items.map((i) => ({
            product_id: i.product.id,
            product_name: i.product.name,
            product_sku: i.product.sku,
            quantity: i.quantity,
            unit_price_cents: i.product.price_cents,
          })),
          shipping_cents: shippingCents,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Erreur mode dev");
      }

      if (result.order) {
        saveDevOrder(result.order);
      }

      clearCart();
      router.push(`/commande/${result.order_number}?success=true&dev=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[min(100vw-2rem,22rem)] rounded-2xl border-2 border-dashed border-amber-400/80 bg-amber-50 p-4 shadow-xl">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-200">
          <FlaskConical className="h-4 w-4 text-amber-900" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
            Mode dev
          </p>
          <p className="mt-1 text-xs leading-relaxed text-amber-800">
            Simule un paiement CB réussi sans Stripe — commande marquée payée,
            flux complet jusqu&apos;à la confirmation.
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-white/70 px-3 py-2 text-xs text-amber-900">
        <span className="font-medium">{items.length} article(s)</span>
        {" · "}
        <span>{formatPrice(totalCents)} TTC</span>
      </div>

      {error && (
        <p className="mt-2 rounded-lg bg-red-100 px-2 py-1.5 text-xs text-red-700">
          {error}
        </p>
      )}

      <Button
        type="button"
        size="sm"
        disabled={loading || items.length === 0}
        onClick={simulatePaidCheckout}
        className="mt-3 w-full bg-amber-600 text-white hover:bg-amber-700"
      >
        <Zap className="h-4 w-4" />
        {loading ? "Simulation..." : "Simuler paiement CB réussi"}
      </Button>
    </div>
  );
}
