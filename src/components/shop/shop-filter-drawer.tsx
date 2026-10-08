"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SORT_OPTIONS, buildShopHref, type ShopQuery } from "@/components/shop/shop-query";
import type { ProductCategory, VapeSubcategory } from "@/types";

interface ShopFilterDrawerProps {
  categories: { id: ProductCategory; name: string }[];
  vapeSubcategories?: { id: VapeSubcategory; name: string }[];
  current: ShopQuery;
}

const ease = [0.16, 1, 0.3, 1] as const;

function OptionButton({
  active,
  onClick,
  children,
  indent,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  indent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex w-full items-center justify-between py-3 text-left text-[15px]",
        indent && "pl-4",
        active ? "font-medium text-foreground" : "text-foreground/70"
      )}
    >
      {children}
      {active && <Check className="h-4 w-4 text-primary" aria-hidden />}
    </button>
  );
}

export function ShopFilterDrawer({
  categories,
  vapeSubcategories = [],
  current,
}: ShopFilterDrawerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ShopQuery>(current);
  const searchId = useId();
  const titleId = useId();


  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function apply() {
    router.push(buildShopHref(draft), { scroll: false });
    setOpen(false);
  }

  const activeCount =
    (current.category ? 1 : 0) + (current.subcategory ? 1 : 0) + (current.q ? 1 : 0) + (current.sort ? 1 : 0);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[max(1.25rem,env(safe-area-inset-bottom))] lg:hidden">
        <button
          type="button"
          onClick={() => { setDraft(current); setOpen(true); }}
          aria-haspopup="dialog"
          className="pointer-events-auto inline-flex h-12 items-center gap-2.5 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[0_12px_32px_rgb(31_35_30/0.25)] active:scale-[0.98]"
        >
          <SlidersHorizontal className="h-4 w-4 stroke-[1.75]" aria-hidden />
          Filtrer et trier
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-foreground px-1 text-[11px] font-semibold text-primary">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[90] bg-ink/40 lg:hidden"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              key="sheet"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.45, ease }}
              className="fixed inset-x-0 bottom-0 z-[95] flex max-h-[88svh] flex-col rounded-t-2xl bg-background lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h2 id={titleId} className="font-display text-xl text-foreground">
                  Filtrer et trier
                </h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-foreground/[0.06]"
                  aria-label="Fermer"
                >
                  <X className="h-5 w-5 stroke-[1.5]" />
                </button>
              </div>

              <div className="flex-1 space-y-8 overflow-y-auto overscroll-contain px-5 py-6">
                <div>
                  <label htmlFor={searchId} className="eyebrow">
                    Recherche
                  </label>
                  <input
                    id={searchId}
                    type="search"
                    value={draft.q ?? ""}
                    onChange={(e) => setDraft((d) => ({ ...d, q: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && apply()}
                    placeholder="Rechercher un produit…"
                    enterKeyHint="search"
                    className="mt-3 h-11 w-full border-b border-foreground/20 bg-transparent text-[15px] text-foreground outline-none placeholder:text-foreground/40 focus:border-foreground focus-visible:outline-none"
                  />
                </div>

                <fieldset>
                  <legend className="eyebrow">Catégorie</legend>
                  <div className="mt-2 divide-y divide-border">
                    <OptionButton
                      active={!draft.category}
                      onClick={() => setDraft((d) => ({ ...d, category: null, subcategory: null }))}
                    >
                      Tous les produits
                    </OptionButton>
                    {categories.map((cat) => (
                      <div key={cat.id}>
                        <OptionButton
                          active={draft.category === cat.id && !draft.subcategory}
                          onClick={() => setDraft((d) => ({ ...d, category: cat.id, subcategory: null }))}
                        >
                          {cat.name}
                        </OptionButton>
                        {cat.id === "vapes" &&
                          draft.category === "vapes" &&
                          vapeSubcategories.map((sub) => (
                            <OptionButton
                              key={sub.id}
                              indent
                              active={draft.subcategory === sub.id}
                              onClick={() => setDraft((d) => ({ ...d, subcategory: sub.id }))}
                            >
                              {sub.name}
                            </OptionButton>
                          ))}
                      </div>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="eyebrow">Trier par</legend>
                  <div className="mt-2 divide-y divide-border">
                    {SORT_OPTIONS.map((o) => (
                      <OptionButton
                        key={o.value}
                        active={(draft.sort ?? "") === o.value}
                        onClick={() => setDraft((d) => ({ ...d, sort: o.value || null }))}
                      >
                        {o.label}
                      </OptionButton>
                    ))}
                  </div>
                </fieldset>
              </div>

              <div className="flex items-center gap-3 border-t border-border px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
                {activeCount > 0 && (
                  <Link
                    href="/boutique"
                    scroll={false}
                    onClick={() => setOpen(false)}
                    className="inline-flex h-12 items-center px-2 text-sm text-foreground/70 underline underline-offset-4"
                  >
                    Réinitialiser
                  </Link>
                )}
                <button
                  type="button"
                  onClick={apply}
                  className="h-12 flex-1 rounded-full bg-primary text-sm font-medium text-primary-foreground hover:bg-primary-light"
                >
                  Voir les résultats
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
