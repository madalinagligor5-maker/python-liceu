-- ============================================================
-- EXTINDERE: traseu nou pentru gimnaziu (clasele VII-VIII)
-- users_meta.clasa era restrictionat la liceu (IX-XII) prin constrangerea
-- CHECK adaugata in migrare-progresie.sql. O inlocuim cu una care include
-- si VII/VIII, fara sa atingem restul coloanei (date/policy-uri/triggere).
-- ============================================================

do $$
declare
  v_nume_constrangere text;
begin
  select con.conname
    into v_nume_constrangere
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  join pg_namespace nsp on nsp.oid = rel.relnamespace
  where nsp.nspname = 'public'
    and rel.relname = 'users_meta'
    and con.contype = 'c'
    and pg_get_constraintdef(con.oid) ilike '%clasa%';

  if v_nume_constrangere is not null then
    execute format('alter table public.users_meta drop constraint %I', v_nume_constrangere);
  end if;
end $$;

alter table public.users_meta
  add constraint users_meta_clasa_check
  check (clasa in ('VII','VIII','IX','X','XI','XII'));
