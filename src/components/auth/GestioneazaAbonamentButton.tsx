"use client";

import { useState } from "react";

export default function GestioneazaAbonamentButton() {
  const [seIncarca, setSeIncarca] = useState(false);
  const [eroare, setEroare] = useState<string | null>(null);

  async function handleClick() {
    setSeIncarca(true);
    setEroare(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setEroare(data.error || "Nu am putut deschide portalul de facturare.");
        setSeIncarca(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setEroare("A apărut o eroare de rețea. Încearcă din nou.");
      setSeIncarca(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={seIncarca}
        className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-50"
      >
        {seIncarca ? "Se deschide..." : "Gestionează abonamentul"}
      </button>
      {eroare && <p className="mt-2 text-sm text-red-600">{eroare}</p>}
    </div>
  );
}
