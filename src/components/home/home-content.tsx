"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Plus } from "lucide-react";
import { HeroBanner } from "@/components/home/hero-banner";
import { ProductCard } from "@/components/shop/product-card";
import { ProductCarousel, ProductCarouselItem } from "@/components/shop/product-carousel";
import { TrustBar } from "@/components/layout/trust-bar";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/motion";
import type { Product, ProductCategory } from "@/types";

const CATEGORY_IMAGES: Record<ProductCategory, string> = {
  fleurs: "/images/categories/fleurs.jpg",
  resines: "/images/categories/resines.jpg",
  vapes: "/images/categories/vapes.jpg",
  accessoires: "/images/categories/accessoires.jpg",
};

const HOME_FAQ = [
  {
    q: "Le CBD est-il légal en France ?",
    a: "Oui. Les produits à base de CBD sont autorisés en France dès lors que leur taux de THC total est inférieur ou égal à 0,3 %. Tous nos produits respectent ce seuil et sont accompagnés d'une analyse de laboratoire.",
  },
  {
    q: "Le CBD fait-il planer ?",
    a: "Non. Le CBD n'est pas psychotrope. La teneur en THC de nos produits est bien trop faible pour produire un effet planant.",
  },
  {
    q: "Sous quel délai vais-je recevoir ma commande ?",
    a: "Les commandes payées avant 14 h sont expédiées le jour même (jours ouvrés). Comptez 24 à 48 h en Colissimo Express, 3 à 5 jours ouvrés en standard ou en point relais — toujours dans un colis neutre.",
  },
  {
    q: "Où trouver les analyses de laboratoire ?",
    a: "Les certificats de lot sont affichés sur les fiches lorsqu’ils ont été fournis. Cette version de démonstration ne contient pas de certificats fournisseurs.",
  },
];

interface HomeContentProps {
  bestSellers: Product[];
  newArrivals: Product[];
  categories: { id: ProductCategory; name: string; description: string }[];
}

function SectionHeading({
  eyebrow,
  title,
  id,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  id: string;
  children?: React.ReactNode;
}) {
  return (
    <FadeIn className="max-w-2xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="mt-3 font-display text-[2rem] leading-[1.1] text-foreground sm:text-[2.75rem]">
        {title}
      </h2>
      {children && <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{children}</p>}
    </FadeIn>
  );
}

