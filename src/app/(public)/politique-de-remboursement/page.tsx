// Vendix - Politique de remboursement
import { LegalPage } from "../legal-templates";

export default function RemboursementPage() {
  return (
    <LegalPage title="Politique de Remboursement" lastUpdated="4 octobre 2026">
      <section>
        <h2 className="font-display text-xl font-semibold text-text">1. Principe général</h2>
        <p>
          Vendix est un service de contenu numérique avec accès immédiat. Conformément à la
          législation applicable, le droit de rétractation ne s'applique pas aux contenus
          numériques fournis immédiatement.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">2. Garantie satisfaction 7 jours</h2>
        <p>
          Nous offrons une garantie satisfaction de 7 jours après le premier paiement. Si le
          catalogue ne vous convient pas, contactez-nous dans les 7 jours pour un remboursement
          intégral, sans justification.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">3. Cas de remboursement</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Dysfonctionnement technique empêchant l'accès au service</li>
          <li>Doublon de paiement</li>
          <li>Paiement non autorisé</li>
          <li>Garantie satisfaction 7 jours</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">4. Délai de traitement</h2>
        <p>
          Les remboursements sont traités sous 5 à 10 jours ouvrables sur le moyen de paiement
          utilisé lors de la transaction.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">5. Contact</h2>
        <p>
          Pour demander un remboursement : [EMAIL] avec le sujet « Demande de remboursement ».
        </p>
      </section>
    </LegalPage>
  );
}
