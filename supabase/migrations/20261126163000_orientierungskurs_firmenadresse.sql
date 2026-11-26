alter table public.orientierungskurs_bookings
  add column company_address text check (char_length(btrim(company_address)) between 1 and 240);
grant update (company_address) on public.orientierungskurs_bookings to service_role;

create function public.orientierungskurs_followup_company_address()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  select company_address into new.company_address from public.orientierungskurs_bookings where id = new.split_from;
  return new;
end;
$$;

revoke all on function public.orientierungskurs_followup_company_address() from public, anon, authenticated;
grant execute on function public.orientierungskurs_followup_company_address() to service_role;

create trigger orientierungskurs_followup_company_address
before insert on public.orientierungskurs_bookings
for each row when (new.split_from is not null and new.company_address is null)
execute function public.orientierungskurs_followup_company_address();
