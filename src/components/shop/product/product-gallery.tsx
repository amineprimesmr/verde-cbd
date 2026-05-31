"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const slides =
    images.length >= 4
      ? images.slice(0, 4)
      : [
          images[0],
          images[0],
          images[0],
          images[0],
        ];

  return (
    <div className="bg-[#f4f4f4]">
      <div
        className={cn(
          "relative aspect-square w-full cursor-zoom-in bg-[#f4f4f4]",
          zoomed && "cursor-zoom-out"
        )}
        onClick={() => setZoomed(!zoomed)}
      >
        <Image
          src={slides[active]}
          alt={productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={cn(
            "object-contain p-6 transition-transform duration-500",
            zoomed && "scale-125"
          )}
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setZoomed(!zoomed);
          }}
          className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md"
          aria-label="Zoom"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-0 overflow-x-auto border-t border-[#eee] bg-white no-scrollbar">
        {slides.map((img, i) => (
          <button
            key={`${img}-${i}`}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "relative h-20 w-20 shrink-0 border-r border-[#eee] sm:h-24 sm:w-24",
              active === i && "ring-2 ring-inset ring-black"
            )}
          >
            <Image src={img} alt="" fill className="object-cover p-1" sizes="96px" />
            {active === i && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-black" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
