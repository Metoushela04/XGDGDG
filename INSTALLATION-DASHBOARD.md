# Vendix — modifications du dashboard membre

Ce ZIP contient uniquement les fichiers ajoutés ou modifiés, aux mêmes chemins que dans le dépôt XGDGDG.

## Installation
1. À la racine de ton dépôt (le dossier avec `package.json`), extrais le ZIP et autorise le remplacement des fichiers existants.
2. Avant de déployer le nouveau code, exécute `supabase/migrations/0002_product_notifications.sql` dans le SQL Editor Supabase, sur une base ayant déjà la migration `0001_schema.sql`.
3. Configure les variables d'environnement Supabase du projet (elles ne sont pas incluses dans cette archive). Utilise Node.js 22+ puis lance `npm ci` et `npm run build`.
4. Connecte-toi comme membre et teste le menu, les notifications, les favoris et les téléchargements. Une publication de produit par l'admin doit produire une notification membre ; la cloche se rafraîchit au plus tard sous 30 secondes lorsque l'onglet est actif.

Important : le ZIP n'automatise pas la publication du samedi. Il notifie les membres lorsqu'un produit est effectivement publié. `Espionnage` et `Affiliation` sont des pages d'attente explicites ; le formulaire Support préexistant reste à implémenter. Aucun mot de passe ni jeton n'est inclus. Aucun fichier existant ne doit être supprimé pendant l'extraction.
