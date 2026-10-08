"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/shop/product-card";
import { ProductGallery } from "@/components/shop/product/product-gallery";
import { ProductAccordion } from "@/components/shop/product/product-accordion";
import {
  ProductPackSelector,
  type PackOption,
} from "@/components/shop/product/product-pack-selector";
import {
  ProductStickyCart,
  ProductGuaranteeBanner,
  ProductBenefitsGrid,
  ProductDifferenceSection,
  ProductUsageSection,
} from "@/components/shop/product/product-sections";
import { useCartStore } from "@/store/cart-store";
import { FrequentlyBoughtTogether } from "@/components/shop/upsell/frequently-bought-together";
import { useCatalog } from "@/components/shop/upsell/use-catalog";
import { CATEGORY_LABELS, type Product } from "@/types";
import {
  getProductBenefits,
  getProductFaqs,
  getPackOptions,
  getAccordionSections,
  getBrutalistAccordions,
  getDifferenceItems,
  getUsageSteps,
} from "@/lib/data/product-page-content";

const HEALTH_CLAIM = /relax|stress|anxi|sommeil|dorm|douleur|apais|études|étude|scientifique/i;

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
  variants?: Product[];
}

export function ProductDetail({ product, relatedProducts, variants = [] }: ProductDetailProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const catalog = useCatalog();

  // « Vous aimerez aussi » : même catégorie d'abord, complété par le catalogue.
  const alsoLike = useMemo(() => {
    const seen = new Set<string>([product.id]);
    const pool = [
      ...relatedProducts,
      ...catalog.filter((p) => p.category === product.category),
      ...catalog.filter((p) => p.is_featured),
    ];
    const out: Product[] = [];
    for (const p of pool) {
      if (seen.has(p.id) || !p.is_active || p.stock <= 0) continue;
      seen.add(p.id);
      out.push(p);
      if (out.length === 4) break;
    }
    return out;
  }, [relatedProducts, catalog, product.id, product.category]);

  const packs = useMemo(
    () => getPackOptions(product.price_cents, product.compare_at_price_cents),
    [product.price_cents, product.compare_at_price_cents]
  );

  const [selectedPack, setSelectedPack] = useState<PackOption>(packs[0]);

  const images = useMemo(
    () => (product.images.length > 0 ? product.images : [product.image_url]).slice(0, 4),
    [product.images, product.image_url]
  );

  // Pas d'allégation santé (relaxation, stress, sommeil, études) sur la fiche.
  const benefits = getProductBenefits(product.category, product.tags.includes("fleur")).filter(
    (b) => !HEALTH_CLAIM.test(b.label)
  );
  const faqs = getProductFaqs(product.category, product.tags.includes("fleur"));
  const accordionItems = getAccordionSections(product);
  const brutalistItems = getBrutalistAccordions(product).filter(
    (item) => !["studies", "references"].includes(item.id) && !HEALTH_CLAIM.test(item.content)
  );
  const differenceItems = getDifferenceItems();
  const usageSteps = getUsageSteps(product.category, product.tags.includes("fleur"));

  const displayPrice = selectedPack.priceCents;
  const displayCompare = selectedPack.compareCents;

  function handleAddToCart() {
    if (product.stock === 0) return;
    addItem(product, selectedPack.quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="bg-background pb-28 lg:pb-8">
      <nav className="mx-auto hidden max-w-7xl px-4 py-4 text-xs text-foreground/50 lg:block lg:px-8">
        <Link href="/" className="hover:text-foreground">Accueil</Link>
        <span className="mx-2">/</span>
        <Link href="/boutique" className="hover:text-foreground">Boutique</Link>
        <span className="mx-2">/</span>
        <Link
          href={`/boutique?category=${product.category}`}
          className="hover:text-foreground"
        >
          {CATEGORY_LABELS[product.category]}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div className="lg:sticky lg:top-20 lg:self-start">
          <ProductGallery images={images} productName={product.name} />
        </div>

        <div className="lg:py-4">
          <div className="px-4 pt-3 pb-4">
            <h1 className="font-display text-3xl leading-[1.1] text-foreground sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-foreground/70">
              {product.short_description}.
              {product.cbd_percent > 0 && ` CBD ${product.cbd_percent} %. THC : ${product.thc_percent} %.`}
              {product.coa_url && " Certificat d'analyse disponible."}
            </p>
          </div>

          {variants.length > 1 && (
            <div className="px-4 pb-5">
              <p className="mb-3 text-sm font-medium">Format du sachet</p>
              <div className="flex gap-2">
                {variants.map((variant) => <Link key={variant.id} href={`/produit/${variant.slug}`} aria-current={variant.id === product.id ? "page" : undefined} className={`rounded-full border px-5 py-3 text-sm ${variant.id === product.id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>{variant.weight_grams} g</Link>)}
              </div>
            </div>
          )}

          <ProductBenefitsGrid benefits={benefits} />

          <ProductPackSelector
            packs={packs}
            selectedId={selectedPack.id}
            onSelect={setSelectedPack}
          />

          <ProductStickyCart
            priceCents={displayPrice}
            compareCents={displayCompare > displayPrice ? displayCompare : null}
            onAdd={handleAddToCart}
            disabled={product.stock === 0}
            added={added}
          />

          <ProductGuaranteeBanner />

          {catalog.length > 0 && (
            <div className="px-4 lg:px-4">
              <FrequentlyBoughtTogether product={product} catalog={catalog} />
            </div>
          )}

          <div id="composition" className="scroll-mt-20">
            <ProductAccordion items={accordionItems} />
          </div>
        </div>
      </div>

      <ProductAccordion items={brutalistItems} variant="brutalist" />

      <ProductUsageSection steps={usageSteps} />
      <ProductDifferenceSection items={differenceItems} />

      <section id="faq" className="scroll-mt-20 bg-background px-4 pt-8">
        <h2 className="text-xl font-bold text-foreground">Questions fréquentes</h2>
        <ProductAccordion
          items={faqs.map((f, i) => ({
            id: `faq-${i}`,
            title: f.q,
            content: f.a,
          }))}
          variant="faq"
          className="mt-4"
        />
      </section>

      {alsoLike.length > 0 && (
        <section className="border-t border-border bg-cream px-4 py-12">
          <div className="mx-auto max-w-7xl lg:px-4">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-lg font-bold text-foreground sm:text-xl">Vous aimerez aussi</h2>
              <Link
                href={`/boutique?category=${product.category}`}
                className="text-sm text-foreground/60 underline underline-offset-2 hover:text-foreground"
              >
                Tout voir
              </Link>
            </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {alsoLike.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          </div>
        </section>
      )}
    </div>
  );
}
