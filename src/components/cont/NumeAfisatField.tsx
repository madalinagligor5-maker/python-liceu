"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { actualizeazaNumeAfisat } from "@/app/actions/profil";

export default function NumeAfisatField({ numeInitial }: { numeInitial: string | null }) {
  const router = useRouter();
  const [nume, setNume] = useState(numeInitial ?? "");
  const [salvat, setSalvat] = useState(false);
  const [sePending, startTransition] = useTransition();

  function salveaza(e: React.FormEvent) {
    e.preventDefault();
    setSalvat(false);
    startTransition(async () => {
      const rez = await actualizeazaNumeAfisat(nume);
      if (rez.ok) {
        setSalvat(true);
        router.refresh();
      }
    });
  }

  return (
    <div className="mt-8 rounded-3xl border border-black/5 bg-white p-6 sm:p-8 shadow-sm">
      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
        <span>🪪</span> Numele afișat
      </h2>
      <p className="text-sm text-foreground/50 mt-1">
        Dacă te asociezi cu o clasă, profesorul vede acest nume — niciodată emailul tău.
      </p>
      <form onSubmit={salveaza} className="mt-3 flex flex-wrap gap-2">
        <input
          type="text"
          value={nume}
          onChange={(e) => setNume(e.target.value)}
          maxLength={60}
          placeholder="ex. Alex P."
          className="min-w-0 flex-1 rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
        />
        <button
          type="submit"
          disabled={sePending}
          className="rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-brand hover:text-brand disabled:opacity-50"
        >
          {sePending ? "Se salvează..." : "Salvează"}
        </button>
      </form>
      {salvat && <p className="mt-2 text-sm text-success">Salvat.</p>}
    </div>
  );
}
