# Vendix — version consolidée : menu mobile sur tout le dashboard

Cette archive REMPLACE les précédents ZIP Vendix. Elle conserve l'ensemble du lot dashboard + notifications + icônes + sécurité déjà livré, et inclut la page « Nouveautés » validée ainsi que le header mobile avec menu ouvrant un panneau depuis la gauche SUR TOUTES LES PAGES DU DASHBOARD MEMBRE (y compris Tableau de bord, Mes commandes, Espionnage, Nouveautés, Affiliation, Mon profil et Support). Les liens et l'état actif du menu dépendent de la page. Le site public et l'admin ne sont pas modifiés par cette dernière demande ; l'accueil public n'a pas été redessiné.

Ce ZIP n'est pas le dépôt complet : extraire à la racine du projet XGDGDG, en écrasant les fichiers de même nom. Ne pas appliquer un ancien ZIP Vendix après celui-ci.

Vérifications sur le dépôt local : `tsc --noEmit`, `npm run build` et 5 tests unitaires OK ; lint des deux fichiers visuels sans erreur, avec 2 avertissements Next.js préexistants sur `<img>`. Le comportement visuel n'a pas été testé dans une session utilisateur réelle.

IMPORTANT : aucun déploiement ni migration SQL appliquée. Lire `INSTALLATION-SECURITE.md` et `SECURITY-DEPLOYMENT.md` dans ce ZIP. Installer Node.js 22+ et effectuer les migrations, la configuration et les tests paiements/téléchargements sur staging avant toute publication.
