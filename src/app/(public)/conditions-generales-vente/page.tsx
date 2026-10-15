// Vendix - CGV
import Link from "next/link";
import { LegalPage } from "../legal-templates";

export default function CGVPage() {
  return (
    <LegalPage title="Conditions Générales de Vente" lastUpdated="16 octobre 2026">
      <section>
        <h2 className="font-display text-xl font-semibold text-text">1. Description du service</h2>
        <p>
          Vendix est un service d'abonnement donnant accès à un catalogue de produits digitaux
          sous licence PLR (Private Label Rights). L'abonné peut télécharger et revendre ces
          produits en gardant 100% de ses revenus.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">2. Prix et périodicité</h2>
        <p>
          Deux formules d'abonnement sont disponibles :
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Plan 30 jours : 29 USD par période, renouvellement manuel</li>
          <li>Plan 365 jours : 228 USD par période (soit 19 USD/mois), renouvellement manuel</li>
        </ul>
        <p>Les prix peuvent être modifiés avec un préavis de 30 jours.</p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">3. Renouvellement manuel</h2>
        <p>
          Aucun paiement récurrent n'est prélevé automatiquement. Pour prolonger l'accès,
          l'utilisateur doit effectuer un nouveau paiement validé avant ou après l'échéance.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">4. Moyens de paiement</h2>
        <p>
          Les paiements sont acceptés via Mobile Money (M-Pesa, Orange Money, Airtel Money)
          et cartes bancaires (Visa, Mastercard) via notre partenaire Chariow.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">5. Résiliation</h2>
        <p>
          L'accès demeure disponible jusqu'à la fin de la période déjà payée, puis expire
          si aucun nouveau paiement n'est effectué. Pour une demande de remboursement,
          consulter la politique de remboursement.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">6. Accès immédiat au contenu numérique</h2>
        <p>
          Conformément à la législation sur le contenu numérique, l'accès au catalogue est
          fourni immédiatement après confirmation du paiement. L'utilisateur reconnaît que
          cela implique la renonciation au droit de rétractation.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">7. Politique de remboursement</h2>
        <p>
          Voir la <Link href="/politique-de-remboursement" className="text-accent">Politique de remboursement</Link> pour les détails.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">8. Facturation</h2>
        <p>
          L'historique des paiements est consultable dans la rubrique Mes commandes.
          Pour un justificatif de paiement, contacter le support.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">9. Litiges</h2>
        <p>
          En cas de litige, l'utilisateur peut saisir le médiateur de la consommation compétent
          dans son pays de résidence.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">10. Contact</h2>
        <p>
          Pour toute question commerciale : [EMAIL] | WhatsApp : [NUMÉRO]
        </p>
      </section>
    </LegalPage>
  );
}
