-- Jitsi/Meet-URL entfällt; Video-Einladung wird separat versendet.

alter table public.betrieblich_info_appointments
  drop constraint if exists betrieblich_info_appointments_meet_len;

alter table public.betrieblich_info_appointments
  drop column if exists meet_url;
