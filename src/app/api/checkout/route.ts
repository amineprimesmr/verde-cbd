import { NextResponse } from "next/server";
import { cancelOrder, getCurrentUserId, persistOrder } from "@/app/api/checkout/persist-order";
import { getMollie } from "@/lib/mollie";
import { generateOrderNumber } from "@/lib/utils";
import { priceCartOnServer } from "@/lib/pricing-server";
import { validateCheckoutContact } from "@/app/api/checkout/validation";
import { sendOrderConfirmationEmail } from "@/lib/emails";
import { createOrderAccessToken } from "@/lib/order-access";
import { isBankTransferConfigured } from "@/lib/bank-details";
import { COMMERCE_ENABLED } from "@/lib/commerce";

export async function POST(request: Request) {
  if (!COMMERCE_ENABLED) {
    return NextResponse.json({ error: "Cette boutique est en démonstration. Aucun paiement réel n'est accepté." }, { status: 503 });
  }
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
      shipping_rate_id,
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
      items: unknown;
      shipping_rate_id?: string;
    };

    const invalid = validateCheckoutContact(body);
    if (invalid) {
      return NextResponse.json({ error: invalid }, { status: 400 });
    }
    if (payment_method !== "card" && payment_method !== "bank_transfer") {
      return NextResponse.json({ error: "Moyen de paiement invalide" }, { status: 400 });
    }
    if (payment_method === "card" && !getMollie()) {
      return NextResponse.json(
        { error: "Le paiement par carte est momentanément indisponible." },
        { status: 503 }
      );
    }
    if (payment_method === "bank_transfer" && !isBankTransferConfigured()) {
      return NextResponse.json({ error: "Le paiement par virement est momentanément indisponible." }, { status: 503 });
    }

    // Prix, stock et livraison recalculés côté serveur — jamais ceux du client.
    const pricing = await priceCartOnServer(items, shipping_rate_id);
    if (!pricing.ok) {
      return NextResponse.json(
        { error: pricing.error, code: "CART_INVALID", issues: pricing.issues, products: pricing.products },
        { status: pricing.status }
      );
    }
    const { lines, totals } = pricing;
    const orderNumber = generateOrderNumber();
    const orderToken = createOrderAccessToken(orderNumber);
    const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || request.url).origin;

    const userId = await getCurrentUserId();

    const orderData = {
      order_number: orderNumber,
      user_id: userId,
      status: "pending" as const,
      payment_method,
      payment_status: "pending" as const,
      mollie_payment_id: null,
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

    const persisted = await persistOrder(orderData, lines);
    if (!persisted.ok) {
      return NextResponse.json({ error: persisted.error }, { status: persisted.status });
    }
    const { orderId, admin } = persisted;

    if (payment_method === "card") {
      const mollie = getMollie();
      if (mollie) {
        try {
          const payment = await mollie.payments.create({
            amount: {
              currency: "EUR",
              value: (totals.total / 100).toFixed(2),
            },
            description: `Commande ${orderNumber} — CBD`,
            redirectUrl: `${siteUrl}/commande/${orderNumber}?token=${orderToken}`,
            webhookUrl: `${siteUrl}/api/webhooks/mollie`,
            metadata: { order_number: orderNumber, order_id: orderId ?? "" },
          });

          if (orderId && admin) {
            await admin
              .from("orders")
              .update({ mollie_payment_id: payment.id })
              .eq("id", orderId);
          }

          return NextResponse.json({
            order_number: orderNumber,
            payment_url: payment.getCheckoutUrl(),
          });
        } catch (err) {
          console.error("Mollie payment error:", err);
          if (orderId && admin) await cancelOrder(admin, orderId, lines);
          return NextResponse.json(
            {
              error:
                "Le service de paiement ne répond pas. Aucun montant n'a été débité, merci de réessayer dans un instant.",
            },
            { status: 502 }
          );
        }
      }
    }

    await sendOrderConfirmationEmail({
      to: email,
      orderNumber,
      items: lines,
      totalCents: totals.total,
    });

    return NextResponse.json({
      order_number: orderNumber,
      payment_method,
      order_token: orderToken,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
