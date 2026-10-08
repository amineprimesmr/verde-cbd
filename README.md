# CBD — Boutique de Sylvain

Version préparée le 1er octobre 2026. Nom commercial temporaire : **CBD**.

Le catalogue contient **44 références** : 7 pre-rolls/coffrets, 6 résines/coffrets, 6 produits de vape rechargeable/e-liquides, 7 accessoires et 18 formats de fleurs (6 variétés × 3, 5 et 10 g). Les prix et stocks ajoutés sont des hypothèses de démonstration, pas un inventaire fournisseur. Les 40 visuels du site sont des illustrations générées avec Higgsfield, à confronter aux emballages réels avant les ventes.

Le site affiche son catalogue sans écran de vérification d'âge. La mention adulte reste dans les informations produit et au moment de commander.

### État des ventes

`NEXT_PUBLIC_COMMERCE_ENABLED=false` est le comportement par défaut. Le parcours catalogue → panier → coordonnées → commande simulée fonctionne sans débit, enregistrement de fausses commandes ou modification du stock. Les pages de démonstration sont exclues de l'indexation.

Avec `NEXT_PUBLIC_COMMERCE_ENABLED=true`, le catalogue et les commandes utilisent Supabase, le paiement carte utilise Mollie et les confirmations invité utilisent un lien signé valable 30 jours. Sans passerelle, base ou coordonnées bancaires valides, la commande réelle est refusée. Les produits H4CBD et les puffs jetables sont désactivés et filtrés. Le point relais est masqué tant que la sélection du lieu de retrait n'est pas intégrée.

### Étude de marché utilisée

