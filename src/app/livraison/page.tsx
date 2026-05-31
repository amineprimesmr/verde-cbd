import { LegalLayout } from "@/components/layout/legal-layout";

export const metadata = { title: "Livraison" };

export default function LivraisonPage() {
  return (
    <LegalLayout title="Livraison">
      <h2>Modes de livraison</h2>
      <ul>
        <li><strong>Colissimo Standard</strong> — 5,90€ — 3 à 5 jours ouvrés</li>
        <li><strong>Colissimo Express</strong> — 9,90€ — 24 à 48h</li>
        <li><strong>Point Relais Mondial Relay</strong> — 3,90€ — 3 à 5 jours</li>
        <li><strong>Livraison gratuite</strong> — Offerte dès 80€ d&apos;achat</li>
      </ul>

      <h2>Zone de livraison</h2>
      <p>
        Nous livrons exclusivement en France métropolitaine. Les DOM-TOM et
        l&apos;international ne sont pas desservis pour le moment.
      </p>

      <h2>Délai d&apos;expédition</h2>
      <p>
        Toutes les commandes payées avant 14h sont expédiées le jour même
        (jours ouvrés). Vous recevrez un email de confirmation avec le numéro
        de suivi dès l&apos;expédition.
      </p>

      <h2>Emballage discret</h2>
      <p>
        Tous nos colis sont expédiés dans un emballage neutre, sans mention
        du contenu CBD visible de l&apos;extérieur.
      </p>
    </LegalLayout>
  );
}
