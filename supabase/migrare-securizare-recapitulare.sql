-- ============================================================
-- MIGRARE: Securizare recapitulare spațiată
-- Rulează DUPĂ migrare-recapitulare-spatiata.sql (are nevoie de coloanele
-- progres_lectii.nivel_leitner / urmatoarea_recapitulare și de tabelul
-- recapitulari_zilnice, create acolo).
--
-- PROBLEMA REPARATĂ (raportată de un audit independent, pe cod):
-- funcția originală salveaza_recapitulare_spatiata(text, boolean) primea
-- p_corect direct de la apelant și îl salva fără nicio verificare proprie.
-- Acțiunea Next.js (src/app/actions/gamification.ts) calculează deja
-- corect răspunsul pe server, dar funcția SQL avea GRANT EXECUTE pentru
-- rolul "authenticated" — deci putea fi apelată direct din clientul
-- Supabase al browserului, ocolind complet acțiunea Next.js:
--
--   supabase.rpc('salveaza_recapitulare_spatiata', {
--     p_sublectie_slug: 'orice-slug-chiar-inventat',
--     p_corect: true
--   })
--
-- Verificat live (script de audit, cont de test): apelul de mai sus
-- acordă XP și avansează nivelul Leitner chiar și pentru un slug complet
-- inventat, fără nicio lecție reală parcursă — bug-ul e la nivel de
-- funcție SQL, nu doar de acțiune Next.js.
--
-- FIX (2 straturi):
--   Strat 1 — funcția nu mai e deloc apelabilă din browser: identitatea
--     utilizatorului vine acum ca parametru explicit (p_user_id), nu din
--     auth.uid(), iar EXECUTE nu mai e acordat rolurilor "authenticated"/
--     "anon" — doar service_role (folosit exclusiv server-side) o poate
--     apela. service_role ocolește grant-urile obișnuite (la fel cum
--     ocolește RLS), deci nu are nevoie de un GRANT explicit.
--   Strat 3 — n/a în SQL: verificarea că sublecția e chiar scadentă azi
--     pentru utilizator se face în Next.js, înainte de a apela acest RPC
--     (vezi src/app/actions/gamification.ts) — sursa de adevăr rămâne
--     aceeași interogare folosită de getRecapitulareSpatiata.
--
-- Strat 2 (semnătură HMAC peste (user_id, slug, corect, timestamp),
-- verificată în funcția SQL) NU a fost implementat: necesită confirmarea
-- că extensia pgcrypto e activă pe acest proiect Supabase, lucru pe care
-- nu l-am putut verifica din acest mediu (fără acces la
-- `select * from pg_extension`). Strat 1 elimină complet posibilitatea de
-- apel din browser — funcția nu mai există sub nicio formă apelabilă cu
-- cheile publice (anon/authenticated) — deci vulnerabilitatea raportată e
-- închisă integral chiar și fără Stratul 2. Dacă vrei totuși semnătura
-- HMAC ca apărare suplimentară (ex. împotriva unui GRANT reintrodus
-- accidental pe viitor), confirmă mai întâi în Supabase → Database →
-- Extensions că "pgcrypto" e activă, apoi cere o migrare separată pentru ea.
-- ============================================================

-- Elimină funcția veche (semnătură (text, boolean), apelabilă de authenticated).
drop function if exists public.salveaza_recapitulare_spatiata(text, boolean);

create or replace function public.salveaza_recapitulare_spatiata(
  p_user_id uuid,
  p_sublectie_slug text,
  p_corect boolean
)
returns table (xp_castigat integer, nivel_nou integer, urmatoarea_data timestamptz)
language plpgsql
security definer set search_path = public
as $$
declare
  v_nivel integer;
  v_zile integer;
  v_urmatoare timestamptz;
  v_xp integer := 0;
begin
  if p_user_id is null then
    raise exception 'Utilizator lipsă';
  end if;

  select coalesce(nivel_leitner, 1) into v_nivel
  from public.progres_lectii
  where user_id = p_user_id and lectie_slug = p_sublectie_slug;

  if v_nivel is null then
    v_nivel := 1;
  end if;

  if p_corect then
    -- Algoritm Leitner: 3 zile (Nivel 1), 7 zile (Nivel 2), 21 zile (Nivel 3), 45 zile (Nivel 4)
    -- NOTĂ: funcția originală folosea min(v_nivel + 1, 4) — min() nu există ca
    -- funcție scalară cu 2 argumente în PostgreSQL (doar ca agregat), ceea ce
    -- ar fi aruncat o eroare de execuție la orice răspuns corect. Corectat la
    -- least(), forma scalară echivalentă.
    v_nivel := least(v_nivel + 1, 4);
    v_xp := 20; -- 20 XP pentru recapitulare corectă
  else
    v_nivel := 1; -- Reset la nivelul 1 dacă e greșit
    v_xp := 0;
  end if;

  v_zile := case v_nivel
    when 1 then 3
    when 2 then 7
    when 3 then 21
    else 45
  end;

  v_urmatoare := now() + (v_zile || ' days')::interval;

  update public.progres_lectii
     set nivel_leitner = v_nivel,
         urmatoarea_recapitulare = v_urmatoare
   where user_id = p_user_id and lectie_slug = p_sublectie_slug;

  insert into public.recapitulari_zilnice (user_id, sublectie_slug, corect, xp_castigat)
  values (p_user_id, p_sublectie_slug, p_corect, v_xp)
  on conflict (user_id, data, sublectie_slug)
  do update set corect = p_corect, xp_castigat = v_xp;

  if v_xp > 0 then
    perform set_config('app.scriere_progres', 'on', true);
    update public.users_meta
       set xp_total = xp_total + v_xp,
           ultima_activitate = current_date
     where user_id = p_user_id;
    perform set_config('app.scriere_progres', 'off', true);
  end if;

  xp_castigat := v_xp;
  nivel_nou := v_nivel;
  urmatoarea_data := v_urmatoare;
  return next;
end;
$$;

-- STRATUL 1: nicio grantare către authenticated/anon. Funcția e apelabilă
-- DOAR cu service_role (folosit exclusiv server-side, din
-- src/app/actions/gamification.ts, niciodată din cod care rulează în
-- browser). service_role ocolește grant-urile obișnuite, la fel cum
-- ocolește RLS — nu are nevoie de GRANT explicit aici.
--
-- ATENȚIE PENTRU ORICE MIGRARE VIITOARE: nu adăuga niciodată
-- `grant execute on function public.salveaza_recapitulare_spatiata ... to authenticated`
-- (sau "to anon", sau "to public") — asta a fost exact vulnerabilitatea
-- reparată de această migrare. Orice PR care reintroduce un astfel de GRANT
-- pe această funcție trebuie respins la code review.
revoke all on function public.salveaza_recapitulare_spatiata(uuid, text, boolean) from public;
revoke execute on function public.salveaza_recapitulare_spatiata(uuid, text, boolean) from authenticated;
revoke execute on function public.salveaza_recapitulare_spatiata(uuid, text, boolean) from anon;
