-- ============================================================
-- MIGRARE: Sistem de Recapitulare Spațiată (Spaced Repetition / Leitner)
-- Permite revizuirea periodică a sublecțiilor finalizate de elevi
-- ============================================================

-- Adăugare coloane de Spaced Repetition în progres_lectii
alter table public.progres_lectii
  add column if not exists urmatoarea_recapitulare timestamptz default (now() + interval '3 days'),
  add column if not exists nivel_leitner integer not null default 1;

-- Tabel pentru istoricul recapitulărilor zilnice
create table if not exists public.recapitulari_zilnice (
  user_id uuid not null references auth.users (id) on delete cascade,
  data date not null default current_date,
  sublectie_slug text not null,
  corect boolean not null default false,
  xp_castigat integer not null default 0,
  obtinut_la timestamptz not null default now(),
  primary key (user_id, data, sublectie_slug)
);

alter table public.recapitulari_zilnice enable row level security;

drop policy if exists "recapitulari_zilnice: select propriu" on public.recapitulari_zilnice;
create policy "recapitulari_zilnice: select propriu" on public.recapitulari_zilnice
  for select using (auth.uid() = user_id);

drop policy if exists "recapitulari_zilnice: insert propriu" on public.recapitulari_zilnice;
create policy "recapitulari_zilnice: insert propriu" on public.recapitulari_zilnice
  for insert with check (auth.uid() = user_id);

drop policy if exists "recapitulari_zilnice: update propriu" on public.recapitulari_zilnice;
create policy "recapitulari_zilnice: update propriu" on public.recapitulari_zilnice
  for update using (auth.uid() = user_id);

-- Index pentru interogarea rapidă a lecțiilor scadente
create index if not exists idx_progres_lectii_recapitulare
  on public.progres_lectii (user_id, urmatoarea_recapitulare);

-- RPC pentru salvarea răspunsului la recapitulare spațiată
create or replace function public.salveaza_recapitulare_spatiata(
  p_sublectie_slug text,
  p_corect boolean
)
returns table (xp_castigat integer, nivel_nou integer, urmatoarea_data timestamptz)
language plpgsql
security definer set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_nivel integer;
  v_zile integer;
  v_urmatoare timestamptz;
  v_xp integer := 0;
begin
  if v_user is null then
    raise exception 'Neautentificat';
  end if;

  select coalesce(nivel_leitner, 1) into v_nivel
  from public.progres_lectii
  where user_id = v_user and lectie_slug = p_sublectie_slug;

  if v_nivel is null then
    v_nivel := 1;
  end if;

  if p_corect then
    -- Algoritm Leitner: 3 zile (Nivel 1), 7 zile (Nivel 2), 21 zile (Nivel 3), 45 zile (Nivel 4)
    v_nivel := min(v_nivel + 1, 4);
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
   where user_id = v_user and lectie_slug = p_sublectie_slug;

  insert into public.recapitulari_zilnice (user_id, sublectie_slug, corect, xp_castigat)
  values (v_user, p_sublectie_slug, p_corect, v_xp)
  on conflict (user_id, data, sublectie_slug)
  do update set corect = p_corect, xp_castigat = v_xp;

  if v_xp > 0 then
    perform set_config('app.scriere_progres', 'on', true);
    update public.users_meta
       set xp_total = xp_total + v_xp,
           ultima_activitate = current_date
     where user_id = v_user;
    perform set_config('app.scriere_progres', 'off', true);
  end if;

  xp_castigat := v_xp;
  nivel_nou := v_nivel;
  urmatoarea_data := v_urmatoare;
  return next;
end;
$$;

revoke all on function public.salveaza_recapitulare_spatiata(text, boolean) from public;
grant execute on function public.salveaza_recapitulare_spatiata(text, boolean) to authenticated;
