import { ShopCatalog } from "@/components/shop/shop-catalog";
import { getProducts, CATEGORIES, VAPE_SUBCATEGORIES } from "@/lib/data/products";
import type { Product, ProductCategory, VapeSubcategory } from "@/types";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    search?: string;
    sort?: string;
  }>;
}

export const metadata = {
  title: "Boutique",
  description: "Parcourez notre catalogue complet de produits CBD",
};

function sortProducts(products: Product[], sort?: string): Product[] {
  const list = [...products];

  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price_cents - b.price_cents);
    case "price-desc":
      return list.sort((a, b) => b.price_cents - a.price_cents);
    case "name":
      return list.sort((a, b) => a.name.localeCompare(b.name, "fr"));
    default:
      return list;
  }
}

export default async function BoutiquePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category = params.category as ProductCategory | undefined;
  const subcategory = params.subcategory as VapeSubcategory | undefined;
  const search = params.search;
  const sort = params.sort;

  const products = sortProducts(
    await getProducts({ category, subcategory, search }),
    sort
  );

  return (
    <ShopCatalog
      products={products}
      categories={CATEGORIES}
      vapeSubcategories={VAPE_SUBCATEGORIES}
      activeCategory={category}
      activeSubcategory={subcategory}
    />
  );
}
