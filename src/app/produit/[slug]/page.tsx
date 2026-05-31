import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/data/products";
import { ProductDetail } from "@/components/shop/product-detail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produit introuvable" };
  return {
    title: product.name,
    description: product.short_description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const allProducts = await getProducts({ category: product.category });
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return <ProductDetail product={product} relatedProducts={relatedProducts} />;
}
