# Vendix — correctif notifications, SANS refonte du dashboard

Cette archive remplace le lot consolidé précédent `Vendix-lot-consolide-menu-mobile-dashboard-toutes-pages.zip`. Elle conserve la page `/dashboard` dans son design précédent, la page « Nouveautés » validée et le header mobile/menu coulissant à gauche sur toutes les pages de l'espace membre.

NOUVEAU UNIQUEMENT : le panneau des notifications dans le header du dashboard est ancré avec des marges à gauche et à droite sur mobile, afin que son titre et ses actions ne débordent plus hors de l'écran (y compris sur la page Profil). Il devient défilant si la hauteur de l'écran est limitée ; le toast est adapté à la largeur mobile.

La proposition visuelle de nouveau dashboard n'a PAS été validée : elle n'est PAS incluse dans ce ZIP. `src/app/dashboard/page.tsx` est strictement identique à celui du ZIP consolidé précédent.

Ce n'est pas le dépôt complet : extraire à la racine de XGDGDG en écrasant les fichiers de même nom. NE PAS superposer un ancien ZIP par-dessus celui-ci. Build, typecheck, 5 tests et lint ciblé notifications passent localement. Pas de test de navigateur avec données réelles.

IMPORTANT : aucune modification du site Vercel ni migration. Lire `INSTALLATION-SECURITE.md` et `SECURITY-DEPLOYMENT.md` dans ce ZIP et valider migrations/configuration/paiement en staging avant tout déploiement. Node 22+ conseillé.
