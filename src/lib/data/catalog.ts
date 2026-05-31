import type { Product, ProductCategory, ShippingRate } from "@/types";

export const FREE_SHIPPING_THRESHOLD = 8000;

export function calculateTax(subtotalCents: number): number {
  return Math.round(subtotalCents * 0.2);
}

export function calculateOrderTotal(
  subtotalCents: number,
  shippingCents: number
): { subtotal: number; shipping: number; tax: number; total: number } {
  const tax = calculateTax(subtotalCents);
  const total = subtotalCents + shippingCents + tax;
  return {
    subtotal: subtotalCents,
    shipping: shippingCents,
    tax,
    total,
  };
}

export function getBestShippingRate(
  rates: ShippingRate[],
  subtotalCents: number
): ShippingRate {
  const eligible = rates.filter((r) => subtotalCents >= r.min_order_cents);
  if (subtotalCents >= FREE_SHIPPING_THRESHOLD) {
    const free = eligible.find((r) => r.price_cents === 0);
    if (free) return free;
  }
  return eligible.sort((a, b) => a.price_cents - b.price_cents)[0] ?? rates[0];
}

export const CATEGORIES: {
  id: ProductCategory;
  name: string;
  description: string;
}[] = [
  { id: "fleurs", name: "Fleurs CBD", description: "Fleurs de chanvre premium, indoor & outdoor" },
  { id: "resines", name: "Résines", description: "Pollen, hash et concentrés CBD" },
  { id: "huiles", name: "Huiles CBD", description: "Huiles full & broad spectrum" },
  { id: "cosmetiques", name: "Cosmétiques", description: "Baumes, crèmes et soins au CBD" },
  { id: "infusions", name: "Infusions", description: "Tisanes et infusions de chanvre bio" },
];

export const STATIC_SHIPPING_RATES: ShippingRate[] = [
  { id: "ship-1", name: "Colissimo Standard", description: "Livraison à domicile en 3-5 jours ouvrés", price_cents: 590, min_order_cents: 0, estimated_days: "3-5 jours" },
  { id: "ship-2", name: "Colissimo Express", description: "Livraison express en 24-48h", price_cents: 990, min_order_cents: 0, estimated_days: "1-2 jours" },
  { id: "ship-3", name: "Point Relais", description: "Retrait en point relais Mondial Relay", price_cents: 390, min_order_cents: 0, estimated_days: "3-5 jours" },
  { id: "ship-4", name: "Livraison Gratuite", description: "Offerte dès 80€ d'achat", price_cents: 0, min_order_cents: 8000, estimated_days: "3-5 jours" },
];

const AMNESIA_IMAGES = [
  "/images/Amnesia1.png",
  "/images/Amnesia2.png",
  "/images/Amnesia3.png",
  "/images/Amnesia4.png",
];

const OG_KUSH_IMAGES = [
  "/images/produit.png",
  "/images/produit copie.png",
  "/images/produit copie 2.png",
  "/images/produit copie 3.png",
];

const PURPLE_HAZE_IMAGES = [
  "/images/28caf18d-db04-4674-8caf-a3855ac143bd.png",
];

const HUILE_IMAGES = [
  "/images/huile1.png",
  "/images/huile2.png",
  "/images/huile3.png",
  "/images/huile4.png",
];

const RESINE_IMAGES = [
  "/images/resine1.png",
  "/images/resine2.png",
  "/images/resine3.png",
  "/images/resine4.png",
];

