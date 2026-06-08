export type ProductCategory =
  | "fleurs"
  | "resines"
  | "vapes"
  | "accessoires";

export type VapeSubcategory =
  | "pods"
  | "recharge-classique"
  | "recharge-omega"
  | "e-liquide"
  | "booster";

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentMethod = "card" | "bank_transfer";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  category: ProductCategory;
  price_cents: number;
  compare_at_price_cents: number | null;
  thc_percent: number;
  cbd_percent: number;
  weight_grams: number | null;
  stock: number;
  sku: string;
  image_url: string;
  images: string[];
  detail_images?: string[];
  coa_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  tags: string[];
  created_at: string;
}

export interface Category {
  id: ProductCategory;
  name: string;
  description: string;
  icon: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
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
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price_cents: number;
  total_cents: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
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
  items?: OrderItem[];
}

export interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: "customer" | "admin";
  age_verified: boolean;
  created_at: string;
}

export interface ShippingRate {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  min_order_cents: number;
  estimated_days: string;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  fleurs: "Pre-rolls CBD",
  resines: "Résines",
  vapes: "Vapes & E-liquides",
  accessoires: "Accessoires",
};

export const VAPE_SUBCATEGORY_LABELS: Record<VapeSubcategory, string> = {
  pods: "Pods",
  "recharge-classique": "Recharges classiques",
  "recharge-omega": "Gamme Omega H4CBD",
  "e-liquide": "E-liquides CBD",
  booster: "Boosters CBD",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "En attente",
  paid: "Payée",
  processing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
  refunded: "Remboursée",
};
