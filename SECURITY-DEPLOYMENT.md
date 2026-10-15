# Vendix — livraison sécurité (paiement & téléchargements)

## À faire AVANT de déployer ce code

1. Sauvegarder Supabase puis appliquer **dans cet ordre** les migrations `0001_schema.sql`, `0002_product_notifications.sql`, `0003_secure_billing_downloads.sql` si elles ne sont pas déjà appliquées. Ne pas rejouer une migration déjà exécutée. Le code de paiement/téléchargement exige la migration 0003 ; sans elle, ces actions échouent fermées (503), sans donner d'accès.
2. Dans Vercel, configurer les variables de `.env.example` avec de vraies valeurs. Utiliser **Node.js 22+**. Ne jamais placer `SUPABASE_SERVICE_ROLE_KEY`, `CHARIOW_API_KEY` ou `CHARIOW_PULSE_SECRET` dans une variable `NEXT_PUBLIC_*`.
3. Dans Chariow, créer **deux produits payants publiés** (30 jours et 365 jours). Mettre leurs identifiants dans la colonne `plans.chariow_product_id` :
   ```sql
   update public.plans set chariow_product_id = '<ID_MENSUEL>' where code = 'monthly';
   update public.plans set chariow_product_id = '<ID_ANNUEL>' where code = 'yearly';
   ```
   Vérifier que leur **prix et devise correspondent exactement** à `plans.price_amount` et `plans.currency`. Des montants différents sont refusés côté serveur. Ne pas mettre des ID fictifs dans ces requêtes.
4. Dans Chariow, créer un **Pulse** HTTPS vers `https://<votre-domaine>/api/chariow/webhook` avec les événements `successful.sale` et `failed.sale`. Copier son *signing secret* individuel (`whsec_…`) dans `CHARIOW_PULSE_SECRET`. Ce n'est pas la clé API. Si plusieurs Pulses sont créés, ils doivent utiliser chacun leur propre secret : ce déploiement attend **un seul Pulse**. Tester avec une vraie vente de faible montant et observer les livraisons du Pulse.
5. Le checkout API Chariow requiert pays ISO et numéro de téléphone : le bouton demande ces champs avant redirection. Le retour au site affiche **« en attente de confirmation »** : seule la vente signée reçue via Pulse active le plan.

## Modèle de facturation

Le projet utilise des **périodes fixes** (30 ou 365 jours), et non un prélèvement récurrent automatique. Chaque renouvellement doit être payé et confirmé par un nouvel événement `successful.sale`. D'après la documentation Chariow, l'achat répété de certains produits téléchargeables est bloqué si l'acheteur possède encore un accès actif ; **valider avec Chariow un type de produit compatible avec des achats répétés**, par exemple une licence, et tester le renouvellement avant de le proposer. Aucune promesse de renouvellement automatique ne doit figurer dans la communication.

## Vérifications indispensables avant ouverture publique

- `npm ci && npm test && npm run build` ; lancer avec Node.js 22+.
- Tester une mauvaise signature Pulse, un webhook sans référence de checkout, un mauvais produit/montant/devise/e-mail, deux livraisons du même événement et le rejeu d'une vente avec un autre ID : **aucun ne doit prolonger deux fois l'accès**.
- Tester un membre non abonné, expiré, suspendu, avec `current_period_end = null`, puis un abonné à quota atteint ; ils doivent tous être bloqués. Tester deux téléchargements simultanés quand il ne reste qu'une place : une seule archive nouvelle doit être autorisée. Les re-téléchargements du même produit pendant le mois UTC restent autorisés.
- Tester Cloudinary/R2 : un upload échoué ne doit pas créer de produit fictif. Vérifier que le bucket R2 est privé et que les anciens produits de démo (`demo/*.zip`) sont supprimés avant production.
- Exécuter les tests de base de données sur un **projet de staging isolé**. Les tests unitaires inclus vérifient les signatures et payloads ; ils ne prouvent pas l'intégration réelle de Chariow ni la transaction PostgreSQL car aucun accès aux services déployés n'était disponible ici.

## Limites encore ouvertes

- Le rate limiter actuel est en mémoire par instance Vercel : utiliser Redis/KV partagé et surveiller les abus avant lancement à grande échelle.
- Les notifications sont rafraîchies par polling ; la publication automatique hebdomadaire, les e-mails de rappel et les tâches d'expiration sont à implémenter.
- Support, certificats, affiliation et espionnage restent incomplets. Le lint historique du dépôt est encore en échec ; corriger puis ajouter CI, sauvegardes, surveillance et tests E2E.

Documentation officielle consultée : https://chariow.dev/fr/guides/checkout ; https://chariow.dev/en/guides/pulses ; https://chariow.dev/en/guides/pulse-security .
