-- Migrare: portal separat pentru profesori (planificări, fișe, progres pe
-- clasă, bancă de teste). Nu atinge conținutul curricular, gating-ul premium
-- pentru elevi sau fluxul de plată — e o funcționalitate nouă, cu propriul
-- rol de utilizator, propriile rute și propriile tabele.
-- De rulat în Supabase SQL Editor, DUPĂ schema.sql și migrările existente.

-- ============================================================
-- 1. Rol de utilizator pe users_meta
-- ============================================================
alter table public.users_meta
  add column if not exists rol text not null default 'elev'
    check (rol in ('elev', 'profesor_in_asteptare', 'profesor_aprobat', 'profesor_revocat')),
  add column if not exists scoala text,
  add column if not exists nume_afisat text;

-- Contul de admin (fondatoarea) e identificat prin variabila de mediu
-- ADMIN_EMAIL, verificată server-side la fiecare cerere — nu există azi
-- niciun tipar de cont „special" în schemă, așa cum indică promptul.
-- Nu e nevoie de o coloană/rol separat de admin pentru asta.

-- handle_new_user() e re-creată ca să citească rolul cerut la înregistrare
-- (trimis din formular, prin options.data la supabase.auth.signUp).
-- Whitelist strict: SINGURA valoare acceptată din metadata clientului e
-- 'profesor_in_asteptare' — orice altceva (inclusiv 'profesor_aprobat',
-- dacă cineva ar încerca să-l forțeze din consolă) cade pe 'elev'. Așa nu
-- se poate obține niciodată acces de profesor doar trimițând metadata
-- potrivită la signUp.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_rol text;
begin
  v_rol := case
    when new.raw_user_meta_data->>'rol_solicitat' = 'profesor_in_asteptare'
      then 'profesor_in_asteptare'
    else 'elev'
  end;

  insert into public.users_meta (user_id, email, rol, scoala)
  values (new.id, new.email, v_rol, nullif(trim(new.raw_user_meta_data->>'scoala'), ''))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

-- Extinde trigger-ul existent de protecție a coloanelor sensibile ca să
-- includă și `rol`: fără asta, un utilizator autentificat și-ar putea seta
-- singur rol='profesor_aprobat' printr-un update direct pe rândul propriu
-- (politica "users_meta: update propriu" permite update pe rând, dar nu
-- restricționează coloanele). Aprobarea rămâne posibilă DOAR din
-- /admin/profesori, care scrie prin clientul cu service role (ocolește RLS
-- și acest trigger, la fel ca webhook-ul Stripe azi).
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
  end if;
  return new;
end;
$$;

-- ============================================================
-- 2. Persistăm scorul de quiz pe progres_lectii
-- ============================================================
-- Scorul (întrebări corecte / total) era deja calculat server-side la
-- fiecare finalizare (progres.ts), dar nu era salvat nicăieri — doar
-- întors clientului pentru celebrarea din UI. Fără el, „scor mediu la
-- quiz-uri" din progresul pe clasă (Sarcina 4) n-ar avea din ce să fie
-- calculat. Extindem tabela ȘI RPC-ul existent `finalizeaza_lectie`, nu
-- construim o tabelă paralelă de urmărire.
alter table public.progres_lectii
  add column if not exists scor integer,
  add column if not exists din_total integer;

drop function if exists public.finalizeaza_lectie(text, integer);

