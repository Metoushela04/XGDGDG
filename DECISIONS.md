# DECISIONS.md — Vendix

Choix faits là où le PRD était absent, ambigu ou perfectible.

## Étape 2 — Base de données

1. **`r2_file_key` jamais lisible côté navigateur.** Le PRD donne `select` public sur `products`, ce qui exposerait la clé R2 à tout visiteur. Le schéma accorde le `select` colonne par colonne, sans `r2_file_key`. Conséquence : dans le code client, **ne jamais faire `select('*')` sur `products`** (erreur « permission denied »). Lister les colonnes. Le serveur lit `r2_file_key` via `service_role`.
2. **Profils : un membre ne peut modifier que `full_name` et `avatar_url`** (droit `update` limité à ces colonnes). Rôle, suspension et e-mail ne changent que côté serveur (`service_role`). Cela évite qu'un membre se mette `role = 'admin'` ou se « désuspende ».
3. **Actions admin = routes serveur + `service_role` + écriture dans `admin_audit_log`.** Les policies admin existent aussi côté RLS, mais le panneau admin passera par le serveur, notamment parce que l'admin ne peut pas lire `r2_file_key` avec la clé publique.
4. **`notifications` : le membre ne peut modifier que `is_read`.**
5. **Diffusions (`user_id` null) :** `is_read` serait partagé par tous. Décision : à la création d'une annonce, le serveur crée **une notification par membre** ; les lignes `user_id null` ne servent pas.
6. **`support_messages.is_admin` renommé `from_admin`** (la fonction `is_admin()` existe déjà). La policy d'insertion vérifie que `from_admin` correspond au vrai rôle et que `sender_id` est l'appelant.
7. **Fonctions `has_active_access(uuid)` et `monthly_download_count(uuid)`**, réservées à `service_role` (elles acceptent un uuid arbitraire). Accès actif = `status = 'active'` **et** `current_period_end > now()` **et** compte non suspendu (critère 6 du PRD). Le quota compte les produits **distincts** du mois en UTC (re-téléchargement gratuit, PRD §7.4).
8. **`is_admin()` renvoie faux pour un admin suspendu.**
9. **Recherche catalogue :** index `pg_trgm` sur titre et description, pour des `ilike` rapides.
10. **Slugs des pages légales = segments de route** (ex. `licence-plr`), pour un lookup direct depuis la route.
11. **Prix initiaux :** 29 $/mois et 228 $/an, alignés sur la page `/tarifs` actuelle. Modifiables dans `plans` et depuis l'admin plus tard.
12. **Pages légales en seed :** contenu provisoire `_Texte à importer._`. Les vrais textes sont dans les `.tsx` actuels et seront migrés vers la table à l'étape 4.
13. **Produits de démo :** images `placehold.co` et clés R2 fictives (`demo/*.zip`). Ils ne sont pas téléchargeables, ils servent à tester l'interface. À supprimer avant la production.

## Étape 3 — Authentification

