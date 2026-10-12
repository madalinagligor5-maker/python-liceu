-- ============================================================
-- MIGRARE: Exerciții rezolvate salvate în cont
-- Până acum, exercițiile rezolvate (pașii 4 și 5 ai fiecărei lecții) se
-- rețineau doar în browser (localStorage). Cu acest tabel, pentru
-- utilizatorii autentificați ele se păstrează și în cont, pe orice dispozitiv.
--
-- Se rulează o singură dată, în Supabase → SQL Editor → Run.
-- Poate fi rulată din nou fără efecte (idempotentă).
-- ============================================================

create table if not exists public.exercitii_rezolvate (
  user_id uuid not null references auth.users (id) on delete cascade,
  -- Id-ul exercițiului din content/exercitii.json, ex. "1.1.4.ex1".
  exercitiu_id text not null check (char_length(exercitiu_id) between 1 and 80),
  rezolvat_la timestamptz not null default now(),
  primary key (user_id, exercitiu_id)
);

alter table public.exercitii_rezolvate enable row level security;

-- Fiecare utilizator își vede și își adaugă doar propriile rânduri.
-- Fără politică de update/delete: un exercițiu rezolvat rămâne rezolvat.
drop policy if exists "exercitii_rezolvate: select propriu" on public.exercitii_rezolvate;
create policy "exercitii_rezolvate: select propriu" on public.exercitii_rezolvate
  for select using (auth.uid() = user_id);

drop policy if exists "exercitii_rezolvate: insert propriu" on public.exercitii_rezolvate;
create policy "exercitii_rezolvate: insert propriu" on public.exercitii_rezolvate
  for insert with check (auth.uid() = user_id);
