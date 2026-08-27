"use server";

import { creeazaClientServer } from "@/lib/supabase/server";
import { creeazaClientAdmin } from "@/lib/supabase/admin";
import { getUtilizatorCurent } from "@/lib/subscription";
import { toateLectiile } from "@/lib/content";

import { provocareaZilei, getProgresUtilizator } from "@/lib/progres";

export async function valideazaProvocareZilnica(
  opțiuneSelectată: number
): Promise<{ ok: boolean; mesaj: string; xpAdăugat?: number }> {
  const { user, meta } = await getUtilizatorCurent();
  if (!user || !meta) {
    return { ok: false, mesaj: "Trebuie să fii autentificat pentru a primi XP." };
  }

  // Preluăm progresul utilizatorului pe server pentru a calcula provocarea zilei determinist
  const metaProgres = await getProgresUtilizator(user.id);
  const lectiiFinalizate = metaProgres?.lectiiFinalizate ?? [];
  const provocare = provocareaZilei(lectiiFinalizate);

  if (!provocare) {
    return { ok: false, mesaj: "Nu ai nicio provocare disponibilă astăzi." };
  }

  const răspunsCorect = provocare.intrebare.corect;
  const xpRecompensă = 50; // Recompensă fixă pe server

  if (opțiuneSelectată !== răspunsCorect) {
    return { ok: false, mesaj: "Răspuns greșit! Mai încearcă, citește cu atenție enunțul." };
  }

  const supabase = await creeazaClientServer();
  const azi = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // Verificăm dacă provocarea a fost deja rezolvată azi
  const { data: existenta } = await supabase
    .from("provocari_zilnice")
    .select("finalizata")
    .eq("user_id", user.id)
    .eq("data", azi)
    .maybeSingle();

  if (existenta && existenta.finalizata) {
    return { ok: false, mesaj: "Ai rezolvat deja provocarea de astăzi!" };
  }

  // Salvăm rezolvarea în DB
  const { error: errorProvocare } = await supabase
    .from("provocari_zilnice")
    .insert({
      user_id: user.id,
      data: azi,
      finalizata: true,
      xp_castigat: xpRecompensă,
    });

  if (errorProvocare) {
    console.error("Eroare salvare provocare:", errorProvocare);
    return { ok: false, mesaj: "A apărut o eroare la salvarea progresului." };
  }

  // Actualizăm XP în users_meta și data ultimei activități
  const noulXp = meta.xpTotal + xpRecompensă;
  
  // Calculăm dacă menținem/creștem streak-ul
  const aziDate = new Date();
  let noulStreak = meta.streakZile;
  if (!meta.streakZile) {
    noulStreak = 1;
  } else {
    // Dacă ultima activitate a fost ieri, incrementăm. Dacă a fost azi, rămâne la fel.
    // Altfel (mai veche), se resetează la 1.
    const { data: userMeta } = await supabase
      .from("users_meta")
      .select("ultima_activitate")
      .eq("user_id", user.id)
      .maybeSingle();
    
    if (userMeta && userMeta.ultima_activitate) {
      const ultima = new Date(userMeta.ultima_activitate + "T00:00:00");
      const diff = Math.floor(
        (Date.UTC(aziDate.getFullYear(), aziDate.getMonth(), aziDate.getDate()) -
          Date.UTC(ultima.getFullYear(), ultima.getMonth(), ultima.getDate())) /
          86400000
      );
      if (diff === 1) {
        noulStreak += 1;
      } else if (diff > 1) {
        noulStreak = 1;
      }
    }
  }

  const { error: errorMeta } = await supabase
    .from("users_meta")
    .update({
      xp_total: noulXp,
      streak_zile: noulStreak,
      ultima_activitate: azi,
    })
    .eq("user_id", user.id);

  if (errorMeta) {
    console.error("Eroare actualizare meta XP:", errorMeta);
    return { ok: false, mesaj: "Rezolvare salvată, dar XP-ul nu a putut fi actualizat." };
  }

  return { 
    ok: true, 
    mesaj: `Corect! Felicitări, ai câștigat +${xpRecompensă} XP 💎 și activitatea ta a fost înregistrată.`,
    xpAdăugat: xpRecompensă 
  };
}

