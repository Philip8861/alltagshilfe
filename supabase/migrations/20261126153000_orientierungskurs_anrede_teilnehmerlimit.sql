alter table public.orientierungskurs_bookings
  add column contact_salutation text,
  add column contact_last_name text,
  add column split_from uuid references public.orientierungskurs_bookings(id) on delete set null,
  add constraint orientierungskurs_contact_greeting_check check (
    (contact_salutation is null and contact_last_name is null)
    or (contact_salutation is not null and contact_salutation in ('frau', 'herr')
      and contact_last_name is not null and char_length(btrim(contact_last_name)) between 1 and 80)
  );

grant update (contact_salutation, contact_last_name)
  on public.orientierungskurs_bookings to service_role;

alter table public.orientierungskurs_participants
  add column waitlisted boolean not null default false,
  add column original_course_id uuid references public.orientierungskurs_bookings(id) on delete set null;

create unique index orientierungskurs_original_registration
  on public.orientierungskurs_participants (original_course_id, email) where original_course_id is not null;

create or replace function public.orientierungskurs_check_registration()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- Anmeldungen zum selben Kurs serialisieren. Die Sperre lässt die
  -- Schlüsselsperre für den Fremdschlüssel der Anmeldung weiterhin zu.
  perform 1
  from public.orientierungskurs_bookings as course
  where course.id = new.course_id
    and course.cancelled_at is null
    and course.slot_date + course.slot_time > (clock_timestamp() at time zone 'Europe/Berlin')
  for no key update;

  if not found then
    raise exception 'Course registration is closed' using errcode = '23514',
      constraint = 'orientierungskurs_registration_open';
  end if;

  -- Wiederholungen gehen an die vorhandenen Eindeutigkeitsbedingungen,
  -- damit ein bereits gespeicherter Platz korrekt erkannt wird.
  if exists (
    select 1 from public.orientierungskurs_participants
    where course_id = new.course_id and email = new.email
  ) then
    return new;
  end if;

  if exists (
    select 1 from public.orientierungskurs_participants where original_course_id = new.course_id and email = new.email
  ) then
    raise exception 'Participant already assigned to a follow-up' using errcode = '23505';
  end if;

  new.waitlisted := (
    select count(*) from public.orientierungskurs_participants
    where course_id = new.course_id and not waitlisted
  ) >= 10;
  return new;
end;
$$;

create function public.orientierungskurs_split(
  source_id uuid, followup_id uuid, new_day date, new_time time, new_meeting_url text, selected_ids uuid[]
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  source public.orientierungskurs_bookings%rowtype;
  followup public.orientierungskurs_bookings%rowtype;
begin
  if coalesce(cardinality(selected_ids), 0) not between 1 and 10 then
    raise exception 'Choose between one and ten waitlisted participants' using errcode = '22023';
  end if;

  select * into source from public.orientierungskurs_bookings where id = source_id for no key update;
  if not found then
    raise exception 'Source course unavailable' using errcode = '22023';
  end if;

  select * into followup from public.orientierungskurs_bookings where id = followup_id;
  if found then
    if followup.split_from is distinct from source_id or followup.cancelled_at is not null
      or followup.slot_date <> new_day or followup.slot_time <> new_time
      or (select count(*) from public.orientierungskurs_participants
          where course_id = followup_id and id = any(selected_ids) and not waitlisted) <> cardinality(selected_ids) then
      raise exception 'Follow-up booking has changed' using errcode = '22023';
    end if;
    return to_jsonb(followup);
  end if;

  if source.cancelled_at is not null or new_day + new_time <= (clock_timestamp() at time zone 'Europe/Berlin')
    or (select count(*) from public.orientierungskurs_participants
        where course_id = source_id and id = any(selected_ids) and waitlisted) <> cardinality(selected_ids) then
    raise exception 'Source course or waitlist has changed' using errcode = '22023';
  end if;

  insert into public.orientierungskurs_bookings (
    id, slot_date, slot_time, format, company, contact_name, contact_email, contact_phone, contact_salutation,
    contact_last_name, address, room, parking, meeting_url, split_from
  ) values (
    followup_id, new_day, new_time, source.format, source.company, source.contact_name, source.contact_email,
    source.contact_phone, source.contact_salutation, source.contact_last_name, source.address, source.room,
    source.parking, case when source.format = 'online' then new_meeting_url end, source_id
  ) returning * into followup;

  update public.orientierungskurs_participants
  set course_id = followup_id, waitlisted = false, original_course_id = source_id
  where course_id = source_id and id = any(selected_ids) and waitlisted;
  return to_jsonb(followup);
end;
$$;

revoke all on function public.orientierungskurs_split(uuid, uuid, date, time, text, uuid[])
  from public, anon, authenticated;
grant execute on function public.orientierungskurs_split(uuid, uuid, date, time, text, uuid[])
  to service_role;
