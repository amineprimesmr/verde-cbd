import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Administration" };

export default async function AdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion?redirect=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  const { count: pendingOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .in("status", ["pending", "paid"]);

  const { count: totalProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  const { data: revenueData } = await supabase
    .from("orders")
    .select("total_cents")
    .in("payment_status", ["paid"]);

  const totalRevenue =
    revenueData?.reduce((sum, o) => sum + o.total_cents, 0) ?? 0;

  const stats = [
    { label: "Commandes", value: totalOrders ?? 0, icon: Package },
    { label: "En attente", value: pendingOrders ?? 0, icon: TrendingUp },
    { label: "Produits", value: totalProducts ?? 0, icon: ShoppingBag },
    { label: "Revenus", value: formatPrice(totalRevenue), icon: Users },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-stone-900">Administration</h1>
        <div className="flex gap-2">
          <Link href="/admin/commandes" className="text-sm text-emerald-700 hover:underline">
            Commandes
          </Link>
          <Link href="/admin/produits" className="text-sm text-emerald-700 hover:underline">
            Produits
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-stone-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-500">{label}</span>
              <Icon className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-stone-900">{value}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-bold text-stone-900">Dernières commandes</h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200 bg-stone-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">N° Commande</th>
              <th className="px-4 py-3 text-left font-medium">Client</th>
              <th className="px-4 py-3 text-left font-medium">Statut</th>
              <th className="px-4 py-3 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order.id} className="border-b border-stone-100">
                <td className="px-4 py-3">
                  <Link href={`/admin/commandes/${order.id}`} className="text-emerald-700 hover:underline">
                    {order.order_number}
                  </Link>
                </td>
                <td className="px-4 py-3">{order.customer_email}</td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">
                    {ORDER_STATUS_LABELS[order.status as OrderStatus]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatPrice(order.total_cents)}
                </td>
              </tr>
            ))}
            {!orders?.length && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-stone-500">
                  Aucune commande
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
