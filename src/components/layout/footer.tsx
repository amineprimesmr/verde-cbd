import Link from "next/link";
import { Mail, AtSign } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { NewsletterForm } from "@/components/layout/newsletter-form";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo variant="dark" className="mb-1" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Votre boutique CBD premium en France. Pre-rolls, résines, vapes
              et accessoires sélectionnés avec soin. THC &lt; 0,3%, certificats
              d&apos;analyse disponibles.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-muted transition-colors hover:border-primary hover:text-primary"
                aria-label="Réseaux sociaux"
              >
                <AtSign className="h-4 w-4" />
              </a>
              <a
                href="mailto:contact@verde-cbd.fr"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-muted transition-colors hover:border-primary hover:text-primary"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Boutique
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/boutique?category=fleurs" className="hover:text-primary">
                  Pre-rolls CBD
                </Link>
              </li>
              <li>
                <Link href="/boutique?category=resines" className="hover:text-primary">
                  Résines
                </Link>
              </li>
              <li>
                <Link href="/boutique?category=vapes" className="hover:text-primary">
                  Vapes &amp; E-liquides
                </Link>
              </li>
              <li>
                <Link href="/boutique?category=accessoires" className="hover:text-primary">
                  Accessoires
                </Link>
              </li>
              <li>
                <Link href="/boutique" className="hover:text-primary">
                  Tous les produits
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Informations
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/a-propos" className="hover:text-primary">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/livraison" className="hover:text-primary">
                  Livraison
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Légal
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/mentions-legales" className="hover:text-primary">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="hover:text-primary">
                  CGV
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="hover:text-primary">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/politique-cookies" className="hover:text-primary">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Newsletter
            </h4>
            <p className="mt-4 text-sm text-muted-foreground">
              Offres exclusives et nouveautés en avant-première.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-border pt-8 opacity-60">
          {["Visa", "Mastercard", "Apple Pay", "Google Pay"].map((method) => (
            <span key={method} className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {method}
            </span>
          ))}
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Produits réservés aux personnes majeures (+18 ans). Le CBD n&apos;est
            pas un médicament et ne peut se substituer à un traitement médical.
            Nos produits contiennent moins de 0,3% de THC conformément à la
            législation française. Verde CBD SAS — SIRET 123 456 789 00012 —
            12 rue du Chanvre, 75011 Paris
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Verde CBD. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
