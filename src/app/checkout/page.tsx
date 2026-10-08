import { CheckoutForm } from "@/components/shop/checkout-form";
import { getProducts, getShippingRates } from "@/lib/data/products";
import { COMMERCE_ENABLED } from "@/lib/commerce";

export const metadata = {
  title: "Passer ma commande",
};

export default async function CheckoutPage() {
  const [shippingRates, catalog] = await Promise.all([
    getShippingRates(0),
    getProducts(),
  ]);

  return <CheckoutForm shippingRates={shippingRates} catalog={catalog} demoMode={!COMMERCE_ENABLED} />;
}
