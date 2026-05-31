import { FREE_SHIPPING_THRESHOLD } from "@/lib/data/catalog";

export function AnnouncementBar() {
  const threshold = `${FREE_SHIPPING_THRESHOLD / 100}\u00a0€`;

  return (
    <div className="bg-black px-4 py-2.5 text-center text-[11px] font-medium tracking-wide text-white sm:text-xs">
      Livraison <span className="font-bold">OFFERTE</span> dès {threshold} en France.
    </div>
  );
}
