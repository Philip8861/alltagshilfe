alter table public.orientierungskurs_info_appointments
  drop constraint orientierungskurs_info_appointments_slot_time_check,
  add constraint orientierungskurs_info_appointments_slot_time_check check (
    slot_time between time '08:00' and time '16:00'
    and extract(minute from slot_time) in (0, 30)
    and extract(second from slot_time) = 0
  );
