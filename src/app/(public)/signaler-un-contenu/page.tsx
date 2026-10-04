// Vendix - Signaler un contenu
import { LegalPage } from "../legal-templates";

export default function SignalerContenuPage() {
  return (
    <LegalPage title="Signaler un Contenu" lastUpdated="4 octobre 2026">
      <section>
        <h2 className="font-display text-xl font-semibold text-text">Procédure de signalement</h2>
        <p>
          Si vous estimez qu'un contenu disponible sur Vendix viole vos droits d'auteur ou
          toute autre propriété intellectuelle, vous pouvez le signaler en remplissant le
          formulaire ci-dessous.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">Informations requises</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Votre nom complet</li>
          <li>Votre adresse email</li>
          <li>Description du contenu original et preuve de votre droit</li>
          <li>URL ou titre du contenu incriminé sur Vendix</li>
          <li>Description de la violation alléguée</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">Traitement</h2>
        <p>
          Nous examinons chaque signalement sous 48 heures. Si la violation est confirmée,
          le contenu est retiré immédiatement et l'abonné concerné est notifié.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">Contact direct</h2>
        <p>
          Email : [EMAIL]<br />
          Objet : « Signalement de violation de droits d'auteur »
        </p>
      </section>
    </LegalPage>
  );
}
