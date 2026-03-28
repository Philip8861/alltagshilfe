-- Partner-Referenzcode (z. B. HM4827) + Tippgeber-Einreichungen (Partnerportal).
-- Im Supabase SQL-Editor nach 006 ausführen.

alter table public.partner_profiles
  add column if not exists partner_referral_code text;

create unique index if not exists partner_profiles_referral_code_uidx
  on public.partner_profiles (partner_referral_code)
  where partner_referral_code is not null;

comment on column public.partner_profiles.partner_referral_code is
  'Individueller Code: Initialen Vor-/Nachname + 4 Ziffern; eindeutig.';

create table if not exists public.partner_tip_submissions (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partner_profiles (id) on delete cascade,
  service_slug text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists partner_tip_submissions_partner_id_idx
  on public.partner_tip_submissions (partner_id, created_at desc);

alter table public.partner_tip_submissions enable row level security;

drop policy if exists "partner_tip_submissions_insert_own" on public.partner_tip_submissions;
create policy "partner_tip_submissions_insert_own"
on public.partner_tip_submissions for insert
to authenticated
with check (partner_id = (select auth.uid()));

drop policy if exists "partner_tip_submissions_select_own" on public.partner_tip_submissions;
create policy "partner_tip_submissions_select_own"
on public.partner_tip_submissions for select
to authenticated
using (partner_id = (select auth.uid()));

grant insert, select on table public.partner_tip_submissions to authenticated;
