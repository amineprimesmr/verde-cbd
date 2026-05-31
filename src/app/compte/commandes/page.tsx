import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, type Order, type OrderStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Mes commandes" };

export default async function CommandesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion?redirect=/compte/commandes");

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orderList = (orders ?? []) as Order[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/compte" className="text-sm text-emerald-700 hover:underline">
        ← Retour au compte
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-stone-900">Mes commandes</h1>

      {!orderList.length ? (
        <div className="mt-8 py-16 text-center">
          <p className="text-stone-500">Vous n&apos;avez pas encore passé de commande</p>
          <Link href="/boutique" className="mt-4 inline-block text-emerald-700 hover:underline">
            Découvrir la boutique
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orderList.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-stone-200 bg-white p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <Link
                    href={`/commande/${order.order_number}`}
                    className="font-semibold text-emerald-800 hover:underline"
                  >
                    {order.order_number}
                  </Link>
                  <p className="text-sm text-stone-500">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      order.status === "delivered"
                        ? "success"
                        : order.status === "cancelled"
                          ? "outline"
                          : "default"
                    }
                  >
                    {ORDER_STATUS_LABELS[order.status as OrderStatus]}
                  </Badge>
                  <span className="font-bold">{formatPrice(order.total_cents)}</span>
                </div>
              </div>
              {order.tracking_number && (
                <p className="mt-2 text-sm text-stone-500">
                  Suivi : {order.tracking_number}
                  {order.tracking_url && (
                    <>
                      {" — "}
                      <a
                        href={order.tracking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:underline"
                      >
                        Suivre le colis
                      </a>
                    </>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
