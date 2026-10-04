-- =====================================================================
-- Vendix — 0001_schema.sql
-- Schéma, fonctions, trigger d'inscription, index et RLS (PRD §8, §10)
-- À exécuter dans Supabase (SQL Editor ou `supabase db push`).
-- =====================================================================

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;   -- recherche textuelle rapide (catalogue)

create type public.user_role as enum ('member', 'admin');

-- ---------------------------------------------------------------------
-- 1. TABLES
-- ---------------------------------------------------------------------

create table public.profiles (
  id            uuid primary key references auth.users on delete cascade,
  full_name     text,
  email         text unique not null,
  avatar_url    text,
  role          public.user_role not null default 'member',
  is_suspended  boolean not null default false,
  created_at    timestamptz not null default now()
);

create table public.plans (
  id                  uuid primary key default gen_random_uuid(),
  code                text unique not null,          -- 'monthly' | 'yearly'
  name                text not null,
  price_amount        numeric(10,2) not null,
  currency            text not null default 'USD',
  duration_days       int not null,                  -- 30 ou 365
  chariow_product_id  text,
  is_active           boolean not null default true
);

create table public.subscriptions (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null unique references public.profiles(id) on delete cascade,
  plan_id               uuid references public.plans(id),
  status                text not null default 'inactive'
                          check (status in ('active','canceled','expired','inactive')),
  chariow_sub_id        text,
  current_period_end    timestamptz,
  cancel_at_period_end  boolean not null default false,
  updated_at            timestamptz not null default now()
);

create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text unique not null,
  slug        text unique not null,
  sort_order  int not null default 0
);

create table public.products (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text unique not null,
  description     text,
  category_id     uuid references public.categories(id),
  required_tools  text[] not null default '{}',      -- ex: {'Canva','PDF','Word'}
  thumbnail_url   text not null,                     -- Cloudinary
  preview_images  text[] not null default '{}',      -- Cloudinary
  r2_file_key     text not null,                     -- clé du ZIP sur Cloudflare R2 (jamais exposée)
  file_size_bytes bigint,
  file_list       jsonb not null default '[]',       -- contenu du ZIP affiché dans la fiche
  is_featured     boolean not null default false,
  is_published    boolean not null default false,
  created_at      timestamptz not null default now()
);

create table public.downloads (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  product_id     uuid not null references public.products(id) on delete cascade,
  ip_address     inet,
  user_agent     text,
  downloaded_at  timestamptz not null default now()
);

create table public.favorites (
  user_id     uuid references public.profiles(id) on delete cascade,
  product_id  uuid references public.products(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table public.licenses (
  id               uuid primary key default gen_random_uuid(),
  license_number   text unique not null,
  user_id          uuid not null references public.profiles(id) on delete cascade,
  product_id       uuid not null references public.products(id) on delete cascade,
  certificate_url  text,
  issued_at        timestamptz not null default now(),
  unique (user_id, product_id)
);

create table public.payments (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references public.profiles(id) on delete set null,
  plan_id             uuid references public.plans(id),
  chariow_payment_id  text unique,
  amount              numeric(10,2),
  currency            text,
  status              text,                          -- succeeded | failed | refunded
  created_at          timestamptz not null default now()
);

create table public.webhook_events (
  id            text primary key,                    -- identifiant d'événement du fournisseur (idempotence)
  provider      text not null default 'chariow',
  event_type    text,
  payload       jsonb,
  processed_at  timestamptz not null default now()
);

create table public.legal_acceptances (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  document     text not null,                        -- 'cgu' | 'cgv' | 'privacy' | 'plr'
  version      text not null,
  accepted_at  timestamptz not null default now(),
  ip_address   inet
);

create table public.legal_pages (
  slug         text primary key,                     -- = segment de route, ex: 'licence-plr'
  title        text not null,
  content_md   text not null,
  version      text not null default '1.0',
  updated_at   timestamptz not null default now()
);

create table public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete cascade,  -- null = diffusion générale
  title       text not null,
  body        text,
  link        text,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

create table public.support_tickets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  subject     text not null,
  status      text not null default 'open' check (status in ('open','pending','closed')),
  created_at  timestamptz not null default now()
);

create table public.support_messages (
  id          uuid primary key default gen_random_uuid(),
  ticket_id   uuid not null references public.support_tickets(id) on delete cascade,
  sender_id   uuid references public.profiles(id),
  from_admin  boolean not null default false,        -- (renommé : is_admin() existe déjà comme fonction)
  body        text not null,
  created_at  timestamptz not null default now()
);

create table public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  email       text not null,
  subject     text,
  message     text not null,
  is_handled  boolean not null default false,
  created_at  timestamptz not null default now()
);

