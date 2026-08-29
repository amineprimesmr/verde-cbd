import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMollie } from "@/lib/mollie";
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

  const payment = await mollie.payments.get(paymentId);
  const orderNumber = payment.metadata
    ? (payment.metadata as { order_number?: string }).order_number
    : undefined;

  if (orderNumber && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();

    if (payment.status === "paid") {
      const { data: order } = await supabase
        .from("orders")
        .update({ payment_status: "paid", status: "processing" })
        .eq("order_number", orderNumber)
        .select("id, customer_email, total_cents")
        .single();

      if (order) {
        const { data: items } = await supabase
          .from("order_items")
          .select("product_name, quantity, unit_price_cents")
          .eq("order_id", order.id);

        await sendOrderConfirmationEmail({
          to: order.customer_email,
          orderNumber,
          items: items ?? [],
          totalCents: order.total_cents,
        });
      }
    } else if (["expired", "canceled", "failed"].includes(payment.status)) {
      await supabase
        .from("orders")
        .update({ payment_status: "failed" })
        .eq("order_number", orderNumber);
    }
  }

  return NextResponse.json({ received: true });
}
