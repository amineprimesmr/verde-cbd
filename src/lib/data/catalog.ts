import type { Product, ProductCategory, ShippingRate, VapeSubcategory } from "@/types";

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
  {
    id: "fleurs",
    name: "Pre-rolls CBD",
    description: "Cigarettes pré-roulées, prêtes à l'emploi, en tube hermétique",
  },
  {
    id: "resines",
    name: "Résines CBD",
    description: "Pollen, hash et concentrés artisanaux",
  },
  {
    id: "vapes",
    name: "Vapes & E-liquides",
    description: "Pods rechargeables, e-liquides et boosters CBD",
  },
  {
    id: "accessoires",
    name: "Accessoires",
    description: "Briquets, feuilles, grinders et étuis",
  },
];

export const VAPE_SUBCATEGORIES: {
  id: VapeSubcategory;
  name: string;
}[] = [
  { id: "pods", name: "Pods" },
  { id: "recharge-classique", name: "Recharges classiques" },
  { id: "recharge-omega", name: "Gamme Omega H4CBD" },
  { id: "e-liquide", name: "E-liquides CBD" },
  { id: "booster", name: "Boosters CBD" },
];

export const STATIC_SHIPPING_RATES: ShippingRate[] = [
  { id: "ship-1", name: "Colissimo Standard", description: "Livraison à domicile en 3-5 jours ouvrés", price_cents: 590, min_order_cents: 0, estimated_days: "3-5 jours" },
  { id: "ship-2", name: "Colissimo Express", description: "Livraison express en 24-48h", price_cents: 990, min_order_cents: 0, estimated_days: "1-2 jours" },
  { id: "ship-3", name: "Point Relais", description: "Retrait en point relais Mondial Relay", price_cents: 390, min_order_cents: 0, estimated_days: "3-5 jours" },
  { id: "ship-4", name: "Livraison Gratuite", description: "Offerte dès 80€ d'achat", price_cents: 0, min_order_cents: 8000, estimated_days: "3-5 jours" },
];

const PREROLL_IMAGES = [
  "/images/Amnesia1.png",
  "/images/Amnesia2.png",
  "/images/Amnesia3.png",
  "/images/Amnesia4.png",
];

const RESINE_IMAGES = [
  "/images/resine1.png",
  "/images/resine2.png",
  "/images/resine3.png",
  "/images/resine4.png",
];

const POLLEN_PREMIUM_IMAGES = [
  "/images/pollen-premium-1.png",
  "/images/pollen-premium-2.png",
  "/images/pollen-premium-3.png",
  "/images/pollen-premium-4.png",
  "/images/pollen-premium-5.png",
];

const VAPE_IMAGES = [
  "/images/huile1.png",
  "/images/huile2.png",
  "/images/huile3.png",
  "/images/huile4.png",
];

const now = new Date().toISOString();