1. **`src/proxy.ts` et non `middleware.ts`** : dans Next 16 le middleware est renommé « proxy » (doc embarquée dans `node_modules/next/dist/docs`).
2. **Le proxy ne tourne que sur `/dashboard/*`, `/admin/*`, `/connexion`, `/inscription`, `/mot-de-passe-oublie`.** Les pages publiques n'ont donc aucun appel réseau en plus (priorité connexion lente). Un composant qui veut savoir si l'utilisateur est connecté appelle lui-même `supabase.auth.getUser()`.
3. **Vérification de l'identité avec `getUser()`** (jeton validé auprès de Supabase), jamais `getSession()`.
4. **Règles du proxy** : non connecté → `/connexion?next=…` ; e-mail non confirmé → `/verifier-email` ; compte suspendu → déconnexion + `/connexion?error=suspended` ; `/admin` sans rôle admin → `/acces-refuse` ; membre déjà connecté sur `/connexion` ou `/inscription` → `/dashboard`.
5. **Acceptation des conditions** : enregistrée côté serveur avec la clé `service_role` juste après `signUp` (à ce moment l'utilisateur n'a pas encore de session, la RLS refuserait l'insertion). On enregistre 3 lignes (`cgu`, `cgv`, `privacy`) avec la version lue dans `legal_pages`, plus l'IP.
6. **Pas d'énumération d'e-mails** : inscription avec un e-mail déjà utilisé, mot de passe oublié et renvoi de confirmation donnent toujours la même réponse. La connexion échouée affiche toujours « E-mail ou mot de passe incorrect ».
7. **Google** : la case des conditions doit être cochée sur `/inscription` avant d'ouvrir Google (le callback reçoit `accepted=1`). Si un compte Google nouveau arrive via `/connexion` sans avoir accepté, il est déconnecté et renvoyé vers `/inscription` ; son compte Supabase existe mais reste inutilisable tant qu'il n'a pas accepté.
8. **`?next=` filtré** (`safeNext`) : seuls les chemins internes sont acceptés (pas de `//site.com`, ni `https://…`).
9. **Rate limiting en mémoire** (`lib/rate-limit.ts`) : connexion 10/10 min, inscription 5/h, reset 3/15 min, renvoi 3/15 min, par IP. **Limite connue** : chaque instance serverless a sa propre mémoire. C'est un frein de base. Avant le lancement public, brancher Upstash Redis ou Vercel KV derrière la même fonction. Supabase applique en plus ses propres limites.
10. **Suspension à la connexion et dans le callback** : un compte suspendu ne peut ni ouvrir de session ni rester connecté.
11. **Correctif hors PRD** : `Footer.tsx` importait `Github`, `Twitter` et `Linkedin` depuis `lucide-react`, icônes absentes de la version installée et non utilisées. Cela faisait échouer `next build`. Imports supprimés.
12. **Nouvelles dépendances** : `@hookform/resolvers` (Zod avec React Hook Form) et `server-only` (empêche d'importer du code serveur dans un composant client).

## Étapes 5 à 8 — Dashboard membre, Stockage R2/Cloudinary, Admin & Chariow

1. **Stockage R2 (S3-compatible)** : module `lib/storage/r2.ts` utilisant `@aws-sdk/client-s3` et `@aws-sdk/s3-request-presigner`. Les URLs de téléchargement expirent après 60 secondes avec en-tête `Content-Disposition: attachment`. Les clés R2 ne sont jamais transmises au client.
2. **Stockage Cloudinary** : module `lib/storage/cloudinary.ts` générant les signatures d'upload côté serveur pour permettre l'envoi direct depuis le navigateur sans saturer la bande passante du serveur Next.js.
3. **Paiements Chariow** : module `lib/payments/` avec interface `PaymentProvider` (`provider.ts`) et implémentation `chariow.ts`. Vérification de signature cryptographique HMAC SHA-256 (`node:crypto`). Idempotence garantie via table `webhook_events`. En environnement de développement sans clés de production, un mode fallback simulé est activé.
4. **Quotas de téléchargement** : `lib/quota.ts` applique la règle PRD §7.4 : le re-téléchargement d'un même produit dans le mois courant ne consomme pas de quota supplémentaire (comptage de produits distincts).
5. **Panneau d'administration** : routes protégées `/admin` avec validation de rôle `admin` côté proxy et côté Server Actions (`src/app/admin/actions.ts`). Upload en deux temps (Cloudinary pour miniature, R2 pour archive ZIP) avec barre de progression temps réel.
6. **Dashboard membre branché sur Supabase** : `/dashboard/catalogue`, `/dashboard/favoris`, `/dashboard/nouveautes`, `/dashboard/telechargements`, `/dashboard/abonnement`, `/dashboard/profil` et l'accueil `/dashboard` interrogent les tables réelles avec sélection de colonnes sécurisée sans `r2_file_key`.
