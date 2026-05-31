import { LegalLayout } from "@/components/layout/legal-layout";

export const metadata = { title: "Politique de cookies" };

export default function CookiesPage() {
  return (
    <LegalLayout title="Politique de cookies">
      <p>
        Le site Verde CBD utilise des cookies pour assurer son bon fonctionnement
        et améliorer votre expérience.
      </p>

      <h2>Cookies essentiels</h2>
      <p>
        Nécessaires au fonctionnement du site : session utilisateur, panier,
        vérification d&apos;âge. Ces cookies ne peucessent pas d&apos;être désactivés.
      </p>

      <h2>Cookies analytiques</h2>
      <p>
        Nous pouvons utiliser des cookies analytiques pour comprendre comment
        le site est utilisé. Vous pouvez les refuser via notre bandeau de
        consentement.
      </p>

      <h2>Gestion des cookies</h2>
      <p>
        Vous pouvez configurer votre navigateur pour refuser les cookies.
        Cela peut affecter certaines fonctionnalités du site (panier, compte).
      </p>
    </LegalLayout>
  );
}
