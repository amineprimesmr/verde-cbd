# Verde CBD — Boutique e-commerce

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
