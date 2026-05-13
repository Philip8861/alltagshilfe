-- Teams (betriebliche Pflegeberatung) im Partnerportal: Mitglieder, Einladungen, Sichtbarkeit von Team-Provisionen.

create table if not exists public.partner_teams (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) >= 2 and char_length(name) <= 100),
  created_by_partner_id uuid not null references public.partner_profiles (id) on delete restrict,
  settings jsonb not null default '{"provision_visibility":"owner_sees_all"}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.partner_teams is 'Nur für Kooperationspartner mit Leistung „Betriebliche Pflegeberatung“ (Anwendungscode).';

create table if not exists public.partner_team_members (
  team_id uuid not null references public.partner_teams (id) on delete cascade,
  partner_id uuid not null references public.partner_profiles (id) on delete cascade,
  role text not null check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  primary key (team_id, partner_id)
);

create index if not exists partner_team_members_partner_idx on public.partner_team_members (partner_id);

create table if not exists public.partner_team_invitations (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.partner_teams (id) on delete cascade,
  invited_partner_id uuid not null references public.partner_profiles (id) on delete cascade,
  invited_by_partner_id uuid not null references public.partner_profiles (id) on delete restrict,
  token_hash text not null,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists partner_team_invitations_token_hash_uidx on public.partner_team_invitations (token_hash);

create unique index if not exists partner_team_invitations_pending_team_invitee_uidx
  on public.partner_team_invitations (team_id, invited_partner_id)
  where consumed_at is null;

create index if not exists partner_team_invitations_invited_idx on public.partner_team_invitations (invited_partner_id);

create or replace function public.partner_teams_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists partner_teams_set_updated_at_trg on public.partner_teams;
create trigger partner_teams_set_updated_at_trg
  before update on public.partner_teams
  for each row execute function public.partner_teams_set_updated_at();

alter table public.partner_teams enable row level security;
alter table public.partner_team_members enable row level security;
alter table public.partner_team_invitations enable row level security;

drop policy if exists "partner_teams_select_member" on public.partner_teams;
create policy "partner_teams_select_member"
on public.partner_teams for select
to authenticated
using (
  exists (
    select 1 from public.partner_team_members m
    where m.team_id = partner_teams.id and m.partner_id = (select auth.uid())
  )
);

drop policy if exists "partner_team_members_select_member" on public.partner_team_members;
create policy "partner_team_members_select_member"
on public.partner_team_members for select
to authenticated
using (
  exists (
    select 1 from public.partner_team_members m
    where m.team_id = partner_team_members.team_id
      and m.partner_id = (select auth.uid())
  )
);

drop policy if exists "partner_team_invitations_select_invitee" on public.partner_team_invitations;
create policy "partner_team_invitations_select_invitee"
on public.partner_team_invitations for select
to authenticated
using (
  invited_partner_id = (select auth.uid())
  and consumed_at is null
);

drop policy if exists "partner_team_invitations_select_team" on public.partner_team_invitations;
create policy "partner_team_invitations_select_team"
on public.partner_team_invitations for select
to authenticated
using (
  exists (
    select 1 from public.partner_team_members m
    where m.team_id = partner_team_invitations.team_id
      and m.partner_id = (select auth.uid())
  )
);

grant select on table public.partner_teams to authenticated;
grant select on table public.partner_team_members to authenticated;
grant select on table public.partner_team_invitations to authenticated;

grant select, insert, update, delete on table public.partner_teams to service_role;
grant select, insert, update, delete on table public.partner_team_members to service_role;
grant select, insert, update, delete on table public.partner_team_invitations to service_role;