Comparaison ponctuelle, pas une analyse exhaustive : [321CBD](https://www.321cbd.com/fr/), [La Ferme du CBD](https://www.lafermeducbd.fr/). Les fleurs, résines, e-liquides et accessoires sont des familles courantes. Les promotions et conditionnements rendent les prix directement affichés difficiles à comparer ; nos prix de travail ne supposent aucun tarif fournisseur ni marge garantie. Pour les nouvelles fleurs : 3 g à 12,90–15,90 €, 5 g à 19,35–23,85 €, 10 g à 34,83–42,93 € ; packs de deux ou trois sachets avec remises partagées client/serveur.

Les H4CBD/H2CBD sont exclus selon la [MILDECA](https://www.drogues.gouv.fr/le-cbd), et les puffs jetables selon [Service Public](https://www.service-public.gouv.fr/particuliers/vosdroits/F35111). Les catégories alimentaires nécessitent une vérification spécifique ; elles ne sont pas ajoutées sur la seule base des catalogues concurrents.

### Configuration avant ouverture commerciale

1. Valider fournisseurs, prix, marges, variantes, stocks, ingrédients, concentrations, origines et certificats réels. Les certificats inventés ont été retirés.
2. Renseigner identité légale, SIRET, adresse, contact, CGV, médiation, politique de retour et délais réellement assurés par Sylvain.
3. Configurer et faire accepter le compte Mollie marchand, puis vérifier un paiement, son webhook, une annulation et un remboursement en environnement test.
4. Renseigner `NEXT_PUBLIC_SITE_URL`, `ORDER_ACCESS_SECRET`, `RESEND_FROM_EMAIL`, `CONTACT_INBOX_EMAIL`, les clés Supabase/Resend/Mollie et, si utilisé, `NEXT_PUBLIC_BANK_IBAN`, `NEXT_PUBLIC_BANK_BIC`, `NEXT_PUBLIC_BANK_BENEFICIARY`.
5. Valider les URL de redirection Supabase, les accès administrateur et les règles RLS sur le projet réel. Le compte administrateur de Sylvain reste à attribuer à son adresse confirmée.
6. Passer `NEXT_PUBLIC_COMMERCE_ENABLED=true`, redéployer et valider le parcours marchand complet. Un build réussi ne valide pas les services externes, les données marchandes ni les documents légaux.

### Commandes utiles

```bash
npm run build
npm run lint
node scripts/sync-catalog.mjs
node scripts/verify-deployment.mjs https://verde-cbd.vercel.app
vercel deploy --prod --yes --archive=tgz
```

La synchronisation du catalogue préserve les stocks des références existantes et sauvegarde l'état précédent dans `.vercel/catalog-before-sync.json` (ignoré par Git). Les instructions historiques ci-dessous devront être adaptées au compte de Sylvain ; en particulier les mentions de Stripe ne correspondent plus au code, qui utilise Mollie.

Boutique e-commerce complète pour la vente de produits CBD en France.

**Production :** [https://verde-cbd.vercel.app](https://verde-cbd.vercel.app)  
**GitHub :** [github.com/amineprimesmr/verde-cbd](https://github.com/amineprimesmr/verde-cbd)  
**Vercel :** [verde-cbd sur Vercel](https://vercel.com/amines-projects-00de692e/verde-cbd)

Construite avec Next.js 16, Supabase (optionnel), Tailwind CSS et Stripe (optionnel).

## Fonctionnalités

### Storefront
- Page d'accueil avec hero, catégories et best-sellers
- Catalogue produits avec filtres par catégorie et recherche
- Fiches produit détaillées (CBD %, THC %, COA, stock)
- Panier persistant (localStorage via Zustand)
- Checkout complet (adresse, livraison, paiement)
- Vérification d'âge (+18) obligatoire

### Compte client
- Inscription / Connexion (Supabase Auth)
- Historique des commandes avec suivi
- Gestion des adresses de livraison
- Profil utilisateur

### Administration
- Dashboard avec statistiques
- Gestion des commandes (statuts, numéro de suivi)
- Gestion des produits (CRUD, stock, activation)

### Conformité CBD France
- Mentions légales, CGV, politique de confidentialité
- Avertissement THC < 0,3%
- Certificats d'analyse (COA) par produit
- TVA 20% calculée automatiquement

### Paiement
- **Virement bancaire** (recommandé pour CBD)
- **Carte bancaire** via Stripe (mode test uniquement)
- ⚠️ Stripe **interdit** le CBD en production — utilisez un processeur compatible (Mollie, PayPlug, AllayPay, etc.)

## Démarrage rapide

### 1. Installation

```bash
npm install
cp .env.example .env.local
```

### 2. Configuration Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Copiez l'URL et la clé anon dans `.env.local`
3. Exécutez la migration SQL :

```bash
# Via le dashboard Supabase > SQL Editor
# Collez le contenu de supabase/migrations/001_initial_schema.sql
# Puis supabase/seed.sql pour les produits
```

4. Créez un admin :

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'votre@email.com';
```

### 3. Lancer le dev

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

> **Mode démo** : Sans Supabase configuré, le site fonctionne avec 12 produits statiques en mémoire. Le checkout génère un numéro de commande mais ne persiste pas en base.

## Structure du projet

```
src/
├── app/                    # Pages Next.js App Router
│   ├── boutique/           # Catalogue
│   ├── produit/[slug]/     # Fiche produit
│   ├── panier/             # Panier
│   ├── checkout/           # Commande
│   ├── compte/             # Espace client
│   ├── admin/              # Back-office
│   └── api/                # API routes
├── components/             # Composants React
├── lib/                    # Utilitaires, data, Supabase
├── store/                  # État global (panier)
└── types/                  # Types TypeScript
supabase/
├── migrations/             # Schéma PostgreSQL
└── seed.sql                # Données initiales
```

## Livraison

| Mode | Prix | Délai |
|------|------|-------|
| Colissimo Standard | 5,90€ | 3-5 jours |
| Colissimo Express | 9,90€ | 1-2 jours |
| Point Relais | 3,90€ | 3-5 jours |
| Gratuite | 0€ | dès 80€ |

## Déploiement

```bash
npm run build
npm start
```

Recommandé : [Vercel](https://vercel.com) avec variables d'environnement Supabase.

## Mise en production — Checklist

- [ ] Configurer Supabase (auth, RLS, seed)
- [ ] Choisir un processeur de paiement compatible CBD
- [ ] Mettre à jour les mentions légales (SIRET, adresse réels)
- [ ] Configurer l'envoi d'emails (Resend, SendGrid)
- [ ] Ajouter Google Analytics / consentement cookies
- [ ] Tester le parcours complet commande → livraison
- [ ] Vérifier la conformité ANSM (pas de HHC, THCP, etc.)

## Licence

Projet privé — Verde CBD SAS
