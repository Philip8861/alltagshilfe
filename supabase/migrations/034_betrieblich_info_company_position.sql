-- Position im Unternehmen bei Infogespräch-Buchungen.

alter table public.betrieblich_info_appointments
  add column if not exists company_position text;

update public.betrieblich_info_appointments
  set company_position = 'nicht angegeben'
  where company_position is null or btrim(company_position) = '';

alter table public.betrieblich_info_appointments
  alter column company_position set not null;

alter table public.betrieblich_info_appointments
  drop constraint if exists betrieblich_info_appointments_position_len;

alter table public.betrieblich_info_appointments
  add constraint betrieblich_info_appointments_position_len
    check (char_length(company_position) between 2 and 120);
