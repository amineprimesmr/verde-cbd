-- Seed products for Verde CBD — Catalog refonte 2025

INSERT INTO shipping_rates (name, description, price_cents, min_order_cents, estimated_days) VALUES
  ('Colissimo Standard', 'Livraison à domicile en 3-5 jours ouvrés', 590, 0, '3-5 jours'),
  ('Colissimo Express', 'Livraison express en 24-48h', 990, 0, '1-2 jours'),
  ('Point Relais', 'Retrait en point relais Mondial Relay', 390, 0, '3-5 jours'),
  ('Livraison Gratuite', 'Offerte dès 80€ d''achat', 0, 8000, '3-5 jours');

INSERT INTO products (name, slug, description, short_description, category, price_cents, compare_at_price_cents, thc_percent, cbd_percent, weight_grams, stock, sku, image_url, images, coa_url, is_featured, tags) VALUES
-- Pre-rolls
(
  'Pre-roll Amnesia Haze', 'pre-roll-amnesia-haze',
  'Cigarette pré-roulée Amnesia Haze, fleur indoor premium. 3 pre-rolls calibrés à 0,5g chacun, déjà roulés et conservés dans un tube hermétique aluminium. Profil citronné et épicé, effet relaxant. THC < 0,3%.',
  'Tube x3 pre-rolls, Amnesia Haze indoor, CBD 18%',
  'fleurs', 1490, 1790, 0.20, 18.00, 1.5, 120, 'PRR-AHI-T3',
  '/images/pre-roll-amnesia-1.png', '["/images/pre-roll-amnesia-1.png","/images/pre-roll-amnesia-2.png","/images/pre-roll-amnesia-3.png","/images/pre-roll-amnesia-4.png"]',
  '/coa/amnesia-haze.pdf', TRUE, ARRAY['pre-roll', 'tube', 'indoor']
),
(
  'Pre-roll OG Kush', 'pre-roll-og-kush',
  'Pre-rolls OG Kush greenhouse, notes terreuses et pinées. 3 cigarettes prêtes à l''emploi en tube hermétique. Idéal pour une détente en fin de journée sans préparation.',
  'Tube x3 pre-rolls, OG Kush greenhouse, CBD 15%',
  'fleurs', 1290, NULL, 0.18, 15.00, 1.5, 150, 'PRR-OGK-T3',
  '/images/Amnesia2.png', '["/images/Amnesia1.png","/images/Amnesia2.png","/images/Amnesia3.png","/images/Amnesia4.png"]',
  '/coa/og-kush.pdf', FALSE, ARRAY['pre-roll', 'tube', 'greenhouse']
),
(
  'Pre-roll Mango Kush', 'pre-roll-mango-kush',
  'Pre-rolls Mango Kush aux arômes fruités tropicaux. 3 cigarettes roulées à la main, conditionnées en tube étanche pour préserver fraîcheur et terpènes.',
  'Tube x3 pre-rolls, Mango Kush, arômes fruités, CBD 14%',
  'fleurs', 1190, 1390, 0.15, 14.00, 1.5, 130, 'PRR-MGK-T3',
  '/images/Amnesia3.png', '["/images/Amnesia1.png","/images/Amnesia2.png","/images/Amnesia3.png","/images/Amnesia4.png"]',
  '/coa/mango-kush.pdf', FALSE, ARRAY['pre-roll', 'tube', 'fruité']
),
(
  'Pack 4 Pre-rolls Assortis', 'pack-4-pre-rolls-assortis',
  'Pack découverte de 4 pre-rolls CBD variétés (Amnesia, OG Kush, Mango Kush, Purple Haze). Chaque cigarette est roulée et stockée dans son propre tube. Parfait pour tester nos références.',
  '4 tubes x1 pre-roll, variétés assorties, -15%',
  'fleurs', 1990, 2390, 0.20, 15.00, 2.0, 60, 'PKT-PRR-4',
  '/images/Amnesia4.png', '["/images/Amnesia1.png","/images/Amnesia2.png","/images/Amnesia3.png","/images/Amnesia4.png"]',
  '/coa/pack-pre-rolls.pdf', TRUE, ARRAY['pre-roll', 'tube', 'pack']
),
-- Résines
(
  'Résine Pollen Premium', 'resine-pollen-premium',
  'Résine CBD type pollen, texture souple et aromatique. Extraction à froid pour préserver les terpènes naturels. Concentration élevée pour une expérience optimale.',
  'Pollen premium, texture souple, CBD 25%',
  'resines', 1490, 1790, 0.25, 25.00, 2.0, 80, 'RES-POL-2G',
  '/images/pollen-premium-1.png', '["/images/pollen-premium-1.png","/images/pollen-premium-2.png","/images/pollen-premium-3.png","/images/pollen-premium-4.png","/images/pollen-premium-5.png"]',
  '/coa/pollen.pdf', TRUE, ARRAY['pollen', 'premium']
),
(
  'Hash CBD Dry Sift', 'hash-cbd-dry-sift',
  'Hash CBD obtenu par tamisage à sec (dry sift). Concentration en cannabinoïdes optimale, saveurs intenses et authentiques. 100% naturel, sans solvant.',
  'Hash dry sift artisanal, CBD 30%',
  'resines', 1890, NULL, 0.22, 30.00, 1.0, 60, 'RES-DSF-1G',
  '/images/resine2.png', '["/images/resine1.png","/images/resine2.png","/images/resine3.png","/images/resine4.png"]',
  '/coa/dry-sift.pdf', FALSE, ARRAY['hash', 'dry-sift']
),
(
  'Frozen Hash Charas', 'frozen-hash-charas',
  'Hash CBD frozen, méthode charas à basse température. Texture malléable, arômes profonds et effet relaxant marqué. Référence haut de gamme de notre gamme résines.',
  'Frozen hash charas, CBD 28%, texture premium',
  'resines', 2290, 2690, 0.20, 28.00, 1.0, 45, 'RES-FRZ-1G',
  '/images/resine3.png', '["/images/resine1.png","/images/resine2.png","/images/resine3.png","/images/resine4.png"]',
  '/coa/frozen-hash.pdf', FALSE, ARRAY['hash', 'frozen', 'premium']
),
(
  'Skuff CBD 22%', 'skuff-cbd-22',
  'Skuff CBD finement tamisé, texture poudreuse et aromatique. Excellent rapport qualité-prix, idéal au quotidien. Analysé en laboratoire indépendant.',
  'Skuff CBD 22%, texture fine, bon rapport qualité-prix',
  'resines', 1290, NULL, 0.20, 22.00, 2.0, 100, 'RES-SKF-2G',
  '/images/resine4.png', '["/images/resine1.png","/images/resine2.png","/images/resine3.png","/images/resine4.png"]',
  '/coa/skuff.pdf', FALSE, ARRAY['skuff', 'pollen']
),
-- Vapes
(
  'Pod Verde CBD Rechargeable', 'pod-verde-cbd-rechargeable',
  'Pod vape CBD rechargeable, design compact et discret. Batterie 400mAh, activation automatique à l''inhalation. Compatible avec toutes nos cartouches Verde. Câble USB-C inclus.',
  'Pod rechargeable 400mAh, activation auto, USB-C',
  'vapes', 2490, 2990, 0.00, 0.00, NULL, 90, 'VAP-POD-01',
  '/images/huile1.png', '["/images/huile1.png","/images/huile2.png","/images/huile3.png","/images/huile4.png"]',
  NULL, TRUE, ARRAY['pods']
),
(
  'Recharge Pod Menthe Classique', 'recharge-pod-menthe-classique',
  'Cartouche de recharge pour pod Verde. Arôme menthe fraîche, 500mg de CBD full spectrum. Format 2ml, environ 300 bouffées. Effet relaxant doux et progressif.',
  'Cartouche 500mg CBD, menthe classique, 2ml',
  'vapes', 990, NULL, 0.20, 25.00, NULL, 150, 'VAP-RCG-MEN',
  '/images/huile2.png', '["/images/huile1.png","/images/huile2.png","/images/huile3.png","/images/huile4.png"]',
  '/coa/recharge-menthe.pdf', FALSE, ARRAY['recharge-classique', 'menthe']
),
(
  'Recharge Pod Mangue Classique', 'recharge-pod-mangue-classique',
  'Cartouche de recharge pour pod Verde. Arôme mangue tropicale, 500mg de CBD full spectrum. Format 2ml, effet apaisant et saveur fruitée naturelle.',
  'Cartouche 500mg CBD, mangue tropicale, 2ml',
  'vapes', 990, NULL, 0.20, 25.00, NULL, 140, 'VAP-RCG-MAN',
  '/images/huile3.png', '["/images/huile1.png","/images/huile2.png","/images/huile3.png","/images/huile4.png"]',
  '/coa/recharge-mangue.pdf', FALSE, ARRAY['recharge-classique', 'mangue']
),
(
  'Recharge Pod Omega H4CBD', 'recharge-pod-omega-h4cbd',
  'Cartouche gamme Omega enrichie en H4CBD pour un effet plus puissant et rapide. 800mg de cannabinoïdes, arôme fruits rouges. Réservée aux utilisateurs expérimentés. Compatible pod Verde.',
  'Gamme Omega, H4CBD 800mg, effet puissant, fruits rouges',
  'vapes', 1490, 1790, 0.20, 40.00, NULL, 70, 'VAP-RCG-OMG',
  '/images/huile4.png', '["/images/huile1.png","/images/huile2.png","/images/huile3.png","/images/huile4.png"]',
  '/coa/recharge-omega.pdf', TRUE, ARRAY['recharge-omega', 'h4cbd', 'omega']
),
(
  'E-liquide CBD Classic 300mg', 'e-liquide-cbd-classic-300mg',
  'E-liquide CBD 10ml, 300mg de cannabidiol full spectrum. Arôme chanvre naturel, base 50/50 PG/VG. Compatible toutes cigarettes électroniques classiques. Sans nicotine.',
  'E-liquide 10ml, 300mg CBD, arôme chanvre naturel',
  'vapes', 1290, NULL, 0.20, 3.00, NULL, 120, 'ELQ-CL3-10ML',
  '/images/huile1.png', '["/images/huile1.png","/images/huile2.png","/images/huile3.png","/images/huile4.png"]',
  '/coa/eliquide-300.pdf', FALSE, ARRAY['e-liquide', 'classic']
),
(
  'E-liquide CBD Relax 600mg', 'e-liquide-cbd-relax-600mg',
  'E-liquide CBD haute concentration 600mg/10ml. Formule relax enrichie en terpènes naturels (myrcène, linalool). Arôme fruits des bois. Idéal en fin de journée.',
  'E-liquide 10ml, 600mg CBD, formule relax',
  'vapes', 1890, 2190, 0.20, 6.00, NULL, 85, 'ELQ-RL6-10ML',
  '/images/huile2.png', '["/images/huile1.png","/images/huile2.png","/images/huile3.png","/images/huile4.png"]',
  '/coa/eliquide-600.pdf', TRUE, ARRAY['e-liquide', 'relax']
),
(
  'Booster CBD 1000mg', 'booster-cbd-1000mg',
  'Booster CBD neutre 10ml, 1000mg de cannabidiol. À mélanger avec votre e-liquide préféré pour créer votre dosage idéal. Format 10ml, base 100% PG. Sans arôme ajouté.',
  'Booster 10ml, 1000mg CBD, neutre, à diluer',
  'vapes', 1690, NULL, 0.20, 10.00, NULL, 95, 'BST-CBD-10ML',
  '/images/huile3.png', '["/images/huile1.png","/images/huile2.png","/images/huile3.png","/images/huile4.png"]',
  '/coa/booster-1000.pdf', FALSE, ARRAY['booster']
),
-- Accessoires
(
  'Briquet Clipper Verde', 'briquet-clipper-verde',
  'Briquet Clipper classique édition Verde CBD. Rechargeable, pierre amovible, format poche. Indispensable pour allumer vos pre-rolls en toute sécurité.',
  'Briquet Clipper rechargeable, édition Verde',
  'accessoires', 390, NULL, 0.00, 0.00, NULL, 200, 'ACC-BRI-01',
  'https://images.unsplash.com/photo-1603906835853-f61e1b4d2f48?w=800&q=80', '[]',
  NULL, FALSE, ARRAY['briquet']
),
(
  'Feuilles OCB Premium x50', 'feuilles-ocb-premium-x50',
  'Paquet de 50 feuilles à rouler OCB Premium slim. Papier ultra-fin, gomme arabique naturelle. La référence des fumeurs exigeants.',
  '50 feuilles OCB Premium slim, gomme naturelle',
  'accessoires', 250, NULL, 0.00, 0.00, NULL, 300, 'ACC-OCB-50',
  'https://images.unsplash.com/photo-1603906835853-f61e1b4d2f48?w=800&q=80', '[]',
  NULL, FALSE, ARRAY['feuilles', 'ocb']
),
(
  'Grinder Aluminium 2 parties', 'grinder-aluminium-2-parties',
  'Grinder aluminium 2 parties, diamètre 50mm. Dents diamantées pour un broyage homogène. Compact, robuste et discret.',
  'Grinder alu 50mm, 2 parties, broyage homogène',
  'accessoires', 990, 1290, 0.00, 0.00, NULL, 110, 'ACC-GRD-50',
  'https://images.unsplash.com/photo-1603906835853-f61e1b4d2f48?w=800&q=80', '[]',
  NULL, FALSE, ARRAY['grinder']
),
(
  'Étui Tube Pre-roll', 'etui-tube-pre-roll',
  'Étui tube aluminium hermétique pour conserver vos pre-rolls. Format standard 115mm, joint étanche, protection lumière et humidité. Réutilisable à l''infini.',
  'Tube alu hermétique 115mm, conservation pre-rolls',
  'accessoires', 490, NULL, 0.00, 0.00, NULL, 180, 'ACC-TUB-01',
  '/images/Amnesia1.png', '["/images/Amnesia1.png"]',
  NULL, FALSE, ARRAY['etui', 'tube']
);
