"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const slides = Array.from(new Set(images.filter(Boolean))).slice(0, 6);
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Mobile : synchronise l'indicateur avec le défilement tactile.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const index = Math.round(el.scrollLeft / el.clientWidth);
        setActive((prev) => (prev === index ? prev : index));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  function goTo(index: number) {
    setActive(index);
    const el = trackRef.current;
    if (el && el.clientWidth > 0 && getComputedStyle(el).overflowX !== "visible") {
      el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
    }
  }

  if (slides.length === 0) {
    return <div className="aspect-[4/5] w-full bg-cream" />;
  }

  return (
    <div className="lg:flex lg:flex-row-reverse lg:gap-4">
      {/* Image principale — carrousel tactile sur mobile, fondu sur desktop */}
      <div className="relative lg:flex-1">
        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain lg:block lg:overflow-visible"
          aria-roledescription="carrousel"
          aria-label={`Photos de ${productName}`}
        >
          {slides.map((src, i) => (
            <div
              key={src}
              className={cn(
                "relative aspect-[4/5] w-full shrink-0 snap-center overflow-hidden bg-cream lg:rounded-[4px]",
                "lg:transition-opacity lg:duration-500",
                i === 0 ? "lg:relative" : "lg:absolute lg:inset-0",
                active === i ? "lg:z-[1] lg:opacity-100" : "lg:opacity-0"
              )}
              aria-hidden={active !== i}
            >
              <Image
                src={src}
                alt={i === 0 ? productName : `${productName} — photo ${i + 1}`}
                fill
                preload={i === 0}
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {slides.length > 1 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-1.5 lg:hidden" aria-hidden>
            {slides.map((src, i) => (
              <span
                key={src}
                className={cn(
                  "h-1.5 rounded-full bg-foreground/70 transition-all duration-300",
                  active === i ? "w-5" : "w-1.5 opacity-40"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Miniatures */}
      {slides.length > 1 && (
        <div
          className="no-scrollbar hidden gap-3 lg:flex lg:w-20 lg:shrink-0 lg:flex-col"
          role="group"
          aria-label="Choisir une photo"
        >
          {slides.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Afficher la photo ${i + 1}`}
              aria-current={active === i}
              className={cn(
                "relative aspect-[4/5] w-full overflow-hidden rounded-[3px] bg-cream ring-offset-2 ring-offset-background transition",
                active === i ? "ring-1 ring-foreground" : "opacity-70 hover:opacity-100"
              )}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
