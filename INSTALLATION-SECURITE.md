# IMPORTANT — installation du lot Vendix sécurité

Ce ZIP consolide les corrections précédentes (dashboard d'origine, icônes, notifications) avec le nouveau bloc sécurité. Il s'extrait à la racine de XGDGDG, en écrasant les fichiers existants. Les fichiers non listés restent inchangés.

**NE PAS DÉPLOYER directement sur le site public.** D'abord sauvegarder la base et suivre `SECURITY-DEPLOYMENT.md` :
1. Staging : appliquer 0001 puis 0002 puis **0003_secure_billing_downloads.sql** si non déjà appliquées (ne jamais rejouer une migration déjà installée).
2. Configurer les vraies variables de `.env.example` sur la plateforme, notamment `CHARIOW_PULSE_SECRET` (`whsec_…`) et la clé API ; mettre les deux vrais `chariow_product_id` et prix identiques dans `plans`.
3. Créer UN Pulse Chariow pour `successful.sale`/`failed.sale`, tester un paiement réel et son renouvellement, un rejeu, les refus d'accès et les quotas sur staging. Voir la checklist détaillée.
4. Node.js 22+ : `npm ci && npm test && npm run build`. Déployer seulement après validation ; faire relire les CGV modifiées avant d'accepter des paiements.

Si le premier ZIP de dashboard a été appliqué, supprimer les fichiers orphelins inutilisés `src/components/dashboard/DashboardShell.tsx` et `src/lib/server-clock.ts` (une extraction ZIP ne supprime pas d'anciens fichiers).

Ce lot ne rend PAS encore l'ensemble de la plateforme prêt pour ouverture publique : support/certificats/affiliation/espionnage, limitation distribuée, tests E2E et validation de la configuration réelle restent à faire. Aucun secret réel n'est inclus.
