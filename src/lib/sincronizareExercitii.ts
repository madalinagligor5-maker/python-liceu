"use client";

import { citesteExercitiiRezolvateCont, salveazaExercitiiRezolvate } from "@/app/actions/exercitii";
import { CHEIE_EXERCITII, citesteExercitiiRezolvate, EVENIMENT_PROGRES } from "@/lib/progresLocal";

/**
 * Sincronizează exercițiile rezolvate între browser și cont (doar pentru
 * utilizatori autentificați), o singură dată pe încărcare de pagină:
 *  - cele din cont se adaugă la cele din browser (alt dispozitiv, date șterse);
 *  - cele rezolvate doar în browser (ex. înainte de autentificare) urcă în cont.
 * Orice eroare (fără rețea, migrare nerulată) lasă progresul local neatins.
 */
let sincronizare: Promise<void> | null = null;

export function sincronizeazaExercitiiCuContul(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (!sincronizare) {
    sincronizare = (async () => {
      try {
        const dinCont = new Set(await citesteExercitiiRezolvateCont());
        const local = citesteExercitiiRezolvate();
        const lipsaLocal = [...dinCont].filter((id) => !local.has(id));
        if (lipsaLocal.length) {
          const unite = new Set([...local, ...dinCont]);
          try {
            window.localStorage.setItem(CHEIE_EXERCITII, JSON.stringify([...unite]));
          } catch {
            // localStorage indisponibil — rămânem cu ce avem.
          }
          window.dispatchEvent(new Event(EVENIMENT_PROGRES));
        }
        const lipsaCont = [...local].filter((id) => !dinCont.has(id));
        if (lipsaCont.length) await salveazaExercitiiRezolvate(lipsaCont);
      } catch {
        sincronizare = null; // se reîncearcă la următoarea pagină
      }
    })();
  }
  return sincronizare;
}

/** Trimite în cont un exercițiu tocmai rezolvat (fără să aștepte răspunsul). */
export function salveazaExercitiuInCont(id: string): void {
  salveazaExercitiiRezolvate([id]).catch(() => {
    // Rămâne salvat în browser; urcă la următoarea sincronizare.
  });
}