create table public.content_reports (
  id              uuid primary key default gen_random_uuid(),
  reporter_name   text,
  reporter_email  text not null,
  product_id      uuid references public.products(id) on delete set null,
  description     text not null,
  status          text not null default 'new',
  created_at      timestamptz not null default now()
);

create table public.blog_posts (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text unique not null,
  content_md    text not null,
  cover_url     text,
  is_published  boolean not null default false,
  published_at  timestamptz
);

create table public.app_settings (
  key    text primary key,
  value  jsonb not null
);

create table public.admin_audit_log (
  id          uuid primary key default gen_random_uuid(),
  admin_id    uuid references public.profiles(id),
  action      text not null,
  target      text,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 2. INDEX
-- ---------------------------------------------------------------------

create index downloads_user_date_idx    on public.downloads (user_id, downloaded_at desc);
create index downloads_user_product_idx on public.downloads (user_id, product_id, downloaded_at desc);
create index subscriptions_status_idx   on public.subscriptions (status, current_period_end);
create index products_category_idx      on public.products (category_id);
create index products_published_idx     on public.products (is_published, created_at desc);
create index products_title_trgm_idx    on public.products using gin (title gin_trgm_ops);
create index products_desc_trgm_idx     on public.products using gin (description gin_trgm_ops);
create index notifications_user_idx     on public.notifications (user_id, created_at desc);
create index payments_user_idx          on public.payments (user_id, created_at desc);
create index support_messages_ticket_idx on public.support_messages (ticket_id, created_at);

-- ---------------------------------------------------------------------
-- 3. FONCTIONS ET TRIGGERS
-- ---------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and not is_suspended
  );
$$;

-- Accès actif = statut 'active' ET période non dépassée (PRD §7.3, critère 6)
create or replace function public.has_active_access(p_user uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.subscriptions s
    join public.profiles p on p.id = s.user_id
    where s.user_id = p_user
      and s.status = 'active'
      and s.current_period_end > now()
      and not p.is_suspended
  );
$$;

-- Quota mensuel : produits DISTINCTS téléchargés ce mois-ci (re-téléchargement gratuit, PRD §7.4)
create or replace function public.monthly_download_count(p_user uuid)
returns int language sql stable security definer set search_path = public as $$
  select count(distinct product_id)::int
  from public.downloads
  where user_id = p_user
    and downloaded_at >= (date_trunc('month', now() at time zone 'utc') at time zone 'utc');
$$;

-- Ces deux fonctions acceptent un uuid arbitraire : réservées au serveur (service_role)
revoke execute on function public.has_active_access(uuid)      from public, anon, authenticated;
revoke execute on function public.monthly_download_count(uuid) from public, anon, authenticated;
grant  execute on function public.has_active_access(uuid)      to service_role;
grant  execute on function public.monthly_download_count(uuid) to service_role;

-- Création automatique du profil + de la ligne d'abonnement à l'inscription
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;

  insert into public.subscriptions (user_id) values (new.id)
  on conflict (user_id) do nothing;

  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (obligatoire — PRD §10)
-- ---------------------------------------------------------------------

alter table public.profiles          enable row level security;
alter table public.subscriptions     enable row level security;
alter table public.plans             enable row level security;
alter table public.categories        enable row level security;
alter table public.products          enable row level security;
alter table public.downloads         enable row level security;
alter table public.favorites         enable row level security;
alter table public.licenses          enable row level security;
alter table public.payments          enable row level security;
alter table public.webhook_events    enable row level security;
alter table public.legal_acceptances enable row level security;
alter table public.legal_pages       enable row level security;
alter table public.notifications     enable row level security;
alter table public.support_tickets   enable row level security;
alter table public.support_messages  enable row level security;
alter table public.contact_messages  enable row level security;
alter table public.content_reports   enable row level security;
alter table public.blog_posts        enable row level security;
alter table public.app_settings      enable row level security;
alter table public.admin_audit_log   enable row level security;

