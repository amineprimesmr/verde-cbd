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
          className="w-full rounded-full bg-primary py-4 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {disabled ? (
            "Rupture de stock"
          ) : added ? (
            "Ajouté au panier ✓"
          ) : (
            <>
              Ajouter au panier
              {compareCents && compareCents > priceCents && (
                <span className="ml-2 text-primary-foreground/60 line-through">
                  {formatPrice(compareCents)}
                </span>
              )}
              <span className="ml-2">{formatPrice(priceCents)}</span>
            </>
          )}
        </button>
      </div>

      {/* Mobile sticky CTA — Naali yellow pill */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 p-3 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={onAdd}
          disabled={disabled}
          className="w-full rounded-full bg-primary py-4 text-base font-semibold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-50"
        >
          {disabled
            ? "Rupture de stock"
            : added
              ? "Ajouté ✓"
              : `Ajouter au panier · ${formatPrice(priceCents)}`}
        </button>
      </div>
    </>
  );
}

export function ProductGuaranteeBanner() {
  return (
    <div className="mx-4 mb-6 flex gap-4 rounded-xl bg-ink p-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary">
        <ShieldCheck className="h-7 w-7 text-foreground" />
      </div>
      <div>
        <p className="text-sm font-bold text-primary-foreground">
          Retours sous 14 jours
        </p>
        <p className="mt-1 text-xs leading-relaxed text-primary-foreground/70">
          Un produit non ouvert ne vous convient pas&nbsp;? Renvoyez-le sous 14 jours,
          nous vous remboursons.
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
    <div className="grid grid-cols-2 border-y border-border bg-card">
      {benefits.map((b, i) => (
        <div
          key={b.label}
          className={cn(
            "flex items-center gap-3 px-4 py-4",
            i % 2 === 0 && "border-r border-border",
            i < 2 && "border-b border-border"
          )}
        >
          <span className="text-xl">{b.emoji}</span>
          <span className="text-sm font-semibold text-foreground">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

export function ProductQuoteBlock({ quote }: { quote: string }) {
  return (
    <div className="relative bg-cream px-6 py-10">
      <span className="absolute left-4 top-4 font-serif text-6xl leading-none text-foreground/10">
        &ldquo;
      </span>
      <p className="relative text-center text-base font-bold leading-relaxed text-foreground sm:text-lg">
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
    <section className="bg-card px-4 py-8">
      <h2 className="text-lg font-bold text-foreground">La différence CBD</h2>
      <div className="mt-4 divide-y divide-border border-y border-border">
        {items.map((item) => (
          <div key={item.num} className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-foreground/40">{item.num}</span>
              <span className="text-sm font-medium text-foreground">{item.title}</span>
            </div>
            <span className="text-xl text-foreground/30">+</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProductUsageSection({ steps }: { steps: string[] }) {
  return (
    <section id="usage" className="scroll-mt-20 bg-card px-4 py-8">
      <h2 className="text-lg font-bold text-foreground">Comment l&apos;utiliser ?</h2>
      <ol className="mt-6 space-y-4">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-foreground text-sm font-bold">
              {i + 1}
            </span>
            <p className="pt-1 text-sm leading-relaxed text-foreground/80">{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
