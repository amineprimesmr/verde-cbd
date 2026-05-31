export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type ProfileRow = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: "customer" | "admin";
  age_verified: boolean;
  created_at: string;
  updated_at: string;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  category: string;
  price_cents: number;
  compare_at_price_cents: number | null;
  thc_percent: number;
  cbd_percent: number;
  weight_grams: number | null;
  stock: number;
  sku: string;
  image_url: string;
  images: Json;
  coa_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
};

type AddressRow = {
  id: string;
  user_id: string;
  label: string;
  first_name: string;
  last_name: string;
  company: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
  created_at: string;
};

type OrderRow = {
  id: string;
  order_number: string;
  user_id: string | null;
  status: string;
  payment_method: string;
  payment_status: string;
  stripe_payment_intent_id: string | null;
  subtotal_cents: number;
  shipping_cents: number;
  tax_cents: number;
  total_cents: number;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_company: string | null;
  shipping_address_line1: string;
  shipping_address_line2: string | null;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  shipping_phone: string;
  billing_first_name: string;
  billing_last_name: string;
  billing_address_line1: string;
  billing_address_line2: string | null;
  billing_city: string;
  billing_postal_code: string;
  billing_country: string;
  customer_email: string;
  customer_notes: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
};

type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price_cents: number;
  total_cents: number;
};

type ShippingRateRow = {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  min_order_cents: number;
  estimated_days: string;
  is_active: boolean;
  created_at: string;
};

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> & { id: string; email: string };
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      products: {
        Row: ProductRow;
        Insert: Omit<ProductRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<ProductRow>;
        Relationships: [];
      };
      addresses: {
        Row: AddressRow;
        Insert: Omit<AddressRow, "id" | "created_at"> & { id?: string };
        Update: Partial<AddressRow>;
        Relationships: [];
      };
      orders: {
        Row: OrderRow;
        Insert: Omit<OrderRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<OrderRow>;
        Relationships: [];
      };
      order_items: {
        Row: OrderItemRow;
        Insert: Omit<OrderItemRow, "id"> & { id?: string };
        Update: Partial<OrderItemRow>;
        Relationships: [];
      };
      shipping_rates: {
        Row: ShippingRateRow;
        Insert: Omit<ShippingRateRow, "id" | "created_at"> & { id?: string };
        Update: Partial<ShippingRateRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
