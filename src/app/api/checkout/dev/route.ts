import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { calculateOrderTotal } from "@/lib/data/catalog";
import { isDevCheckoutEnabled } from "@/lib/dev-checkout";
import { generateOrderNumber } from "@/lib/utils";
import type { Order, OrderItem } from "@/types";

interface CheckoutItem {
  product_id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price_cents: number;
}

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
  items: CheckoutItem[];
  shipping_cents: number;
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
      shipping_cents,
    } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    const subtotal_cents = items.reduce(
      (sum, i) => sum + i.unit_price_cents * i.quantity,
      0
    );
    const totals = calculateOrderTotal(subtotal_cents, shipping_cents);
    const orderNumber = generateOrderNumber();
    const now = new Date().toISOString();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const orderData = {
      order_number: orderNumber,
      user_id: user?.id ?? null,
      status: "processing" as const,
      payment_method: "card" as const,
      payment_status: "paid" as const,
      stripe_payment_intent_id: `dev_sim_${orderNumber}`,
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

    const orderItems: Omit<OrderItem, "id">[] = items.map((item) => ({
      order_id: "",
      product_id: item.product_id,
      product_name: item.product_name,
      product_sku: item.product_sku,
      quantity: item.quantity,
      unit_price_cents: item.unit_price_cents,
      total_cents: item.unit_price_cents * item.quantity,
    }));

    let orderId = crypto.randomUUID();

    if (isSupabaseConfigured()) {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(orderData)
        .select("id")
        .single();

      if (orderError) {
        console.error("Dev order insert error:", orderError);
        return NextResponse.json(
          { error: "Erreur lors de la création de la commande" },
          { status: 500 }
        );
      }

      orderId = order.id;

      const dbItems = orderItems.map((item) => ({
        ...item,
        order_id: orderId,
      }));

      await supabase.from("order_items").insert(dbItems);

      for (const item of items) {
        const { data: productData } = await supabase
          .from("products")
          .select("stock")
          .eq("id", item.product_id)
          .single();

        if (productData) {
          await supabase
            .from("products")
            .update({ stock: Math.max(0, productData.stock - item.quantity) })
            .eq("id", item.product_id);
        }
      }
    }

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
