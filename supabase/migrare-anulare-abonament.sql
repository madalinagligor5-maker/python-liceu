-- Migrare: urmărește dacă un abonament activ e programat să se anuleze la
-- finalul perioadei curente (Stripe Billing Portal, în configurația
-- implicită, NU anulează imediat — setează cancel_at_period_end=true și
-- abonamentul rămâne "active" în Stripe până la sfârșitul perioadei plătite).
-- Fără coloana asta, contul arăta "Abonament Activ" identic înainte și după
-- ce elevul apăsa Anulează, fără nicio confirmare vizibilă că cererea a
-- fost înregistrată — de-aici impresia că "nu se anulează".
-- De rulat în Supabase SQL Editor.

alter table public.users_meta
  add column if not exists cancel_at_period_end boolean not null default false;

-- Protejam si coloana noua in trigger-ul deja existent de protectie a
-- coloanelor sensibile (aceeasi logica: doar service_role - webhook-ul
-- Stripe - poate scrie aici, niciodata clientul autentificat direct).
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
  end if;
  return new;
end;
$$;
