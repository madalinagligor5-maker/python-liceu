import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { creeazaUtilizatorTest, stergeUtilizatorTest } from "./helpers/auth";

/**
 * Verifică exact scenariul de atac raportat: un utilizator autentificat
 * deschide consola browserului și apelează direct RPC-ul Supabase
 * `salveaza_recapitulare_spatiata`, cu `p_corect: true`, pentru un slug
 * arbitrar — ocolind complet acțiunea Next.js `valideazaRecapitulareSpatiata`
 * (care calculează corectitudinea pe server).
 *
 * Simulăm asta cu clientul Supabase al ANON KEY (exact ce are la dispoziție
 * oricine deschide devtools pe site), autentificat cu o sesiune reală de
 * utilizator — nu prin acțiunea Next.js.
 *
 * Criteriul de acceptare: apelul RPC direct trebuie respins (funcția nu mai
 * e apelabilă cu semnătura veche / EXECUTE e revocat pentru "authenticated"),
 * iar XP-ul utilizatorului rămâne neschimbat.
 */
test.describe("Securitate: salveaza_recapitulare_spatiata nu e apelabil direct din browser", () => {
  test("apel RPC direct (p_corect: true, slug arbitrar) e respins — niciun XP nemeritat", async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    test.skip(
      !url || !anonKey || !serviceKey,
      "Lipsesc credențialele Supabase din .env.local — testul are nevoie de un proiect real."
    );

    const utilizator = await creeazaUtilizatorTest("securitate-recap");
    try {
      const admin = createClient(url!, serviceKey!, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      const inainte = await admin
        .from("users_meta")
        .select("xp_total")
        .eq("user_id", utilizator.id)
        .maybeSingle();
      const xpInainte = inainte.data?.xp_total ?? 0;

      // Clientul "atacatorului": cheia publică (anon), cu sesiunea reală a
      // unui utilizator autentificat — exact ce ar rula în consola
      // browserului pentru orice elev logat pe site.
      const clientAtacator = createClient(url!, anonKey!, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { error: loginErr } = await clientAtacator.auth.signInWithPassword({
        email: utilizator.email,
        password: utilizator.parola,
      });
      expect(loginErr).toBeNull();

      // Atacul exact: apel RPC direct, fără să treacă prin acțiunea Next.js.
      const { error: rpcErr } = await clientAtacator.rpc("salveaza_recapitulare_spatiata", {
        p_sublectie_slug: "slug-inventat-de-atacator-" + Date.now(),
        p_corect: true,
      });

      // Un rpc() reușit ar întoarce error === null. Trebuie respins.
      expect(rpcErr).not.toBeNull();

      const dupa = await admin
        .from("users_meta")
        .select("xp_total")
        .eq("user_id", utilizator.id)
        .maybeSingle();
      const xpDupa = dupa.data?.xp_total ?? 0;

      expect(xpDupa).toBe(xpInainte);
    } finally {
      await stergeUtilizatorTest(utilizator.id);
    }
  });
});
