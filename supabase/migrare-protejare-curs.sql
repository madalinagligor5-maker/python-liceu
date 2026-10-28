-- Migrare: protejează coloanele abonamentului „Curs practic de Python".
-- Trigger-ul de protecție a coloanelor sensibile acoperea doar abonamentul de
-- liceu: un utilizator autentificat își putea seta singur curs_status='active'
-- prin API-ul Supabase și primea cursul fără plată. Acum curs_* pot fi scrise
-- doar de service_role (webhook-ul Stripe și verificarea din aplicație).
-- Adaugă și coloanele curs_*, dacă migrare-curs-practic.sql n-a fost rulată.
-- De rulat în Supabase SQL Editor (se poate rula de mai multe ori).

alter table public.users_meta
  add column if not exists curs_status text check (curs_status in ('none','active','past_due','canceled')) default 'none',
  add column if not exists curs_current_period_end timestamptz,
  add column if not exists curs_cancel_at_period_end boolean not null default false;

create or replace function public.protejeaza_coloane_sensibile()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if coalesce(current_setting('app.scriere_progres', true), 'off') <> 'on'
     and auth.role() is distinct from 'service_role' then
    new.subscription_status := old.subscription_status;
    new.subscription_current_period_end := old.subscription_current_period_end;
    new.stripe_customer_id := old.stripe_customer_id;
    new.xp_total := old.xp_total;
    new.streak_zile := old.streak_zile;
    new.rol := old.rol;
    new.cancel_at_period_end := old.cancel_at_period_end;
    new.curs_status := old.curs_status;
    new.curs_current_period_end := old.curs_current_period_end;
    new.curs_cancel_at_period_end := old.curs_cancel_at_period_end;
  end if;
  return new;
end;
$$;

drop trigger if exists proteja_users_meta on public.users_meta;
create trigger proteja_users_meta
  before update on public.users_meta
  for each row execute function public.protejeaza_coloane_sensibile();
