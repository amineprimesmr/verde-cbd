"use client";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

export interface PackOption {
  id: string;
  label: string;
  quantity: number;
  priceCents: number;
  compareCents: number;
  discount: number | null;
}

interface ProductPackSelectorProps {
  packs: PackOption[];
  selectedId: string;
  onSelect: (pack: PackOption) => void;
}

export function ProductPackSelector({
  packs,
  selectedId,
  onSelect,
}: ProductPackSelectorProps) {
  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
          1
        </span>
        <h2 className="text-base font-bold text-black">Choisissez votre pack</h2>
      </div>
      <p className="mt-4 text-xs font-medium text-black/50">Quantité</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {packs.map((pack) => {
          const selected = pack.id === selectedId;
          return (
            <button
              key={pack.id}
              type="button"
              onClick={() => onSelect(pack)}
              className={cn(
                "rounded-xl border-2 px-2 py-4 text-center transition-all duration-200",
                selected
                  ? "border-[#f2c94c] bg-[#fffef5] shadow-sm"
                  : "border-[#e8e8e8] bg-white hover:border-[#ddd]"
              )}
            >
              <p className="text-xs font-bold text-black">{pack.label}</p>
              <p className="mt-2 text-sm font-bold text-black">
                {pack.compareCents > pack.priceCents && (
                  <span className="mr-1 text-xs font-normal text-black/40 line-through">
                    {formatPrice(pack.compareCents)}
                  </span>
                )}
                {formatPrice(pack.priceCents)}
              </p>
              {pack.discount && (
                <p className="mt-1 text-[10px] font-bold text-[#e67e22]">
                  -{pack.discount}%
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface PurchaseModeSelectorProps {
  mode: "once" | "subscribe";
  onModeChange: (mode: "once" | "subscribe") => void;
  unitPriceCents: number;
  compareCents: number | null;
  subscribePriceCents: number;
}

export function PurchaseModeSelector({
  mode,
  onModeChange,
  unitPriceCents,
  compareCents,
  subscribePriceCents,
}: PurchaseModeSelectorProps) {
  return (
    <div className="border-t border-[#eee] px-4 py-6">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
          2
        </span>
        <h2 className="text-base font-bold text-black">Choisissez votre fréquence</h2>
      </div>

      <button
        type="button"
        onClick={() => onModeChange("subscribe")}
        className={cn(
          "mt-4 w-full rounded-xl border-2 p-4 text-left transition-all",
          mode === "subscribe"
            ? "border-[#f2c94c] bg-[#fffef5]"
            : "border-[#e8e8e8] bg-white"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                mode === "subscribe" ? "border-[#f2c94c] bg-[#f2c94c]" : "border-[#ccc]"
              )}
            >
              {mode === "subscribe" && (
                <span className="h-2 w-2 rounded-full bg-black" />
              )}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-black">S&apos;abonner et</span>
                <span className="rounded bg-black px-2 py-0.5 text-[10px] font-bold text-white">
                  Économiser 15%
                </span>
              </div>
            </div>
          </div>
          <div className="text-right text-sm font-bold">
            {formatPrice(subscribePriceCents)}
            {compareCents && (
              <span className="ml-1 text-xs font-normal text-black/40 line-through">
                {formatPrice(compareCents)}
              </span>
            )}
          </div>
        </div>
        <ul className="mt-4 space-y-2 pl-8">
          {[
            "Livraison offerte et prioritaire",
            "Sans engagement",
            "Garantie 30 jours",
            "Annulable à tout moment",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-xs text-black/80">
              <span className="text-black">✓</span> {item}
            </li>
          ))}
        </ul>
      </button>

      <button
        type="button"
        onClick={() => onModeChange("once")}
        className={cn(
          "mt-3 flex w-full items-center justify-between rounded-xl border-2 p-4 transition-all",
          mode === "once"
            ? "border-[#f2c94c] bg-[#fffef5]"
            : "border-[#e8e8e8] bg-white"
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
              mode === "once" ? "border-[#f2c94c] bg-[#f2c94c]" : "border-[#ccc]"
            )}
          >
            {mode === "once" && <span className="h-2 w-2 rounded-full bg-black" />}
          </span>
          <span className="text-sm font-bold text-black">Achat unique</span>
        </div>
        <span className="text-sm font-bold text-black">
          {formatPrice(unitPriceCents)}
        </span>
      </button>
    </div>
  );
}
