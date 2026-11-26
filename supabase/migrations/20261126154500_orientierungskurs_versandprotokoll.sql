create table public.orientierungskurs_outreach (
  email text primary key check (char_length(email) between 3 and 254 and email = lower(btrim(email))),
  code uuid not null unique default gen_random_uuid(),
  status text not null check (status in ('sending', 'sent', 'failed', 'unconfirmed')),
  source text not null check (source in ('dashboard', 'manual')),
  actor text not null,
  note text check (char_length(note) <= 400),
  salutation text check (salutation in ('frau', 'herr')),
  last_name text check (char_length(last_name) between 1 and 80),
  updated_at timestamptz not null default now(),
  sent_at timestamptz,
  reminder_status text check (reminder_status in ('sending', 'sent', 'failed', 'unconfirmed')),
  reminder_at timestamptz,
  notice_sent_at timestamptz,
  check ((status = 'sent') = (sent_at is not null)),
  check (source <> 'manual' or status = 'sent')
);

create index orientierungskurs_outreach_recent_idx on public.orientierungskurs_outreach (updated_at desc);

alter table public.orientierungskurs_outreach enable row level security;
revoke all on public.orientierungskurs_outreach from public, anon, authenticated;
grant select, insert, update on public.orientierungskurs_outreach to service_role;

alter table public.orientierungskurs_bookings
  add column outreach_code uuid references public.orientierungskurs_outreach(code) on delete set null;

create index orientierungskurs_bookings_outreach_code_idx on public.orientierungskurs_bookings (outreach_code)
  where outreach_code is not null;
create index orientierungskurs_bookings_contact_email_idx on public.orientierungskurs_bookings (lower(contact_email));
create index orientierungskurs_bookings_contact_domain_idx
  on public.orientierungskurs_bookings (split_part(lower(contact_email), '@', 2));

create view public.orientierungskurs_outreach_status with (security_invoker = true) as
select invitation.*,
  matched.registration_code as booked_registration_code, matched.company as booked_company,
  matched.contact_name as booked_contact, matched.contact_email as booked_email, matched.slot_date as booked_date,
  matched.method as match_method,
  (invitation.status = 'sent' and matched.registration_code is null and invitation.sent_at <= now() - interval '14 days') as due
from public.orientierungskurs_outreach as invitation
left join lateral (
  select booking.registration_code, booking.company, booking.contact_name, booking.contact_email, booking.slot_date,
    case when booking.outreach_code = invitation.code then 'link'
      when lower(booking.contact_email) = invitation.email then 'email'
      else 'domain' end as method
  from public.orientierungskurs_bookings as booking
  where invitation.status = 'sent' and booking.cancelled_at is null and booking.split_from is null
    and (
      booking.outreach_code = invitation.code
      or (booking.created_at >= invitation.sent_at - interval '1 minute' and (
        lower(booking.contact_email) = invitation.email
        or (
          split_part(lower(booking.contact_email), '@', 2) = split_part(invitation.email, '@', 2)
          and split_part(invitation.email, '@', 2) not in (
            'gmail.com', 'googlemail.com', 'gmx.de', 'gmx.net', 'gmx.at', 'gmx.ch', 'web.de', 't-online.de',
            'outlook.de', 'outlook.com', 'hotmail.de', 'hotmail.com', 'live.de', 'live.com', 'msn.com',
            'icloud.com', 'me.com', 'mac.com', 'yahoo.de', 'yahoo.com', 'aol.com', 'aol.de',
            'freenet.de', 'mail.de', 'email.de', 'posteo.de', 'mailbox.org', 'proton.me', 'protonmail.com',
            'arcor.de', 'online.de', 'vodafone.de'
          )
        )
      ))
    )
  order by (booking.outreach_code is not distinct from invitation.code) desc,
    (lower(booking.contact_email) = invitation.email) desc, booking.created_at desc
  limit 1
) as matched on true;

revoke all on public.orientierungskurs_outreach_status from public, anon, authenticated;
grant select on public.orientierungskurs_outreach_status to service_role;
