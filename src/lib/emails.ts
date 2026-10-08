import { getResend, FROM_EMAIL, CONTACT_INBOX_EMAIL } from "@/lib/resend";
import { formatPrice } from "@/lib/utils";
import { createOrderAccessToken } from "@/lib/order-access";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

interface OrderConfirmationItem {
  product_name: string;
  quantity: number;
  unit_price_cents: number;
  total_cents?: number;
}

export async function sendOrderConfirmationEmail(params: {
  to: string;
  orderNumber: string;
  items: OrderConfirmationItem[];
  totalCents: number;
}) {
  const resend = getResend();
  if (!resend) return;

  const itemsHtml = params.items
    .map(
      (item) =>
        `<tr><td style="padding:8px 0;">${escapeHtml(item.product_name)} × ${item.quantity}</td><td style="padding:8px 0;text-align:right;">${formatPrice(item.total_cents ?? item.unit_price_cents * item.quantity)}</td></tr>`
    )
    .join("");

  const trackingUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/commande/${encodeURIComponent(params.orderNumber)}?token=${createOrderAccessToken(params.orderNumber)}`;
  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: `Confirmation de commande ${params.orderNumber} — CBD`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
        <h1 style="font-size:20px;">Merci pour votre commande !</h1>
        <p>Votre commande <strong>${params.orderNumber}</strong> a bien été enregistrée.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          ${itemsHtml}
          <tr><td style="padding:8px 0;font-weight:bold;border-top:1px solid #eee;">Total</td><td style="padding:8px 0;text-align:right;font-weight:bold;border-top:1px solid #eee;">${formatPrice(params.totalCents)}</td></tr>
        </table>
        <p><a href="${escapeHtml(trackingUrl)}">Consulter ma commande</a></p>
        <p style="margin-top:24px;color:#666;font-size:13px;">CBD — Vous recevrez un email dès l'expédition de votre commande.</p>
      </div>
    `,
  });
  if (result.error) console.error("Order confirmation email failed:", result.error.message);
}

export async function sendContactNotificationEmail(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const resend = getResend();
  if (!resend) throw new Error("Le service de contact est momentanément indisponible.");

  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to: CONTACT_INBOX_EMAIL,
    replyTo: params.email,
    subject: `[Contact] ${params.subject}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
        <p><strong>De :</strong> ${escapeHtml(params.name)} (${escapeHtml(params.email)})</p>
        <p><strong>Sujet :</strong> ${escapeHtml(params.subject)}</p>
        <p style="white-space:pre-wrap;margin-top:16px;">${escapeHtml(params.message)}</p>
      </div>
    `,
  });
  if (result.error) throw new Error("Le message n'a pas pu être envoyé.");
}

export async function sendNewsletterWelcomeEmail(email: string) {
  const resend = getResend();
  if (!resend) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Bienvenue chez CBD",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
        <h1 style="font-size:20px;">Bienvenue !</h1>
        <p>Merci de vous être inscrit à notre newsletter. Vous recevrez nos meilleures offres et nouveautés CBD en avant-première.</p>
      </div>
    `,
  });
}
