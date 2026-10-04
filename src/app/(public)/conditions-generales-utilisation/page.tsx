// Vendix - CGU
import Link from "next/link";
import { LegalPage } from "../legal-templates";

export default function CGUPage() {
  return (
    <LegalPage title="Conditions Générales d'Utilisation" lastUpdated="4 octobre 2026">
      <section>
        <h2 className="font-display text-xl font-semibold text-text">1. Objet</h2>
        <p>
          Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation
          de la plateforme Vendix, éditée par [NOM DE LA SOCIÉTÉ], société immatriculée au registre
          du commerce de [VILLE], sous le numéro [NUMÉRO].
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">2. Création de compte</h2>
        <p>
          Pour utiliser les services de Vendix, l'utilisateur doit créer un compte en fournissant
          des informations exactes et à jour. L'utilisateur s'engage à maintenir la confidentialité
          de ses identifiants de connexion et à ne pas partager son compte avec des tiers.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">3. Responsabilités de l'utilisateur</h2>
        <p>
          L'utilisateur s'engage à utiliser la plateforme conformément aux lois en vigueur et aux
          présentes CGU. Il est responsable de l'usage fait de son compte et des produits téléchargés.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">4. Comportements interdits</h2>
        <p>Il est strictement interdit de :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Partager ses identifiants de connexion</li>
          <li>Redistribuer les fichiers sources gratuitement</li>
          <li>Revendre l'accès à la plateforme Vendix</li>
          <li>Utiliser des moyens automatisés pour télécharger massivement</li>
          <li>Contourner les mesures de protection des fichiers</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">5. Propriété intellectuelle</h2>
        <p>
          Les produits disponibles sur Vendix sont protégés par le droit d'auteur. La licence PLR
          accordée permet la revente et la modification dans les conditions définies dans la
          <Link href="/licence-plr" className="text-accent"> Licence PLR</Link>.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">6. Suspension et résiliation</h2>
        <p>
          Vendix se réserve le droit de suspendre ou résilier un compte en cas de non-respect
          des présentes CGU, avec ou sans préavis selon la gravité de l'infraction.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">7. Limitation de responsabilité</h2>
        <p>
          Vendix fournit les produits « tels quels » sans garantie expresse ou implicite.
          La responsabilité de Vendix est limitée au montant de l'abonnement payé par l'utilisateur
          au cours des 12 derniers mois.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">8. Droit applicable</h2>
        <p>
          Les présentes CGU sont régies par le droit de [PAYS]. Tout litige sera soumis
          aux tribunaux compétents de [VILLE].
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">9. Modification des conditions</h2>
        <p>
          Vendix se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs
          seront informés des modifications substantielles par email.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">10. Contact</h2>
        <p>
          Pour toute question relative aux CGU, contactez-nous à l'adresse : [EMAIL]
        </p>
      </section>
    </LegalPage>
  );
}
