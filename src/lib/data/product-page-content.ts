import type { Product, ProductCategory } from "@/types";

export const PRODUCT_REVIEW_COUNT = 2480;
export const PRODUCT_RATING = 4.8;

export function getProductBenefits(category: ProductCategory) {
  const common = [
    { emoji: "🧘", label: "Relaxation naturelle" },
    { emoji: "😌", label: "Réduit le stress" },
    { emoji: "✅", label: "100% légal en France" },
    { emoji: "😴", label: "Favorise le sommeil" },
  ];

  const byCategory: Partial<Record<ProductCategory, typeof common>> = {
    fleurs: [
      { emoji: "🌿", label: "Arômes authentiques" },
      { emoji: "😌", label: "Effet relaxant" },
      { emoji: "✅", label: "THC < 0,3%" },
      { emoji: "🔬", label: "Analysé en laboratoire" },
    ],
    huiles: [
      { emoji: "💧", label: "Absorption optimale" },
      { emoji: "😌", label: "Apaise au quotidien" },
      { emoji: "✅", label: "Full & broad spectrum" },
      { emoji: "😴", label: "Favorise le sommeil" },
    ],
    resines: [
      { emoji: "✨", label: "Concentration élevée" },
      { emoji: "😌", label: "Relaxation profonde" },
      { emoji: "✅", label: "THC < 0,3%" },
      { emoji: "🔬", label: "COA disponible" },
    ],
  };

  return byCategory[category] ?? common;
}

export const STORY_RINGS = [
  { id: "reviews", label: "Avis clients", image: "reviews" },
  { id: "composition", label: "Composition", image: "composition" },
  { id: "usage", label: "Utilisation", image: "usage" },
  { id: "faq", label: "Questions fréquentes", image: "faq" },
] as const;

export const TESTIMONIALS = [
  {
    title: "Qualité exceptionnelle",
    text: "Produit premium, livraison rapide. Les arômes sont authentiques et l'effet relaxant est bien présent sans sensation de grogginess.",
    author: "Sophie A.",
    rating: 5,
  },
  {
    title: "Enfin une marque sérieuse",
    text: "Certificat d'analyse disponible, service client réactif. Je recommande Verde CBD les yeux fermés.",
    author: "Thomas L.",
    rating: 5,
  },
  {
    title: "Transformée",
    text: "J'utilise ce produit depuis 3 mois dans ma routine bien-être. La qualité est constante et le rapport qualité-prix excellent.",
    author: "Marie D.",
    rating: 5,
  },
];

export const RATING_BREAKDOWN = [
  { stars: 5, count: 1860 },
  { stars: 4, count: 420 },
  { stars: 3, count: 120 },
  { stars: 2, count: 50 },
  { stars: 1, count: 30 },
];

export function getProductFaqs(category: ProductCategory) {
  const base = [
    {
      q: "Combien de temps dure une cure idéale ?",
      a: "Nous recommandons une utilisation régulière sur 4 à 8 semaines pour observer les effets optimaux, puis une pause si nécessaire.",
    },
    {
      q: "Existe-t-il des effets indésirables ?",
      a: "Le CBD est généralement bien toléré. Consultez un professionnel de santé si vous suivez un traitement médical.",
    },
    {
      q: "Quelles sont les contre-indications ?",
      a: "Réservé aux personnes majeures (+18 ans). Déconseillé aux femmes enceintes ou allaitantes sans avis médical.",
    },
    {
      q: "Quand vais-je constater les effets ?",
      a: "Les effets varient selon les personnes. La plupart de nos clients ressentent une différence dès la première semaine d'utilisation régulière.",
    },
  ];

  if (category === "huiles") {
    return [
      {
        q: "Comment utiliser l'huile CBD ?",
        a: "Placez quelques gouttes sous la langue, laissez agir 60 secondes puis avalez. Commencez par une dose faible et augmentez progressivement.",
      },
      ...base,
    ];
  }

  if (category === "fleurs" || category === "resines") {
    return [
      {
        q: "Comment consommer les fleurs/résines CBD ?",
        a: "Nos produits sont destinés à être utilisés comme infusions ou en vaporisation à basse température (≤180°C). Ne pas fumer.",
      },
      ...base,
    ];
  }

  return base;
}

