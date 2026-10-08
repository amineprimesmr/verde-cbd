import type { Metadata } from "next";
import { Package, Clock, MapPin, EyeOff } from "lucide-react";
import { PageIntro } from "@/components/layout/page-intro";
import { FREE_SHIPPING_THRESHOLD, STATIC_SHIPPING_RATES } from "@/lib/data/catalog";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Livraison",
  description:
    "Modes, tarifs et délais de livraison CBD en France métropolitaine. Livraison offerte dès 80 € d'achat, colis discret.",
};

const INFOS = [
  {
    icon: Clock,
    title: "Expédition le jour même",
    text: "Toute commande payée avant 14 h (jours ouvrés) est expédiée le jour même. Vous recevez le numéro de suivi par e-mail dès l'envoi.",
  },
  {
    icon: MapPin,
    title: "France métropolitaine",
    text: "Nous livrons exclusivement en France métropolitaine. Les DOM-TOM et l'international ne sont pas desservis pour le moment.",
  },
  {
    icon: EyeOff,
    title: "Emballage discret",
    text: "Tous nos colis sont expédiés dans un emballage neutre, sans mention du contenu visible de l'extérieur.",
  },
  {
    icon: Package,
    title: "Produits protégés",
    text: "Tubes hermétiques et calage soigné : vos produits arrivent intacts et préservés de la lumière.",
  },
];

export default function LivraisonPage() {
  const rates = STATIC_SHIPPING_RATES.filter((r) => r.price_cents > 0);
  const threshold = formatPrice(FREE_SHIPPING_THRESHOLD);

  return (
    <>
      <PageIntro eyebrow="Aide" title="Livraison">
        Livraison offerte dès {threshold} d&apos;achat. Expédition rapide, colis neutre.
      </PageIntro>

      <section aria-labelledby="rates-title" className="container-x pb-16 lg:pb-24">
        <h2 id="rates-title" className="sr-only">
          Modes de livraison
        </h2>
        <div className="overflow-hidden rounded-[4px] border border-border">
          <table className="w-full text-left text-[15px]">
            <caption className="sr-only">Tarifs et délais de livraison</caption>
            <thead className="bg-cream text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              <tr>
                <th scope="col" className="px-5 py-4 font-medium sm:px-8">Mode</th>
                <th scope="col" className="hidden px-5 py-4 font-medium sm:table-cell">Délai</th>
                <th scope="col" className="px-5 py-4 text-right font-medium sm:px-8">Tarif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {rates.map((r) => (
                <tr key={r.id}>
                  <th scope="row" className="px-5 py-5 font-normal sm:px-8">
                    <span className="block font-medium text-foreground">{r.name}</span>
                    <span className="mt-0.5 block text-[13px] text-muted-foreground">{r.description}</span>
                    <span className="mt-0.5 block text-[13px] text-muted-foreground sm:hidden">{r.estimated_days}</span>
                  </th>
                  <td className="hidden px-5 py-5 text-muted-foreground sm:table-cell">{r.estimated_days}</td>
                  <td className="px-5 py-5 text-right tabular-nums text-foreground sm:px-8">{formatPrice(r.price_cents)}</td>
                </tr>
              ))}
              <tr className="bg-accent-soft/60">
                <th scope="row" className="px-5 py-5 font-medium text-foreground sm:px-8">
                  Livraison offerte
                  <span className="mt-0.5 block text-[13px] font-normal text-muted-foreground">
                    Dès {threshold} d&apos;achat
                  </span>
                </th>
                <td className="hidden px-5 py-5 text-muted-foreground sm:table-cell">3-5 jours</td>
                <td className="px-5 py-5 text-right font-medium text-primary sm:px-8">Gratuit</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section aria-label="Informations de livraison" className="bg-cream">
        <ul className="container-x grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:py-24">
          {INFOS.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/15 text-primary">
                <Icon className="h-5 w-5 stroke-[1.5]" aria-hidden />
              </span>
              <h3 className="mt-5 font-display text-xl text-foreground">{title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
