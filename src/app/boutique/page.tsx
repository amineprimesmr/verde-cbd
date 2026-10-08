import type { Metadata } from "next";
import { ShopCatalog } from "@/components/shop/shop-catalog";
import { getProducts, CATEGORIES, VAPE_SUBCATEGORIES } from "@/lib/data/products";
import type { Product, ProductCategory, VapeSubcategory } from "@/types";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    q?: string;
    search?: string;
    sort?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "Pre-rolls, résines, vapes et accessoires CBD. THC < 0,3 %, analyses laboratoire, livraison en 48 h en France.",
};

const VALID_CATEGORIES = new Set<string>(CATEGORIES.map((c) => c.id));
const VALID_SUBCATEGORIES = new Set<string>(VAPE_SUBCATEGORIES.map((c) => c.id));

const isPopular = (p: Product) => p.is_featured || p.tags.includes("best-seller");

function sortProducts(products: Product[], sort?: string): Product[] {
  const list = [...products];

  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price_cents - b.price_cents);
    case "price-desc":
      return list.sort((a, b) => b.price_cents - a.price_cents);
    case "newest":
      // Produits tagués « nouveau » d'abord, puis par date de création.
      return list.sort(
        (a, b) =>
          Number(b.tags.includes("nouveau")) - Number(a.tags.includes("nouveau")) ||
          Date.parse(b.created_at) - Date.parse(a.created_at)
      );
    case "popular":
      // Array.prototype.sort est stable : l'ordre du catalogue est conservé à égalité.
      return list.sort((a, b) => Number(isPopular(b)) - Number(isPopular(a)));
    case "name":
      return list.sort((a, b) => a.name.localeCompare(b.name, "fr"));
    default:
      return list;
  }
}

export default async function BoutiquePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category =
    params.category && VALID_CATEGORIES.has(params.category)
      ? (params.category as ProductCategory)
      : undefined;
  const subcategory =
    category === "vapes" && params.subcategory && VALID_SUBCATEGORIES.has(params.subcategory)
      ? (params.subcategory as VapeSubcategory)
      : undefined;
  const q = (params.q ?? params.search ?? "").trim().slice(0, 80) || undefined;
  const sort = params.sort;

  const products = sortProducts(
    await getProducts({ category, subcategory, search: q }),
    sort
  );

  return (
    <ShopCatalog
      products={products}
      categories={CATEGORIES}
      vapeSubcategories={VAPE_SUBCATEGORIES}
      activeCategory={category}
      activeSubcategory={subcategory}
      query={q}
      sort={sort}
    />
  );
}
