-- Apply after 0001 and 0002. All privileged operations run in one DB transaction.
-- Run once in Supabase SQL Editor; never expose these RPC functions to browser roles.

create table public.checkout_intents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  chariow_sale_id text unique,
  status text not null default 'pending' check (status in ('pending', 'failed', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index checkout_intents_user_idx on public.checkout_intents (user_id, created_at desc);
alter table public.checkout_intents enable row level security;
revoke all on public.checkout_intents from anon, authenticated;

-- Chariow Pulse: the server must verify the raw-body HMAC before calling this RPC.
-- Unique delivery id AND unique sale id prevent retry/replay from extending access twice.
create or replace function public.process_chariow_sale(
  p_delivery_id text, p_intent_id uuid, p_sale_id text, p_product_id text,
  p_customer_email text, p_amount numeric, p_currency text, p_event text, p_payload jsonb
) returns text language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_intent public.checkout_intents%rowtype;
  v_plan public.plans%rowtype;
  v_email text;
  v_inserted int;
begin
  if p_delivery_id is null or length(p_delivery_id) not between 6 and 200
     or p_sale_id is null or p_sale_id !~ '^sal_[a-zA-Z0-9_-]+$'
     or p_event is null or p_event not in ('successful.sale', 'failed.sale')
     or p_intent_id is null or p_payload is null then
    raise exception 'Invalid sale payload';
  end if;

  insert into public.webhook_events (id, provider, event_type, payload)
  values (p_delivery_id, 'chariow', p_event, p_payload)
  on conflict (id) do nothing;
  get diagnostics v_inserted = row_count;
  if v_inserted = 0 then return 'duplicate_delivery'; end if;

  select * into v_intent from public.checkout_intents where id = p_intent_id for update;
  if not found then raise exception 'Unknown checkout intent'; end if;
  select * into v_plan from public.plans where id = v_intent.plan_id;
  select email into v_email from public.profiles where id = v_intent.user_id and not is_suspended;
  if v_email is null or v_plan.id is null or not v_plan.is_active
     or v_plan.chariow_product_id is null or v_plan.chariow_product_id <> p_product_id
     or lower(v_email) <> lower(coalesce(p_customer_email, '')) then
    raise exception 'Sale does not match checkout intent';
  end if;
  if v_intent.chariow_sale_id is not null and v_intent.chariow_sale_id <> p_sale_id then
    raise exception 'Different sale already bound to this checkout';
  end if;
  if p_event = 'failed.sale' then
    if v_intent.status = 'failed' then return 'duplicate_failure'; end if;
    if v_intent.status <> 'completed' then
      update public.checkout_intents set status = 'failed', chariow_sale_id = p_sale_id,
        updated_at = now() where id = p_intent_id;
      insert into public.notifications (user_id, title, body, link)
      values (v_intent.user_id, 'Paiement non abouti',
        'Votre paiement n’a pas été confirmé. Vous pouvez réessayer.', '/dashboard/abonnement');
    end if;
    return 'failed_recorded';
  end if;

  if p_amount is null or p_amount <> v_plan.price_amount or p_currency <> v_plan.currency then
    raise exception 'Incorrect payment amount or currency';
  end if;
  if v_intent.status = 'completed' then return 'duplicate_sale'; end if;

  insert into public.payments (user_id, plan_id, chariow_payment_id, amount, currency, status)
  values (v_intent.user_id, v_plan.id, p_sale_id, p_amount, p_currency, 'succeeded')
  on conflict (chariow_payment_id) do nothing;
  get diagnostics v_inserted = row_count;
  if v_inserted = 0 then return 'duplicate_sale'; end if;

  -- Serialize distinct sales for one user by locking the profile row.
  perform 1 from public.profiles where id = v_intent.user_id for update;
  insert into public.subscriptions (user_id, plan_id, status, current_period_end, cancel_at_period_end)
  values (v_intent.user_id, v_plan.id, 'active', now() + make_interval(days => v_plan.duration_days), false)
  on conflict (user_id) do update set
    plan_id = excluded.plan_id,
    status = 'active',
    current_period_end = greatest(coalesce(subscriptions.current_period_end, now()), now())
      + make_interval(days => v_plan.duration_days),
    cancel_at_period_end = false;

  update public.checkout_intents set status = 'completed', chariow_sale_id = p_sale_id,
    updated_at = now() where id = p_intent_id;
  insert into public.notifications (user_id, title, body, link)
  values (v_intent.user_id, 'Abonnement VIP activé',
    'Votre période payée a été ajoutée. Vous pouvez accéder au catalogue.', '/dashboard/abonnement');
  return 'activated';
end;
$$;
revoke all on function public.process_chariow_sale(text, uuid, text, text, text, numeric, text, text, jsonb) from public, anon, authenticated;
grant execute on function public.process_chariow_sale(text, uuid, text, text, text, numeric, text, text, jsonb) to service_role;

-- Atomic, per-user serialized download entitlement + quota + audit insertion.
-- The URL is signed before calling this RPC but never returned unless this transaction succeeds.
create or replace function public.reserve_product_download(
  p_user uuid, p_product uuid, p_ip inet, p_user_agent text
) returns table (allowed boolean, reason text, used integer, quota_limit integer, is_redownload boolean)
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_quota jsonb;
  v_limit int;
  v_used int;
  v_redownload boolean;
  v_suspended boolean;
  v_month_start timestamptz;
begin
  -- Locking the profile row serializes all downloads by this user across server instances.
  select is_suspended into v_suspended from public.profiles where id = p_user for update;
  if not found or v_suspended then
    return query select false, 'NO_ACCESS'::text, 0, 0, false; return;
  end if;
  if not exists (select 1 from public.subscriptions where user_id = p_user
    and status = 'active' and current_period_end > now()) then
    return query select false, 'SUBSCRIPTION_REQUIRED'::text, 0, 0, false; return;
  end if;
  if not exists (select 1 from public.products where id = p_product and is_published) then
    return query select false, 'PRODUCT_NOT_FOUND'::text, 0, 0, false; return;
  end if;

  select value into v_quota from public.app_settings where key = 'monthly_download_quota';
  if v_quota is null then
    v_limit := 30;
  elsif jsonb_typeof(v_quota) = 'number' then
    v_limit := v_quota::text::int;
  elsif jsonb_typeof(v_quota) = 'object' and jsonb_typeof(v_quota->'limit') = 'number' then
    v_limit := (v_quota->>'limit')::int;
  else
    raise exception 'Invalid quota configuration';
  end if;
  if v_limit < 0 then raise exception 'Invalid quota configuration'; end if;

  v_month_start := date_trunc('month', now() at time zone 'UTC') at time zone 'UTC';
  select count(distinct product_id)::int into v_used from public.downloads
  where user_id = p_user and downloaded_at >= v_month_start;
  select exists (select 1 from public.downloads where user_id = p_user
    and product_id = p_product and downloaded_at >= v_month_start) into v_redownload;
  if v_used >= v_limit and not v_redownload then
    return query select false, 'QUOTA_EXCEEDED'::text, v_used, v_limit, false; return;
  end if;

  insert into public.downloads (user_id, product_id, ip_address, user_agent)
  values (p_user, p_product, p_ip, left(p_user_agent, 500));
  return query select true, 'OK'::text, v_used, v_limit, v_redownload;
end;
$$;
revoke all on function public.reserve_product_download(uuid, uuid, inet, text) from public, anon, authenticated;
grant execute on function public.reserve_product_download(uuid, uuid, inet, text) to service_role;
