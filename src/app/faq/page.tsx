import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description:
    "Légalité du CBD, analyses, paiement, livraison et retours : toutes les réponses aux questions fréquentes sur CBD.",
};

const FAQ_GROUPS = [
  {
    id: "cbd",
    title: "Le CBD",
    items: [
      {
        q: "Le CBD est-il légal en France ?",
        a: "Oui, le CBD est légal en France, à condition que le taux de THC total soit inférieur ou égal à 0,3 %. Tous nos produits respectent cette réglementation.",
      },
      {
        q: "Vos produits font-ils planer ?",
        a: "Non. Le CBD n'est pas psychoactif. Nos produits contiennent moins de 0,3 % de THC, un taux bien trop faible pour produire un effet psychotrope.",
      },
      {
        q: "Comment puis-je vérifier la qualité ?",
        a: "Chaque lot est analysé par un laboratoire indépendant. Les certificats d'analyse (COA) sont disponibles sur les fiches produits ou sur demande.",
      },
    ],
  },
  {
    id: "commande",
    title: "Commande et paiement",
    items: [
      {
        q: "Quels modes de paiement acceptez-vous ?",
        a: "Nous acceptons la carte bancaire et le virement via notre partenaire de paiement sécurisé Mollie.",
      },
      {
        q: "Puis-je retourner un produit ?",
        a: "Les produits descellés ne peuvent être retournés pour des raisons d'hygiène. Les produits non ouverts peuvent être retournés sous 14 jours.",
      },
    ],
  },
  {
    id: "livraison",
    title: "Livraison",
    items: [
      {
        q: "Livrez-vous partout en France ?",
        a: "Nous livrons en France métropolitaine uniquement. La livraison est offerte dès 80 € d'achat.",
      },
      {
        q: "Le colis est-il discret ?",
        a: "Oui. Tous nos colis sont expédiés dans un emballage neutre, sans mention du contenu visible de l'extérieur.",
      },
    ],
  },
];

export default function FAQPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_GROUPS.flatMap((g) =>
      g.items.map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: { "@type": "Answer", text: i.a },
      }))
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PageIntro eyebrow="Aide" title="Questions fréquentes">
        Tout ce qu&apos;il faut savoir sur le CBD, nos produits et votre commande.
      </PageIntro>

      <div className="container-x grid gap-12 pb-24 lg:grid-cols-12 lg:gap-16 lg:pb-32">
        <nav aria-label="Rubriques" className="lg:col-span-3">
          <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:sticky lg:top-28 lg:mx-0 lg:flex-col lg:gap-1 lg:px-0">
            {FAQ_GROUPS.map((g) => (
              <li key={g.id} className="shrink-0">
                <a
                  href={`#${g.id}`}
                  className="inline-flex h-10 items-center rounded-full border border-border px-4 text-[13px] text-foreground/75 hover:border-foreground/40 hover:text-foreground lg:h-auto lg:border-0 lg:px-0 lg:py-1.5 lg:text-sm"
                >
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-14 lg:col-span-9">
          {FAQ_GROUPS.map((g) => (
            <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`} className="scroll-mt-24">
              <h2 id={`${g.id}-title`} className="font-display text-2xl text-foreground sm:text-3xl">
                {g.title}
              </h2>
              <div className="mt-5 divide-y divide-border border-y border-border">
                {g.items.map(({ q, a }) => (
                  <details key={q} className="group">
                    <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-left text-[15px] font-medium text-foreground sm:text-base">
                      {q}
                      <Plus className="details-icon h-4 w-4 shrink-0 text-foreground/60" aria-hidden />
                    </summary>
                    <p className="-mt-1 max-w-3xl pb-6 pr-10 text-[15px] leading-relaxed text-muted-foreground">{a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}

          <div className="rounded-[4px] bg-cream p-8 sm:p-10">
            <p className="font-display text-2xl text-foreground">Une autre question&nbsp;?</p>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Notre équipe vous répond du lundi au vendredi, de 9&nbsp;h à 18&nbsp;h.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex h-12 items-center rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground hover:bg-primary-light"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
