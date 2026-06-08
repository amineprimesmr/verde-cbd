import { LegalLayout } from "@/components/layout/legal-layout";

export const metadata = { title: "À propos" };

export default function AProposPage() {
  return (
    <LegalLayout title="À propos de Verde CBD">
      <p>
        Verde CBD est née d&apos;une passion pour le chanvre et d&apos;un engagement
        envers la qualité. Fondée en 2024 à Paris, notre mission est de rendre
        le CBD accessible, transparent et premium.
      </p>

      <h2>Notre engagement qualité</h2>
      <p>
        Chaque produit de notre catalogue est sélectionné avec rigueur. Nous
        travaillons directement avec des producteurs certifiés en Europe
        (Suisse, Italie, France) et exigeons un certificat d&apos;analyse (COA)
        pour chaque lot.
      </p>

      <h2>Conformité légale</h2>
      <p>
        Tous nos produits respectent la réglementation française : THC total
        inférieur à 0,3%, variétés de chanvre autorisées, traçabilité complète.
        Notre gamme Omega propose du H4CBD, un dérivé hydrogéné du CBD à effet
        plus marqué, dans le strict respect de la législation en vigueur. Nous
        ne commercialisons aucun cannabinoïde interdit (HHC, THCP, etc.).
      </p>

      <h2>Notre équipe</h2>
      <p>
        Une équipe passionnée basée à Paris, disponible pour répondre à vos
        questions du lundi au vendredi, 9h-18h.
      </p>
    </LegalLayout>
  );
}
