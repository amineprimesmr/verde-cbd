import { HomeContent } from "@/components/home/home-content";
import { getProducts, CATEGORIES } from "@/lib/data/products";

export default async function HomePage() {
  const featuredProducts = await getProducts({ featured: true });

  return <HomeContent featuredProducts={featuredProducts} categories={CATEGORIES} />;
}
