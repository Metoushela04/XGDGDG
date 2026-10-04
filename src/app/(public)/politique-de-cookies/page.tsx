// Vendix - Politique de cookies
import { LegalPage } from "../legal-templates";

export default function CookiesPage() {
  return (
    <LegalPage title="Politique de Cookies" lastUpdated="4 octobre 2026">
      <section>
        <h2 className="font-display text-xl font-semibold text-text">1. Cookies utilisés</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Cookies de session</strong> : nécessaires au fonctionnement du site (authentification, panier)</li>
          <li><strong>Cookies de préférences</strong> : mémorisation de vos choix (thème, langue)</li>
          <li><strong>Cookies de mesure d'audience</strong> : statistiques de visite anonymisées (activés avec votre consentement)</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">2. Gestion du consentement</h2>
        <p>
          Vous pouvez gérer vos préférences de cookies à tout moment via le bandeau de consentement
          présent sur le site ou via les paramètres de votre navigateur.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">3. Suppression des cookies</h2>
        <p>
          Vous pouvez supprimer les cookies existants et configurer votre navigateur pour refuser
          les cookies futurs. Attention, cela peut affecter le fonctionnement du site.
        </p>
      </section>
    </LegalPage>
  );
}
