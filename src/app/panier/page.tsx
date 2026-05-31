import { CartContent } from "@/components/shop/cart-content";

export const metadata = {
  title: "Panier",
};

export default function PanierPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent">
        Panier
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">
        Mon panier
      </h1>
      <div className="mt-8">
        <CartContent />
      </div>
    </div>
  );
}