export function getUsageSteps(category: ProductCategory) {
  if (category === "huiles") {
    return [
      "Agitez le flacon avant utilisation.",
      "Placez 3 à 5 gouttes sous la langue, 1 à 2 fois par jour.",
      "Laissez agir 60 secondes avant d'avaler.",
    ];
  }
  if (category === "fleurs" || category === "resines") {
    return [
      "Prélevez la quantité souhaitée avec une balance de précision.",
      "Utilisez en infusion (80°C, 10 min) ou en vaporisation.",
      "Conservez dans un endroit frais, sec et à l'abri de la lumière.",
    ];
  }
  if (category === "infusions") {
    return [
      "Infusez 1 sachet dans 250 ml d'eau à 80°C.",
      "Laissez reposer 5 à 10 minutes.",
      "Consommez 1 à 2 tasses par jour, de préférence le soir.",
    ];
  }
  return [
    "Appliquez ou consommez selon les instructions du produit.",
    "Respectez la posologie recommandée.",
    "Conservez au sec, à l'abri de la lumière.",
  ];
}

export function getScientificQuote(category: ProductCategory) {
  if (category === "huiles") {
    return "Le cannabidiol (CBD) interagit avec le système endocannabinoid pour favoriser l'équilibre du corps et de l'esprit, sans effet psychoactif.";
  }
  return "Le CBD, extrait du chanvre, est reconnu pour ses propriétés relaxantes et son profil sécuritaire, avec un taux de THC inférieur à 0,3%.";
}

export function getPackOptions(priceCents: number, compareCents: number | null) {
  const unit = priceCents;
  const compare = compareCents ?? Math.round(unit * 1.15);
  return [
    {
      id: "1",
      label: "1 unité",
      quantity: 1,
      priceCents: unit,
      compareCents: compare,
      discount: compareCents ? Math.round(((compare - unit) / compare) * 100) : null,
    },
    {
      id: "2",
      label: "2 unités",
      quantity: 2,
      priceCents: Math.round(unit * 2 * 0.9),
      compareCents: unit * 2,
      discount: 10,
    },
    {
      id: "3",
      label: "3 unités",
      quantity: 3,
      priceCents: Math.round(unit * 3 * 0.85),
      compareCents: unit * 3,
      discount: 15,
    },
  ];
}

export function getAccordionSections(product: Product) {
  return [
    {
      id: "description",
      title: "Description",
      content: product.description,
    },
    {
      id: "composition",
      title: "Composition & concentrations",
      content: `CBD ${product.cbd_percent}% — THC < ${product.thc_percent}%. ${product.weight_grams ? `Poids net : ${product.weight_grams}g.` : ""} SKU : ${product.sku}. Produit 100% naturel, sans OGM.${product.coa_url ? " Certificat d'analyse (COA) disponible en téléchargement." : ""}`,
    },
    {
      id: "pour-qui",
      title: "Pour qui ?",
      content:
        "Adultes (+18 ans) souhaitant intégrer le CBD dans leur routine bien-être. Idéal pour gérer le stress quotidien, favoriser la relaxation et améliorer la qualité du sommeil. Consultez un professionnel de santé en cas de traitement en cours.",
    },
    {
      id: "utilisation",
      title: "Comment l'utiliser ?",
      content: getUsageSteps(product.category).join("\n\n"),
    },
    {
      id: "livraison",
      title: "Livraison et Garantie",
      content:
        "Expédition sous 24h ouvrées. Livraison offerte dès 80€ d'achat en France métropolitaine. Garantie satisfait ou remboursé 30 jours — si vous n'êtes pas satisfait, nous vous remboursons sans justification.",
    },
  ];
}

export function getBrutalistAccordions(product: Product) {
  return [
    {
      id: "why",
      title: "Pourquoi choisir Verde CBD ?",
      content:
        "Sélection rigoureuse, traçabilité complète, certificats COA pour chaque lot, THC < 0,3% conforme à la législation française. Une qualité premium accessible.",
    },
    {
      id: "compare",
      title: "Tableau comparatif",
      content: `Verde CBD vs marché : analyses laboratoire systématiques ✓ | THC < 0,3% certifié ✓ | Origine UE traçable ✓ | Service client réactif ✓ | Prix justes ✓`,
    },
    {
      id: "studies",
      title: "Les études sur le CBD",
      content:
        "De nombreuses recherches scientifiques documentent les propriétés du cannabidiol sur le stress, l'anxiété et le sommeil. Le WHO considère le CBD comme généralement bien toléré.",
    },
    {
      id: "references",
      title: "Références scientifiques",
      content:
        "Blessing et al. (2015) — Cannabidiol as a Potential Treatment for Anxiety Disorders. Shannon et al. (2019) — Cannabidiol in Anxiety and Sleep: A Large Case Series.",
    },
  ];
}

export function getDifferenceItems() {
  return [
    { num: "01", title: "Un chanvre premium sélectionné" },
    { num: "02", title: "Des analyses COA pour chaque lot" },
    { num: "03", title: "Une traçabilité 100% transparente" },
  ];
}