export async function valideazaRecapitulareSpatiata(
  sublectieSlug: string,
  opțiuneSelectată: number
): Promise<{ ok: boolean; mesaj: string; xpAdăugat?: number }> {
  const { user } = await getUtilizatorCurent();
  if (!user) {
    return { ok: false, mesaj: "Trebuie să fii autentificat pentru a efectua recapitularea." };
  }

  // Nu ne bazăm pe client să ne zică ce e corect — determinăm răspunsul corect
  // pe server, din aceeași sursă folosită de getRecapitulareSpatiata pentru a
  // construi întrebarea (altfel oricine poate forța XP din consolă).
  const lectieGasita = toateLectiile.find(
    (l) => l.lectie_slug === sublectieSlug && l.quiz?.length
  );
  const răspunsCorect = lectieGasita?.quiz?.[0]?.corect;

  if (răspunsCorect === undefined) {
    return { ok: false, mesaj: "Această recapitulare nu mai este disponibilă." };
  }

  // Strat 3: verificăm, pe server, că sublecția cerută e chiar una scadentă
  // AZI pentru utilizatorul curent — aceeași sursă de adevăr (aceeași
  // interogare) ca getRecapitulareSpatiata din src/lib/progres.ts. Fără
  // asta, un utilizator ar putea "recapitula" (și lua XP pentru) orice
  // sublecție cu quiz, nu doar cea programată azi. Respingem silențios, cu
  // același mesaj generic ca la un răspuns greșit — nu dăm detalii care ar
  // confirma unui atacator că structura verificării există.
  const supabase = await creeazaClientServer();
  const azi = new Date().toISOString().split("T")[0];

  const { data: lectiiScadente } = await supabase
    .from("progres_lectii")
    .select("lectie_slug")
    .eq("user_id", user.id)
    .lte("urmatoarea_recapitulare", new Date().toISOString())
    .order("urmatoarea_recapitulare", { ascending: true })
    .limit(5);

  const { data: recAzi } = await supabase
    .from("recapitulari_zilnice")
    .select("sublectie_slug")
    .eq("user_id", user.id)
    .eq("data", azi);

  const rezolvateAzi = new Set((recAzi ?? []).map((r) => r.sublectie_slug));
  const scadenteAzi = new Set(
    (lectiiScadente ?? [])
      .map((l) => l.lectie_slug)
      .filter((slug) => !rezolvateAzi.has(slug))
  );

  const mesajRespingere =
    "Răspuns greșit! Lecția a fost reprogramată mai devreme pentru a o fixa mai bine.";

  if (!scadenteAzi.has(sublectieSlug)) {
    return { ok: false, mesaj: mesajRespingere };
  }

  const esteCorect = opțiuneSelectată === răspunsCorect;

  // Strat 1: RPC-ul care scrie XP se apelează EXCLUSIV cu service role,
  // dintr-un context strict server-side — niciodată din browser. Funcția SQL
  // are acum EXECUTE revocat pentru authenticated/anon (vezi
  // supabase/migrare-securizare-recapitulare.sql), deci nu mai poate fi
  // apelată direct din consola browserului, indiferent de sesiunea
  // utilizatorului. Identitatea utilizatorului se transmite explicit ca
  // parametru, pentru că service role nu are auth.uid() (nu are sesiune).
  const admin = creeazaClientAdmin();
  const { error } = await admin.rpc("salveaza_recapitulare_spatiata", {
    p_user_id: user.id,
    p_sublectie_slug: sublectieSlug,
    p_corect: esteCorect,
  });

  if (error) {
    console.error("Eroare la salvarea recapitulării spațiate:", error);
    return { ok: false, mesaj: "A apărut o eroare la salvarea progresului." };
  }

  if (!esteCorect) {
    return { ok: false, mesaj: mesajRespingere };
  }

  return {
    ok: true,
    mesaj: "Excelent! Ai revizuit cu succes această lecție și ai obținut +20 XP! 📌",
    xpAdăugat: 20,
  };
}
