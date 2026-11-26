alter table public.orientierungskurs_bookings
  drop constraint orientierungskurs_bookings_check,
  add constraint orientierungskurs_booking_venue_check check (
    (format = 'onsite' and address is not null and meeting_url is null)
    or (format = 'online' and meeting_url is not null and address is null and room is null and parking is null)
  );
