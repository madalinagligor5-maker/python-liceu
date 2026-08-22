-- RULAT ÎN Supabase SQL Editor (proiect deja parțial configurat).
-- E idempotent: folosește "if not exists" / "if exists" peste tot.
-- Creează doar ce lipsește (tabtele + trigger + funcții).

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

-- Politici (doar dacă nu există deja)
do $$
begin
  if not exists (select 1 from pg_policies where tablename='users_meta' and policyname='users_meta: select propriu') then
    create policy "users_meta: select propriu" on public.users_meta for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='users_meta' and policyname='users_meta: insert propriu') then
    create policy "users_meta: insert propriu" on public.users_meta for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='users_meta' and policyname='users_meta: update propriu') then
    create policy "users_meta: update propriu" on public.users_meta for update using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='progres_lectii' and policyname='progres_lectii: select propriu') then
    create policy "progres_lectii: select propriu" on public.progres_lectii for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='progres_lectii' and policyname='progres_lectii: insert propriu') then
    create policy "progres_lectii: insert propriu" on public.progres_lectii for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='progres_lectii' and policyname='progres_lectii: delete propriu') then
    create policy "progres_lectii: delete propriu" on public.progres_lectii for delete using (auth.uid() = user_id);
  end if;
end $$;

-- Funcție + trigger pentru crearea automată a rândului la signup
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

-- Extindere progresie
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

-- Funcții de protecție + XP (idempotente prin create or replace)
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
  end if;
  return new;
end;
$$;

drop trigger if exists proteja_users_meta on public.users_meta;
create trigger proteja_users_meta
  before update on public.users_meta
  for each row execute function public.protejeaza_coloane_sensibile();

create or replace function public.nivel_din_xp(p_xp integer)
returns integer
language sql
immutable
as $$
  select greatest(1, floor(sqrt(greatest(coalesce(p_xp, 0), 0) / 100.0))::integer + 1);
$$;

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
  if v_ultima = current_date then
    v_streak := coalesce(v_streak, 1);
  elsif v_ultima = current_date - 1 then
    v_streak := coalesce(v_streak, 0) + 1;
  else
    v_streak := 1;
  end if;
  v_xp := case when v_deja then 0 else 20 end + greatest(coalesce(p_xp_quiz, 0), 0);
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

-- Politici pentru noile tabele (dacă nu există)
do $$
begin
  if not exists (select 1 from pg_policies where tablename='insigne_utilizator' and policyname='insigne_utilizator: select propriu') then
    create policy "insigne_utilizator: select propriu" on public.insigne_utilizator for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='insigne_utilizator' and policyname='insigne_utilizator: insert propriu') then
    create policy "insigne_utilizator: insert propriu" on public.insigne_utilizator for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='provocari_zilnice' and policyname='provocari_zilnice: select propriu') then
    create policy "provocari_zilnice: select propriu" on public.provocari_zilnice for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='provocari_zilnice' and policyname='provocari_zilnice: insert propriu') then
    create policy "provocari_zilnice: insert propriu" on public.provocari_zilnice for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='provocari_zilnice' and policyname='provocari_zilnice: update propriu') then
    create policy "provocari_zilnice: update propriu" on public.provocari_zilnice for update using (auth.uid() = user_id);
  end if;
end $$;
