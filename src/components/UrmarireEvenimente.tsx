"use client";

import { useEffect } from "react";
import { trimiteEveniment, trimiteOData } from "@/lib/analytics";

/**
 * Ascultă global clicurile pe elemente marcate cu `data-eveniment` (așa pot
 * fi măsurate și butoanele din componentele de server) și înregistrează
 * întoarcerea din Stripe Checkout (`/cont?checkout=success`) ca probă pornită.
 */
export default function UrmarireEvenimente() {
  useEffect(() => {
    const laClick = (e: MouseEvent) => {
      const tinta = (e.target as Element | null)?.closest?.("[data-eveniment]");
      if (!(tinta instanceof HTMLElement)) return;
      const nume = tinta.dataset.eveniment;
      if (!nume) return;
      const parametri: Record<string, string> = {};
      for (const [cheie, valoare] of Object.entries(tinta.dataset)) {
        if (cheie.startsWith("ev") && cheie !== "eveniment" && valoare) {
          parametri[cheie.slice(2).toLowerCase()] = valoare;
        }
      }
      trimiteEveniment(nume, parametri);
    };
    document.addEventListener("click", laClick, { capture: true });

    const url = new URL(window.location.href);
    if (url.pathname === "/cont" && url.searchParams.get("checkout") === "success") {
      trimiteOData("proba_pornita", "proba_pornita", {}, "sesiune");
    }

    return () => document.removeEventListener("click", laClick, { capture: true });
  }, []);
  return null;
}
