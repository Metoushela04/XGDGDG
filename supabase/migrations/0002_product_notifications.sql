-- Publication time, distinct from draft creation time. Backfill older published items
-- with their creation timestamp (the exact historical publication date is unknown).
alter table public.products add column published_at timestamptz;
update public.products set published_at = created_at where is_published;
grant select (published_at) on public.products to anon, authenticated;

create or replace function public.stamp_product_publication()
returns trigger language plpgsql set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    if new.is_published then new.published_at := now(); end if;
  elsif new.is_published and not old.is_published then
    new.published_at := now();
  elsif not new.is_published then
    new.published_at := null;
  end if;
  return new;
end;
$$;
create trigger stamp_product_publication
  before insert or update of is_published on public.products
  for each row execute function public.stamp_product_publication();

-- One private notification per member, issued atomically when a product becomes public.
-- This covers both initially published products and later publish actions, including Saturday releases.
-- Existing per-member notifications are never shared between users.
create or replace function public.notify_new_product()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if not new.is_published then return new; end if;
  elsif not new.is_published or old.is_published then
    return new;
  end if;

  if new.is_published then
    insert into public.notifications (user_id, title, body, link)
    select p.id, 'Nouveau produit disponible', new.title || ' vient d''être ajouté au catalogue Vendix.', '/dashboard/nouveautes'
    from public.profiles p where not p.is_suspended;
  end if;
  return new;
end;
$$;

create trigger product_publication_notification
  after insert or update of is_published on public.products
  for each row execute function public.notify_new_product();
