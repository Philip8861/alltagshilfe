-- Partner: Hinweis „Erstpasswort ändern?“ dauerhaft unterdrücken (Einstellungen kann zurücksetzen).

alter table public.partner_profiles
  add column if not exists password_change_prompt_suppress boolean not null default false;

comment on column public.partner_profiles.password_change_prompt_suppress is
  'Wenn true: kein Hinweisdialog mehr zum Passwortwechsel (nur noch über Einstellungen steuerbar).';
