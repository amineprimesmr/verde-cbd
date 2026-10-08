import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/layout/page-intro";
import { TrustBar } from "@/components/layout/trust-bar";

export const metadata: Metadata = {
  title: "Notre histoire",
  description:
    "CBD sélectionne du CBD premium auprès de producteurs européens, analysé en laboratoire indépendant et conforme à la loi française.",
};

const PILLARS = [
  {
    n: "01",
    title: "Sélection",
    text: "Nous préparons une sélection de variétés classiques. Les producteurs et les informations de chaque lot seront renseignés avant la commercialisation.",
  },
  {
    n: "02",
    title: "Analyse",
    text: "Nous exigeons un certificat d'analyse (COA) d'un laboratoire indépendant pour chaque lot : taux de cannabinoïdes, pesticides, métaux lourds.",
  },
  {
    n: "03",
    title: "Conformité",
    text: "THC total inférieur à 0,3 %, variétés autorisées, traçabilité complète. Notre gamme Omega propose du H4CBD dans le strict respect de la réglementation en vigueur. Aucun cannabinoïde interdit (HHC, THCP…).",
  },
];

export default function AProposPage() {
  return (
    <>
      <PageIntro
        eyebrow="Notre histoire"
        title={
          <>
            Le chanvre, <em className="italic">sans artifice.</em>
          </>
        }
      >
        Cette boutique CBD est un projet en préparation pour Sylvain, autour du chanvre et
        d&apos;une exigence simple&nbsp;: rendre le CBD accessible, transparent et
        premium.
      </PageIntro>

      <div className="container-x">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-sand sm:aspect-[16/9]">
          <Image
            src="/images/lifestyle/about.jpg"
            alt="Plants de chanvre cultivés en lumière naturelle"
            fill
            preload
            sizes="(max-width: 1408px) 100vw, 1328px"
            className="object-cover"
          />
        </div>
      </div>

      <section aria-labelledby="pillars-title" className="section-padding">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Notre engagement</p>
            <h2 id="pillars-title" className="mt-3 font-display text-3xl leading-tight text-foreground sm:text-[2.75rem]">
              Trois principes, aucun compromis.
            </h2>
          </div>
          <ol className="divide-y divide-border border-y border-border lg:col-span-8">
            {PILLARS.map((p) => (
              <li key={p.n} className="grid gap-3 py-8 sm:grid-cols-[5rem_1fr] sm:gap-6">
                <span className="font-display text-lg text-accent">{p.n}</span>
                <div>
                  <h3 className="font-display text-2xl text-foreground">{p.title}</h3>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="lab-title" className="bg-cream">
        <div className="container-x grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[4px] bg-sand lg:order-2">
            <Image
              src="/images/lifestyle/lab.jpg"
              alt="Analyse d'un échantillon de chanvre en laboratoire"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">Transparence</p>
            <h2 id="lab-title" className="mt-3 font-display text-3xl leading-tight text-foreground sm:text-[2.75rem]">
              Des résultats consultables, pas des promesses.
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              Les certificats d&apos;analyse seront ajoutés aux fiches produits après réception des documents fournisseurs
              ou sur simple demande. Une question sur un lot&nbsp;? Notre équipe, basée à
              Paris, répond du lundi au vendredi, de 9&nbsp;h à 18&nbsp;h.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/boutique"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground hover:bg-primary-light"
              >
                Découvrir la boutique
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-full border border-foreground/20 px-7 text-sm font-medium text-foreground hover:border-foreground"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TrustBar className="border-t-0" />
    </>
  );
}
