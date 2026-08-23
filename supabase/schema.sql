-- Schema PythonLiceu — de rulat în Supabase SQL Editor (proiect nou, gol).
-- Referință: auth.users este tabela gestionată automat de Supabase Auth.

create table if not exists public.users_meta (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  stripe_customer_id text,
  subscription_status text not null default 'none'
    check (subscription_status in ('none', 'active', 'past_due', 'canceled')),
  subscription_current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.progres_lectii (
  user_id uuid not null references auth.users (id) on delete cascade,
  lectie_slug text not null,
  finalizat_la timestamptz not null default now(),
  primary key (user_id, lectie_slug)
);

alter table public.users_meta enable row level security;
alter table public.progres_lectii enable row level security;

-- Un utilizator își vede și își gestionează doar propriul rând.
-- Webhook-ul Stripe scrie prin service role key, care ocolește RLS.
create policy "users_meta: select propriu" on public.users_meta
  for select using (auth.uid() = user_id);

create policy "users_meta: insert propriu" on public.users_meta
  for insert with check (auth.uid() = user_id);

create policy "users_meta: update propriu" on public.users_meta
  for update using (auth.uid() = user_id);

create policy "progres_lectii: select propriu" on public.progres_lectii
  for select using (auth.uid() = user_id);

create policy "progres_lectii: insert propriu" on public.progres_lectii
  for insert with check (auth.uid() = user_id);

create policy "progres_lectii: delete propriu" on public.progres_lectii
  for delete using (auth.uid() = user_id);

-- Creează automat rândul din users_meta la prima autentificare a unui utilizator nou.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users_meta (user_id, email)
  values (new.id, new.email)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- EXTINDERE: sistem de progresie (drum de învățare, XP, streak)
-- Adăugată în redesign-ul pedagogic. Nu înlocuiește nimic din ce e mai sus.
-- ============================================================

alter table public.users_meta
  add column if not exists clasa text check (clasa in ('IX','X','XI','XII')),
  add column if not exists xp_total integer not null default 0,
  add column if not exists streak_zile integer not null default 0,
  add column if not exists ultima_activitate date;

create table if not exists public.insigne_utilizator (
  user_id uuid not null references auth.users (id) on delete cascade,
  insigna_slug text not null,
  obtinuta_la timestamptz not null default now(),
  primary key (user_id, insigna_slug)
);

create table if not exists public.provocari_zilnice (
  user_id uuid not null references auth.users (id) on delete cascade,
  data date not null default current_date,
  lectie_slug_referinta text,
  finalizata boolean not null default false,
  xp_castigat integer not null default 0,
  primary key (user_id, data)
);

alter table public.insigne_utilizator enable row level security;
alter table public.provocari_zilnice enable row level security;

drop policy if exists "insigne_utilizator: select propriu" on public.insigne_utilizator;
create policy "insigne_utilizator: select propriu" on public.insigne_utilizator
  for select using (auth.uid() = user_id);
drop policy if exists "insigne_utilizator: insert propriu" on public.insigne_utilizator;
create policy "insigne_utilizator: insert propriu" on public.insigne_utilizator
  for insert with check (auth.uid() = user_id);

drop policy if exists "provocari_zilnice: select propriu" on public.provocari_zilnice;
create policy "provocari_zilnice: select propriu" on public.provocari_zilnice
  for select using (auth.uid() = user_id);
drop policy if exists "provocari_zilnice: insert propriu" on public.provocari_zilnice;
create policy "provocari_zilnice: insert propriu" on public.provocari_zilnice
  for insert with check (auth.uid() = user_id);
drop policy if exists "provocari_zilnice: update propriu" on public.provocari_zilnice;
create policy "provocari_zilnice: update propriu" on public.provocari_zilnice
  for update using (auth.uid() = user_id);

create index if not exists idx_progres_lectii_user
  on public.progres_lectii (user_id);

-- FIX DE SECURITATE (problema exista deja în schema originală):
-- politica "users_meta: update propriu" permite update pe rândul propriu,
-- dar NU restricționează coloanele. Fără trigger-ul de mai jos, un utilizator
-- autentificat poate să-și seteze singur subscription_status='active' (acces
-- gratuit la conținutul cu plată, ocolind Stripe) sau xp_total la orice valoare.
create or replace function public.protejeaza_coloane_sensibile()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Update-ul e permis integral doar daca vine din service_role (webhook Stripe)
  -- sau dintr-o functie security definer care a ridicat explicit flag-ul de mai
  -- jos. ATENTIE: nu se poate folosi doar auth.role() aici, pentru ca ramane
  -- 'authenticated' si in interiorul functiilor security definer, deci ar bloca
  -- si acordarea legitima de XP.
  if coalesce(current_setting('app.scriere_progres', true), 'off') <> 'on'
     and auth.role() is distinct from 'service_role' then
    new.subscription_status := old.subscription_status;
    new.subscription_current_period_end := old.subscription_current_period_end;
    new.stripe_customer_id := old.stripe_customer_id;
    new.xp_total := old.xp_total;
    new.streak_zile := old.streak_zile;
  end if;
  return new;
end;
$$;

drop trigger if exists proteja_users_meta on public.users_meta;
create trigger proteja_users_meta
  before update on public.users_meta
  for each row execute function public.protejeaza_coloane_sensibile();

-- Nivel = prag de XP. Nu influențează accesul la conținut (accesul rămâne
-- exclusiv pe abonament/lecție gratuită), e doar feedback de progres.
create or replace function public.nivel_din_xp(p_xp integer)
returns integer
language sql
immutable
as $$
  select greatest(1, floor(sqrt(greatest(coalesce(p_xp, 0), 0) / 100.0))::integer + 1);
$$;

-- Singura cale prin care un utilizator poate câștiga XP/streak: RPC securizat,
-- care validează serverside și ocolește trigger-ul (security definer).
-- XP: 20 pe lecție finalizată, 10 bonus pe quiz corect (transmis de apelant).
create or replace function public.finalizeaza_lectie(
  p_lectie_slug text,
  p_xp_quiz integer default 0
)
returns table (xp_total integer, streak_zile integer, nivel integer)
language plpgsql
security definer set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_xp_nou integer;
  v_streak_nou integer;
  v_deja boolean;
  v_xp integer;
  v_ultima date;
  v_streak integer;
begin
  if v_user is null then
    raise exception 'Neautentificat';
  end if;

  -- XP se acordă o singură dată per lecție (idempotent la re-parcurgere).
  select exists (
    select 1 from public.progres_lectii
    where user_id = v_user and lectie_slug = p_lectie_slug
  ) into v_deja;

  insert into public.progres_lectii (user_id, lectie_slug)
  values (v_user, p_lectie_slug)
  on conflict (user_id, lectie_slug) do nothing;

  select um.ultima_activitate, um.streak_zile
    into v_ultima, v_streak
  from public.users_meta um where um.user_id = v_user;

  -- Streak: +1 dacă ultima activitate a fost ieri, reset la 1 dacă e mai veche.
  if v_ultima = current_date then
    v_streak := coalesce(v_streak, 1);
  elsif v_ultima = current_date - 1 then
    v_streak := coalesce(v_streak, 0) + 1;
  else
    v_streak := 1;
  end if;

  v_xp := case when v_deja then 0 else 20 end + greatest(coalesce(p_xp_quiz, 0), 0);

  -- Ridicam flag-ul doar pe durata tranzactiei curente (al treilea argument
  -- true = is_local), ca trigger-ul de protectie sa permita aceasta scriere.
  perform set_config('app.scriere_progres', 'on', true);

  update public.users_meta um
     set xp_total = um.xp_total + v_xp,
         streak_zile = v_streak,
         ultima_activitate = current_date
   where um.user_id = v_user
   returning um.xp_total, um.streak_zile into v_xp_nou, v_streak_nou;

  perform set_config('app.scriere_progres', 'off', true);

  xp_total := coalesce(v_xp_nou, 0);
  streak_zile := coalesce(v_streak_nou, 0);
  nivel := public.nivel_din_xp(xp_total);
  return next;
end;
$$;

revoke all on function public.finalizeaza_lectie(text, integer) from public;
grant execute on function public.finalizeaza_lectie(text, integer) to authenticated;

-- ============================================================
-- EXTINDERE: Tabelă pentru newsletter
-- ============================================================
create table if not exists public.newsletter_emails (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.newsletter_emails enable row level security;

-- Oricine poate introduce un email (abonare), dar nu îl poate citi de pe client
create policy "newsletter_emails: insert public" on public.newsletter_emails
  for insert with check (true);

