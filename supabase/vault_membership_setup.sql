-- Additive membership portal setup for The Prospect Vault.
-- Applied to the existing Supabase project after checking for the five missing vault_* tables.
-- Does not change the earlier athletes or domain-registration tables.
-- Selected plans are NOT verified paid subscriptions; subscription_status stays 'unpaid'.

create table public.vault_accounts (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  plan text not null default 'starter' check (plan in ('starter','pro','elite')),
  account_type text not null default 'adult_athlete' check (account_type in ('adult_athlete','guardian')),
  subscription_status text not null default 'unpaid' check (subscription_status in ('unpaid','active','past_due','canceled')),
  created_at timestamptz not null default now()
);

create table public.vault_athlete_profiles (
  account_id uuid primary key references public.vault_accounts(id) on delete cascade,
  athlete_name text not null default '' check (length(athlete_name) <= 120),
  sport text not null default '' check (length(sport) <= 120),
  position text not null default '' check (length(position) <= 120),
  graduation_year integer check (graduation_year between 1990 and 2050),
  school text not null default '' check (length(school) <= 160),
  city_state text not null default '' check (length(city_state) <= 120),
  bio text not null default '' check (length(bio) <= 1200),
  created_at timestamptz not null default now()
);

create table public.vault_media (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.vault_accounts(id) on delete cascade,
  kind text not null check (kind in ('photo','video')),
  title text not null default '' check (length(title) <= 120),
  storage_path text,
  video_url text,
  created_at timestamptz not null default now(),
  constraint vault_media_payload_check check (
    (kind = 'photo' and storage_path is not null and video_url is null)
    or (kind = 'video' and video_url is not null and storage_path is null)
  )
);

create index vault_media_account_id_created_at_idx on public.vault_media(account_id, created_at);

create table public.vault_stats (
  account_id uuid primary key references public.vault_accounts(id) on delete cascade,
  basic_metrics jsonb not null default '[]'::jsonb check (jsonb_typeof(basic_metrics) = 'array'),
  advanced_metrics jsonb not null default '[]'::jsonb check (jsonb_typeof(advanced_metrics) = 'array')
);

create table public.vault_recruiting_contacts (
  account_id uuid primary key references public.vault_accounts(id) on delete cascade,
  recruiting_email text not null default '',
  coach_name text not null default '',
  coach_email text not null default '',
  guardian_email text not null default '',
  contact_notes text not null default ''
);

alter table public.vault_accounts enable row level security;
alter table public.vault_athlete_profiles enable row level security;
alter table public.vault_media enable row level security;
alter table public.vault_stats enable row level security;
alter table public.vault_recruiting_contacts enable row level security;

-- Membership/subscription fields are writable by trusted server code only.
grant select on public.vault_accounts to authenticated;
create policy "Vault account owner reads account" on public.vault_accounts
  for select to authenticated using ((select auth.uid()) = id);

-- Other portal data can be created and edited only by the signed-in owner.
grant select,insert,update on public.vault_athlete_profiles to authenticated;
create policy "Vault profile owner reads" on public.vault_athlete_profiles
  for select to authenticated using ((select auth.uid()) = account_id);
create policy "Vault profile owner inserts" on public.vault_athlete_profiles
  for insert to authenticated with check ((select auth.uid()) = account_id);
create policy "Vault profile owner updates" on public.vault_athlete_profiles
  for update to authenticated using ((select auth.uid()) = account_id)
  with check ((select auth.uid()) = account_id);

grant select,insert,delete on public.vault_media to authenticated;
create policy "Vault media owner reads" on public.vault_media
  for select to authenticated using ((select auth.uid()) = account_id);
create policy "Vault media owner inserts" on public.vault_media
  for insert to authenticated with check ((select auth.uid()) = account_id);
create policy "Vault media owner deletes" on public.vault_media
  for delete to authenticated using ((select auth.uid()) = account_id);

grant select,insert,update on public.vault_stats to authenticated;
create policy "Vault stats owner reads" on public.vault_stats
  for select to authenticated using ((select auth.uid()) = account_id);
create policy "Vault stats owner inserts" on public.vault_stats
  for insert to authenticated with check ((select auth.uid()) = account_id);
create policy "Vault stats owner updates" on public.vault_stats
  for update to authenticated using ((select auth.uid()) = account_id)
  with check ((select auth.uid()) = account_id);

grant select,insert,update on public.vault_recruiting_contacts to authenticated;
create policy "Vault contacts owner reads" on public.vault_recruiting_contacts
  for select to authenticated using ((select auth.uid()) = account_id);
create policy "Vault contacts owner inserts" on public.vault_recruiting_contacts
  for insert to authenticated with check ((select auth.uid()) = account_id);
create policy "Vault contacts owner updates" on public.vault_recruiting_contacts
  for update to authenticated using ((select auth.uid()) = account_id)
  with check ((select auth.uid()) = account_id);

-- Private trigger keeps plan selection separate from verified paid entitlement.
-- auth user_metadata is user-controlled and must never grant subscription_status = active.
create schema if not exists private;
revoke all on schema private from public;
create function private.tpv_create_vault_account()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.vault_accounts (id,email,plan,account_type,subscription_status)
  values (
    new.id,
    coalesce(new.email,''),
    case when new.raw_user_meta_data->>'vault_plan' in ('starter','pro','elite')
      then new.raw_user_meta_data->>'vault_plan' else 'starter' end,
    case when new.raw_user_meta_data->>'vault_account_type' in ('adult_athlete','guardian')
      then new.raw_user_meta_data->>'vault_account_type' else 'adult_athlete' end,
    'unpaid'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke all on function private.tpv_create_vault_account() from public;
create trigger tpv_create_vault_account_after_signup
after insert on auth.users
for each row execute function private.tpv_create_vault_account();

-- Existing Auth users need a corresponding membership record too.
insert into public.vault_accounts (id,email,plan,account_type,subscription_status)
select id,coalesce(email,''),
  case when raw_user_meta_data->>'vault_plan' in ('starter','pro','elite')
    then raw_user_meta_data->>'vault_plan' else 'starter' end,
  case when raw_user_meta_data->>'vault_account_type' in ('adult_athlete','guardian')
    then raw_user_meta_data->>'vault_account_type' else 'adult_athlete' end,
  'unpaid'
from auth.users
on conflict (id) do nothing;

-- The actual onboarding code stores photos under <authenticated-user-id>/...
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('vault-athlete-media','vault-athlete-media',false,5242880,
  array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "Vault photo owner uploads" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'vault-athlete-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
create policy "Vault photo owner views" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'vault-athlete-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
create policy "Vault photo owner removes" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'vault-athlete-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
