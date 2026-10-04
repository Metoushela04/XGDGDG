// Vendix - Politique de confidentialité
import Link from "next/link";
import { LegalPage } from "../legal-templates";

export default function ConfidentialitePage() {
  return (
    <LegalPage title="Politique de Confidentialité" lastUpdated="4 octobre 2026">
      <section>
        <h2 className="font-display text-xl font-semibold text-text">1. Données collectées</h2>
        <p>Nous collectons les données suivantes :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Informations de compte : nom complet, adresse email</li>
          <li>Historique de téléchargements</li>
          <li>Données de paiement (traitées par Chariow, nous ne stockons pas les données bancaires)</li>
          <li>Adresse IP et user agent (pour la sécurité)</li>
          <li>Préférences de compte</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">2. Finalités du traitement</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Gestion de votre compte et de votre abonnement</li>
          <li>Fourniture du service de téléchargement</li>
          <li>Envoi de notifications et emails transactionnels</li>
          <li>Sécurité et prévention de la fraude</li>
          <li>Amélioration du service (analytics anonymisés)</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">3. Durée de conservation</h2>
        <p>
          Les données sont conservées pendant la durée de votre abonnement + 3 ans après la
          résiliation, conformément aux obligations légales.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">4. Sous-traitants</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Supabase (hébergement base de données et authentification)</li>
          <li>Cloudflare R2 (stockage des fichiers)</li>
          <li>Cloudinary (hébergement des images)</li>
          <li>Chariow (paiements)</li>
          <li>Brevo (emails)</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">5. Droits de l'utilisateur</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Droit d'accès à vos données</li>
          <li>Droit de rectification</li>
          <li>Droit de suppression (droit à l'oubli)</li>
          <li>Droit à la portabilité</li>
          <li>Droit d'opposition au traitement</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">6. Contact</h2>
        <p>
          Pour exercer vos droits : [EMAIL] | [ADRESSE POSTALE]
        </p>
      </section>
    </LegalPage>
  );
}
