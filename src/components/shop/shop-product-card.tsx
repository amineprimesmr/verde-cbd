import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ShopProductCardProps {
  product: Product;
  className?: string;
}

export function ShopProductCard({ product, className }: ShopProductCardProps) {
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

      <p className="mt-1.5 text-[13px] text-black/55 sm:text-sm">
        Dès {formatPrice(product.price_cents).replace(/\s/g, "")}
      </p>
    </Link>
  );
}
