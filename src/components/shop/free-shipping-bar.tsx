"use client";

import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/data/catalog";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Truck } from "lucide-react";

interface FreeShippingBarProps {
  subtotalCents: number;
  className?: string;
}

export function FreeShippingBar({ subtotalCents, className }: FreeShippingBarProps) {
  const remaining = FREE_SHIPPING_THRESHOLD - subtotalCents;
  const progress = Math.min(100, (subtotalCents / FREE_SHIPPING_THRESHOLD) * 100);
  const isFree = subtotalCents >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className={cn("rounded-xl border border-border bg-cream p-4", className)}>
      <div className="flex items-center gap-2 text-sm">
        <Truck className={cn("h-4 w-4", isFree ? "text-primary" : "text-muted-foreground")} />
        {isFree ? (
          <span className="font-medium text-primary">
            Livraison gratuite débloquée !
          </span>
        ) : (
          <span className="text-muted-foreground">
            Plus que{" "}
            <strong className="text-foreground">{formatPrice(remaining)}</strong>{" "}
            pour la livraison offerte
          </span>
        )}
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
