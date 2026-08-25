-- ============================================================
-- MIGRARE: Tabel Securizat pentru Limite Demo AI Vizitatori Anonimi
-- Accesat exclusiv server-side cu Service Role Client (nu expune RLS client)
-- ============================================================

create table if not exists public.demo_ai_usage (
  anon_id text primary key,
  requests_today integer not null default 0,
  last_request_date date,
  creat_la timestamptz not null default now()
);

-- RLS activat fără politici publice (doar service_role poate citi/scrie)
alter table public.demo_ai_usage enable row level security;
