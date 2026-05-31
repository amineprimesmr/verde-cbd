import { CheckoutForm } from "@/components/shop/checkout-form";
import { getShippingRates } from "@/lib/data/products";

export const metadata = {
  title: "Passer ma commande",
};

export default async function CheckoutPage() {
  const shippingRates = await getShippingRates(0);

  return <CheckoutForm shippingRates={shippingRates} />;
}
