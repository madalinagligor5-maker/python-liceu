-- Tabel pentru review-urile lăsate după perioada de 7 zile gratuit.
-- Fiecare review intră automat la tombola pentru 6 luni gratuit.
-- Rulează acest script în Supabase SQL Editor (proiectul Academia Python).

create table if not exists public.reviewuri (
  id uuid primary key default gen_random_uuid(),
  stele smallint not null check (stele between 1 and 5),
  text text not null,
  email text,
  creat_la timestamptz not null default now()
);

-- Politică: oricine (anon) poate insera un review (form-ul e public).
alter table public.reviewuri enable row level security;

drop policy if exists "orice utilizator poate lasa review" on public.reviewuri;
create policy "orice utilizator poate lasa review"
  on public.reviewuri for insert
  with check (true);

-- Citirea e permisă doar pentru owner (serviciul Supabase / admin),
-- ca review-urile să nu fie expuse public prin API.
drop policy if exists "citire doar service role" on public.reviewuri;
create policy "citire doar service role"
  on public.reviewuri for select
  using (false);

-- Index pentru tragerea la sorți (random) la final de lună.
create index if not exists reviewuri_creat_la_idx on public.reviewuri (creat_la);
