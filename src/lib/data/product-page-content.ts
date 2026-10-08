import type { Product, ProductCategory } from "@/types";

export function getProductBenefits(category: ProductCategory, isFlower = false) {
  if (isFlower) return [{ emoji: "🌿", label: "Fleurs de chanvre" }, { emoji: "📦", label: "Sachet refermable" }, { emoji: "⚖️", label: "Formats 3, 5 et 10 g" }, { emoji: "🔎", label: "Informations du lot" }];
  const common = [
    { emoji: "🌿", label: "Chanvre naturel" },
    { emoji: "🔬", label: "Informations de composition" },
    { emoji: "✅", label: "Sélection CBD" },
    { emoji: "📦", label: "Colis discret" },
  ];

  const byCategory: Partial<Record<ProductCategory, typeof common>> = {
    fleurs: [
      { emoji: "🚬", label: "Prêt à l'emploi" },
      { emoji: "📦", label: "Conservation en tube" },
      { emoji: "✅", label: "THC < 0,3%" },
      { emoji: "🔬", label: "Informations de composition" },
    ],
    resines: [
      { emoji: "✨", label: "Concentration élevée" },
      { emoji: "🌿", label: "100 % naturel" },
      { emoji: "✅", label: "THC < 0,3%" },
      { emoji: "🔬", label: "Traçabilité du lot" },
    ],
    vapes: [
      { emoji: "🚭", label: "Sans nicotine" },
      { emoji: "🔋", label: "Pods rechargeables" },
      { emoji: "✅", label: "Sans goudron" },
      { emoji: "🔬", label: "Concentration indiquée" },
    ],
    accessoires: [
      { emoji: "🔥", label: "Qualité premium" },
      { emoji: "♻️", label: "Réutilisable" },
      { emoji: "📦", label: "Format pratique" },
      { emoji: "✅", label: "Sélection soignée" },
    ],
  };

  return byCategory[category] ?? common;
}

export const STORY_RINGS = [
  { id: "composition", label: "Composition", image: "composition" },
  { id: "usage", label: "Utilisation", image: "usage" },
  { id: "faq", label: "Questions fréquentes", image: "faq" },
] as const;

export function getProductFaqs(category: ProductCategory, isFlower = false) {
  const base = [
    {
      q: "Comment conserver mon produit ?",
      a: "À l'abri de la lumière, de la chaleur et de l'humidité, dans son contenant d'origine bien fermé. Tenir hors de portée des enfants.",
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
      q: "Où trouver le certificat d'analyse ?",
      a: "Le certificat d'analyse (COA) du lot en vente est disponible sur demande par e-mail, et en téléchargement sur la fiche produit lorsqu'il est indiqué.",
    },
  ];

  if (isFlower) return [{ q: "Comment choisir le format de mes fleurs ?", a: "Les formats 3, 5 et 10 g correspondent au poids net du sachet. Sélectionnez le format sur cette fiche, puis le nombre de sachets souhaité. Conservez les fleurs au sec et à l'abri de la lumière." }, ...base];
  if (category === "fleurs") {
    return [
      {
        q: "Comment utiliser les pre-rolls CBD ?",
        a: "Nos pre-rolls sont déjà roulés et conditionnés en tube hermétique. Sortez la cigarette du tube et consommez directement. Conservez le tube pour les prochaines utilisations.",
      },
      ...base,
    ];
  }

  if (category === "resines") {
    return [
      {
        q: "Comment consommer les résines CBD ?",
        a: "Nos résines sont destinées à être utilisées en infusion (80°C, 10 min) ou en vaporisation à basse température (≤180°C). Ne pas fumer.",
      },
      ...base,
    ];
  }

  if (category === "vapes") {
    return [
      {
        q: "Comment choisir une recharge CBD ?",
        a: "Vérifiez la compatibilité avec votre appareil, le volume et la concentration indiqués sur la fiche produit. Respectez les instructions du fabricant.",
      },
      {
        q: "Comment utiliser le booster CBD ?",
        a: "Mélangez le booster à votre e-liquide préféré selon le dosage souhaité. Commencez par quelques gouttes et ajustez progressivement. Agitez bien avant utilisation.",
      },
      ...base,
    ];
  }

  return base;
}

