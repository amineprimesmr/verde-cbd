import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { generateOrderNumber } from "@/lib/utils";
import { calculateOrderTotal } from "@/lib/data/catalog";

interface CheckoutItem {
  product_id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price_cents: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
      payment_method,
      items,
      shipping_cents,
    } = body as {
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
      payment_method: "card" | "bank_transfer";
      items: CheckoutItem[];
      shipping_cents: number;
    };

    if (!items?.length) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    const subtotal_cents = items.reduce(
      (sum, i) => sum + i.unit_price_cents * i.quantity,
      0
    );
    const totals = calculateOrderTotal(subtotal_cents, shipping_cents);
    const orderNumber = generateOrderNumber();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const orderData = {
      order_number: orderNumber,
      user_id: user?.id ?? null,
      status: "pending" as const,
      payment_method,
      payment_status: "pending" as const,
      stripe_payment_intent_id: null,
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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    let orderId: string | null = null;

    if (supabaseUrl && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(orderData)
        .select("id")
        .single();

      if (orderError) {
        console.error("Order insert error:", orderError);
        return NextResponse.json(
          { error: "Erreur lors de la création de la commande" },
          { status: 500 }
        );
      }

      orderId = order.id;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_sku: item.product_sku,
        quantity: item.quantity,
        unit_price_cents: item.unit_price_cents,
        total_cents: item.unit_price_cents * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Order items error:", itemsError);
      }

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

    if (payment_method === "card") {
      const stripe = getStripe();
      if (stripe) {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: items.map((item) => ({
            price_data: {
              currency: "eur",
              product_data: { name: item.product_name },
              unit_amount: item.unit_price_cents,
            },
            quantity: item.quantity,
          })),
          mode: "payment",
          success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/commande/${orderNumber}?success=true`,
          cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?cancelled=true`,
          customer_email: email,
          metadata: { order_number: orderNumber, order_id: orderId ?? "" },
        });

        if (orderId && supabaseUrl) {
          await supabase
            .from("orders")
            .update({ stripe_payment_intent_id: session.id })
            .eq("id", orderId);
        }

        return NextResponse.json({
          order_number: orderNumber,
          payment_url: session.url,
        });
      }
    }

    return NextResponse.json({
      order_number: orderNumber,
      payment_method,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
