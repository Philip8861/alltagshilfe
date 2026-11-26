create table public.orientierungskurs_bookings (
  id uuid primary key,
  registration_code uuid not null unique default gen_random_uuid(),
  slot_date date not null check (slot_date >= date '2026-04-01'),
  slot_time time not null check (
    slot_time between time '08:00' and time '15:00'
    and extract(minute from slot_time) = 0 and extract(second from slot_time) = 0
  ),
  format text not null check (format in ('onsite', 'online')),
  company text not null check (char_length(company) between 1 and 160),
  contact_name text not null check (char_length(contact_name) between 1 and 120),
  contact_email text not null check (char_length(contact_email) between 3 and 254),
  contact_phone text not null check (char_length(contact_phone) between 5 and 40),
  address text check (char_length(address) between 1 and 240),
  room text check (char_length(room) between 1 and 100),
  parking text check (char_length(parking) between 1 and 300),
  meeting_url text check (meeting_url like 'https://%'),
  created_at timestamptz not null default now(),
  check (
    (format = 'onsite' and address is not null and room is not null and meeting_url is null)
    or (format = 'online' and meeting_url is not null and address is null and room is null and parking is null)
  ),
  -- Zwei Stunden Kurs plus eine Stunde Pause, atomar auch bei paralleler Buchung.
  exclude using gist (
    tsrange(slot_date + slot_time, slot_date + slot_time + interval '3 hours', '[)') with &&
  )
);

create index orientierungskurs_bookings_date_idx
  on public.orientierungskurs_bookings (slot_date, slot_time);

create table public.orientierungskurs_participants (
  id uuid primary key,
  course_id uuid not null references public.orientierungskurs_bookings(id) on delete cascade,
  first_name text not null check (char_length(first_name) between 1 and 80),
  last_name text not null check (char_length(last_name) between 1 and 80),
  email text not null check (char_length(email) between 3 and 254 and email = lower(email)),
  created_at timestamptz not null default now(),
  unique (course_id, email)
);

create table public.orientierungskurs_staff (
  profile_id uuid primary key references public.partner_profiles(id) on delete cascade
);

create table public.orientierungskurs_mail_deliveries (
  delivery_key text primary key,
  lease_id uuid,
  lease_until timestamptz,
  sent_at timestamptz
);

alter table public.orientierungskurs_bookings enable row level security;
alter table public.orientierungskurs_participants enable row level security;
alter table public.orientierungskurs_staff enable row level security;
alter table public.orientierungskurs_mail_deliveries enable row level security;

revoke all on public.orientierungskurs_bookings, public.orientierungskurs_participants,
  public.orientierungskurs_staff, public.orientierungskurs_mail_deliveries from public, anon, authenticated;

grant select, insert on public.orientierungskurs_bookings, public.orientierungskurs_participants to service_role;
grant select, insert, delete on public.orientierungskurs_staff to service_role;
grant select, insert, update on public.orientierungskurs_mail_deliveries to service_role;
