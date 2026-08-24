-- =====================================================================
-- SUPABASE / POSTGRESQL MIGRATION SCRIPT
-- Academia Python (academiapython.ro)
-- Purpose: Add daily AI rate limits counters & configure Row Level Security (RLS)
-- Run this script inside the Supabase SQL Editor (https://supabase.com)
-- =====================================================================

-- 1. ADD COLUMNS FOR DAILY AI RATE LIMITS TO users_meta TABLE
ALTER TABLE public.users_meta
ADD COLUMN IF NOT EXISTS ai_requests_today INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS last_ai_request_date VARCHAR(10) DEFAULT '';

COMMENT ON COLUMN public.users_meta.ai_requests_today IS 'Contorul zilnic de interogări AI ale utilizatorului';
COMMENT ON COLUMN public.users_meta.last_ai_request_date IS 'Data ultimei solicitări AI în format YYYY-MM-DD';

-- 2. ENABLE ROW LEVEL SECURITY (RLS) FOR CORE TABLES
ALTER TABLE public.users_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progres_lectii ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insigne_utilizator ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provocari_zilnice ENABLE ROW LEVEL SECURITY;

-- 3. CREATE RLS POLICIES FOR users_meta
-- Allow users to read and write only their own metadata profile
CREATE POLICY "Users can read their own metadata profile"
ON public.users_meta
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own metadata profile"
ON public.users_meta
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. CREATE RLS POLICIES FOR progres_lectii
-- Allow users to view and insert their own lesson progress rows
CREATE POLICY "Users can view their own lesson progress"
ON public.progres_lectii
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lesson progress"
ON public.progres_lectii
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 5. CREATE RLS POLICIES FOR insigne_utilizator
-- Allow users to view and earn their own badges
CREATE POLICY "Users can view their own badges"
ON public.insigne_utilizator
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own badges"
ON public.insigne_utilizator
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 6. CREATE RLS POLICIES FOR provocari_zilnice
-- Allow users to view and log their daily challenges completions
CREATE POLICY "Users can view their own daily challenges"
ON public.provocari_zilnice
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily challenges"
ON public.provocari_zilnice
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 7. CREATE NEWSLETTER_EMAILS TABLE
CREATE TABLE IF NOT EXISTS public.newsletter_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  abonat_la TIMESTAMPTZ DEFAULT now() NOT NULL,
  activ BOOLEAN DEFAULT true NOT NULL
);

COMMENT ON TABLE public.newsletter_emails IS 'Adresele de email abonate la newsletter-ul Academia Python';

-- Activare RLS pe tabela de newsletter
ALTER TABLE public.newsletter_emails ENABLE ROW LEVEL SECURITY;

-- Oricine poate face INSERT (abonare din formularul public)
CREATE POLICY "Oricine poate adauga un email la newsletter"
ON public.newsletter_emails
FOR INSERT
WITH CHECK (true);

-- Doar service_role poate citi toata lista (pentru trimitere email)
CREATE POLICY "Doar adminii pot citi lista newsletter"
ON public.newsletter_emails
FOR SELECT
USING (auth.role() = 'service_role');

-- 8. EXTEND PROGRES_LECTII WITH TIP AND STARS COLUMNS FOR KIDS MODULE
ALTER TABLE public.progres_lectii
ADD COLUMN IF NOT EXISTS tip TEXT DEFAULT 'lesson' NOT NULL,
ADD COLUMN IF NOT EXISTS stars INTEGER DEFAULT 0 NOT NULL;

COMMENT ON COLUMN public.progres_lectii.tip IS 'Tipul progresului: lesson (liceu) sau kids_level (ciclul primar)';
COMMENT ON COLUMN public.progres_lectii.stars IS 'Numarul de stele aurii obtinute (1-3) pentru kids_level';

