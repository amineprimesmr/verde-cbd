"use client";

import Link from "next/link";
import Image from "next/image";
import { Lock, RotateCcw, Truck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { getLineCompareCents, getLinePriceCents } from "@/lib/pricing";
import { formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/types";

type CartLineItem = { product: Product; quantity: number };

function formatCheckoutPrice(cents: number) {
  return formatPrice(cents).replace(/\u00a0/g, " ");
}

function getProductSubtitle(product: Product) {
  if (product.weight_grams) return `${product.weight_grams}g`;
  return product.short_description.split(",")[0]?.trim() ?? "";
}

function getDiscountBadge(product: Product, quantity: number) {
  const line = getLinePriceCents(product, quantity);
  const compare = getLineCompareCents(product, quantity);
  const pct = Math.round((1 - line / compare) * 100);
  return pct > 0 ? `-${pct}%` : null;
}

const TRUST_ITEMS = [
  { icon: Lock, text: "Paiement sécurisé par Mollie (3-D Secure)" },
  { icon: Truck, text: "Expédition discrète et suivie" },
  { icon: RotateCcw, text: "Retours sous 14 jours (produits non ouverts)" },
];

const FOOTER_LINKS = [
  { href: "/cgv", label: "Politique de remboursement" },
  { href: "/livraison", label: "Expédition" },
  { href: "/politique-confidentialite", label: "Politique de confidentialité" },
  { href: "/cgv", label: "Conditions d'utilisation" },
  { href: "/cgv", label: "Conditions générales de vente" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/contact", label: "Contact" },
];

interface CheckoutOrderSummaryProps {
  items: CartLineItem[];
  subtotalCents: number;
  shippingCents: number;
  taxCents?: number;
  totalCents: number;
  /** Adresse non saisie : frais de port encore indicatifs. */
  shippingPending?: boolean;
  discountCode: string;
  onDiscountCodeChange: (value: string) => void;
  className?: string;
  showFooter?: boolean;
}

export function CheckoutOrderSummary({
  items,
  subtotalCents,
  shippingCents,
  taxCents,
  totalCents,
  shippingPending = false,
  className,
  showFooter = true,
}: CheckoutOrderSummaryProps) {
  return (
    <div className={cn("text-foreground", className)}>
      <div className="space-y-5">
        <AnimatePresence initial={false}>
        {items.map(({ product, quantity }) => {
          const badge = getDiscountBadge(product, quantity);
          return (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-4"
            >
              <div className="relative h-[62px] w-[62px] shrink-0 overflow-hidden rounded-lg border border-border bg-card">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="62px"
                />
                <span className="absolute -right-1.5 -top-1.5 flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-[#707070] px-1 text-[11px] font-bold text-primary-foreground">
                  {quantity}
                </span>
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold leading-snug text-foreground">
                      {product.name}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-[13px] text-muted-foreground">
                        {getProductSubtitle(product)}
                      </span>
                      {badge && (
                        <span className="rounded bg-cream px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                          {badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 text-[15px] font-semibold text-foreground">
                    {formatCheckoutPrice(getLinePriceCents(product, quantity))}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
        </AnimatePresence>
      </div>

      <div className="mt-6 space-y-3 border-t border-border pt-6 text-[15px]">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Sous-total</span>
          <span className="text-foreground">
            {formatCheckoutPrice(subtotalCents)}
          </span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Expédition</span>
          <span className="font-medium text-foreground">
            {shippingCents === 0 ? (
              <span className="text-primary">OFFERTE</span>
            ) : shippingPending ? (
              <span className="text-[13px] font-normal text-muted-foreground">
                dès {formatCheckoutPrice(shippingCents)}
              </span>
            ) : (
              formatCheckoutPrice(shippingCents)
            )}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[17px] font-semibold text-foreground">Total</span>
          <div className="text-right">
            <span className="text-[12px] font-medium text-muted-foreground">EUR </span>
            <span className="text-[22px] font-bold tracking-tight text-foreground">
              {formatCheckoutPrice(totalCents)}
            </span>
          </div>
        </div>
      </div>

      {taxCents !== undefined && (
        <p className="mt-2 text-right text-[12px] text-muted-foreground">
          Dont TVA {formatCheckoutPrice(taxCents)}
        </p>
      )}

      <ul className="mt-8 space-y-3">
        {TRUST_ITEMS.map(({ icon: Icon, text }) => (
          <li
            key={text}
            className="flex items-center gap-2.5 text-[13px] font-semibold text-foreground"
          >
            <Icon className="h-4 w-4 shrink-0" />
            {text}
          </li>
        ))}
      </ul>

      {showFooter && (
        <nav className="mt-10 grid grid-cols-2 gap-x-4 gap-y-3 text-[12px] text-accent">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className="underline underline-offset-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
