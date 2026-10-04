-- =====================================================================
-- Vendix — seed.sql (PRD §13)
-- À exécuter APRÈS 0001_schema.sql. Rejouable sans doublons.
-- =====================================================================

-- 4 catégories
insert into public.categories (name, slug, sort_order) values
  ('Ebooks',           'ebooks',           1),
  ('Formations',       'formations',       2),
  ('Templates Canva',  'templates-canva',  3),
  ('Scripts',          'scripts',          4)
on conflict (slug) do nothing;

-- 2 plans (prix alignés sur la page /tarifs actuelle : 29 $/mois, 228 $/an)
insert into public.plans (code, name, price_amount, currency, duration_days) values
  ('monthly', 'Mensuel', 29.00,  'USD', 30),
  ('yearly',  'Annuel',  228.00, 'USD', 365)
on conflict (code) do nothing;

-- Paramètres (PRD §7.4, §6.6 /admin/parametres)
insert into public.app_settings (key, value) values
  ('monthly_download_quota', '30'),            -- 'unlimited' possible
  ('hourly_download_limit',  '10'),
  ('support_email',          '"support@vendix.example"'),
  ('whatsapp_number',        '""'),
  ('maintenance_mode',       'false'),
  ('legal_version',          '"1.0"')
on conflict (key) do nothing;

-- 9 pages légales : titres + contenu provisoire.
-- Les textes complets sont aujourd'hui dans les pages .tsx ; ils seront migrés ici à l'étape 4.
insert into public.legal_pages (slug, title, content_md) values
  ('conditions-generales-utilisation', 'Conditions Générales d''Utilisation',  '_Texte à importer._'),
  ('conditions-generales-vente',       'Conditions Générales de Vente',        '_Texte à importer._'),
  ('licence-plr',                      'Licence de revente (PLR)',             '_Texte à importer._'),
  ('politique-de-confidentialite',     'Politique de confidentialité',         '_Texte à importer._'),
  ('politique-de-cookies',             'Politique de cookies',                 '_Texte à importer._'),
  ('mentions-legales',                 'Mentions légales',                     '_Texte à importer._'),
  ('politique-de-remboursement',       'Politique de remboursement',           '_Texte à importer._'),
  ('politique-utilisation-acceptable', 'Politique d''utilisation acceptable',  '_Texte à importer._'),
  ('signaler-un-contenu',              'Signaler un contenu',                  '_Texte à importer._')
on conflict (slug) do nothing;

-- 6 produits de démonstration (images de substitution, fichiers R2 fictifs)
insert into public.products
  (title, slug, description, category_id, required_tools, thumbnail_url, r2_file_key, file_size_bytes, file_list, is_featured, is_published)
select v.title, v.slug, v.description, c.id, v.tools,
       'https://placehold.co/600x400/0a0a0a/8b5cf6?text=' || replace(v.title, ' ', '+'),
       'demo/' || v.slug || '.zip', v.size, v.files::jsonb, v.featured, true
from (values
  ('Pack Ebooks Business',     'pack-ebooks-business',     'Exemple : 10 ebooks sur l''entrepreneuriat, prêts à rebrander.', 'ebooks',          array['PDF','Word'],  48000000,  '["ebook-1.pdf","ebook-2.pdf","couvertures.zip"]', true),
  ('Formation Marketing',      'formation-marketing',      'Exemple : formation vidéo complète sur le marketing digital.',    'formations',      array['PDF'],         320000000, '["module-1.mp4","module-2.mp4","support.pdf"]',  true),
  ('Templates Canva Pro',      'templates-canva-pro',      'Exemple : 50 templates Canva modifiables pour réseaux sociaux.',  'templates-canva', array['Canva'],       12000000,  '["liens-canva.pdf","guide.pdf"]',                false),
  ('Kit Scripts WhatsApp',     'kit-scripts-whatsapp',     'Exemple : scripts de vente et de relance pour WhatsApp.',         'scripts',         array['Word'],        2000000,   '["scripts.docx","objections.docx"]',             false),
  ('Ebook Finance Perso',      'ebook-finance-perso',      'Exemple : guide de gestion d''argent pour débutants.',            'ebooks',          array['PDF','Word'],  9000000,   '["ebook.pdf","ebook.docx"]',                     false),
  ('Pack Logos Éditables',     'pack-logos-editables',     'Exemple : 30 logos éditables pour petites entreprises.',          'templates-canva', array['Canva'],       18000000,  '["logos.zip","licence.pdf"]',                    false)
) as v(title, slug, description, cat_slug, tools, size, files, featured)
join public.categories c on c.slug = v.cat_slug
on conflict (slug) do nothing;
