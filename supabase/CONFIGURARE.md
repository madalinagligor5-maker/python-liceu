# Configurare Supabase + Vercel

Pași necesari ca dashboard-ul cu progres (XP, streak, insigne) să funcționeze.
Fără ei, lecțiile gratuite merg normal, dar autentificarea și progresul nu.

## 1. Rulează migrarea în Supabase

1. Supabase → proiectul tău → **SQL Editor** → **New query**
2. Copiază **tot** conținutul din `supabase/migrare-progresie.sql`
3. **Run**

Migrarea este idempotentă (`if not exists` / `drop policy if exists`), deci se
poate rula de mai multe ori fără efecte secundare.

Ce adaugă:

| Obiect | Rol |
|---|---|
| `users_meta.clasa` | Clasa selectată (IX-XII) |
| `users_meta.xp_total` | XP acumulat |
| `users_meta.streak_zile` | Zile consecutive |
| `users_meta.ultima_activitate` | Data ultimei lecții finalizate |
| `insigne_utilizator` | Insignele obținute |
| `provocari_zilnice` | Provocarea zilei |
| `nivel_din_xp()` | Nivel din XP (identic cu formula din TypeScript) |
| `finalizeaza_lectie()` | Singura cale de acordare XP (RPC securizat) |
| trigger `proteja_users_meta` | Blochează falsificarea abonamentului/XP-ului |

### Verificare după rulare

```sql
select column_name from information_schema.columns
where table_name = 'users_meta' and column_name in
  ('clasa','xp_total','streak_zile','ultima_activitate');
-- trebuie să întoarcă 4 rânduri

select routine_name from information_schema.routines
where routine_name in ('finalizeaza_lectie','nivel_din_xp');
-- trebuie să întoarcă 2 rânduri
```

## 2. Variabile de environment în Vercel

Settings → **Environment Variables**. Bifează **Production + Preview + Development**
la fiecare:

| Variabilă | Unde o găsești | Secret |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | nu |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API | nu |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API | **DA** |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys | **DA** |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Webhooks → Signing secret | **DA** |
| `STRIPE_PRICE_ID_LUNAR` | Stripe → Products → Price ID (`price_…`) | nu |
| `STRIPE_PRICE_ID_ANUAL` | Stripe → Products → Price ID (`price_…`) | nu |

După ce le adaugi, trebuie **redeploy** — variabilele nu se aplică retroactiv
pe un build existent: Deployments → ultimul deployment → `⋯` → Redeploy.

## 3. Cum ajunge codul în Vercel

Nu trebuie încărcat manual. Integrarea GitHub face build automat la fiecare push:

- push pe orice branch → **Preview Deployment** (URL cu numele branch-ului)
- push pe `main` → **Producție** (domeniul principal)

URL-urile de tip `python-liceu-git-main-...` arată branch-ul `main`. Ca să vezi
modificările dintr-un branch de lucru, deschide deployment-ul acelui branch:
Vercel → Deployments → rândul cu branch-ul respectiv → Visit.

Modificările intră în producție doar la **merge pe `main`**.

## 4. Testare fără cont și fără Supabase

```bash
npm run dev
```

Deschide `http://localhost:3000/preview-dashboard` — dashboard-ul cu date
fictive (`noindex`). Util pentru verificarea interfeței.

## Note de securitate

- `SUPABASE_SERVICE_ROLE_KEY` ocolește RLS. Se folosește **doar** server-side,
  în webhook-ul Stripe. Nu îl pune niciodată într-o variabilă `NEXT_PUBLIC_*`.
- XP-ul se acordă exclusiv prin `finalizeaza_lectie()`. Trigger-ul
  `proteja_users_meta` împiedică un utilizator autentificat să-și modifice
  direct `subscription_status` (acces gratuit la conținut cu plată) sau `xp_total`.
- Răspunsurile la quiz se validează server-side, față de conținutul canonic;
  clientul nu trimite niciodată scorul.
- Dacă `Deployment Protection` (Vercel Authentication) e activ, preview-urile
  cer login Vercel — de aceea nu pot fi deschise de cineva din afara contului.
