"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, HelpCircle } from "lucide-react";
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

function getDiscountBadge(product: Product) {
  if (!product.compare_at_price_cents) return null;
  const pct = Math.round(
    (1 - product.price_cents / product.compare_at_price_cents) * 100
  );
  return pct > 0 ? `-${pct}%` : null;
}

const TRUST_ITEMS = [
  "Zéro risque, garantie 30 jours",
  "+500 avis 5/5",
  "Paiement 100% sécurisé & crypté",
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
  totalCents: number;
  discountCode: string;
  onDiscountCodeChange: (value: string) => void;
  className?: string;
  showFooter?: boolean;
}

export function CheckoutOrderSummary({
  items,
  subtotalCents,
  shippingCents,
  totalCents,
  discountCode,
  onDiscountCodeChange,
  className,
  showFooter = true,
}: CheckoutOrderSummaryProps) {
  return (
    <div className={cn("text-black", className)}>
      <div className="space-y-5">
        {items.map(({ product, quantity }) => {
          const badge = getDiscountBadge(product);
          return (
            <div key={product.id} className="flex gap-4">
              <div className="relative h-[62px] w-[62px] shrink-0 overflow-hidden rounded-lg border border-[#e5e5e5] bg-white">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="62px"
                />
                <span className="absolute -right-1.5 -top-1.5 flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-[#707070] px-1 text-[11px] font-bold text-white">
                  {quantity}
                </span>
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold leading-snug text-black">
                      {product.name}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-[13px] text-[#707070]">
                        {getProductSubtitle(product)}
                      </span>
                      {badge && (
                        <span className="rounded bg-[#f2f2f2] px-1.5 py-0.5 text-[11px] font-semibold text-[#707070]">
                          {badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 text-[15px] font-semibold text-black">
                    {formatCheckoutPrice(product.price_cents * quantity)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex gap-2">
        <input
          value={discountCode}
          onChange={(e) => onDiscountCodeChange(e.target.value)}
          placeholder="Code de réduction ou carte-cadeau"
          className="h-[52px] min-w-0 flex-1 rounded-[10px] border border-[#d9d9d9] bg-white px-4 text-[15px] text-black placeholder:text-[#999] focus:border-black focus:outline-none focus:ring-1 focus:ring-black/10"
        />
        <button
          type="button"
          className="shrink-0 rounded-[10px] border border-[#d9d9d9] bg-[#f0f0f0] px-5 text-sm font-semibold text-[#707070] transition-colors hover:border-[#999] hover:text-black"
        >
          Valider
        </button>
      </div>

      <div className="mt-6 space-y-3 border-t border-[#e1e1e1] pt-6 text-[15px]">
        <div className="flex items-center justify-between text-[#707070]">
          <span>Sous-total</span>
          <span className="text-black">
            {formatCheckoutPrice(subtotalCents)}
          </span>
        </div>
        <div className="flex items-center justify-between text-[#707070]">
          <span>Expédition</span>
          <span className="font-medium text-black">
            {shippingCents === 0 ? "OFFERT" : formatCheckoutPrice(shippingCents)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[17px] font-semibold text-black">Total</span>
          <div className="text-right">
            <span className="text-[12px] font-medium text-[#707070]">EUR </span>
            <span className="text-[22px] font-bold tracking-tight text-black">
              {formatCheckoutPrice(totalCents)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-[10px] bg-[#ececec] px-4 py-3 text-[13px] text-[#707070]">
        <span>
          Sous-total TTC{" "}
          <span className="font-semibold text-black">
            {formatCheckoutPrice(subtotalCents)}
          </span>
        </span>
        <HelpCircle className="h-4 w-4 shrink-0" />
      </div>

      <ul className="mt-8 space-y-3">
        {TRUST_ITEMS.map((text) => (
          <li
            key={text}
            className="flex items-center gap-2.5 text-[14px] font-bold text-black"
          >
            <Heart className="h-4 w-4 fill-[#f5c518] text-[#f5c518]" />
            {text}
          </li>
        ))}
      </ul>

      {showFooter && (
        <nav className="mt-10 grid grid-cols-2 gap-x-4 gap-y-3 text-[12px] text-[#1773b0]">
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
