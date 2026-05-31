"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

interface OrderRow {
  id: string;
  order_number: string;
  customer_email: string;
  status: OrderStatus;
  payment_status: string;
  total_cents: number;
  created_at: string;
  tracking_number: string | null;
}

export default function AdminCommandesPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [tracking, setTracking] = useState({ number: "", url: "" });
  const [status, setStatus] = useState<OrderStatus>("processing");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/connexion");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      router.push("/");
      return;
    }

    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    setOrders((data as OrderRow[]) ?? []);
    setLoading(false);
  }

  async function updateOrder(orderId: string) {
    const supabase = createClient();
    const updates: {
      status: OrderStatus;
      tracking_number?: string;
      tracking_url?: string;
      shipped_at?: string;
      delivered_at?: string;
      payment_status?: string;
    } = { status };

    if (status === "shipped") {
      updates.tracking_number = tracking.number;
      updates.tracking_url = tracking.url;
      updates.shipped_at = new Date().toISOString();
    }
    if (status === "delivered") {
      updates.delivered_at = new Date().toISOString();
    }
    if (status === "paid") {
      updates.payment_status = "paid";
    }

    await supabase.from("orders").update(updates).eq("id", orderId);
    setSelectedOrder(null);
    loadOrders();
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/admin" className="text-sm text-emerald-700 hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-stone-900">Gestion des commandes</h1>

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border border-stone-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{order.order_number}</p>
                <p className="text-sm text-stone-500">{order.customer_email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge>{ORDER_STATUS_LABELS[order.status]}</Badge>
                <span className="font-bold">{formatPrice(order.total_cents)}</span>
                <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order.id)}>
                  Gérer
                </Button>
              </div>
            </div>

            {selectedOrder === order.id && (
              <div className="mt-4 border-t border-stone-100 pt-4 space-y-4">
                <div>
                  <Label>Nouveau statut</Label>
                  <select
                    className="mt-1 w-full rounded-lg border border-stone-200 p-2 text-sm"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  >
                    {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                {status === "shipped" && (
                  <>
                    <div>
                      <Label>N° de suivi</Label>
                      <Input className="mt-1" value={tracking.number} onChange={(e) => setTracking({ ...tracking, number: e.target.value })} />
                    </div>
                    <div>
                      <Label>URL de suivi</Label>
                      <Input className="mt-1" value={tracking.url} onChange={(e) => setTracking({ ...tracking, url: e.target.value })} />
                    </div>
                  </>
                )}
                <Button onClick={() => updateOrder(order.id)}>Mettre à jour</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
