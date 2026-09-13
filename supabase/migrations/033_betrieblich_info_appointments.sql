-- 15-Minuten-Infogespräche (betriebliche Pflegeberatung).
-- PII nur über Service Role; kein öffentlicher Zugriff.

create table if not exists public.betrieblich_info_appointments (
  id uuid primary key default gen_random_uuid(),
  slot_date date not null,
  slot_time text not null,
  full_name text not null,
  email text not null,
  company_name text not null,
  company_size text not null,
  meet_url text not null,
  created_at timestamptz not null default now(),
  constraint betrieblich_info_appointments_slot_time_fmt
    check (slot_time ~ '^[0-9]{2}:[0-9]{2}$'),
  constraint betrieblich_info_appointments_name_len
    check (char_length(full_name) between 3 and 120),
  constraint betrieblich_info_appointments_email_len
    check (char_length(email) between 3 and 200),
  constraint betrieblich_info_appointments_company_len
    check (char_length(company_name) between 2 and 200),
  constraint betrieblich_info_appointments_size_len
    check (char_length(company_size) between 1 and 32),
  constraint betrieblich_info_appointments_meet_len
    check (char_length(meet_url) between 12 and 300),
  constraint betrieblich_info_appointments_slot_unique
    unique (slot_date, slot_time)
);

create index if not exists betrieblich_info_appointments_slot_date_idx
  on public.betrieblich_info_appointments (slot_date);

alter table public.betrieblich_info_appointments enable row level security;

revoke all on public.betrieblich_info_appointments from public;
revoke all on public.betrieblich_info_appointments from anon, authenticated;
grant select, insert on public.betrieblich_info_appointments to service_role;

comment on table public.betrieblich_info_appointments is
  'Buchungen 15-Min-Infogespräch betriebliche Pflegeberatung; nur Service Role, Unique je Slot.';
