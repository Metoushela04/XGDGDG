# Correctif d'icônes Vendix — toutes les pages concernées

À appliquer sur le dépôt ayant déjà reçu le correctif du design d'origine. Extraire à la racine (dossier avec `package.json`) en écrasant les 6 fichiers. Ce ZIP **remplace tous les petits ZIP d'icônes précédents** : ne les ajoute pas de nouveau. Il n'introduit ni migration ni dépendance.

Remplacements :
- Nouveautés (menu + titre) : symbole brillant → `PackagePlus` (nouveau produit).
- Catalogue vivant (accueil public) : symbole brillant → `PackagePlus`.
- Activer l'accès VIP (dashboard) : symbole brillant → `Crown`.
- Paiement validé (abonnement) : symbole brillant → `CircleCheck`.
- Se déconnecter (composant partagé mobile et ordinateur) : ancienne porte-flèche → `Power`.

L'apparence générale, les styles, textes et actions restent inchangés. La recherche dans `src` ne trouve plus `Sparkles` ni `LogOut`. Build vérifié.
