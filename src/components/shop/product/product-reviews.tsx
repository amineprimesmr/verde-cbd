"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PRODUCT_RATING,
  PRODUCT_REVIEW_COUNT,
  RATING_BREAKDOWN,
  TESTIMONIALS,
} from "@/lib/data/product-page-content";

export function ProductRatingHeader() {
  return (
    <div className="flex items-center gap-2 px-4 pt-4">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3.5 w-3.5",
              i < Math.floor(PRODUCT_RATING)
                ? "fill-black text-black"
                : "fill-black/30 text-black/30"
            )}
          />
        ))}
      </div>
      <span className="text-sm font-bold text-black">
        {PRODUCT_REVIEW_COUNT.toLocaleString("fr-FR")} Avis
      </span>
    </div>
  );
}

export function ProductReviewsCarousel() {
  return (
    <section id="reviews" className="scroll-mt-20 bg-white px-4 py-10">
      <h2 className="text-center text-lg font-bold text-black">
        Ils en parlent mieux que nous
      </h2>
      <div className="mt-3 flex items-center justify-center gap-2">
        <span className="text-sm font-bold text-black">
          Excellent {PRODUCT_RATING} / 5
        </span>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-[#f2c94c] text-[#f2c94c]" />
          ))}
        </div>
      </div>

      <div className="no-scrollbar mt-6 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
        {TESTIMONIALS.map((review) => (
          <div
            key={review.author}
            className="w-[280px] shrink-0 snap-center rounded-2xl border border-[#eee] bg-white p-6 shadow-sm"
          >
            <div className="flex gap-0.5">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[#f2c94c] text-[#f2c94c]" />
              ))}
            </div>
            <h3 className="mt-3 font-bold text-black">{review.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-black/70 line-clamp-4">
              {review.text}
            </p>
            <p className="mt-4 text-sm font-bold text-black">{review.author}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProductReviewsBreakdown() {
  const maxCount = RATING_BREAKDOWN[0].count;

  return (
    <section className="border-t border-[#eee] bg-white px-4 py-10">
      <div className="flex gap-2 border-b border-black pb-3">
        <button type="button" className="border-b-2 border-black pb-1 text-sm font-bold text-black">
          Avis
        </button>
        <button type="button" className="pb-1 text-sm font-medium text-black/40">
          Questions-réponses
        </button>
      </div>

      <h3 className="mt-8 text-center text-lg font-bold text-black">Avis des clients</h3>

      <div className="mt-6 flex gap-6">
        <div className="shrink-0 text-center">
          <p className="text-5xl font-bold text-black">{PRODUCT_RATING}</p>
          <div className="mt-1 flex justify-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-black text-black" />
            ))}
          </div>
          <p className="mt-1 text-xs text-black/50">
            Basé sur {PRODUCT_REVIEW_COUNT.toLocaleString("fr-FR")} avis
          </p>
        </div>

        <div className="flex-1 space-y-1.5 border-l border-[#eee] pl-6">
          {RATING_BREAKDOWN.map(({ stars, count }) => (
            <div key={stars} className="flex items-center gap-2 text-xs">
              <span className="w-3 font-medium">{stars}</span>
              <Star className="h-3 w-3 fill-black text-black" />
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#eee]">
                <div
                  className="h-full rounded-full bg-black/70"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="w-8 text-right text-black/50">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="mt-6 w-full rounded-full bg-black py-3.5 text-sm font-bold text-white"
      >
        Écrire un avis
      </button>
    </section>
  );
}
