import type { Order, OrderItem } from "@/types";

export function isDevCheckoutEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.ENABLE_DEV_CHECKOUT === "true"
  );
}

export const DEV_CHECKOUT_DEFAULTS = {
  email: "dev@verde-cbd.test",
  shipping_first_name: "Jean",
  shipping_last_name: "Dupont",
  shipping_address_line1: "12 rue de la Paix",
  shipping_address_line2: "",
  shipping_city: "Paris",
  shipping_postal_code: "75001",
  shipping_phone: "0601020304",
  billing_same_as_shipping: true,
  customer_notes: "Commande de test — mode développement",
  payment_method: "card" as const,
  age_confirmed: true as const,
  terms_accepted: true as const,
};

export const DEV_ORDER_STORAGE_KEY = "verde-dev-orders";

export function saveDevOrder(order: Order & { items?: OrderItem[] }) {
  if (typeof window === "undefined") return;

  try {
    const stored = sessionStorage.getItem(DEV_ORDER_STORAGE_KEY);
    const orders: Record<string, Order & { items?: OrderItem[] }> = stored
      ? JSON.parse(stored)
      : {};
    orders[order.order_number] = order;
    sessionStorage.setItem(DEV_ORDER_STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // ignore storage errors in dev
  }
}

export function loadDevOrder(
  orderNumber: string
): (Order & { items?: OrderItem[] }) | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = sessionStorage.getItem(DEV_ORDER_STORAGE_KEY);
    if (!stored) return null;
    const orders: Record<string, Order & { items?: OrderItem[] }> =
      JSON.parse(stored);
    return orders[orderNumber] ?? null;
  } catch {
    return null;
  }
}
