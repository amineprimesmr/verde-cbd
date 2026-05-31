import { LegalLayout } from "@/components/layout/legal-layout";

export const metadata = { title: "Mentions légales" };

export default function MentionsLegalesPage() {
  return (
    <LegalLayout title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        Verde CBD SAS<br />
        Capital social : 10 000 €<br />
        SIRET : 123 456 789 00012<br />
        RCS Paris B 123 456 789<br />
        Siège social : 12 rue du Chanvre, 75011 Paris<br />
        Email : contact@verde-cbd.fr<br />
        Directeur de la publication : Amine Verde
      </p>

      <h2>Hébergement</h2>
      <p>
        Vercel Inc.<br />
        440 N Barranca Ave #4133, Covina, CA 91723, États-Unis<br />
        Site : vercel.com
      </p>

      <h2>Produits vendus</h2>
      <p>
        Verde CBD commercialise des produits à base de chanvre (CBD) conformes à la
        législation française en vigueur. Tous nos produits finis contiennent un
        taux de THC total inférieur ou égal à 0,3%. Les produits sont réservés
        aux personnes majeures (18 ans et plus).
      </p>

      <h2>Avertissement</h2>
      <p>
        Le CBD n&apos;est pas un médicament et ne peut se substituer à un traitement
        médical. En cas de doute, consultez un professionnel de santé. Verde CBD
        décline toute responsabilité en cas d&apos;usage non conforme de ses produits.
      </p>
    </LegalLayout>
  );
}
