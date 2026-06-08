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
  ProductRatingHeader,
  ProductReviewsCarousel,
  ProductReviewsBreakdown,
} from "@/components/shop/product/product-reviews";
import {
  ProductStickyCart,
  ProductGuaranteeBanner,
  ProductBenefitsGrid,
  ProductQuoteBlock,
  ProductDifferenceSection,
  ProductUsageSection,
} from "@/components/shop/product/product-sections";
import { useCartStore } from "@/store/cart-store";
import { CATEGORY_LABELS, type Product } from "@/types";
import {
  getProductBenefits,
  getProductFaqs,
  getPackOptions,
  getAccordionSections,
  getBrutalistAccordions,
  getDifferenceItems,
  getScientificQuote,
  getUsageSteps,
} from "@/lib/data/product-page-content";

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const packs = useMemo(
    () => getPackOptions(product.price_cents, product.compare_at_price_cents),
    [product.price_cents, product.compare_at_price_cents]
  );

  const [selectedPack, setSelectedPack] = useState<PackOption>(packs[0]);

  const images = useMemo(() => {
    const base = product.images.length > 0 ? product.images : [product.image_url];
    const amnesiaFirst = "/images/Amnesia1.png";

    if (product.category === "fleurs") {
      const rest = base.filter((img) => img !== amnesiaFirst);
      return [amnesiaFirst, ...rest].slice(0, 4);
    }

    return base.slice(0, 4);
  }, [product]);

  const benefits = getProductBenefits(product.category);
  const faqs = getProductFaqs(product.category);
  const accordionItems = getAccordionSections(product);
  const brutalistItems = getBrutalistAccordions(product);
  const differenceItems = getDifferenceItems();
  const usageSteps = getUsageSteps(product.category);
  const quote = getScientificQuote(product.category);

  const displayPrice = selectedPack.priceCents;
  const displayCompare = selectedPack.compareCents;

  function handleAddToCart() {
    if (product.stock === 0) return;
    addItem(product, selectedPack.quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="bg-white pb-28 lg:pb-8">
      <nav className="mx-auto hidden max-w-7xl px-4 py-4 text-xs text-black/50 lg:block lg:px-8">
        <Link href="/" className="hover:text-black">Accueil</Link>
        <span className="mx-2">/</span>
        <Link href="/boutique" className="hover:text-black">Boutique</Link>
        <span className="mx-2">/</span>
        <Link
          href={`/boutique?category=${product.category}`}
          className="hover:text-black"
        >
          {CATEGORY_LABELS[product.category]}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-black">{product.name}</span>
      </nav>

      <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div className="lg:sticky lg:top-20 lg:self-start">
          <ProductGallery images={images} productName={product.name} />
        </div>

        <div className="lg:py-4">
          <ProductRatingHeader />

          <div className="px-4 pt-3 pb-4">
            <h1 className="text-2xl font-bold leading-tight text-black sm:text-3xl">
              {product.name}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-black/70">
              {product.short_description}. CBD {product.cbd_percent}%, THC &lt;{" "}
              {product.thc_percent}%.
              {product.coa_url && " Certificat d'analyse disponible."}
            </p>
          </div>

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

          <div id="composition" className="scroll-mt-20">
            <ProductAccordion items={accordionItems} />
          </div>
        </div>
      </div>

      <ProductQuoteBlock quote={quote} />

      <div className="bg-[#fff8e1] px-4 py-3 text-center text-xs text-black/60">
        Études cliniques sur le cannabidiol (CBD) — PubMed, 2024
      </div>

      <ProductReviewsCarousel />

      <ProductAccordion items={brutalistItems} variant="brutalist" />

      <ProductUsageSection steps={usageSteps} />
      <ProductDifferenceSection items={differenceItems} />

      <section id="faq" className="scroll-mt-20 bg-white px-4 pt-8">
        <h2 className="text-xl font-bold text-black">Questions fréquentes</h2>
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

      <ProductReviewsBreakdown />

      {relatedProducts.length > 0 && (
        <section className="border-t border-[#eee] bg-[#fafafa] px-4 py-12">
          <h2 className="text-lg font-bold text-black">Produits similaires</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