export const STATIC_PRODUCTS: Product[] = [
  {
    id: "1", name: "Amnesia Haze Indoor", slug: "amnesia-haze-indoor",
    description: "Fleur de CBD Amnesia Haze cultivée en indoor sous éclairage LED. Profil aromatique citronné et épicé, effet relaxant sans psychoactivité.",
    short_description: "Fleur premium indoor, arômes citronnés, CBD 18%",
    category: "fleurs", price_cents: 1290, compare_at_price_cents: 1590, thc_percent: 0.2, cbd_percent: 18,
    weight_grams: 2, stock: 150, sku: "FLR-AHI-2G",
    image_url: AMNESIA_IMAGES[0],
    images: AMNESIA_IMAGES,
    coa_url: "/coa/amnesia-haze.pdf", is_featured: true, is_active: true, tags: ["indoor", "premium"], created_at: new Date().toISOString(),
  },
  {
    id: "2", name: "OG Kush Greenhouse", slug: "og-kush-greenhouse",
    description: "Fleur de CBD OG Kush cultivée en greenhouse. Notes terreuses et pinées.",
    short_description: "Fleur greenhouse, profil terreux, CBD 15%",
    category: "fleurs", price_cents: 990, compare_at_price_cents: null, thc_percent: 0.18, cbd_percent: 15,
    weight_grams: 2, stock: 200, sku: "FLR-OGK-2G",
    image_url: AMNESIA_IMAGES[0],
    images: [AMNESIA_IMAGES[0], ...OG_KUSH_IMAGES], coa_url: "/coa/og-kush.pdf", is_featured: true, is_active: true, tags: ["greenhouse"], created_at: new Date().toISOString(),
  },
  {
    id: "3", name: "Purple Haze Outdoor", slug: "purple-haze-outdoor",
    description: "Fleur de CBD Purple Haze en culture outdoor bio.",
    short_description: "Fleur outdoor bio, arômes fruités, CBD 12%",
    category: "fleurs", price_cents: 790, compare_at_price_cents: 990, thc_percent: 0.15, cbd_percent: 12,
    weight_grams: 2, stock: 180, sku: "FLR-PHO-2G",
    image_url: AMNESIA_IMAGES[0],
    images: [AMNESIA_IMAGES[0], ...PURPLE_HAZE_IMAGES], coa_url: "/coa/purple-haze.pdf", is_featured: false, is_active: true, tags: ["outdoor", "bio"], created_at: new Date().toISOString(),
  },
  {
    id: "4", name: "Résine CBD Pollen Premium", slug: "resine-cbd-pollen-premium",
    description: "Résine de CBD type pollen, texture souple et aromatique.",
    short_description: "Pollen premium, texture souple, CBD 25%",
    category: "resines", price_cents: 1490, compare_at_price_cents: 1790, thc_percent: 0.25, cbd_percent: 25,
    weight_grams: 2, stock: 80, sku: "RES-POL-2G",
    image_url: RESINE_IMAGES[0],
    images: RESINE_IMAGES, coa_url: "/coa/pollen.pdf", is_featured: true, is_active: true, tags: ["pollen"], created_at: new Date().toISOString(),
  },
  {
    id: "5", name: "Hash CBD Dry Sift", slug: "hash-cbd-dry-sift",
    description: "Hash CBD obtenu par tamisage à sec.",
    short_description: "Hash dry sift, CBD 30%",
    category: "resines", price_cents: 1890, compare_at_price_cents: null, thc_percent: 0.22, cbd_percent: 30,
    weight_grams: 1, stock: 60, sku: "RES-DSF-1G",
    image_url: RESINE_IMAGES[0],
    images: RESINE_IMAGES, coa_url: "/coa/dry-sift.pdf", is_featured: false, is_active: true, tags: ["hash"], created_at: new Date().toISOString(),
  },
  {
    id: "6", name: "Huile CBD Full Spectrum 10%", slug: "huile-cbd-full-spectrum-10",
    description: "Huile de CBD full spectrum 10% (1000mg/10ml).",
    short_description: "Huile full spectrum 10%, 1000mg CBD",
    category: "huiles", price_cents: 3490, compare_at_price_cents: 3990, thc_percent: 0.2, cbd_percent: 10,
    weight_grams: null, stock: 120, sku: "HUI-FS10-10ML",
    image_url: HUILE_IMAGES[0],
    images: HUILE_IMAGES, coa_url: "/coa/huile-10.pdf", is_featured: true, is_active: true, tags: ["full-spectrum"], created_at: new Date().toISOString(),
  },
  {
    id: "7", name: "Huile CBD Broad Spectrum 20%", slug: "huile-cbd-broad-spectrum-20",
    description: "Huile de CBD broad spectrum 20% (2000mg/10ml).",
    short_description: "Huile broad spectrum 20%, sans THC",
    category: "huiles", price_cents: 5490, compare_at_price_cents: null, thc_percent: 0, cbd_percent: 20,
    weight_grams: null, stock: 90, sku: "HUI-BS20-10ML",
    image_url: HUILE_IMAGES[0],
    images: HUILE_IMAGES, coa_url: "/coa/huile-20.pdf", is_featured: true, is_active: true, tags: ["broad-spectrum"], created_at: new Date().toISOString(),
  },
  {
    id: "8", name: "Baume CBD Muscles & Articulations", slug: "baume-cbd-muscles-articulations",
    description: "Baume chauffant au CBD et arnica.",
    short_description: "Baume chauffant CBD + arnica, 50ml",
    category: "cosmetiques", price_cents: 2490, compare_at_price_cents: null, thc_percent: 0, cbd_percent: 5,
    weight_grams: null, stock: 100, sku: "COS-BAU-50ML",
    image_url: "https://images.unsplash.com/photo-1556228578-0d53f288f062?w=800&q=80",
    images: [], coa_url: "/coa/baume.pdf", is_featured: false, is_active: true, tags: ["topique"], created_at: new Date().toISOString(),
  },
  {
    id: "9", name: "Crème Visage CBD Anti-âge", slug: "creme-visage-cbd-anti-age",
    description: "Crème visage au CBD et acide hyaluronique.",
    short_description: "Crème visage CBD, anti-âge, 30ml",
    category: "cosmetiques", price_cents: 2990, compare_at_price_cents: 3490, thc_percent: 0, cbd_percent: 3,
    weight_grams: null, stock: 75, sku: "COS-CRE-30ML",
    image_url: "https://images.unsplash.com/photo-1570194065650-d99fb4b3c2a1?w=800&q=80",
    images: [], coa_url: "/coa/creme.pdf", is_featured: false, is_active: true, tags: ["visage"], created_at: new Date().toISOString(),
  },
  {
    id: "10", name: "Infusion Chanvre Bio Nuit", slug: "infusion-chanvre-bio-nuit",
    description: "Infusion de fleurs et feuilles de chanvre bio.",
    short_description: "Infusion chanvre bio, 20 sachets",
    category: "infusions", price_cents: 1290, compare_at_price_cents: null, thc_percent: 0, cbd_percent: 2,
    weight_grams: null, stock: 150, sku: "INF-NUIT-20",
    image_url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80",
    images: [], coa_url: "/coa/infusion-nuit.pdf", is_featured: false, is_active: true, tags: ["infusion"], created_at: new Date().toISOString(),
  },
  {
    id: "12", name: "Pack Découverte Fleurs", slug: "pack-decouverte-fleurs",
    description: "Pack découverte de 3 fleurs CBD — 1g de chaque.",
    short_description: "3 fleurs x 1g, pack découverte -15%",
    category: "fleurs", price_cents: 2490, compare_at_price_cents: 2970, thc_percent: 0.2, cbd_percent: 15,
    weight_grams: 3, stock: 50, sku: "PKT-DEC-3G",
    image_url: AMNESIA_IMAGES[0],
    images: AMNESIA_IMAGES, coa_url: "/coa/pack-decouverte.pdf", is_featured: true, is_active: true, tags: ["pack"], created_at: new Date().toISOString(),
  },
];
