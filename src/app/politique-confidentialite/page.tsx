import { LegalLayout } from "@/components/layout/legal-layout";

export const metadata = { title: "Politique de confidentialité" };

export default function ConfidentialitePage() {
  return (
    <LegalLayout title="Politique de confidentialité">
      <h2>Collecte des données</h2>
      <p>
        Verde CBD collecte les données nécessaires au traitement de vos commandes :
        nom, prénom, adresse email, adresse postale, numéro de téléphone. Ces
        données sont collectées lors de la création de compte et/ou du passage
        de commande.
      </p>

      <h2>Finalités du traitement</h2>
      <ul>
        <li>Traitement et suivi des commandes</li>
        <li>Gestion de la relation client</li>
        <li>Envoi d&apos;informations commerciales (avec votre consentement)</li>
        <li>Respect des obligations légales</li>
      </ul>

      <h2>Conservation</h2>
      <p>
        Vos données sont conservées pendant la durée de la relation commerciale
        et 3 ans après la dernière commande, conformément aux obligations légales
        comptables et fiscales.
      </p>

      <h2>Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification,
        de suppression, de limitation et de portabilité de vos données. Contact :
        contact@verde-cbd.fr
      </p>
    </LegalLayout>
  );
}
