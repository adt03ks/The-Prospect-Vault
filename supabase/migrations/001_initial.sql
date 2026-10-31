-- Starter schema. Apply to a NEW Supabase project only.
create extension if not exists pgcrypto;
create table public.athletes (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 slug text not null unique,
 display_name text not null check(length(display_name) between 2 and 120),
 sport text not null,
 journey text not null default 'recruiting' check(journey in ('recruiting','nil')),
 plan text not null default 'starter' check(plan in ('starter','pro','elite')),
 bio text check(length(bio)<=5000),
 photo_url text,
 video_links text[] not null default '{}',
 is_published boolean not null default false,
 created_at timestamptz not null default now()
);
alter table public.athletes enable row level security;
create policy "Owners view own athletes" on public.athletes for select to authenticated using (owner_id=(select auth.uid()));
create policy "Owners add athletes" on public.athletes for insert to authenticated with check(owner_id=(select auth.uid()) and plan='starter' and is_published=false);
create policy "Owners update own safe profile fields" on public.athletes for update to authenticated using(owner_id=(select auth.uid())) with check(owner_id=(select auth.uid()));
-- Prevent client modification of plan, owner and publication; these require trusted server actions.
revoke update on public.athletes from authenticated;
grant update (display_name,sport,journey,bio,photo_url,video_links) on public.athletes to authenticated;
grant select,insert on public.athletes to authenticated;
-- Public access only to published profiles, via a restricted security-invoker view is NOT sufficient
-- for anonymous access under the owner-only table policy. Add a reviewed public projection
-- and dedicated policies only after privacy/consent workflows are implemented.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types) values
 ('athlete-photos','athlete-photos',false,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do nothing;
create policy "Owner uploads athlete photos" on storage.objects for insert to authenticated
with check(bucket_id='athlete-photos' and exists(select 1 from public.athletes a where a.id::text=(storage.foldername(name))[1] and a.owner_id=(select auth.uid())));
create policy "Owner reads athlete photos" on storage.objects for select to authenticated
using(bucket_id='athlete-photos' and exists(select 1 from public.athletes a where a.id::text=(storage.foldername(name))[1] and a.owner_id=(select auth.uid())));
