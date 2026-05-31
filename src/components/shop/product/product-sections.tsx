"use client";

import { ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProductStickyCartProps {
  priceCents: number;
  compareCents: number | null;
  onAdd: () => void;
  disabled?: boolean;
  added?: boolean;
  className?: string;
}

export function ProductStickyCart({
  priceCents,
  compareCents,
  onAdd,
  disabled,
  added,
  className,
}: ProductStickyCartProps) {
  return (
    <>
      {/* Desktop inline CTA */}
      <div className={cn("hidden px-4 py-6 lg:block", className)}>
        <button
          type="button"
          onClick={onAdd}
          disabled={disabled}
          className="w-full rounded-full bg-black py-4 text-sm font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {added ? (
            "Ajouté au panier ✓"
          ) : (
            <>
              Ajouter au panier
              {compareCents && compareCents > priceCents && (
                <span className="ml-2 text-white/60 line-through">
                  {formatPrice(compareCents)}
                </span>
              )}
              <span className="ml-2">{formatPrice(priceCents)}</span>
            </>
          )}
        </button>
      </div>

      {/* Mobile sticky CTA — Naali yellow pill */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#eee] bg-white/95 p-3 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={onAdd}
          disabled={disabled}
          className="w-full rounded-full bg-[#f2c94c] py-4 text-base font-bold text-black transition-transform active:scale-[0.98] disabled:opacity-50"
        >
          {added ? "Ajouté ✓" : "Ajouter au panier"}
        </button>
      </div>
    </>
  );
}

export function ProductGuaranteeBanner() {
  return (
    <div className="mx-4 mb-6 flex gap-4 rounded-xl bg-[#2a2a2a] p-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f2c94c]">
        <ShieldCheck className="h-7 w-7 text-black" />
      </div>
      <div>
        <p className="text-sm font-bold text-[#f2c94c]">
          Garantie 30 jours{" "}
          <span className="underline decoration-[#f2c94c]/50">satisfait ou remboursé</span>
        </p>
        <p className="mt-1 text-xs leading-relaxed text-white/70">
          Si vous n&apos;êtes pas satisfait, nous vous remboursons votre commande sans
          la moindre justification.
        </p>
      </div>
    </div>
  );
}

export function ProductBenefitsGrid({
  benefits,
}: {
  benefits: { emoji: string; label: string }[];
}) {
  return (
    <div className="grid grid-cols-2 border-y border-[#eee] bg-white">
      {benefits.map((b, i) => (
        <div
          key={b.label}
          className={cn(
            "flex items-center gap-3 px-4 py-4",
            i % 2 === 0 && "border-r border-[#eee]",
            i < 2 && "border-b border-[#eee]"
          )}
        >
          <span className="text-xl">{b.emoji}</span>
          <span className="text-sm font-semibold text-black">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

export function ProductQuoteBlock({ quote }: { quote: string }) {
  return (
    <div className="relative bg-[#fff8e1] px-6 py-10">
      <span className="absolute left-4 top-4 font-serif text-6xl leading-none text-black/10">
        &ldquo;
      </span>
      <p className="relative text-center text-base font-bold leading-relaxed text-black sm:text-lg">
        {quote}
      </p>
    </div>
  );
}

export function ProductDifferenceSection({
  items,
}: {
  items: { num: string; title: string }[];
}) {
  return (
    <section className="bg-white px-4 py-8">
      <h2 className="text-lg font-bold text-black">La différence Verde CBD</h2>
      <div className="mt-4 divide-y divide-[#eee] border-y border-[#eee]">
        {items.map((item) => (
          <div key={item.num} className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-black/40">{item.num}</span>
              <span className="text-sm font-medium text-black">{item.title}</span>
            </div>
            <span className="text-xl text-black/30">+</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProductUsageSection({ steps }: { steps: string[] }) {
  return (
    <section id="usage" className="scroll-mt-20 bg-white px-4 py-8">
      <h2 className="text-lg font-bold text-black">Comment l&apos;utiliser ?</h2>
      <ol className="mt-6 space-y-4">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-black text-sm font-bold">
              {i + 1}
            </span>
            <p className="pt-1 text-sm leading-relaxed text-black/80">{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
