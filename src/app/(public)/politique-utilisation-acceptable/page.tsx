// Vendix - Politique d'utilisation acceptable
import { LegalPage } from "../legal-templates";

export default function UsageAcceptablePage() {
  return (
    <LegalPage title="Politique d'Utilisation Acceptable" lastUpdated="4 octobre 2026">
      <section>
        <h2 className="font-display text-xl font-semibold text-text">1. Usages interdits</h2>
        <p>Il est strictement interdit d'utiliser Vendix pour :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Partager vos identifiants de connexion avec des tiers</li>
          <li>Utiliser des outils automatisés (bots, scrapers) pour télécharger massivement</li>
          <li>Redistribuer les fichiers sources sur des plateformes gratuites ou concurrentes</li>
          <li>Publier du contenu illégal, diffamatoire, ou portant atteinte aux droits d'autrui</li>
          <li>Tenter de contourner les mesures de sécurité de la plateforme</li>
          <li>Revendre l'accès à Vendix lui-même</li>
          <li>Créer plusieurs comptes pour contourner les limitations</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">2. Sanctions</h2>
        <p>En cas de violation, Vendix peut :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Envoyer un avertissement</li>
          <li>Suspendre temporairement le compte</li>
          <li>Résilier le compte définitivement sans remboursement</li>
          <li>Engager des poursuites légales</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">3. Détection</h2>
        <p>
          Nous utilisons des systèmes de détection pour identifier les comportements anormaux :
          connexions depuis trop d'adresses IP distinctes, téléchargements massifs, etc.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">4. Contact</h2>
        <p>
          Pour signaler une utilisation abusive : [EMAIL]
        </p>
      </section>
    </LegalPage>
  );
}
