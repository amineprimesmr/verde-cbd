import { NextResponse } from "next/server";
import { getMollie } from "@/lib/mollie";
import { getSupabaseAdmin, restoreStock } from "@/lib/supabase/admin";
import { sendOrderConfirmationEmail } from "@/lib/emails";

export async function POST(request: Request) {
  const mollie = getMollie();
  if (!mollie) {
    return NextResponse.json({ received: true });
  }

  const formData = await request.formData();
  const paymentId = formData.get("id");

  if (typeof paymentId !== "string") {
    return NextResponse.json({ error: "Missing payment id" }, { status: 400 });
  }

  // Le statut est toujours relu chez Mollie : le corps du webhook n'est pas fiable.
  const payment = await mollie.payments.get(paymentId);
  const orderNumber = payment.metadata
    ? (payment.metadata as { order_number?: string }).order_number
    : undefined;

  const admin = getSupabaseAdmin();
  if (!orderNumber || !admin) {
    if (orderNumber) console.error("Webhook Mollie : SUPABASE_SERVICE_ROLE_KEY manquante.");
    return NextResponse.json({ received: true });
  }

  if (payment.status === "paid") {
    // Transition conditionnelle : un webhook rejoué n'envoie pas deux e-mails.
    const { data: order } = await admin
      .from("orders")
      .update({ payment_status: "paid", status: "processing" })
      .eq("order_number", orderNumber)
      .eq("mollie_payment_id", paymentId)
      .neq("payment_status", "paid")
      .select("id, customer_email, total_cents")
      .maybeSingle();

    if (order) {
      const { data: items } = await admin
        .from("order_items")
        .select("product_name, quantity, unit_price_cents, total_cents")
        .eq("order_id", order.id);

      await sendOrderConfirmationEmail({
        to: order.customer_email,
        orderNumber,
        items: items ?? [],
        totalCents: order.total_cents,
      });
    }
  } else if (["expired", "canceled", "failed"].includes(payment.status)) {
    // Seule une commande encore en attente est annulée et son stock restitué.
    const { data: order } = await admin
      .from("orders")
      .update({ payment_status: "failed", status: "cancelled" })
      .eq("order_number", orderNumber)
      .eq("mollie_payment_id", paymentId)
      .eq("payment_status", "pending")
      .select("id")
      .maybeSingle();

    if (order) {
      const { data: items } = await admin
        .from("order_items")
        .select("product_id, quantity")
        .eq("order_id", order.id);
      await restoreStock(
        admin,
        (items ?? []).flatMap((i) =>
          i.product_id ? [{ product_id: i.product_id, quantity: i.quantity }] : []
        )
      );
    }
  }

  return NextResponse.json({ received: true });
}