export function getUsageSteps(category: ProductCategory, isFlower = false) {
  if (isFlower) return ["Vérifiez le format, les informations de lot et les indications du fournisseur.", "Respectez l'usage indiqué sur l'emballage et les précautions associées.", "Refermez le sachet et conservez-le au sec, à l'abri de la chaleur et de la lumière."];
  if (category === "fleurs") {
    return [
      "Ouvrez le tube hermétique et sortez le pre-roll.",
      "Allumez et consommez à votre rythme.",
      "Refermez le tube pour conserver la fraîcheur des pre-rolls restants.",
    ];
  }
  if (category === "resines") {
    return [
      "Prélevez la quantité souhaitée avec une balance de précision.",
      "Utilisez en infusion (80°C, 10 min) ou en vaporisation.",
      "Conservez dans un endroit frais, sec et à l'abri de la lumière.",
    ];
  }
  if (category === "vapes") {
    return [
      "Insérez la cartouche dans le pod ou remplissez votre clearomiseur.",
      "Inhalez lentement par bouffées de 3 à 5 secondes.",
      "Rangez le pod à l'abri de la chaleur entre deux utilisations.",
    ];
  }
  if (category === "accessoires") {
    return [
      "Utilisez selon les instructions du produit.",
      "Nettoyez régulièrement pour une durée de vie optimale.",
      "Conservez au sec, à l'abri de la chaleur.",
    ];
  }
  return [
    "Utilisez selon les instructions du produit.",
    "Respectez les indications de l'emballage.",
    "Conservez au sec, à l'abri de la lumière.",
  ];
}

export function getScientificQuote(category: ProductCategory) {
  if (category === "vapes") {
    return "La vaporisation du CBD se fait sans combustion : pas de fumée ni de goudron.";
  }
  return "Le CBD, extrait du chanvre, est légal en France dès lors que le taux de THC est inférieur à 0,3 % — ce que nous vérifions en laboratoire pour chaque lot.";
}

export function getPackOptions(priceCents: number, compareCents: number | null) {
  const unit = priceCents;
  const compare = compareCents ?? unit;
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
      content: product.cbd_percent > 0
        ? `CBD ${product.cbd_percent}% — THC < ${product.thc_percent}%. ${product.weight_grams ? `Poids net : ${product.weight_grams}g.` : ""} SKU : ${product.sku}. Produit 100% naturel, sans OGM.${product.coa_url ? " Certificat d'analyse (COA) disponible en téléchargement." : ""}`
        : `${product.short_description} SKU : ${product.sku}.${product.coa_url ? " Certificat d'analyse (COA) disponible en téléchargement." : ""}`,
    },
    {
      id: "pour-qui",
      title: "Pour qui ?",
      content:
        "Réservé aux adultes (+18 ans). Déconseillé aux femmes enceintes ou allaitantes. Consultez un professionnel de santé en cas de traitement en cours. Ce produit n'est pas un médicament.",
    },
    {
      id: "utilisation",
      title: "Comment l'utiliser ?",
      content: getUsageSteps(product.category, product.tags.includes("fleur")).join("\n\n"),
    },
    {
      id: "livraison",
      title: "Livraison et Garantie",
      content:
        "Expédition sous 24h ouvrées. Livraison offerte dès 80€ d'achat en France métropolitaine. Retours acceptés sous 14 jours pour les produits non ouverts.",
    },
  ];
}

export function getBrutalistAccordions(product: Product) {
  return [
    {
      id: "why",
      title: "Pourquoi choisir CBD ?",
      content:
        "Sélection rigoureuse, traçabilité complète, certificats COA pour chaque lot, THC < 0,3% conforme à la législation française. Une qualité premium accessible.",
    },
    {
      id: "compare",
      title: "Tableau comparatif",
      content: `CBD vs marché : analyses laboratoire systématiques ✓ | THC < 0,3% certifié ✓ | Origine UE traçable ✓ | Service client réactif ✓ | Prix justes ✓`,
    },
  ];
}

export function getDifferenceItems() {
  return [
    { num: "01", title: "Un chanvre premium sélectionné" },
    { num: "02", title: "Les documents du lot sur sa fiche" },
    { num: "03", title: "Une traçabilité 100% transparente" },
  ];
}
