"use client";

import { useState } from "react";
import { creeazaClientBrowser } from "@/lib/supabase/client";
import { dateAcordMarketing } from "@/lib/marketing";

/**
 * Acordul pentru emailuri cu oferte (ex. Black Friday), din pagina de cont.
 * Acoperă și conturile create cu Google sau înainte să existe căsuța de la
 * înregistrare. Fără acord, utilizatorul nu apare în lista de export.
 */
export default function AcordMarketing({ initial }: { initial: boolean }) {
  const [acord, setAcord] = useState(initial);
  const [seSalveaza, setSeSalveaza] = useState(false);
  const [eroare, setEroare] = useState<string | null>(null);

  async function schimba(nou: boolean) {
    setSeSalveaza(true);
    setEroare(null);
    try {
      const { error } = await creeazaClientBrowser().auth.updateUser({ data: dateAcordMarketing(nou) });
      if (error) throw error;
      setAcord(nou);
    } catch {
      setEroare("Nu am putut salva alegerea. Încearcă din nou.");
    } finally {
      setSeSalveaza(false);
    }
  }

  if (acord) {
    return (
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:px-8">
        <p className="text-sm text-foreground/80">
          ✓ Primești pe email ofertele și reducerile Academia Python.
        </p>
        <button
          type="button"
          onClick={() => schimba(false)}
          disabled={seSalveaza}
          className="text-sm font-semibold text-foreground/65 underline hover:text-red-600 disabled:opacity-50"
        >
          {seSalveaza ? "Se salvează..." : "Nu mai vreau emailuri cu oferte"}
        </button>
        {eroare && <p role="alert" className="w-full text-sm text-red-600">{eroare}</p>}
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm sm:px-8">
      <h2 className="text-base font-bold text-foreground">🎁 Vrei să afli primul de reduceri?</h2>
      <p className="mt-1 text-sm text-foreground/75">
        Îți trimitem pe email ofertele speciale (de exemplu, la Black Friday). Fără spam, te poți
        dezabona oricând de aici.
      </p>
      <button
        type="button"
        onClick={() => schimba(true)}
        disabled={seSalveaza}
        className="mt-4 rounded-xl bg-[#172033] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#2A3852] disabled:opacity-50"
      >
        {seSalveaza ? "Se salvează..." : "Da, trimite-mi ofertele"}
      </button>
      {eroare && <p role="alert" className="mt-2 text-sm text-red-600">{eroare}</p>}
    </div>
  );
}
