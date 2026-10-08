import Link from "next/link";
import { Mail, AtSign } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { NewsletterForm } from "@/components/layout/newsletter-form";

const COLUMNS = [
  {
    title: "Boutique",
    links: [
      { href: "/boutique?category=fleurs", label: "Pre-rolls CBD" },
      { href: "/boutique?category=resines", label: "Résines" },
      { href: "/boutique?category=vapes", label: "Vapes & E-liquides" },
      { href: "/boutique?category=accessoires", label: "Accessoires" },
      { href: "/boutique", label: "Tous les produits" },
    ],
  },
  {
    title: "Aide",
    links: [
      { href: "/livraison", label: "Livraison" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
      { href: "/compte", label: "Mon compte" },
    ],
  },
  {
    title: "CBD",
    links: [
      { href: "/a-propos", label: "Notre histoire" },
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/cgv", label: "CGV" },
      { href: "/politique-confidentialite", label: "Confidentialité" },
      { href: "/politique-cookies", label: "Cookies" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-primary text-primary-foreground">
      <div className="container-x pb-10 pt-16 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo variant="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-primary-foreground/75">
              CBD premium sélectionné en Europe. Pre-rolls, résines, vapes et
              accessoires — THC inférieur à 0,3&nbsp;%, analyses disponibles.
            </p>
            <div className="mt-6 flex gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/25 text-primary-foreground/85 hover:border-primary-foreground hover:text-primary-foreground"
                aria-label="Instagram (nouvel onglet)"
              >
                <AtSign className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="/contact"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/25 text-primary-foreground/85 hover:border-primary-foreground hover:text-primary-foreground"
                aria-label="Nous écrire par e-mail"
              >
                <Mail className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="text-[11px] uppercase tracking-[0.18em] text-primary-foreground/60">
                  {col.title}
                </h2>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-primary-foreground/85 hover:text-primary-foreground">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-[11px] uppercase tracking-[0.18em] text-primary-foreground/60">
              Newsletter
            </h2>
            <p className="mt-4 text-sm text-primary-foreground/80">
              Nouveautés et offres en avant-première.
            </p>
            <NewsletterForm tone="dark" />
          </div>
        </div>

        <div className="mt-14 border-t border-primary-foreground/15 pt-8">
          <p className="max-w-4xl text-xs leading-relaxed text-primary-foreground/65">
            Produits réservés aux personnes majeures (18 ans et plus). Le CBD
            n&apos;est pas un médicament et ne peut se substituer à un traitement
            médical. Nos produits contiennent moins de 0,3&nbsp;% de THC
            conformément à la législation française. Informations de l’entreprise à compléter avant l’ouverture.
          </p>
          <p className="mt-4 text-xs text-primary-foreground/65">
            © {new Date().getFullYear()} CBD. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
