import { LegalLayout } from "@/components/layout/legal-layout";

export const metadata = { title: "Conditions Générales de Vente" };

export default function CGVPage() {
  return (
    <LegalLayout title="Conditions Générales de Vente">
      <p>Dernière mise à jour : mai 2026</p>

      <h2>Article 1 — Objet</h2>
      <p>
        Les présentes Conditions Générales de Vente (CGV) régissent les relations
        contractuelles entre Verde CBD SAS et tout client souhaitant acheter des
        produits CBD via le site verde-cbd.fr.
      </p>

      <h2>Article 2 — Produits</h2>
      <p>
        Les produits proposés sont des produits à base de chanvre (CBD) conformes
        à la réglementation française. Le taux de THC de chaque produit est
        inférieur ou égal à 0,3%. Des certificats d&apos;analyse (COA) sont
        disponibles sur demande ou téléchargeables depuis les fiches produits.
      </p>

      <h2>Article 3 — Commande et paiement</h2>
      <p>
        Toute commande implique l&apos;acceptation des présentes CGV et la
        confirmation d&apos;être majeur (18 ans minimum). Le paiement peut s&apos;effectuer
        par virement bancaire ou carte bancaire. La commande n&apos;est validée qu&apos;après
        confirmation du paiement.
      </p>

      <h2>Article 4 — Livraison</h2>
      <p>
        Les commandes sont expédiées sous 24 à 48h ouvrées après confirmation du
        paiement. Les délais de livraison varient selon le mode choisi (Colissimo,
        Mondial Relay). La livraison est gratuite à partir de 80€ d&apos;achat.
        Verde CBD livre exclusivement en France métropolitaine.
      </p>

      <h2>Article 5 — Droit de rétractation</h2>
      <p>
        Conformément à l&apos;article L221-28 du Code de la consommation, le droit
        de rétractation ne s&apos;applique pas aux produits descellés après livraison
        et ne pouvant être renvoyés pour des raisons d&apos;hygiène ou de protection
        de la santé. Pour les produits non descellés, vous disposez de 14 jours
        pour exercer votre droit de rétractation.
      </p>

      <h2>Article 6 — Responsabilité</h2>
      <p>
        Verde CBD s&apos;engage à fournir des produits conformes à leur description.
        Le client est seul responsable de l&apos;usage qu&apos;il fait des produits
        achetés. Les produits CBD ne sont pas des médicaments.
      </p>

      <h2>Article 7 — Données personnelles</h2>
      <p>
        Les données collectées sont traitées conformément à notre{" "}
        <a href="/politique-confidentialite" className="text-emerald-700 underline">
          politique de confidentialité
        </a>
        .
      </p>

      <h2>Article 8 — Litiges</h2>
      <p>
        En cas de litige, une solution amiable sera recherchée. À défaut, les
        tribunaux de Paris seront compétents. Le client peut recourir à un
        médiateur de la consommation.
      </p>
    </LegalLayout>
  );
}
