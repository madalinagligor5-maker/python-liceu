-- Migrare de corecție: portalul de profesori NU mai include nicio legătură
-- cu conturile de elevi (fără clase, fără cod de asociere, fără progres
-- agregat pe clasă). Elimină exact ce a adăugat migrarea anterioară pentru
-- acea parte (clase, clasa_elevi, RPC-urile asociate) și readuce
-- finalizeaza_lectie/progres_lectii/users_meta la starea dinaintea lor.
-- De rulat DUPĂ migrare-portal-profesori.sql, în Supabase SQL Editor.
--
-- Sigur de rulat: nu s-a creat nicio clasă reală, deci nu există date de
-- pierdut pe tabelele șterse mai jos.

-- ============================================================
-- 1. Elimină clase, clasa_elevi și RPC-urile lor
-- ============================================================
drop function if exists public.progres_elevi_clasa(uuid);
drop function if exists public.asociaza_elev_la_clasa(text);
drop function if exists public.genereaza_cod_clasa();

drop table if exists public.clasa_elevi;
drop table if exists public.clase;

-- ============================================================
-- 2. Revino la finalizeaza_lectie(text, integer) — fără scor/din_total,
--    care existau doar pentru progresul pe clasă, acum eliminat.
-- ============================================================
drop function if exists public.finalizeaza_lectie(text, integer, integer, integer);

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

alter table public.progres_lectii
  drop column if exists scor,
  drop column if exists din_total;

-- ============================================================
-- 3. Elimină nume_afisat — exista doar ca profesorul să vadă un nume în
--    locul emailului pe pagina de clasă. Fără nicio legătură elev-profesor,
--    n-are ce citi vreodată coloana asta.
-- ============================================================
alter table public.users_meta
  drop column if exists nume_afisat;

-- rol, scoala rămân neschimbate — sunt încă folosite de rolul de profesor.
