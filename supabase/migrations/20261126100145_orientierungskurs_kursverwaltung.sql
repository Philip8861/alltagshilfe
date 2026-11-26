alter table public.orientierungskurs_bookings
  add column cancelled_at timestamptz,
  add column revision integer not null default 0 check (revision >= 0),
  drop constraint orientierungskurs_bookings_tsrange_excl,
  add constraint orientierungskurs_active_slot_excl exclude using gist (
    tsrange(slot_date + slot_time, slot_date + slot_time + interval '3 hours', '[)') with &&
  ) where (cancelled_at is null);

grant update (slot_date, slot_time, format, company, contact_name, contact_email,
  contact_phone, address, room, parking, meeting_url, cancelled_at, revision)
  on public.orientierungskurs_bookings to service_role;

-- Bei gleichzeitigem Löschen oder Verschieben darf keine Anmeldung für einen
-- bereits geschlossenen Kurs gespeichert werden.
create function public.orientierungskurs_check_registration()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  perform 1
  from public.orientierungskurs_bookings as course
  where course.id = new.course_id
    and course.cancelled_at is null
    and course.slot_date + course.slot_time > (clock_timestamp() at time zone 'Europe/Berlin')
  for share;

  if not found then
    raise exception 'Course registration is closed' using errcode = '23514',
      constraint = 'orientierungskurs_registration_open';
  end if;
  return new;
end;
$$;

revoke all on function public.orientierungskurs_check_registration() from public, anon, authenticated;
grant execute on function public.orientierungskurs_check_registration() to service_role;

create trigger orientierungskurs_registration_open
before insert on public.orientierungskurs_participants
for each row execute function public.orientierungskurs_check_registration();