export const STATIC_PRODUCTS: Product[] = [
  // ── Pre-rolls (fleurs) ──────────────────────────────────────────
  {
    id: "1",
    name: "Pre-roll Amnesia Haze",
    slug: "pre-roll-amnesia-haze",
    description:
      "Cigarette pré-roulée Amnesia Haze, fleur indoor premium. 3 pre-rolls calibrés à 0,5g chacun, déjà roulés et conservés dans un tube hermétique aluminium. Profil citronné et épicé, effet relaxant. THC < 0,3%.",
    short_description: "Tube x3 pre-rolls, Amnesia Haze indoor, CBD 18%",
    category: "fleurs",
    price_cents: 1490,
    compare_at_price_cents: 1790,
    thc_percent: 0.2,
    cbd_percent: 18,
    weight_grams: 1.5,
    stock: 120,
    sku: "PRR-AHI-T3",
    image_url: PREROLL_IMAGES[0],
    images: PREROLL_IMAGES,
    coa_url: "/coa/amnesia-haze.pdf",
    is_featured: true,
    is_active: true,
    tags: ["pre-roll", "tube", "indoor"],
    created_at: now,
  },
  {
    id: "2",
    name: "Pre-roll OG Kush",
    slug: "pre-roll-og-kush",
    description:
      "Pre-rolls OG Kush greenhouse, notes terreuses et pinées. 3 cigarettes prêtes à l'emploi en tube hermétique. Idéal pour une détente en fin de journée sans préparation.",
    short_description: "Tube x3 pre-rolls, OG Kush greenhouse, CBD 15%",
    category: "fleurs",
    price_cents: 1290,
    compare_at_price_cents: null,
    thc_percent: 0.18,
    cbd_percent: 15,
    weight_grams: 1.5,
    stock: 150,
    sku: "PRR-OGK-T3",
    image_url: PREROLL_IMAGES[1],
    images: PREROLL_IMAGES,
    coa_url: "/coa/og-kush.pdf",
    is_featured: false,
    is_active: true,
    tags: ["pre-roll", "tube", "greenhouse"],
    created_at: now,
  },
  {
    id: "3",
    name: "Pre-roll Mango Kush",
    slug: "pre-roll-mango-kush",
    description:
      "Pre-rolls Mango Kush aux arômes fruités tropicaux. 3 cigarettes roulées à la main, conditionnées en tube étanche pour préserver fraîcheur et terpènes.",
    short_description: "Tube x3 pre-rolls, Mango Kush, arômes fruités, CBD 14%",
    category: "fleurs",
    price_cents: 1190,
    compare_at_price_cents: 1390,
    thc_percent: 0.15,
    cbd_percent: 14,
    weight_grams: 1.5,
    stock: 130,
    sku: "PRR-MGK-T3",
    image_url: PREROLL_IMAGES[2],
    images: PREROLL_IMAGES,
    coa_url: "/coa/mango-kush.pdf",
    is_featured: false,
    is_active: true,
    tags: ["pre-roll", "tube", "fruité"],
    created_at: now,
  },
  {
    id: "4",
    name: "Pack 4 Pre-rolls Assortis",
    slug: "pack-4-pre-rolls-assortis",
    description:
      "Pack découverte de 4 pre-rolls CBD variétés (Amnesia, OG Kush, Mango Kush, Purple Haze). Chaque cigarette est roulée et stockée dans son propre tube. Parfait pour tester nos références.",
    short_description: "4 tubes x1 pre-roll, variétés assorties, -15%",
    category: "fleurs",
    price_cents: 1990,
    compare_at_price_cents: 2390,
    thc_percent: 0.2,
    cbd_percent: 15,
    weight_grams: 2,
    stock: 60,
    sku: "PKT-PRR-4",
    image_url: PREROLL_IMAGES[3],
    images: PREROLL_IMAGES,
    coa_url: "/coa/pack-pre-rolls.pdf",
    is_featured: true,
    is_active: true,
    tags: ["pre-roll", "tube", "pack"],
    created_at: now,
  },

  // ── Résines ─────────────────────────────────────────────────────
  {
    id: "5",
    name: "Résine Pollen Premium",
    slug: "resine-pollen-premium",
    description:
      "Résine CBD type pollen, texture souple et aromatique. Extraction à froid pour préserver les terpènes naturels. Concentration élevée pour une expérience optimale.",
    short_description: "Pollen premium, texture souple, CBD 25%",
    category: "resines",
    price_cents: 1490,
    compare_at_price_cents: 1790,
    thc_percent: 0.25,
    cbd_percent: 25,
    weight_grams: 2,
    stock: 80,
    sku: "RES-POL-2G",
    image_url: POLLEN_PREMIUM_IMAGES[0],
    images: POLLEN_PREMIUM_IMAGES,
    detail_images: POLLEN_PREMIUM_IMAGES,
    coa_url: "/coa/pollen.pdf",
    is_featured: true,
    is_active: true,
    tags: ["pollen", "premium"],
    created_at: now,
  },
  {
    id: "6",
    name: "Hash CBD Dry Sift",
    slug: "hash-cbd-dry-sift",
    description:
      "Hash CBD obtenu par tamisage à sec (dry sift). Concentration en cannabinoïdes optimale, saveurs intenses et authentiques. 100% naturel, sans solvant.",
    short_description: "Hash dry sift artisanal, CBD 30%",
    category: "resines",
    price_cents: 1890,
    compare_at_price_cents: null,
    thc_percent: 0.22,
    cbd_percent: 30,
    weight_grams: 1,
    stock: 60,
    sku: "RES-DSF-1G",
    image_url: RESINE_IMAGES[1],
    images: RESINE_IMAGES,
    coa_url: "/coa/dry-sift.pdf",
    is_featured: false,
    is_active: true,
    tags: ["hash", "dry-sift"],
    created_at: now,
  },
  {
    id: "7",
    name: "Frozen Hash Charas",
    slug: "frozen-hash-charas",
    description:
      "Hash CBD frozen, méthode charas à basse température. Texture malléable, arômes profonds et effet relaxant marqué. Référence haut de gamme de notre gamme résines.",
    short_description: "Frozen hash charas, CBD 28%, texture premium",
    category: "resines",
    price_cents: 2290,
    compare_at_price_cents: 2690,
    thc_percent: 0.2,
    cbd_percent: 28,
    weight_grams: 1,
    stock: 45,
    sku: "RES-FRZ-1G",
    image_url: RESINE_IMAGES[2],
    images: RESINE_IMAGES,
    coa_url: "/coa/frozen-hash.pdf",
    is_featured: false,
    is_active: true,
    tags: ["hash", "frozen", "premium"],
    created_at: now,
  },
  {
    id: "8",
    name: "Skuff CBD 22%",
    slug: "skuff-cbd-22",
    description:
      "Skuff CBD finement tamisé, texture poudreuse et aromatique. Excellent rapport qualité-prix, idéal au quotidien. Analysé en laboratoire indépendant.",
    short_description: "Skuff CBD 22%, texture fine, bon rapport qualité-prix",
    category: "resines",
    price_cents: 1290,
    compare_at_price_cents: null,
    thc_percent: 0.2,
    cbd_percent: 22,
    weight_grams: 2,
    stock: 100,
    sku: "RES-SKF-2G",
    image_url: RESINE_IMAGES[3],
    images: RESINE_IMAGES,
    coa_url: "/coa/skuff.pdf",
    is_featured: false,
    is_active: true,
    tags: ["skuff", "pollen"],
    created_at: now,
  },

  // ── Vapes — Pods ────────────────────────────────────────────────
  {
    id: "9",
    name: "Pod Verde CBD Rechargeable",
    slug: "pod-verde-cbd-rechargeable",
    description:
      "Pod vape CBD rechargeable, design compact et discret. Batterie 400mAh, activation automatique à l'inhalation. Compatible avec toutes nos cartouches Verde. Câble USB-C inclus.",
    short_description: "Pod rechargeable 400mAh, activation auto, USB-C",
    category: "vapes",
    price_cents: 2490,
    compare_at_price_cents: 2990,
    thc_percent: 0,
    cbd_percent: 0,
    weight_grams: null,
    stock: 90,
    sku: "VAP-POD-01",
    image_url: VAPE_IMAGES[0],
    images: VAPE_IMAGES,
    coa_url: null,
    is_featured: true,
    is_active: true,
    tags: ["pods"],
    created_at: now,
  },
  {
    id: "10",
    name: "Recharge Pod Menthe Classique",
    slug: "recharge-pod-menthe-classique",
    description:
      "Cartouche de recharge pour pod Verde. Arôme menthe fraîche, 500mg de CBD full spectrum. Format 2ml, environ 300 bouffées. Effet relaxant doux et progressif.",
    short_description: "Cartouche 500mg CBD, menthe classique, 2ml",
    category: "vapes",
    price_cents: 990,
    compare_at_price_cents: null,
    thc_percent: 0.2,
    cbd_percent: 25,
    weight_grams: null,
    stock: 150,
    sku: "VAP-RCG-MEN",
    image_url: VAPE_IMAGES[1],
    images: VAPE_IMAGES,
    coa_url: "/coa/recharge-menthe.pdf",
    is_featured: false,
    is_active: true,
    tags: ["recharge-classique", "menthe"],
    created_at: now,
  },
  {
    id: "11",
    name: "Recharge Pod Mangue Classique",
    slug: "recharge-pod-mangue-classique",
    description:
      "Cartouche de recharge pour pod Verde. Arôme mangue tropicale, 500mg de CBD full spectrum. Format 2ml, effet apaisant et saveur fruitée naturelle.",
    short_description: "Cartouche 500mg CBD, mangue tropicale, 2ml",
    category: "vapes",
    price_cents: 990,
    compare_at_price_cents: null,
    thc_percent: 0.2,
    cbd_percent: 25,
    weight_grams: null,
    stock: 140,
    sku: "VAP-RCG-MAN",
    image_url: VAPE_IMAGES[2],
    images: VAPE_IMAGES,
    coa_url: "/coa/recharge-mangue.pdf",
    is_featured: false,
    is_active: true,
    tags: ["recharge-classique", "mangue"],
    created_at: now,
  },
  {
    id: "12",
    name: "Recharge Pod Omega H4CBD",
    slug: "recharge-pod-omega-h4cbd",
    description:
      "Cartouche gamme Omega enrichie en H4CBD pour un effet plus puissant et rapide. 800mg de cannabinoïdes, arôme fruits rouges. Réservée aux utilisateurs expérimentés. Compatible pod Verde.",
    short_description: "Gamme Omega, H4CBD 800mg, effet puissant, fruits rouges",
    category: "vapes",
    price_cents: 1490,
    compare_at_price_cents: 1790,
    thc_percent: 0.2,
    cbd_percent: 40,
    weight_grams: null,
    stock: 70,
    sku: "VAP-RCG-OMG",
    image_url: VAPE_IMAGES[3],
    images: VAPE_IMAGES,
    coa_url: "/coa/recharge-omega.pdf",
    is_featured: true,
    is_active: true,
    tags: ["recharge-omega", "h4cbd", "omega"],
    created_at: now,
  },

  // ── Vapes — E-liquides & Boosters ───────────────────────────────
  {
    id: "13",
    name: "E-liquide CBD Classic 300mg",
    slug: "e-liquide-cbd-classic-300mg",
    description:
      "E-liquide CBD 10ml, 300mg de cannabidiol full spectrum. Arôme chanvre naturel, base 50/50 PG/VG. Compatible toutes cigarettes électroniques classiques. Sans nicotine.",
    short_description: "E-liquide 10ml, 300mg CBD, arôme chanvre naturel",
    category: "vapes",
    price_cents: 1290,
    compare_at_price_cents: null,
    thc_percent: 0.2,
    cbd_percent: 3,
    weight_grams: null,
    stock: 120,
    sku: "ELQ-CL3-10ML",
    image_url: VAPE_IMAGES[0],
    images: VAPE_IMAGES,
    coa_url: "/coa/eliquide-300.pdf",
    is_featured: false,
    is_active: true,
    tags: ["e-liquide", "classic"],
    created_at: now,
  },
  {
    id: "14",
    name: "E-liquide CBD Relax 600mg",
    slug: "e-liquide-cbd-relax-600mg",
    description:
      "E-liquide CBD haute concentration 600mg/10ml. Formule relax enrichie en terpènes naturels (myrcène, linalool). Arôme fruits des bois. Idéal en fin de journée.",
    short_description: "E-liquide 10ml, 600mg CBD, formule relax",
    category: "vapes",
    price_cents: 1890,
    compare_at_price_cents: 2190,
    thc_percent: 0.2,
    cbd_percent: 6,
    weight_grams: null,
    stock: 85,
    sku: "ELQ-RL6-10ML",
    image_url: VAPE_IMAGES[1],
    images: VAPE_IMAGES,
    coa_url: "/coa/eliquide-600.pdf",
    is_featured: true,
    is_active: true,
    tags: ["e-liquide", "relax"],
    created_at: now,
  },
  {
    id: "15",
    name: "Booster CBD 1000mg",
    slug: "booster-cbd-1000mg",
    description:
      "Booster CBD neutre 10ml, 1000mg de cannabidiol. À mélanger avec votre e-liquide préféré pour créer votre dosage idéal. Format 10ml, base 100% PG. Sans arôme ajouté.",
    short_description: "Booster 10ml, 1000mg CBD, neutre, à diluer",
    category: "vapes",
    price_cents: 1690,
    compare_at_price_cents: null,
    thc_percent: 0.2,
    cbd_percent: 10,
    weight_grams: null,
    stock: 95,
    sku: "BST-CBD-10ML",
    image_url: VAPE_IMAGES[2],
    images: VAPE_IMAGES,
    coa_url: "/coa/booster-1000.pdf",
    is_featured: false,
    is_active: true,
    tags: ["booster"],
    created_at: now,
  },

  // ── Accessoires ─────────────────────────────────────────────────
  {
    id: "16",
    name: "Briquet Clipper Verde",
    slug: "briquet-clipper-verde",
    description:
      "Briquet Clipper classique édition Verde CBD. Rechargeable, pierre amovible, format poche. Indispensable pour allumer vos pre-rolls en toute sécurité.",
    short_description: "Briquet Clipper rechargeable, édition Verde",
    category: "accessoires",
    price_cents: 390,
    compare_at_price_cents: null,
    thc_percent: 0,
    cbd_percent: 0,
    weight_grams: null,
    stock: 200,
    sku: "ACC-BRI-01",
    image_url: "https://images.unsplash.com/photo-1603906835853-f61e1b4d2f48?w=800&q=80",
    images: [],
    coa_url: null,
    is_featured: false,
    is_active: true,
    tags: ["briquet"],
    created_at: now,
  },
  {
    id: "17",
    name: "Feuilles OCB Premium x50",
    slug: "feuilles-ocb-premium-x50",
    description:
      "Paquet de 50 feuilles à rouler OCB Premium slim. Papier ultra-fin, gomme arabique naturelle. La référence des fumeurs exigeants.",
    short_description: "50 feuilles OCB Premium slim, gomme naturelle",
    category: "accessoires",
    price_cents: 250,
    compare_at_price_cents: null,
    thc_percent: 0,
    cbd_percent: 0,
    weight_grams: null,
    stock: 300,
    sku: "ACC-OCB-50",
    image_url: "https://images.unsplash.com/photo-1603906835853-f61e1b4d2f48?w=800&q=80",
    images: [],
    coa_url: null,
    is_featured: false,
    is_active: true,
    tags: ["feuilles", "ocb"],
    created_at: now,
  },
  {
    id: "18",
    name: "Grinder Aluminium 2 parties",
    slug: "grinder-aluminium-2-parties",
    description:
      "Grinder aluminium 2 parties, diamètre 50mm. Dents diamantées pour un broyage homogène. Compact, robuste et discret.",
    short_description: "Grinder alu 50mm, 2 parties, broyage homogène",
    category: "accessoires",
    price_cents: 990,
    compare_at_price_cents: 1290,
    thc_percent: 0,
    cbd_percent: 0,
    weight_grams: null,
    stock: 110,
    sku: "ACC-GRD-50",
    image_url: "https://images.unsplash.com/photo-1603906835853-f61e1b4d2f48?w=800&q=80",
    images: [],
    coa_url: null,
    is_featured: false,
    is_active: true,
    tags: ["grinder"],
    created_at: now,
  },
  {
    id: "19",
    name: "Étui Tube Pre-roll",
    slug: "etui-tube-pre-roll",
    description:
      "Étui tube aluminium hermétique pour conserver vos pre-rolls. Format standard 115mm, joint étanche, protection lumière et humidité. Réutilisable à l'infini.",
    short_description: "Tube alu hermétique 115mm, conservation pre-rolls",
    category: "accessoires",
    price_cents: 490,
    compare_at_price_cents: null,
    thc_percent: 0,
    cbd_percent: 0,
    weight_grams: null,
    stock: 180,
    sku: "ACC-TUB-01",
    image_url: PREROLL_IMAGES[0],
    images: [PREROLL_IMAGES[0]],
    coa_url: null,
    is_featured: false,
    is_active: true,
    tags: ["etui", "tube"],
    created_at: now,
  },
];
