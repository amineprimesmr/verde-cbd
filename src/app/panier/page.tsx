import { CartContent } from "@/components/shop/cart-content";
import { getProducts } from "@/lib/data/products";

export const metadata = {
  title: "Panier",
};

export default async function PanierPage() {
  const catalog = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground">Mon panier</h1>
      <div className="mt-8">
        <CartContent catalog={catalog} />
      </div>
    </div>
  );
}
