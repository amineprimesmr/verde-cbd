-- Seed products for Verde CBD

INSERT INTO shipping_rates (name, description, price_cents, min_order_cents, estimated_days) VALUES
  ('Colissimo Standard', 'Livraison à domicile en 3-5 jours ouvrés', 590, 0, '3-5 jours'),
  ('Colissimo Express', 'Livraison express en 24-48h', 990, 0, '1-2 jours'),
  ('Point Relais', 'Retrait en point relais Mondial Relay', 390, 0, '3-5 jours'),
  ('Livraison Gratuite', 'Offerte dès 80€ d''achat', 0, 8000, '3-5 jours');

INSERT INTO products (name, slug, description, short_description, category, price_cents, compare_at_price_cents, thc_percent, cbd_percent, weight_grams, stock, sku, image_url, coa_url, is_featured, tags) VALUES
(
  'Amnesia Haze Indoor',
  'amnesia-haze-indoor',
  'Fleur de CBD Amnesia Haze cultivée en indoor sous éclairage LED. Profil aromatique citronné et épicé, effet relaxant sans psychoactivité. Taux de THC inférieur à 0,3% conformément à la législation française. Analyse laboratoire disponible pour chaque lot.',
  'Fleur premium indoor, arômes citronnés, CBD 18%',
  'fleurs', 1290, 1590, 0.20, 18.00, 2.0, 150, 'FLR-AHI-2G',
  '/images/Amnesia1.png',
  '/coa/amnesia-haze.pdf', TRUE, ARRAY['indoor', 'premium', 'citron']
),
(
  'OG Kush Greenhouse',
  'og-kush-greenhouse',
  'Fleur de CBD OG Kush cultivée en greenhouse. Notes terreuses et pinées caractéristiques du strain. Idéale pour une détente en fin de journée. Certifiée < 0,3% THC.',
  'Fleur greenhouse, profil terreux, CBD 15%',
  'fleurs', 990, NULL, 0.18, 15.00, 2.0, 200, 'FLR-OGK-2G',
  '/images/produit.png',
  '/coa/og-kush.pdf', TRUE, ARRAY['greenhouse', 'terreux']
),
(
  'Purple Haze Outdoor',
  'purple-haze-outdoor',
  'Fleur de CBD Purple Haze en culture outdoor bio. Arômes fruités et floraux. Culture respectueuse de l''environnement, sans pesticides. Analyse COA incluse.',
  'Fleur outdoor bio, arômes fruités, CBD 12%',
  'fleurs', 790, 990, 0.15, 12.00, 2.0, 180, 'FLR-PHO-2G',
  '/images/28caf18d-db04-4674-8caf-a3855ac143bd.png',
  '/coa/purple-haze.pdf', FALSE, ARRAY['outdoor', 'bio']
),
(
  'Résine CBD Pollen Premium',
  'resine-cbd-pollen-premium',
  'Résine de CBD type pollen, texture souple et aromatique. Extraction à froid pour préserver les terpènes. Taux de CBD élevé pour une expérience optimale. Conforme réglementation française.',
  'Pollen premium, texture souple, CBD 25%',
  'resines', 1490, 1790, 0.25, 25.00, 2.0, 80, 'RES-POL-2G',
  '/images/resine1.png',
  '/coa/pollen.pdf', TRUE, ARRAY['pollen', 'premium']
),
(
  'Hash CBD Dry Sift',
  'hash-cbd-dry-sift',
  'Hash CBD obtenu par tamisage à sec (dry sift). Concentration en cannabinoïdes optimale. Saveurs intenses et authentiques. Produit 100% naturel sans solvant.',
  'Hash dry sift, CBD 30%, saveurs intenses',
  'resines', 1890, NULL, 0.22, 30.00, 1.0, 60, 'RES-DSF-1G',
  '/images/resine1.png',
  '/coa/dry-sift.pdf', FALSE, ARRAY['hash', 'dry-sift']
),
(
  'Huile CBD Full Spectrum 10%',
  'huile-cbd-full-spectrum-10',
  'Huile de CBD full spectrum 10% (1000mg/10ml). Extraction CO2 supercritique, base huile de chanvre bio. Spectre complet de cannabinoïdes et terpènes. Pipette graduée incluse. Usage sublingual recommandé.',
  'Huile full spectrum 10%, 1000mg CBD, bio',
  'huiles', 3490, 3990, 0.20, 10.00, NULL, 120, 'HUI-FS10-10ML',
  '/images/huile1.png',
  '/coa/huile-10.pdf', TRUE, ARRAY['full-spectrum', 'bio', '10%']
),
(
  'Huile CBD Broad Spectrum 20%',
  'huile-cbd-broad-spectrum-20',
  'Huile de CBD broad spectrum 20% (2000mg/10ml). Sans THC détectable. Idéale pour ceux recherchant une concentration élevée. Certifiée analyse tierce partie.',
  'Huile broad spectrum 20%, sans THC, 2000mg',
  'huiles', 5490, NULL, 0.00, 20.00, NULL, 90, 'HUI-BS20-10ML',
  '/images/huile1.png',
  '/coa/huile-20.pdf', TRUE, ARRAY['broad-spectrum', '20%']
),
(
  'Baume CBD Muscles & Articulations',
  'baume-cbd-muscles-articulations',
  'Baume chauffant au CBD et arnica pour muscles et articulations. Formule enrichie en huiles essentielles de menthe et eucalyptus. Application locale, absorption rapide. 50ml.',
  'Baume chauffant CBD + arnica, 50ml',
  'cosmetiques', 2490, NULL, 0.00, 5.00, NULL, 100, 'COS-BAU-50ML',
  'https://images.unsplash.com/photo-1556228578-0d53f288f062?w=800&q=80',
  '/coa/baume.pdf', FALSE, ARRAY['topique', 'baume']
),
(
  'Crème Visage CBD Anti-âge',
  'creme-visage-cbd-anti-age',
  'Crème visage au CBD et acide hyaluronique. Action anti-âge et hydratante. Convient à tous types de peau. Formule vegan, non testée sur animaux. 30ml.',
  'Crème visage CBD, anti-âge, vegan, 30ml',
  'cosmetiques', 2990, 3490, 0.00, 3.00, NULL, 75, 'COS-CRE-30ML',
  'https://images.unsplash.com/photo-1570194065650-d99fb4b3c2a1?w=800&q=80',
  '/coa/creme.pdf', FALSE, ARRAY['visage', 'vegan']
),
(
  'Infusion Chanvre Bio Nuit',
  'infusion-chanvre-bio-nuit',
  'Infusion de fleurs et feuilles de chanvre bio, mélange relaxant pour le soir. Enrichie en camomille et verveine. Sans THC. 20 sachets individuels.',
  'Infusion chanvre bio, mélange nuit, 20 sachets',
  'infusions', 1290, NULL, 0.00, 2.00, NULL, 150, 'INF-NUIT-20',
  'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80',
  '/coa/infusion-nuit.pdf', FALSE, ARRAY['infusion', 'bio', 'nuit']
),
(
  'Pack Découverte Fleurs',
  'pack-decouverte-fleurs',
  'Pack découverte de 3 fleurs CBD (Amnesia, OG Kush, Purple Haze) — 1g de chaque. Idéal pour tester nos variétés. Économisez 15% par rapport à l''achat séparé.',
  '3 fleurs x 1g, pack découverte -15%',
  'fleurs', 2490, 2970, 0.20, 15.00, 3.0, 50, 'PKT-DEC-3G',
  '/images/Amnesia1.png',
  '/coa/pack-decouverte.pdf', TRUE, ARRAY['pack', 'decouverte']
);
