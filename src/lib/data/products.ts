import { cache } from "react";
import type { Product, ProductCategory, ShippingRate } from "@/types";
import {
  STATIC_PRODUCTS,
  STATIC_SHIPPING_RATES,
} from "@/lib/data/catalog";
import { isSupabaseConfigured, withTimeout } from "@/lib/supabase/config";

function mapDbProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string,
    short_description: row.short_description as string,
    category: row.category as ProductCategory,
    price_cents: row.price_cents as number,
    compare_at_price_cents: row.compare_at_price_cents as number | null,
    thc_percent: Number(row.thc_percent),
    cbd_percent: Number(row.cbd_percent),
    weight_grams: row.weight_grams as number | null,
    stock: row.stock as number,
    sku: row.sku as string,
    image_url: row.image_url as string,
    images: (row.images as string[]) || [],
    coa_url: row.coa_url as string | null,
    is_featured: row.is_featured as boolean,
    is_active: row.is_active as boolean,
    tags: (row.tags as string[]) || [],
    created_at: row.created_at as string,
  };
}

function filterStaticProducts(options?: {
  category?: ProductCategory;
  featured?: boolean;
  search?: string;
}): Product[] {
  let products = STATIC_PRODUCTS.filter((p) => p.is_active);

  if (options?.category) {
    products = products.filter((p) => p.category === options.category);
  }
  if (options?.featured) {
    products = products.filter((p) => p.is_featured);
  }
  if (options?.search) {
    const q = options.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  return products;
}

async function fetchProductsFromDb(options?: {
  category?: ProductCategory;
  featured?: boolean;
  search?: string;
}): Promise<Product[] | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    let query = supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (options?.category) {
      query = query.eq("category", options.category);
    }
    if (options?.featured) {
      query = query.eq("is_featured", true);
    }
    if (options?.search) {
      query = query.or(
        `name.ilike.%${options.search}%,description.ilike.%${options.search}%`
      );
    }

    const result = await withTimeout(
      query.then((response) => response),
      1500,
      null
    );

    if (result && !result.error && result.data && result.data.length > 0) {
      return result.data.map(mapDbProduct);
    }
  } catch {
    // fallback to static catalog
  }

  return null;
}

export const getProducts = cache(async (options?: {
  category?: ProductCategory;
  featured?: boolean;
  search?: string;
}): Promise<Product[]> => {
  const fromDb = await fetchProductsFromDb(options);
  if (fromDb) return fromDb;
  return filterStaticProducts(options);
});

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const query = supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      const result = await withTimeout(
        query.then((response) => response),
        1500,
        null
      );

      if (result && !result.error && result.data) {
        return mapDbProduct(result.data);
      }
    } catch {
      // fallback
    }
  }

  return STATIC_PRODUCTS.find((p) => p.slug === slug && p.is_active) ?? null;
});

export async function getShippingRates(
  subtotalCents: number
): Promise<ShippingRate[]> {
  let rates = STATIC_SHIPPING_RATES;

  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const query = supabase
        .from("shipping_rates")
        .select("*")
        .eq("is_active", true);

      const result = await withTimeout(
        query.then((response) => response),
        1500,
        null
      );

      if (result && !result.error && result.data && result.data.length > 0) {
        rates = result.data.map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          price_cents: r.price_cents,
          min_order_cents: r.min_order_cents,
          estimated_days: r.estimated_days,
        }));
      }
    } catch {
      // fallback
    }
  }

  return rates.filter((r) => subtotalCents >= r.min_order_cents);
}

export { CATEGORIES, getBestShippingRate } from "@/lib/data/catalog";