-- Profils : chacun lit/modifie le sien. Un membre ne peut modifier QUE nom et avatar
-- (rôle, suspension, e-mail : uniquement via service_role côté serveur).
create policy profil_lecture on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy profil_maj     on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from anon, authenticated;
grant  update (full_name, avatar_url) on public.profiles to authenticated;

-- Abonnements : lecture du sien ; écriture uniquement service_role (webhook) ou admin
create policy abo_lecture on public.subscriptions for select using (user_id = auth.uid() or public.is_admin());
create policy abo_admin   on public.subscriptions for all using (public.is_admin());

-- Lecture publique
create policy plans_public on public.plans       for select using (is_active or public.is_admin());
create policy cat_public   on public.categories  for select using (true);
create policy prod_public  on public.products    for select using (is_published or public.is_admin());
create policy legal_public on public.legal_pages for select using (true);
create policy blog_public  on public.blog_posts  for select using (is_published or public.is_admin());

-- Écriture admin
create policy plans_admin  on public.plans       for all using (public.is_admin());
create policy cat_admin    on public.categories  for all using (public.is_admin());
create policy prod_admin   on public.products    for all using (public.is_admin());
create policy legal_admin  on public.legal_pages for all using (public.is_admin());
create policy blog_admin   on public.blog_posts  for all using (public.is_admin());

-- products : la clé R2 n'est JAMAIS lisible avec la clé publique (anon/authenticated).
-- Conséquence : toujours lister les colonnes dans les requêtes client (pas de select '*').
-- Le serveur (service_role) lit r2_file_key pour générer l'URL signée.
revoke select on public.products from anon, authenticated;
grant  select (id, title, slug, description, category_id, required_tools, thumbnail_url,
               preview_images, file_size_bytes, file_list, is_featured, is_published, created_at)
  on public.products to anon, authenticated;

-- Données personnelles : l'utilisateur voit les siennes, l'admin voit tout
create policy dl_lecture        on public.downloads         for select using (user_id = auth.uid() or public.is_admin());
create policy fav_all           on public.favorites         for all    using (user_id = auth.uid());
create policy lic_lecture       on public.licenses          for select using (user_id = auth.uid() or public.is_admin());
create policy pay_lecture       on public.payments          for select using (user_id = auth.uid() or public.is_admin());
create policy legal_acc_lecture on public.legal_acceptances for select using (user_id = auth.uid() or public.is_admin());
create policy legal_acc_insert  on public.legal_acceptances for insert with check (user_id = auth.uid());

-- Notifications : lecture des siennes + diffusions ; le membre ne peut changer que is_read
create policy notif_lecture on public.notifications for select
  using (user_id = auth.uid() or user_id is null or public.is_admin());
create policy notif_maj     on public.notifications for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy notif_admin   on public.notifications for all using (public.is_admin());
revoke update on public.notifications from anon, authenticated;
grant  update (is_read) on public.notifications to authenticated;

-- Support
create policy tick_lecture on public.support_tickets for select using (user_id = auth.uid() or public.is_admin());
create policy tick_insert  on public.support_tickets for insert with check (user_id = auth.uid());
create policy tick_admin   on public.support_tickets for update using (public.is_admin());
create policy msg_lecture  on public.support_messages for select using (
  public.is_admin() or exists (select 1 from public.support_tickets t where t.id = ticket_id and t.user_id = auth.uid()));
create policy msg_insert   on public.support_messages for insert with check (
  sender_id = auth.uid()
  and from_admin = public.is_admin()
  and (public.is_admin() or exists (select 1 from public.support_tickets t where t.id = ticket_id and t.user_id = auth.uid())));

-- Contact / signalements : insertion via route API (service_role), lecture admin
create policy contact_admin on public.contact_messages for all using (public.is_admin());
create policy report_admin  on public.content_reports  for all using (public.is_admin());

-- Tables serveur / admin
create policy settings_admin on public.app_settings    for all    using (public.is_admin());
create policy audit_admin    on public.admin_audit_log for select using (public.is_admin());
create policy webhook_admin  on public.webhook_events   for select using (public.is_admin());
