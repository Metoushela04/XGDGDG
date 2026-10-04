// Vendix - Licence PLR
import Link from "next/link";
import { LegalPage } from "../legal-templates";

export default function LicencePLRPage() {
  return (
    <LegalPage title="Licence de Revente (PLR)" lastUpdated="4 octobre 2026">
      <section>
        <h2 className="font-display text-xl font-semibold text-text">1. Qu'est-ce que la licence PLR ?</h2>
        <p>
          La licence PLR (Private Label Rights) est une licence qui vous donne le droit de revendre
          les produits téléchargés sur Vendix comme les vôtres, de les modifier, de les rebrander,
          et de garder 100% des revenus générés.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">2. Ce qui est autorisé</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Revendre les produits sous votre propre marque</li>
          <li>Modifier le contenu, les couvertures, les designs</li>
          <li>Fixer vos propres prix de vente</li>
          <li>Vendre sur vos propres plateformes (site, WhatsApp, réseaux sociaux)</li>
          <li>Utiliser les produits pour vos clients (freelance, agence)</li>
          <li>Créer des dérivés basés sur les produits originaux</li>
          <li>Garder 100% de vos revenus de vente</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">3. Ce qui est interdit</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Redistribuer les fichiers sources gratuitement (sur des blogs, forums, torrents)</li>
          <li>Revendre l'accès à la plateforme Vendix elle-même</li>
          <li>Partager votre compte Vendix avec d'autres personnes</li>
          <li>Céder les droits PLR à des tiers (sous-licence)</li>
          <li>Mettre en vente sur des plateformes de packs PLR concurrentes</li>
          <li>Prétendre être le créateur original des fichiers sources</li>
          <li>Revendre les produits en tant que « PLR » ou « droits de revente »</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">4. Durée de validité</h2>
        <p>
          La licence PLR est valable tant que votre abonnement Vendix est actif. Les produits
          téléchargés pendant la période d'abonnement restent sous licence même après annulation,
          à condition de ne pas avoir violé les termes de la licence.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">5. Certificat de licence</h2>
        <p>
          Chaque téléchargement génère un certificat de licence unique avec un numéro de série
          et un QR code de vérification. Ce certificat prouve votre droit de revente en cas de litige.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">6. Sanctions</h2>
        <p>
          En cas de violation des termes de la licence, Vendix se réserve le droit de :
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Suspendre ou résilier votre compte immédiatement</li>
          <li>Retirer l'accès aux téléchargements futurs</li>
          <li>Engager des poursuites légales si nécessaire</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">7. Contact</h2>
        <p>
          Pour toute question sur la licence PLR : [EMAIL]
        </p>
      </section>
    </LegalPage>
  );
}
