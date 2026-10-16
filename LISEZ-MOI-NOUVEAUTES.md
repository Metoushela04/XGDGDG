# Vendix — lot consolidé avec design « Nouveautés »

Ce ZIP est la version à utiliser À LA PLACE de `Vendix-securite-paiements-telechargements.zip` et de `Vendix-Nouveautes-menu-gauche-correctif.zip`. Il réunit le lot dashboard + icônes + notifications + sécurité déjà livré, en remplaçant les deux fichiers concernés par la nouvelle page « Nouveautés » et son header mobile. Le menu mobile reste le panneau coulissant depuis la gauche. La page d'accueil publique n'a pas été redessinée.

Ce n'est pas le dépôt complet : extraire à la racine du projet XGDGDG, en écrasant uniquement les fichiers présents dans cette archive. Ne pas empiler l'ancien lot par-dessus celui-ci après extraction.

IMPORTANT : aucun déploiement n'a été fait. Lire `INSTALLATION-SECURITE.md` et `SECURITY-DEPLOYMENT.md` dans ce ZIP : appliquer les migrations nécessaires sur staging et configurer/tester Chariow avant tout déploiement. Les migrations n'ont pas été appliquées ici. Node 22+ conseillé.

Vérifications locales sur le dépôt avec ces deux fichiers : typecheck et build réussis ; 5 tests unitaires réussis ; lint des deux fichiers sans erreur (2 avertissements `<img>` existants). Paiements et données réelles non testés.