create or replace function public.finalizeaza_lectie(
  p_lectie_slug text,
  p_xp_quiz integer default 0,
  p_scor integer default null,
  p_din_total integer default null
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

  insert into public.progres_lectii (user_id, lectie_slug, scor, din_total)
  values (v_user, p_lectie_slug, p_scor, p_din_total)
  on conflict (user_id, lectie_slug) do update
    set scor = coalesce(excluded.scor, public.progres_lectii.scor),
        din_total = coalesce(excluded.din_total, public.progres_lectii.din_total);

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

revoke all on function public.finalizeaza_lectie(text, integer, integer, integer) from public;
grant execute on function public.finalizeaza_lectie(text, integer, integer, integer) to authenticated;

-- ============================================================
-- 3. Clase și asocierea elev <-> clasă
-- ============================================================
create table if not exists public.clase (
  id uuid primary key default gen_random_uuid(),
  profesor_id uuid not null references auth.users (id) on delete cascade,
  nume_clasa text not null,
  cod_clasa text not null unique,
  creat_la timestamptz not null default now()
);

create table if not exists public.clasa_elevi (
  clasa_id uuid not null references public.clase (id) on delete cascade,
  elev_id uuid not null references auth.users (id) on delete cascade,
  data_asocierii timestamptz not null default now(),
  primary key (clasa_id, elev_id)
);

alter table public.clase enable row level security;
alter table public.clasa_elevi enable row level security;

-- Un profesor gestionează doar clasele proprii. Insert-ul verifică explicit
-- rolul din users_meta (server-side, în baza de date) — nu ne bazăm pe
-- faptul că ruta /profesor/clase e deja gatată în layout, în caz că cineva
-- apelează direct clientul Supabase din consolă.
drop policy if exists "clase: select propriu" on public.clase;
create policy "clase: select propriu" on public.clase
  for select using (auth.uid() = profesor_id);

drop policy if exists "clase: insert propriu" on public.clase;
create policy "clase: insert propriu" on public.clase
  for insert with check (
    auth.uid() = profesor_id
    and exists (
      select 1 from public.users_meta um
      where um.user_id = auth.uid() and um.rol = 'profesor_aprobat'
    )
  );

drop policy if exists "clase: delete propriu" on public.clase;
create policy "clase: delete propriu" on public.clase
  for delete using (auth.uid() = profesor_id);

-- clasa_elevi: elevul vede/gestionează doar propriile asocieri (se poate
-- asocia prin RPC și dezasocia oricând, direct). Profesorul vede doar
-- rândurile din clasele proprii — niciodată elevi din afara lor.
drop policy if exists "clasa_elevi: select elev propriu" on public.clasa_elevi;
create policy "clasa_elevi: select elev propriu" on public.clasa_elevi
  for select using (auth.uid() = elev_id);

drop policy if exists "clasa_elevi: select profesor propriu" on public.clasa_elevi;
create policy "clasa_elevi: select profesor propriu" on public.clasa_elevi
  for select using (
    exists (
      select 1 from public.clase c
      where c.id = clasa_elevi.clasa_id and c.profesor_id = auth.uid()
    )
  );

drop policy if exists "clasa_elevi: delete elev propriu" on public.clasa_elevi;
create policy "clasa_elevi: delete elev propriu" on public.clasa_elevi
  for delete using (auth.uid() = elev_id);

-- Niciun INSERT direct pe clasa_elevi din client — doar prin RPC-ul de mai
-- jos (security definer), ca să validăm codul și să nu lăsăm un profesor să
-- adauge el elevi (regula globală 4: doar elevul inițiază asocierea).

-- RPC: elevul introduce codul primit de la profesor și se asociază singur.
create or replace function public.asociaza_elev_la_clasa(p_cod_clasa text)
returns table (clasa_id uuid, nume_clasa text)
language plpgsql
security definer set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_clasa record;
begin
  if v_user is null then
    raise exception 'Neautentificat';
  end if;

  select c.id, c.nume_clasa into v_clasa
  from public.clase c
  where c.cod_clasa = upper(trim(p_cod_clasa));

  if v_clasa.id is null then
    raise exception 'Cod de clasă invalid.';
  end if;

  insert into public.clasa_elevi (clasa_id, elev_id)
  values (v_clasa.id, v_user)
  on conflict (clasa_id, elev_id) do nothing;

  clasa_id := v_clasa.id;
  nume_clasa := v_clasa.nume_clasa;
  return next;
end;
$$;

revoke all on function public.asociaza_elev_la_clasa(text) from public;
grant execute on function public.asociaza_elev_la_clasa(text) to authenticated;

-- Generează un cod scurt, lizibil, pentru o clasă nouă (litere mari + cifre,
-- fără caractere ambigue O/0/I/1). Apelat din server action, nu din client.
create or replace function public.genereaza_cod_clasa()
returns text
language sql
volatile
as $$
  select string_agg(
    substr('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', (random() * 32)::int + 1, 1),
    ''
  )
  from generate_series(1, 6);
$$;


grant execute on function public.genereaza_cod_clasa() to authenticated;

create index if not exists idx_clase_profesor on public.clase (profesor_id);
create index if not exists idx_clasa_elevi_elev on public.clasa_elevi (elev_id);
create index if not exists idx_clasa_elevi_clasa on public.clasa_elevi (clasa_id);

-- ============================================================
-- 4. Progres pe clasă, pentru profesor
-- ============================================================
-- Un profesor NU are acces direct (prin RLS) la users_meta sau progres_lectii
-- ale elevilor din clasa lui — regula globală 4 cere ca el să vadă STRICT
-- progresul de învățare (module parcurse, scor la quiz), nimic altceva
-- (niciun email, nicio dată personală suplimentară, niciun istoric de
-- conversație cu tutorul AI). În loc de politici RLS compozabile (ușor de
-- lărgit accidental mai târziu), folosim un singur punct de trecere: acest
-- RPC security definer, care verifică apartenența clasei și întoarce DOAR
-- câmpurile agregate necesare.
create or replace function public.progres_elevi_clasa(p_clasa_id uuid)
returns table (
  elev_id uuid,
  nume_afisat text,
  ultima_activitate date,
  lectii_finalizate text[],
  scor_total integer,
  scor_din_total integer
)
language plpgsql
security definer set search_path = public
as $$
begin
  if not exists (
    select 1 from public.clase c
    where c.id = p_clasa_id and c.profesor_id = auth.uid()
  ) then
    raise exception 'Acces interzis.';
  end if;

  return query
  select
    ce.elev_id,
    um.nume_afisat,
    um.ultima_activitate,
    coalesce(array_agg(pl.lectie_slug) filter (where pl.lectie_slug is not null), '{}'),
    coalesce(sum(pl.scor), 0)::integer,
    coalesce(sum(pl.din_total), 0)::integer
  from public.clasa_elevi ce
  join public.users_meta um on um.user_id = ce.elev_id
  left join public.progres_lectii pl on pl.user_id = ce.elev_id
  where ce.clasa_id = p_clasa_id
  group by ce.elev_id, um.nume_afisat, um.ultima_activitate;
end;
$$;

revoke all on function public.progres_elevi_clasa(uuid) from public;
grant execute on function public.progres_elevi_clasa(uuid) to authenticated;
