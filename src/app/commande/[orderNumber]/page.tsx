import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { OrderConfirmation } from "@/components/shop/order-confirmation";
import type { Order } from "@/types";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { verifyOrderAccessToken } from "@/lib/order-access";

interface PageProps {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ success?: string; dev?: string; token?: string }>;
}

async function getOrder(orderNumber: string, token?: string): Promise<Order | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = verifyOrderAccessToken(orderNumber, token)
      ? getSupabaseAdmin()
      : await createClient();
    if (!supabase) return null;
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
  const { success, dev, token } = await searchParams;
  const order = await getOrder(orderNumber, token);

  return (
    <OrderConfirmation
      orderNumber={orderNumber}
      success={success}
      dev={dev}
      serverOrder={order}
    />
  );
}
