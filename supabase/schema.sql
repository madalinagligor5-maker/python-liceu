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
