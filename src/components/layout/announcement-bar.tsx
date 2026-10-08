import { FREE_SHIPPING_THRESHOLD } from "@/lib/data/catalog";

export function AnnouncementBar() {
  const threshold = `${FREE_SHIPPING_THRESHOLD / 100} €`;

  return (
    <div className="bg-primary px-4 py-2 text-center text-[11px] tracking-[0.08em] text-primary-foreground/90 sm:text-xs">
      Livraison offerte dès {threshold} · Expédition sous 24&nbsp;h en France
    </div>
  );
}
