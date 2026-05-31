"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory"
      >
        {children}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        className={cn(
          "absolute -left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 rounded-full border-border bg-white shadow-md transition-opacity lg:flex",
          !canScrollLeft && "opacity-0 pointer-events-none"
        )}
        aria-label="Précédent"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        className={cn(
          "absolute -right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 rounded-full border-border bg-white shadow-md transition-opacity lg:flex",
          !canScrollRight && "opacity-0 pointer-events-none"
        )}
        aria-label="Suivant"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
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
        "w-[280px] shrink-0 snap-start sm:w-[300px] lg:w-[calc(25%-15px)]",
        className
      )}
    >
      {children}
    </div>
  );
}
