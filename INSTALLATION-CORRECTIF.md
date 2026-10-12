# Correctif Vendix : retour au design d'origine

Ce ZIP **remplace le ZIP précédent**. Il contient uniquement les fichiers à ajouter ou à écraser à la racine du dépôt (`package.json` doit se trouver dans ce dossier). Il inclut expressément `src/app/dashboard/page.tsx` dans sa version d'origine pour réparer l'accueil modifié par le précédent ZIP.

1. Extraire le ZIP à la racine du dépôt en acceptant l'écrasement de TOUS les fichiers correspondants. L'ancienne mise en page est restaurée ; seul le contenu du menu change. La cloche conserve l'aspect Vendix d'origine.
2. Si tu as déjà appliqué le premier ZIP, supprimer ces deux fichiers obsolètes (ils ne sont plus utilisés) :
   - `src/components/dashboard/DashboardShell.tsx`
   - `src/lib/server-clock.ts`
   Si tu ne les supprimes pas, ils restent inutilisés mais ne changent pas l'interface.
3. Dans Supabase, exécuter `supabase/migrations/0002_product_notifications.sql` **avant** déploiement du code, uniquement si cette migration n'a pas déjà été appliquée. Ne pas l'exécuter deux fois.
4. Installer avec Node.js 22+ (`npm ci`), lancer `npm run build`, puis déployer. La configuration des variables Supabase existantes n'est pas incluse.

La publication du samedi n'est pas planifiée automatiquement : les membres reçoivent une notification lorsqu'un produit est effectivement publié. Les pages Espionnage/Affiliation n'ont pas de métier implémenté dans le dépôt ; elles restent des pages d'attente, sans fausses données. Aucun secret n'est inclus.
