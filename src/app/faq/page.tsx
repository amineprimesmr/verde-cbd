import Link from "next/link";
import { LegalLayout } from "@/components/layout/legal-layout";

export const metadata = { title: "FAQ" };

export default function FAQPage() {
  const faqs = [
    {
      q: "Le CBD est-il légal en France ?",
      a: "Oui, le CBD est légal en France depuis 2022, à condition que le taux de THC total soit inférieur ou égal à 0,3%. Tous nos produits respectent cette réglementation.",
    },
    {
      q: "Vos produits font-ils planer ?",
      a: "Non. Le CBD n'est pas psychoactif. Nos produits contiennent moins de 0,3% de THC, un taux bien trop faible pour produire un effet psychotrope.",
    },
    {
      q: "Comment puis-je vérifier la qualité ?",
      a: "Chaque lot est analysé par un laboratoire indépendant. Les certificats d'analyse (COA) sont disponibles sur les fiches produits ou sur demande.",
    },
    {
      q: "Quels modes de paiement acceptez-vous ?",
      a: "Nous acceptons le virement bancaire et la carte bancaire. Note : en production, un processeur de paiement compatible CBD est requis (Stripe n'accepte pas le CBD).",
    },
    {
      q: "Puis-je retourner un produit ?",
      a: "Les produits descellés ne peuvent être retournés pour des raisons d'hygiène. Les produits non ouverts peuvent être retournés sous 14 jours.",
    },
    {
      q: "Livrez-vous partout en France ?",
      a: "Oui, nous livrons en France métropolitaine uniquement. Livraison gratuite dès 80€ d'achat.",
    },
  ];

  return (
    <LegalLayout title="Questions fréquentes">
      <div className="space-y-6">
        {faqs.map(({ q, a }) => (
          <div key={q}>
            <h2 className="!mt-0 text-lg">{q}</h2>
            <p>{a}</p>
          </div>
        ))}
      </div>
      <p className="mt-8">
        Une autre question ?{" "}
        <Link href="/contact" className="text-emerald-700 underline">
          Contactez-nous
        </Link>
      </p>
    </LegalLayout>
  );
}
