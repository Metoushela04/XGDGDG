# Vendix — Étapes 2 et 3 (base de données + authentification)

Ce zip contient **uniquement les fichiers nouveaux ou modifiés**. Dézippe-le **à la racine de ton projet** (le dossier qui contient `package.json`) en acceptant d'écraser les fichiers existants.

## 1. Installer
```bash
npm install
cp .env.example .env.local     # puis remplis au moins les 4 premières variables
```

## 2. Configurer Supabase (tableau de bord)
1. **SQL Editor** : exécute `supabase/migrations/0001_schema.sql`, puis `supabase/seed.sql`.
2. **Authentication → Providers → Email** : laisse **« Confirm email » activé** (le PRD l'exige).
3. **Authentication → URL Configuration** :
   - *Site URL* = ton `NEXT_PUBLIC_APP_URL` (ex. `http://localhost:3000`)
   - *Redirect URLs* : ajoute `http://localhost:3000/**` (et ton domaine de production avec `/**`).
4. **Google (optionnel pour l'instant)** : Authentication → Providers → Google. Dans Google Cloud, l'URI de redirection autorisée est celle affichée par Supabase (`https://<ton-projet>.supabase.co/auth/v1/callback`).
5. Le service d'e-mails par défaut de Supabase est **très limité** : pour tester l'inscription plusieurs fois, attends ou configure plus tard Brevo en SMTP (étape 10).

## 3. Créer le compte admin
Remplis `SEED_ADMIN_EMAIL` et `SEED_ADMIN_PASSWORD` dans `.env.local`, puis :
```bash
npx tsx --env-file=.env.local scripts/seed-admin.ts
```

## 4. Lancer
```bash
npm run dev
```
À tester : inscription → e-mail de confirmation → connexion → `/dashboard` ; `/admin` avec un compte non admin → `/acces-refuse` ; mot de passe oublié ; déconnexion (bas de la barre latérale du dashboard).

Détail des choix : voir `DECISIONS.md`.
