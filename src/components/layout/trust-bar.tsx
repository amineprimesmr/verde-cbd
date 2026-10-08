import { Leaf, FlaskConical, Truck, Lock } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: Leaf,
    title: "CBD légal",
    desc: "THC inférieur à 0,3 %, conforme à la loi française",
  },
  {
    icon: FlaskConical,
    title: "Traçabilité",
    desc: "Informations et documents du lot sur sa fiche",
  },
  {
    icon: Truck,
    title: "Express en 48\u00a0h",
    desc: "Expédié sous 24\u00a0h ouvrées, colis neutre et discret",
  },
  {
    icon: Lock,
    title: "Paiement sécurisé",
    desc: "Transactions chiffrées via Mollie",
  },
] as const;

export function TrustBar({ className = "" }: { className?: string }) {
  return (
    <section aria-label="Nos garanties" className={`border-y border-border bg-cream ${className}`}>
      <ul className="container-x grid grid-cols-2 gap-x-4 gap-y-7 py-8 sm:py-10 lg:grid-cols-4 lg:gap-8">
        {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
          <li key={title} className="flex flex-col items-start gap-3 sm:flex-row sm:gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-foreground/15 text-primary">
              <Icon className="h-[18px] w-[18px] stroke-[1.5]" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">{desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
