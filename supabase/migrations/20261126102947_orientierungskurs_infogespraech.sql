create table public.orientierungskurs_info_appointments (
  id uuid primary key,
  slot_date date not null,
  slot_time time not null check (
    slot_time between time '08:00' and time '15:30'
    and extract(minute from slot_time) in (0, 30)
    and extract(second from slot_time) = 0
  ),
  contact_name text not null check (char_length(contact_name) between 1 and 120),
  contact_email text not null check (char_length(contact_email) between 3 and 254),
  contact_phone text not null check (char_length(contact_phone) between 5 and 40),
  company text check (char_length(company) between 1 and 160),
  created_at timestamptz not null default now(),
  unique (slot_date, slot_time)
);

alter table public.orientierungskurs_info_appointments enable row level security;
revoke all on public.orientierungskurs_info_appointments from public, anon, authenticated;
grant select, insert on public.orientierungskurs_info_appointments to service_role;
