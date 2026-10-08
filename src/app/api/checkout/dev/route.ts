import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/app/api/checkout/persist-order";
import { priceCartOnServer } from "@/lib/pricing-server";
import { validateCheckoutContact } from "@/app/api/checkout/validation";
import { isDevCheckoutEnabled } from "@/lib/dev-checkout";
import { generateOrderNumber } from "@/lib/utils";
import type { Order, OrderItem } from "@/types";

interface DevCheckoutBody {
  email: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_phone: string;
  billing_same_as_shipping: boolean;
  billing_first_name?: string;
  billing_last_name?: string;
  billing_address_line1?: string;
  billing_city?: string;
  billing_postal_code?: string;
  customer_notes?: string;
  items: unknown;
  shipping_rate_id?: string;
}

export async function POST(request: Request) {
  if (!isDevCheckoutEnabled()) {
    return NextResponse.json({ error: "Mode dev désactivé" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as DevCheckoutBody;
    const {
      email,
      shipping_first_name,
      shipping_last_name,
      shipping_address_line1,
      shipping_address_line2,
      shipping_city,
      shipping_postal_code,
      shipping_phone,
      billing_same_as_shipping,
      billing_first_name,
      billing_last_name,
      billing_address_line1,
      billing_city,
      billing_postal_code,
      customer_notes,
      items,
      shipping_rate_id,
    } = body;

    const invalid = validateCheckoutContact(body);
    if (invalid) {
      return NextResponse.json({ error: invalid }, { status: 400 });
    }

    const pricing = await priceCartOnServer(items, shipping_rate_id);
    if (!pricing.ok) {
      return NextResponse.json(
        { error: pricing.error, code: "CART_INVALID", issues: pricing.issues, products: pricing.products },
        { status: pricing.status }
      );
    }
    const { lines, totals } = pricing;
    const orderNumber = generateOrderNumber();
    const now = new Date().toISOString();

    const userId = await getCurrentUserId();

    const orderData = {
      order_number: orderNumber,
      user_id: userId,
      status: "processing" as const,
      payment_method: "card" as const,
      payment_status: "paid" as const,
      mollie_payment_id: `dev_sim_${orderNumber}`,
      subtotal_cents: totals.subtotal,
      shipping_cents: totals.shipping,
      tax_cents: totals.tax,
      total_cents: totals.total,
      shipping_first_name,
      shipping_last_name,
      shipping_company: null,
      shipping_address_line1,
      shipping_address_line2: shipping_address_line2 || null,
      shipping_city,
      shipping_postal_code,
      shipping_country: "FR",
      shipping_phone,
      billing_first_name: billing_same_as_shipping
        ? shipping_first_name
        : billing_first_name!,
      billing_last_name: billing_same_as_shipping
        ? shipping_last_name
        : billing_last_name!,
      billing_address_line1: billing_same_as_shipping
        ? shipping_address_line1
        : billing_address_line1!,
      billing_address_line2: billing_same_as_shipping
        ? shipping_address_line2 || null
        : null,
      billing_city: billing_same_as_shipping ? shipping_city : billing_city!,
      billing_postal_code: billing_same_as_shipping
        ? shipping_postal_code
        : billing_postal_code!,
      billing_country: "FR",
      customer_email: email,
      customer_notes: customer_notes || null,
      tracking_number: null,
      tracking_url: null,
      shipped_at: null,
      delivered_at: null,
    };

    const orderItems: Omit<OrderItem, "id">[] = lines.map((line) => ({
      order_id: "",
      ...line,
    }));

    const orderId = crypto.randomUUID();

    const order: Order & { items: OrderItem[] } = {
      id: orderId,
      ...orderData,
      created_at: now,
      updated_at: now,
      items: orderItems.map((item, index) => ({
        ...item,
        id: `dev-item-${index}`,
        order_id: orderId,
      })),
    };

    return NextResponse.json({
      order_number: orderNumber,
      dev: true,
      order,
    });
  } catch (error) {
    console.error("Dev checkout error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
