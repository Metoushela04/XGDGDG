// Vendix - Mentions légales
import { LegalPage } from "../legal-templates";

export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions Légales" lastUpdated="4 octobre 2026">
      <section>
        <h2 className="font-display text-xl font-semibold text-text">Éditeur</h2>
        <p>
          La plateforme Vendix est éditée par [NOM DE LA SOCIÉTÉ], société [forme juridique]
          au capital de [MONTANT] [DEVISE], immatriculée au RCS de [VILLE] sous le numéro [NUMÉRO].
        </p>
        <p>
          Adresse : [ADRESSE COMPLÈTE]<br />
          Téléphone : [TÉLÉPHONE]<br />
          Email : [EMAIL]
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">Directeur de la publication</h2>
        <p>[NOM DU DIRECTEUR], en qualité de [FONCTION].</p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">Hébergeur</h2>
        <p>
          Vercel Inc.<br />
          340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis<br />
          https://vercel.com
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">Propriété intellectuelle</h2>
        <p>
          L'ensemble du contenu de la plateforme Vendix (textes, images, logos, marques) est
          protégé par le droit d'auteur et la propriété intellectuelle.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text">Droit applicable</h2>
        <p>
          Les présentes mentions légales sont régies par le droit de [PAYS].
        </p>
      </section>
    </LegalPage>
  );
}
