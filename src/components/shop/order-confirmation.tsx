"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, CreditCard, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BANK_DETAILS } from "@/lib/stripe";
import { loadDevOrder } from "@/lib/dev-checkout";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/types";
import type { Order, OrderItem } from "@/types";

interface OrderConfirmationProps {
  orderNumber: string;
  success?: string;
  dev?: string;
  serverOrder: Order | null;
}

export function OrderConfirmation({
  orderNumber,
  success,
  dev,
  serverOrder,
}: OrderConfirmationProps) {
  const [order, setOrder] = useState<(Order & { items?: OrderItem[] }) | null>(
    serverOrder
  );
  const isDev = dev === "1";

  useEffect(() => {
    if (serverOrder) {
      setOrder(serverOrder);
      return;
    }
    const devOrder = loadDevOrder(orderNumber);
    if (devOrder) setOrder(devOrder);
  }, [orderNumber, serverOrder]);

  const isPaidCard =
    order?.payment_method === "card" && order?.payment_status === "paid";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-stone-900">
          {success ? "Commande confirmée !" : "Détails de commande"}
        </h1>
        <p className="mt-2 text-stone-500">
          Numéro de commande : <strong>{orderNumber}</strong>
        </p>
        {isDev && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
            <FlaskConical className="h-3.5 w-3.5" />
            Commande simulée — mode développement
          </p>
        )}
      </div>

      {isPaidCard && success && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-start gap-3">
            <CreditCard className="mt-0.5 h-5 w-5 text-emerald-700" />
            <div>
              <h2 className="font-semibold text-emerald-900">
                Paiement par carte accepté
              </h2>
              <p className="mt-1 text-sm text-emerald-800">
                Votre paiement a été traité avec succès. Vous recevrez un email
                de confirmation à{" "}
                <strong>{order?.customer_email ?? "votre adresse"}</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {order && (
        <div className="mt-8 rounded-xl border border-stone-200 bg-white p-6">
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Statut</span>
            <span className="font-medium">
              {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS]}
            </span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-stone-500">Paiement</span>
            <span className="font-medium">
              {order.payment_method === "card" ? "Carte bancaire" : "Virement"}
              {order.payment_status === "paid" && " — Payé"}
            </span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-stone-500">Date</span>
            <span>{formatDate(order.created_at)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-stone-500">Total</span>
            <span className="font-bold text-emerald-800">
              {formatPrice(order.total_cents)}
            </span>
          </div>

          {order.items && order.items.length > 0 && (
            <div className="mt-6 border-t border-stone-100 pt-4">
              <p className="text-sm font-semibold text-stone-900">Articles</p>
              <ul className="mt-3 space-y-2">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between text-sm text-stone-600"
                  >
                    <span>
                      {item.product_name} × {item.quantity}
                    </span>
                    <span>{formatPrice(item.total_cents)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 border-t border-stone-100 pt-4 text-sm">
            <p className="font-semibold text-stone-900">Livraison</p>
            <p className="mt-1 text-stone-600">
              {order.shipping_first_name} {order.shipping_last_name}
            </p>
            <p className="text-stone-600">{order.shipping_address_line1}</p>
            <p className="text-stone-600">
              {order.shipping_postal_code} {order.shipping_city}
            </p>
          </div>
        </div>
      )}

      {(!order || order.payment_method === "bank_transfer") && !isPaidCard && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="font-semibold text-amber-900">Paiement par virement</h2>
          <p className="mt-2 text-sm text-amber-800">
            Veuillez effectuer votre virement avec les coordonnées suivantes.
            Indiquez votre numéro de commande en référence.
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-amber-700">Bénéficiaire</span>
              <span className="font-medium">{BANK_DETAILS.beneficiary}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-700">IBAN</span>
              <span className="font-mono font-medium">{BANK_DETAILS.iban}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-700">BIC</span>
              <span className="font-mono font-medium">{BANK_DETAILS.bic}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-700">Référence</span>
              <span className="font-medium">{orderNumber}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/compte/commandes">
          <Button variant="outline">Mes commandes</Button>
        </Link>
        <Link href="/boutique">
          <Button>Continuer mes achats</Button>
        </Link>
      </div>
    </div>
  );
}
