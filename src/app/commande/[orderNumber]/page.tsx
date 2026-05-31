import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { OrderConfirmation } from "@/components/shop/order-confirmation";
import type { Order } from "@/types";

interface PageProps {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ success?: string; dev?: string }>;
}

async function getOrder(orderNumber: string): Promise<Order | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const { data: order } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("order_number", orderNumber)
      .single();

    if (!order) return null;

    const { order_items, ...rest } = order as Order & {
      order_items?: Order["items"];
    };

    return {
      ...rest,
      items: order_items,
    };
  } catch {
    return null;
  }
}

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: PageProps) {
  const { orderNumber } = await params;
  const { success, dev } = await searchParams;
  const order = await getOrder(orderNumber);

  return (
    <OrderConfirmation
      orderNumber={orderNumber}
      success={success}
      dev={dev}
      serverOrder={order}
    />
  );
}
