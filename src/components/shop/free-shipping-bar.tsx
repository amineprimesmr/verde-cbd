"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Gift, Truck } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";

/** Palier cadeau affiché après la livraison offerte. */
export const SAMPLE_GIFT_THRESHOLD = 10000;

interface FreeShippingBarProps {
  subtotalCents: number;
  /** Affiche aussi le palier « échantillon offert ». */
  showGift?: boolean;
  className?: string;
}

export function FreeShippingBar({
  subtotalCents,
  showGift = false,
  className,
}: FreeShippingBarProps) {
  const goal = showGift ? SAMPLE_GIFT_THRESHOLD : FREE_SHIPPING_THRESHOLD;
  const progress = Math.min(100, (subtotalCents / goal) * 100);
  const shippingReached = subtotalCents >= FREE_SHIPPING_THRESHOLD;
  const giftReached = showGift && subtotalCents >= SAMPLE_GIFT_THRESHOLD;
  const shippingMark = (FREE_SHIPPING_THRESHOLD / goal) * 100;

  let message: React.ReactNode;
  let key: string;
  if (!shippingReached) {
    key = "ship";
    message = (
      <>
        Plus que{" "}
        <strong className="font-semibold text-foreground">
          {formatPrice(FREE_SHIPPING_THRESHOLD - subtotalCents)}
        </strong>{" "}
        pour la <strong className="font-bold text-foreground">livraison offerte</strong>
      </>
    );
  } else if (showGift && !giftReached) {
    key = "gift";
    message = (
      <>
        Livraison offerte ✓ — plus que{" "}
        <strong className="font-semibold text-foreground">
          {formatPrice(SAMPLE_GIFT_THRESHOLD - subtotalCents)}
        </strong>{" "}
        pour un <strong className="font-bold text-foreground">échantillon offert</strong>
      </>
    );
  } else {
    key = "done";
    message = (
      <strong className="font-semibold text-primary">
        {showGift
          ? "Livraison offerte et échantillon offert débloqués !"
          : "Livraison offerte débloquée !"}
      </strong>
    );
  }

  return (
    <div className={cn("bg-card", className)}>
      <div className="relative h-5 overflow-hidden text-center text-[13px] text-foreground/70">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={key}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="truncate"
          >
            {message}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="relative mt-3 h-1.5 rounded-full bg-cream">
        <motion.div
          className={cn("h-full rounded-full", giftReached || (!showGift && shippingReached) ? "bg-primary-light" : "bg-primary")}
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
        {showGift && (
          <span
            className={cn(
              "absolute top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-card transition-colors",
              shippingReached ? "border-foreground text-foreground" : "border-border text-foreground/40"
            )}
            style={{ left: `${shippingMark}%` }}
          >
            <Truck className="h-2.5 w-2.5" />
          </span>
        )}
        <span
          className={cn(
            "absolute right-0 top-1/2 flex h-5 w-5 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-card transition-colors",
            progress >= 100 ? "border-primary text-primary" : "border-border text-foreground/40"
          )}
        >
          {showGift ? <Gift className="h-2.5 w-2.5" /> : <Truck className="h-2.5 w-2.5" />}
        </span>
      </div>
    </div>
  );
}
