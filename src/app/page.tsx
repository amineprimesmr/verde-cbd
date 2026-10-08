import { HomeContent } from "@/components/home/home-content";
import { getProducts, CATEGORIES } from "@/lib/data/products";
import type { Product } from "@/types";

const hasTag = (p: Product, tag: string) => p.tags.includes(tag);

export default async function HomePage() {
  const products = await getProducts();
  const mainProducts = products.filter((p) => !hasTag(p, "upsell"));

  const featured = mainProducts.filter((p) => p.is_featured || hasTag(p, "best-seller"));
  const bestSellers = (
    featured.length >= 4
      ? featured
      : [...featured, ...mainProducts.filter((p) => !featured.includes(p))]
  ).slice(0, 8);

  const tagged = mainProducts.filter((p) => hasTag(p, "nouveau")).sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  const newArrivals = (
    tagged.length > 0
      ? tagged
      : [...mainProducts].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
  ).slice(0, 4);

  return (
    <HomeContent
      bestSellers={bestSellers}
      newArrivals={newArrivals}
      categories={CATEGORIES}
    />
  );
}
