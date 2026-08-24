"use server";

import { creeazaClientServer } from "@/lib/supabase/server";
import { getUtilizatorCurent } from "@/lib/subscription";

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
