import { Truck, Shield, Headphones, CreditCard } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: "Livraison offerte",
    desc: "Dès 80€ d'achat en France métropolitaine",
  },
  {
    icon: Shield,
    title: "Qualité certifiée",
    desc: "Analyses COA disponibles pour chaque lot",
  },
  {
    icon: Headphones,
    title: "Service client",
    desc: "Réponse sous 24h ouvrées",
  },
  {
    icon: CreditCard,
    title: "Paiement sécurisé",
    desc: "Stripe — CB, Apple Pay, Google Pay",
  },
] as const;

function TrustMarqueeItem({
  icon: Icon,
  title,
  desc,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex shrink-0 items-center gap-3 px-10 sm:px-14">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/25 sm:h-10 sm:w-10">
        <Icon className="h-4 w-4 text-white" strokeWidth={2.25} />
      </div>
      <div className="whitespace-nowrap">
        <p className="text-sm font-semibold text-white sm:text-[15px]">{title}</p>
        <p className="mt-0.5 text-xs text-white/85 sm:text-[13px]">{desc}</p>
      </div>
    </div>
  );
}

export function TrustBar() {
  const marqueeItems = [...TRUST_ITEMS, ...TRUST_ITEMS];

  return (
    <section
      className="overflow-hidden bg-[#2d6a4f] py-4 sm:py-[18px]"
      aria-label="Nos garanties"
    >
      <div className="animate-trust-marquee flex w-max items-center hover:[animation-play-state:paused]">
        {marqueeItems.map((item, index) => (
          <TrustMarqueeItem
            key={`${item.title}-${index}`}
            icon={item.icon}
            title={item.title}
            desc={item.desc}
          />
        ))}
      </div>
    </section>
  );
}
