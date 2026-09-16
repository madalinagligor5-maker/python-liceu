-- ============================================================
-- PRODUS NOU: "Curs practic de Python" -- separat de abonamentul de liceu,
-- cu propriul pret Stripe. Coloane paralele celor de liceu (subscription_*),
-- NU reutilizam subscription_status -- cineva poate cumpara doar cursul,
-- doar liceul, sau ambele, independent.
-- ============================================================

alter table public.users_meta
  add column if not exists curs_status text check (curs_status in ('none','active','past_due','canceled')) default 'none',
  add column if not exists curs_current_period_end timestamptz,
  add column if not exists curs_cancel_at_period_end boolean not null default false;
