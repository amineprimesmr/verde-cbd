"use client";

import { HeroBanner } from "@/components/home/hero-banner";
import { ProductCard } from "@/components/shop/product-card";
import {
  ArrowRight,
  Leaf,
  Shield,
  Truck,
  FlaskConical,
  Star,
  Quote,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  ProductCarousel,
  ProductCarouselItem,
} from "@/components/shop/product-carousel";
import { TrustBar } from "@/components/layout/trust-bar";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/motion";
import type { Product } from "@/types";
import type { ProductCategory } from "@/types";

const CATEGORY_IMAGES: Record<ProductCategory, string> = {
  fleurs: "/images/Amnesia1.png",
  resines: "/images/pollen-premium-1.png",
  vapes: "/images/huile1.png",
  accessoires: "https://images.unsplash.com/photo-1603906835853-f61e1b4d2f48?w=600&q=80",
};

const TESTIMONIALS = [
  {
    name: "Sophie M.",
    text: "Les pre-rolls en tube sont parfaits — prêts à l'emploi, arômes authentiques et conservation impeccable.",
    rating: 5,
  },
  {
    name: "Thomas L.",
    text: "Enfin une boutique CBD sérieuse. La gamme Omega H4CBD est vraiment puissante, service client au top.",
    rating: 5,
  },
  {
    name: "Marie D.",
    text: "Pod rechargeable + recharges classiques, mon combo quotidien. Qualité premium, je recommande Verde CBD.",
    rating: 5,
  },
];

interface HomeContentProps {
  featuredProducts: Product[];
  categories: { id: ProductCategory; name: string; description: string }[];
}

export function HomeContent({ featuredProducts, categories }: HomeContentProps) {
  return (
    <>
      <HeroBanner />

      <TrustBar />

      {/* Benefits */}
      <section className="section-padding mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center">
          <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Qualité premium, transparence à chaque étape
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Des produits sélectionnés avec exigence, analysés en laboratoire
            indépendant et conformes à la législation française — pour acheter
            en toute confiance.
          </p>
        </FadeIn>

        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Shield, title: "Certifié & légal", desc: "THC inférieur à 0,3 %, conforme à la réglementation française" },
            { icon: FlaskConical, title: "Analyses laboratoire", desc: "Certificats COA accessibles pour chaque référence" },
            { icon: Truck, title: "Livraison rapide", desc: "Expédition sous 24 h, livraison offerte dès 80 €" },
            { icon: Leaf, title: "Sélection premium", desc: "Pre-rolls, résines et vapes triés sur qualité et traçabilité" },
          ].map(({ icon: Icon, title, desc }) => (
            <StaggerItem key={title}>
              <div className="group h-full rounded-2xl border border-border bg-white p-6 text-center transition-all duration-300 hover:border-primary/20 hover:shadow-lg">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Categories */}
      <section className="bg-warm section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">
                Explorer
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-foreground">
                Nos catégories
              </h2>
            </div>
            <Link
              href="/boutique"
              className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
            >
              Tout voir <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeIn>

          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <StaggerItem key={cat.id}>
                <Link
                  href={`/boutique?category=${cat.id}`}
                  className="group relative flex h-48 overflow-hidden rounded-2xl"
                >
                  <Image
                    src={CATEGORY_IMAGES[cat.id]}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <h3 className="font-display text-xl font-semibold">{cat.name}</h3>
                    <p className="mt-1 text-sm text-white/70">{cat.description}</p>
                    <span className="mt-3 inline-flex items-center text-sm font-medium opacity-0 transition-all duration-300 group-hover:opacity-100">
                      Découvrir <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Best sellers */}
      <section className="section-padding mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              Best-sellers
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-foreground">
              Les favoris de nos clients
            </h2>
          </div>
          <Link
            href="/boutique"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
          >
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeIn>

        <div className="mt-10">
          <ProductCarousel>
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCarouselItem key={product.id}>
                <ProductCard product={product} />
              </ProductCarouselItem>
            ))}
          </ProductCarousel>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-cream section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              Avis clients
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-foreground">
              Ils nous font confiance
            </h2>
          </FadeIn>

          <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map(({ name, text, rating }) => (
              <StaggerItem key={name}>
                <div className="relative h-full rounded-2xl border border-border bg-white p-6">
                  <Quote className="absolute right-4 top-4 h-8 w-8 text-accent-soft" />
                  <div className="flex gap-0.5">
                    {[...Array(rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{text}&rdquo;
                  </p>
                  <p className="mt-4 text-sm font-semibold text-foreground">{name}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
