"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCarouselProps {
  children: React.ReactNode;
  className?: string;
}

export function ProductCarousel({ children, className }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function updateScrollButtons() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [children]);

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  return (
    <div className={cn("relative group/carousel", className)}>
      <div
        ref={scrollRef}
        className="no-scrollbar -mx-4 flex scroll-px-4 gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2 snap-x snap-mandatory sm:-mx-6 sm:scroll-px-6 sm:gap-5 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0"
        role="region"
        aria-roledescription="carrousel"
        aria-label="Produits"
        tabIndex={0}
      >
        {children}
      </div>

      <div className="pointer-events-none absolute -top-16 right-0 hidden gap-2 lg:flex">
        <button
          type="button"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground hover:border-foreground/40 disabled:cursor-default disabled:opacity-35"
          aria-label="Produits précédents"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground hover:border-foreground/40 disabled:cursor-default disabled:opacity-35"
          aria-label="Produits suivants"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function ProductCarouselItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-[62vw] max-w-[300px] shrink-0 snap-start sm:w-[42vw] lg:w-[calc(25%-15px)] lg:max-w-none",
        className
      )}
    >
      {children}
    </div>
  );
}