export function HomeContent({ bestSellers, newArrivals, categories }: HomeContentProps) {
  return (
    <>
      <HeroBanner />

      <TrustBar />

      {/* Best-sellers */}
      {bestSellers.length > 0 && (
        <section aria-labelledby="best-sellers-title" className="section-padding">
          <div className="container-x">
            <SectionHeading eyebrow="Best-sellers" title="Les incontournables" id="best-sellers-title">
              Nos références les plus choisies, pour une première découverte en toute confiance.
            </SectionHeading>
            <div className="mt-10 lg:mt-14">
              <ProductCarousel>
                {bestSellers.map((product, i) => (
                  <ProductCarouselItem key={product.id}>
                    <ProductCard
                      product={product}
                      priority={i < 2}
                      sizes="(max-width: 640px) 62vw, (max-width: 1024px) 42vw, 25vw"
                    />
                  </ProductCarouselItem>
                ))}
              </ProductCarousel>
            </div>
            <div className="mt-10 flex justify-center">
              <Link
                href="/boutique"
                className="group inline-flex h-12 items-center gap-2 rounded-full border border-foreground/20 px-7 text-sm font-medium text-foreground hover:border-foreground"
              >
                Voir toute la boutique
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Catégories */}
      <section aria-labelledby="categories-title" className="section-padding bg-cream">
        <div className="container-x">
          <SectionHeading eyebrow="Explorer" title="Par univers" id="categories-title" />
          <Stagger className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:mt-14 lg:grid-cols-4">
            {categories.map((cat) => (
              <StaggerItem key={cat.id}>
                <Link href={`/boutique?category=${cat.id}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-sand">
                    <Image
                      src={CATEGORY_IMAGES[cat.id]}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl leading-tight text-foreground sm:text-2xl">{cat.name}</h3>
                      <p className="mt-1 hidden text-[13px] leading-relaxed text-muted-foreground sm:block">
                        {cat.description}
                      </p>
                    </div>
                    <ArrowRight
                      className="mt-1.5 h-4 w-4 shrink-0 text-foreground/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground"
                      aria-hidden
                    />
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Engagement / histoire */}
      <section aria-labelledby="engagement-title" className="section-padding">
        <div className="container-x grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <FadeIn className="lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-sand lg:aspect-[16/11]">
              <Image
                src="/images/lifestyle/about.jpg"
                alt="Plants de chanvre cultivés en lumière naturelle"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Notre engagement"
              id="engagement-title"
              title={
                <>
                  Moins de promesses,
                  <br />
                  <em className="italic">plus de transparence.</em>
                </>
              }
            />
            <FadeIn delay={0.1}>
              <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
                CBD est le projet de boutique de Sylvain. Notre objectif : une
                sélection lisible, des formats faciles à comparer et des informations
                de lot accessibles. Cette première collection illustre la gamme
                envisagée avant la sélection définitive des fournisseurs.
              </p>
              <dl className="mt-8 grid grid-cols-1 gap-6 border-t border-border pt-8 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {[
                  { t: "Origine", d: "Chanvre cultivé en Europe, variétés autorisées." },
                  { t: "Analyses", d: "Documents fournisseurs avant commercialisation." },
                  { t: "Conformité", d: "THC total inférieur à 0,3 %, sans cannabinoïde interdit." },
                ].map(({ t, d }) => (
                  <div key={t}>
                    <dt className="font-display text-lg text-foreground">{t}</dt>
                    <dd className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{d}</dd>
                  </div>
                ))}
              </dl>
              <Link
                href="/a-propos"
                className="link-underline mt-8 inline-flex items-center gap-2 pb-0.5 text-sm font-medium text-foreground"
              >
                Lire notre histoire
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Laboratoire — bandeau grand format */}
      <section aria-labelledby="lab-title" className="relative isolate overflow-hidden bg-primary">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/lifestyle/lab.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/30" aria-hidden />
        </div>
        <div className="container-x py-20 sm:py-28 lg:py-36">
          <FadeIn className="max-w-xl text-primary-foreground">
            <p className="text-[11px] uppercase tracking-[0.18em] text-primary-foreground/75">Traçabilité</p>
            <h2 id="lab-title" className="mt-3 font-display text-[2rem] leading-[1.1] sm:text-[2.75rem]">
              La transparence commence par les informations du lot.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-primary-foreground/80">
              Taux de CBD, de THC, absence de pesticides et de métaux lourds&nbsp;:
              les certificats d&apos;analyse seront publiés une fois les fournisseurs sélectionnés.
            </p>
            <Link
              href="/boutique"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary-foreground px-7 text-sm font-medium text-foreground hover:bg-white"
            >
              Parcourir les produits
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Nouveautés */}
      {newArrivals.length > 0 && (
        <section aria-labelledby="new-title" className="section-padding">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="Nouveautés" title="Fraîchement arrivés" id="new-title" />
              <Link
                href="/boutique?sort=newest"
                className="link-underline inline-flex items-center gap-2 pb-0.5 text-sm font-medium text-foreground"
              >
                Toutes les nouveautés
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <Stagger className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:mt-14 lg:grid-cols-4">
              {newArrivals.map((product) => (
                <StaggerItem key={product.id}>
                  <ProductCard product={product} sizes="(max-width: 1024px) 50vw, 25vw" />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Mini-FAQ */}
      <section aria-labelledby="faq-title" className="section-padding border-t border-border">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Questions fréquentes" title="Bon à savoir" id="faq-title" />
            <FadeIn delay={0.1}>
              <Link
                href="/faq"
                className="link-underline mt-6 inline-flex items-center gap-2 pb-0.5 text-sm font-medium text-foreground"
              >
                Toutes les questions
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </FadeIn>
          </div>
          <div className="divide-y divide-border border-y border-border lg:col-span-8">
            {HOME_FAQ.map(({ q, a }) => (
              <details key={q} className="group">
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-left text-[15px] font-medium text-foreground sm:text-base">
                  {q}
                  <Plus className="details-icon h-4 w-4 shrink-0 text-foreground/60" aria-hidden />
                </summary>
                <p className="-mt-1 pb-6 pr-10 text-[14px] leading-relaxed text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section aria-labelledby="newsletter-title" className="bg-sand">
        <div className="container-x grid gap-8 py-16 sm:py-20 lg:grid-cols-2 lg:items-end lg:gap-16 lg:py-24">
          <FadeIn>
            <p className="eyebrow">Lettre CBD</p>
            <h2 id="newsletter-title" className="mt-3 font-display text-[2rem] leading-[1.1] text-foreground sm:text-[2.75rem]">
              Nouveautés et offres, sans excès.
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Nouveautés, conseils d&apos;usage et offres réservées aux abonnés. Désinscription en un clic.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <NewsletterForm className="max-w-md lg:ml-auto lg:w-full" />
          </FadeIn>
        </div>
      </section>
    </>
  );
}
