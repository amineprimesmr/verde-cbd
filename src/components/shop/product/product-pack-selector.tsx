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
