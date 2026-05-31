import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { PRODUCT_RATING } from "@/lib/data/product-page-content";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

function getReviewCount(productId: string): number {
  const n = Number.parseInt(productId, 10);
  return (n * 173 + 224) % 450 + 48;
}

interface ShopProductCardProps {
  product: Product;
  className?: string;
}

export function ShopProductCard({ product, className }: ShopProductCardProps) {
  const reviewCount = getReviewCount(product.id);
  const fullStars = Math.floor(PRODUCT_RATING);
  const hasHalf = PRODUCT_RATING % 1 >= 0.5;

  return (
    <Link href={`/produit/${product.slug}`} className={cn("group block", className)}>
      <div className="relative aspect-square overflow-hidden bg-[#f5f5f5]">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03] sm:p-4"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>

      <h3 className="mt-3 text-[13px] font-bold leading-[1.35] text-black line-clamp-3 sm:text-sm">
        {product.name}
      </h3>

      <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1">
        <div className="flex items-center gap-px">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3.5 w-3.5",
                i < fullStars
                  ? "fill-black text-black"
                  : i === fullStars && hasHalf
                    ? "fill-black/45 text-black/45"
                    : "fill-black/15 text-black/15"
              )}
            />
          ))}
        </div>
        <span className="text-[12px] text-black/70 sm:text-[13px]">
          {reviewCount} Avis
        </span>
      </div>

      <p className="mt-1.5 text-[13px] text-black/55 sm:text-sm">
        Dès {formatPrice(product.price_cents).replace(/\s/g, "")}
      </p>
    </Link>
  );
}
